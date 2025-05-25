import db from "./db";
import { laplaceNoise } from "../utils/dp";

interface TrendOptions {
  kind: number;
  bucket: "hour" | "day" | "week" | "month" | "year";
  stat: "mean";
  epsilon?: number;
}

export interface TrendPoint {
  date: string;
  value: number;
  dp_noise?: number;
}

export interface TrendResult {
  kind: number;
  bucket: string;
  stat: string;
  epsilon?: number;
  k_anonymity: number;
  series: TrendPoint[];
}

function bucketFormat(createdAt: number, bucket: string): string {
  const d = new Date(createdAt * 1000);
  switch (bucket) {
    case "hour":
      return d.toISOString().slice(0, 13) + ":00"; // YYYY-MM-DDTHH
    case "day":
      return d.toISOString().slice(0, 10); // YYYY-MM-DD
    case "week": {
      // ISO week format: YYYY-Www
      const temp = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
      const dayNum = temp.getUTCDay() || 7;
      temp.setUTCDate(temp.getUTCDate() + 4 - dayNum);
      const yearStart = Date.UTC(temp.getUTCFullYear(), 0, 1);
      const weekNo = Math.ceil(((+temp - yearStart) / 86400000 + 1) / 7);
      return `${temp.getUTCFullYear()}-W${weekNo}`;
    }
    case "month":
      return d.toISOString().slice(0, 7); // YYYY-MM
    case "year":
      return d.getUTCFullYear().toString();
    default:
      return d.toISOString().slice(0, 10);
  }
}

export function computeTrend({ kind, bucket, stat, epsilon }: TrendOptions): TrendResult {
  const rows: Array<{ period: string; avg: number; count: number; uniq: number }> = [];
  const dataStmt = db.prepare(
    `SELECT
       ?, -- bucket placeholder, replaced later
       AVG(value) as avg,
       COUNT(*) as count,
       COUNT(DISTINCT pubkey) as uniq
     FROM stats
     WHERE kind = ?
     GROUP BY ??` // placeholder not allowed, will compute in JS
  );
  // However better-sqlite3 doesn't allow dynamic grouping easily. We'll compute in JS.

  const selectAll = db.prepare(`SELECT pubkey, value, created_at FROM stats WHERE kind = ?`);
  const all = selectAll.all(kind) as Array<{ pubkey: string; value: number; created_at: number }>;

  const map = new Map<string, { sum: number; count: number; pubkeys: Set<string> }>();
  for (const row of all) {
    const key = bucketFormat(row.created_at, bucket);
    if (!map.has(key)) {
      map.set(key, { sum: 0, count: 0, pubkeys: new Set() });
    }
    const entry = map.get(key)!;
    entry.sum += row.value;
    entry.count += 1;
    entry.pubkeys.add(row.pubkey);
  }

  const series: TrendPoint[] = [];
  map.forEach((entry, period) => {
    const uniq = entry.pubkeys.size;
    if (uniq < 5) {
      // k-anonymity threshold not met, skip this bucket
      return;
    }
    const mean = entry.sum / entry.count;
    let val = mean;
    let noise: number | undefined;
    if (epsilon && epsilon > 0) {
      // quick Laplace noise; assume L1 sensitivity ~ (max-min)/count ≈ 1 for demonstration
      const scale = 1 / epsilon;
      noise = laplaceNoise(scale);
      val += noise;
    }
    series.push({ date: period, value: Number(val.toFixed(2)), dp_noise: noise ? Number(noise.toFixed(2)) : undefined });
  });

  return {
    kind,
    bucket,
    stat,
    epsilon,
    k_anonymity: 5,
    series: series.sort((a, b) => (a.date > b.date ? 1 : -1)),
  };
} 