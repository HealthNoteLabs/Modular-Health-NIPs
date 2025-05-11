# NIP-101h: A Modular, Privacy-First Standard for Health Data on Nostr

*Published 2025-05-11 – Draft*

## Abstract

NIP-101h is an **ultra-modular** framework that brings granular health & fitness metrics to the Nostr protocol.  Instead of stuffing an entire health profile into one monolithic event, each metric (weight, steps, calories, workout intensity, etc.) receives its own micro-NIP (`NIP-101h.X`).  The result is a Lego-like toolkit that apps can pick and choose from while still speaking a common language.

After several design rounds the repository now contains:

1. **Core framework** – the primary `NIP101h` document describing philosophy, kind ranges (`1351-1399` & `2351-2399`), common tags and privacy guidelines.
2. **Ten individual specs** – `NIP-101h.1` through `NIP-101h.10`, each living in its own markdown file and linked from the [Directory](./NIP101h-Directory.md).
3. **User Guide** – a developer-oriented manual that walks through publishing, reading, and encrypting health events.
4. **Default privacy stance** – every spec now explicitly recommends **NIP-44 encryption by default**, with an opt-in for public/plain events.

The next milestone introduces **data-export utilities** so users can keep their information portable *without* compromising privacy.

---

## Why Modular Metrics ⭑

* Granularity – publish weight daily without touching step counts.
* Evolvability – new metrics (e.g., blood glucose) fit neatly by reserving the next free kind.
* Selective sharing – users can reveal VO₂max to their coach but conceal body-fat %.  Each metric is an independent event that can be encrypted or left plain individually.

## Anatomy of a NIP-101h Event

```json
{
  "kind": 1351,             // Weight
  "content": "70",          // kg – encrypted with NIP-44 unless user opts out
  "tags": [
    ["unit", "kg"],
    ["t", "health"],
    ["t", "weight"],
    ["timestamp", "2025-05-01T10:00:00Z"],
    ["encryption_algo", "nip44"],
    ["p", "<receiver_pubkey>"]
  ],
  "created_at": 1672531200,
  "pubkey": "<pubkey>",
  "sig": "<sig>"
}
```

*Only the `content` is encrypted; tags remain searchable so apps can build timelines and correlations even before decryption.*

---

## New Direction: Blossom & Data-Portability Tools

Many users store historical health data in **Blossom personal-data servers** or run spreadsheet analyses.  To make that trivial, the repo will ship a `/tools/export` package that:

1. **Loads raw `.json` Nostr events** from a folder (relay dump or local cache).
2. **Validates** them against per-metric JSON Schemas.
3. **Optionally decrypts** `content` locally (user supplies privkey) – never transmits plaintext.
4. **Outputs** one of three formats:
   * **CSV** – flat rows for Excel / Google Sheets.
   * **SQLite** – ready for Blossom import or on-device querying.
   * **Blossom API push** – direct POST to the user's server.

### Privacy Guardrails

* Decryption is always **client-side**, never in the cloud.
* A `--strip-pii` flag removes `pubkey`, `sig`, and other sensitive fields.
* If the user keeps data encrypted, CSV rows show `[encrypted]` and the utility still fills timestamp/unit columns so external apps can plot *anonymised* activity graphs.

---

## Roadmap Snapshot

| Phase | Feature | Status |
|-------|---------|--------|
| 0 | Metric specs 1-10 | ✅ Done |
| 1 | User Guide & Directory | ✅ Done |
| 2 | **Export CLI skeleton** (`nip101h-export --help`) | 🔜 |
| 3 | JSON → CSV converter | Planned |
| 4 | SQLite writer + Schema | Planned |
| 5 | Blossom API integration | Planned |
| 6 | Web Playground for graphs | Backlog |

---

## How Developers Benefit

* **Zero lock-in** – read/write Nostr events *or* use CSV/SQL locally.
* **No crypto headaches** – helper functions wrap NIP-44 encryption.
* **Consistent charts** – because every metric follows a strict tag & unit schema.
* **Future proof** – adding a new metric is just `npm run generate-metric glucose`.

> *"Publish once, visualise anywhere"* – that's the ethos behind NIP-101h.

---

## Contributing

We welcome:

* Pull Requests that add metric folders with code snippets (JS, Python, Rust…)
* Feedback on the export-tool CLI API
* Real-world test vectors from fitness trackers
* Ideas for privacy-preserving aggregation (bucket tags, homomorphic stats, etc.)

Join the discussion on Nostr or open an issue in this repo.

---

## Resources

* [NIP-101h Specification](./NIP101h)
* [Metric Directory](./NIP101h-Directory.md)
* [User & Implementation Guide](./NIP101h-User-Guide.md)
* [Runstr prototype roadmap](./RUNSTR)

---

© 2025 The NIP-101h Maintainers – Released under MIT 