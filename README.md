# Modular-Health-NIPs: NIP-101h for Decentralized Health Data on Nostr

## Overview

**NIP-101h** is a modular, privacy-first framework for sharing health and fitness metrics on the decentralized Nostr protocol. It empowers users to control their health data, enables developers to build interoperable apps, and supports granular, extensible health metrics—each as its own micro-specification.

---

## Key Features

- **Modular Health Metrics:** Each health metric (weight, steps, calories, etc.) is a separate, standardized Nostr event kind. Apps can implement only what they need.
- **Privacy by Default:** All metric values are encrypted using NIP-44 unless the user opts out. Tags remain searchable for timeline and analytics use.
- **Data Portability:** Export tools allow users to validate, decrypt, and export their data to formats like CSV, SQLite, or JSON—always client-side, never exposing plaintext to relays or servers.
- **Zero Lock-In:** Work directly with Nostr events, or use local CSV/SQL for analysis and migration.
- **Extensible:** New metrics are easy to add via the NIP-101h.X extension process.

---

## How It Works

### 1. Event Structure

Each health metric is a Nostr event with:
- A unique `kind` (see below for all currently defined kinds)
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

- **NIP-44 encryption** is recommended for all metric values.
- Tags remain unencrypted for search and analytics.
- Users can selectively share or keep private each metric.

### 3. Data Export

- Tools in `/tools/export` allow:
  - Loading raw Nostr events from a folder
  - Validating against metric schemas
  - Local decryption (never server-side)
  - Exporting to CSV, SQLite, or JSON

---

## Supported Metrics & Event Kinds

Below are all currently defined metrics and their event kinds:

### | Kind  | Metric Name         | Description |
|-------|----------------------|-------------|
| 1351  | **Weight**           | Body weight in kg or lb. [Spec](./NIP101h.1.md) |
| 1352  | **Height**           | Height in cm or imperial. [Spec](./NIP101h.2.md) |
| 1353  | **Age**              | Age in years (optionally with DOB). [Spec](./NIP101h.3.md) |
| 1354  | **Gender**           | Gender identity (string, e.g., male/female/other). [Spec](./NIP101h.4.md) |
| 1355  | **Fitness Level**    | Fitness level (e.g., beginner/intermediate/advanced). [Spec](./NIP101h.5.md) |
| 1356  | **Workout Intensity**| Intensity of workout (RPE 1-10 or keyword). [Spec](./NIP101h.6.md) |
| 1357  | **Calories Expended**| Calories burned (kcal). [Spec](./NIP101h.7.md) |
| 2357  | **Calories Consumed**| Calories consumed (kcal). [Spec](./NIP101h.7.md) |
| 1358  | **Activity Duration**| Duration of an activity (seconds/minutes/hours). [Spec](./NIP101h.8.md) |
| 1359  | **Step Count**       | Step count for a period (daily/hourly/etc). [Spec](./NIP101h.9.md) |
| 1360  | **Elevation**        | Elevation gain/loss/altitude (m/ft). [Spec](./NIP101h.10.md) |

For details and examples, see the [NIP-101h Metric Directory](./NIP101h-Directory.md).

---

## Getting Started

### 1. Explore the Metrics

See the [NIP-101h Metric Directory](./NIP101h-Directory.md) for all available metrics and their specifications.

### 2. Implementation Guide

- See the [User & Implementation Guide](./NIP101h-User-Guide.md) for:
  - How to construct, encrypt, and publish events
  - How to read, decrypt, and interpret events
  - Best practices for privacy and user consent

### 3. Export & Interoperability

- Use the export tools to:
  - Validate and transform your health data
  - Export for use in Excel, SQLite, or other apps
  - Integrate with personal data servers (e.g., Blossom)

---

## Philosophy

- **User Control:** You decide what to share, with whom, and how.
- **Interoperability:** Apps can mix and match metrics, building on a universal, open standard.
- **Privacy:** Encryption is the default, not the exception.
- **Extensibility:** Anyone can propose and add new health metrics.

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
- [Export Tools](./tools/export/README.md) (if available)
- [Introductory Article](./articles/Health-Data-Goes-Decentralized.md)

---

**NIP-101h is reshaping health data: open, private, and user-controlled. Join us in building the future of decentralized health!**

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
