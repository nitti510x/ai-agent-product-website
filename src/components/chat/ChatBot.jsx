import React, { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiX, FiSend, FiMinimize2 } from 'react-icons/fi';

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hi! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    setMessages(prev => [...prev, {
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }]);

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: 'I understand you\'re asking about "' + inputMessage + '". This is a demo response. In the real application, this would be handled by the AI backend.',
        timestamp: new Date()
      }]);
    }, 1000);

    setInputMessage('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary-hover text-dark p-4 rounded-full shadow-lg hover:shadow-glow transition-all duration-300"
        >
          <FiMessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-dark-lighter border border-dark-card rounded-xl shadow-xl w-96 max-w-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-dark-card flex justify-between items-center">
            <h3 className="text-gray-100 font-semibold">AI Assistant</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <FiMinimize2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-primary text-dark'
                      : 'bg-dark text-gray-100'
                  }`}
                >
                  <p>{message.content}</p>
                  <span className="text-xs opacity-75 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-dark-card">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-dark border border-dark-card rounded-lg px-4 py-2 text-gray-100 focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-hover text-dark p-2 rounded-lg transition-colors hover:shadow-glow"
              >
                <FiSend className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ChatBot;