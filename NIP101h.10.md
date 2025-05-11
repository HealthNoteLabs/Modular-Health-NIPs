## NIP-101h.10: Elevation

**Status:** Draft

### Description
This NIP defines the format for storing and sharing elevation data, typically elevation gain or current altitude, related to an activity or a point in time on Nostr.

**Event Kind:** `1360`

### Content
The content field MUST contain the numeric elevation value as a string. The unit is specified in the `unit` tag.

### Required Tags
- `['unit', 'm' or 'ft']` - Unit of measurement (meters or feet).
- `['t', 'health']` - Categorization tag.
- `['t', 'elevation']` - Specific metric tag.
- `['type', 'gain' or 'altitude' or 'loss' or 'max' or 'min']` - Type of elevation measurement.
    - `gain`: Total elevation gained during an activity.
    - `altitude`: Current or specific altitude at a point in time.
    - `loss`: Total elevation lost during an activity.
    - `max`: Maximum altitude reached during an activity.
    - `min`: Minimum altitude reached during an activity.

### Optional Tags
- `['timestamp', ISO8601-date]` - When the elevation was recorded or the activity ended.
- `['activity', activity-type]` - Specifies the type of activity if `type` is 'gain', 'loss', 'max', or 'min' (e.g., "hiking", "trail_running", "cycling").
- `['start_time', ISO8601-date]` - Start time of the activity (if applicable).
- `['end_time', ISO8601-date]` - End time of the activity (if applicable).
- `['source', application-name or device-name]` - The source of the measurement (e.g., "GPSLogger", "AltimeterApp").
- `['converted_value', value, unit]` - Provides the elevation in alternative units.

### Examples
```json
{
  "kind": 1360,
  "content": "350",
  "tags": [
    ["unit", "m"],
    ["t", "health"],
    ["t", "elevation"],
    ["type", "gain"],
    ["activity", "hiking"],
    ["timestamp", "2025-05-10T16:00:00Z"]
  ]
}
```

```json
{
  "kind": 1360,
  "content": "1200",
  "tags": [
    ["unit", "ft"],
    ["t", "health"],
    ["t", "elevation"],
    ["type", "altitude"],
    ["timestamp", "2025-05-10T12:35:10Z"],
    ["source", "BarometerSensor"],
    ["converted_value", "365.76", "m"]
  ]
}
```

### Implementation Notes
- The `type` tag is crucial to understand if the value represents a change (gain/loss) or a state (altitude).
- For `type: 'gain'`, `loss`, `max`, or `min`, the `activity` tag provides important context.
- `timestamp` can represent the measurement time for `altitude`, or the completion time for `gain`/`loss`/`max`/`min` over an activity.

### Privacy Notes
- As with all NIP-101h metrics, client implementations SHOULD default to encrypting the event content using NIP-44, offering an explicit option for unencrypted publishing.

### Known Client Implementations
- (Add client names here as they adopt this NIP) 