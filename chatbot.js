/* ========================================================
   chatbot.js — Nishu-AI RAG Chat Interface
   Premium Glassmorphism Widget v1.0
   ======================================================== */

'use strict';

class NishuChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.sessionId = Math.random().toString(36).substring(7);
        this.init();
    }

    init() {
        this.createWidget();
        this.addEventListeners();
        this.addWelcomeMessage();
    }

    createWidget() {
        const widget = document.createElement('div');
        widget.id = 'nishu-chat-widget';
        widget.innerHTML = `
            <div id="chat-trigger" class="chat-trigger">
                <i class="fas fa-robot"></i>
            </div>
            <div id="chat-window" class="chat-window" style="display: none;">
                <div class="chat-header">
                    <div class="chat-header-info">
                        <div class="chat-avatar"><i class="fas fa-robot"></i></div>
                        <div>
                            <div class="chat-name">Nishu-AI</div>
                            <div class="chat-status">Agentic Portfolio Assistant</div>
                        </div>
                    </div>
                    <button id="chat-close" class="chat-close"><i class="fas fa-times"></i></button>
                </div>
                <div id="chat-messages" class="chat-messages"></div>
                <div class="chat-input-area">
                    <input type="text" id="chat-input" placeholder="Ask about Nishanth's projects..." autocomplete="off">
                    <button id="chat-send"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
        `;
        document.body.appendChild(widget);
        this.injectStyles();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #nishu-chat-widget {
                position: fixed;
                bottom: 30px;
                right: 30px;
                z-index: 10000;
                font-family: 'Inter', sans-serif;
            }
            .chat-trigger {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #7c3aed, #22d3ee);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 10px 25px rgba(124, 58, 237, 0.4);
                transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            .chat-trigger:hover { transform: scale(1.1) rotate(5deg); }
            
            .chat-window {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 380px;
                height: 500px;
                background: rgba(14, 22, 42, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
                animation: chat-fade-in 0.3s ease-out;
            }
            @keyframes chat-fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

            .chat-header {
                padding: 20px;
                background: rgba(124, 58, 237, 0.15);
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .chat-header-info { display: flex; align-items: center; gap: 12px; }
            .chat-avatar {
                width: 40px;
                height: 40px;
                background: var(--gradient-primary);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                color: white;
            }
            .chat-name { font-weight: 700; font-size: 16px; color: #fff; }
            .chat-status { font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
            .chat-close { background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 18px; }

            .chat-messages {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 16px;
                scrollbar-width: thin;
                scrollbar-color: rgba(255,255,255,0.1) transparent;
            }
            .message {
                max-width: 85%;
                padding: 12px 16px;
                border-radius: 15px;
                font-size: 14px;
                line-height: 1.5;
            }
            .message.bot {
                align-self: flex-start;
                background: rgba(255, 255, 255, 0.06);
                color: #e2e8f0;
                border-bottom-left-radius: 2px;
            }
            .message.user {
                align-self: flex-end;
                background: linear-gradient(135deg, #7c3aed, #6d28d9);
                color: white;
                border-bottom-right-radius: 2px;
            }

            .chat-input-area {
                padding: 20px;
                background: rgba(0, 0, 0, 0.2);
                border-top: 1px solid rgba(255, 255, 255, 0.05);
                display: flex;
                gap: 10px;
            }
            #chat-input {
                flex: 1;
                background: rgba(255, 255, 255, 0.04);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 10px 15px;
                color: white;
                font-size: 14px;
                outline: none;
                transition: border-color 0.3s;
            }
            #chat-input:focus { border-color: #7c3aed; }
            #chat-send {
                width: 42px;
                height: 42px;
                background: #7c3aed;
                border: none;
                border-radius: 12px;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.3s;
            }
            #chat-send:hover { background: #6d28d9; }

            .typing {
                font-style: italic;
                font-size: 12px;
                color: #94a3b8;
                margin-top: -10px;
            }
        `;
        document.head.appendChild(style);
    }

    addEventListeners() {
        const trigger = document.getElementById('chat-trigger');
        const close = document.getElementById('chat-close');
        const send = document.getElementById('chat-send');
        const input = document.getElementById('chat-input');

        trigger.addEventListener('click', () => this.toggleChat());
        close.addEventListener('click', () => this.toggleChat());
        send.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    toggleChat() {
        const window = document.getElementById('chat-window');
        this.isOpen = !this.isOpen;
        window.style.display = this.isOpen ? 'flex' : 'none';
        if (this.isOpen) document.getElementById('chat-input').focus();
    }

    addMessage(role, content) {
        const container = document.getElementById('chat-messages');
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${role}`;
        msgDiv.textContent = content;
        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
        this.messages.push({ role, content });
    }

    addWelcomeMessage() {
        setTimeout(() => {
            this.addMessage('bot', "Hi! I'm Nishu-AI. Ask me anything about Nishanth's experience with Agentic AI, his research at IIIT-H, or his production projects like ChainMind.");
        }, 500);
    }

    async sendMessage() {
        const input = document.getElementById('chat-input');
        const content = input.value.trim();
        if (!content) return;

        input.value = '';
        this.addMessage('user', content);

        // Show typing indicator
        const container = document.getElementById('chat-messages');
        const typing = document.createElement('div');
        typing.className = 'typing';
        typing.id = 'typing-indicator';
        typing.textContent = 'Nishu-AI is thinking...';
        container.appendChild(typing);
        container.scrollTop = container.scrollHeight;

        try {
            // In production, u'd call your Vercel /api/chat endpoint
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: json.stringify({
                    messages: this.messages,
                    session_id: this.sessionId
                })
            });

            if (!response.ok) throw new Error('API offline');
            const data = await response.json();
            
            document.getElementById('typing-indicator')?.remove();
            this.addMessage('bot', data.content);
        } catch (error) {
            document.getElementById('typing-indicator')?.remove();
            this.addMessage('bot', "I'm currently in lightweight mode. To enable full reasoning, Nishanth needs to connect my LLM backend. However, I can tell you he's an expert in Multi-Agent systems and RAG!");
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.nishuChat = new NishuChatbot();
});
