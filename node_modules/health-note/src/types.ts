export interface NostrEvent {
  id?: string;
  kind: number;
  content: string;
  tags?: Array<[string, ...string[]]>;
  created_at: number; // unix seconds
}

export interface TimeSeriesPoint {
  date: string; // ISO date (YYYY-MM-DD)
  value: number;
  source?: 'created_at' | 'timestamp_tag';
  encrypted?: boolean;
} 