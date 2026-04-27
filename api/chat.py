import os
import json
from typing import List, Optional
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai
from mangum import Mangum

# Load .env for local dev (Vercel uses its own env var injection)
load_dotenv()

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Initialize FastAPI
app = FastAPI()

# Enable CORS for the portfolio site
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Vercel ASGI Handler (REQUIRED for serverless) ---
handler = Mangum(app)

# --- Models ---
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    session_id: Optional[str] = "default"

# --- Load Knowledge Base ---
KB_FILE = os.path.join(os.path.dirname(__file__), "..", "knowledge_base.json")
try:
    with open(KB_FILE, "r") as f:
        KNOWLEDGE_BASE = json.load(f)
except Exception as e:
    KNOWLEDGE_BASE = [{"category": "General", "content": "Nishanth R is an AI/ML researcher at IIIT-H specializing in Agentic AI and Drug Discovery."}]

# --- RAG: Hybrid Keyword Search ---
def hybrid_search(query: str, top_k: int = 3):
    scores = []
    query_words = set(query.lower().split())
    for item in KNOWLEDGE_BASE:
        content = item['content'].lower()
        kw_score = sum(1 for word in query_words if word in content) / len(query_words) if query_words else 0
        scores.append((kw_score, item))
    scores.sort(key=lambda x: x[0], reverse=True)
    return [item for score, item in scores[:top_k]]

# --- Guardrail ---
def prompt_guardrail(query: str) -> bool:
    restricted_keywords = ["password", "token", "secret", "hack", "ignore instructions"]
    return not any(k in query.lower() for k in restricted_keywords)

# --- API Endpoints ---

@app.post("/api/chat")
async def chat(request: ChatRequest):
    if not request.messages:
        raise HTTPException(status_code=400, detail="No messages provided")

    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured. Please add it to Vercel Environment Variables.")

    user_query = request.messages[-1].content

    # Guardrail
    if not prompt_guardrail(user_query):
        return {"role": "assistant", "content": "I apologize, but I can only answer questions related to Nishanth's professional services and projects."}

    # RAG Retrieval
    context_chunks = hybrid_search(user_query)
    context_text = "\n".join([f"[{c['category']}]: {c['content']}" for c in context_chunks])

    system_prompt = f"""You are 'Nishu-AI', a professional agentic assistant for Nishanth R's portfolio.
Your goal is to provide reliable, grounded information about Nishanth's projects, research, and skills.

CONTEXT ABOUT NISHANTH:
{context_text}

GUIDELINES:
- Only answer based on the provided context.
- If the user asks something outside the context, politely redirect them to contact Nishanth directly.
- Be professional, concise, and highlight his expertise in Agentic AI and Drug Discovery.
- Mention specific projects like ChainMind or his research at IIIT-H when relevant.
- Always maintain a production-grade, helpful tone.

USER QUESTION:
{user_query}"""

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(system_prompt)
        response_content = response.text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API error: {str(e)}")

    return {
        "role": "assistant",
        "content": response_content,
        "sources": [c['category'] for c in context_chunks]
    }

@app.get("/api/health")
async def health():
    key_status = "configured" if GEMINI_API_KEY else "MISSING - add GEMINI_API_KEY to env"
    return {
        "status": "ok",
        "kb_size": len(KNOWLEDGE_BASE),
        "gemini_key": key_status
    }
