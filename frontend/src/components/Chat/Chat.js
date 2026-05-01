import React, { useState, useEffect, useRef } from "react";
import api from "../../services/api";

const Chat = () => {
  const [open, setOpen]         = useState(false);
  const [input, setInput]       = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId]             = useState(() => "session_" + Math.random().toString(36).slice(2, 15));
  const [msgs, setMsgs]         = useState([
    { who: "bot", text: "Welcome to Car Marketplace! How can I help you today?" },
  ]);
  const bottomRef = useRef(null);

  const examples = [
    "Show me Toyota vehicles",
    "What SUVs do you have?",
    "What are your hot deals?",
    "Tell me about vehicle ID 5",
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, isTyping]);

  const send = async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMsgs((prev) => [...prev, { who: "user", text: trimmed }]);
    setInput("");
    setIsTyping(true);
    try {
      const response = await api.post("/chat", { message: trimmed, sessionId });
      const lines = response.data.response.split("\n").map((line, i) => (
        <React.Fragment key={i}>{line}<br /></React.Fragment>
      ));
      setMsgs((prev) => [...prev, { who: "bot", text: lines }]);
    } catch {
      setMsgs((prev) => [...prev, { who: "bot", text: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => { e.preventDefault(); send(input); };

  return (
    <>
      <button className="chat-fab" onClick={() => setOpen(!open)} aria-label="Toggle chat">
        {open ? "×" : "💬"}
      </button>

      {open && (
        <div className="chat-panel">
          <div className="chat-head">
            <h4>Marketplace Assistant</h4>
            <button className="chat-close" onClick={() => setOpen(false)}>×</button>
          </div>

          <div className="chat-msgs">
            {msgs.map((m, i) => (
              <div key={i} className={`chat-msg chat-msg--${m.who}`}>{m.text}</div>
            ))}
            {isTyping && (
              <div className="chat-msg chat-msg--bot chat-typing">
                <span /><span /><span />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {msgs.length === 1 && (
            <div className="chat-suggestions">
              <span className="chat-suggestions__title">Try asking about:</span>
              <div className="chat-suggestions__list">
                {examples.map((ex) => (
                  <button key={ex} className="chat-suggest-btn" onClick={() => send(ex)}>
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form className="chat-form" onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about our vehicles…"
            />
            <button type="submit" className="btn btn--dark btn--sm">Send</button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chat;
