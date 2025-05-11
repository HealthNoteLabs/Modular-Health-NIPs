# The Road Ahead for NIP-101h: Encrypted Health Data, Portable Insights

_**Draft – 2025-05-11**_

## Executive Overview

NIP-101h began as a **privacy-first standard** for publishing granular health & fitness metrics on the Nostr network.  With ten metric micro-specs already finalized (weight, steps, calories, etc.) and a developer-friendly user guide in place, the next phase focuses on **data portability** and **insight generation**—all while keeping sensitive values encrypted by default.

This article captures the upcoming milestones, tools, and ecosystem vision so contributors and early adopters know exactly where the project is heading.

---

## 1. Guiding Principles

1. **Encryption by Default** – Every metric's `content` SHOULD be NIP-44 encrypted.  Tags stay public so apps can organise data without exposing plaintext.
2. **User Data Ownership** – Users decide who can decrypt each metric and can revoke access at any time.
3. **Ultra-Modular Design** – Each metric lives in its own mini-spec (`NIP-101h.X`) so implementers can pick a minimal set or go all-in.
4. **Zero Lock-In** – All tools emit open formats (JSON, CSV, SQLite) and speak standard Blossom APIs for personal data servers.

---

## 2. From Event Streams to Actionable Insights

### 2.1 Posting Data
* Users (or devices) publish health events to any Nostr relay.
* `content` is encrypted; tags expose only non-PII context (`unit`, `timestamp`, `t:health` …).

### 2.2 Collecting Data
* **Blossom personal-data servers** (or any self-hosted service) can _scoop_ events straight off relays **without** needing the decryption key.
* Even encrypted events are useful for timelines because timestamps & units remain visible.

### 2.3 Aggregation & Visualisation
* A forthcoming **Stats SDK** will:
  * Stream events for a signed-in `npub`.
  * Decrypt on the client when a `privkey` is supplied.
  * Compute trends (moving averages, best-time PRs, seasonal charts).
  * Feed ready-to-render datasets into chart libraries.
* App developers _never_ touch plaintext unless the user explicitly grants it, yet can still show compelling graphs in-app.

---

## 3. Export & Interop Toolkit

| Phase | Tool / Feature | Status |
|-------|----------------|--------|
| 2 | **Export CLI skeleton** (`nip101h-export --help`) | 🔜 (in `/tools/export`) |
| 3 | JSON → CSV converter | Planned |
| 4 | SQLite writer + schema for Blossom import | Planned |
| 5 | Direct Blossom API push (`--push`) | Planned |

Key capabilities:

* **Schema Validation** – Each metric is checked against its JSON Schema before export.
* **Local-Only Decryption** – `--privkey` flag decrypts `content` _after_ download; plaintext never leaves the user's machine.
* **PII Scrubbing** – `--strip-pii` removes `pubkey`, `sig`, etc., for shareable datasets.

---

## 4. SDK: Stats Aggregator

The SDK will drastically reduce complexity for app builders:

* 🚀 **One-liner Integration** – `import { createStatsClient } from '@nip101h/stats'`.
* 🔐 **Privacy Presets** – Helper to enforce encryption defaults & sharing scopes.
* 📈 **Trend Helpers** – Median weight, VO₂max progression, streak counters.
* 🛠 **Pluggable Storage** – Memory, IndexedDB, or Blossom backing store.

_By abstracting relay queries, decryption, and data shaping, the SDK lets developers focus on UX, not plumbing._

---

## 5. Example User Journey

1. Alice's phone records today's workout and step count.
2. Her fitness app publishes events **encrypted** under NIP-44.
3. Alice installs a charting app that uses the Stats SDK.  She logs in with her `npub` (read-only).
4. The app renders a weekly trend line—values remain encrypted on the server; decrypted only in Alice's browser thanks to her provided `privkey`.
5. Later, Alice runs `nip101h-export --kind 1351-1357 --format sqlite --push` to back up data to her Blossom server.

---

## 6. Call for Contributors

We are actively seeking help on:

* **Export CLI** – TypeScript developers to flesh out loaders, writers, and validation logic.
* **Stats SDK** – Designers of functional data pipelines & visual components.
* **New Metrics** – Proposals for blood glucose, HRV, menstrual tracking, etc.
* **Docs & Tutorials** – Sample code, videos, and integration guides.

---

## 7. Conclusion

The combination of **NIP-101h** and the upcoming **Stats SDK** will make it trivial to build **interoperable, privacy-centric** health applications on Nostr.  By enforcing encryption-by-default while enabling rich aggregation and visualisation, we put users—not platforms—in control of their most personal data.

Stay tuned, join the discussion, and help shape the future of decentralised health on Nostr! 