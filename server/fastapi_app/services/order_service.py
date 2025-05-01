import json
import os

# Get path relative to the current file's location
ORDERS_FILE = os.path.join(os.path.dirname(__file__), "../data/orders.json")

def get_order_status(order_id: str) -> str | None:
    path = os.path.abspath(ORDERS_FILE)
    if not os.path.exists(path):
        print("🚫 orders.json not found at:", path)
        return None

    with open(path, "r") as f:
        orders = json.load(f)

    for order in orders:
        if order["order_id"] == order_id:
            return order["status"]
    return None

def update_order_status(order_id: str) -> str | None:
    path = os.path.abspath(ORDERS_FILE)
    if not os.path.exists(path):
        print("🚫 orders.json not found at:", path)
        return None

    with open(path, "r") as f:
        orders = json.load(f)
    
    for order in orders:
        if order["order_id"] == order_id:
            order["status"] = "Refunded"
    
    with open(path, "w") as f:
        json.dump(orders, f, indent=4)