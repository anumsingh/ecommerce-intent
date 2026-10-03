"""
Microservice for Real-Time Machine Learning Purchase Intent Prediction
and Multi-Store E-Commerce Web Scraping (Amazon, Myntra, Ajio).
"""

import os
import sys
import uuid
import time
import concurrent.futures
from flask import Flask, request, jsonify
from flask_cors import CORS

# Setup directory paths
SERVICE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SERVICE_DIR)
SRC_DIR = os.path.join(SERVICE_DIR, "src")
SCRAPER_DIR = os.path.join(SERVICE_DIR, "scraper")

for p in [SERVICE_DIR, PROJECT_ROOT, SRC_DIR, SCRAPER_DIR]:
    if p not in sys.path:
        sys.path.insert(0, p)

from src.intent_service import SessionIntentTracker
from scraper.amazon import scrape_amazon
from scraper.myntra import scrape_myntra
from scraper.ajio import scrape_ajio

app = Flask(__name__)
CORS(app)

# In-memory session trackers for real-time inference
session_trackers = {}

def get_tracker(session_id: str) -> SessionIntentTracker:
    sid = session_id or "anon_default_session"
    if sid not in session_trackers:
        session_trackers[sid] = SessionIntentTracker(session_id=sid)
    return session_trackers[sid]

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "ML Intent Prediction & Scraping Microservice",
        "active_sessions": len(session_trackers)
    })

@app.route('/api/search', methods=['GET'])
def search_products():
    """
    Parallel scraper across Amazon, Myntra, and Ajio with Smart Ranking Engine
    and Real-Time Purchase Intent update.
    """
    query = request.args.get('query') or request.args.get('q')
    session_id = request.args.get('session_id') or request.headers.get('x-session-id') or "guest_session"
    
    if not query:
        return jsonify({"error": "No query provided", "status": "error"}), 400

    scrapers = {
        'amazon': scrape_amazon,
        'myntra': scrape_myntra,
        'ajio': scrape_ajio
    }

    results_map = {}

    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
        future_to_site = {executor.submit(scrapers[site], query): site for site in scrapers}
        for future in concurrent.futures.as_completed(future_to_site):
            site = future_to_site[future]
            try:
                data = future.result(timeout=45)
                results_map[site] = data if data else []
            except Exception as e:
                print(f"[ML Service] Scraper error for {site}: {e}")
                results_map[site] = []

    for site in scrapers.keys():
        if site not in results_map:
            results_map[site] = []

    # Flatten products for ranking
    all_flat = []
    for site, p_list in results_map.items():
        for p in p_list:
            if isinstance(p, dict):
                # Ensure platform is tagged
                p['platform'] = p.get('platform') or site
                all_flat.append(p)

    valid_p = [p for p in all_flat if isinstance(p.get('price'), (int, float)) and p.get('price', 0) > 0]

    lowest = None
    best_seller = None
    best_rated = None
    best_deal = None

    if valid_p:
        lowest = min(valid_p, key=lambda x: x["price"])
        best_seller = max(valid_p, key=lambda x: x.get('reviews', 0))
        best_rated = max(valid_p, key=lambda x: x.get('rating', 0))
        # 3-tier sort: Price asc, Rating desc, Reviews desc
        best_deal = sorted(valid_p, key=lambda x: (x["price"], -x.get('rating', 0), -x.get('reviews', 0)))[0]

    # Automatically reset intent tracker on new search query so telemetry starts fresh from 0%
    tracker = get_tracker(session_id)
    tracker.reset()
    tracker.record_event('search', item_identifier=query, metadata={"query": query})
    current_intent = tracker.get_prediction()

    return jsonify({
        "status": "success",
        "query": query,
        "session_id": session_id,
        "products": results_map,
        "lowest": lowest,
        "best_seller": best_seller,
        "best_rated": best_rated,
        "best_deal": best_deal,
        "intent": current_intent
    })

@app.route('/api/intent/track', methods=['POST'])
def track_intent():
    """
    Records fine-grained browsing telemetry (views, history clicks, price comparison, cart adds)
    and computes real-time purchase intent probability with LightGBM.
    """
    data = request.get_json(silent=True) or {}
    session_id = data.get('session_id') or request.headers.get('x-session-id') or "guest_session"
    event_type = data.get('event_type', 'view')
    item_id = data.get('item_id') or data.get('item_identifier') or data.get('title') or ''
    metadata = data.get('metadata') or {}

    tracker = get_tracker(session_id)
    prediction = tracker.record_event(event_type=event_type, item_identifier=item_id, metadata=metadata)
    
    return jsonify({
        "status": "success",
        "session_id": session_id,
        "intent": prediction
    })

@app.route('/api/intent/current', methods=['GET'])
def get_current_intent():
    session_id = request.args.get('session_id') or request.headers.get('x-session-id') or "guest_session"
    tracker = get_tracker(session_id)
    return jsonify({
        "status": "success",
        "session_id": session_id,
        "intent": tracker.get_prediction()
    })

@app.route('/api/intent/reset', methods=['POST'])
def reset_intent():
    data = request.get_json(silent=True) or {}
    session_id = data.get('session_id') or request.headers.get('x-session-id') or "guest_session"
    tracker = get_tracker(session_id)
    tracker.reset()
    return jsonify({
        "status": "success",
        "session_id": session_id,
        "intent": tracker.get_prediction()
    })

if __name__ == '__main__':
    port = int(os.environ.get('ML_PORT', 5001))
    print(f"Starting Python ML & Scraper Microservice on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=False)
