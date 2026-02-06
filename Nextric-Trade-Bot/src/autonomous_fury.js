#!/usr/bin/env node
import 'dotenv/config';
import { createMcpClient } from './skills/autonomous-agent/src/lib/mcp/index.js';
import { buildAptosPaymentPayload } from './skills/autonomous-agent/src/lib/aptos/index.js';
import { getEvmPaymentPayload } from './skills/autonomous-agent/src/lib/evm/index.js';
import { createAgent } from './skills/autonomous-agent/src/agent/index.js';
import fs from 'fs';

async function updateFeed(action, details) {
    const feed = JSON.parse(fs.readFileSync('feed.json', 'utf8'));
    feed.last_update = new Date().toISOString();
    feed.files_written.push(`Nextric action: ${action}`);
    fs.writeFileSync('feed.json', JSON.stringify(feed, null, 2));
}

async function startLoop() {
    console.log("Starting Nextric-Trade-Bot Proactive Loop...");
    
    // Mock setup for MCP - in actual implementation, we'd point to real endpoints
    const mcpClient = createMcpClient({
        baseUrl: process.env.MCP_SERVER_URL || 'http://localhost:4023',
        facilitatorUrl: process.env.X402_FACILITATOR_URL,
        getAptosPaymentPayload: (req) => buildAptosPaymentPayload(req),
        getEvmPaymentPayload: (req) => getEvmPaymentPayload(req),
    });

    const { runAgent } = await createAgent({ mcpClient });

    while (true) {
        try {
            console.log("Nextric: Scanning market for opportunities...");
            // Proactive prompt
            const result = await runAgent("Identify top BTC and stock opportunities, check balances, and execute strategy if valid.");
            console.log("Nextric Loop Result:", result.messages[result.messages.length - 1].content);
            
            await updateFeed("Market Scan", "Executed proactive agent loop.");
            
            // Wait before next iteration
            await new Promise(resolve => setTimeout(resolve, 60000 * 15)); // 15 mins
        } catch (err) {
            console.error("Loop Error:", err);
            await new Promise(resolve => setTimeout(resolve, 60000));
        }
    }
}

startLoop();
