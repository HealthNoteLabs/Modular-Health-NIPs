import { NostrEvent, TimeSeriesPoint } from '../types.js';

export interface TimeSeriesOptions {
  metricKind?: number; // default 1351 (weight)
}

/**
 * Convert NIP-101h events into tidy time-series (long) format.
 * Currently supports **weight** (kind 1351) only.
 */
export function toTimeSeries(
  events: NostrEvent[],
  options: TimeSeriesOptions = {}
): TimeSeriesPoint[] {
  const { metricKind = 1351 } = options;

  // Filter events for the metric
  const filtered = events.filter((e) => e.kind === metricKind);

  return filtered.map<TimeSeriesPoint>((ev) => {
    const tags = ev.tags ?? [];

    // Try to find explicit timestamp tag (ISO date string)
    const timestampTag = tags.find((t) => t[0] === 'timestamp');
    const iso = timestampTag ? timestampTag[1] : new Date(ev.created_at * 1000).toISOString();
    const date = iso.slice(0, 10); // YYYY-MM-DD

    const encrypted = !!tags.find((t) => t[0] === 'encryption_algo');
    const valueNum = Number(ev.content);

    return {
      date,
      value: isNaN(valueNum) ? 0 : valueNum,
      source: timestampTag ? 'timestamp_tag' : 'created_at',
      encrypted,
    };
  });
} 