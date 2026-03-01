import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  // The old user profile type.
  type OldUserProfile = {
    name : Text;
    email : ?Text;
  };

  // The old actor state.
  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  // The new user profile type with organisation.
  type NewUserProfile = {
    name : Text;
    organisation : Text;
    email : ?Text;
  };

  // The new actor state.
  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_p, oldUserProfile) {
        { oldUserProfile with organisation = "" };
      }
    );
    { userProfiles = newUserProfiles };
  };
};
