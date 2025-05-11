## NIP-101h.2: Height

**Status:** Draft

### Description

This NIP defines the format for storing and sharing height data on Nostr.

**Event Kind:** 1352

### Content

The content field can use two formats:
- For metric height: A string containing the numeric height value in centimeters (cm)
- For imperial height: A JSON string with feet and inches properties

### Required Tags

- `['t', 'health']` - Categorization tag
- `['t', 'height']` - Specific metric tag
- `['unit', 'cm' or 'imperial']` - Unit of measurement

### Optional Tags

- `['converted_value', value, 'cm']` - Provides height in centimeters for interoperability when imperial is used
- `['timestamp', ISO8601-date]` - When the height was measured

### Examples

```jsx
// Example 1: Metric height
Apply to App.jsx

// Example 2: Imperial height with conversion
Apply to App.jsx
```

### Implementation Notes

- Centimeters (cm) is the canonical unit for height interoperability
- When using imperial units, a conversion to centimeters SHOULD be provided
- Height values SHOULD be positive integers
- For maximum compatibility, clients SHOULD support both formats

### Privacy Notes
- As with all NIP-101h metrics, client implementations SHOULD default to encrypting the event content using NIP-44, offering an explicit option for unencrypted publishing.

### Known Client Implementations
- Runstr

--- 