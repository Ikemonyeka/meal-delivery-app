import json
import os
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

def register_user(username, password, role):
    users = load_users()
    if any(u['username'] == username for u in users):
        return {"error": "User already exists"}
    hashed_pw = get_password_hash(password)
    users.append({"username": username, "password": hashed_pw, "role": role})
    save_users(users)
    return {"message": "User registered successfully"}

def authenticate_user(username, password):
    users = load_users()
    user = next((u for u in users if u['username'] == username), None)
    if user and verify_password(password, user['password']):
        token = create_access_token(data={"sub": user["username"], "role": user["role"]})
        return {"access_token": token, "token_type": "bearer"}
    return {"error": "Invalid username or password"}