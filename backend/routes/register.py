from flask import Blueprint, request, jsonify
from db import db
from models.register import create_user, login_user

register_bp = Blueprint("register", __name__)


@register_bp.route("/create", methods=["POST"])
def register_create():
    data = request.get_json(silent=True) or {}

    full_name = data.get("full_name", "")
    phone = data.get("phone", "")
    email = data.get("email", "")
    password = data.get("password", "")
    account_type = data.get("account_type", "individual")

    if not full_name or not phone or not email or not password:
        return jsonify({"error": "Full Name, Phone, Email and Password are required."}), 400

    user, error = create_user(db, full_name, phone, email, password, account_type=account_type)
    if error:
        return jsonify({"error": error}), 400

    return jsonify({"message": "Registration saved to MongoDB successfully.", "user": user}), 201


@register_bp.route("/login", methods=["POST"])
def register_login():
    data = request.get_json(silent=True) or {}

    email = data.get("email", "")
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    user = login_user(db, email, password)
    if not user:
        return jsonify({"error": "Invalid email or password."}), 401

    return jsonify({"message": "Login successful", "user": user}), 200
