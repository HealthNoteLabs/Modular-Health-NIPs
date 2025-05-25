import { describe, expect, it } from 'vitest';
import { groupByBucket } from '../src/transforms/groupByBucket.js';
import { TimeSeriesPoint } from '../src/types.js';

describe('groupByBucket', () => {
  it('aggregates daily values into weekly avg', () => {
    const series: TimeSeriesPoint[] = [
      { date: '2025-05-05', value: 70 }, // Monday
      { date: '2025-05-06', value: 71 },
      { date: '2025-05-12', value: 72 }, // next Monday
    ];

    const weekly = groupByBucket(series, { bucket: 'week', aggregate: 'avg' });
    expect(weekly).toHaveLength(2);
    expect(weekly[0].value).toBeCloseTo(70.5, 5);
  });
}); 