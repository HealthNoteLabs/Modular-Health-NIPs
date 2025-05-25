export interface NostrTag extends Array<string> {
  0: string; // tag name
  1: string; // tag value
  // additional items optional
}

export interface NostrEvent {
  id?: string;
  pubkey?: string;
  sig?: string;
  kind: number;
  content: string;
  tags: NostrTag[];
  created_at: number;
  // allow additional properties
  [key: string]: unknown;
} 