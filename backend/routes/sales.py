from flask import Blueprint, request, jsonify
from db import db
from models.sales import insert_sale, get_all_sales

sales_bp = Blueprint("sales", __name__)


# ➤ Insert sales data
@sales_bp.route("/add", methods=["POST"])
def add_sale():
    data = request.json

    if not data.get("product_id") or not data.get("sales"):
        return jsonify({"error": "product_id and sales required"}), 400

    sale = insert_sale(db, data)
    return jsonify(sale), 201


# ➤ Get all sales (for debugging / testing)
@sales_bp.route("/all", methods=["GET"])
def all_sales():
    data = get_all_sales(db)
    return jsonify(data), 200