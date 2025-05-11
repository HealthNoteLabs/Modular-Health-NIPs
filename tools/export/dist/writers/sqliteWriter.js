import Database from 'better-sqlite3';
import { flattenEvent } from '../utils/flatten.js';
import fs from 'fs-extra';
import path from 'node:path';
export async function writeSqlite(events, outPath) {
    // Ensure directory exists
    await fs.ensureDir(path.dirname(outPath));
    const db = new Database(outPath);
    db.pragma('journal_mode = WAL');
    db.exec(`CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    kind INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    timestamp TEXT,
    unit TEXT,
    value TEXT NOT NULL,
    encrypted INTEGER NOT NULL
  );`);
    const insert = db.prepare(`INSERT OR REPLACE INTO events (id, kind, created_at, timestamp, unit, value, encrypted)
    VALUES (@id, @kind, @created_at, @timestamp, @unit, @value, @encrypted);`);
    const transaction = db.transaction((rows) => {
        for (const row of rows) {
            const sqliteRow = { ...row, encrypted: row.encrypted ? 1 : 0 };
            insert.run(sqliteRow);
        }
    });
    const rows = events.map(flattenEvent);
    transaction(rows);
    db.close();
}
