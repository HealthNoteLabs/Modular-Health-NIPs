# NIP-101h.11: Splits

**Status:** Draft

## Description
This NIP defines the format for storing and sharing split times for activities on Nostr. A split typically represents the time taken to complete a defined segment of a larger activity.

## Event Kind: 1361

## Content
The content field MUST contain the numeric duration of the split in seconds, as a string.

## Required Tags
- [`unit`, `seconds`] - Unit of measurement (seconds)
- [`t`, `health`] - Categorization tag
- [`t`, `splits`] - Specific metric tag
- [`category`, `activity & fitness`] - Top-level category

## Optional Tags
- [`split_number`, positive integer string] - Sequential number of the split in an activity (e.g., "1", "2")
- [`split_distance`, numeric string, unit string] - Distance covered in this split (e.g., "1", "km", or "400", "m")
- [`e`, event_id string] - Reference to a parent activity event this split belongs to
- [`timestamp`, ISO8601 date] - When the split was completed or recorded
- [`source`, application-name or device-name] - The source of the measurement
- [`accuracy`, `estimate` | `accurate` | `exact`] - Data accuracy, defaults to 'estimate'
- [`status`, `active` | `deleted` | `invalid`] - Status of the note, defaults to 'active'
- [`version`, `1`] - Protocol version
- [`cumulative_time`, numeric string] - Cumulative time elapsed up to the end of this split (in the same `unit` as content)

## Examples
```json
{
  "kind": 1361,
  "content": "245", // 4 minutes 5 seconds
  "tags": [
    ["unit", "seconds"],
    ["t", "health"],
    ["t", "splits"],
    ["category", "activity & fitness"],
    ["split_number", "1"],
    ["split_distance", "1", "km"],
    ["timestamp", "2025-06-10T09:05:00Z"],
    ["accuracy", "accurate"],
    ["status", "active"],
    ["version", "1"]
  ]
}
```

```json
{
  "kind": 1361,
  "content": "58.5", 
  "tags": [
    ["unit", "seconds"],
    ["t", "health"],
    ["t", "splits"],
    ["category", "activity & fitness"],
    ["split_number", "3"],
    ["split_distance", "400", "m"],
    ["e", "some_event_id_for_the_full_workout"],
    ["source", "LapTimerApp"],
    ["accuracy", "estimate"],
    ["status", "active"],
    ["version", "1"]
  ]
}
```

### Implementation Notes
- `seconds` is the canonical unit for split durations.
- Use `split_number` to order splits within a single activity, and an `['e', <event_id>]` tag to link all splits back to their parent activity event.
- `cumulative_time` is optional but helps clients reconstruct elapsed time without summing every prior split.
- A single run or workout will typically produce multiple Kind 1361 events, one per split.

### Privacy Notes
- As with all NIP-101h metrics, client implementations SHOULD default to encrypting the event content using NIP-44, offering an explicit option for unencrypted publishing.

### Known Client Implementations
- (To be added) 