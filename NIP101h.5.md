## NIP-101h.5: Fitness Level

**Status:** Draft

### Description

This NIP defines the format for storing and sharing fitness level data on Nostr.

**Event Kind:** 1355

### Content

The content field contains a string representing the user's fitness level.

### Required Tags

- `['t', 'health']` - Categorization tag
- `['t', 'fitness']` - Fitness category tag
- `['t', 'level']` - Specific metric tag

### Optional Tags

- `['timestamp', ISO8601-date]` - When the fitness level was recorded
- `['activity_type', activity-type]` - Specific activity the fitness level relates to
- `['metrics', JSON-string]` - Quantifiable fitness metrics used to determine level
- `['assessment_method', string]` - How the fitness level was determined (e.g., "self-assessment", "Cooper test")
- `['accuracy', estimate | accurate | exact]` - Data accuracy, defaults to 'estimate'
- `['status', active | deleted | invalid]` - Status of the note, defaults to 'active'

### Common Values

While any string value is permitted, the following common values are recommended for interoperability:
- beginner
- intermediate
- advanced
- elite
- professional

### Examples

```json
// Example 1: Basic fitness level
{
  "kind": 1355,
  "content": "intermediate",
  "tags": [
    ["t", "health"],
    ["t", "fitness"],
    ["t", "level"]
  ]
}
```

```json
// Example 2: Activity-specific fitness level with metrics
{
  "kind": 1355,
  "content": "advanced",
  "tags": [
    ["t", "health"],
    ["t", "fitness"],
    ["t", "level"],
    ["activity_type", "running"],
    ["assessment_method", "Cooper test"],
    ["metrics", "{\"vo2max\": 52}"],
    ["timestamp", "2025-05-01T10:00:00Z"]
  ]
}
```

### Implementation Notes

- Fitness level is subjective and may vary by activity
- The `activity_type` tag can be used to specify fitness level for different activities
- The metrics tag can provide objective measurements to support the fitness level
- Clients can extend this format to include activity-specific fitness assessments
- For general fitness apps, the simple beginner/intermediate/advanced scale is recommended

### Privacy Notes
- As with all NIP-101h metrics, client implementations SHOULD default to encrypting the event content using NIP-44, offering an explicit option for unencrypted publishing.

### Known Client Implementations
- Runstr

--- 