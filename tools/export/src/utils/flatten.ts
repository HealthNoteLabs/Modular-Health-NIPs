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

export function flattenEvent(event: NostrEvent): FlatEventRow {
  const getTag = (name: string) => event.tags.find((t) => t[0] === name)?.[1];
  const unit = getTag('unit');
  const timestamp = getTag('timestamp');
  const encrypted = event.tags.some((t) => t[0] === 'encryption_algo' && t[1] === 'nip44');
  return {
    id: event.id,
    kind: event.kind,
    created_at: event.created_at,
    timestamp,
    unit,
    value: event.content,
    encrypted,
  };
} 