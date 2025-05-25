import fs from 'fs-extra';
import path from 'node:path';
export async function writeBlossom(events, outPath) {
    const pkg = {
        version: '1',
        exported_at: new Date().toISOString(),
        events,
    };
    await fs.ensureDir(path.dirname(outPath));
    await fs.writeJson(outPath, pkg, { spaces: 2 });
}
