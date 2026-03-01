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
    fileBlob?: ExternalBlob;
    description: string;
    jurisdiction: string;
    category: IPCategory;
    registrationDate: bigint;
}
export type TokenBalance = bigint;
export interface UserProfile {
    name: string;
    email?: string;
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
     * / Burn IPGT tokens from the caller's balance permanently.
     * / Requires the caller to have at least the #user role.
     */
    burnTokens(amount: TokenBalance): Promise<void>;
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
    /**
     * / Query any principal's IPGT balance. Callable without authentication.
     */
    getBalance(user: Principal): Promise<TokenBalance>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    /**
     * / Returns the current circulating supply (initial supply minus burned).
     */
    getCirculatingSupply(): Promise<bigint>;
    /**
     * / Retrieve a single IP record by its unique ID.
     */
    getIP(id: bigint): Promise<IPRecord | null>;
    /**
     * / Returns the total number of IPGT tokens burned so far.
     */
    getTotalBurnedTokens(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeTreasury(adminPrincipal: Principal): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    /**
     * / Register a new IP record. Burns REGISTRATION_BURN_AMOUNT IPGT from the
     * / caller's balance. Requires the caller to have at least the #user role
     * / and hold at least MINIMUM_BALANCE_TO_REGISTER tokens.
     */
    registerIP(title: string, description: string, category: IPCategory, documentHash: Uint8Array, fileBlob: ExternalBlob | null, jurisdiction: string): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    /**
     * / Search IPs whose title contains the given keyword (case-sensitive).
     */
    searchByTitle(keyword: string): Promise<Array<IPRecord>>;
    /**
     * / Transfer IPGT tokens from the caller to another principal.
     * / Requires the caller to have at least the #user role.
     */
    transferTokens(to: Principal, amount: TokenBalance): Promise<void>;
}
