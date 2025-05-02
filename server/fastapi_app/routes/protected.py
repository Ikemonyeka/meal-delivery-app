from fastapi import APIRouter, Depends, HTTPException
from security.jwt_auth import decode_token, oauth2_scheme

router = APIRouter()

# Dependency to extract user
def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload

# Role-based access
def customer_only(user = Depends(get_current_user)):
    if user["role"] != "customer":
        raise HTTPException(status_code=403, detail="Only customers can access this route")
    return user

def admin_only(user = Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

def swifter_only(user = Depends(get_current_user)):
    if user["role"] != "swifter":
        raise HTTPException(status_code=403, detail="Swifter access required")
    return user