from flask import Blueprint, jsonify
from db import db
from models.dashboard import get_dashboard_data

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/overview", methods=["GET"])
def dashboard_overview():
    data = get_dashboard_data(db)
    return jsonify(data), 200