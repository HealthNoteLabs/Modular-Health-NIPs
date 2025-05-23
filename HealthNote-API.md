# HealthNote API Specification

*Status: Draft*

This document defines the **HealthNote API** — a privacy-preserving analytics service built around the NIP-101h health-metric standard.  The service enables developers to draw trends, generate charts, and compute correlations **without ever exposing individual users' raw data**.

---
## 1. Objectives
1. Offer simple, chart-ready endpoints for time-series, distributions, and correlations.
2. Guarantee that no endpoint leaks a single user's metric value.
3. Support the NIP-101h consent model and encourage *aggregate-only* sharing by default.
4. Complement, not replace, the client-side NIP-101h SDK.

---
## 2. Consent Semantics
| Tag value                    | Meaning                                                                          |
|------------------------------|----------------------------------------------------------------------------------|
| `public`                     | Raw events may be read by anyone. **Rare.**                                      |
| `private`                    | Do **not** send to HealthNote; store locally only.                               |
| `aggregate-only` *(default)* | May be forwarded to HealthNote for statistical use **only**; no raw reads allowed. |

*Events with no `consent` tag are treated as `aggregate-only` by the SDK.*

---
## 3. Data Flow
1. **Client SDK** validates & encrypts the full NIP-101h event (NIP-44).
2. SDK extracts a *stat-blob* containing only: `{kind, value, unit, created_at}` plus required meta tags.
3. SDK POSTs the stat-blob to `POST /ingest` with a per-user token.
4. Backend inserts the stat-blob into the analytics store.  No raw content is ever stored.
5. Users can revoke consent by sending a `DELETE /ingest/{event_id}` or publishing an updated event with `status=deleted`.

---
## 4. Privacy Guarantees
* k-anonymity ≥ **5** for every bucket returned.
* Differential-privacy (ε-DP) noise added when buckets are near the threshold or when requested via query (`epsilon` parameter).
* Rate-limiting & audit logs prevent reconstruction attacks.
* All traffic over TLS 1.3.

---
## 5. Authentication
* OAuth 2.0 Bearer tokens issued per developer.
* Stat-blobs signed by the user's Nostr key to prove data ownership.

---
## 6. Endpoints
### 6.1 `GET /metrics`
Returns metadata about available NIP-101h metrics.

```
200 OK
[
  {
    "metric": "weight",
    "kind": 1351,
    "canonical_unit": "kg",
    "optional_tags": ["converted_value", "timestamp", "accuracy"],
    "consent_default": "aggregate-only",
    "ethos": "Encrypt by default; share only derived stats."
  },
  ...
]
```

### 6.2 `POST /ingest`
Submit an array of stat-blobs.

Body JSON schema:
```json
{
  "type": "array",
  "items": {
    "type": "object",
    "required": ["id", "pubkey", "kind", "value", "unit", "created_at"],
    "properties": {
      "id": {"type": "string"},
      "pubkey": {"type": "string"},
      "kind": {"type": "integer"},
      "value": {"type": "number"},
      "unit": {"type": "string"},
      "created_at": {"type": "integer"},
      "accuracy": {"type": "string"},
      "status": {"type": "string"}
    }
  }
}
```

### 6.3 `GET /trend`
Returns aggregated buckets for a single metric.

Query parameters:
* `kind` (**required**) – NIP-101h kind number.
* `bucket` – `hour|day|week|month|year` (default `day`).
* `stat` – `mean|median|p50|p95|max|min|sum|count` (default `mean`).
* `epsilon` – DP noise level, `0 < ε ≤ 1` (optional).

Example response:
```json
{
  "kind": 1359,
  "bucket": "day",
  "stat": "mean",
  "epsilon": 0.5,
  "k_anonymity": 5,
  "series": [
    {"date": "2025-05-01", "value": 10250, "dp_noise": 40},
    {"date": "2025-05-02", "value": 9850,  "dp_noise": -35}
  ]
}
```

### 6.4 `GET /correlate`
Compute correlation between two kinds.

Parameters:
* `x`, `y` – kind numbers.
* `bucket` – time bucket (same as `/trend`).

Response:
```json
{
  "x": 1357,
  "y": 1359,
  "bucket": "week",
  "n": 428,
  "r": 0.71,
  "slope": 0.0021,
  "epsilon": 0.5
}
```

### 6.5 `GET /distribution`
Histogram / CDF for one metric.

Parameters:
* `kind` – kind number.
* `bins` – number of histogram buckets (default 20).

---
## 7. Error Codes
| Code | Meaning                                      |
|------|----------------------------------------------|
| 400  | Invalid query or body.                       |
| 401  | Bad or missing auth token.                   |
| 403  | Consent disallows requested operation.       |
| 429  | Rate-limit exceeded.                         |
| 500  | Server error.                                |

---
## 8. SDK Integration
The official NIP-101h JS/TS SDK adds:
```ts
import { ingest, queryTrend, correlate } from '@nip101h/sdk-analytics';

// Record event as usual
await publishWeight(70, 'kg');

// Push stat-blob automatically
await ingest();

// Later, fetch data for chart
const weightSeries = await queryTrend({ kind: 1351, bucket: 'day' });
```

---
## 9. Versioning & Stability
* **v0.1**: current draft – subject to change.
* Breaking changes bump the minor version; non-breaking add patch.
* Version is reflected in the base URL (`/v0.1/...`).

---
## 10. Security Considerations
* Keys isolated per user; rotated quarterly.
* No raw metric value ever leaves the secure boundary.
* Differential-privacy calibration audited bi-annually by third-party.

---
## 11. Appendix A – Stat-Blob Example
```json
{
  "id": "event_id1",
  "pubkey": "npub1...",
  "kind": 1351,
  "value": 70,
  "unit": "kg",
  "created_at": 1672531200,
  "accuracy": "estimate",
  "status": "active"
}
```

---
## 12. Appendix B – Differential-Privacy Primer
The API leverages the Laplace mechanism with scale `b = ∆f / ε`, where ∆f is
1 for `count` queries and the observed metric range for numeric queries.
Developers may opt-in to stricter privacy budgets by passing `epsilon` in the
query string. 