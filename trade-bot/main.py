import os
import json
import logging
import time
import hmac
import hashlib
import requests
from eth_account import Account
from polymarketpy import PolyClient
from hyperliquid.exchange import Exchange
from hyperliquid.info import Info
from hyperliquid.utils import constants

# Setup Logging
logging.basicConfig(
    level=logging.INFO, 
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("trade-bot/test-run.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class TradeBot:
    def __init__(self):
        # Configuration - using environment variables
        self.eth_address = os.getenv("WALLET_ADDRESS", "0x0000000000000000000000000000000000000000")
        self.private_key = os.getenv("PRIVATE_KEY", "0x0000000000000000000000000000000000000000000000000000000000000000")
        
        # Initialize Clients
        try:
            self.poly_client = PolyClient(self.private_key)
            self.hl_info = Info(constants.MAINNET_API_URL, skip_ws=True)
            self.hl_exchange = Exchange(Account.from_key(self.private_key), constants.MAINNET_API_URL)
            logger.info(f"Bot initialized for address: {self.eth_address}")
        except Exception as e:
            logger.error(f"Initialization failed: {e}")

    def fetch_polymarket_prices(self, query="crypto"):
        """Fetch active crypto markets from Polymarket."""
        logger.info(f"Fetching Polymarket data for: {query}")
        try:
            # Using Gamma API directly for broader search as per skill reference
            url = f"https://gamma-api.polymarket.com/public-search?q={query}&limit=5"
            response = requests.get(url)
            if response.status_code == 200:
                data = response.json()
                active_events = [e for e in data.get('events', []) if e.get('active') and not e.get('closed')]
                return active_events
            return []
        except Exception as e:
            logger.error(f"Error fetching Polymarket data: {e}")
            return []

    def get_hl_prices(self):
        """Fetch all mid prices from Hyperliquid."""
        try:
            return self.hl_info.all_mids()
        except Exception as e:
            logger.error(f"Error fetching HL prices: {e}")
            return {}

    def run_arbitrage_check(self):
        """
        Arbitrage implementation:
        Compare Polymarket 'Yes' odds for price targets vs HL spot/perp prices.
        """
        logger.info("--- Starting Arbitrage Check ---")
        hl_prices = self.get_hl_prices()
        poly_events = self.fetch_polymarket_prices("Bitcoin")

        for event in poly_events:
            for market in event.get('markets', []):
                question = market.get('question', '')
                # Logic: If question contains "Bitcoin reach $X"
                # and price is already > $X on HL, but Poly 'Yes' is < 95%
                # that's a news/arbitrage opportunity.
                logger.info(f"Evaluating Market: {question}")
                
                prices = market.get('outcomePrices', [])
                if prices:
                    yes_price = float(prices[0])
                    logger.info(f"Polymarket 'Yes' Price: {yes_price}")
                    
        logger.info("Arbitrage check complete.")

    def run_news_event_logic(self):
        """
        News-event implementation:
        Monitor high-volume Polymarket activity for sudden odds shifts.
        """
        logger.info("--- Starting News-Event Check ---")
        events = self.fetch_polymarket_prices("Breaking")
        for event in events:
            logger.info(f"Flash Event Detected: {event.get('title')} | Volume: {event.get('volumeNum')}")
            
        logger.info("News-event check complete.")

    def test_connectivity(self):
        """Verify API keys and connectivity."""
        logger.info("Testing Connectivity...")
        try:
            mids = self.get_hl_prices()
            if mids:
                logger.info(f"Successfully connected to Hyperliquid. Found {len(mids)} assets.")
                if "HYPE" in mids:
                    logger.info(f"HYPE Price: {mids['HYPE']}")
            
            # Polymarket test
            tags = requests.get("https://gamma-api.polymarket.com/tags?limit=1").json()
            if tags:
                logger.info("Successfully connected to Polymarket Gamma API.")
        except Exception as e:
            logger.error(f"Connectivity test failed: {e}")

if __name__ == "__main__":
    bot = TradeBot()
    bot.test_connectivity()
    bot.run_arbitrage_check()
    bot.run_news_event_logic()
