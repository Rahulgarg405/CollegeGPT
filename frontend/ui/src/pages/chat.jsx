import { useState, useEffect, useRef } from "react";
import Button from "../components/button";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // scrolling ke liye
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    // user msg chat me add krne ke lie
    const userMsg = { id: Date.now(), text: query, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setQuery("");
    setLoading(true);

    try {
      // yha pe bs tere backend me api/chat tha dekh lena
      const res = await fetch("http://localhost:3000/api/chat/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          summary,
          recentMessages: messages.slice(-4).map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });

      const data = await res.json();

      // console.log(data.message);

      if (!data || !data.message) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, text: "No data found.", sender: "bot" },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, text: data.message, sender: "bot" },
        ]);
      }

      if (data.summary) {
        setSummary(data.summary);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Something went wrong while fetching answer.",
          sender: "bot",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-accent pt-20 items-center">
      <div className="w-full max-w-2xl bg-white/70 backdrop-blur-glass shadow-smooth rounded-2xl flex flex-col h-[80vh] overflow-hidden">
        {/* Chat Window */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <p className="text-center text-gray-500 italic mt-10">
              Ask a question to get started 💬
            </p>
          )}

          {messages.map((msg) => (
            <div
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-black text-white rounded-br-none"
                    : msg.text === "No data found."
                    ? "bg-red-100 text-red-800 rounded-bl-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-2 bg-gray-200 text-gray-700 rounded-2xl animate-pulse">
                Searching...
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Section */}
        <form
          onSubmit={sendMessage}
          className="flex items-center p-4 border-t border-gray-300 bg-white/60 backdrop-blur-sm"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-sm"
          />
          <div className="ml-3">
            <Button label="Send" type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
}
