function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([
    { who: "bot", text: "Welcome to Car Marketplace! How can I help you today?" }
  ]);
  const examples = ["Show me Toyota vehicles", "What SUVs do you have?", "What are your hot deals?"];
  const send = (text) => {
    if (!text.trim()) return;
    setMsgs(prev => [...prev, { who: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMsgs(prev => [...prev, { who: "bot", text: "Great question! I found a few matches — check the catalog for the full list." }]);
    }, 600);
  };
  return (
    <>
      <button className="chat-fab" onClick={() => setOpen(!open)} aria-label="Toggle chat">
        {open ? "×" : "💬"}
      </button>
      {open && (
        <div className="chat-panel">
          <div className="chat-head">
            <h4>Marketplace Assistant</h4>
            <span style={{ fontSize: 18, cursor: "pointer", color: "var(--color-n300)" }} onClick={() => setOpen(false)}>×</span>
          </div>
          <div className="chat-msgs">
            {msgs.map((m, i) => <div key={i} className={`chat-msg chat-msg--${m.who}`}>{m.text}</div>)}
          </div>
          {msgs.length === 1 && (
            <div className="chat-suggestions">
              <span className="chat-suggestions__title">Try asking about:</span>
              <div className="chat-suggestions__list">
                {examples.map(e => <button key={e} className="chat-suggest-btn" onClick={() => send(e)}>{e}</button>)}
              </div>
            </div>
          )}
          <form className="chat-form" onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about our vehicles…"/>
            <Button kind="dark" size="sm" type="submit">Send</Button>
          </form>
        </div>
      )}
    </>
  );
}
window.ChatWidget = ChatWidget;
