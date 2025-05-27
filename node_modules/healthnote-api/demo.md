# NIP-101h MCP Server Demo

This guide shows how to use the NIP-101h MCP server to work with health data on Nostr.

## Starting the Server

```bash
cd packages/healthnote-api
npm install
npm run dev
```

The server will start on `http://localhost:4000/mcp`

## Example Usage

### 1. Initialize MCP Session

```bash
curl -X POST http://localhost:4000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "initialize",
    "params": {
      "protocolVersion": "1.0.0",
      "clientInfo": {
        "name": "demo-client",
        "version": "1.0.0"
      }
    },
    "id": 1
  }'
```

Save the `mcp-session-id` from the response headers.

### 2. List All Health Metrics

```bash
curl -X POST http://localhost:4000/mcp \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: YOUR_SESSION_ID" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "listNip101hKinds",
      "arguments": {}
    },
    "id": 2
  }'
```

### 3. Get Weight Metric Details

```bash
curl -X POST http://localhost:4000/mcp \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: YOUR_SESSION_ID" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "getNip101hKindInfo",
      "arguments": {
        "kindNumber": 1351
      }
    },
    "id": 3
  }'
```

### 4. Prepare a Weight Event

```bash
curl -X POST http://localhost:4000/mcp \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: YOUR_SESSION_ID" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "prepareNip101hEvent",
      "arguments": {
        "kindNumber": 1351,
        "contentValue": "75",
        "targetUserPubkey": "your_hex_pubkey_here",
        "timestamp": "2025-05-01T10:00:00Z"
      }
    },
    "id": 4
  }'
```

### 5. Get Instructions for Fetching Health Data

```bash
curl -X POST http://localhost:4000/mcp \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: YOUR_SESSION_ID" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "fetchUserNip101hEventsInstruction",
      "arguments": {
        "userPubkey": "user_hex_pubkey",
        "kinds": [1351, 1352, 1359],
        "limit": 50
      }
    },
    "id": 5
  }'
```

## JavaScript Example

```javascript
const axios = require('axios');

async function demoNip101hMcp() {
    const MCP_URL = 'http://localhost:4000/mcp';
    
    // Initialize session
    const initRes = await axios.post(MCP_URL, {
        jsonrpc: '2.0',
        method: 'initialize',
        params: {
            protocolVersion: '1.0.0',
            clientInfo: { name: 'my-app', version: '1.0.0' }
        },
        id: 1
    });
    
    const sessionId = initRes.headers['mcp-session-id'];
    
    // Get all health metrics
    const kindsRes = await axios.post(MCP_URL, {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
            name: 'listNip101hKinds',
            arguments: {}
        },
        id: 2
    }, {
        headers: { 'mcp-session-id': sessionId }
    });
    
    const kinds = JSON.parse(
        kindsRes.data.result.content[0].resource.uri.split(',')[1]
    );
    
    console.log(`Found ${kinds.length} health metrics:`);
    kinds.forEach(k => console.log(`- ${k.name} (${k.kind})`));
}

demoNip101hMcp().catch(console.error);
```

## Available Health Metrics

- **Weight** (1351) - Body weight in kg or lb
- **Height** (1352) - Height in cm or imperial
- **Age** (1353) - Age in years
- **Gender** (1354) - Gender information
- **Fitness Level** (1355) - General fitness assessment
- **Workout Intensity** (1356) - Exercise intensity metrics
- **Caloric Data (expended)** (1357) - Calories burned
- **Activity Duration** (1358) - Duration of activities
- **Step Count** (1359) - Daily step tracking
- **Elevation** (1360) - Elevation changes
- **Splits** (1361) - Running/activity splits
- **Pace** (1362) - Activity pace
- **Distance** (1363) - Distance covered
- **Speed** (1364) - Movement speed
- **Caloric Data (consumed)** (2357) - Calories consumed

## Integration Tips

1. **Always encrypt health data** - Use NIP-44 encryption for privacy
2. **Handle session management** - Store session IDs for multiple requests
3. **Validate event structure** - Use the prepared templates as a guide
4. **Choose appropriate relays** - Use health-focused relays when available
5. **Respect user privacy** - Only fetch/publish data with explicit consent

## Next Steps

- Check out the full [README](README.md) for detailed API documentation
- Review [NIP-101h](../../NIP101h) for the complete specification
- See the [User Guide](../../NIP101h-User-Guide.md) for end-user information 