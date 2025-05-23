## NIP-101h.7: Caloric Data

**Status:** Draft

### Description

This NIP defines the format for storing and sharing caloric data on Nostr, using two distinct kinds to differentiate between calories expended and calories consumed.

### Common Structure for Both Kinds

Both caloric data kinds share similar structure but serve different purposes.

### Content

For both kinds, the content field MUST contain the numeric caloric value as a string in kilocalories (kcal).

### Required Tags for Both Kinds

- `['unit', 'kcal']` - Unit of measurement
- `['t', 'health']` - Categorization tag
- `['t', 'calories']` - Specific metric tag

### Optional Tags for Both Kinds

- `['converted_value', value, 'kJ']` - Provides calories in kilojoules for interoperability
- `['timestamp', ISO8601-date]` - When the caloric data was recorded
- `['source', application-name]` - The source of the measurement
- `['accuracy', 'estimate' | 'accurate' | 'exact']` - Data accuracy, defaults to 'estimate'
- `['status', 'active' | 'deleted' | 'invalid']` - Status of the note, defaults to 'active'
- `['activity', string]` - Specific activity if calories expended (e.g., "running", "cycling")
- `['food_item', string]` - Specific food item if calories consumed
- `['meal_type', string]` - e.g., "breakfast", "lunch", "dinner", "snack"

### Kind 1357: Calories Expended

This kind specifically represents calories burned or expended through activity, exercise, or basal metabolism.

**Event Kind:** 1357

**Additional Optional Tags:**
- `['activity', activity-type]` - Type of activity associated with the expenditure
- `['duration', minutes]` - Duration of the activity in minutes
- `['intensity', value]` - Reference to workout intensity (can link to a Kind 1356 event)

**Examples:**
```json
{
  "kind": 1357,
  "content": "350",
  "tags": [
    ["unit", "kcal"],
    ["t", "health"],
    ["t", "calories"],
    ["activity", "running"],
    ["duration", "45"],
    ["timestamp", "2025-05-06T18:45:00Z"],
    ["accuracy", "estimate"],
    ["status", "active"]
  ]
}
```

### Kind 2357: Calories Consumed

This kind specifically represents calories consumed through food and drink intake.

**Event Kind:** 2357

**Additional Optional Tags:**
- `['meal', meal-type]` - Type of meal (breakfast, lunch, dinner, snack)
- `['food', food-description]` - Description of the food consumed
- `['macros', JSON-string]` - Breakdown of macronutrients (proteins, carbs, fats)

**Examples:**
```json
{
  "kind": 2357,
  "content": "650",
  "tags": [
    ["unit", "kcal"],
    ["t", "health"],
    ["t", "calories"],
    ["meal", "lunch"],
    ["food", "Chicken salad with avocado"],
    ["macros", "{\"protein\":35,\"carbs\":15,\"fat\":42}"],
    ["timestamp", "2025-05-06T13:00:00Z"],
    ["accuracy", "estimate"],
    ["status", "active"]
  ]
}
```

### Privacy Notes
- As with all NIP-101h metrics, client implementations SHOULD default to encrypting the event content using NIP-44, offering an explicit option for unencrypted publishing for both consumed and expended calorie events.

### Known Client Implementations
- Runstr