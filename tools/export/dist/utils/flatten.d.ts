import { NostrEvent } from '../types.js';
export interface FlatEventRow {
    id?: string;
    kind: number;
    created_at: number;
    timestamp?: string;
    unit?: string;
    value: string;
    encrypted: boolean;
}
export declare function flattenEvent(event: NostrEvent): FlatEventRow;
