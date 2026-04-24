from flask import Blueprint, request, jsonify
from db import db
from models.products import insert_product, get_all_products

products_bp = Blueprint("products", __name__)


# ➤ Add product (MISSING BEFORE)
@products_bp.route("/add", methods=["POST"])
def add_product():
    data = request.json

    if not data.get("product_id") or not data.get("name"):
        return jsonify({"error": "product_id and name required"}), 400

    product = insert_product(db, data)
    return jsonify(product), 201


# ➤ Get all products
@products_bp.route("/all", methods=["GET"])
def all_products():
    data = get_all_products(db)
    return jsonify(data), 200