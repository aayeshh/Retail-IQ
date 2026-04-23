from flask import Blueprint, request, jsonify
from ml.predictor import predict

forecast_bp = Blueprint('forecast', __name__)

@forecast_bp.route('/predict', methods=['POST'])
def get_prediction():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['store_nbr', 'family', 'onpromotion']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400

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
        return jsonify({
            "success": False, 
            "error": f"Internal server error: {str(e)}"
        }), 500