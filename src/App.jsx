import { useState } from 'react';
import { ABHAY_RESUME } from './data';
import './App.css';

function App() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([
    { role: "model", text: "Hi! I'm Abhay's assistant. I've been updated to the latest Gemini model. Ask me about his Symbica internship!" }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
  if (!input.trim()) return;
  setLoading(true);

  const userMsg = { role: "user", text: input };
  const updatedChat = [...chat, userMsg];
  setChat(updatedChat);

  try {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    
    // Using 'v1' and standard 'gemini-1.5-flash'
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `System: You are a professional assistant for Abhay Chetry. Resume: ${ABHAY_RESUME}\n\nUser: ${input}`
          }]
        }]
      })
    });

    const data = await response.json();

    if (data.error) throw new Error(data.error.message);

    const botResponse = data.candidates[0].content.parts[0].text;
    setChat([...updatedChat, { role: "model", text: botResponse }]);

  } catch (err) {
    console.error("Debug:", err.message);
    setChat([...updatedChat, { role: "model", text: "I'm still having trouble connecting to Google's servers. Please try again in 5 minutes." }]);
  }

  setInput("");
  setLoading(false);
};

  return (
    <div className="container">
      <div className="chat-header">
        <h2>Abhay's Assistant</h2>
      </div>
      <div className="chat-box">
        {chat.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            {m.text}
          </div>
        ))}
        {loading && <div className="bubble model">Thinking...</div>}
      </div>
      <div className="input-group">
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask me about Abhay's skills..."
        />
        <button onClick={handleSend} disabled={loading}>Send</button>
      </div>
    </div>
  );
}

export default App;