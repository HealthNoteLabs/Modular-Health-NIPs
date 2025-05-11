import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import fs from 'fs-extra';
import os from 'node:os';
import Database from 'better-sqlite3';
import { loadEventsFromDir } from '../src/loaders/jsonLoader.js';
import { writeSqlite } from '../src/writers/sqliteWriter.js';

const fixtureDir = path.resolve(__dirname, 'fixtures');

describe('SQLite writer', () => {
  let tmpDir: string;
  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nip101h-sqlite-test-'));
  });

  afterEach(() => {
    fs.removeSync(tmpDir);
  });

  it('creates an SQLite database with events table', async () => {
    const events = await loadEventsFromDir(fixtureDir);
    const outPath = path.join(tmpDir, 'events.sqlite');
    await writeSqlite(events, outPath);
    expect(fs.existsSync(outPath)).toBe(true);

    const db = new Database(outPath, { readonly: true });
    const row = db.prepare('SELECT COUNT(*) as cnt FROM events').get();
    expect(row.cnt).toBe(1);
    db.close();
  });
}); 