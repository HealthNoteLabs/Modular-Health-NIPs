import Database from 'better-sqlite3';
import { NostrEvent } from '../types.js';

export interface SQLiteLoaderOptions {
  tableName?: string; // default 'events'
}

export function loadEventsFromSQLite(
  dbPath: string,
  options: SQLiteLoaderOptions = {}
): NostrEvent[] {
  const table = options.tableName ?? 'events';
  const db = new Database(dbPath, { readonly: true });

  const rows = db.prepare(`SELECT * FROM ${table}`).all();
  db.close();

  return rows.map((row: any) => {
    const tags: Array<[string, ...string[]]> = [];
    if (row.unit) tags.push(['unit', row.unit]);
    if (row.timestamp) tags.push(['timestamp', row.timestamp]);
    if (row.encrypted) tags.push(['encryption_algo', 'nip44']);

    return {
      id: row.id,
      kind: Number(row.kind),
      content: String(row.value ?? row.content ?? ''),
      tags,
      created_at: Number(row.created_at),
    } as NostrEvent;
  });
} 