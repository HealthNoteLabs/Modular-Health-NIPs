## NIP-101h.6: Workout Intensity

**Status:** Draft

### Description

This NIP defines the format for storing and sharing workout intensity data on Nostr.

**Event Kind:** 1356

### Content

The content field contains a string representing the workout intensity, which can be:
- A number from "1" to "10" when using Rate of Perceived Exertion (RPE) scale
- One of the keywords: "low", "moderate", "high", or "max"

### Required Tags

- `['t', 'health']` - Categorization tag
- `['t', 'intensity']` - Specific metric tag
- `['scale', 'rpe10' or 'keyword']` - Scale used for intensity measurement

### Optional Tags

- `['timestamp', ISO8601-date]` - When the workout intensity was recorded
- `['activity', activity-type]` - Specific activity the intensity relates to
- `['zone', '1'-'5']` - Heart rate/intensity zone (if applicable)
- `['source', application-name]` - The source of the measurement

### Examples

```json
{
  "kind": 1356,
  "content": "8",
  "tags": [
    ["t", "health"],
    ["t", "intensity"],
    ["scale", "rpe10"],
    ["activity", "running"],
    ["timestamp", "2025-05-06T12:30:00Z"]
  ]
}
```

```json
{
  "kind": 1356,
  "content": "high",
  "tags": [
    ["t", "health"],
    ["t", "intensity"],
    ["scale", "keyword"],
    ["zone", "4"],
    ["activity", "cycling"],
    ["source", "TrainTrack"]
  ]
}
```

### Implementation Notes

- The RPE scale (1-10) provides more granular intensity measurement
- Keyword scale (low/moderate/high/max) is more approachable for general users
- Heart rate zones can provide additional context when available from devices
- Workout intensity is typically activity-specific and should include the activity tag when possible

### Privacy Notes
- As with all NIP-101h metrics, client implementations SHOULD default to encrypting the event content using NIP-44, offering an explicit option for unencrypted publishing.

### Known Client Implementations
- Runstr

--- 