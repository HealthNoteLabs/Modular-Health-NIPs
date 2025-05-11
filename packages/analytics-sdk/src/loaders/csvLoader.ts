// @ts-ignore
import { readFile } from 'node:fs/promises';
// @ts-ignore – csv-parse types may not be present
import { parse } from 'csv-parse/sync';
import { NostrEvent } from '../types.js';

export interface CSVLoaderOptions {
  delimiter?: string;
}

/**
 * Load events from a CSV file that follows the column convention:
 * id,kind,created_at,timestamp,unit,value,encrypted
 */
export async function loadEventsFromCSV(
  path: string,
  opts: CSVLoaderOptions = {}
): Promise<NostrEvent[]> {
  const input = await readFile(path, 'utf8');
  const records = parse(input, {
    columns: true,
    skip_empty_lines: true,
    delimiter: opts.delimiter ?? ',',
  });

  const events: NostrEvent[] = records.map((row: any) => {
    const tags: Array<[string, ...string[]]> = [];
    if (row.unit) tags.push(['unit', row.unit]);
    if (row.timestamp) tags.push(['timestamp', row.timestamp]);
    if (row.encrypted === 'true' || row.encrypted === true) {
      tags.push(['encryption_algo', 'nip44']);
    }

    return {
      id: row.id,
      kind: Number(row.kind),
      content: String(row.value),
      tags,
      created_at: Number(row.created_at),
    };
  });

  return events;
} 