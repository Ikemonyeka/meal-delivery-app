import json
import os

# Get path relative to the current file's location
ORDERS_FILE = os.path.join(os.path.dirname(__file__), "../data/db.json")

def get_order_status(order_id: str) -> str | None:
    path = os.path.abspath(ORDERS_FILE)
    if not os.path.exists(path):
        print("🚫 orders.json not found at:", path)
        return None

    with open(path, "r") as f:
        data = json.load(f)

    orders = data[0]["orders"]
    for order in orders:
        if str(order["date_id"]) == order_id:
            return order["deliveryStatus"]
    return None

def update_order_status(order_id: str) -> str | None:
    path = os.path.abspath(ORDERS_FILE)
    if not os.path.exists(path):
        print("🚫 orders.json not found at:", path)
        return None

    with open(path, "r") as f:
        data = json.load(f)

    
    
    if "orders" in data[0]:
        for order in data[0]["orders"]:
            if str(order["date_id"]) == str(order_id):
                order["deliveryStatus"] = "Refunded"
                modified = True
                break
    
    with open(path, "w") as f:
        json.dump(data, f, indent=4)
    return "Updated"
