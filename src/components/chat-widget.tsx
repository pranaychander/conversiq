"use client";

import { useState, useRef, useEffect } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm ConversiQ. How can I help you today? Ask me anything about our product!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");
  const [contactCollected, setContactCollected] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [showContactForm, setShowContactForm] = useState(false);
  const [closed, setClosed] = useState(false);
  const chatEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setConversationId(crypto.randomUUID());
  }, []);

  useEffect(() => {
    if (chatEnd.current) chatEnd.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          message: userMsg,
          messages: [...messages, { role: "user", content: userMsg }],
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);

      if (data.needsContact && !contactCollected) {
        setShowContactForm(true);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    }
    setLoading(false);
  }

  async function submitContact() {
    if (!name.trim() || !email.trim()) return;
    setShowContactForm(false);
    setContactCollected(true);
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `Thanks ${name}! We've noted your details and a team member will get back to you shortly.`,
      },
    ]);

    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId,
        message: "",
        messages: [...messages],
        contact: { name, email, phone },
      }),
    });
  }

  async function closeChat() {
    if (!closed) {
      setClosed(true);
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          message: "",
          messages: [...messages],
          close: true,
        }),
      });
    }
    setOpen(false);
  }

  return (
    <>
      {/* Chat bubble button */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-indigo-600 text-white shadow-lg flex items-center justify-center text-2xl hover:bg-indigo-700 transition ${open ? "hidden" : ""}`}
      >
        💬
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
          <div className="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center">
            <span className="font-semibold">ConversiQ Chat</span>
            <button onClick={closeChat} className="text-white hover:opacity-75">
              ✕
            </button>
          </div>

          <div className="bg-white h-80 overflow-y-auto px-4 py-3 space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-3/4 rounded-lg px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-indigo-100 text-indigo-900"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {showContactForm && (
              <div className="bg-gray-50 p-3 rounded-lg border text-sm">
                <p className="font-medium mb-2">
                  Please leave your details so we can follow up:
                </p>
                <input
                  type="text"
                  placeholder="Your name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded px-2 py-1 mb-1 text-sm"
                />
                <input
                  type="email"
                  placeholder="Your email *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded px-2 py-1 mb-1 text-sm"
                />
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border rounded px-2 py-1 mb-1 text-sm"
                />
                <button
                  onClick={submitContact}
                  className="mt-1 w-full bg-indigo-600 text-white rounded py-1 text-sm font-medium"
                >
                  Submit
                </button>
              </div>
            )}

            <div ref={chatEnd} />
          </div>

          <div className="flex gap-1 p-2 border-t">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 border rounded-full px-3 py-1.5 text-sm"
              disabled={loading || showContactForm}
            />
            <button
              onClick={sendMessage}
              disabled={loading || showContactForm}
              className="bg-indigo-600 text-white rounded-full px-3 py-1.5 text-sm"
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}