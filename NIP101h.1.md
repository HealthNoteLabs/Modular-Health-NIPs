# NIP-101h.1: Weight

**Status:** Draft

## Description
This NIP defines the format for storing and sharing weight data on Nostr.

## Event Kind: 1351

## Content
The content field MUST contain the numeric weight value as a string.

## Required Tags
- ['unit', 'kg' or 'lb'] - Unit of measurement
- ['t', 'health'] - Categorization tag
- ['t', 'weight'] - Specific metric tag

## Optional Tags
- ['converted_value', value, unit] - Provides the weight in alternative units for interoperability
- ['timestamp', ISO8601 date] - When the weight was measured
- ['accuracy', 'estimate' | 'accurate' | 'exact'] - Data accuracy, defaults to 'estimate'
- ['status', 'active' | 'deleted' | 'invalid'] - Status of the note, defaults to 'active'

## Examples
```json
{
  "kind": 1351,
  "content": "70",
  "tags": [
    ["unit", "kg"],
    ["t", "health"],
    ["t", "weight"]
  ]
}
```

```json
{
  "kind": 1351,
  "content": "154",
  "tags": [
    ["unit", "lb"],
    ["t", "health"],
    ["t", "weight"],
    ["converted_value", "69.85", "kg"]
  ]
}
```

### Implementation Notes
- Kilograms (kg) is the canonical unit for weight interoperability
- When using imperial units (lb), a `converted_value` to kilograms SHOULD be provided
- Weight values SHOULD be positive numbers

### Privacy Notes
- As with all NIP-101h metrics, client implementations SHOULD default to encrypting the event content using NIP-44, offering an explicit option for unencrypted publishing.

### Known Client Implementations
- Runstr 