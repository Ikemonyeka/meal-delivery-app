from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_app.routes.auth import router as auth_router
from fastapi_app.routes.swiftbot import router as swiftbot_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to React URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth")
app.include_router(swiftbot_router)

@app.get("/")
def root():
    return {"message": "SwiftBite backend is live!"}
