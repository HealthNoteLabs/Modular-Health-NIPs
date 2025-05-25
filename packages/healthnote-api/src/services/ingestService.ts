import db from "./db";
import { z } from "zod";

export const StatBlobSchema = z.object({
  id: z.string(),
  pubkey: z.string(),
  kind: z.number().int(),
  value: z.number(),
  unit: z.string(),
  created_at: z.number().int(),
  accuracy: z.string().optional(),
  status: z.string().optional(),
});

export type StatBlob = z.infer<typeof StatBlobSchema>;

const insertStmt = db.prepare(
  `INSERT OR REPLACE INTO stats (id, pubkey, kind, value, unit, created_at, accuracy, status)
   VALUES (@id, @pubkey, @kind, @value, @unit, @created_at, @accuracy, @status)`
);

export function ingest(blobs: StatBlob[]) {
  const txn = db.transaction(() => {
    for (const blob of blobs) {
      insertStmt.run(blob);
    }
  });
  txn();
} 