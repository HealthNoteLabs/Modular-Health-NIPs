import { describe, it, expect } from 'vitest';
import { loadEventsFromDir } from '../src/loaders/jsonLoader.js';
import path from 'node:path';
import { stripPii } from '../src/utils/strip.js';

const fixtureDir = path.resolve(__dirname, 'fixtures');

describe('stripPii', () => {
  it('removes pubkey, sig and p tags', async () => {
    const events = await loadEventsFromDir(fixtureDir);
    const original = events[0];
    expect(original.pubkey).toBeDefined();
    stripPii(events);
    const ev = events[0];
    expect(ev.pubkey).toBeUndefined();
    expect(ev.sig).toBeUndefined();
    expect(ev.tags.some((t) => t[0] === 'p')).toBe(false);
  });
}); 