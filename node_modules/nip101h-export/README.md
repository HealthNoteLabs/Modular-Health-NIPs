# NIP-101h Export Tool

`nip101h-export` is a TypeScript CLI that converts a folder of raw Nostr JSON events (kind 13xx) into portable formats: **CSV**, **SQLite**, or **Blossom JSON package**.

---

## 1. Install & build

```bash
# from repository root
cd tools/export
npm install        # install deps once
npm run build      # compile to dist/
```

After that you can run directly with `node dist/cli.js` or link it globally:

```bash
npm link           # optional – adds `nip101h-export` to $PATH
```

---

## 2. Basic usage

```bash
nip101h-export <inputDir> --to <format> [options]
```

| Positional | Description                         |
|------------|-------------------------------------|
| `inputDir` | Directory containing `.json` event files (files can hold a single event or an array). |

### Common options

| Flag | Alias | Description |
|------|-------|-------------|
| `--to` | `-t` | Output format: `csv`, `sqlite`, `blossom` (required). |
| `--out` | `-o` | Output file path. Defaults to `events.<ext>`. |
| `--decrypt` |   | Decrypt `content` that was encrypted with NIP-04/NIP-44 locally. Requires `--privkey`. |
| `--privkey <hex>` |   | Hex-encoded private key used for NIP decryption. |
| `--strip-pii` |   | Remove PII fields (`pubkey`, `sig`, `p` tags, ids) before writing. |
| `--kinds` |   | Comma-separated list of event kinds to include. *(planned)* |
| `--help` / `-h` |   | Show help. |

### Examples

Convert to CSV:
```bash
nip101h-export data/ --to csv -o my_health.csv
```

Convert to SQLite with decryption:
```bash
nip101h-export data/ --to sqlite --decrypt --privkey 0xabc123...
```

Export Blossom package, strip PII:
```bash
nip101h-export data/ --to blossom --strip-pii -o events.blossom.json
```

---

## 3. Output formats

### CSV
Flat rows suitable for spreadsheets / BI tools. Columns:
`id,kind,created_at,timestamp,unit,value,encrypted`

### SQLite
`events` table with the same columns; ready for Blossom import or local SQL queries.

### Blossom JSON package
```json
{
  "version": "1",
  "exported_at": "2025-05-11T09:00:00Z",
  "events": [ /* raw events (optionally decrypted / stripped) */ ]
}
```

---

## 4. Development

* **Tests**: `npm test` (Vitest).
* **Build**: `npm run build` (TypeScript → `dist/`).
* **Watch**: `npm run dev`

---

## 5. Roadmap / TODO

- Kind filtering (`--kinds 1351,1359`)
- Blossom API direct upload
- Web playground for data visualisation
- Robust NIP-44 padding / chunk handling 