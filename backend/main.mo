import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Blob "mo:core/Blob";
import Time "mo:core/Time";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ── User profile ──────────────────────────────────────────────────────────

  public type UserProfile = {
    name : Text;
    organisation : Text;
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
    hash : Text;
  };

  // ── State ─────────────────────────────────────────────────────────────────

  let ipRecords = Map.empty<Nat, IPRecord>();
  var nextIpId = 0;

  // ── IP registration (authentication required) ─────────────────────────────

  public shared ({ caller }) func registerIP(
    title : Text,
    description : Text,
    category : IPCategory,
    documentHash : Blob,
    fileBlob : ?Storage.ExternalBlob,
    jurisdiction : Text,
    hash : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can register IP");
    };

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
      hash;
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

  /// Search IPs by title or hash (case-insensitive for titles, case-insensitive for hashes).
  public query func searchByTitleOrHash(search : Text) : async [IPRecord] {
    let lowerSearch = search.toLower();
    ipRecords.values().toArray().filter(
      func(record : IPRecord) : Bool {
        record.title.toLower().contains(#text(lowerSearch)) or
        record.hash.contains(#text(lowerSearch));
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
