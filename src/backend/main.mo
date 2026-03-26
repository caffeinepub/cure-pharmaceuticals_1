import Map "mo:core/Map";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Enable data migration on upgrade

actor {
  module Product {
    public func compare(a : Product, b : Product) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    brand : Text;
    category : Text;
    strength : Text;
    packaging : Text;
    packSize : Text;
    manufacturer : Text;
    priceEur : Float;
    inStock : Bool;
    image1 : Text;
    image2 : Text;
    image3 : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  let products = Map.empty<Nat, Product>();
  var nextProductId = 1;
  let accessControlState = AccessControl.initState();
  let userProfiles = Map.empty<Principal, UserProfile>();

  include MixinAuthorization(accessControlState);

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
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

  public shared ({ caller = _ }) func addProduct(product : Product) : async Nat {
    if (product.name.size() == 0) { Runtime.trap("Product name cannot be empty.") };
    let id = nextProductId;
    let newProduct : Product = {
      product with
      id;
    };
    products.add(id, newProduct);
    nextProductId += 1;
    id;
  };

  public shared ({ caller = _ }) func updateProduct(product : Product) : async () {
    switch (products.get(product.id)) {
      case (null) { Runtime.trap("Product does not exist.") };
      case (?original) {
        products.add(product.id, { product with id = original.id });
      };
    };
  };

  public shared ({ caller = _ }) func deleteProduct(id : Nat) : async () {
    if (not products.containsKey(id)) {
      Runtime.trap("Product does not exist.");
    };
    products.remove(id);
  };

  public query ({ caller = _ }) func getProduct(id : Nat) : async Product {
    switch (products.get(id)) {
      case (?product) { product };
      case (null) { Runtime.trap("Product does not exist.") };
    };
  };

  public query ({ caller = _ }) func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query ({ caller = _ }) func getProductsByBrand(brand : Text) : async [Product] {
    products.values().toArray().filter(func(p) { Text.equal(p.brand, brand) });
  };

  public query ({ caller = _ }) func getProductsByCategory(category : Text) : async [Product] {
    products.values().toArray().filter(func(p) { Text.equal(p.category, category) });
  };

  public shared ({ caller = _ }) func seedSampleProducts() : async () {
    if (products.size() > 0) { Runtime.trap("Products already exist.") };
    ignore await addProduct({
      id = 0;
      name = "CureRelief 500mg";
      description = "Fast pain relief tablets.";
      brand = "Cure";
      category = "Pain Relief";
      strength = "500mg";
      packaging = "Blister pack";
      packSize = "20 tablets";
      manufacturer = "Cure Pharmaceuticals";
      priceEur = 7.99;
      inStock = true;
      image1 = "";
      image2 = "";
      image3 = "";
    });
    ignore await addProduct({
      id = 0;
      name = "CureCalm 20mg";
      description = "Effective anxiety relief tablets.";
      brand = "Cure";
      category = "Mental Health";
      strength = "20mg";
      packaging = "Blister pack";
      packSize = "10 tablets";
      manufacturer = "Cure Pharmaceuticals";
      priceEur = 9.99;
      inStock = true;
      image1 = "";
      image2 = "";
      image3 = "";
    });
  };
};
