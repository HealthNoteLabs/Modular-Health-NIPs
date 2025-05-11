# NIP-101h User & Implementation Guide

**Version:** 1.0.0
**Status:** Draft

## 1. Introduction

Welcome to the NIP-101h User and Implementation Guide!

NIP-101h provides a standardized framework for sharing granular health and fitness metrics on the Nostr network. Its primary goal is to enable interoperability between different health-focused Nostr applications while empowering users with control over their sensitive data.

This guide is intended for developers looking to:
- Implement NIP-101h for publishing health data from their application.
- Read and interpret NIP-101h health data shared by users.
- Understand the core principles, best practices, and available resources for working with NIP-101h.

For the complete technical specification of the framework itself, please refer to the main [NIP-101h document](./NIP101h).

## 2. Core Concepts of NIP-101h

Before diving into implementation, it's important to understand the foundational elements of NIP-101h:

### 2.1. Event Kinds
NIP-101h reserves a range of Nostr event kinds for specific health metrics:
- **Primary Metrics:** Kind `1351` - `1399`
- **Paired/Secondary Metrics:** Kind `2351` - `2399` (e.g., for Calories Consumed, paired with Calories Expended)

Each specific metric (like Weight, Height, Step Count) is assigned a unique kind number within these ranges.

### 2.2. Common Event Structure
While each metric has its own detailed specification, NIP-101h events generally follow a common structure:
- **`content`**: Contains the primary value of the metric (e.g., "70" for weight, "10520" for step count). As per NIP-101h guidelines, this field **SHOULD be encrypted using NIP-44 by default**.
- **`tags`**:
    - **Required common tags:**
        - `["t", "health"]`: General categorization for health-related data.
        - `["t", <metric-specific-tag>]`: A tag specific to the metric (e.g., `["t", "weight"]`, `["t", "step_count"]`).
        - `["unit", <unit-of-measurement>]`: Specifies the unit for the value in the `content` field (e.g., `["unit", "kg"]`, `["unit", "steps"]`).
    - **Common optional tags:**
        - `["timestamp", <ISO8601-date>]`: Indicates when the metric was measured or recorded.
        - `["converted_value", <value>, <unit>]`: Provides the metric value in an alternative unit for interoperability.
        - `["source", <application-name or device-name>]`: The application or device that generated the data.
    - **Metric-specific tags:** Each NIP-101h.X specification will detail additional required or optional tags relevant to that particular metric (e.g., an `activity` tag for Activity Duration).

### 2.3. Privacy by Default: NIP-44 Encryption
Given the sensitivity of health data, NIP-101h strongly recommends (and client implementations **SHOULD** default to) encrypting the `content` field of all health metric events using **NIP-44**.
- Users must be given the option to publish unencrypted data, but this should be an explicit choice.
- When data is encrypted, the event MUST include the necessary NIP-44 tags (e.g., `["encryption_algo", "nip44"]`, `["p", <recipient_pubkey>]`, etc.) to allow authorized parties (including the user themselves on other clients) to decrypt the content.

## 3. Finding and Using Specific Health Metrics

The NIP-101h framework is designed to be extensible with numerous individual metric specifications.

- **The primary reference for all available metrics is the [NIP-101h Metric Directory](./NIP101h-Directory.md).**
- This directory lists each defined metric (e.g., "NIP-101h.1: Weight"), its assigned kind number, and a direct link to its detailed specification file (e.g., `./NIP101h.1.md`).

To use a specific metric:
1. Consult the [NIP-101h Metric Directory](./NIP101h-Directory.md).
2. Identify the metric you need and its kind number.
3. Navigate to the linked `.md` file for that metric (e.g., `NIP101h.1.md` for Weight).
4. This individual specification file will provide:
    - A detailed description of the metric.
    - The exact event `kind`.
    - The expected format for the `content` field.
    - All `required` and `optional` tags, including their meanings and example values.
    - JSON examples of valid events.
    - Implementation notes and privacy considerations specific to that metric.

## 4. Publishing NIP-101h Health Data

### 4.1. Constructing a NIP-101h Event
1. **Identify the Metric:** Choose the appropriate NIP-101h.X specification for the data you want to publish (e.g., `NIP101h.9` for Step Count).
2. **Determine the Kind:** Get the event `kind` from the specification (e.g., `1359` for Step Count).
3. **Prepare the Content:**
    - Format the metric value as a string for the `content` field.
    - **Encrypt the content using NIP-44 by default.** Ensure you have the recipient's public key (often the user's own public key for personal data storage). If publishing unencrypted (user has explicitly chosen this), the raw string value is used.
4. **Assemble Tags:**
    - Include all `required` tags as specified in the NIP-101h.X document (e.g., `["unit", "steps"]`, `["t", "health"]`, `["t", "step_count"]`, `["period", "daily"]` for daily steps).
    - Add any relevant `optional` tags (e.g., `["timestamp", ...]`, `["source", ...]`).
    - If encrypted, ensure all necessary NIP-44 specific tags are present.
5. **Create the Nostr Event:** Construct a standard Nostr event object with the `kind`, `content`, `tags`, `created_at` (current timestamp), and `pubkey` (user publishing the data). Sign the event to generate the `id` and `sig`.

**Example (Conceptual - Step Count, NIP-44 encrypted):**
```json
// Assuming 'encryptedStepCountPayload' is the NIP-44 encrypted string of "10520"
{
  "kind": 1359,
  "pubkey": "user_pubkey_hex",
  "created_at": 1678886400,
  "tags": [
    ["unit", "steps"],
    ["t", "health"],
    ["t", "step_count"],
    ["period", "daily"],
    ["timestamp", "2025-03-15T23:59:59Z"],
    ["source", "MyAwesomePedometerApp"],
    // NIP-44 specific tags would be here, e.g.:
    // ["p", "user_pubkey_hex"], // Recipient (self)
    // ["encryption_algo", "nip44"],
    // ... other NIP-44 conversation/encryption tags
  ],
  "content": "encryptedStepCountPayload", // NIP-44 encrypted data
  "id": "event_id_hex",
  "sig": "event_signature_hex"
}
```

### 4.2. Publishing to Relays
- Once the event is constructed and signed, publish it to the user's configured Nostr relays.
- Consider the sensitivity of health data when selecting relays if the data is published unencrypted. For NIP-44 encrypted data, the content is protected regardless of the relay, but metadata (tags) remains visible.

## 5. Reading and Querying NIP-101h Health Data

### 5.1. Subscribing to Metrics
- Clients can subscribe to specific NIP-101h kinds (e.g., `1351` for Weight, `1359` for Step Count) from relays.
- You can also subscribe to a range of kinds if your application handles multiple NIP-101h metrics.
- Use filters based on `pubkey` to fetch data for a specific user.

### 5.2. Parsing Events
1. **Identify the Kind:** Check the event `kind` to determine which NIP-101h.X specification applies.
2. **Decrypt Content (if NIP-44):**
    - Check for NIP-44 encryption tags.
    - If present, use the user's private key (and potentially the sender's public key, derived from NIP-44 tags) to decrypt the `content` field. User permission/authentication will be needed to access the private key.
3. **Parse Tags:** Extract information from the `tags` array according to the relevant NIP-101h.X specification. Pay attention to `unit`, `timestamp`, `source`, and other metric-specific tags.
4. **Interpret Value:** The (decrypted) `content` provides the core metric value. Use the `unit` tag to correctly interpret this value.

## 6. Data Export (e.g., for Blossom Servers)

NIP-101h supports data export to allow users to back up their health information or use it with other services, such as Blossom personal data servers.
- **JSON Export:** Events can be exported as an array of standard Nostr event objects. If content was NIP-44 encrypted, it should remain so in the export, preserving NIP-44 tags.
- **CSV Export:** A flattened structure is needed. This typically involves common columns (`id`, `kind`, `created_at`, `value`, `unit`, `encrypted`) and potentially metric-specific columns derived from tags.

For detailed guidelines and examples, refer to the "Data Export (e.g., for Blossom)" section in the main [NIP-101h document](./NIP101h).

## 7. Extending NIP-101h: Proposing New Metrics

The NIP-101h framework is designed to be extensible. If you identify a health or fitness metric not yet covered:
1.  Review the "Extensions" section in the main [NIP-101h document](./NIP101h).
2.  Propose a new NIP-101h.X specification. This involves:
    *   Assigning a new, unique kind number from the reserved ranges (1351-1399 or 2351-2399).
    *   Clearly defining the metric, content format, required tags, optional tags, and providing examples.
3.  It is recommended to discuss new metric proposals with the Nostr community (e.g., via GitHub discussions for NIPs or relevant Nostr development groups) to ensure clarity, avoid duplication, and foster consensus.

## 8. Best Practices for Implementers

- **Prioritize User Privacy:** Health data is highly sensitive.
    - Implement NIP-44 encryption by default.
    - Ensure users have clear and granular control over what data is shared, with whom, and whether it's encrypted.
    - Provide easy ways for users to manage or delete their published health data (where feasible on Nostr).
- **Obtain Explicit Consent:** Always obtain explicit user consent before publishing any health data.
- **Clear User Interface (UI) / User Experience (UX):**
    - Make it obvious to the user when their health data is being recorded or published.
    - Clearly explain the privacy implications of their choices (e.g., encrypted vs. unencrypted).
- **Data Minimization:** Only request or handle the health data that is strictly necessary for your application's functionality.
- **Error Handling & Validation:** Validate data against NIP-101h specifications when reading, and provide clear feedback for any issues.
- **Stay Updated:** Monitor the evolution of NIP-101h and related NIPs (like NIP-44) for any updates or best practice changes.

## 9. Further Information

- **Main NIP-101h Specification:** [NIP-101h](./NIP101h)
- **Directory of NIP-101h Metrics:** [NIP-101h Metric Directory](./NIP101h-Directory.md)

This guide aims to evolve with the NIP-101h standard. Feedback and contributions are welcome. 