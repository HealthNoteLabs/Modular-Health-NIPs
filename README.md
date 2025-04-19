# Health & Fitness on Nostr: Ultra-Modular NIPs

## Introduction

The modular approach we're creating for health and fitness data on Nostr represents a fundamental shift in how decentralized health metrics can be standardized and shared. By developing ultra-specific NIPs for individual metrics—ranging from step counts to VO2max to sleep quality—we're enabling a "building block" ecosystem where developers can implement precisely what they need without unnecessary overhead.

This granularity offers several distinct advantages:

- **Privacy-First Design**: Allows selective sharing of specific health aspects
- **Specialized Evolution**: Enables apps to evolve independently while maintaining interoperability
- **Device Compatibility**: Accommodates the wide variety of tracking devices and methodologies
- **Organic Growth**: Permits community-driven expansion as new health metrics emerge

Rather than forcing developers to implement extensive specifications they may not need, this approach embraces Nostr's decentralized ethos by letting consumers and developers compose their own health data ecosystem from standardized, interoperable components—creating a more resilient, flexible, and privacy-respecting foundation for the future of decentralized health and fitness applications.

## Implementation Guidelines

### Implementation Levels

| Level | Description | Target |
|-------|-------------|--------|
| **Basic** | Implement only essential NIPs needed for core functionality | Simple apps, minimal tracking |
| **Standard** | Implement common metrics and references between them | General fitness apps |
| **Advanced** | Implement specialized metrics and full relationship structure | Comprehensive health platforms |

### Privacy Classification

All health NIPs support three privacy levels that clients should respect:

- `public`: Data suitable for public sharing
- `friends`: Data intended for a restricted audience
- `private`: Sensitive data that should have additional protection

### Unit Standardization

Clients should support both metric and imperial units with conversion capabilities:

- Primary units are defined in the specification (typically metric)
- Imperial equivalents can be included in dedicated imperial tags
- The `unit_standard` tag may indicate preference

### Event Relationships

![Event Relationships](https://i.imgur.com/XGJdA5m.png)

*Diagram: Health metrics can reference each other to create a comprehensive health profile. Workout activities can reference multiple metrics, while the health profile can act as a central reference point.*

## Core Health NIPs

### NIP-X18: Step Count

```json
{
  "kind": 32018,
  "created_at": 1682276455,
  "tags": [
    ["d", "<unique-identifier>"],
    ["step_count", "8547", "steps"],
    ["step_period", "daily"],
    ["start_time", "1682222400"],
    ["end_time", "1682308799"],
    ["step_goal", "10000", "steps"],
    ["source", "device"],
    ["device", "apple_watch_se", "Apple Watch SE"],
    ["goal_status", "in_progress"],
    ["goal_progress", "85", "percent"],
    ["privacy_level", "public"],
    ["unit_standard", "metric"],
    ["v", "1.0.0"],
    ["t", "health", "activity", "steps"]
  ],
  "content": "Almost hit my step goal today despite the rain!",
  "pubkey": "<pubkey>",
  "id": "<id>",
  "sig": "<sig>"
}
```

**Required Tags**: `d`, `step_count`, `step_period`, `start_time`, `end_time`  
**Optional Tags**: `step_goal`, `source`, `device`, `goal_status`, `goal_progress`, `privacy_level`, `unit_standard`, `v`, `t`

**Client Implementation Notes**: Clients should display step progress visually when possible and support daily/weekly aggregation views.

### NIP-X19: Stride Length

```json
{
  "kind": 32019,
  "created_at": 1682276455,
  "tags": [
    ["d", "<unique-identifier>"],
    ["stride_length", "1.15", "m"],
    ["stride_length_avg", "1.12", "m"],
    ["stride_length_max", "1.25", "m"],
    ["activity_reference", "<event-id>", "<relay-url>"],
    ["measurement_method", "gps"],
    ["height_reference", "<event-id>", "<relay-url>"],
    ["height_normalized_ratio", "0.63", "ratio"],
    ["cadence_correlation", "<event-id>", "<relay-url>"],
    ["imperial_stride_length", "3.77", "ft"],
    ["privacy_level", "friends"],
    ["unit_standard", "both"],
    ["v", "1.0.0"],
    ["t", "running", "stride", "biomechanics"]
  ],
  "pubkey": "<pubkey>",
  "id": "<id>",
  "sig": "<sig>"
}
```

**Required Tags**: `d`, `stride_length`  
**Optional Tags**: Other measurement details, references, and standardization tags

**Client Implementation Notes**: Clients should consider showing stride length in relation to height when height reference is available.

### NIP-X20: Single-Point Heart Rate

```json
{
  "kind": 32020,
  "created_at": 1682276455,
  "tags": [
    ["d", "<unique-identifier>"],
    ["heart_rate", "72", "bpm"],
    ["heart_rate_context", "resting"],
    ["measurement_time", "1682276400"],
    ["measurement_method", "optical"],
    ["measurement_position", "wrist"],
    ["measurement_status", "seated"],
    ["device", "garmin_fenix7", "Garmin Fenix 7"],
    ["activity_reference", "<event-id>", "<relay-url>"],
    ["related_metrics", "32021:<hrv-event-id>,32042:<max-hr-event-id>"],
    ["privacy_level", "friends"],
    ["v", "1.0.0"],
    ["t", "health", "heart_rate", "vital"]
  ],
  "pubkey": "<pubkey>",
  "id": "<id>",
  "sig": "<sig>"
}
```

**Required Tags**: `d`, `heart_rate`, `measurement_time`  
**Optional Tags**: Context, method, device, references, and standardization tags

**Client Implementation Notes**: Clients should display different heart rate contexts distinctly and consider heart rate zones when heart rate max references are available.

### NIP-X21: Heart Rate Variability (HRV)

```json
{
  "kind": 32021,
  "created_at": 1682276455,
  "tags": [
    ["d", "<unique-identifier>"],
    ["hrv", "45", "ms"],
    ["hrv_metric", "rmssd"],
    ["measurement_time", "1682276400"],
    ["measurement_duration", "300", "seconds"],
    ["measurement_method", "ecg"],
    ["measurement_context", "morning"],
    ["device", "oura_ring", "Oura Ring Gen 3"],
    ["baseline_reference", "<event-id>", "<relay-url>"],
    ["readiness_score", "68", "0-100"],
    ["related_metrics", "32020:<hr-event-id>,32044:<stress-event-id>"],
    ["privacy_level", "private"],
    ["v", "1.0.0"],
    ["t", "health", "hrv", "recovery", "readiness"]
  ],
  "pubkey": "<pubkey>",
  "id": "<id>",
  "sig": "<sig>"
}
```

**Required Tags**: `d`, `hrv`, `hrv_metric`, `measurement_time`  
**Optional Tags**: Additional measurement details, references, context, and standardization tags

**Client Implementation Notes**: Clients should consider implementing trend analysis for HRV as single readings have limited value outside of context.

### NIP-X22: Blood Pressure

```json
{
  "kind": 32022,
  "created_at": 1682276455,
  "tags": [
    ["d", "<unique-identifier>"],
    ["systolic", "120", "mmHg"],
    ["diastolic", "80", "mmHg"],
    ["measurement_time", "1682276400"],
    ["measurement_position", "seated"],
    ["measurement_arm", "left"],
    ["measurement_method", "oscillometric"],
    ["device", "omron_m7", "Omron M7 Intelli IT"],
    ["pulse_pressure", "40", "mmHg"],
    ["mean_arterial_pressure", "93", "mmHg"],
    ["classification", "normal"],
    ["related_metrics", "32020:<hr-event-id>"],
    ["privacy_level", "private"],
    ["v", "1.0.0"],
    ["t", "health", "blood_pressure", "vital", "cardiovascular"]
  ],
  "content": "Measured after 5 minutes of rest",
  "pubkey": "<pubkey>",
  "id": "<id>",
  "sig": "<sig>"
}
```

**Required Tags**: `d`, `systolic`, `diastolic`, `measurement_time`  
**Optional Tags**: Additional measurement details, calculation derivatives, context, and standardization tags

**Client Implementation Notes**: Clients should implement standard BP classification visualizations (normal, elevated, hypertension stages).

## Body Composition NIPs

### NIP-X23: Body Weight

```json
{
  "kind": 32023,
  "created_at": 1682276455,
  "tags": [
    ["d", "<unique-identifier>"],
    ["weight", "75.4", "kg"],
    ["measurement_time", "1682276400"],
    ["measurement_context", "morning"],
    ["measurement_method", "scale"],
    ["device", "withings_body+", "Withings Body+"],
    ["clothes_status", "light"],
    ["weekly_average", "75.2", "kg"],
    ["monthly_trend", "-0.5", "kg"],
    ["goal_reference", "<event-id>", "<relay-url>"],
    ["imperial_weight", "166.2", "lbs"],
    ["goal_status", "in_progress"],
    ["goal_value", "72.0", "kg"],
    ["privacy_level", "friends"],
    ["unit_standard", "both"],
    ["v", "1.0.0"],
    ["t", "health", "weight", "body_composition"]
  ],
  "content": "Normal hydration, measured after waking",
  "pubkey": "<pubkey>",
  "id": "<id>",
  "sig": "<sig>"
}
```

**Required Tags**: `d`, `weight`, `measurement_time`  
**Optional Tags**: Context, method, trends, goals, and standardization tags

**Client Implementation Notes**: Clients should support both weight tracking and goal-setting functions, with trend visualization.

### NIP-X24: Body Height

```json
{
  "kind": 32024,
  "created_at": 1682276455,
  "tags": [
    ["d", "<unique-identifier>"],
    ["height", "182.5", "cm"],
    ["measurement_time", "1682276400"],
    ["measurement_method", "stadiometer"],
    ["measurement_context", "medical_checkup"],
    ["accuracy", "0.5", "cm"],
    ["shoes_status", "without"],
    ["growth_stage", "completed"],
    ["imperial_height", "5'11.9\"", "ft_in"],
    ["privacy_level", "public"],
    ["unit_standard", "both"],
    ["v", "1.0.0"],
    ["t", "health", "height", "body_measurement", "profile"]
  ],
  "pubkey": "<pubkey>",
  "id": "<id>",
  "sig": "<sig>"
}
```

**Required Tags**: `d`, `height`, `measurement_time`  
**Optional Tags**: Measurement details, accuracy, context, and standardization tags

**Client Implementation Notes**: For non-adults, clients should consider growth tracking capabilities.

### NIP-X25: Body Fat Percentage

```json
{
  "kind": 32025,
  "created_at": 1682276455,
  "tags": [
    ["d", "<unique-identifier>"],
    ["body_fat", "18.2", "percentage"],
    ["measurement_time", "1682276400"],
    ["measurement_method", "bioimpedance"],
    ["device", "inbody_270", "InBody 270"],
    ["essential_fat", "3.0", "percentage"],
    ["visceral_fat", "7", "level"],
    ["fat_mass", "13.7", "kg"],
    ["fat_free_mass", "61.6", "kg"],
    ["classification", "fit"],
    ["comparison_reference", "<event-id>", "<relay-url>"],
    ["related_metrics", "32023:<weight-event-id>"],
    ["privacy_level", "private"],
    ["v", "1.0.0"],
    ["t", "health", "body_fat", "body_composition"]
  ],
  "pubkey": "<pubkey>",
  "id": "<id>",
  "sig": "<sig>"
}
```

**Required Tags**: `d`, `body_fat`, `measurement_time`  
**Optional Tags**: Measurement method, device, composition details, references, and standardization tags

**Client Implementation Notes**: Clients should display appropriate classification ranges based on biological sex and age.

### NIP-X26: Resting Metabolic Rate

```json
{
  "kind": 32026,
  "created_at": 1682276455,
  "tags": [
    ["d", "<unique-identifier>"],
    ["rmr", "1720", "kcal/day"],
    ["measurement_time", "1682276400"],
    ["measurement_method", "indirect_calorimetry"],
    ["formula_used", "measured"],
    ["device", "metabolic_cart", "Metabolic Cart"],
    ["fasting_hours", "12", "hours"],
    ["weight_reference", "<event-id>", "<relay-url>"],
    ["body_fat_reference", "<event-id>", "<relay-url>"],
    ["estimation_formula", "mifflin_st_jeor"],
    ["estimated_value", "1680", "kcal/day"],
    ["related_metrics", "32028:<caloric-intake-event-id>"],
    ["privacy_level", "private"],
    ["v", "1.0.0"],
    ["t", "health", "metabolism", "energy", "nutrition"]
  ],
  "pubkey": "<pubkey>",
  "id": "<id>",
  "sig": "<sig>"
}
```

**Required Tags**: `d`, `rmr`, `measurement_time`  
**Optional Tags**: Measurement method, formula, references, estimation, and standardization tags

**Client Implementation Notes**: Clients should consider showing daily caloric needs based on RMR and activity level.

## Vital Signs NIPs

### NIP-X27: Oxygen Saturation

```json
{
  "kind": 32027,
  "created_at": 1682276455,
  "tags": [
    ["d", "<unique-identifier>"],
    ["spo2", "98", "percentage"],
    ["measurement_time", "1682276400"],
    ["measurement_method", "pulse_oximeter"],
    ["measurement_context", "rest"],
    ["device", "nonin_3230", "Nonin 3230"],
    ["altitude", "1200", "m"],
    ["activity_reference", "<event-id>", "<relay-url>"],
    ["respiratory_rate", "16", "brpm"],
    ["privacy_level", "private"],
    ["v", "1.0.0"],
    ["t", "health", "oxygen", "vital", "respiratory"]
  ],
  "pubkey": "<pubkey>",
  "id": "<id>",
  "sig": "<sig>"
}
```

**Required Tags**: `d`, `spo2`, `measurement_time`  
**Optional Tags**: Method, context, device, altitude, reference, and standardization tags

**Client Implementation Notes**: Clients should incorporate altitude adjustments for SpO2 interpretation when altitude data is available.

### NIP-X34: Body Temperature

```json
{
  "kind": 32034,
  "created_at": 1682276455,
  "tags": [
    ["d", "<unique-identifier>"],
    ["temperature", "36.8", "celsius"],
    ["measurement_time", "1682276400"],
    ["measurement_method", "oral"],
    ["measurement_context", "resting"],
    ["device", "braun_thermoscan", "Braun ThermoScan 7"],
    ["activity_reference", "<event-id>", "<relay-url>"],
    ["ambient_temperature", "22.0", "celsius"],
    ["core_temperature", "37.2", "celsius"],
    ["fever_status", "none"],
    ["imperial_temperature", "98.2", "fahrenheit"],
    ["privacy_level", "private"],
    ["unit_standard", "both"],
    ["v", "1.0.0"],
    ["t", "health", "temperature", "vital", "thermoregulation"]
  ],
  "pubkey": "<pubkey>",
  "id": "<id>",
  "sig": "<sig>"
}
```

**Required Tags**: `d`, `temperature`, `measurement_time`  
**Optional Tags**: Method, context, device, references, status, and standardization tags

**Client Implementation Notes**: Clients should clearly indicate fever status and different measurement methods.

### NIP-X35: Respiratory Rate

```json
{
  "kind": 32035,
  "created_at": 1682276455,
  "tags": [
    ["d", "<unique-identifier>"],
    ["respiratory_rate", "14", "brpm"],
    ["measurement_time", "1682276400"],
    ["measurement_context", "resting"],
    ["measurement_method", "chest_strap"],
    ["device", "polar_h10", "Polar H10"],
    ["activity_reference", "<event-id>", "<relay-url>"],
    ["breathing_pattern", "normal"],
    ["tidal_volume", "500", "ml"],
    ["minute_ventilation", "7.0", "l/min"],
    ["related_metrics", "32027:<spo2-event-id>"],
    ["privacy_level", "private"],
    ["v", "1.0.0"],
    ["t", "health", "respiratory", "breathing", "vital"]
  ],
  "pubkey": "<pubkey>",
  "id": "<id>",
  "sig": "<sig>"
}
```

**Required Tags**: `d`, `respiratory_rate`, `measurement_time`  
**Optional Tags**: Context, method, device, pattern, volumes, and standardization tags

**Client Implementation Notes**: Clients should show normal ranges based on age and activity context.

## Nutrition & Hydration NIPs

### NIP-X28: Single Meal Caloric Intake

```json
{
  "kind": 32028,
  "created_at": 1682276455,
  "tags": [
    ["d", "<unique-identifier>"],
    ["calories", "650", "kcal"],
    ["meal_time", "1682270000"],
    ["meal_type", "lunch"],
    ["protein", "35", "g"],
    ["carbohydrates", "75", "g"],
    ["fat", "22", "g"],
    ["fiber", "12", "g"],
    ["sugar", "8", "g"],
    ["meal_name", "Grilled Chicken Salad"],
    ["tracking_method", "database"],
    ["hunger_pre_meal", "7", "1-10"],
    ["fullness_post_meal", "8", "1-10"],
    ["photo_reference", "<event-id>", "<relay-url>"],
    ["related_metrics", "32026:<rmr-event-id>"],
    ["privacy_level", "friends"],
    ["v", "1.0.0"],
    ["t", "nutrition", "meal", "food", "calories"]
  ],
  "content": "Grilled chicken breast with leafy greens, olive oil dressing, cherry tomatoes, and walnuts.",
  "pubkey": "<pubkey>",
  "id": "<id>",
  "sig": "<sig>"
}
```

**Required Tags**: `d`, `calories`, `meal_time`, `meal_type`  
**Optional Tags**: Macronutrients, meal details, tracking method, ratings, references, and standardization tags

**Client Implementation Notes**: Clients should implement macronutrient visualizations and allow for daily aggregation of multiple meals.

### NIP-X29: Daily Water Intake

```json
{
  "kind": 32029,
  "created_at": 1682276455,
  "tags": [
    ["d", "<unique-identifier>"],
    ["water_intake", "2800", "ml"],
    ["measurement_period", "daily"],
    ["start_time", "1682222400"],
    ["end_time", "1682308799"],
    ["tracking_method", "app"],
    ["intake_goal", "3000", "ml"],
    ["non_water_fluids", "500", "ml"],
    ["hydration_score", "85", "0-100"],
    ["weather_temperature", "28", "celsius"],
    ["activity_level", "moderate"],
    ["goal_status", "in_progress"],
    ["goal_progress", "93", "percent"],
    ["imperial_water_intake", "94.7", "fl_oz"],
    ["privacy_level", "public"],
    ["unit_standard", "both"],
    ["v", "1.0.0"],
    ["t", "health", "hydration", "water", "fluid"]
  ],
  "pubkey": "<pubkey>",
  "id": "<id>",
  "sig": "<sig>"
}
```

**Required Tags**: `d`, `water_intake`, `measurement_period`, `start_time`, `end_time`  
**Optional Tags**: Tracking details, goals, context, progress, and standardization tags

**Client Implementation Notes**: Clients should show progress toward daily goals and consider weather/activity in recommendations.

## Sleep NIPs

### NIP-X30: Sleep Duration

```json
{
  "kind": 32030,
  "created_at": 1682276455,
  "tags": [
    ["d", "<unique-identifier>"],
    ["sleep_duration", "28800", "seconds"],
    ["sleep_start", "1682222400"],
    ["sleep_end", "1682251200"],
    ["time_to_fall_asleep", "900", "seconds"],
    ["tracking_method", "device"],
    ["device", "fitbit_charge5", "Fitbit Charge 5"],
    ["interruptions", "2", "count"],
    ["interruption_duration", "1200", "seconds"],
    ["sleep_goal", "28800", "seconds"],
    ["actual_sleep", "27600", "seconds"],
    ["actual_sleep_percentage", "96", "percentage"],
    ["related_metrics", "32031:<sleep-quality-event-id>"],
    ["privacy_level", "friends"],
    ["v", "1.0.0"],
    ["t", "health", "sleep", "recovery", "duration"]
  ],
  "pubkey": "<pubkey>",
  "id": "<id>",
  "sig": "<sig>"
}
```

**Required Tags**: `d`, `sleep_duration`, `sleep_start`, `sleep_end`  
**Optional Tags**: Details, tracking method, device, goals, and standardization tags

**Client Implementation Notes**: Clients should visualize sleep duration against personal goals and population averages.

### NIP-X31: Sleep Quality Score

```json
{
  "kind": 32031,
  "created_at": 1682276455,
  "tags": [
    ["d", "<unique-identifier>"],
    ["sleep_quality", "85", "0-100"],
    ["sleep_reference", "<event-id>", "<relay-url>"],
    ["deep_sleep", "5400", "seconds"],
    ["light_sleep", "14400", "seconds"],
    ["rem_sleep", "7200", "seconds"],
    ["awake_time", "1800", "seconds"],
    ["efficiency", "92", "percentage"],
    ["tracking_method", "device"],
    ["device", "oura_ring", "Oura Ring Gen 3"],
    ["subjective_rating", "7", "1-10"],
    ["next_day_energy", "8", "1-10"],
    ["score_calculation", "vendor_algorithm"],
    ["related_metrics", "32030:<sleep-duration-event-id>"],
    ["privacy_level", "friends"],
    ["v", "1.0.0"],
    ["t", "health", "sleep", "recovery", "quality"]
  ],
  "pubkey": "<pubkey>",
  "id": "<id>",
  "sig": "<sig>"
}
```

**Required Tags**: `d`, `sleep_quality`  
**Optional Tags**: Sleep reference, sleep stages, efficiency, tracking details, ratings, and standardization tags

**Client Implementation Notes**: Clients should implement sleep cycle visualizations and show sleep quality trends over time.

## Performance NIPs

### NIP-X32: Running Pace

```json
{
  "kind": 32032,
  "created_at": 1682276455,
  "tags": [
    ["d", "<unique-identifier>"],
    ["pace", "5:30", "min/km"],
    ["pace_context", "average"],
    ["activity_reference", "<event-id>", "<relay-url>"],
    ["distance_reference", "5.0", "km"],
    ["imperial_pace", "8:51", "min/mi"],
    ["speed_equivalent", "10.9", "km/h"],
    ["grade_adjusted_pace", "5:15", "min/km"],
    ["grade", "-2.0", "percent"],
    ["terrain", "road"],
    ["related_metrics", "32033:<power-event-id>,32038:<record-event-id>"],
    ["privacy_level", "public"],
    ["unit_standard", "both"],
    ["v", "1.0.0"],
    ["t", "running", "pace", "performance", "speed"]
  ],
  "pubkey": "<pubkey>",
  "id": "<id>",
  "sig": "<sig>"
}
```

**Required Tags**: `d`, `pace`, `pace_context`  
**Optional Tags**: References, conversions, adjustments, terrain, and standardization tags

**Client Implementation Notes**: Clients should support conversion between pace and speed, and display grade-adjusted values when available.

### NIP-X33: Running Power

```json
{
  "kind": 32033,
  "created_at": 1682276455,
  "tags": [
    ["d", "<unique-identifier>"],
    ["power", "285", "watts"],
    ["power_context", "average"],
    ["activity_reference", "<event-id>", "<relay-url>"],
    ["power_per_kg", "3.8", "watts/kg"],
    ["measurement_method", "chest_pod"],
    ["device", "stryd", "Stryd"],
    ["power_zone", "3", "1-7"],
    ["pace_correlation", "<event-id>", "<relay-url>"],
    ["heart_rate_correlation", "<event-id>", "<relay-url>"],
    ["related_metrics", "32032:<pace-event-id>,32020:<hr-event-id>"],
    ["privacy_level", "public"],
    ["v", "1.0.0"],
    ["t", "running", "power", "performance", "training"]
  ],
  "pubkey": "<pubkey>",
  "id": "<id>",
  "sig": "<sig>"
}
```

**Required Tags**: `d`, `power`, `power_context`  
**Optional Tags**: Activity reference, normalized power, method, device, zones, correlations, and standardization tags

**Client Implementation Notes**: Clients should present power in zones when available and support watts/kg normalization for comparison.

### NIP-X36: Foot Strike Pattern

```json
{
  "kind": 32036,
  "created_at": 1682276455,
  "tags": [
    ["d", "<unique-identifier>"],
    ["foot_strike", "forefoot"],
    ["activity_reference", "<event-id>", "<relay-url>"],
    ["measurement_method", "pressure_sensor"],
    ["device", "runscribe", "RunScribe Plus"],
    ["strike_angle", "18.5", "degrees"],
    ["left_foot_strike", "midfoot", ""],
    ["right_foot_strike", "forefoot", ""],
    ["speed_correlation", "increases_with_speed"],
    ["fatigue_impact", "shifts_to_heel"],
    ["privacy_level", "friends"],
    ["v", "1.0.0"],
    ["t", "running", "foot_strike", "form", "biomechanics"]
  ],
  "pubkey": "<pubkey>",
  "id": "<id>",
  "sig": "<sig>"
}
```

**Required Tags**: `d`, `foot_strike`  
**Optional Tags**: Activity reference, method, device, detailed measurements, correlations, and standardization tags

**Client Implementation Notes**: Clients should provide educational content on foot strike patterns when displaying this data.

### NIP-X37: VO2max Estimate

```json
{
  "kind": 32037,
  "created_at": 1682276455,
  "tags": [
    ["d", "<unique-identifier>"],
    ["vo2max", "52.3", "ml/kg/min"],
    ["measurement_time", "1682276400"],
    ["measurement_method", "firstbeat"],
    ["test_reference", "<event-id>", "<relay-url>"],
    ["device", "garmin_forerunner945", "Garmin Forerunner 945"],
    ["fitness_level", "good"],
    ["age_gender_percentile", "85", "percentile"],
    ["predicted_race_time_5k", "00:22:15", "hh:mm:ss"],
    ["predicted_race_time_10k", "00:46:30", "hh:mm:ss"],
    ["predicted_race_time_half", "01:42:20", "hh:mm:ss"],
    ["predicted_race_time_full", "03:35:40", "hh:mm:ss"],
    ["related_metrics", "32038:<record-event-id>,32043:<threshold-event-id>"],
    ["privacy_level", "public"],
    ["v", "1.0.0"],
    ["t", "fitness", "vo2max", "cardio", "endurance"]
  ],
  "pubkey": "<pubkey>",
  "id": "<id>",
  "sig": "<sig>"
}
```

**Required Tags**: `d`, `vo2max`, `measurement_time`  
**Optional Tags**: Method, references, device, fitness level, percentile, predictions, and standardization tags

**Client Implementation Notes**: Clients should show fitness categories and age/gender adjusted comparisons.

### NIP-X38: Athletic Personal Record

```json
{
  "kind": 32038,
  "created_at": 1682276455,
  "tags": [
    ["d", "<unique-identifier>"],
    ["record_type", "time"],
    ["record_activity", "run"],
    ["record_value", "00:19:45", ""],
    ["record_metric", "5k"],
    ["record_unit", "time"],
    ["record_date", "1682180055"],
    ["previous_record", "00:20:12", ""],
    ["previous_record_date", "1650644055"],
    ["improvement", "27", "seconds"],
    ["improvement_percentage", "2.2", "percent"],
    ["activity_reference", "<event-id>", "<relay-url>"],
    ["location", "Amsterdam Marathon", ""],
    ["verified", "true"],
    ["related_metrics", "32032:<pace-event-id>,32037:<vo2max-event-id>"],
    ["privacy_level", "public"],
    ["v", "1.0.0"],
    ["t", "achievement", "record", "personal_best", "PR", "PB"]
  ],
  "content": "New 5K PR at Amsterdam park! Perfect weather conditions, felt strong throughout.",
  "pubkey": "<pubkey>",
  "id": "<id>",
  "sig": "<sig>"
}
```

**Required Tags**: `d`, `record_type`, `record_activity`, `record_value`, `record_metric`  
**Optional Tags**: Record details, previous records, improvement, references, location, verification, and standardization tags

**Client Implementation Notes**: Clients should celebrate PRs with visual indicators and implement progression charts.

### NIP-X42: Maximum Heart Rate

```json
{
  "kind": 32042,
  "created_at": 1682276455,
  "tags": [
    ["d", "<unique-identifier>"],
    ["max_heart_rate", "185", "bpm"],
    ["determination_method", "measured"],
    ["formula_used", "n/a"],
    ["test_type", "race"],
    ["test_activity", "running"],
    ["test_reference", "<event-id>", "<relay-url>"],
    ["confidence_level", "high"],
    ["previous_max", "182", "bpm"],
    ["previous_date", "1650644055"],
    ["age_predicted", "188", "bpm"],
    ["related_metrics", "32020:<hr-event-id>,32039:<zones-event-id>"],
    ["privacy_level", "friends"],
    ["v", "1.0.0"],
    ["t", "heart_rate", "max_hr", "performance", "cardiac"]
  ],
  "pubkey": "<pubkey>",
  "id": "<id>",
  "sig": "<sig>"
}
```

**Required Tags**: `d`, `max_heart_rate`  
**Optional Tags**: Determination method, test details, confidence, comparison, prediction, and standardization tags

**Client Implementation Notes**: Clients should use max HR for zone calculations when displaying heart rate data.

### NIP-X43: Lactate Threshold

```json
{
  "kind": 32043,
  "created_at": 1682276455,
  "tags": [
    ["d", "<unique-identifier>"],
    ["lactate_threshold_heart_rate", "165", "bpm"],
    ["lactate_threshold_pace", "4:25", "min/km"],
    ["lactate_threshold_power", "245", "watts"],
    ["test_method", "blood_test"],
    ["test_protocol", "step_test"],
    ["test_reference", "<event-id>", "<relay-url>"],
    ["blood_lactate", "4.0", "mmol/L"],
    ["percent_max_heart_rate", "89", "percent"],
    ["device", "lactate_pro_2", "Lactate Pro 2"],
    ["sport", "running"],
    ["testing_facility", "lab"],
    ["related_metrics", "32032:<pace-event-id>,32042:<max-hr-event-id>"],
    ["imperial_threshold_pace", "7:05", "min/mi"],
    ["privacy_level", "private"],
    ["unit_standard", "both"],
    ["v", "1.0.0"],
    ["t", "threshold", "lactate", "performance", "training"]
  ],
  "pubkey": "<pubkey>",
  "id": "<id>",
  "sig": "<sig>"
}
```

**Required Tags**: `d` and at least one threshold value (HR, pace, or power)  
**Optional Tags**: Test details, blood values, percentages, device, sport, facility, references, and standardization tags

**Client Implementation Notes**: Clients should use lactate threshold for advanced training zone calculations.

## Wellness NIPs

### NIP-X39: Training Zones

```json
{
  "kind": 32039,
  "created_at": 1682276455,
  "tags": [
    ["d", "<unique-identifier>"],
    ["zone_parameter", "heart_rate"],
    ["zone_model", "5-zone"],
    ["zone_type", "training"],
    ["zone_1_lower", "0", "bpm"],
    ["zone_1_upper", "122", "bpm"],
    ["zone_1_name", "Recovery", ""],
    ["zone_2_lower", "123", "bpm"],
    ["zone_2_upper", "145", "bpm"],
    ["zone_2_name", "Aerobic", ""],
    ["zone_3_lower", "146", "bpm"],
    ["zone_3_upper", "160", "bpm"],
    ["zone_3_name", "Tempo", ""],
    ["zone_4_lower", "161", "bpm"],
    ["zone_4_upper", "170", "bpm"],
    ["zone_4_name", "Threshold", ""],
    ["zone_5_lower", "171", "bpm"],
    ["zone_5_upper", "185", "bpm"],
    ["zone_5_name", "Anaerobic", ""],
    ["zone_calculation_method", "percentage_max"],
    ["reference_max", "185", "bpm"],
    ["reference_threshold", "165", "bpm"],
    ["reference_test", "<event-id>", "<relay-url>"],
    ["sport", "running"],
    ["related_metrics", "32042:<max-hr-event-id>,32043:<threshold-event-id>"],
    ["privacy_level", "public"],
    ["v", "1.0.0"],
    ["t", "training", "zones", "intensity", "performance"]
  ],
  "pubkey": "<pubkey>",
  "id": "<id>",
  "sig": "<sig>"
}
```

**Required Tags**: `d`, `zone_parameter`, `zone_model`  
**Optional Tags**: Zone type, zone definitions, calculation method, references, sport, and standardization tags

**Client Implementation Notes**: Clients should visualize zones in workout analysis and support multiple zone parameters (HR, pace, power).

### NIP-X40: Active Minutes

```json
{
  "kind": 32040,
  "created_at": 1682276455,
  "tags": [
    ["d", "<unique-identifier>"],
    ["active_minutes", "65", "minutes"],
    ["period", "daily"],
    ["start_time", "1682222400"],
    ["end_time", "1682308799"],
    ["intensity", "combined"],
    ["source", "device"],
    ["device", "apple_watch_se", "Apple Watch SE"],
    ["goal_reference", "150", "weekly_minutes"],
    ["goal_percentage", "43", "percent"],
    ["moderate_minutes", "45", "minutes"],
    ["vigorous_minutes", "20", "minutes"],
    ["activity_breakdown", "walking:30,running:20,cycling:15", "minutes"],
    ["related_metrics", "32018:<steps-event-id>"],
    ["privacy_level", "public"],
    ["v", "1.0.0"],
    ["t", "health", "activity", "exercise", "tracking"]
  ],
  "pubkey": "<pubkey>",
  "id": "<id>",
  "sig": "<sig>"
}
```

**Required Tags**: `d`, `active_minutes`, `period`, `start_time`, `end_time`  
**Optional Tags**: Intensity, source, device, goals, breakdown, and standardization tags

**Client Implementation Notes**: Clients should track progress toward WHO recommended 150 minutes/week of moderate activity.

### NIP-X44: Daily Stress Score

```json
{
  "kind": 32044,
  "created_at": 1682276455,
  "tags": [
    ["d", "<unique-identifier>"],
    ["stress_score", "65", "0-100"],
    ["period", "daily"],
    ["start_time", "1682222400"],
    ["end_time", "1682308799"],
    ["calculation_method", "hrv"],
    ["low_stress_time", "360", "minutes"],
    ["medium_stress_time", "720", "minutes"],
    ["high_stress_time", "180", "minutes"],
    ["rest_time", "180", "minutes"],
    ["device", "garmin_fenix7", "Garmin Fenix 7"],
    ["subjective_feeling", "moderate"],
    ["weekly_trend", "+5", "points"],
    ["related_metrics", "32021:<hrv-event-id>"],
    ["privacy_level", "private"],
    ["v", "1.0.0"],
    ["t", "health", "stress", "recovery", "wellbeing"]
  ],
  "pubkey": "<pubkey>",
  "id": "<id>",
  "sig": "<sig>"
}
```

**Required Tags**: `d`, `stress_score`, `period`, `start_time`, `end_time`  
**Optional Tags**: Calculation method, time breakdown, device, subjective feeling, trends, and standardization tags

**Client Implementation Notes**: Clients should provide stress trend analysis and recovery recommendations.

### NIP-X45: Blood Glucose

```json
{
  "kind": 32045,
  "created_at": 1682276455,
  "tags": [
    ["d", "<unique-identifier>"],
    ["glucose_value", "5.4", "mmol/L"],
    ["glucose_value_mgdl", "97", "mg/dL"],
    ["measurement_time", "1682276400"],
    ["measurement_context", "fasting"],
    ["measurement_method", "cgm"],
    ["device", "dexcom_g6", "Dexcom G6"],
    ["meal_reference", "<event-id>", "<relay-url>"],
    ["time_since_meal", "120", "minutes"],
    ["activity_reference", "<event-id>", "<relay-url>"],
    ["insulin_dose", "0", "units"],
    ["medication_status", "none"],
    ["related_metrics", "32028:<meal-event-id>"],
    ["privacy_level", "private"],
    ["unit_standard", "both"],
    ["v", "1.0.0"],
    ["t", "health", "glucose", "metabolic", "diabetes"]
  ],
  "pubkey": "<pubkey>",
  "id": "<id>",
  "sig": "<sig>"
}
```

**Required Tags**: `d`, `glucose_value`, `measurement_time`  
**Optional Tags**: Context, method, device, references, time relationships, medication, and standardization tags

**Client Implementation Notes**: Clients should display normal ranges and implement CGM trend visualization when time-series data is available.

## Body Measurement NIPs

### NIP-X41: Muscle Circumference

```json
{
  "kind": 32041,
  "created_at": 1682276455,
  "tags": [
    ["d", "<unique-identifier>"],
    ["measurement_type", "circumference"],
    ["body_part", "bicep"],
    ["measurement_value", "38.5", "cm"],
    ["measurement_time", "1682276400"],
    ["measurement_side", "right"],
    ["measurement_position", "flexed"],
    ["measurement_method", "tape"],
    ["comparison_value", "37.2", "cm"],
    ["comparison_date", "1650644055"],
    ["change", "+1.3", "cm"],
    ["change_percentage", "3.5", "percent"],
    ["imperial_measurement", "15.2", "inches"],
    ["related_metrics", "32025:<body-fat-event-id>"],
    ["privacy_level", "private"],
    ["unit_standard", "both"],
    ["v", "1.0.0"],
    ["t", "body", "measurement", "muscle", "tracking"]
  ],
  "pubkey": "<pubkey>",
  "id": "<id>",
  "sig": "<sig>"
}
```

**Required Tags**: `d`, `measurement_type`, `body_part`, `measurement_value`, `measurement_time`  
**Optional Tags**: Measurement details, comparison, change, imperial conversion, references, and standardization tags

**Client Implementation Notes**: Clients should implement body tracking with visual aids and progress charts.

## Additional Recommended NIPs

### NIP-X46: Workout Activity

```json
{
  "kind": 32046,
  "created_at": 1682276455,
  "tags": [
    ["d", "<unique-identifier>"],
    ["workout_type", "run"],
    ["start_time", "1682270000"],
    ["end_time", "1682273600"],
    ["duration", "3600", "seconds"],
    ["distance", "8.2", "km"],
    ["calories", "560", "kcal"],
    ["intensity", "moderate"],
    ["location_type", "outdoor"],
    ["planned_workout", "<event-id>", "<relay-url>"],
    ["route_data", "<geojson-data>"],
    ["avg_heart_rate", "158", "bpm"],
    ["max_heart_rate", "172", "bpm"],
    ["avg_pace", "6:45", "min/km"],
    ["elevation_gain", "124", "m"],
    ["activity_title", "Morning steady run"],
    ["perceived_exertion", "7", "1-10"],
    ["weather_conditions", "cloudy,15C,wind:8kph"],
    ["imperial_distance", "5.1", "miles"],
    ["privacy_level", "friends"],
    ["unit_standard", "both"],
    ["v", "1.0.0"],
    ["t", "workout", "exercise", "activity", "training"]
  ],
  "content": "Morning run around the park. Felt good despite the rain. Legs still a bit tired from yesterday's interval session.",
  "pubkey": "<pubkey>",
  "id": "<id>",
  "sig": "<sig>"
}
```

**Required Tags**: `d`, `workout_type`, `start_time`, `end_time`, `duration`  
**Optional Tags**: Distance, calories, intensity, location, references, metrics, conditions, and standardization tags

**Client Implementation Notes**: This NIP serves as a comprehensive workout summary that can reference more detailed metrics. Clients should support rich workout visualizations and aggregate statistics.

### NIP-X47: Health Profile

```json
{
  "kind": 32047,
  "created_at": 1682276455,
  "tags": [
    ["d", "<unique-identifier>"],
    ["birthdate", "1990-05-15"],
    ["biological_sex", "male"],
    ["activity_level", "very_active"],
    ["fitness_goal", "performance"],
    ["health_conditions", "none"],
    ["height_reference", "<event-id>", "<relay-url>"],
    ["weight_reference", "<event-id>", "<relay-url>"],
    ["vo2max_reference", "<event-id>", "<relay-url>"],
    ["hrmax_reference", "<event-id>", "<relay-url>"],
    ["measurement_preferences", "metric"],
    ["privacy_preferences", "public_metrics:steps,weight;private_metrics:hrv,glucose"],
    ["training_days", "mon,tue,thu,sat"],
    ["primary_sports", "running,cycling,strength"],
    ["experience_level", "intermediate"],
    ["training_history", "3", "years"],
    ["privacy_level", "friends"],
    ["unit_standard", "metric"],
    ["v", "1.0.0"],
    ["t", "health", "profile", "baseline", "user"]
  ],
  "content": "I'm primarily a runner focusing on 10K and half marathon distances, with some cross-training in cycling and strength work.",
  "pubkey": "<pubkey>",
  "id": "<id>",
  "sig": "<sig>"
}
```

**Required Tags**: `d`  
**Optional Tags**: Demographic information, references, preferences, training details, and standardization tags

**Client Implementation Notes**: Clients should use this profile to customize experiences, recommendations, and unit preferences. Privacy preferences should be respected across the platform.

### NIP-X48: Training Plan

```json
{
  "kind": 32048,
  "created_at": 1682276455,
  "tags": [
    ["d", "<unique-identifier>"],
    ["plan_name", "5K Training Plan"],
    ["plan_duration", "8", "weeks"],
    ["plan_goal", "time_goal"],
    ["goal_details", "sub-23:00"],
    ["target_date", "1690052400"],
    ["plan_type", "running"],
    ["plan_level", "intermediate"],
    ["sessions_per_week", "4", "workouts"],
    ["plan_source", "coach"],
    ["plan_creator", "<pubkey>", "<relay-url>"],
    ["current_week", "3", "week"],
    ["completion_percentage", "28", "percent"],
    ["current_fitness", "<event-id>", "<relay-url>"],
    ["privacy_level", "public"],
    ["v", "1.0.0"],
    ["t", "training", "plan", "program", "fitness"]
  ],
  "content": "8-week plan to improve 5K time from 25:00 to sub-23:00. Includes 2 quality sessions per week, 1 long run, and 1 recovery run. Strength training recommended twice weekly.",
  "pubkey": "<pubkey>",
  "id": "<id>",
  "sig": "<sig>"
}
```

**Required Tags**: `d`, `plan_name`, `plan_duration`, `plan_goal`  
**Optional Tags**: Goal details, dates, type, level, sessions, source, creator, progress, reference, and standardization tags

**Client Implementation Notes**: Clients should track plan progress and enable workout scheduling based on training plans.

## Privacy and Data Considerations

### Privacy Recommendations

- Implement client-side encryption for `private` metrics
- Allow users to select which metrics are public vs. private at a granular level
- Consider using private relays for sensitive health data
- Support data deletion and editing where appropriate
- Clearly communicate privacy implications of sharing health data

### Data Migration

To support users transitioning from other platforms:

1. Create import tools for common fitness platforms (Strava, Garmin, Fitbit, etc.)
2. Implement batch NIP event creation for historical data
3. Support standard file formats (TCX, FIT, GPX) for workout imports
4. Maintain original source references where appropriate

### Recommended Relays

Consider using specialized health data relays with:

- Strong security practices
- Clear data retention policies
- Higher bandwidth allowances for workout data
- Optional storage of encrypted private health data

## Implementation Levels Guide

| NIP Category | Basic Implementation | Standard Implementation | Advanced Implementation |
|--------------|----------------------|-------------------------|-------------------------|
| Core Health | Steps, Weight, Heart Rate | All core + Sleep, Water | All health metrics |
| Performance | Running Pace | Pace, Power, VO2max | All performance metrics |
| Body Metrics | Weight, Height | + Body Fat, Circumference | All body composition data |
| Integration | Independent events | Basic references | Full relationship graph |

## Conclusion

This ultra-modular approach to health and fitness data on Nostr creates unprecedented flexibility and user control. By standardizing individual metrics while enabling rich relationships between them, we can build a comprehensive yet privacy-respecting ecosystem for health data that respects Nostr's decentralized architecture.

We welcome community contributions to extend these specifications to additional health and fitness metrics as technology and user needs evolve.
