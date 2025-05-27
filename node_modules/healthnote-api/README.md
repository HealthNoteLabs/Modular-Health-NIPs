# NIP-101h MCP Server

A Model Context Protocol (MCP) server that provides tools for working with NIP-101h health data on Nostr.

## Overview

This MCP server helps developers integrate NIP-101h (Nostr Implementation Possibility for health data) into their applications. It provides tools for:
- Discovering available NIP-101h health metric kinds
- Getting detailed information about specific health metrics
- Preparing NIP-101h events for publishing
- Generating instructions for fetching user health data from Nostr

## Installation

```bash
npm install
```

## Usage

### Starting the Server

```bash
npm start
# or for development
npm run dev
```

The server will start on port 4000 by default.

### Available MCP Tools

#### 1. `getNip101hKindInfo`
Get detailed information about a specific NIP-101h kind.

**Parameters:**
- `kindNumber` (number): The NIP-101h kind number (e.g., 1351 for Weight)

**Example Response:**
```json
{
  "name": "Weight",
  "kind": 1351,
  "category": "Anthropometrics",
  "description": "This NIP defines the format for storing and sharing weight data on Nostr.",
  "unit": "kg or lb",
  "tags": ["t:health", "t:weight", "category:anthropometrics", "unit:kg"]
}
```

#### 2. `listNip101hKinds`
List all available NIP-101h kinds with optional category filtering.

**Parameters:**
- `filterByCategory` (string, optional): Filter kinds by category (e.g., "Anthropometrics", "Nutrition & Diet")

**Example Response:**
```json
[
  {
    "name": "Weight",
    "kind": 1351,
    "category": "Anthropometrics",
    "unit": "kg or lb"
  },
  {
    "name": "Height",
    "kind": 1352,
    "category": "Anthropometrics",
    "unit": "cm or imperial"
  }
]
```

#### 3. `prepareNip101hEvent`
Prepare a NIP-101h event structure for client-side encryption and signing.

**Parameters:**
- `kindNumber` (number): The NIP-101h kind number
- `contentValue` (string): The raw value for the event's content field
- `tags` (array, optional): Additional tags to include
- `targetUserPubkey` (string): The hex public key for NIP-44 encryption target
- `timestamp` (string, optional): ISO 8601 timestamp (defaults to current time)

**Example Response:**
```json
{
  "message": "Event structure prepared. 'content' needs NIP-44 encryption. Sign with publisher key.",
  "event_template": {
    "kind": 1351,
    "content": "PLACEHOLDER_FOR_ENCRYPTED_DATA_OF:70_FOR_PUBKEY:...",
    "tags": [
      ["t", "health"],
      ["t", "weight"],
      ["category", "anthropometrics"],
      ["p", "target_pubkey"],
      ["encryption_algo", "nip44"],
      ["client_encryption_required", "true"],
      ["unit", "kg"]
    ],
    "created_at": 1704067200
  }
}
```

#### 4. `fetchUserNip101hEventsInstruction`
Provides instructions and a Nostr filter to fetch encrypted NIP-101h events.

**Parameters:**
- `userPubkey` (string): Hex public key of the user
- `kinds` (array, optional): Specific NIP-101h kinds to fetch
- `since` (number, optional): Unix timestamp for events after this time
- `until` (number, optional): Unix timestamp for events before this time
- `limit` (number, optional): Maximum number of events (default: 100)
- `relays` (array, optional): Specific relays to query

**Example Response:**
```json
{
  "message": "Use a Nostr client library with the filter and relays. Decrypt content client-side.",
  "nostr_filter": {
    "authors": ["user_pubkey_hex"],
    "kinds": [1351, 1352, 1353],
    "since": 1704000000,
    "limit": 100
  },
  "suggested_relays": ["wss://relay.damus.io", "wss://relay.primal.net", "wss://nos.lol"],
  "decryption_note": "NIP-101h content is NIP-44 encrypted. App handles decryption."
}
```

## Available NIP-101h Kinds

| Kind | Metric | Category |
|------|--------|----------|
| 1351 | Weight | Anthropometrics |
| 1352 | Height | Anthropometrics |
| 1353 | Age | Anthropometrics |
| 1354 | Gender | Anthropometrics |
| 1355 | Fitness Level | Anthropometrics |
| 1356 | Workout Intensity | Anthropometrics |
| 1357 | Caloric Data (expended) | Nutrition & Diet |
| 1358 | Activity Duration | Anthropometrics |
| 1359 | Step Count | Anthropometrics |
| 1360 | Elevation | Anthropometrics |
| 1361 | Splits | Anthropometrics |
| 1362 | Pace | Anthropometrics |
| 1363 | Distance | Anthropometrics |
| 1364 | Speed | Anthropometrics |
| 2357 | Caloric Data (consumed) | Nutrition & Diet |

## Integration with MCP Clients

This server implements the Model Context Protocol and can be used with any MCP-compatible client. Configure your client to connect to `http://localhost:4000/mcp`.

## Environment Variables

- `PORT`: Server port (default: 4000)

## Development

```bash
# Install dependencies
npm install

# Run in development mode with auto-reload
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Privacy Considerations

This MCP server helps prepare NIP-101h events but does NOT handle:
- Private key management
- NIP-44 encryption/decryption (this is done client-side)
- Direct publishing to Nostr relays

All sensitive operations must be handled by the client application.

## License

See LICENSE file in the root directory. 