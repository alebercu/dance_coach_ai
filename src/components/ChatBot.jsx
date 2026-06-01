import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { marked } from 'marked';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll automat la ultimul mesaj
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Încarcă istoricul când se deschide chat-ul (o singură dată)
  useEffect(() => {
    if (isOpen && !historyLoaded) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/chat-history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.data.length > 0) {
        setMessages(res.data);
      } else {
        setMessages([{ 
          role: 'ai', 
          text: 'Hello! I am your AI dance coach. How can I help you today?' 
        }]);
      }
      setHistoryLoaded(true);
    } catch {
      setMessages([{ 
        role: 'ai', 
        text: 'Hello! I am your AI dance coach. How can I help you today?' 
      }]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/ask-coach',
        { message: input },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setMessages([...newMessages, { role: 'assistant', text: res.data.answer }]);
    } catch {
      setMessages([...newMessages, { 
        role: 'assistant', 
        text: 'Ups! I have a connection problem.' 
      }]);
    }
    setLoading(false);
  };

  const clearHistory = async () => {
    if (!window.confirm('Clear all chat history?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:5000/chat-history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMessages([{ 
        role: 'ai', 
        text: 'History cleared! How can I help you?' 
      }]);
    } catch {
      alert('Could not clear history.');
    }
  };

  const renderMessage = (m, i) => {
    const isAI = m.role === 'ai' || m.role === 'assistant';
    if (isAI) {
      return (
        <div
          key={i}
          className="message ai"
          dangerouslySetInnerHTML={{ __html: marked.parse(m.text) }}
        />
      );
    }
    return <div key={i} className="message user">{m.text}</div>;
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''} ${isExpanded ? 'expanded' : ''}`}>
      {!isOpen ? (
        <button className="chat-toggle" onClick={() => setIsOpen(true)}>
          💬 Coach AI
        </button>
      ) : (
        <div className="chat-window card">
          <div className="chat-header">
            <h4 style={{ margin: 0 }}>Coach AI</h4>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={clearHistory}
                title="Clear history"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--muted)', fontSize: '1rem', padding: '0 4px'
                }}
              >
                🗑️
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Minimize' : 'Expand'}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--muted)', fontSize: '1.1rem', padding: '0 4px'
                }}
              >
                {isExpanded ? '⊡' : '⊞'}
              </button>
              <button
                onClick={() => { setIsOpen(false); setIsExpanded(false); }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--muted)', fontSize: '1.1rem', padding: '0 4px'
                }}
              >
                ✕
              </button>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((m, i) => renderMessage(m, i))}
            {loading && <div className="message ai">Thinking...</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about your progress..."
            />
            <button className="secondary-button" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;

// import React, { useState } from 'react';
// import axios from 'axios';
// import { marked } from 'marked';

// const ChatBot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [messages, setMessages] = useState([{ role: 'ai', text: 'Hello! I am your AI dance coach. How can I help you today?' }]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);

//   const sendMessage = async () => {
//     if (!input.trim()) return;
//     const newMessages = [...messages, { role: 'user', text: input }];
//     setMessages(newMessages);
//     setInput('');
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.post('http://localhost:5000/ask-coach', { message: input }, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       setMessages([...newMessages, { role: 'ai', text: res.data.answer }]);
//     } catch (err) {
//       setMessages([...newMessages, { role: 'ai', text: 'Ups! I have a connection problem.' }]);
//     }
//     setLoading(false);
//   };

//   const renderMessage = (m, i) => {
//     if (m.role === 'ai') {
//       return (
//         <div
//           key={i}
//           className="message ai"
//           dangerouslySetInnerHTML={{ __html: marked.parse(m.text) }}
//         />
//       );
//     }
//     return <div key={i} className="message user">{m.text}</div>;
//   };

//   return (
//     <div className={`chatbot-container ${isOpen ? 'open' : ''} ${isExpanded ? 'expanded' : ''}`}>
//       {!isOpen ? (
//         <button className="chat-toggle" onClick={() => setIsOpen(true)}>💬 Coach AI</button>
//       ) : (
//         <div className="chat-window card">
//           <div className="chat-header">
//             <h4 style={{ margin: 0 }}>Coach AI</h4>
//             <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
//               <button
//                 onClick={() => setIsExpanded(!isExpanded)}
//                 title={isExpanded ? 'Minimize' : 'Expand'}
//                 style={{
//                   background: 'none', border: 'none', cursor: 'pointer',
//                   color: 'var(--muted)', fontSize: '1.1rem', padding: '0 4px',
//                   lineHeight: 1
//                 }}
//               >
//                 {isExpanded ? '⊡' : '⊞'}
//               </button>
//               <button
//                 onClick={() => { setIsOpen(false); setIsExpanded(false); }}
//                 style={{
//                   background: 'none', border: 'none', cursor: 'pointer',
//                   color: 'var(--muted)', fontSize: '1.1rem', padding: '0 4px',
//                   lineHeight: 1
//                 }}
//               >
//                 ✕
//               </button>
//             </div>
//           </div>
//           <div className="chat-messages">
//             {messages.map((m, i) => renderMessage(m, i))}
//             {loading && <div className="message ai">Thinking...</div>}
//           </div>
//           <div className="chat-input">
//             <input
//               value={input}
//               onChange={e => setInput(e.target.value)}
//               onKeyDown={e => e.key === 'Enter' && sendMessage()}
//               placeholder="Ask about your progress..."
//             />
//             <button className="secondary-button" onClick={sendMessage}>Send</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatBot;
