import { describe, expect, it } from 'vitest';
import { toTimeSeries } from '../src/transforms/timeSeries.js';
import { NostrEvent } from '../src/types.js';

describe('toTimeSeries', () => {
  it('converts weight events to daily points', () => {
    const events: NostrEvent[] = [
      {
        kind: 1351,
        content: '70',
        tags: [
          ['unit', 'kg'],
          ['timestamp', '2025-05-01T10:00:00Z'],
        ],
        created_at: 1746669600,
      },
      {
        kind: 1351,
        content: '71',
        tags: [
          ['unit', 'kg'],
          ['timestamp', '2025-05-02T10:00:00Z'],
        ],
        created_at: 1746756000,
      },
    ];

    const series = toTimeSeries(events);
    expect(series).toHaveLength(2);
    expect(series[0]).toEqual({ date: '2025-05-01', value: 70, source: 'timestamp_tag', encrypted: false });
    expect(series[1].value).toBe(71);
  });
}); 