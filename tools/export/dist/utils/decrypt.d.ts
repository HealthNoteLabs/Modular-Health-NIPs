import { NostrEvent } from '../types.js';
export declare function decryptEvents(events: NostrEvent[], privkeyHex: string): Promise<void>;
