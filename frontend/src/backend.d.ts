import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface IPRecord {
    id: bigint;
    documentHash: Uint8Array;
    title: string;
    owner: Principal;
    hash: string;
    fileBlob?: ExternalBlob;
    description: string;
    jurisdiction: string;
    category: IPCategory;
    registrationDate: bigint;
}
export interface UserProfile {
    name: string;
    email?: string;
    organisation: string;
}
export enum IPCategory {
    trademark = "trademark",
    copyright = "copyright",
    patent = "patent"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    /**
     * / Filter IPs by category.
     */
    filterByCategory(category: IPCategory): Promise<Array<IPRecord>>;
    /**
     * / Filter IPs by jurisdiction.
     */
    filterByJurisdiction(jurisdiction: string): Promise<Array<IPRecord>>;
    /**
     * / Filter IPs by owner principal.
     */
    filterByOwner(owner: Principal): Promise<Array<IPRecord>>;
    /**
     * / List all registered IPs (paginated). Pass offset=0 and limit=50 for the
     * / first page.
     */
    getAllIPs(offset: bigint, limit: bigint): Promise<Array<IPRecord>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    /**
     * / Retrieve a single IP record by its unique ID.
     */
    getIP(id: bigint): Promise<IPRecord | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerIP(title: string, description: string, category: IPCategory, documentHash: Uint8Array, fileBlob: ExternalBlob | null, jurisdiction: string, hash: string): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    /**
     * / Search IPs whose title contains the given keyword (case-sensitive).
     */
    searchByTitle(keyword: string): Promise<Array<IPRecord>>;
    /**
     * / Search IPs by title or hash (case-insensitive for titles, case-insensitive for hashes).
     */
    searchByTitleOrHash(search: string): Promise<Array<IPRecord>>;
}
