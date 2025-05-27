import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport, StreamableHTTPServerTransportOptions } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import express, { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import dotenv from "dotenv";
import { z } from "zod";
import fs from "node:fs";
import path from "node:path";

// Zod Schemas (Moved to top)
const nip101hKindInfoSchema = z.object({
    kindNumber: z.number().describe("The NIP-101h kind number (e.g., 1351 for Weight)."),
});
const listNip101hKindsSchema = z.object({
    filterByCategory: z.string().optional().describe("Filter kinds by a specific category (e.g., 'anthropometrics').")
});
const prepareNip101hEventSchema = z.object({
    kindNumber: z.number().describe("The NIP-101h kind number."),
    contentValue: z.string().describe("The raw value for the event's content field."),
    tags: z.array(z.array(z.string())).optional().describe("Additional tags. Essential tags will be added."),
    targetUserPubkey: z.string().describe("The hex public key for NIP-44 encryption target."),
    timestamp: z.string().datetime().optional().default(new Date().toISOString()).describe("ISO 8601 timestamp."),
});
const fetchUserNip101hEventsInstructionSchema = z.object({
    userPubkey: z.string().describe("Hex public key of the user."),
    kinds: z.array(z.number()).optional().describe("Specific NIP-101h kinds."),
    since: z.number().optional().describe("Unix timestamp (seconds) for events after this time."),
    until: z.number().optional().describe("Unix timestamp (seconds) for events before this time."),
    limit: z.number().optional().default(100).describe("Max number of events."),
    relays: z.array(z.string()).optional().describe("Specific relays. Defaults to common public relays."),
});

// Helper function moved to top level
function getMetricNameSlug(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9_]+/g, '_').replace(/^_|_$/g, '');
}

// Function to parse NIP-101h markdown and load kind data
function loadNip101hData(): Record<string, any> {
    const nip101hFilePath = path.resolve(__dirname, "../../../NIP101h");
    let fileContent = "";
    try {
        fileContent = fs.readFileSync(nip101hFilePath, "utf-8");
    } catch (error) {
        console.error("Error reading NIP101h file:", error);
        return {
            "1351": { name: "Weight (fallback)", kind: 1351, unit: "kg", category: "Anthropometrics", description: "Default weight if NIP101h parse fails." , tags: ["t:health", "t:weight", "category:anthropometrics", "unit:kg"]},
        };
    }

    const kinds: Record<string, any> = {};
    const lines = fileContent.split(/\r?\n/);

    const categoryRanges: { name: string, start: number, end: number }[] = [
        { name: "Anthropometrics", start: 1351, end: 1369 },
        { name: "Activity & Fitness", start: 1370, end: 1389 },
        { name: "Nutrition & Diet", start: 1390, end: 1409 }, 
        { name: "Sleep", start: 1410, end: 1429 },
        { name: "Mental Health & Mindfulness", start: 1430, end: 1449 },
        { name: "Medical & Biometrics", start: 1450, end: 1469 },
        { name: "Lifestyle & Environment", start: 1470, end: 1489 },
        { name: "Paired/secondary metrics", start: 2351, end: 2399 }
    ];

    const initialListRegex = /^- NIP-101h\.(\d+)\s+(.+?)\s+using kind(?:s)?\s+(\d+)(?:\s*\(expended\)|\s*and\s*(\d+)\s*\(consumed\))?/i;
    const metricHeaderRegex = /^#{1,2}\s+NIP-101h\.(\d+):\s*(.+)$/i;
    const eventKindRegex = /(?:\*\*Event Kind:\*\*|Event Kind:)\s*(\d+)/i;
    const descriptionSectionStartRegex = /^## Description/i;
    const unitTagRegex = /-\s*\[\s*'unit'\s*,\s*'([^']+(?:\s+or\s+[^']+)?)'\s*\]/i;
    const listContinuationRegex = /^\s+-/i;
    const tagLineRegex = /-\s*\[\s*'([^']+)'\s*,\s*'([^']+)'\s*(?:,\s*'([^']+)'\s*)?\]/i;


    function assignCategory(kindNumStr: string): string {
        const kindNum = parseInt(kindNumStr);
        if (kindNum === 1357 || kindNum === 2357) return "Nutrition & Diet";
        const categoryObj = categoryRanges.find(cat => kindNum >= cat.start && kindNum <= cat.end);
        return categoryObj ? categoryObj.name : "Unknown";
    }
    
    function initializeKind(kindStr: string, name: string, nipNumStr: string) {
        if (!kinds[kindStr]) {
            const category = assignCategory(kindStr);
            const metricName = name.trim();
            kinds[kindStr] = {
                name: metricName,
                nipNumberStr: nipNumStr,
                kindNumberStr: kindStr,
                kind: parseInt(kindStr),
                category: category,
                description: "", 
                unit: "", 
                tags: [
                    "t:health",
                    `t:${getMetricNameSlug(metricName)}`,
                    `category:${category.toLowerCase().replace(/\s+/g, '_')}`
                ]
            };
        } else { 
            const correctCategory = assignCategory(kindStr);
            if (kinds[kindStr].category !== correctCategory) {
                kinds[kindStr].category = correctCategory;
                const catTagIndex = kinds[kindStr].tags.findIndex((t:string) => t.startsWith("category:"));
                if (catTagIndex !== -1) kinds[kindStr].tags[catTagIndex] = `category:${correctCategory.toLowerCase().replace(/\s+/g, '_')}`;
                else kinds[kindStr].tags.push(`category:${correctCategory.toLowerCase().replace(/\s+/g, '_')}`);
            }
        }
    }

    // First pass: Initialize all kinds from the initial list
    for (const line of lines) {
        const initialMatch = line.match(initialListRegex);
        if (initialMatch) {
            const nipNumber = initialMatch[1];
            let name = initialMatch[2].trim();
            const kind1 = initialMatch[3];
            const kind2 = initialMatch[4]; 

            if (name.toLowerCase().includes("caloric data")) {
                initializeKind(kind1, "Caloric Data (expended)", nipNumber);
                if (kind2) {
                    initializeKind(kind2, "Caloric Data (consumed)", nipNumber);
                }
            } else {
                initializeKind(kind1, name, nipNumber);
            }
        }
    }
    // Ensure caloric kinds are initialized if not in the top list
    if (!kinds["1357"]) initializeKind("1357", "Caloric Data (expended)", "7");
    if (!kinds["2357"]) initializeKind("2357", "Caloric Data (consumed)", "7");


    let currentNipSection: string | null = null; // Tracks NIP-101h.X
    let currentActiveKindStr: string | undefined = undefined;
    let inDescriptionBlock = false;
    let accumulatedDescriptionLines: string[] = [];

    // Second pass: Populate details (description, unit) by parsing sections
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        const headerMatch = line.match(metricHeaderRegex);
        if (headerMatch) {
            // Finalize description for previous kind/section if any
            if (currentActiveKindStr && kinds[currentActiveKindStr] && accumulatedDescriptionLines.length > 0 && inDescriptionBlock) {
                kinds[currentActiveKindStr].description = accumulatedDescriptionLines.join(" ").trim().replace(/\s+/g, ' ');
            }
            
            inDescriptionBlock = false;
            accumulatedDescriptionLines = [];
            currentNipSection = headerMatch[1]; // Store NIP section number
            const headerName = headerMatch[2].trim();
            currentActiveKindStr = undefined; // Reset active kind for new NIP section

            // Attempt to link header to an initialized kind via NIP number
            const foundKindObjForNip: any = Object.values(kinds).find(k => k.nipNumberStr === currentNipSection && !k.description); // Prefer unset ones
            if (foundKindObjForNip && typeof foundKindObjForNip.kindNumberStr === 'string') {
                 currentActiveKindStr = foundKindObjForNip.kindNumberStr;
                 // Update name from more specific header if it seems more appropriate and not a generic caloric one
                 if (currentActiveKindStr && kinds[currentActiveKindStr]) { // Ensure kind exists before access
                    const kindEntry = kinds[currentActiveKindStr];
                    if (kindEntry.name !== headerName && headerName.length > 0 && !headerName.toLowerCase().includes("caloric data")) {
                        kindEntry.name = headerName; 
                        const nameSlugTag = `t:${getMetricNameSlug(headerName)}`;
                        if (!Array.isArray(kindEntry.tags)) { // Ensure tags array exists
                            kindEntry.tags = [];
                        }
                        const tagIndex = kindEntry.tags.findIndex((t:string) => t.startsWith('t:') && t !== 't:health');
                        if (tagIndex !== -1) {
                            kindEntry.tags[tagIndex] = nameSlugTag;
                        } else {
                            kindEntry.tags.push(nameSlugTag); 
                        }
                    }
                 } else {
                    console.warn(`NIP101h Parser: Kind entry not found for currentActiveKindStr: ${currentActiveKindStr} when processing header for NIP section ${currentNipSection}`);
                 }
            }
            // Special case for NIP-101h.7 Caloric Data header
            if (currentNipSection === "7" && headerName.toLowerCase().includes("caloric data")) {
                // This section might apply to 1357 or 2357.
                // We'll let the Event Kind line or specific tags determine.
                // For now, don't set currentActiveKindStr, allowing description/unit to apply to the specific kind once identified.
            }
            continue;
        }

        const kindMatch = line.match(eventKindRegex);
        if (kindMatch) {
            // Finalize description for *previous* active kind if any, before switching
            if (currentActiveKindStr && kinds[currentActiveKindStr] && accumulatedDescriptionLines.length > 0 && inDescriptionBlock) {
                kinds[currentActiveKindStr].description = accumulatedDescriptionLines.join(" ").trim().replace(/\s+/g, ' ');
            }
            accumulatedDescriptionLines = []; // Reset for new kind context
            // inDescriptionBlock remains true if ## Description was hit prior to Event Kind line

            currentActiveKindStr = kindMatch[1];
            if (!kinds[currentActiveKindStr]) { // If this kind wasn't in the initial list
                const nameFromNipSection = currentNipSection ? `Kind ${currentActiveKindStr} from NIP-${currentNipSection}` : `Kind ${currentActiveKindStr}`;
                initializeKind(currentActiveKindStr, nameFromNipSection, currentNipSection || "unknown_nip");
            }
            
            // Ensure category is correct after kind is (re-)activated
            if (kinds[currentActiveKindStr]) {
                const correctCategory = assignCategory(currentActiveKindStr);
                if (kinds[currentActiveKindStr].category !== correctCategory) {
                    kinds[currentActiveKindStr].category = correctCategory;
                    const catTagIndex = kinds[currentActiveKindStr].tags.findIndex((t:string) => t.startsWith("category:"));
                    const catTag = `category:${correctCategory.toLowerCase().replace(/\s+/g, '_')}`;
                    if (catTagIndex !== -1) kinds[currentActiveKindStr].tags[catTagIndex] = catTag;
                    else kinds[currentActiveKindStr].tags.push(catTag);
                }
            }
            continue; 
        }
        
        if (line.match(descriptionSectionStartRegex)) {
            // Finalize description for previous context if description block was already active and we're hitting a new one.
             if (currentActiveKindStr && kinds[currentActiveKindStr] && accumulatedDescriptionLines.length > 0 && inDescriptionBlock) {
                kinds[currentActiveKindStr].description = accumulatedDescriptionLines.join(" ").trim().replace(/\s+/g, ' ');
            }
            inDescriptionBlock = true;
            accumulatedDescriptionLines = [];
            continue;
        }

        if (inDescriptionBlock) {
            // Stop accumulating if we hit a new major NIP section, a specific Event Kind line, or an empty line that doesn't seem to be part of a list.
            if (line.startsWith("## NIP-101h") || line.match(metricHeaderRegex) || line.match(eventKindRegex) || (line.trim() === "" && !lines[i+1]?.match(listContinuationRegex) && !lines[i+1]?.startsWith("-")) ) {
                if(currentActiveKindStr && kinds[currentActiveKindStr] && accumulatedDescriptionLines.length > 0) {
                    kinds[currentActiveKindStr].description = accumulatedDescriptionLines.join(" ").trim().replace(/\s+/g, ' ');
                }
                inDescriptionBlock = false; // Current description block ends
                accumulatedDescriptionLines = [];
                i--; // Re-process current line as it might be a new section start or other significant token
            } else if (line.trim() !== "" || (lines[i-1] && lines[i-1].match(listContinuationRegex)) ) { 
                accumulatedDescriptionLines.push(line.trim()); 
            }
            continue;
        }

        const unitMatch = line.match(unitTagRegex);
        if (unitMatch) {
            console.log(`[Unit Match] Line: "${line.trim()}", Captured: "${unitMatch[1]}", Active Kind: ${currentActiveKindStr}, NIP Section: ${currentNipSection}`);
            const unitValue = unitMatch[1].trim(); // Take the first unit for simplicity
            const firstUnit = unitValue.split(' or ')[0].trim().toLowerCase();
            const unitTagToAdd = `unit:${firstUnit}`;
            
            const kindToUpdateUnit = currentActiveKindStr ? kinds[currentActiveKindStr] : null;

            if (kindToUpdateUnit && !kindToUpdateUnit.unit) { // Only set if not already set
                kindToUpdateUnit.unit = unitValue;
                if (!kindToUpdateUnit.tags.includes(unitTagToAdd)) {
                    kindToUpdateUnit.tags.push(unitTagToAdd);
                }
                console.log(`[Unit Set] Kind ${currentActiveKindStr} unit set to: "${unitValue}"`);
            } else if (currentNipSection === "7") { // Special handling for NIP-101h.7 (Caloric)
                if (kinds["1357"] && !kinds["1357"].unit) {
                    kinds["1357"].unit = unitValue;
                    if(!kinds["1357"].tags.includes(unitTagToAdd)) kinds["1357"].tags.push(unitTagToAdd);
                }
                if (kinds["2357"] && !kinds["2357"].unit) {
                    kinds["2357"].unit = unitValue;
                    if(!kinds["2357"].tags.includes(unitTagToAdd)) kinds["2357"].tags.push(unitTagToAdd);
                }
            } else if (currentNipSection && !currentActiveKindStr) {
                // If we are in a NIP section but haven't identified a specific kind yet,
                // try to apply to the primary kind associated with that NIP section if its unit is empty.
                const primaryKindForNip: any = Object.values(kinds).find(k => k.nipNumberStr === currentNipSection && !k.unit);
                if (primaryKindForNip && typeof primaryKindForNip.kindNumberStr === 'string' && kinds[primaryKindForNip.kindNumberStr]) {
                    kinds[primaryKindForNip.kindNumberStr].unit = unitValue;
                     if(!kinds[primaryKindForNip.kindNumberStr].tags.includes(unitTagToAdd)) kinds[primaryKindForNip.kindNumberStr].tags.push(unitTagToAdd);
                }
            }
            continue;
        }
         // Attempt to parse other tags like ['format', 'YYYY-MM-DD']
        const otherTagMatch = line.match(tagLineRegex);
        if (otherTagMatch && currentActiveKindStr && kinds[currentActiveKindStr]) {
            const key = otherTagMatch[1];
            const value = otherTagMatch[2];
            const fullTag = `${key}:${value.toLowerCase().replace(/\s+/g, '_')}`;
            if (!kinds[currentActiveKindStr].tags.includes(fullTag) && key !== 'unit') { // Avoid duplicating unit logic
                kinds[currentActiveKindStr].tags.push(fullTag);
            }
        }
    }
    
    // Final cleanup for any pending description
    if (inDescriptionBlock && currentActiveKindStr && kinds[currentActiveKindStr] && accumulatedDescriptionLines.length > 0) {
        kinds[currentActiveKindStr].description = accumulatedDescriptionLines.join(" ").trim().replace(/\s+/g, ' ');
    }

    // Final fallback and category/tag check for all kinds, especially caloric
    Object.keys(kinds).forEach(kindKey => {
        const kindData = kinds[kindKey];
        if (kindKey === "1357" || kindKey === "2357") { // Caloric specific
            if (kindData.category !== "Nutrition & Diet") {
                kindData.category = "Nutrition & Diet";
                const catTagIndex = kindData.tags.findIndex((t:string) => t.startsWith("category:"));
                const correctCatTag = "category:nutrition_&_diet";
                if (catTagIndex !== -1) kindData.tags[catTagIndex] = correctCatTag;
                else kindData.tags.push(correctCatTag);
            }
            if (!kindData.description) {
                kindData.description = kindKey === "1357" ? "Stores caloric energy expended by the user, typically through activities." 
                                                              : "Stores caloric energy consumed by the user, typically through food intake.";
            }
            if (!kindData.unit) {
                kindData.unit = "calories";
                if (!kindData.tags.some((t:string) => t.startsWith("unit:"))) kindData.tags.push("unit:calories");
            }
        }
        // Generic fallbacks / ensure tags for all
        if (!kindData.description) {
            kindData.description = `Description for NIP-101h kind ${kindData.kind} (${kindData.name}). Refer to NIP-101h.${kindData.nipNumberStr}.`;
        }
        if (!kindData.unit && kindData.category === "Anthropometrics" && kindData.name === "Age") { // Common special case
             kindData.unit = "years";
             if (!kindData.tags.some((t:string) => t.startsWith("unit:"))) kindData.tags.push("unit:years");
        }
         if (!kindData.tags.some((t:string) => t.startsWith("unit:")) && kindData.unit) {
            kindData.tags.push(`unit:${kindData.unit.split(' or ')[0].trim().toLowerCase()}`);
        }
    });

    // Remove temporary descriptionLines if any persisted (should not be the case anymore)
    // Object.values(kinds).forEach(k => delete k.descriptionLines);

    // Log summary of missing units
    const missingUnits = Object.entries(kinds).filter(([_, kind]) => !kind.unit).map(([key, kind]) => `${key} (${kind.name})`);
    if (missingUnits.length > 0) {
        console.log(`[Parser Summary] Kinds missing units: ${missingUnits.join(', ')}`);
    }

    return kinds;
}

// Load NIP-101h data on server startup
const NIP101H_KINDS_DATA: Record<string, any> = loadNip101hData();
console.log("NIP-101h Kinds Loaded:", JSON.stringify(NIP101H_KINDS_DATA, null, 2));

dotenv.config();
const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());

const activeSessions: { 
    [sessionId: string]: { 
        transport: StreamableHTTPServerTransport,
        server: McpServer 
    }
} = {};

function createNip101hMcpServer() {
    const mcpServer = new McpServer({
        name: "NIP-101h Helper",
        version: "0.1.0",
    });

    mcpServer.tool(
        "getNip101hKindInfo",
        "Get detailed information about a specific NIP-101h kind.", 
        async (params: any) => { 
            const kindData = NIP101H_KINDS_DATA[String(params.kindNumber)];
            if (!kindData) {
                throw new Error(`NIP-101h kind ${params.kindNumber} not found.`);
            }
            return {
                content: [{
                    type: "resource",
                    resource: {
                        uri: "data:application/json," + encodeURIComponent(JSON.stringify(kindData)),
                        text: `Details for NIP-101h Kind ${params.kindNumber}`
                    }
                }]
            };
        }
    );

    mcpServer.tool(
        "listNip101hKinds",
        "List all available NIP-101h kinds and their basic information.",
        async (params: any) => { 
            let results = Object.values(NIP101H_KINDS_DATA);
            if (params.filterByCategory) {
                results = results.filter((kind: any) => kind.category === params.filterByCategory);
            }
            return {
                content: [{
                    type: "resource",
                    resource: {
                        uri: "data:application/json," + encodeURIComponent(JSON.stringify(results)),
                        text: "List of NIP-101h Kinds"
                    }
                }]
            };
        }
    );

    mcpServer.tool(
        "prepareNip101hEvent",
        "Prepare a NIP-101h event structure for client-side encryption and signing.",
        async (params: any) => { 
            const kindData = NIP101H_KINDS_DATA[String(params.kindNumber)];
            if (!kindData) {
                throw new Error(`NIP-101h kind ${params.kindNumber} not found.`);
            }
            const eventPayload = {
                message: "Event structure prepared. 'content' needs NIP-44 encryption. Sign with publisher key.",
                event_template: {
                    kind: params.kindNumber,
                    content: `PLACEHOLDER_FOR_ENCRYPTED_DATA_OF:${params.contentValue}_FOR_PUBKEY:${params.targetUserPubkey}`,
                    tags: [
                        ["t", "health"],
                        ["t", kindData.name ? getMetricNameSlug(kindData.name) : "unknown_metric"], 
                        ["category", kindData.category ? kindData.category.toLowerCase().replace(/\s+/g, '_') : "unknown_category"],
                        ["p", params.targetUserPubkey],
                        ["encryption_algo", "nip44"],
                        ["client_encryption_required", "true"], 
                        ...(params.tags || []),
                    ],
                    created_at: Math.floor(new Date(params.timestamp).getTime() / 1000),
                }
            };
            return { 
                content: [{
                    type: "resource",
                    resource: {
                        uri: "data:application/json," + encodeURIComponent(JSON.stringify(eventPayload)),
                        text: "NIP-101h Event Preparation Structure"
                    }
                }]
            };
        }
    );

    mcpServer.tool(
        "fetchUserNip101hEventsInstruction",
        "Provides instructions and a Nostr filter to fetch encrypted NIP-101h events.",
        async (params: any) => { 
            const instructionPayload = {
                message: "Use a Nostr client library with the filter and relays. Decrypt content client-side.",
                nostr_filter: {
                    authors: [params.userPubkey],
                    kinds: params.kinds || Object.keys(NIP101H_KINDS_DATA).map(Number),
                    ...(params.since && { since: params.since }),
                    ...(params.until && { until: params.until }),
                    ...(params.limit && { limit: params.limit }),
                },
                suggested_relays: params.relays || ["wss://relay.damus.io", "wss://relay.primal.net", "wss://nos.lol"],
                decryption_note: "NIP-101h content is NIP-44 encrypted. App handles decryption."
            };
            return {
                content: [{
                    type: "resource",
                    resource: {
                        uri: "data:application/json," + encodeURIComponent(JSON.stringify(instructionPayload)),
                        text: "Instructions for Fetching NIP-101h Events"
                    }
                }]
            };
        }
    );
    return mcpServer;
}

app.post('/mcp', async (req: Request, res: Response) => {
    const sessionIdHeader = req.headers['mcp-session-id'] as string | undefined;
    let transport: StreamableHTTPServerTransport;
    let server: McpServer;

    if (sessionIdHeader && activeSessions[sessionIdHeader]) {
        transport = activeSessions[sessionIdHeader].transport;
        server = activeSessions[sessionIdHeader].server;
    } else if (isInitializeRequest(req.body)) {
        server = createNip101hMcpServer();
        
        const transportOptions: StreamableHTTPServerTransportOptions = {
            sessionIdGenerator: randomUUID, 
            onsessioninitialized: (sessionIdFromTransport: string) => {
                activeSessions[sessionIdFromTransport] = { transport, server };
            }
        };
        transport = new StreamableHTTPServerTransport(transportOptions);

        transport.onclose = () => { 
            if (transport.sessionId) {
                delete activeSessions[transport.sessionId];
            }
        };

        await server.connect(transport); 
    } else {
        res.status(400).json({
            jsonrpc: '2.0',
            error: { code: -32000, message: 'Bad Request: No valid session ID provided for non-initialize request or missing initialize request.' },
            id: req.body?.id || null,
        });
        return;
    }
    await transport.handleRequest(req, res, req.body);
});

const handleSessionManagementEndpoints = async (req: Request, res: Response) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    if (!sessionId || !activeSessions[sessionId]) {
        res.status(400).send('Invalid or missing session ID');
        return;
    }
    const { transport } = activeSessions[sessionId];
    await transport.handleRequest(req, res); 
};

app.get('/mcp', handleSessionManagementEndpoints);
app.delete('/mcp', handleSessionManagementEndpoints);

app.listen(PORT, () => {
    console.log(`🚀 NIP-101h MCP Server (using @modelcontextprotocol/sdk) listening on port ${PORT}`);
    console.log(`🔗 Access it at http://localhost:${PORT}/mcp`);
});
