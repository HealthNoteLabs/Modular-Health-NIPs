# NIP-101h — Decentralized Health Data on Nostr

## Overview

**NIP-101h** is a modular, privacy-first standard for publishing health and fitness metrics on Nostr. Each metric is its own micro-specification with a dedicated event kind, so apps implement only what they need. Values are encrypted with NIP-44 by default — plaintext never reaches a relay or server — and the data lives in open Nostr events the user controls with their own keys.

This repository holds the protocol specs, developer tooling, and supporting material for the Health Note Labs stack built on top of NIP-101h.

---

## Key Features

- **Modular metrics:** Each metric (weight, steps, pace, etc.) is a separate, standardized Nostr event kind. 14 metrics are defined today.
- **Private by default:** Metric values are encrypted with NIP-44 unless the user opts out. Tags stay unencrypted for timeline and analytics use.
- **Portable:** Export tools validate, decrypt, and write data to CSV, SQLite, or JSON — always client-side, never exposing plaintext to relays or servers.
- **Zero lock-in:** Work directly with Nostr events, or use local CSV/SQL for analysis and migration.
- **Extensible:** New metrics are added through the NIP-101h.X process.

---

## How It Works

### 1. Event Structure

Each health metric is a Nostr event with:
- A unique `kind` (see the metric table below)
- Encrypted `content` (the metric value)
- Standardized `tags` (unit, metric type, timestamp, etc.)

**Example:**
```json
{
  "kind": 1351,
  "content": "70", // Encrypted with NIP-44 by default
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

### 2. Privacy & Encryption

- NIP-44 encryption is the default for all metric values; the keys stay with the user.
- Tags remain unencrypted for search and analytics.
- Users selectively share or keep private each metric.

### 3. Data Export

Tools in `tools/export` load raw Nostr events, validate them against the metric schemas, decrypt locally (never server-side), and write to CSV, SQLite, or JSON.

---

## Supported Metrics & Event Kinds

| Kind  | Metric                | Spec |
|-------|-----------------------|------|
| 1351  | Weight                | [NIP-101h.1](./NIP101h.1.md) |
| 1352  | Height                | [NIP-101h.2](./NIP101h.2.md) |
| 1353  | Age                   | [NIP-101h.3](./NIP101h.3.md) |
| 1354  | Gender                | [NIP-101h.4](./NIP101h.4.md) |
| 1355  | Fitness Level         | [NIP-101h.5](./NIP101h.5.md) |
| 1356  | Workout Intensity     | [NIP-101h.6](./NIP101h.6.md) |
| 1357  | Calories Expended     | [NIP-101h.7](./NIP101h.7.md) |
| 2357  | Calories Consumed     | [NIP-101h.7](./NIP101h.7.md) |
| 1358  | Activity Duration     | [NIP-101h.8](./NIP101h.8.md) |
| 1359  | Step Count            | [NIP-101h.9](./NIP101h.9.md) |
| 1360  | Elevation             | [NIP-101h.10](./NIP101h.10.md) |
| 1361  | Splits                | [NIP-101h.11](./NIP101h.11.md) |
| 1362  | Pace                  | [NIP-101h.12](./NIP101h.12.md) |
| 1363  | Distance              | [NIP-101h.13](./NIP101h.13.md) |
| 1364  | Speed                 | [NIP-101h.14](./NIP101h.14.md) |

See the [NIP-101h Metric Directory](./NIP101h-Directory.md) for the canonical list, and the [main specification](./NIP101h) for the framework.

---

## Repository Layout

| Path | What it is |
|------|------------|
| [`NIP101h`](./NIP101h) | Main NIP-101h framework specification |
| [`NIP101h-Directory.md`](./NIP101h-Directory.md) | Index of all 14 metric specs and their kinds |
| [`NIP101h.1.md`](./NIP101h.1.md) – [`NIP101h.14.md`](./NIP101h.14.md) | Individual metric micro-specifications |
| [`NIP101h-User-Guide.md`](./NIP101h-User-Guide.md) | Constructing, encrypting, publishing, and reading events |
| [`packages/healthnote-api`](./packages/healthnote-api) | HealthNote MCP Server — tools for AI agents to discover kinds, build events, and fetch health data over NIP-101h |
| [`packages/analytics-sdk`](./packages/analytics-sdk) | TypeScript SDK for loading and computing trends over exported metrics |
| [`tools/export`](./tools/export) | CLI to validate, decrypt, and export events to CSV/SQLite/JSON |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Technical architecture of the full stack, layer by layer |
| [`brand/BRAND-KIT.md`](./brand/BRAND-KIT.md) | Brand voice, naming, and visual direction |
| [`brand/WHITEPAPER.md`](./brand/WHITEPAPER.md) | Whitepaper: the case for an open, user-owned health-data standard |
| [`website/index.html`](./website/index.html) | Health Note Labs landing page |

---

## Getting Started

1. **Explore the metrics** — start with the [Metric Directory](./NIP101h-Directory.md).
2. **Implement** — the [User & Implementation Guide](./NIP101h-User-Guide.md) covers constructing, encrypting, publishing, and reading events, plus privacy and consent practices.
3. **Connect an agent** — the [HealthNote MCP Server](./packages/healthnote-api/README.md) exposes NIP-101h to AI agents under the same consent and encryption guarantees.
4. **Export & analyze** — use [`tools/export`](./tools/export) and the [analytics SDK](./packages/analytics-sdk) to validate, transform, and analyze data client-side.

---

## Design Principles

- **User control:** The user holds the keys and decides what to share, with whom.
- **Privacy by default:** Encryption is on unless the user turns it off — enforced by NIP-44, not by policy.
- **Interoperability:** Apps mix and match metrics on a shared open standard.
- **Extensibility:** Anyone can propose a new metric via NIP-101h.X.

---

## Contributing

- Propose new metrics by following the [extension guidelines](./NIP101h).
- Discuss and suggest improvements via issues or pull requests.
- See the [User Guide](./NIP101h-User-Guide.md) for implementation details.

---

## Resources

- [NIP-101h Main Specification](./NIP101h)
- [Metric Directory](./NIP101h-Directory.md)
- [User & Implementation Guide](./NIP101h-User-Guide.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Whitepaper](./brand/WHITEPAPER.md)
- [Brand Kit](./brand/BRAND-KIT.md)
- [Export Tools](./tools/export/README.md)
- [Introductory Article](./articles/Health-Data-Goes-Decentralized.md)
