import { NostrEvent } from '../types.js';

export function stripPii(events: NostrEvent[]): void {
  for (const ev of events) {
    delete ev.pubkey;
    delete ev.sig;
    // Optionally anonymize id
    if (ev.id) {
      ev.id = undefined as any;
    }
    // tag removal if contains p tag?
    ev.tags = ev.tags.filter((t) => t[0] !== 'p');
  }
} 