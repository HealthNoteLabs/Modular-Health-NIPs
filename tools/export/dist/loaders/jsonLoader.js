import path from 'node:path';
import fs from 'fs-extra';
/**
 * Recursively read a directory and collect all .json files.
 */
async function collectJsonFiles(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = [];
    await Promise.all(entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...(await collectJsonFiles(fullPath)));
        }
        else if (entry.isFile() && entry.name.toLowerCase().endsWith('.json')) {
            files.push(fullPath);
        }
    }));
    return files;
}
/**
 * Load events from a directory containing .json files. Each file may contain a single
 * Nostr event object or an array of events.
 */
export async function loadEventsFromDir(dir) {
    const files = await collectJsonFiles(dir);
    const events = [];
    for (const file of files) {
        const data = await fs.readFile(file, 'utf8');
        if (!data.trim())
            continue;
        try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) {
                parsed.forEach((e) => events.push(e));
            }
            else {
                events.push(parsed);
            }
        }
        catch (err) {
            console.warn(`Skipping invalid JSON file: ${file}`);
        }
    }
    return events;
}
