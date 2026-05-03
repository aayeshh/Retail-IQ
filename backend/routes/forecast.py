from flask import Blueprint, request, jsonify
from ml.predictor import predict

forecast_bp = Blueprint('forecast', __name__)

@forecast_bp.route('/predict', methods=['POST'])
def get_prediction():
    data = request.get_json(silent=True)

    if not data or not isinstance(data, dict):
        return jsonify({"success": False, "error": "Invalid or missing JSON payload."}), 400

    # Validate required fields
    required_fields = ['store_nbr', 'family', 'onpromotion']
    for field in required_fields:
        if field not in data:
            return jsonify({"success": False, "error": f"Missing required field: {field}"}), 400

    if not callable(predict):
        return jsonify({"success": False, "error": "Forecast prediction function is unavailable."}), 500

    try:
        # predict() now returns a dictionary with detailed information
        result = predict(data)
        return jsonify({
            "success": True,
            "prediction": result["predicted_sales"],
            "details": {
                "lgb_contribution": result["lgb_prediction"],
                "xgb_contribution": result["xgb_prediction"],
                "features_used": result["features_used"]
            }
        }), 200
        
    except ValueError as e:
        # Handle invalid family category
        return jsonify({
            "success": False, 
            "error": str(e),
            "valid_families": [
                "AUTOMOTIVE", "BABY CARE", "BEAUTY", "BEVERAGES", "BOOKS",
                "BREAD/BAKERY", "CELEBRATION", "CLEANING", "DAIRY", "DELI",
                "EGGS", "FROZEN FOODS", "GROCERY I", "GROCERY II", "HARDWARE",
                "HOME AND KITCHEN I", "HOME AND KITCHEN II", "HOME APPLIANCES",
                "HOME CARE", "LADIESWEAR", "LAWN AND GARDEN", "LINGERIE",
                "LIQUOR", "MAGAZINES", "MEATS", "PERSONAL CARE", "PET SUPPLIES",
                "PLAYERS AND ELECTRONICS", "POULTRY", "PREPARED FOODS",
                "PRODUCE", "SCHOOL AND OFFICE SUPPLIES", "SEAFOOD"
            ][:10]  # Show first 10 as example
        }), 400
        
    except Exception as e:
        import traceback
        return jsonify({
            "success": False,
            "error": f"Internal server error: {str(e)}",
            "traceback": traceback.format_exc()
        }), 500