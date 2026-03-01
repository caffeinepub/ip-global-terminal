import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Blob "mo:core/Blob";
import Storage "blob-storage/Storage";

module {
  type OldUserProfile = {
    name : Text;
    organisation : Text;
    email : ?Text;
  };

  type OldIPCategory = {
    #patent;
    #trademark;
    #copyright;
  };

  type OldIPRecord = {
    id : Nat;
    title : Text;
    description : Text;
    category : OldIPCategory;
    owner : Principal;
    registrationDate : Int;
    documentHash : Blob;
    fileBlob : ?Storage.ExternalBlob;
    jurisdiction : Text;
  };

  // Old actor's full persistent state
  type OldActor = {
    ipRecords : Map.Map<Nat, OldIPRecord>;
    nextIpId : Nat;
    userProfiles : Map.Map<Principal, OldUserProfile>;

    // Deleted fields (okay to ignore in migration)
    ledger : Map.Map<Principal, Nat64>;
    treasury : Principal;
    totalBurnedTokens : Nat;
    REGISTRATION_BURN_AMOUNT : Nat64;
    MINIMUM_BALANCE_TO_REGISTER : Nat64;
    INITIAL_SUPPLY : Nat64;
  };

  type NewUserProfile = {
    name : Text;
    organisation : Text;
    email : ?Text;
  };

  type NewIPCategory = {
    #patent;
    #trademark;
    #copyright;
  };

  type NewIPRecord = {
    id : Nat;
    title : Text;
    description : Text;
    category : NewIPCategory;
    owner : Principal;
    registrationDate : Int;
    documentHash : Blob;
    fileBlob : ?Storage.ExternalBlob;
    jurisdiction : Text;
  };

  type NewActor = {
    ipRecords : Map.Map<Nat, NewIPRecord>;
    nextIpId : Nat;
    userProfiles : Map.Map<Principal, NewUserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    {
      ipRecords = old.ipRecords;
      nextIpId = old.nextIpId;
      userProfiles = old.userProfiles;
    };
  };
};
