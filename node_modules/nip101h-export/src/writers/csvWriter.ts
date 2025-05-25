import fs from 'fs-extra';
import { NostrEvent } from '../types.js';
import { flattenEvent, FlatEventRow } from '../utils/flatten.js';

function escape(value: unknown): string {
  const str = value ?? '';
  const stringValue = String(str);
  if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
    return '"' + stringValue.replace(/"/g, '""') + '"';
  }
  return stringValue;
}

export async function writeCsv(events: NostrEvent[], outPath: string): Promise<void> {
  const rows: FlatEventRow[] = events.map(flattenEvent);
  const header = Object.keys(rows[0] ?? {
    id: '',
    kind: 0,
    created_at: 0,
    timestamp: '',
    unit: '',
    value: '',
    encrypted: false,
  });
  const lines = [header.join(',')];
  for (const row of rows) {
    const line = header.map((h) => escape((row as any)[h])).join(',');
    lines.push(line);
  }
  await fs.outputFile(outPath, lines.join('\n'), 'utf8');
} 