# NIP-101h Stats & Visualization SDK – Implementation Guide

> Living document – update as milestones are reached, blockers appear, or design choices change.

---

## 1  Strategic Placement – Monorepo vs. Separate Repo

| Option | Pros | Cons | Recommended Stage |
|--------|------|------|--------------------|
| **A – Same repo** | • Re-uses existing build & CI.<br>• Easy cross-linking with spec docs.<br>• Fast iteration while spec is fluid. | • Bigger checkout size for SDK-only consumers. | _Incubation (now → v0.x)_ |
| **B – Separate repo** | • Clearer NPM boundaries.<br>• Lightweight clone for consumers.<br>• Independent release cadence. | • Extra CI plumbing.<br>• Cross-repo PRs for spec changes. | _After v1.0 stabilises_ |

**Approach:** Incubate under `/packages/analytics-sdk/` in this repo.  Once stable, `git filter-repo` or fork the directory out; NPM package name remains the same.

---

## 2  High-Level Milestones

| Phase | Description | Key Deliverables |
|-------|-------------|------------------|
| **0** | **Monorepo prep** | • Root `package.json` with workspaces<br>• Convert `tools/export` to workspace package |
| **1** | **Read-only SDK core** (`@nip101h/analytics`) | • JSON/CSV/SQLite loaders<br>• Schema validation wrappers<br>• `toTimeSeries`, `groupByBucket` helpers |
| **2** | **Aggregation CLI mode** (`nip101h-export --stats`) | • Generates tidy time-series JSON/CSV<br>• Aggregation JSON Schema in `/schemas/` |
| **3** | **Starter viz assets** | • Vega-Lite template specs<br>• Jupyter / Observable notebooks |
| **4** | **Privacy-preserving preview** | • `normalise()` helpers (`zscore`, `%`)<br>• `<nip101h-preview-chart>` web component |
| **5** | **BI-friendly drops** | • SQLite views (`*_daily_avg`)<br>• Metabase / Superset starter dashboards |

---

## 3  Package / Directory Layout (monorepo)

```text
/tools/export/               # existing CLI
/packages/
  analytics-sdk/
    src/
      index.ts
      loaders/
      transforms/
      privacy/
      templates/
    tests/
  preview-web/               # optional web components pkg
    src/…
/schemas/
  aggregations.schema.json
/templates/
  vega-lite/
```

---

## 4  Core SDK API Sketch

```ts
import {
  loadEvents,
  toTimeSeries,
  groupByBucket,
  normalise,
} from "@nip101h/analytics";

const events = await loadEvents("export/events.json");
const series = toTimeSeries(events, { metricKind: 1351 });
const daily = groupByBucket(series, { bucket: "day", aggregate: "avg" });
const masked = normalise(daily, { method: "zscore" });
// feed `masked` into Vega-Lite / Chart.js / ECharts
```

Design choices:
- Pure functions returning POJOs/arrays – zero friction for D3, ECharts, etc.
- Overloads accept raw events **or** pre-aggregated rows.
- Ship `.d.ts` types for first-class TypeScript support.

---

## 5  Standard Interchange Formats

| Format | Purpose | Notes |
|--------|---------|-------|
| **Tidy Time-Series JSON** | Default from `--stats`; ready for Vega-Lite | `[ { date:"2025-05-01", value:70.2, encrypted:true }, … ]` |
| **CSV Column Convention** | Spreadsheet & BI tools | `date,metric_kind,value,unit,encrypted,source,…` |
| **SQLite Views** | BI dashboards, SQL clients | `weight_daily_avg`, `steps_daily_sum`, … |
| **Aggregation JSON Schema** | Contract for downstream tools | Published under `/schemas/aggregations/` |
| **Vega-Lite Templates** | Quick chart prototypes | Templates with `$dataset` placeholder |

---

## 6  NPM & Versioning Strategy

- Publish as **`@nip101h/analytics`** (scoped).
- Semantic versioning (`semver`).
- CLI pins to compatible `^major` of SDK.
- Once mature, repo split won't break consumers (publish path unchanged).

---

## 7  Tooling & CI

- **Vitest** for unit & property-based tests.
- **ESLint + Prettier** workspace-wide.
- **Typedoc** auto-generates API docs.
- **GitHub Actions** matrix (`node@18`, `node@20`) with auto-publish on tag.

---

## 8  Next Concrete Steps

1. Convert repository to NPM workspaces; move export tool accordingly.
2. Scaffold `packages/analytics-sdk` (ts-dx/tsup template).
3. Implement minimal loader + `toTimeSeries` for **weight** metric.
4. Wire `--stats` flag in CLI → SDK; emit JSON & CSV.
5. Draft JSON Schema & Vega-Lite template; commit under `/schemas/` & `/templates/`.
6. Iterate on additional metrics, bucket aggregations, and privacy helpers.
7. Document usage examples; release **`@nip101h/analytics@0.1.0-beta`**.

---

## 9  Changelog snippet (keep updating)

| Date | Change |
|------|--------|
| 2025-05-11 | Initial guide created – scoped milestones & layout | 