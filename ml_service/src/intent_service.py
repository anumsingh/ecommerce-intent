import os
import sys
import time
import zlib
import numpy as np

# Ensure src path is accessible
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

from src.predict_purchase_intent import predict_purchase_intent, THRESHOLD


def hash_to_item_id(val) -> int:
    """
    Generate a positive integer item ID from product title, URL, or identifier.
    Uses CRC32 to generate stable IDs mapped to positive integers.
    """
    if not val:
        return 100
    if isinstance(val, int):
        return abs(val) if val > 0 else 100
    if str(val).isdigit():
        return max(1, int(val) % 100000)
    crc = zlib.crc32(str(val).encode('utf-8')) & 0xffffffff
    # Map into a reasonable item range (1 - 500000)
    return (crc % 500000) + 1


class SessionIntentTracker:
    """
    Maintains session interaction state and computes real-time purchase intent.
    """
    def __init__(self, session_id=None):
        self.session_id = session_id or "anon_session"
        self.events = []
        self.start_time = time.time()

    def record_event(self, event_type: str, item_identifier: str = "", metadata: dict = None):
        """
        Record a browsing event: search, product_view, history_view, sort_change, buy_click.
        """
        now = time.time()
        item_id = hash_to_item_id(item_identifier) if item_identifier else (100 + len(self.events))
        
        event = {
            "timestamp": now,
            "event_type": event_type,
            "item_id": item_id,
            "item_name": (metadata or {}).get("title", ""),
            "price": (metadata or {}).get("price", 0),
            "platform": (metadata or {}).get("platform", ""),
            "metadata": metadata or {}
        }
        self.events.append(event)
        return self.get_prediction()

    def get_features_and_deltas(self):
        if not self.events:
            return [101], [0]

        item_ids = [e["item_id"] for e in self.events]
        timestamps = [e["timestamp"] for e in self.events]

        time_deltas = [0.0]
        for i in range(1, len(timestamps)):
            delta = max(0.0, timestamps[i] - timestamps[i - 1])
            # Cap extreme idle gaps at 300s
            time_deltas.append(min(delta, 300.0))

        return item_ids, time_deltas

    def get_prediction(self):
        """
        Calculates multi-dimensional real-time purchase intent probability
        broken down across 4 distinct behavioral aspects:
        1. Exploration Depth (Dwell time, unique products viewed)
        2. Price Comparison Breadth (Cross-platform checks, price trends)
        3. Action Commitment (Wishlists, alerts, buy clicks)
        4. Decision Focus (Cadence, category consistency)
        """
        if not self.events:
            return {
                "prediction": "No Purchase",
                "purchase_probability": 0.0,
                "score_pct": 0,
                "level": "Low",
                "level_label": "Casual Browsing",
                "interaction_count": 0,
                "session_duration_sec": 0,
                "platforms_compared": 0,
                "aspects": {
                    "exploration": 0,
                    "comparison": 0,
                    "commitment": 0,
                    "decision_focus": 0
                },
                "insights": ["Session initialized. Search and browse products to see real-time behavioral AI analysis."],
                "threshold": THRESHOLD
            }

        duration = round(time.time() - self.start_time, 1)
        event_types = [e.get("event_type") for e in self.events]
        unique_items = len(set(e.get("item_id") for e in self.events if e.get("item_id")))
        unique_platforms = len(set(e.get("platform") for e in self.events if e.get("platform")))
        
        # 1. Aspect: Exploration Depth (0 - 100)
        # Based on unique items viewed and session dwell time
        product_views = event_types.count("product_view") + event_types.count("recommendation_click")
        exploration_score = min(100, int((product_views * 12) + min(40, duration * 0.5) + (unique_items * 8)))

        # 2. Aspect: Price Comparison Breadth (0 - 100)
        # Based on cross-store checks and price history trend views
        history_views = event_types.count("history_view")
        comparison_score = 0
        if unique_platforms >= 3:
            comparison_score += 45
        elif unique_platforms == 2:
            comparison_score += 30
        elif unique_platforms == 1:
            comparison_score += 15
        
        comparison_score += min(55, history_views * 28)
        comparison_score = min(100, comparison_score)

        # 3. Aspect: Action Commitment (0 - 100)
        # Highest intent signals: wishlist additions, price drop alerts, buy clicks
        wishlist_adds = event_types.count("wishlist_add")
        alert_intents = event_types.count("alert_intent")
        buy_clicks = event_types.count("buy_click")

        commitment_score = (wishlist_adds * 30) + (alert_intents * 35) + (buy_clicks * 50)
        commitment_score = min(100, commitment_score)

        # 4. Aspect: Decision Focus & Velocity (0 - 100)
        # Evaluates deliberate browsing cadence vs random scrolling
        focus_score = 15
        if len(self.events) >= 2:
            # Check interaction density
            avg_gap = duration / len(self.events)
            if 3.0 <= avg_gap <= 30.0:  # Thoughtful, steady browsing
                focus_score += 45
            elif avg_gap < 3.0:  # Rapid scrolling
                focus_score += 20
            else:  # Idle
                focus_score += 10
        if unique_platforms >= 2 and history_views >= 1:
            focus_score += 35
        focus_score = min(100, focus_score)

        # Multi-Aspect Weighted Ensemble Score
        # Exploration: 20%, Comparison: 30%, Commitment: 35%, Focus: 15%
        weighted_score = (
            (exploration_score * 0.20) +
            (comparison_score * 0.30) +
            (commitment_score * 0.35) +
            (focus_score * 0.15)
        )

        # Model base inference integration
        item_ids, time_deltas = self.get_features_and_deltas()
        try:
            res = predict_purchase_intent(item_ids, time_deltas)
            model_prob = float(res.get("purchase_probability", 0.0))
        except Exception:
            model_prob = weighted_score / 100.0

        # Blend ML tree prediction (40%) with multi-aspect behavioral tracker (60%)
        final_prob = (model_prob * 0.40) + ((weighted_score / 100.0) * 0.60)

        # If only search was executed with no product touchpoints yet, keep at 0%
        if len(self.events) <= 1 and all(e.get("event_type") == "search" for e in self.events):
            final_prob = 0.0
            weighted_score = 0
            exploration_score = 0
            comparison_score = 0
            commitment_score = 0
            focus_score = 0

        final_prob = min(0.98, max(0.0, final_prob))
        score_pct = int(round(final_prob * 100))

        # Dynamic Intent Level Classification
        if score_pct >= 75:
            level = "High"
            level_label = "Ready to Buy"
        elif score_pct >= 45:
            level = "Moderate"
            level_label = "Active Comparison"
        elif score_pct >= 20:
            level = "Mild"
            level_label = "Product Exploration"
        else:
            level = "Low"
            level_label = "Casual Browsing"

        # Detailed Diagnostic Insights
        insights = []
        if commitment_score >= 40:
            insights.append("High Purchase Intent: Bottom-of-funnel actions detected (Wishlist/Alerts/Checkout).")
        elif comparison_score >= 50:
            insights.append("Comparison Shopping: User actively evaluating price differences & historical trends across stores.")
        elif exploration_score >= 40:
            insights.append(f"Deep Exploration: User researching multiple products ({unique_items} unique items inspected).")
        elif len(self.events) > 1:
            insights.append("Initial Discovery: Early stage browsing with moderate dwell time.")
        else:
            insights.append("Query Initiated: Awaiting user product engagement.")

        if history_views > 0:
            insights.append(f"Price Trend Checked: Analyzed fluctuation records for {history_views} item(s).")
        if unique_platforms > 1:
            insights.append(f"Cross-Store Benchmark: Comparing items across {unique_platforms} merchant platforms.")

        return {
            "prediction": "Purchase" if final_prob >= THRESHOLD else "No Purchase",
            "purchase_probability": round(final_prob, 4),
            "score_pct": score_pct,
            "level": level,
            "level_label": level_label,
            "interaction_count": len(self.events),
            "session_duration_sec": duration,
            "platforms_compared": unique_platforms,
            "aspects": {
                "exploration": int(exploration_score),
                "comparison": int(comparison_score),
                "commitment": int(commitment_score),
                "decision_focus": int(focus_score)
            },
            "insights": insights,
            "threshold": THRESHOLD
        }

    def reset(self):
        self.events = []
        self.start_time = time.time()
