## NIP-101h.4: Gender

**Status:** Draft

### Description

This NIP defines the format for storing and sharing gender data on Nostr.

**Event Kind:** 1354

### Content

The content field contains a string representing the user's gender.

### Required Tags

- `['t', 'health']` - Categorization tag
- `['t', 'gender']` - Specific metric tag

### Optional Tags

- `['timestamp', ISO8601-date]` - When the gender was recorded
- `['preferred_pronouns', string]` - User's preferred pronouns
- `['accuracy', 'estimate' | 'accurate' | 'exact']` - Data accuracy, defaults to 'estimate'
- `['status', 'active' | 'deleted' | 'invalid']` - Status of the note, defaults to 'active'

### Common Values

While any string value is permitted, the following common values are recommended for interoperability:
- male
- female
- non-binary
- other
- prefer-not-to-say

### Examples

```jsx
// Example 1: Basic gender
Apply to App.jsx

// Example 2: Gender with pronouns
Apply to App.jsx
```

### Implementation Notes

- Clients SHOULD allow free-form input for gender
- For maximum compatibility, clients SHOULD support the common values
- Gender is a sensitive personal attribute and clients SHOULD consider appropriate privacy controls
- Applications focusing on health metrics should be respectful of gender diversity

### Privacy Notes
- As with all NIP-101h metrics, client implementations SHOULD default to encrypting the event content using NIP-44, offering an explicit option for unencrypted publishing. Gender is a sensitive attribute and warrants this protection.

### Known Client Implementations
- Runstr

--- 