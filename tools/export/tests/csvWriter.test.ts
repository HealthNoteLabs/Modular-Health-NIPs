import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import fs from 'fs-extra';
import os from 'node:os';
import { loadEventsFromDir } from '../src/loaders/jsonLoader.js';
import { writeCsv } from '../src/writers/csvWriter.js';

const fixtureDir = path.resolve(__dirname, 'fixtures');

describe('CSV writer', () => {
  let tmpDir: string;
  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nip101h-export-test-'));
  });

  afterEach(() => {
    fs.removeSync(tmpDir);
  });

  it('converts events to CSV', async () => {
    const events = await loadEventsFromDir(fixtureDir);
    expect(events.length).toBe(1);
    const outPath = path.join(tmpDir, 'events.csv');
    await writeCsv(events, outPath);
    const csvContent = await fs.readFile(outPath, 'utf8');
    expect(csvContent).toContain('id,kind,created_at');
    expect(csvContent).toContain('abc123');
  });
}); 