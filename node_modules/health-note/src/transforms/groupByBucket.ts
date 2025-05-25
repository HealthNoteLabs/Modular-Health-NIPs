import { TimeSeriesPoint } from '../types.js';

export type Bucket = 'day' | 'week' | 'month';
export type Aggregate = 'avg' | 'sum' | 'min' | 'max' | 'count';

export interface GroupByBucketOptions {
  bucket: Bucket;
  aggregate: Aggregate;
}

export interface BucketPoint extends TimeSeriesPoint {
  count: number;
  min: number;
  max: number;
}

function bucketKey(dateIso: string, bucket: Bucket): string {
  if (bucket === 'day') return dateIso;
  const [year, month, day] = dateIso.split('-').map(Number);
  if (bucket === 'week') {
    const date = new Date(Date.UTC(year, month - 1, day));
    const firstDay = new Date(date);
    firstDay.setUTCDate(date.getUTCDate() - date.getUTCDay()); // Sunday start
    return firstDay.toISOString().slice(0, 10);
  }
  // month
  return `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}`;
}

export function groupByBucket(
  series: TimeSeriesPoint[],
  opts: GroupByBucketOptions
): BucketPoint[] {
  const { bucket, aggregate } = opts;
  const map = new Map<string, BucketPoint>();

  for (const p of series) {
    const key = bucketKey(p.date, bucket);
    let bucketPoint = map.get(key);
    if (!bucketPoint) {
      bucketPoint = {
        date: key,
        value: 0,
        count: 0,
        min: p.value,
        max: p.value,
        source: p.source,
        encrypted: p.encrypted,
      };
      map.set(key, bucketPoint);
    }
    bucketPoint.count += 1;
    bucketPoint.min = Math.min(bucketPoint.min, p.value);
    bucketPoint.max = Math.max(bucketPoint.max, p.value);
    bucketPoint.value += p.value; // temp sum
  }

  const out: BucketPoint[] = [];
  map.forEach((bp) => {
    switch (aggregate) {
      case 'avg':
        bp.value = bp.value / bp.count;
        break;
      case 'sum':
        // value already sum
        break;
      case 'min':
        bp.value = bp.min;
        break;
      case 'max':
        bp.value = bp.max;
        break;
      case 'count':
        bp.value = bp.count;
        break;
    }
    out.push(bp);
  });

  // Sort by date ascending
  return out.sort((a, b) => (a.date < b.date ? -1 : 1));
} 