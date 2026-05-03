import os
import sys
import time
import traceback
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

import config
from routes.forecast import forecast_bp
from routes.announcements import announcements_bp
from routes.feedback import feedback_bp
from routes.sales import sales_bp
from routes.products import products_bp
from routes.analytics import analytics_bp
from routes.dashboard import dashboard_bp
from routes.register import register_bp
from db import db
from models.analytics import get_top_products

app = Flask(__name__)
CORS(app)

_api_cache = {}


def get_cached_response(key, ttl=30):
    cached = _api_cache.get(key)
    if not cached:
        return None
    value, timestamp = cached
    if time.time() - timestamp > ttl:
        return None
    return value


def set_cached_response(key, value):
    _api_cache[key] = (value, time.time())


@app.errorhandler(Exception)
def handle_global_exception(error):
    traceback_text = traceback.format_exc()
    app.logger.error(traceback_text)
    return jsonify({
        "error": f"Internal server error: {str(error)}"
    }), 500

# # MongoDB connection
# client = MongoClient(config.MONGO_URI)
# db = client.get_database()

@app.route('/')
def home():
    return {"message": "RetailIQ backend running"}

@app.route('/test-db') #just checking connection
def test_db():
    collections = db.list_collection_names()
    return {"collections": collections}

@app.route('/create-test') #just for checking if retialiq comes in db
def create_test():
    db.test.insert_one({"name": "RetailIQ Test"})
    return {"message": "Inserted"}

@app.route("/api/top-products", methods=["GET"])
def top_products_compat():
    """Compatibility endpoint for frontend TopProducts page."""
    cache_key = "top_products"
    cached = get_cached_response(cache_key)
    if cached is not None:
        return jsonify(cached), 200

    items = get_top_products(db, limit=5)
    normalized = []
    for index, item in enumerate(items, start=1):
        normalized.append(
            {
                "product_name": item.get("name", f"Product {index}"),
                "total_sales": item.get("total_sales", 0),
                "rank": index,
            }
        )
    set_cached_response(cache_key, normalized)
    return jsonify(normalized), 200


@app.route("/api/sales-trend", methods=["GET"])
def sales_trend():
    interval = (request.args.get("interval") or "monthly").lower()
    cache_key = f"sales_trend_{interval}"
    cached = get_cached_response(cache_key)
    if cached is not None:
        return jsonify(cached), 200

    if interval == "weekly":
        try:
            docs = db.sales.find({}, {"date": 1, "sales": 1})
            weekly_sales = {}
            for doc in docs:
                date_str = doc.get("date")
                sales_value = doc.get("sales", 0) or 0
                if not date_str:
                    continue
                try:
                    date_obj = datetime.fromisoformat(date_str)
                except Exception:
                    continue
                iso_year, iso_week, _ = date_obj.isocalendar()
                period_key = f"{iso_year}-W{iso_week:02d}"
                weekly_sales[period_key] = weekly_sales.get(period_key, 0) + sales_value

            normalized = [
                {"period": period, "sales": weekly_sales[period]}
                for period in sorted(weekly_sales)
            ]
            set_cached_response(cache_key, normalized)
            return jsonify(normalized), 200
        except Exception:
            trend = []
    else:
        date_format = "%Y-%m" if interval == "monthly" else "%Y-%m-%d"

        pipeline = [
            {
                "$group": {
                    "_id": {
                        "$dateToString": {
                            "format": date_format,
                            "date": {"$dateFromString": {"dateString": "$date"}},
                        }
                    },
                    "sales": {"$sum": "$sales"},
                }
            },
            {"$sort": {"_id": 1}},
        ]

        try:
            trend = list(db.sales.aggregate(pipeline))
        except Exception:
            trend = []

        normalized = [{"period": row.get("_id", ""), "sales": row.get("sales", 0)} for row in trend]
        set_cached_response(cache_key, normalized)
        return jsonify(normalized), 200

    normalized = []
    set_cached_response(cache_key, normalized)
    return jsonify(normalized), 200


@app.route("/api/recommendations", methods=["GET"])
def recommendations():
    top = get_top_products(db, limit=3)
    if not top:
        return jsonify([]), 200

    recs = []
    best = top[0]
    recs.append(
        {
            "title": "Scale Top Performer",
            "message": f"Increase availability and promotion for {best.get('name', 'your top product')} to capture demand.",
        }
    )
    if len(top) > 1:
        recs.append(
            {
                "title": "Bundle Mid Performers",
                "message": f"Pair {top[1].get('name', 'mid-tier products')} with top sellers to increase basket size.",
            }
        )
    recs.append(
        {
            "title": "Inventory Focus",
            "message": "Prioritize replenishment for products with consistent sales and monitor low-performing SKUs weekly.",
        }
    )
    set_cached_response("recommendations", recs)
    return jsonify(recs), 200

app.register_blueprint(forecast_bp, url_prefix='/api/forecast')
app.register_blueprint(announcements_bp, url_prefix="/api/announcements")
app.register_blueprint(feedback_bp, url_prefix="/api/feedback") 

app.register_blueprint(sales_bp, url_prefix="/api/sales")
app.register_blueprint(products_bp, url_prefix="/api/products")
app.register_blueprint(analytics_bp, url_prefix="/api/analytics")
app.register_blueprint(register_bp, url_prefix="/api/register")

app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")

if __name__ == '__main__':
    app.run(debug=True)