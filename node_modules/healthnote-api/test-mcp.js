const axios = require('axios');

const MCP_URL = 'http://localhost:4000/mcp';

async function testMcpServer() {
    console.log('Testing NIP-101h MCP Server...\n');

    try {
        // Test 1: Initialize session
        console.log('1. Initializing MCP session...');
        const initResponse = await axios.post(MCP_URL, {
            jsonrpc: '2.0',
            method: 'initialize',
            params: {
                protocolVersion: '1.0.0',
                clientInfo: {
                    name: 'test-client',
                    version: '1.0.0'
                }
            },
            id: 1
        });
        
        const sessionId = initResponse.headers['mcp-session-id'];
        console.log(`Session initialized. ID: ${sessionId}\n`);

        // Test 2: List all NIP-101h kinds
        console.log('2. Testing listNip101hKinds...');
        const listResponse = await axios.post(MCP_URL, {
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
        
        console.log(`Found ${JSON.parse(listResponse.data.result.content[0].resource.uri.split(',')[1]).length} NIP-101h kinds\n`);

        // Test 3: Get specific kind info (Weight - 1351)
        console.log('3. Testing getNip101hKindInfo for Weight (1351)...');
        const kindInfoResponse = await axios.post(MCP_URL, {
            jsonrpc: '2.0',
            method: 'tools/call',
            params: {
                name: 'getNip101hKindInfo',
                arguments: { kindNumber: 1351 }
            },
            id: 3
        }, {
            headers: { 'mcp-session-id': sessionId }
        });
        
        const weightInfo = JSON.parse(kindInfoResponse.data.result.content[0].resource.uri.split(',')[1]);
        console.log('Weight info:', JSON.stringify(weightInfo, null, 2));
        console.log();

        // Test 4: Prepare a NIP-101h event
        console.log('4. Testing prepareNip101hEvent...');
        const prepareResponse = await axios.post(MCP_URL, {
            jsonrpc: '2.0',
            method: 'tools/call',
            params: {
                name: 'prepareNip101hEvent',
                arguments: {
                    kindNumber: 1351,
                    contentValue: '75',
                    targetUserPubkey: 'test_pubkey_hex'
                }
            },
            id: 4
        }, {
            headers: { 'mcp-session-id': sessionId }
        });
        
        const eventPrep = JSON.parse(prepareResponse.data.result.content[0].resource.uri.split(',')[1]);
        console.log('Event template created:', JSON.stringify(eventPrep.event_template, null, 2));
        console.log();

        // Test 5: Get fetch instructions
        console.log('5. Testing fetchUserNip101hEventsInstruction...');
        const fetchInstructionResponse = await axios.post(MCP_URL, {
            jsonrpc: '2.0',
            method: 'tools/call',
            params: {
                name: 'fetchUserNip101hEventsInstruction',
                arguments: {
                    userPubkey: 'test_user_pubkey',
                    kinds: [1351, 1352, 1359],
                    limit: 50
                }
            },
            id: 5
        }, {
            headers: { 'mcp-session-id': sessionId }
        });
        
        const fetchInstructions = JSON.parse(fetchInstructionResponse.data.result.content[0].resource.uri.split(',')[1]);
        console.log('Fetch instructions:', JSON.stringify(fetchInstructions, null, 2));

        console.log('\n✅ All tests passed!');

    } catch (error) {
        console.error('❌ Test failed:', error.response ? error.response.data : error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('Make sure the MCP server is running on port 4000');
        }
        process.exit(1);
    }
}

// Run tests
testMcpServer(); 