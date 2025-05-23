# NIP-101h.12: Pace

**Status:** Draft

## Description
This NIP defines the format for storing and sharing pace data for activities like running, swimming, or cycling on Nostr. Pace represents the time taken to cover a specific unit of distance.

## Event Kind: 1362

## Content
The content field MUST contain the numeric pace value as a string. This value represents the time component of the pace (e.g., for a pace of 5:30 min/km, the content would be "330" if the base time unit is seconds, or "5.5" if the base time unit is minutes and represented as a decimal).
For simplicity, we will standardize on **seconds per specified distance unit**.
So, for 5 minutes 30 seconds per km, content is "330" and unit tag would be `["pace_unit", "s/km"]`.

## Required Tags
- [`t`, `health`] - Categorization tag
- [`t`, `pace`] - Specific metric tag
- [`category`, `activity & fitness`] - Top-level category
- [`pace_unit`, `s/km` | `s/mi` | `min/km` | `min/mi`] - Unit of pace measurement. While `s/km` or `s/mi` is preferred for the `content` field (total seconds), this tag clarifies the intended display or original format.

## Optional Tags
- [`activity_type`, string] - Type of activity (e.g., "running", "cycling", "swimming")
- [`distance_segment`, numeric string, unit string] - The distance segment this pace refers to, if not a standard unit (e.g., "100", "m" for pace over 100m).
- [`average_type`, `overall` | `lap` | `segment`] - Indicates if the pace is an overall average, lap average, or for a specific segment.
- [`timestamp`, ISO8601 date] - When the pace was recorded or calculated
- [`source`, application-name or device-name] - The source of the measurement
- [`accuracy`, `estimate` | `accurate` | `exact`] - Data accuracy, defaults to 'estimate'
- [`status`, `active` | `deleted` | `invalid`] - Status of the note, defaults to 'active'
- [`version`, `1`] - Protocol version

## Examples
```json
{
  "kind": 1362,
  "content": "330", // 5 minutes 30 seconds
  "tags": [
    ["t", "health"],
    ["t", "pace"],
    ["category", "activity & fitness"],
    ["pace_unit", "s/km"], // Interpreted as 330 seconds per km
    ["activity_type", "running"],
    ["average_type", "overall"],
    ["timestamp", "2025-06-10T09:30:00Z"],
    ["accuracy", "accurate"],
    ["status", "active"],
    ["version", "1"]
  ]
}
```

```json
{
  "kind": 1362,
  "content": "90", // 1 minute 30 seconds
  "tags": [
    ["t", "health"],
    ["t", "pace"],
    ["category", "activity & fitness"],
    ["pace_unit", "s/100m"], // Interpreted as 90 seconds per 100m (for swimming)
    ["activity_type", "swimming"],
    ["timestamp", "2025-06-11T10:00:00Z"],
    ["source", "SwimTracker"],
    ["accuracy", "estimate"],
    ["status", "active"],
    ["version", "1"]
  ]
}
```

### Clarification on `content` and `pace_unit`
- The `content` should always be the time value in *seconds* for the distance specified in `pace_unit` (e.g., if `pace_unit` is `s/km`, content is total seconds for 1 km; if `s/mi`, total seconds for 1 mile).
- Clients can use `pace_unit` to display the pace in a more user-friendly format (e.g., convert total seconds to minutes:seconds).

### Privacy Notes
- As with all NIP-101h metrics, client implementations SHOULD default to encrypting the event content using NIP-44, offering an explicit option for unencrypted publishing.

### Known Client Implementations
- (To be added) 