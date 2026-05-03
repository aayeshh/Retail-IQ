import time
from models.analytics import get_top_products

_dashboard_cache = None
_dashboard_cache_at = 0


def get_dashboard_data(db, cache_ttl=30):
    global _dashboard_cache, _dashboard_cache_at

    if _dashboard_cache is not None and time.time() - _dashboard_cache_at < cache_ttl:
        return _dashboard_cache

    # 📊 TOTAL SALES
    total_sales = list(db.sales.aggregate([
        {"$group": {"_id": None, "total": {"$sum": "$sales"}}}
    ]))

    total_sales_value = total_sales[0]["total"] if total_sales else 0

    # 📦 TOTAL PRODUCTS
    total_products = db.products.count_documents({})
    if total_products == 0:
        # Fall back to distinct sold product IDs when the catalog collection is empty.
        total_products = len(db.sales.distinct("product_id"))

    # 💬 FEEDBACK STATS
    feedback_stats = list(db.feedback.aggregate([
        {
            "$group": {
                "_id": None,
                "avg_rating": {"$avg": "$rating"},
                "count": {"$sum": 1}
            }
        }
    ]))

    avg_rating = feedback_stats[0]["avg_rating"] if feedback_stats else 0
    total_feedback = feedback_stats[0]["count"] if feedback_stats else 0

    # 🏆 TOP PRODUCTS
    top_products = get_top_products(db, limit=5)

    # 📊 PROMOTION ANALYSIS
    promo = list(db.sales.aggregate([
        {
            "$group": {
                "_id": "$on_promotion",
                "total": {"$sum": "$sales"}
            }
        }
    ]))

    promo_data = {
        "with_promotion": 0,
        "without_promotion": 0
    }

    for p in promo:
        if p["_id"] is True:
            promo_data["with_promotion"] = p["total"]
        else:
            promo_data["without_promotion"] = p["total"]

    # 📢 ANNOUNCEMENTS
    announcements = list(db.announcements.find().sort("created_at", -1).limit(3))

    for a in announcements:
        a["_id"] = str(a["_id"])

    return {
        "total_sales": total_sales_value,
        "total_products": total_products,
        "total_feedback": total_feedback,
        "average_rating": round(avg_rating, 2),
        "top_products": top_products,
        "sales_by_promotion": promo_data,
        "latest_announcements": announcements
    }