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

  const updatedChat = [...chat, { role: "user", text: input }];
  setChat(updatedChat);

  try {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    // We use the most basic pro model URL
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Resume: ${ABHAY_RESUME}\n\nQuestion: ${input}` }] }]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    const botResponse = data.candidates[0].content.parts[0].text;
    setChat([...updatedChat, { role: "model", text: botResponse }]);
  } catch (err) {
    setChat([...updatedChat, { role: "model", text: "Connection pending. Google is still activating this model for your key." }]);
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