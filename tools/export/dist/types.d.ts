export interface NostrTag extends Array<string> {
    0: string;
    1: string;
}
export interface NostrEvent {
    id?: string;
    pubkey?: string;
    sig?: string;
    kind: number;
    content: string;
    tags: NostrTag[];
    created_at: number;
    [key: string]: unknown;
}
