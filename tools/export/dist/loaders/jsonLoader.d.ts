import { NostrEvent } from '../types.js';
/**
 * Load events from a directory containing .json files. Each file may contain a single
 * Nostr event object or an array of events.
 */
export declare function loadEventsFromDir(dir: string): Promise<NostrEvent[]>;
