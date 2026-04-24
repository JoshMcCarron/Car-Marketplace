import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Welcome to LeBron James Cars! How can I help you today?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef(null);

  // Generate a session ID on component mount
  useEffect(() => {
    const newSessionId = 'session_' + Math.random().toString(36).substring(2, 15);
    setSessionId(newSessionId);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Toggle chatbot visibility
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Process user message and send to backend
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (input.trim() === '') return;
    
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    try {
      const response = await fetch('http://18.214.94.81:8080/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          sessionId: sessionId
        }),
      });

      // Check for non-JSON responses
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Backend error: ${text.substring(0, 100)}`);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Fixed line break handling
      const formattedResponse = data.response.split('\n').map((line, i) => (
        <React.Fragment key={i}>
          {line}
          <br />
        </React.Fragment>
      ));

      setMessages(prev => [...prev, { text: formattedResponse, sender: 'bot' }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        text: `Error: ${error.message}`, 
        sender: 'bot' 
      }]);
    }
    
    setIsTyping(false);
  };

  // Examples of car-related queries to help users
  const queryExamples = [
    "Show me Toyota vehicles",
    "What SUVs do you have?",
    "What are your hot deals?",
    "Tell me about vehicle ID 5",
  ];

  // Handle clicking on a suggestion
  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  return (
    <div className="chatbot-container">
      {/* Chat toggle button */}
      <button className="chat-toggle" onClick={toggleChat}>
        {isOpen ? '×' : '💬'}
      </button>
      
      {/* Chat window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>LeBron James Cars Assistant</h3>
          </div>
          
          <div className="messages-container">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                <div className="message-bubble">{message.text}</div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot">
                <div className="message-bubble typing">
                  <span>.</span><span>.</span><span>.</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {messages.length === 1 && (
            <div className="suggestions">
              <p>Try asking about:</p>
              <div className="suggestion-buttons">
                {queryExamples.map((example, index) => (
                  <button 
                    key={index} 
                    className="suggestion-button"
                    onClick={() => handleSuggestionClick(example)}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <form className="input-container" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about our vehicles..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;