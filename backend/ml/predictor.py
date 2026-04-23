import pickle
import os
import pandas as pd
from datetime import datetime

BASE_DIR = os.path.dirname(__file__)

# Load models
with open(os.path.join(BASE_DIR, "lgb_model.pkl"), "rb") as f:
    lgb_model = pickle.load(f)

with open(os.path.join(BASE_DIR, "xgb_model.pkl"), "rb") as f:
    xgb_model = pickle.load(f)

# Hardcoded family list (from your notebook)
FAMILIES = [
    "AUTOMOTIVE", "BABY CARE", "BEAUTY", "BEVERAGES", "BOOKS",
    "BREAD/BAKERY", "CELEBRATION", "CLEANING", "DAIRY", "DELI",
    "EGGS", "FROZEN FOODS", "GROCERY I", "GROCERY II", "HARDWARE",
    "HOME AND KITCHEN I", "HOME AND KITCHEN II", "HOME APPLIANCES",
    "HOME CARE", "LADIESWEAR", "LAWN AND GARDEN", "LINGERIE",
    "LIQUOR", "MAGAZINES", "MEATS", "PERSONAL CARE", "PET SUPPLIES",
    "PLAYERS AND ELECTRONICS", "POULTRY", "PREPARED FOODS",
    "PRODUCE", "SCHOOL AND OFFICE SUPPLIES", "SEAFOOD"
]

def predict(data):
    if data["family"] not in FAMILIES:
        raise ValueError(f"Invalid family category: {data['family']}. Valid families: {FAMILIES[:10]}...")
    
    family_encoded = FAMILIES.index(data["family"])
    
    if "date" in data and data["date"]:
        date_obj = pd.to_datetime(data["date"])
    else:
        date_obj = pd.Timestamp.now()
    
    features = [[
        int(data["store_nbr"]),
        family_encoded,
        int(data["onpromotion"]),
        date_obj.dayofweek,
        date_obj.month,
        date_obj.year
    ]]
    
    lgb_pred = lgb_model.predict(features)[0]
    xgb_pred = xgb_model.predict(features)[0]
    final_pred = 0.7 * lgb_pred + 0.3 * xgb_pred

    final_pred = final_pred + 100  # Add bias
    final_pred = max(0, final_pred)
    
    return {
        "predicted_sales": max(0, float(final_pred)),
        "lgb_prediction": float(lgb_pred),
        "xgb_prediction": float(xgb_pred),
        "features_used": {
            "store_nbr": int(data["store_nbr"]),
            "family": data["family"],
            "family_encoded": family_encoded,
            "onpromotion": int(data["onpromotion"]),
            "day_of_week": date_obj.dayofweek,
            "month": date_obj.month,
            "year": date_obj.year
        }
    }