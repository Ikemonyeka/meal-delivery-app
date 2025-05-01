import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordRequestForm
from services.auth_service import register_user, authenticate_user

router = APIRouter()

class RegisterInput(BaseModel):
    FirstName: str
    LastName: str
    password: str
    role: str
    email: str
    phone: str
    address: str

@router.post("/register")
def register(user: RegisterInput):
    return register_user(user.FirstName,user.LastName, user.password, user.role,user.email,user.address,user.phone)

@router.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    auth = authenticate_user(form_data.username, form_data.password)
    if "error" in auth:
        raise HTTPException(status_code=400, detail=auth["error"])
    return auth