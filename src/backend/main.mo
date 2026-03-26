import Map "mo:core/Map";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let products = Map.empty<Nat, Product>();
  var nextProductId = 1;

  module Product {
    public func compare(a : Product, b : Product) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  public type Product = {
    id : Nat;
    name : Text;
    brand : Text;
    strength : Text;
    packaging : Text;
    packSize : Text;
    manufacturer : Text;
    priceEur : Float;
    image1 : Text;
    image2 : Text;
    image3 : Text;
    description : Text;
    inStock : Bool;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public shared func addProduct(product : Product) : async Nat {
    let id = nextProductId;
    nextProductId += 1;
    let newProduct : Product = { product with id };
    products.add(id, newProduct);
    id;
  };

  public shared func updateProduct(product : Product) : async () {
    switch (products.get(product.id)) {
      case (null) { Runtime.trap("Product does not exist.") };
      case (?original) {
        products.add(product.id, { product with id = original.id });
      };
    };
  };

  public shared func deleteProduct(id : Nat) : async () {
    if (not products.containsKey(id)) {
      Runtime.trap("Product does not exist.");
    };
    products.remove(id);
  };

  public query func getProduct(id : Nat) : async Product {
    switch (products.get(id)) {
      case (?product) { product };
      case (null) { Runtime.trap("Product does not exist.") };
    };
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query func getProductsByBrand(brand : Text) : async [Product] {
    products.values().toArray().filter(func(p) { Text.equal(p.brand, brand) });
  };

  public shared func seedSampleProducts() : async () {
    if (products.size() > 0) { Runtime.trap("Products already exist.") };
    ignore await addProduct({ id = 0; name = "Relief 500mg"; brand = "Cure"; strength = "500mg"; packaging = "Blister pack"; packSize = "20 tablets"; manufacturer = "Cure Pharmaceuticals"; priceEur = 7.99; image1 = ""; image2 = ""; image3 = ""; description = "Fast pain relief tablets."; inStock = true });
    ignore await addProduct({ id = 0; name = "CureCalm 20mg"; brand = "Cure"; strength = "20mg"; packaging = "Blister pack"; packSize = "10 tablets"; manufacturer = "Cure Pharmaceuticals"; priceEur = 9.99; image1 = ""; image2 = ""; image3 = ""; description = "Effective anxiety relief tablets."; inStock = true });
  };
};
