import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: bigint;
    manufacturer: string;
    inStock: boolean;
    packSize: string;
    name: string;
    description: string;
    strength: string;
    brand: string;
    priceEur: number;
    packaging: string;
    image1: string;
    image2: string;
    image3: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(product: Product): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserRole(): Promise<UserRole>;
    getProduct(id: bigint): Promise<Product>;
    getProductsByBrand(brand: string): Promise<Array<Product>>;
    isCallerAdmin(): Promise<boolean>;
    seedSampleProducts(): Promise<void>;
    updateProduct(product: Product): Promise<void>;
}
