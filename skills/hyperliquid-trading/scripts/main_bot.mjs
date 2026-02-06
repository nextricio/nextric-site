#!/usr/bin/env node
/**
 * Nextric AI Trade Bot (Implementation)
 * Integrates Hyperliquid and Polymarket
 */

import { Hyperliquid } from 'hyperliquid';
import fetch from 'node-fetch';
import fs from 'fs';

// Configuration
const WALLET_ADDRESS = process.env.WALLET_ADDRESS || '0x0000000000000000000000000000000000000000';
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const LOG_FILE = 'trade-bot/test-run.log';

function log(message) {
    const timestamp = new Date().toISOString();
    const entry = `${timestamp} - INFO - ${message}`;
    console.log(entry);
    fs.appendFileSync(LOG_FILE, entry + '\n');
}

class TradeBot {
    constructor() {
        this.sdk = new Hyperliquid({
            privateKey: PRIVATE_KEY || undefined,
            testnet: false,
            enableWs: false,
        });
        log(`Bot initialized for address: ${WALLET_ADDRESS}`);
    }

    async getPolymarketPrices(query = 'crypto') {
        log(`Fetching Polymarket data for: ${query}`);
        try {
            const url = `https://gamma-api.polymarket.com/public-search?q=${encodeURIComponent(query)}&limit=5`;
            const res = await fetch(url);
            const data = await res.json();
            return (data.events || []).filter(e => e.active && !e.closed);
        } catch (e) {
            log(`Error fetching Polymarket data: ${e.message}`);
            return [];
        }
    }

    async runArbitrageCheck() {
        log('--- Starting Arbitrage Check ---');
        try {
            const hlPrices = await this.sdk.info.getAllMids();
            const polyEvents = await this.getPolymarketPrices('Bitcoin');

            for (const event of polyEvents) {
                for (const market of (event.markets || [])) {
                    const question = market.question || '';
                    const prices = JSON.parse(market.outcomePrices || '[]');
                    
                    if (prices.length > 0) {
                        const yesPrice = parseFloat(prices[0]);
                        log(`Evaluating Market: ${question} | 'Yes' Odds: ${(yesPrice * 100).toFixed(1)}%`);
                        
                        // Example Arbitrage Logic: 
                        // If BTC is > 100k on HL but "Will BTC reach 100k" is < 90% on Poly
                        if (question.includes('100,000') && parseFloat(hlPrices['BTC-PERP']) > 100000 && yesPrice < 0.9) {
                            log('!!! ARBITRAGE OPPORTUNITY DETECTED !!!');
                        }
                    }
                }
            }
        } catch (e) {
            log(`Arbitrage check error: ${e.message}`);
        }
    }

    async runNewsEventLogic() {
        log('--- Starting News-Event Check ---');
        try {
            const events = await this.getPolymarketPrices('Breaking');
            for (const event of events) {
                log(`Flash Event Detected: ${event.title} | Volume: $${(event.volumeNum || 0).toLocaleString()}`);
            }
        } catch (e) {
            log(`News-event error: ${e.message}`);
        }
    }

    async testConnectivity() {
        log('Testing Connectivity...');
        try {
            const mids = await this.sdk.info.getAllMids();
            log(`Hyperliquid connection successful. Markets: ${Object.keys(mids).length}`);
            
            const polyTest = await fetch('https://gamma-api.polymarket.com/tags?limit=1');
            if (polyTest.ok) log('Polymarket Gamma API connection successful.');
        } catch (e) {
            log(`Connectivity test error: ${e.message}`);
        }
    }
}

async function start() {
    const bot = new TradeBot();
    await bot.testConnectivity();
    await bot.runArbitrageCheck();
    await bot.runNewsEventLogic();
}

start().catch(err => {
    log(`Fatal Error: ${err.message}`);
});
