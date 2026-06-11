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
- [`segment_type`, `total` | `part`] - Indicates whether this entry is the total distance for the activity (`total`) or a segment/lap (`part`).
- [`segment_number`, positive integer string] - If `segment_type` is `part`, the ordinal number of the segment.
- [`target_distance`, numeric-string, unit-string] - A distance goal associated with this activity or segment.
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
    ["segment_type", "total"],
    ["segment_number", "1"],
    ["target_distance", "10.5", "km"],
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
  "content": "400",
  "tags": [
    ["unit", "m"],
    ["t", "health"],
    ["t", "distance"],
    ["category", "activity & fitness"],
    ["activity_type", "running"],
    ["segment_type", "part"],
    ["segment_number", "2"],
    ["timestamp", "2025-06-10T10:02:30Z"],
    ["source", "LapTimerApp"],
    ["accuracy", "estimate"],
    ["status", "active"],
    ["version", "1"]
  ]
}
```

### Implementation Notes
- The `unit` tag declares the unit of the value in `content`; clients SHOULD support at least metric (`m`, `km`) units and provide conversions where helpful.
- Use `segment_type` to distinguish a total activity distance (`total`) from an individual lap or segment (`part`), and `segment_number` to order segments.
- Segment distance events MAY be linked to a parent activity or session summary via an `['e', <event_id>]` tag.

### Privacy Notes
- As with all NIP-101h metrics, client implementations SHOULD default to encrypting the event content using NIP-44, offering an explicit option for unencrypted publishing.

### Known Client Implementations
- (To be added)