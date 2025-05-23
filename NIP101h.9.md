## NIP-101h.9: Step Count

**Status:** Draft

### Description
This NIP defines the format for storing and sharing daily or periodic step count data on Nostr.

**Event Kind:** `1359`

### Content
The content field MUST contain the numeric step count as a string.

### Required Tags
- `['unit', 'steps']` - Unit of measurement.
- `['t', 'health']` - Categorization tag.
- `['t', 'step_count']` - Specific metric tag.
- `['period', 'daily' or interval-string]` - The period over which the steps were counted (e.g., "daily", "hourly", or a specific ISO 8601 duration string like "PT1H" for one hour).

### Optional Tags
- `['timestamp', ISO8601-date]` - The end time of the period for which the steps are counted.
- `['start_time', ISO8601-date]` - The start time of the period (especially if `period` is not 'daily').
- `['goal', numeric-string]` - The step goal for the period.
- `['source', application-name or device-name]` - The source of the step count (e.g., "PedometerApp", "Fitbit").
- `['end_time', ISO8601-datetime]` - End of the period for which steps are counted
- `['device', string]` - Device used to measure steps (e.g., "Fitbit Inspire 3", "Apple Watch Series 8")
- `['accuracy', `estimate` | `accurate` | `exact`]` - Data accuracy, defaults to 'estimate'
- `['status', `active` | `deleted` | `invalid`]` - Status of the note, defaults to 'active'

### Examples
```json
{
  "kind": 1359,
  "content": "10520",
  "tags": [
    ["unit", "steps"],
    ["t", "health"],
    ["t", "step_count"],
    ["period", "daily"],
    ["timestamp", "2025-05-10T23:59:59Z"],
    ["goal", "10000"]
  ]
}
```

```json
{
  "kind": 1359,
  "content": "1250",
  "tags": [
    ["unit", "steps"],
    ["t", "health"],
    ["t", "step_count"],
    ["period", "PT1H"],
    ["start_time", "2025-05-10T14:00:00Z"],
    ["timestamp", "2025-05-10T14:59:59Z"],
    ["source", "HealthApp"],
    ["end_time", "2025-05-10T15:59:59Z"],
    ["device", "Fitbit Inspire 3"],
    ["accuracy", "accurate"],
    ["status", "active"]
  ]
}
```

### Implementation Notes
- For `period: 'daily'`, the `timestamp` typically represents the end of that day.
- Clients can use `start_time` and `timestamp` (as end_time) to define precise intervals if `period` is not 'daily'.
- This NIP focuses on the count itself. For detailed step data per activity, other NIPs or event kinds might be more suitable or linked via `related_event` if needed.

### Privacy Notes
- As with all NIP-101h metrics, client implementations SHOULD default to encrypting the event content using NIP-44, offering an explicit option for unencrypted publishing.

### Known Client Implementations
- (Add client names here as they adopt this NIP) 