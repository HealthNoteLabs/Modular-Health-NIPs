import { NostrEvent } from '../types.js';
export interface BlossomPackage {
    version: string;
    exported_at: string;
    events: NostrEvent[];
}
export declare function writeBlossom(events: NostrEvent[], outPath: string): Promise<void>;
