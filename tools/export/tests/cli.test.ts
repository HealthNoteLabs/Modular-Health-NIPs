import { execa } from 'execa';
import { describe, it, expect } from 'vitest';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bin = path.resolve(__dirname, '../dist/cli.js');

describe('nip101h-export CLI', () => {
  it('prints help information', async () => {
    const { stdout } = await execa('node', [bin, '--help']);
    expect(stdout).toContain('nip101h-export');
    expect(stdout).toContain('Export NIP-101h events');
  });
}); 