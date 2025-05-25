import fs from 'fs-extra';
import path from 'node:path';
import { NostrEvent } from '../types.js';

export interface BlossomPackage {
  version: string;
  exported_at: string;
  events: NostrEvent[];
}

export async function writeBlossom(events: NostrEvent[], outPath: string): Promise<void> {
  const pkg: BlossomPackage = {
    version: '1',
    exported_at: new Date().toISOString(),
    events,
  };

  await fs.ensureDir(path.dirname(outPath));
  await fs.writeJson(outPath, pkg, { spaces: 2 });
} 