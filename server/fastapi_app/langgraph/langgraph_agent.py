# fastapi_app/langgraph/langgraph_agent.py
import json
import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, END
from langchain_core.runnables import Runnable
from openai import OpenAI
from typing import Optional
from services.order_service import get_order_status, update_order_status
import re
import base64

# Load environment variables
load_dotenv()
client = OpenAI()
llm = ChatOpenAI(model="gpt-4o", temperature=0.2)

# Shared state for LangGraph


def generate_reply(state: dict, user_input: str) -> str:
    history = state.get("history", [])
    messages = [{"role": "system", "content": (
        "You are SwiftBot, a helpful and empathetic customer support assistant for SwiftBite. "
        "Always respond in friendly, Markdown-formatted messages with clear suggestions and emoji where appropriate."
    )}]

    for msg in history:
        role = msg.get("role") or ("user" if msg.get("sender") == "user" else "assistant")
        content = msg.get("content") or msg.get("text")
        if role and content:
            messages.append({"role": role, "content": content})

    messages.append({"role": "user", "content": user_input})

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        max_tokens=300
    )
    return response.choices[0].message.content.strip()


class ChatAgent(Runnable):
    def invoke(self, state: dict, config: Optional[dict] = None) -> dict:
        print("Received state type:", type(state))

        user_input = state.get("input")
        history = state.get("history", [])

        # Add current input to history
        if user_input:
            history.append({"role": "user", "content": user_input})
        state["history"] = history

        # Create classification prompt
        system_prompt = (
            "You are SwiftBot, an AI customer support assistant for SwiftBite. "
            "Classify the user's intent as one of ONLY these 5 values:\n"
            "- order_status\n"
            "- refund_request\n"
            "- payment_issue\n"
            "- chat_general\n"
            "- unknown\n\n"
            "Reply in this exact JSON format:\n"
            '{ "intent": "<intent_here>" }\n\n'
            f"User message: {user_input}"
        )

        print("\n--- Final Prompt Sent to LLM ---\n", system_prompt)
        response = llm.invoke([
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_input}
        ])
        print("LLM raw output:\n", response.content)

        try:
            parsed = json.loads(response.content)
            intent = parsed.get("intent", "unknown").strip().lower()
        except Exception:
            intent = "unknown"

        # 👇 Backup check if intent is unknown but history includes refund context
        if intent == "unknown":
            user_input_lower = user_input.lower()
            if any(keyword in user_input_lower for keyword in ["refund", "damaged", "order"]):
                intent = "refund_request"
            elif any(keyword in user_input_lower for keyword in ["image", "photo", "picture", "upload"]):
                # 👁 Likely an image caption during refund
                intent = "refund_request"
            elif any(keyword in user_input_lower for keyword in ["hi", "hello", "who", "help"]):
                intent = "chat_general"

        state["intent"] = intent
        print("Intent ------", intent)
        print("Returning state from ChatAgent:", state)
        return state


class OrderAgent(Runnable):
    def invoke(self, state: dict, config: Optional[dict] = None) -> dict:
        user_input = state.get("input", "")
        order_id = self.extract_order_id(user_input)
        print("user Input ----- ", user_input)
        print("Order ID --------- ",order_id)

        if not order_id:
            state["order_response"] = "Could you please provide a valid order ID?"
            return state

        status = get_order_status(order_id)
        if status:
            raw_response = f"Your order {order_id} is currently: {status}."
        else:
            raw_response = f"No order found with ID {order_id}."

        state["order_response"] = generate_reply(state, raw_response)

        return state

    def extract_order_id(self, message: str) -> str | None:
        match = re.search(r"\b\d{13}\b", message)
        print("Match ------ ",match)
        return match.group(0) if match else None
    
class GreetingAgent(Runnable):
    def invoke(self, state: dict, config: Optional[dict] = None) -> dict:
        user_input = state.get("input", "")
        prompt = f"The user said: '{user_input}'. Please greet them as SwiftBot and explain what you can help with."
        state["chat_response"] = generate_reply(state, prompt)

        return state

class ImageAnalyzerAgent(Runnable):
    def invoke(self, state: dict, config: Optional[dict] = None) -> dict:
        uploaded_path = state.get("uploaded_image_path")
        image_path = os.path.abspath(uploaded_path) if uploaded_path else None
        print("image path ------- ",image_path)
        if not image_path or not os.path.exists(image_path):
            state["image_analysis"] = "No image was uploaded."
            state["refund_decision"] = "skip"
            return state

        with open(image_path, "rb") as f:
            encoded_image = base64.b64encode(f.read()).decode("utf-8")

        print(f"Analyzing image at: {image_path}")

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are SwiftBot a customer support agent analyzing a customer's food image. "
                        "If the food appears damaged, eaten or the portion is smaller than expected then approve the refund and provide a reason for approval . "
                        "If the food looks okay, then dont approve refund and provide proper reason for it."
                    )
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:image/png;base64,{encoded_image}"}
                        }
                    ]
                }
            ],
            max_tokens=200
        )

        decision = response.choices[0].message.content.strip()
        state["refund_status"] = decision
        return state

class RefundRouterAgent(Runnable):
    def invoke(self, state: dict, config: Optional[dict] = None) -> str:
        decision = state.get("refund_status", "").lower()
        print(f"[RefundRouter] Decision from vision: {decision}")
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are SwiftBot a customer support agent analyzing the decision of analysed food image of customer's food. "
                        "If the decision is of refund, then reply only: 'refund' . "
                        "If the decision dosent approve refund then reply only: 'no_refund'."
                    )
                },
                {
                    "role": "user",
                    "content": decision
                }
            ],
            max_tokens=200
        )

        decision_final = response.choices[0].message.content.strip()
        print("[RefundRouterAgent] Final decision------ ", decision_final)
        if decision_final == "refund":
            state['refund_decision'] = "refund"
            state["refund_route"] = "refund_agent"
        else:
            state['refund_decision'] = "no_refund"
            state["refund_route"] = "end"
        
        print("refund_route ---- ",state["refund_route"])
        return state
    

class RefundAgent(Runnable):
    def invoke(self, state: dict, config: Optional[dict] = None) -> dict:
        reason = state.get("refund_reason", "No reason provided")
        decision = state.get("refund_decision", "").lower()
        image_uploaded = "uploaded_image_path" in state
        prompt = (
            f"The customer has requested a refund for order ID `{state.get('order_id', 'unknown')}`. "
            f"The reason given is: \"{reason}\". "
            f"The image of the food was successfully uploaded and analyzed. "
            f"Based on this analysis: {decision}, the refund has been approved. "
            "Kindly inform the user that the refund is being processed successfully and also include the reason from analysis. "
            "Be friendly, and reply in Markdown with emojis and next steps."
        )
        reply = generate_reply(state, prompt)
        state["history"] = state.get("history", []) + [{"role": "assistant", "content": reply}]

        state["refund_status"] = reply
        order_id = state.get("order_id")
        update_order_status(order_id)
        return state

class RefundPrecheckAgent(Runnable):
    def invoke(self, state: dict, config: Optional[dict] = None) -> dict:
        user_input = state.get("input", "")
        state["history"] = state.get("history", []) + [{"role": "user", "content": user_input}]
        state["refund_turns"] = state.get("refund_turns", 0) + 1
        
        history = state.get("history", [])
        extracted_order_id = None
        extracted_reason = None
        print("[RefundprecheckAgent] type of history ---- ",type(history))
        print("[RefundprecheckAgent] type of user_inout ---- ",type(user_input))

        print("[RefundprecheckAgent] history ---- ",history)
        for msg in history:
            text = msg.get("text") or msg.get("content", "")
            if not extracted_order_id:
                match = re.search(r"\b\d{13}\b", text)
                if match:
                    extracted_order_id = match.group(0)
        for msg in user_input:
            text = msg
            if not extracted_reason:
                if any(word in text.lower() for word in ["damaged", "cold", "spoiled", "wrong", "missing", "late"]):
                    extracted_reason = text

        # Update state if found
        if extracted_order_id:
            print(f"[RefundPrecheckAgent] Found order ID: {extracted_order_id}")
            status = get_order_status(extracted_order_id)
            print("[RefundprecheckAgent] status ----- ", status)
            if status:
                if status == "delivered":
                    state["order_id"] = extracted_order_id

                else:
                    system_prompt = (
                    "You are SwiftBot, an AI support assistant for SwiftBite. "
                    f"The user's order status is: {status}"
                    "Politely let them know that refund request cannot b raised due to the above order status and suggest contacting support. "
                    "Respond in Markdown."
                    )
                    reply = generate_reply(state, system_prompt)

                    state["chat_response"] = reply
                    state["history"] += [{"role": "assistant", "content": reply}]
                    return state
                    
            else:
                system_prompt = (
                "You are SwiftBot, an AI support assistant for SwiftBite. "
                f"The user has given invalid order id: {extracted_order_id}"
                "Politely let them know that order id entered is not present and suggest contacting support. "
                "Respond in Markdown."
                )
                reply = generate_reply(state, system_prompt)

                state["chat_response"] = reply
                state["history"] += [{"role": "assistant", "content": reply}]
                return state
                

        if extracted_reason:
            print(f"[RefundPrecheckAgent] Found reason: {extracted_reason}")
            state["refund_reason"] = extracted_reason        
        # Try extracting order ID from message

        
        print("[RefundPrecheck] order id ----- ",state.get("order_id"))

        # Try extracting refund reason from user message


        # Check if user has exceeded turns
        if state["refund_turns"] >= 5:
            system_prompt = (
                "You are SwiftBot, an AI support assistant for SwiftBite. "
                "The user has been prompted multiple times but hasn't provided complete info. "
                "Politely let them know we’re unable to proceed without the required data and suggest contacting support. "
                "Respond in Markdown."
            )
        elif state.get("order_id") or state.get("refund_reason"):
            system_prompt = (
                "You are SwiftBot, an AI customer support assistant. "
                "The user has provided both their order ID and reason for refund. "
                "Now kindly ask them to upload a picture of the food item so that the issue can be verified. "
                "Respond in Markdown."
            )
        else:
            # Dynamically identify what's missing
            missing_parts = []
            if not state.get("order_id"):
                missing_parts.append("order ID")
            if not state.get("refund_reason"):
                missing_parts.append("refund reason")
            if not state.get("uploaded_image_path"):
                missing_parts.append("image")

            system_prompt = (
                f"You are SwiftBot, an AI assistant for SwiftBite. The user is requesting a refund. "
                f"Politely ask the user to provide the missing information: {', and '.join(missing_parts)}. "
                "Do not mention what's already provided. Be concise, professional, and friendly. "
                "Respond in Markdown format."
            )

        # Use GPT to generate the reply
        reply = generate_reply(state, system_prompt)

        state["chat_response"] = reply
        state["history"] += [{"role": "assistant", "content": reply}]
        return state




#Build the graph
builder = StateGraph(dict)
# Agents
builder.add_node("chat_agent", ChatAgent())
builder.add_node("order_agent", OrderAgent())
builder.add_node("greeting_agent", GreetingAgent())
builder.add_node("image_agent", ImageAnalyzerAgent())
builder.add_node("refund_router", RefundRouterAgent())
builder.add_node("refund_agent", RefundAgent())
builder.add_node("refund_precheck", RefundPrecheckAgent())

# Entry point 1: regular user messages → goes through ChatAgent
builder.set_entry_point("chat_agent")

builder.add_conditional_edges(
    "chat_agent",
    lambda state: (
        "image_agent" if (
            state.get("intent") == "refund_request"
            and state.get("order_id")
            and state.get("refund_reason")
            and state.get("uploaded_image_path")
        ) else
        "refund_precheck" if state.get("intent") == "refund_request"
        else "order_agent" if state.get("intent") == "order_status"
        else "greeting_agent" if state.get("intent") == "chat_general"
        else END
    )
)

builder.add_conditional_edges(
    "refund_precheck",
    lambda state: (
        "image_agent"
        if state.get("order_id") or state.get("refund_reason")
        else ("end" if state.get("refund_turns", 0) >= 3 else "refund_precheck")
    )
)


builder.add_edge("image_agent", "refund_router")

builder.add_conditional_edges(
    "refund_router",
    lambda state: "refund_agent" if state.get("refund_decision", "").lower() == "refund" else END
)

builder.add_edge("refund_agent", END)

builder.add_edge("greeting_agent", END)
chat_graph = builder.compile()

# Test locally
if __name__ == "__main__":
    image_path = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "data", "damaged_sample.png")
    )
    result = chat_graph.invoke({
            "input": "I want refund",
            "uploaded_image_path": image_path
        })

    if result:
        print("Intent:", result.get("intent"))
        print("Order status:", result.get("order_response"))
        print("Bot reply:", result.get("chat_response"))
        print("Refund Decision:", result.get("refund_decision"))
        print("Refund Status:", result.get("refund_status"))
    else:
        print("Graph returned None.")