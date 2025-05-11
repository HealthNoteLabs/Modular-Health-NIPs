## NIP-101h.3: Age

**Status:** Draft

### Description

This NIP defines the format for storing and sharing age data on Nostr.

**Event Kind:** 1353

### Content

The content field MUST contain the numeric age value as a string.

### Required Tags

- `['unit', 'years']` - Unit of measurement
- `['t', 'health']` - Categorization tag
- `['t', 'age']` - Specific metric tag

### Optional Tags

- `['timestamp', ISO8601-date]` - When the age was recorded
- `['dob', ISO8601-date]` - Date of birth (if the user chooses to share it)

### Examples

```jsx
// Example 1: Basic age
Apply to App.jsx

// Example 2: Age with DOB
Apply to App.jsx
```

### Implementation Notes

- Age SHOULD be represented as a positive integer
- For privacy reasons, date of birth (dob) is optional
- Clients SHOULD consider updating age automatically if date of birth is known
- Age can be a sensitive metric and clients may want to consider encrypting this data

### Privacy Notes
- As with all NIP-101h metrics, client implementations SHOULD default to encrypting the event content using NIP-44, offering an explicit option for unencrypted publishing. This is particularly relevant for Age and DOB.

### Known Client Implementations
- Runstr

--- 