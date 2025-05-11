# Blossom & Data-Portability Tools – Implementation Guide

> *This is a living document.  Update it as milestones are reached, blockers appear, or design choices change.*

## 0. Purpose

Give users **full control** of their NIP-101h health history:

* Back-up or migrate data between clients.
* Run personal analytics (spreadsheets, BI dashboards).
* Import/export to a **Blossom** personal-data server without breaking NIP-44 privacy.

## 1. MVP Scope

| Goal | Deliverable | Owner | Status |
|------|-------------|-------|--------|
| CLI skeleton | `nip101h-export --help` prints usage | | ☐ Not started |
| JSON loader | Read single events & arrays from a folder | | ☐ |
| Validator | Per-metric JSON Schemas + linting | | ☐ |
| CSV writer | `--to csv` flag outputs `events.csv` | | ☐ |
| Decrypt option | `--decrypt --privkey <hex>` decrypts content locally | | ☐ |
| Readme | Usage, examples, privacy notes | | ☐ |

> **Exit criteria:** user can convert a folder of `.json` events to a flattened CSV without the data leaving their machine.

## 2. Folder Layout (proposed)

```
/tools/export/
  package.json        # TypeScript toolchain
  tsconfig.json
  src/
    cli.ts           # yargs / commander entrypoint
    loaders/
      jsonLoader.ts
    writers/
      csvWriter.ts
      sqliteWriter.ts      # Phase-2
      blossomWriter.ts     # Phase-3
    utils/
      flatten.ts
      nip44.ts             # encryption helpers
  tests/
    weight.test.ts
    stepCount.test.ts
```

## 3. CLI Design (draft)

```bash
nip101h-export <inputDir> --to csv \
  [--out events.csv] \
  [--decrypt] \
  [--privkey <hex>] \
  [--strip-pii] \
  [--kinds 1351,1359]    # filter
```

* Default output file is derived from `--to`.
* Supports multiple `--to` flags in one run.
* `--decrypt` without `--privkey` → interactive prompt or NIP-07/NIP-46 fallback (future).

## 4. Data Model

After validation each event becomes a **flattened object**:

| field | notes |
|-------|-------|
| id | event id |
| kind | 1351… |
| created_at | seconds epoch |
| metric | "weight", "step_count"… (resolved via Directory) |
| value | decrypted content or raw string |
| unit | from `unit` tag |
| encrypted | boolean |
| …tagColumns | timestamp, activity, source, etc. |

Dynamic columns are collected across entire dataset.

## 5. JSON Schemas

Each metric folder (e.g., `examples/101h.1_weight`) will expose `schema.json`.  Validator walks directory → chooses schema via `kind`.

* Use `ajv` for runtime validation.
* Fail-fast but collect all errors for nicer UX.

## 6. Privacy Strategy

1. **Local-only decryption.**  Keys never leave process memory.
2. `--strip-pii` removes: `pubkey`, `sig`, encryption tags, and any spec-marked sensitive tag.
3. When output remains encrypted, utility still outputs `unit`, `timestamp`, etc. so graphs can plot anonymised shapes.
4. Document attack-surface assumptions in this guide.

## 7. Testing Plan

* Test vectors stored under each metric folder (`valid.json`, `invalid.json`).
* Vitest suite checks:
  * Loader → Validator success on `valid.*`.
  * Loader → Validator failure on `invalid.*`.
  * CSV writer row count = input count.
* Run tests in CI (GitHub Actions).

## 8. Phase-2 & Beyond

| Phase | Feature | Notes |
|-------|---------|-------|
| 2 | SQLite writer | create `events` table, optional `tags` table |
|   | Schema introspection | auto-migrate on version bump |
| 3 | Blossom writer | detect API version, chunked POST |
| 4 | Web playground | drag-and-drop JSON → charts (uses same core library via WASM) |
| 5 | Parquet / Arrow | big-data formats for analytics |

## 9. Open Questions

* **Key sourcing:** best UX for privkey input?  Env var, prompt, or NIP-07 provider?
* **Large datasets:** streaming CSV/SQLite vs loading entire JSON into memory.
* **Tag evolution:** how to store arbitrary new tags in flat CSV?  JSON-encode into a `tags` column?
* **Blossom auth model:** bearer token vs signed Nostr event.

## 10. Pitfalls & Lessons (update as we go)

* _TBD_ – add notes on JSON edge-cases, encryption failures, performance bottlenecks…

---

_Last updated: 2025-05-11_ 