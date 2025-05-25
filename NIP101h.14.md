# NIP-101h.14: Speed

**Status:** Draft

## Description
This NIP defines the format for storing and sharing speed data—either average or maximum speed—on Nostr. It is primarily aimed at activities such as cycling, running, skating, or any movement-based sport where velocity is a key performance indicator.

## Event Kind: 1364

## Content
The `content` field MUST contain the numeric speed value as a string. The value SHOULD be provided in the canonical unit declared in the `unit` tag.

## Required Tags
- [`unit`, `km/h` | `mph` | `m/s`] – Unit of measurement for the speed value contained in `content`.
- [`t`, `health`] – General categorisation tag.
- [`t`, `speed`] – Metric-specific tag.
- [`category`, `activity & fitness`] – Top-level category name.

## Optional Tags
- [`speed_type`, `average` | `max`] – Nature of the speed measurement. Defaults to `average` if omitted.
- [`timestamp`, ISO8601-datetime] – End instant of the period for which the speed applies, or the moment the maximum speed was reached.
- [`start_time`, ISO8601-datetime] – Start instant of the measurement period (helpful for average speed calculations).
- [`period`, ISO8601-duration-string] – Duration over which the speed was aggregated (e.g., `PT1H` for one hour).
- [`activity_type`, string] – Activity during which the speed was recorded (e.g., `cycling`, `running`).
- [`distance`, numeric-string] – Distance covered during `period`, useful for computing speed context.
- [`distance_unit`, `km` | `mi` | `m`] – Unit corresponding to `distance`.
- [`related_event`, <event_id>] – Event ID of a broader session summary.
- [`source`, application-name or device-name] – Source application or device.
- [`device`, string] – Specific measuring device model.
- [`accuracy`, `estimate` | `accurate` | `exact`] – Measurement accuracy. Defaults to `estimate`.
- [`status`, `active` | `deleted` | `invalid`] – Event status. Defaults to `active`.
- [`version`, `1`] – Protocol version.

## Examples
```json
{
  "kind": 1364,
  "content": "25.5",
  "tags": [
    ["unit", "km/h"],
    ["t", "health"],
    ["t", "speed"],
    ["category", "activity & fitness"],
    ["speed_type", "average"],
    ["activity_type", "cycling"],
    ["start_time", "2025-06-15T09:00:00Z"],
    ["timestamp", "2025-06-15T11:30:00Z"],
    ["period", "PT2H30M"],
    ["distance", "63.75"],
    ["distance_unit", "km"],
    ["source", "CycleStatsApp"],
    ["version", "1"]
  ]
}
```

```json
{
  "kind": 1364,
  "content": "55.2",
  "tags": [
    ["unit", "km/h"],
    ["t", "health"],
    ["t", "speed"],
    ["category", "activity & fitness"],
    ["speed_type", "max"],
    ["activity_type", "cycling"],
    ["timestamp", "2025-06-15T10:15:30Z"],
    ["related_event", "<event_id_of_the_full_ride_summary>"],
    ["source", "BikeComputerX"],
    ["version", "1"]
  ]
}
```

## Implementation Notes
- `speed_type` distinguishes between instantaneous maximum speed and aggregated average speed.
- When recording average speed, `start_time` / `timestamp` or `period` SHOULD be supplied to clarify the aggregation window.
- Clients MAY link this event to a larger workout summary via `related_event`.

## Privacy Notes
As with all NIP-101h metrics, client implementations SHOULD default to encrypting the `content` using NIP-44 encryption, offering users an explicit option for unencrypted publication. 