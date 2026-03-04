import { useState, useEffect, useRef } from "react";
import axios from "axios";

export const Chatboat = () => {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello 👋 Main aapka AI Shopping Assistant hoon!" }
  ]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  // ✅ Auto Scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {

    if (!message.trim()) return;

    const userMessage = { sender: "user", text: message };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {

      const response = await axios.post(
        "http://localhost:8080/api/gemini/ask",
        { prompt: userMessage.text }
      );

      const botMessage = {
        sender: "bot",
        text: response.data.reply
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {

      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Server error aa gaya 😅" }
      ]);

    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">

      <div className="w-full max-w-lg h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 text-center font-semibold text-lg">
          AI Shopping Assistant 🤖
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-xl max-w-[75%] text-sm shadow-sm transition-all duration-200
                ${msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white border rounded-bl-none"
                  }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing Animation */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border px-4 py-2 rounded-xl text-sm animate-pulse">
                AI typing...
              </div>
            </div>
          )}

          <div ref={bottomRef}></div>

        </div>

        {/* Input Area */}
        <div className="flex p-3 border-t bg-white">

          <input
            type="text"
            placeholder="Apna question likho..."
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button
            onClick={sendMessage}
            className="ml-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
          >
            Send
          </button>

        </div>
      </div>
    </div>
  );
};