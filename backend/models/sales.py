def insert_sale(db, data):
    sale = {
        "date": data.get("date"),
        "product_id": int(data.get("product_id")),
        "store_id": data.get("store_id"),
        "sales": int(data.get("sales", 0)),
        "on_promotion": data.get("on_promotion", False),
        "unit_price": float(data.get("unit_price", 0))
    }

    result = db.sales.insert_one(sale)
    sale["_id"] = str(result.inserted_id)   # ✅ FIX
    return sale

def get_all_sales(db):
    sales = list(db.sales.find())

    for s in sales:
        s["_id"] = str(s["_id"])   # ✅ FIX

    return sales