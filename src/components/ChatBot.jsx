import React, { useState } from 'react';
import axios from 'axios';
import { marked } from 'marked';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Hello! I am your AI dance coach. How can I help you today?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/ask-coach', { message: input }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMessages([...newMessages, { role: 'ai', text: res.data.answer }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'ai', text: 'Ups! I have a connection problem.' }]);
    }
    setLoading(false);
  };

  const renderMessage = (m, i) => {
    if (m.role === 'ai') {
      return (
        <div
          key={i}
          className="message ai"
          dangerouslySetInnerHTML={{ __html: marked.parse(m.text) }}
        />
      );
    }
    return <div className="message user">{m.text}</div>;
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      {!isOpen ? (
        <button className="chat-toggle" onClick={() => setIsOpen(true)}>Coach AI</button>
      ) : (
        <div className="chat-window card">
          <div className="chat-header">
            <h4>Coach AI</h4>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div className="chat-messages">
            {messages.map((m, i) => renderMessage(m, i))}  
            {loading && <div className="message ai">Thinking...</div>}
          </div>
          <div className="chat-input">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}  // ← bonus: Enter trimite
              placeholder="Ask about your progress..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
// import React, { useState } from 'react';
// import axios from 'axios';

// const ChatBot = () => {
//   const [isOpen, setIsOpen] = useState(false);
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

//   return (
//     <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
//       {!isOpen ? (
//         <button className="chat-toggle" onClick={() => setIsOpen(true)}> Coach AI</button>
//       ) : (
//         <div className="chat-window card">
//           <div className="chat-header">
//             <h4>Coach AI</h4>
//             <button onClick={() => setIsOpen(false)}>✕</button>
//           </div>
//           <div className="chat-messages">
//             {messages.map((m, i) => (
//               <div key={i} className={`message ${m.role}`}>{m.text}</div>
//             ))}
//             {loading && <div className="message ai">Thinking...</div>}
//           </div>
//           <div className="chat-input">
//             <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about your progress..." />
//             <button onClick={sendMessage}>Send</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatBot;