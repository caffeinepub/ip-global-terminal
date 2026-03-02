import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Storage "blob-storage/Storage";
import Principal "mo:core/Principal";

module {
  type IPCategory = {
    #patent;
    #trademark;
    #copyright;
  };

  type IPRecord = {
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

  type Actor = {
    ipRecords : Map.Map<Nat, IPRecord>;
    nextIpId : Nat;
  };

  public func run(old : Actor) : Actor {
    old;
  };
};
