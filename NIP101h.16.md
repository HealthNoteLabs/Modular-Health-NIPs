# NIP-101h.16: Sleep

**Status:** Draft

## Description
This NIP defines the format for storing and sharing sleep data on Nostr. A sleep event summarizes a single sleep session (typically one night), including total sleep duration, the breakdown across sleep stages, and quality indicators such as a sleep score, sleep latency, and interruptions.

Sleep data is generally produced by wearable devices and consumer sleep trackers such as Apple Watch, Garmin, Fitbit, Whoop, Oura, and Eight Sleep. This spec is designed to accommodate the staged sleep model (deep / light / REM / awake) common to these devices, as well as the recovery-oriented physiological signals (respiratory rate, SpO2) that they increasingly report during sleep.

## Event Kind: 1366

## Content
The `content` field MUST contain the total sleep duration in **minutes** as a string. Total sleep duration is the time actually spent asleep, and SHOULD exclude time awake within the sleep window (see `awake_time`).

The canonical unit for all duration values in this spec is **minutes**, declared via the `unit` tag.

## Required Tags
- [`unit`, `min`] – Unit of measurement for `content` and for all duration-valued tags in this event.
- [`t`, `health`] – General categorization tag.
- [`t`, `sleep`] – Metric-specific tag.
- [`category`, `recovery & wellness`] – Top-level category name.

## Optional Tags

### Session timing
- [`sleep_onset`, ISO8601-datetime] – Timestamp at which the user fell asleep (start of the sleep period).
- [`wake_time`, ISO8601-datetime] – Timestamp at which the user finally woke (end of the sleep period).
- [`sleep_latency`, numeric-string] – Time in minutes between getting into bed and falling asleep.
- [`timestamp`, ISO8601-datetime] – When the event was recorded or the session was finalized. For querying, clients SHOULD treat `wake_time` as the canonical "morning of" reference.

### Stage breakdown (all values in minutes)
- [`total_sleep`, numeric-string] – Total sleep duration in minutes. Mirrors `content`; provided as a tag for clients that prefer tag-based access. If present, it SHOULD equal `content`.
- [`deep_sleep`, numeric-string] – Minutes spent in deep (slow-wave / N3) sleep.
- [`light_sleep`, numeric-string] – Minutes spent in light (N1 / N2) sleep.
- [`rem_sleep`, numeric-string] – Minutes spent in REM sleep.
- [`awake_time`, numeric-string] – Minutes spent awake within the sleep window (after first falling asleep).
- [`interruptions`, numeric-string] – Count of distinct awakenings during the session.

### Quality scores
- [`sleep_score`, numeric-string] – Overall sleep quality score. The scale is vendor-defined; clients SHOULD also publish `score_scale` to disambiguate.
- [`score_scale`, string] – Scale used for `sleep_score` (e.g., `0-100`). Defaults to `0-100` if omitted.
- [`sleep_efficiency`, numeric-string] – Percentage (0–100) of time in bed actually spent asleep.
- [`consistency`, numeric-string] – Sleep consistency / regularity score, reflecting how closely this session's timing matches the user's typical schedule. Scale is vendor-defined; `0-100` is RECOMMENDED.

### Physiological signals during sleep
- [`respiratory_rate`, numeric-string] – Average respiratory rate during sleep, in breaths per minute.
- [`spo2`, numeric-string] – Average blood-oxygen saturation (SpO2) during sleep, as a percentage (0–100).
- [`spo2_min`, numeric-string] – Minimum SpO2 observed during sleep, as a percentage (0–100).
- [`resting_heart_rate`, numeric-string] – Average resting heart rate during sleep, in beats per minute. Detailed heart-rate data SHOULD use NIP-101h.15 (Heart Rate); this tag is a convenience summary.
- [`hrv`, numeric-string] – Average heart-rate variability during sleep, in milliseconds.

### Provenance & housekeeping
- [`activity_type`, `sleep`] – Activity classification, for consistency with other NIP-101h metrics.
- [`e`, <event_id>] – Event ID linking this summary to related events (e.g., a Heart Rate session or a broader daily-recovery summary).
- [`source`, application-name or device-name] – Source application or device (e.g., `Oura`, `Whoop`, `AppleHealth`).
- [`device`, string] – Specific measuring device model.
- [`accuracy`, `estimate` | `accurate` | `exact`] – Measurement accuracy. Defaults to `estimate`.
- [`status`, `active` | `deleted` | `invalid`] – Event status. Defaults to `active`.
- [`version`, `1`] – Protocol version.

## Examples
```json
{
  "kind": 1366,
  "content": "445",
  "tags": [
    ["unit", "min"],
    ["t", "health"],
    ["t", "sleep"],
    ["category", "recovery & wellness"],
    ["sleep_onset", "2025-06-10T23:12:00Z"],
    ["wake_time", "2025-06-11T07:05:00Z"],
    ["sleep_latency", "8"],
    ["deep_sleep", "82"],
    ["light_sleep", "243"],
    ["rem_sleep", "120"],
    ["awake_time", "28"],
    ["interruptions", "3"],
    ["sleep_score", "84"],
    ["score_scale", "0-100"],
    ["sleep_efficiency", "94"],
    ["respiratory_rate", "14.2"],
    ["spo2", "96"],
    ["resting_heart_rate", "52"],
    ["hrv", "68"],
    ["activity_type", "sleep"],
    ["source", "Oura"],
    ["accuracy", "accurate"],
    ["version", "1"]
  ]
}
```

```json
{
  "kind": 1366,
  "content": "392",
  "tags": [
    ["unit", "min"],
    ["t", "health"],
    ["t", "sleep"],
    ["category", "recovery & wellness"],
    ["sleep_onset", "2025-06-11T00:40:00Z"],
    ["wake_time", "2025-06-11T07:30:00Z"],
    ["deep_sleep", "61"],
    ["light_sleep", "224"],
    ["rem_sleep", "107"],
    ["awake_time", "18"],
    ["interruptions", "2"],
    ["sleep_score", "78"],
    ["consistency", "71"],
    ["source", "Whoop"],
    ["device", "Whoop 4.0"],
    ["version", "1"]
  ]
}
```

## Implementation Notes
- The headline value (`content`) is **total time asleep in minutes**, not time in bed. Time in bed can be derived as `content` + `awake_time` + `sleep_latency`, or from `wake_time` − `sleep_onset`.
- The stage breakdown (`deep_sleep` + `light_sleep` + `rem_sleep`) SHOULD sum to approximately `total_sleep`; small discrepancies are expected due to vendor staging algorithms and rounding. Clients SHOULD NOT reject events where the sum differs slightly from `content`.
- Not all devices report every stage. Clients MUST treat each stage tag as independently optional and degrade gracefully when stages are absent (e.g., a device that reports only "asleep" vs. "awake").
- `sleep_score`, `consistency`, and similar scores are vendor-defined and not directly comparable across devices. Clients SHOULD surface `source` alongside any score and SHOULD publish `score_scale` when the scale is not the default `0-100`.
- For detailed time-series heart-rate or SpO2 data during sleep, use the dedicated metric NIPs (Heart Rate, NIP-101h.15) and link via an `['e', <event_id>]` tag. The summary tags here (`resting_heart_rate`, `hrv`, `spo2`) are intended for at-a-glance recovery context, not high-resolution analysis.
- One event SHOULD represent one sleep session. Naps MAY be recorded as separate events; clients can distinguish a nap from a main sleep by its short duration and daytime `sleep_onset`.
- All timestamps SHOULD be in UTC (ISO 8601 with `Z`). Because sleep crosses midnight, clients displaying "nights" SHOULD anchor on `wake_time` (the morning the user woke).

## Privacy Notes
- As with all NIP-101h metrics, client implementations SHOULD default to encrypting the event content using NIP-44, offering an explicit option for unencrypted publishing.
- Sleep data is especially sensitive: sleep timing reveals when a user is at home and unconscious, and physiological signals (respiratory rate, SpO2, HRV) can disclose health conditions such as sleep apnea or illness. Clients SHOULD treat sleep events as private by default and SHOULD warn users before publishing them unencrypted.
- Aggregations or trends derived from sleep events (e.g., long-term schedules) can be more revealing than any single night; clients building social or sharing features SHOULD consider this when designing defaults.

## Known Client Implementations
- (To be added)
