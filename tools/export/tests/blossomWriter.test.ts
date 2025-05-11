import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import fs from 'fs-extra';
import os from 'node:os';
import { loadEventsFromDir } from '../src/loaders/jsonLoader.js';
import { writeBlossom } from '../src/writers/blossomWriter.js';

const fixtureDir = path.resolve(__dirname, 'fixtures');

describe('Blossom writer', () => {
  let tmpDir: string;
  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nip101h-blossom-test-'));
  });
  afterEach(() => {
    fs.removeSync(tmpDir);
  });

  it('creates a blossom package json', async () => {
    const events = await loadEventsFromDir(fixtureDir);
    const outPath = path.join(tmpDir, 'events.blossom.json');
    await writeBlossom(events, outPath);
    expect(fs.existsSync(outPath)).toBe(true);
    const pkg = await fs.readJson(outPath);
    expect(pkg.version).toBe('1');
    expect(pkg.events.length).toBe(1);
  });
}); 