from flask import Blueprint, jsonify
from db import db
from models.analytics import get_top_products

analytics_bp = Blueprint("analytics", __name__)


# ➤ Top performing products
@analytics_bp.route("/top-products", methods=["GET"])
def top_products():
    data = get_top_products(db, limit=5)
    return jsonify(data), 200