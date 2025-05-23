# NIP-101h.13: Distance

**Status:** Draft

## Description
This NIP defines the format for storing and sharing distance data for activities on Nostr, such as distance covered in a run, walk, cycle, or swim.

## Event Kind: 1363

## Content
The content field MUST contain the numeric distance value as a string.

## Required Tags
- [`unit`, `m` | `km` | `mi` | `ft` | `yd`] - Unit of measurement for the distance.
- [`t`, `health`] - Categorization tag
- [`t`, `distance`] - Specific metric tag
- [`category`, `activity & fitness`] - Top-level category

## Optional Tags
- [`activity_type`, string] - Type of activity (e.g., "running", "cycling", "swimming", "walking")
- [`total_activity_distance`, boolean string (`true`|`false`)] - Indicates if this distance is the total for an activity or a segment.
- [`segment_number`, positive integer string] - If part of a segmented activity, the segment number.
- [`timestamp`, ISO8601 date] - When the distance was recorded or the activity segment concluded
- [`source`, application-name or device-name] - The source of the measurement
- [`accuracy`, `estimate` | `accurate` | `exact`] - Data accuracy, defaults to 'estimate'
- [`status`, `active` | `deleted` | `invalid`] - Status of the note, defaults to 'active'
- [`version`, `1`] - Protocol version

## Examples
```json
{
  "kind": 1363,
  "content": "10.5",
  "tags": [
    ["unit", "km"],
    ["t", "health"],
    ["t", "distance"],
    ["category", "activity & fitness"],
    ["activity_type", "running"],
    ["total_activity_distance", "true"],
    ["timestamp", "2025-06-10T10:00:00Z"],
    ["accuracy", "accurate"],
    ["status", "active"],
    ["version", "1"]
  ]
}
```

```json
{
  "kind": 1363,
  "content": "1500",
  "tags": [
    ["unit", "m"],
    ["t", "health"],
    ["t", "distance"],
    ["category", "activity & fitness"],
    ["activity_type", "swimming"],
    ["source", "GarminWatch"],
    ["accuracy", "estimate"],
    ["status", "active"],
    ["version", "1"]
  ]
}
```

### Privacy Notes
- As with all NIP-101h metrics, client implementations SHOULD default to encrypting the event content using NIP-44, offering an explicit option for unencrypted publishing.

### Known Client Implementations
- (To be added) 