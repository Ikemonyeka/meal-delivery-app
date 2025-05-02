from fastapi import APIRouter, UploadFile, File, Form
from langgraph.langgraph_agent import chat_graph
import shutil
import os
import uuid
import json

router = APIRouter()

UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data'))

@router.post("/api/swiftbot/chat")
async def chat_endpoint(message: str = Form(...)):
    result = chat_graph.invoke({"input": message})  
    return {
        "intent": result.get("intent"),
        "order_status": result.get("order_response"),
        "bot_reply": result.get("chat_response"),
        "refund_status": result.get("refund_status")
    }

@router.post("/api/swiftbot/image")
async def image_endpoint(file: UploadFile = File(...), history: str = Form(...)):
    file_ext = os.path.splitext(file.filename)[-1]
    file_name = f"{uuid.uuid4().hex}_{file.filename.replace(' ', '_')}"
    save_path = os.path.join(UPLOAD_DIR, file_name)

    with open(save_path, "wb") as f:
        f.write(await file.read())

    history_data = json.loads(history)

    contextual_state = {
        "input": history_data[-1]["text"],  # last message from user
        "uploaded_image_path": save_path,
        "history": history_data,
        "intent": "refund_request"  # ✅ Force correct intent
    }

    # ✅ Call with a custom entry point for image uploads
    result = chat_graph.invoke(contextual_state)

    reply = result.get("refund_status") or result.get("chat_response") or " Sorry, I couldn't understand."
    return {"refund_status": reply, "updatedState": result}