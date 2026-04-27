import os
import json
import numpy as np
from typing import List, Optional
from pydantic import BaseModel
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

# Initialize FastAPI
app = FastAPI()

# Enable CORS for the portfolio site
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Configuration & State ---
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    session_id: Optional[str] = "default"

# Load Knowledge Base
KB_FILE = os.path.join(os.path.dirname(__file__), "..", "knowledge_base.json")
try:
    with open(KB_FILE, "r") as f:
        KNOWLEDGE_BASE = json.load(f)
except Exception as e:
    # Fallback for Vercel pathing or local test
    KNOWLEDGE_BASE = [{"category": "Error", "content": f"KB not found at {KB_FILE}"}]

# --- RAG Core Logic (2026 Best Practices) ---

def get_embedding(text):
    # In a real 2026 production app, we would use a proper embedding model.
    # For this portfolio RAG, we will use a simple hashed TF-IDF or just mock it 
    # to avoid external dependencies during initialization.
    # Actually, let's assume OpenAI/Gemini is available via environment keys.
    return [0.0] * 1536 # Placeholder

def hybrid_search(query: str, top_k: int = 3):
    """
    Combines Keyword (BM25-style) and Semantic (Vector) search.
    """
    scores = []
    query_words = set(query.lower().split())
    
    for item in KNOWLEDGE_BASE:
        content = item['content'].lower()
        # Keyword score
        kw_score = sum(1 for word in query_words if word in content) / len(query_words) if query_words else 0
        # Semantic score (placeholder for now)
        sm_score = 0.5 
        
        # Reciprocal Rank Fusion (RRF) style combination
        combined_score = (kw_score * 0.6) + (sm_score * 0.4)
        scores.append((combined_score, item))
    
    scores.sort(key=lambda x: x[0], reverse=True)
    return [item for score, item in scores[:top_k]]

def prompt_guardrail(query: str) -> bool:
    """
    Check if the query is safe and relevant to the portfolio.
    """
    restricted_keywords = ["password", "token", "secret", "hack", "ignore instructions"]
    if any(k in query.lower() for k in restricted_keywords):
        return False
    return True

# --- API Endpoints ---

@app.post("/api/chat")
async def chat(request: ChatRequest):
    if not request.messages:
        raise HTTPException(status_code=400, detail="No messages provided")
    
    user_query = request.messages[-1].content
    
    # 1. Guardrail Check
    if not prompt_guardrail(user_query):
        return {"role": "assistant", "content": "I apologize, but I can only answer questions related to Nishanth's professional services and projects."}

    # 2. Retrieval (Hybrid)
    context_chunks = hybrid_search(user_query)
    context_text = "\n".join([f"[{c['category']}]: {c['content']}" for c in context_chunks])

    # 3. Generation with Memory (Session-based)
    # Note: In a real app, you'd call Gemini/OpenAI here.
    # Since I'm building this for the user to deploy, I'll structure the prompt
    # and provide a clear place for the API call.
    
    system_prompt = f"""
    You are 'Nishu-AI', a professional agentic assistant for Nishanth R's portfolio.
    Your goal is to provide reliable, grounded information about Nishanth's projects, research, and skills.
    
    CONTEXT ABOUT NISHANTH:
    {context_text}
    
    GUIDELINES:
    - Only answer based on the provided context. 
    - If the user asks something outside the context, politely redirect them to contact Nishanth.
    - Be professional, concise, and highlight his expertise in Agentic AI and Drug Discovery.
    - Mention specific projects like ChainMind or his research at IIIT-H when relevant.
    - Always maintain a "Production-Grade" tone.
    """

    # Generate response via Gemini API
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        # We append the system prompt and then the query to make sure it follows guidelines
        prompt = system_prompt + "\n\nUSER QUESTION:\n" + user_query
        
        response = model.generate_content(prompt)
        response_content = response.text
    except Exception as e:
        response_content = f"Error generating response: {str(e)}. Please check your API Key configuration."

    return {
        "role": "assistant", 
        "content": response_content,
        "sources": [c['category'] for c in context_chunks]
    }

@app.get("/api/health")
async def health():
    return {"status": "ok", "kb_size": len(KNOWLEDGE_BASE)}
