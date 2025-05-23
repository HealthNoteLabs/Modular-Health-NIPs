## NIP-101h.8: Activity Duration

**Status:** Draft

### Description
This NIP defines the format for storing and sharing the duration of a specific activity on Nostr.

**Event Kind:** `1358`

### Content
The content field MUST contain the numeric duration value as a string. The unit for this value is specified in the `unit` tag.

### Required Tags
- `['unit', 'seconds' or 'minutes' or 'hours']` - Unit of measurement for the duration.
- `['t', 'health']` - Categorization tag.
- `['t', 'activity_duration']` - Specific metric tag.
- `['activity', activity-type]` - Specifies the type of activity (e.g., "running", "cycling", "swimming", "workout").

### Optional Tags
- `['timestamp', ISO8601-date]` - When the activity was completed or the duration was recorded.
- `['start_time', ISO8601-date]` - When the activity started.
- `['end_time', ISO8601-date]` - When the activity ended.
- `['source', application-name]` - The source of the measurement (e.g., "FitTrackerApp", "SmartWatchXYZ").
- `['related_event', event-id]` - To link to another event, e.g., a detailed workout event (NIP-101e).
- `['activity_type', string]` - Specific type of activity (e.g., "running", "sleep", "meeting")
- `['accuracy', 'estimate' | 'accurate' | 'exact']` - Data accuracy, defaults to 'estimate'
- `['status', 'active' | 'deleted' | 'invalid']` - Status of the note, defaults to 'active'

### Examples
```json
{
  "kind": 1358,
  "content": "1800",
  "tags": [
    ["unit", "seconds"],
    ["t", "health"],
    ["t", "activity_duration"],
    ["activity", "running"],
    ["timestamp", "2025-05-10T09:30:00Z"]
  ]
}
```

```json
{
  "kind": 1358,
  "content": "45",
  "tags": [
    ["unit", "minutes"],
    ["t", "health"],
    ["t", "activity_duration"],
    ["activity", "weightlifting"],
    ["start_time", "2025-05-10T17:00:00Z"],
    ["end_time", "2025-05-10T17:45:00Z"],
    ["source", "MyFitnessPal"]
  ]
}
```

### Implementation Notes
- While `seconds` is granular, `minutes` might be more common for many activities.
- If both `start_time` and `end_time` are provided, the `content` (duration) should ideally match `end_time - start_time`. Clients can calculate duration if not explicitly provided but `start_time` and `end_time` are present.
- The `activity` tag is crucial for context.

### Privacy Notes
- As with all NIP-101h metrics, client implementations SHOULD default to encrypting the event content using NIP-44, offering an explicit option for unencrypted publishing.

### Known Client Implementations
- (Add client names here as they adopt this NIP) 