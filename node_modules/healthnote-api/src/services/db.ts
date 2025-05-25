import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "healthnote.db");

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS stats (
    id TEXT PRIMARY KEY,
    pubkey TEXT NOT NULL,
    kind INTEGER NOT NULL,
    value REAL NOT NULL,
    unit TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    accuracy TEXT,
    status TEXT
  );
`);

export default db; 