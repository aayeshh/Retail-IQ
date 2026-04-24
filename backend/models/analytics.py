def get_top_products(db, limit=5):

    pipeline = [
        {
            "$group": {
                "_id": "$product_id",
                "total_sales": {"$sum": "$sales"}
            }
        },
        {
            "$lookup": {
                "from": "products",
                "localField": "_id",
                "foreignField": "product_id",
                "as": "product_info"
            }
        },
        {
            "$unwind": "$product_info"
        },
        {
            "$project": {
                "_id": 0,
                "product_id": "$_id",
                "name": "$product_info.name",
                "family": "$product_info.family",
                "total_sales": 1
            }
        },
        {
            "$sort": {"total_sales": -1}
        },
        {
            "$limit": limit
        }
    ]

    result = list(db.sales.aggregate(pipeline))
    return result