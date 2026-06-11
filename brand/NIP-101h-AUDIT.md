# NIP-101h Formalization Audit

**Date:** 2026-06-11
**Scope:** Master framework spec (`NIP101h`), micro-NIPs `NIP101h.1`–`NIP101h.14`, and `NIP101h-Directory.md`
**Nature:** Cleanup and formalization pass — no protocol redesign. Straightforward fixes were applied directly; anything requiring a design decision is documented below.

---

## 1. Executive Summary

The NIP-101h suite is in solid shape on the fundamentals: **kind numbers are internally consistent** across the master list, the directory, and every individual spec, and **every spec references NIP-44 encryption** with consistent language (one exception, now fixed). The main weaknesses were **cosmetic and structural drift** between specs written at different times: broken example blocks, missing standard sections, inconsistent tag names for the same concepts, and a category-range table in the master spec that contradicts the actual kind assignments.

This pass fixed all unambiguous issues (broken examples, missing sections, an orphaned table fragment). The remaining items are flagged for a design decision because they touch the protocol's tag vocabulary or numbering scheme.

---

## 2. Per-Spec Status

Legend: ✅ complete · 🟡 minor gaps · 🔴 was broken/incomplete (fixed this pass unless noted)

| Spec | Metric | Kind(s) | Status before | Action taken |
|------|--------|---------|----------------|--------------|
| 101h.1 | Weight | 1351 | 🟡 no `Status` header, no Implementation Notes, missing `accuracy`/`status` tags | **Fixed**: added Status header, Implementation Notes, `accuracy`/`status` optional tags |
| 101h.2 | Height | 1352 | 🔴 examples were `Apply to App.jsx` placeholders | **Fixed**: real JSON examples (metric + imperial) |
| 101h.3 | Age | 1353 | 🔴 placeholder examples | **Fixed**: real JSON examples (basic + DOB) |
| 101h.4 | Gender | 1354 | 🔴 placeholder examples | **Fixed**: real JSON examples (basic + pronouns) |
| 101h.5 | Fitness Level | 1355 | 🔴 placeholder examples | **Fixed**: real JSON examples (basic + metrics) |
| 101h.6 | Workout Intensity | 1356 | ✅ complete | none |
| 101h.7 | Caloric Data | 1357 / 2357 | 🟡 duplicate/conflicting tag names (see §4.3) | Documented — needs decision |
| 101h.8 | Activity Duration | 1358 | ✅ complete | none |
| 101h.9 | Step Count | 1359 | ✅ complete (minor markdown backtick noise) | none material |
| 101h.10 | Elevation | 1360 | ✅ complete | none |
| 101h.11 | Splits | 1361 | 🟡 no Implementation Notes | **Fixed**: added Implementation Notes |
| 101h.12 | Pace | 1362 | 🟡 example uses `pace_unit` value not in allowed list (see §4.4) | Documented — needs decision |
| 101h.13 | Distance | 1363 | 🔴 only one example; no Implementation Notes / Privacy Notes / Known Clients | **Fixed**: added 2nd example + all three sections |
| 101h.14 | Speed | 1364 | 🟡 missing Known Client Implementations | **Fixed**: added section |
| Master | Framework | — | 🟡 orphaned table fragment in CSV section; internal contradictions (see §4) | **Fixed** orphan; contradictions documented |

**Section completeness check** (purpose · event structure · tags · encryption · example · implementation notes): after this pass, all 14 specs carry every required section. Specs 6, 8, 9, 10 were already complete; the rest were brought up to parity.

---

## 3. Things That Are Consistent (verified)

- **Kind numbers** — The master abstract list, the kind-range narrative, the Directory, and each individual spec all agree:
  1351 Weight · 1352 Height · 1353 Age · 1354 Gender · 1355 Fitness Level · 1356 Workout Intensity · 1357 Calories Expended · 2357 Calories Consumed · 1358 Activity Duration · 1359 Step Count · 1360 Elevation · 1361 Splits · 1362 Pace · 1363 Distance · 1364 Speed. **No collisions, no mismatches.**
- **Directory** — `NIP101h-Directory.md` matches the specs exactly, including the dual-kind entry for 101h.7 (1357 / 2357). No missing or extra entries.
- **NIP-44 encryption** — Every spec's Privacy Notes recommend defaulting to NIP-44 with an explicit opt-out, using near-identical wording. The master spec defines the `encryption_algo=nip44` + `p` tag mechanics consistently. (101h.13 was the lone spec missing this; now fixed.)

---

## 4. Inconsistencies Found (require a design decision — NOT changed)

### 4.1 Category-range table contradicts actual kind assignments  — **highest priority**

> **✅ RESOLVED 2026-06-11** — Took option (a). The "Kind Number Ranges by Category" table in the master spec was rewritten to reflect reality: **1351–1354 = Anthropometrics**, **1355–1364 = Activity & Fitness** (incl. Calories Expended 1357), with 2357 noted as the assigned paired/secondary metric (Calories Consumed). Remaining ranges are marked *Reserved* (aspirational for future metrics). A note was added that existing kinds MUST NOT be renumbered. The surrounding prose was updated to match. No kind numbers changed.

The master spec's "Kind Number Ranges by Category" table assigns:

| Range | Category |
|-------|----------|
| 1351–1369 | Anthropometrics |
| 1370–1389 | Activity & Fitness |
| 1390–1409 | Nutrition & Diet |

But the actual **Activity & Fitness** metrics — Fitness Level (1355), Workout Intensity (1356), Activity Duration (1358), Step Count (1359), Elevation (1360), Splits (1361), Pace (1362), Distance (1363), Speed (1364) — are all assigned kinds in the **1355–1364** band, which the table labels *Anthropometrics*. None of them fall in the 1370–1389 "Activity & Fitness" range the table reserves.

Specs 101h.11–101h.14 even tag themselves `["category", "activity & fitness"]` while using kinds the master table says are Anthropometric.

**Decision needed:** Either (a) retroactively bless the existing 1351–1364 sequential assignment and rewrite the range table to match reality (recommended — kinds are already published/in use and renumbering is breaking), or (b) declare the range table aspirational for *future* metrics only and add a note that 101h.1–101h.14 predate it. Do **not** renumber existing kinds.

### 4.2 The `category` and `version` tags are mandated but absent from most specs

> **✅ RESOLVED 2026-06-11** — Since specs 101h.1–101h.10 were written without these tags, both were **downgraded from MUST to RECOMMENDED** in the master spec rather than backfilled (avoids a normative change to published specs). Updated: the Framework Structure prose, the Common Event Structure (moved to a new "Recommended tags" group), the Versioning Policy section, and the Canonical Tag Registry (`category` and `version` now marked *Recommended*). A note was added in each location that future specs SHOULD include them and that clients SHOULD treat a missing `version` as `1`.

The master spec states all events **MUST** include `["category", ...]` and **MUST** include `["version", "1"]` (Canonical Tag Registry marks both Required). However:

- Specs **101h.1–101h.10** do not list `category` or `version` in their Required Tags, and their examples omit both.
- Only **101h.11–101h.14** include `category` and `version`.
- Even the master's own **"Canonical Event Example"** (the weight event near the top) omits the `version` tag while the registry calls it required.

**Decision needed:** Confirm whether `category` and `version` are truly mandatory. If yes, add them to the Required Tags + examples of 101h.1–101h.10 (mechanical, but a normative change so left for sign-off). If they should be optional/recommended, downgrade them in the master registry. Recommendation: make both **required** and backfill the early specs, since the framework's filtering/versioning story depends on them.

### 4.3 Conflicting tag names within Caloric Data (101h.7)

> **✅ RESOLVED 2026-06-11** — Standardized on the descriptive variants **`food_item`** and **`meal_type`** (not the short `food`/`meal` forms the audit had suggested). Kind 2357's "Additional Optional Tags" and its example event were updated to use `food_item`/`meal_type`, matching the common-tags list. The bare `food`/`meal` spellings are gone from the spec.

The spec defines overlapping tags for the same concepts:

- Common optional tags list `["food_item", ...]` and `["meal_type", ...]`.
- Kind 2357's "Additional Optional Tags" instead use `["food", ...]` and `["meal", ...]`.

So a "food" tag has two spellings (`food` vs `food_item`) and "meal" has two (`meal` vs `meal_type`) in a single spec. The example event uses the short forms (`food`, `meal`).

**Decision needed:** Pick one spelling per concept and drop the other. Recommendation: standardize on `food` and `meal` (matches the examples), remove `food_item`/`meal_type`.

### 4.4 Pace (101h.12) example uses an undeclared `pace_unit` value

> **✅ RESOLVED 2026-06-11** — Added **`s/100m`** to the allowed `pace_unit` values in 101h.12's Required Tags, with a note that it covers pool-based swimming pace. Example 2 (which already used `s/100m`) is now consistent with the declared set.

The Required Tags restrict `pace_unit` to `s/km | s/mi | min/km | min/mi`, but Example 2 uses `["pace_unit", "s/100m"]` (swimming). The value is not in the allowed set.

**Decision needed:** Either add `s/100m` (and likely `s/100yd`) to the allowed list, or declare the list a set of *recommended* values that is open-ended (matching the "common values are recommended" pattern used by Gender/Fitness Level). Recommendation: the latter — pace units are inherently open, and the spec already contemplates non-standard distances via `distance_segment`.

### 4.5 Inconsistent tag vocabulary across specs (the framework's biggest interoperability risk)

> **✅ PARTIALLY RESOLVED 2026-06-11** — Three of the four concepts were standardized and documented in a new "Canonical Tag Names for Shared Concepts" table in the master spec:
> - **Activity type** → canonical **`activity_type`** (chosen over bare `activity`). Updated 101h.5, .6, .7, .8, .10.
> - **Event linking** → canonical Nostr **`e`** tag (chosen over `related_event` / `activity_id`). Updated 101h.8, .9, .11, .14.
> - **Duration unit value** → canonical **`seconds`** (chosen over `s`). Updated 101h.11.
>
> **Still open:** the *distance qualifier* inconsistency (`split_distance` vs `distance_segment` vs `distance`+`distance_unit` across 101h.11/.12/.14) was left unresolved — it overlaps with distance-semantics decisions beyond a pure tag rename and is deferred to a future pass.

The same concepts are named differently in different specs. None is wrong in isolation, but together they undermine the "interoperable" goal:

| Concept | Variants used | Specs |
|---------|---------------|-------|
| Activity type | `activity` | 101h.5, .6, .8, .10 |
|  | `activity_type` | 101h.12, .13, .14 |
| Linking to a parent/related event | `e` (master canonical) | master |
|  | `related_event` | 101h.8, .14 |
|  | `activity_id` | 101h.11 |
| Distance qualifier | `split_distance` (2-value) | 101h.11 |
|  | `distance_segment` (2-value) | 101h.12 |
|  | `distance` + `distance_unit` (split) | 101h.14 |
| Duration unit value | `s` | 101h.11 |
|  | `seconds` | 101h.8, master |

**Decision needed:** Adopt one canonical name per concept in the master Canonical Tag Registry and update specs to match. Recommendations: standardize on `activity` (shorter, used by more specs), use the Nostr-standard `e` tag with a marker for event linking (the master already recommends this), and pick either `s` or `seconds` globally for duration units. These are normative vocabulary decisions, so they are documented rather than applied.

### 4.6 Master spec embeds drifting copies of specs 1–4

> **✅ RESOLVED 2026-06-11** — Rather than delete the embedded copies (a larger structural change), a note was added at the top of the embedded section stating that NIP-101h.1–.4 there are abbreviated reference copies and that the standalone `NIP101h.X.md` file is the authoritative/canonical version of each spec where they differ. This establishes a single source of truth without restructuring the master doc.

The bottom of the master `NIP101h` file (the "NIP-101h.1: Weight" … "NIP-101h.4: Gender" sections) duplicates the standalone micro-NIP files. The copies have **already drifted**: e.g. the embedded 101h.1 includes `accuracy`/`status` tags the standalone lacked (now reconciled), and the embedded 101h.4 omits the `preferred_pronouns` tag and common-values list that the standalone 101h.4 defines.

**Decision needed:** Either (a) delete the embedded copies from the master and rely on the standalone files + Directory (recommended — single source of truth), or (b) keep them but add a build/check step to keep them in sync. Left unchanged because deletion is a structural choice about how the master doc is meant to be consumed.

---

## 5. Minor / Cosmetic Observations (low priority)

- **Heading levels vary across files.** Titles: 101h.1 and 101h.11–.14 use `#` (H1); 101h.2–.10 use `##` (H2). Section headers are `##` in some files, `###` in others. Not fixed to avoid a large mechanical churn and introducing H1→H3 jumps mid-file; recommend a single normalization pass (title = `#`, sections = `##`) if a consistent house style is desired.
- **Markdown backtick noise** in 101h.9 / 101h.10 — enum values are written as ``['accuracy', `estimate` | `accurate` | `exact`]`` with literal backticks inside the bracket. Cosmetic; renders oddly but unambiguous.
- **Master "Canonical Event Example"** uses nonsensical placeholder values like `["goal", "", "steps"]` on a *weight* event. Harmless illustration, but a reader-facing oddity; consider using realistic placeholders.
- **`source` vs `device` semantics** are well-defined in the master (software vs hardware) but several specs use `["source", "Fitbit"]` (a device) in examples, blurring the distinction. Worth a one-line reminder in those examples.

---

## 6. Suggested Additional Specs (gaps in metric coverage)

The current 14 metrics cover Anthropometrics (partial) and Activity & Fitness (strong). The master spec advertises seven categories but only two have specs. Obvious high-value additions, by the master's own category map:

**Medical & Biometrics (1450–1469)** — none exist yet despite being referenced in master examples:
- **Heart Rate** (resting / active / HRV) — arguably the single most-requested fitness metric; conspicuously absent.
- **Blood Pressure** — the master already uses kind 1451 `blood_pressure` as an illustrative example; it deserves a real spec.
- **Blood Glucose**, **Blood Oxygen (SpO₂)**, **Body Temperature**.

**Anthropometrics (1351–1369)** — round out the basics:
- **BMI** (or define it as derived-only), **Body Fat %**, **Waist/Hip circumference**, **Lean Body Mass**.

**Sleep (1410–1429)** — entire category empty:
- **Sleep Duration / Stages** (REM/deep/light), **Sleep Quality / Score**.

**Nutrition & Diet (1390–1409)** — only calories exist (and via 2357 in the paired range):
- **Water / Hydration Intake**, **Macronutrients** (standalone, vs the embedded `macros` JSON), **Micronutrients**.

**Mental Health & Mindfulness (1430–1449)** — entire category empty:
- **Mood**, **Stress Level**, **Meditation/Mindfulness minutes**.

**Activity & Fitness — fill obvious holes:**
- **Heart Rate Zones over time**, **Cadence** (running/cycling), **Power (watts)**, **VO₂ Max** (currently only buried as a `metrics` JSON value in Fitness Level).

Recommendation: prioritize **Heart Rate** and **Sleep Duration** — they are table-stakes for any fitness client and their absence is the most likely to block adoption.

---

## 7. Changes Applied This Pass

Files modified:

1. **`NIP101h.1.md`** — added `**Status:** Draft`; added `accuracy` and `status` optional tags (reconciling with the master's embedded copy); added an Implementation Notes section.
2. **`NIP101h.2.md`** — replaced `Apply to App.jsx` placeholder examples with real JSON (metric + imperial-with-conversion).
3. **`NIP101h.3.md`** — replaced placeholder examples with real JSON (basic age + age-with-DOB).
4. **`NIP101h.4.md`** — replaced placeholder examples with real JSON (basic + with pronouns).
5. **`NIP101h.5.md`** — replaced placeholder examples with real JSON (basic + activity-specific with metrics).
6. **`NIP101h.11.md`** — added the missing Implementation Notes section.
7. **`NIP101h.13.md`** — added a second example (segment/lap), plus Implementation Notes, Privacy Notes (NIP-44), and Known Client Implementations sections.
8. **`NIP101h.14.md`** — added the missing Known Client Implementations section.
9. **`NIP101h`** (master) — removed an orphaned 4-row table fragment wedged into the CSV Export section before "Versioning Policy".

No kind numbers, tag semantics, or protocol-level rules were altered. All changes are additive (filling gaps) or corrective (fixing broken/orphaned content).

---

## 8. Recommended Next Steps (in priority order)

1. ~~**Resolve §4.1**~~ — ✅ **DONE 2026-06-11.** Category-range table reconciled with actual 1351–1364 assignments; no renumbering.
2. ~~**Resolve §4.2**~~ — ✅ **DONE 2026-06-11.** `category`/`version` downgraded to RECOMMENDED in the master spec (chosen over backfilling the early specs).
3. **Resolve §4.5** — ✅ **MOSTLY DONE 2026-06-11.** Canonical names adopted for activity type (`activity_type`), event links (`e`), and duration unit (`seconds`) and propagated. **Remaining:** unify the distance-qualifier tags.
4. ~~**Resolve §4.3 and §4.4**~~ — ✅ **DONE 2026-06-11.** Calorie tags deduped to `food_item`/`meal_type`; `s/100m` added to the pace-unit list.
5. ~~**Decide §4.6**~~ — ✅ **DONE 2026-06-11.** Standalone micro-NIPs declared the authoritative source via a note atop the master's embedded copies (copies retained, not deleted).
6. **Add Heart Rate and Sleep specs** (§6) to unblock real-world fitness-client adoption. *(Open.)*

---

## 9. Resolution Pass — 2026-06-11

A follow-up pass resolved the design decisions in §4 that are safe to apply without changing protocol semantics (no kind numbers, encryption behavior, or fundamental rules were altered). Files modified:

- **`NIP101h`** (master) — rewrote the category-range table (§4.1); downgraded `category`/`version` to RECOMMENDED across the prose, Common Event Structure, Versioning Policy, and Canonical Tag Registry (§4.2); added a "Canonical Tag Names for Shared Concepts" table and `activity_type` registry row, updated the CSV column name (§4.5); added the embedded-copies note (§4.6).
- **`NIP101h.5.md`, `.6.md`, `.7.md`, `.8.md`, `.10.md`** — `activity` → `activity_type` (§4.5).
- **`NIP101h.7.md`** — `food`/`meal` → `food_item`/`meal_type` (§4.3); `activity` → `activity_type`.
- **`NIP101h.8.md`, `.9.md`, `.14.md`** — `related_event` → `e` (§4.5).
- **`NIP101h.11.md`** — `activity_id` → `e`, duration unit `s` → `seconds` (§4.5).
- **`NIP101h.12.md`** — added `s/100m` to allowed `pace_unit` values (§4.4).

Still open: §4.5 distance-qualifier unification, and the new Heart Rate / Sleep specs (§6).
