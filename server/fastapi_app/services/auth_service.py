import json
import os
import uuid
from security.jwt_auth import get_password_hash, verify_password, create_access_token


DATA_PATH = "fastapi_app/data/users.json"

def load_users():
    if not os.path.exists(DATA_PATH):
        return []
    with open(DATA_PATH, "r") as f:
        return json.load(f)

def save_users(users):
    with open(DATA_PATH, "w") as f:
        json.dump(users, f, indent=4)

def register_user(FirstName,LastName, password, role, email, address, phone):
    users = load_users()
    if any(u['email'] == email for u in users):
        return {"error": "Email already exists"}
    user = {
        "user_id": str(uuid.uuid4()),
        "FirstName": FirstName,
        "LastName": LastName,
        "password": get_password_hash(password),
        "role": role,
        "email": email,
        "address": address,
        "phone": phone
    }
    users.append(user)
    save_users(users)
    return {"message": "User registered successfully","user_id": user["user_id"]}

def authenticate_user(email, password):
    users = load_users()
    user = next((u for u in users if u['email'] == email), None)
    if user and verify_password(password, user['password']):
        token = create_access_token(data={
            "sub": user["email"],
            "user_id": user["user_id"],
            "role": user["role"]
        })
        return {"access_token": token, "token_type": "bearer"}
    return {"error": "Invalid username or password"}