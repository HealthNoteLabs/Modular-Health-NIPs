import fs from 'fs-extra';
import { flattenEvent } from '../utils/flatten.js';
function escape(value) {
    const str = value !== null && value !== void 0 ? value : '';
    const stringValue = String(str);
    if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
        return '"' + stringValue.replace(/"/g, '""') + '"';
    }
    return stringValue;
}
export async function writeCsv(events, outPath) {
    var _a;
    const rows = events.map(flattenEvent);
    const header = Object.keys((_a = rows[0]) !== null && _a !== void 0 ? _a : {
        id: '',
        kind: 0,
        created_at: 0,
        timestamp: '',
        unit: '',
        value: '',
        encrypted: false,
    });
    const lines = [header.join(',')];
    for (const row of rows) {
        const line = header.map((h) => escape(row[h])).join(',');
        lines.push(line);
    }
    await fs.outputFile(outPath, lines.join('\n'), 'utf8');
}
