import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Nat64 "mo:core/Nat64";
import VarArray "mo:core/VarArray";
import Blob "mo:core/Blob";
import Time "mo:core/Time";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ── User profile ──────────────────────────────────────────────────────────

  public type UserProfile = {
    name : Text;
    email : ?Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ── Types ─────────────────────────────────────────────────────────────────

  public type IPCategory = {
    #patent;
    #trademark;
    #copyright;
  };

  public type IPRecord = {
    id : Nat;
    title : Text;
    description : Text;
    category : IPCategory;
    owner : Principal;
    registrationDate : Int;
    documentHash : Blob;
    fileBlob : ?Storage.ExternalBlob;
    jurisdiction : Text;
  };

  public type TokenBalance = Nat64;

  // ── Constants ─────────────────────────────────────────────────────────────

  let INITIAL_SUPPLY : TokenBalance = 100_000_000_000;
  let REGISTRATION_BURN_AMOUNT : TokenBalance = 2; // 0.02 IPGT (2 base units)
  let MINIMUM_BALANCE_TO_REGISTER : TokenBalance = 2; // 0.02 IPGT (2 base units)

  // ── State ─────────────────────────────────────────────────────────────────

  let ipRecords = Map.empty<Nat, IPRecord>();
  let ledger = Map.empty<Principal, TokenBalance>();
  var treasury : Principal = Principal.fromText("2vxsx-fae");
  var nextIpId = 0;
  var totalBurnedTokens : Nat = 0;

  // ── Treasury / Admin ──────────────────────────────────────────────────────

  public shared ({ caller }) func initializeTreasury(adminPrincipal : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can initialize the treasury");
    };
    treasury := adminPrincipal;
    let initialSupply : TokenBalance = INITIAL_SUPPLY;
    ledger.add(adminPrincipal, initialSupply);
  };

  // ── Token ledger ──────────────────────────────────────────────────────────

  /// Query any principal's IPGT balance. Callable without authentication.
  public query func getBalance(user : Principal) : async TokenBalance {
    getBalanceInternal(user);
  };

  /// Transfer IPGT tokens from the caller to another principal.
  /// Requires the caller to have at least the #user role.
  public shared ({ caller }) func transferTokens(to : Principal, amount : TokenBalance) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can transfer tokens");
    };
    if (amount == 0) {
      Runtime.trap("Transfer amount must be greater than zero");
    };
    let callerBalance = getBalanceInternal(caller);
    if (callerBalance < amount) {
      Runtime.trap("Insufficient balance");
    };
    ledger.add(caller, callerBalance - amount);
    ledger.add(to, getBalanceInternal(to) + amount);
  };

  /// Burn IPGT tokens from the caller's balance permanently.
  /// Requires the caller to have at least the #user role.
  public shared ({ caller }) func burnTokens(amount : TokenBalance) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can burn tokens");
    };
    performBurn(caller, amount);
  };

  func getBalanceInternal(user : Principal) : TokenBalance {
    switch (ledger.get(user)) {
      case (?balance) { balance };
      case (null) { 0 };
    };
  };

  func performBurn(user : Principal, amount : TokenBalance) {
    let balance = getBalanceInternal(user);
    if (balance < amount) {
      Runtime.trap("Insufficient balance to burn tokens");
    };
    ledger.add(user, balance - amount);
    totalBurnedTokens += amount.toNat();
  };

  /// Returns the total number of IPGT tokens burned so far.
  public query func getTotalBurnedTokens() : async Nat {
    totalBurnedTokens;
  };

  /// Returns the current circulating supply (initial supply minus burned).
  public query func getCirculatingSupply() : async Nat {
    INITIAL_SUPPLY.toNat() - totalBurnedTokens;
  };

  // ── IP registration ───────────────────────────────────────────────────────

  /// Register a new IP record. Burns REGISTRATION_BURN_AMOUNT IPGT from the
  /// caller's balance. Requires the caller to have at least the #user role
  /// and hold at least MINIMUM_BALANCE_TO_REGISTER tokens.
  public shared ({ caller }) func registerIP(
    title : Text,
    description : Text,
    category : IPCategory,
    documentHash : Blob,
    fileBlob : ?Storage.ExternalBlob,
    jurisdiction : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can register IP");
    };

    let callerBalance = getBalanceInternal(caller);
    if (callerBalance < MINIMUM_BALANCE_TO_REGISTER) {
      Runtime.trap("Insufficient IPGT tokens to register IP");
    };

    // Burn the registration fee
    performBurn(caller, REGISTRATION_BURN_AMOUNT);

    let newIpId = nextIpId;
    let record : IPRecord = {
      id = newIpId;
      title;
      description;
      category;
      owner = caller;
      registrationDate = Time.now();
      documentHash;
      fileBlob;
      jurisdiction;
    };

    ipRecords.add(newIpId, record);
    nextIpId += 1;

    newIpId;
  };

  // ── IP query layer (no authentication required) ───────────────────────────

  /// Retrieve a single IP record by its unique ID.
  public query func getIP(id : Nat) : async ?IPRecord {
    ipRecords.get(id);
  };

  /// List all registered IPs (paginated). Pass offset=0 and limit=50 for the
  /// first page.
  public query func getAllIPs(offset : Nat, limit : Nat) : async [IPRecord] {
    let all = ipRecords.values().toArray();
    let size = all.size();
    if (offset >= size) { return [] };
    let end = if (offset + limit > size) { size } else { offset + limit };
    Array.tabulate<IPRecord>(end - offset, func(i) { all[offset + i] });
  };

  /// Search IPs whose title contains the given keyword (case-sensitive).
  public query func searchByTitle(keyword : Text) : async [IPRecord] {
    ipRecords.values().toArray().filter(
      func(record : IPRecord) : Bool {
        record.title.contains(#text(keyword));
      }
    );
  };

  /// Filter IPs by category.
  public query func filterByCategory(category : IPCategory) : async [IPRecord] {
    ipRecords.values().toArray().filter(
      func(record : IPRecord) : Bool { record.category == category }
    );
  };

  /// Filter IPs by jurisdiction.
  public query func filterByJurisdiction(jurisdiction : Text) : async [IPRecord] {
    ipRecords.values().toArray().filter(
      func(record : IPRecord) : Bool { record.jurisdiction == jurisdiction }
    );
  };

  /// Filter IPs by owner principal.
  public query func filterByOwner(owner : Principal) : async [IPRecord] {
    ipRecords.values().toArray().filter(
      func(record : IPRecord) : Bool { record.owner == owner }
    );
  };
};
