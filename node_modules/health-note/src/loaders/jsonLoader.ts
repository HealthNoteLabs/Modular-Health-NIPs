// @ts-ignore
import { readFile } from 'node:fs/promises';
import { NostrEvent } from '../types.js';

/**
 * Load NIP-101h events from a JSON file. The file can contain:
 *   • A single Nostr event object
 *   • An array of events
 *   • Newline-delimited JSON (each line one event)
 */
export async function loadEventsFromFile(path: string): Promise<NostrEvent[]> {
  const data = await readFile(path, 'utf8');
  const trimmed = data.trim();
  if (!trimmed) return [];

  // First try to parse as whole JSON (object or array)
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed as NostrEvent[];
    return [parsed as NostrEvent];
  } catch {
    // Fallback: newline-delimited JSON
    return trimmed
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line: string) => JSON.parse(line) as NostrEvent);
  }
} 