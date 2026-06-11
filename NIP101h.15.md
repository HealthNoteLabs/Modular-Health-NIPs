# NIP-101h.15: Heart Rate

**Status:** Draft

## Description
This NIP defines the format for storing and sharing heart rate data on Nostr, including resting heart rate, workout heart rate, time spent in heart rate zones, and heart rate variability (HRV). It is designed to capture data from consumer wearables such as Apple Watch, Garmin, Fitbit, Whoop, and Oura, covering both continuous/daily monitoring and workout-specific measurements.

Heart rate is one of the most widely measured biometrics across the wearable ecosystem, and it underpins higher-level concepts such as training load, recovery, and cardiovascular fitness. Standardizing it enables interoperability between fitness, recovery, and medical clients.

## Event Kind: 1365

## Content
The `content` field MUST contain the primary numeric heart rate value, in beats per minute (bpm), as a string. The meaning of this value is declared by the `measurement_type` tag. If `measurement_type` is omitted, `content` represents an average heart rate.

Heart rate variability (HRV) is NOT carried in `content` (it uses a different unit); it is provided via the `hrv` tag described below.

## Required Tags
- [`unit`, `bpm`] – Unit of measurement for the value in `content`. Heart rate is always expressed in beats per minute.
- [`t`, `health`] – General categorisation tag.
- [`t`, `heart_rate`] – Metric-specific tag.

## Recommended Tags
- [`category`, `medical & biometrics`] – Top-level category name. RECOMMENDED per the NIP-101h framework.
- [`version`, `1`] – Protocol version. RECOMMENDED; clients SHOULD treat a missing `version` as `1`.

## Optional Tags
- [`measurement_type`, `resting` | `average` | `max` | `min` | `continuous` | `workout`] – What the value in `content` represents. Defaults to `average` if omitted.
  - `resting`: resting heart rate (e.g., a daily resting HR reading)
  - `average`: average heart rate over the measurement period
  - `max`: maximum heart rate observed during the period
  - `min`: minimum heart rate observed during the period
  - `continuous`: an instantaneous/spot reading from continuous monitoring
  - `workout`: average heart rate for a specific workout (use with `activity_type` and/or an `e` link to the session)
- [`resting_hr`, numeric-string] – Resting heart rate (bpm) associated with this event or day.
- [`avg_hr`, numeric-string] – Average heart rate (bpm) over the period.
- [`max_hr`, numeric-string] – Maximum heart rate (bpm) observed during the period.
- [`min_hr`, numeric-string] – Minimum heart rate (bpm) observed during the period.
- [`hrv`, numeric-string, `ms`] – Heart rate variability value with its unit (typically milliseconds).
- [`hrv_method`, `rmssd` | `sdnn` | `pnn50` | string] – The HRV computation method. RMSSD is the most common on consumer wearables. RECOMMENDED whenever `hrv` is present.
- [`hr_zone`, zone-number-string, seconds-string, lower-bpm-string, upper-bpm-string] – Time spent in a single heart rate zone. Repeat this tag once per zone. `seconds` is the time in that zone; `lower-bpm`/`upper-bpm` are the zone boundaries (optional but RECOMMENDED). See Implementation Notes for the canonical 5-zone model.
- [`hr_zone_system`, `5-zone` | string] – The zone model used. Defaults to `5-zone` (percentage of max HR) when `hr_zone` tags are present.
- [`max_hr_reference`, numeric-string] – The maximum heart rate (bpm) used as the basis for zone calculations (measured or estimated, e.g., 220 − age).
- [`activity_type`, string] – Activity during which the heart rate was recorded (e.g., `running`, `cycling`, `strength`), for workout measurements.
- [`measurement_context`, `daily` | `sleep` | `workout` | `recovery` | `spot`] – Context in which the data was captured.
- [`timestamp`, ISO8601-datetime] – When the measurement was taken, or the end instant of the measurement period.
- [`start_time`, ISO8601-datetime] – Start instant of the measurement period (helpful for averages and zone totals).
- [`period`, `daily` | ISO8601-duration-string] – Duration the measurement applies to (e.g., `PT45M` for a 45-minute workout, `daily` for a day summary).
- [`granularity`, `raw` | `per_second` | `per_minute` | `per_hour` | `daily`] – Sampling/aggregation level of the data.
- [`source`, application-name] – Source application or service (e.g., `WhoopApp`).
- [`device`, device-name] – Physical device that recorded the data (e.g., `Apple Watch Series 9`, `Garmin Fenix 7`, `Oura Ring Gen3`).
- [`entry_method`, `manual` | `automated_device` | `automated_app` | `user_edited`] – How the data entered the system.
- [`e`, <event_id>] – Event ID of a broader workout/session summary this measurement belongs to.
- [`accuracy`, `estimate` | `accurate` | `exact`] – Measurement accuracy. Defaults to `estimate`.
- [`status`, `active` | `deleted` | `invalid`] – Event status. Defaults to `active`.

## Examples

```json
// Example 1: Daily resting heart rate with HRV (recovery tracking)
{
  "kind": 1365,
  "content": "52",
  "tags": [
    ["unit", "bpm"],
    ["t", "health"],
    ["t", "heart_rate"],
    ["category", "medical & biometrics"],
    ["measurement_type", "resting"],
    ["measurement_context", "daily"],
    ["resting_hr", "52"],
    ["hrv", "68", "ms"],
    ["hrv_method", "rmssd"],
    ["period", "daily"],
    ["timestamp", "2025-06-11T07:30:00Z"],
    ["source", "OuraApp"],
    ["device", "Oura Ring Gen3"],
    ["entry_method", "automated_device"],
    ["accuracy", "accurate"],
    ["status", "active"],
    ["version", "1"]
  ]
}
```

```json
// Example 2: Workout heart rate with zone breakdown
{
  "kind": 1365,
  "content": "148",
  "tags": [
    ["unit", "bpm"],
    ["t", "health"],
    ["t", "heart_rate"],
    ["category", "medical & biometrics"],
    ["measurement_type", "workout"],
    ["measurement_context", "workout"],
    ["activity_type", "running"],
    ["avg_hr", "148"],
    ["max_hr", "176"],
    ["min_hr", "92"],
    ["max_hr_reference", "190"],
    ["hr_zone_system", "5-zone"],
    ["hr_zone", "1", "300", "95", "114"],
    ["hr_zone", "2", "900", "114", "133"],
    ["hr_zone", "3", "1200", "133", "152"],
    ["hr_zone", "4", "600", "152", "171"],
    ["hr_zone", "5", "120", "171", "190"],
    ["start_time", "2025-06-11T09:00:00Z"],
    ["timestamp", "2025-06-11T09:52:00Z"],
    ["period", "PT52M"],
    ["e", "<event_id_of_the_run_session_summary>"],
    ["source", "GarminConnect"],
    ["device", "Garmin Fenix 7"],
    ["entry_method", "automated_device"],
    ["accuracy", "accurate"],
    ["status", "active"],
    ["version", "1"]
  ]
}
```

```json
// Example 3: Instantaneous reading from continuous monitoring
{
  "kind": 1365,
  "content": "63",
  "tags": [
    ["unit", "bpm"],
    ["t", "health"],
    ["t", "heart_rate"],
    ["category", "medical & biometrics"],
    ["measurement_type", "continuous"],
    ["granularity", "raw"],
    ["timestamp", "2025-06-11T14:22:10Z"],
    ["source", "AppleHealth"],
    ["device", "Apple Watch Series 9"],
    ["entry_method", "automated_device"],
    ["accuracy", "accurate"],
    ["status", "active"],
    ["version", "1"]
  ]
}
```

## Implementation Notes
- The canonical unit for heart rate is `bpm`; clients MUST express `content` and the `*_hr` tags in beats per minute.
- `measurement_type` disambiguates what `content` holds. A single daily-summary event MAY also carry `resting_hr`, `avg_hr`, and `max_hr` tags so consumers can read all headline values without fetching multiple events.
- **Heart rate zones.** The default `5-zone` system expresses zones as a percentage of maximum heart rate:
  - Zone 1: 50–60% of max HR (very light / warm-up)
  - Zone 2: 60–70% (light / fat-burn / aerobic base)
  - Zone 3: 70–80% (moderate / aerobic)
  - Zone 4: 80–90% (hard / threshold)
  - Zone 5: 90–100% (maximum / anaerobic)
  Each `hr_zone` tag reports the time (in seconds) spent in that zone, with optional bpm boundaries. Clients computing zones SHOULD record the `max_hr_reference` used, since zone boundaries depend on it.
- **HRV.** HRV is a recovery- and readiness-oriented metric and is carried in the `hrv` tag (with its own unit, typically `ms`) rather than in `content`. Because HRV values are method-dependent, clients SHOULD include `hrv_method` (e.g., `rmssd`) so values are comparable across sources.
- **Workout vs. continuous data.** For workout measurements, set `measurement_type` to `workout`, include `activity_type`, and link to the parent session with `['e', <event_id>]`. For background monitoring, use `continuous` (spot readings) or `resting`/`average` with an appropriate `period`.
- Emitting one event per raw sample is discouraged for continuous monitoring; clients SHOULD prefer periodic summaries (e.g., daily resting HR, per-workout averages) and use `granularity` to indicate the aggregation level.
- **Category vs. kind range.** Kind `1365` falls within the Activity & Fitness continuation band (1365–1389) for sequential continuity, but heart rate is semantically a Medical & Biometrics metric, which is reflected in the `category` tag. This mirrors the framework's existing practice of retaining sequential kind numbers even where the band label and metric category differ; existing kind numbers MUST NOT be renumbered.

## Privacy Notes
- As with all NIP-101h metrics, client implementations SHOULD default to encrypting the `content` using NIP-44 encryption, offering users an explicit option for unencrypted publication.
- Heart rate and HRV are sensitive biometric signals that can reveal health conditions, stress, fitness level, and even pregnancy. Resting HR and HRV trends are particularly revealing and SHOULD be treated as private by default. Clients SHOULD consider encrypting the relevant tags' context and applying the `consent` tag where appropriate.

## Known Client Implementations
- (To be added)
