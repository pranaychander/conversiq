"use client";

import { useState } from "react";

export default function AskPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function askQuestion() {
    if (!question.trim() || loading) return;
    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setAnswer(data.answer);
      }
    } catch {
      setError("Failed to get an answer. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Ask Your Data
      </h1>
      <p className="text-gray-600 mb-8">
        Ask any question about your enquiries and get instant AI-powered
        insights. Your data stays aggregated and anonymous.
      </p>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askQuestion()}
            placeholder="e.g., What are the most common questions this week?"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-base"
          />
          <button
            onClick={askQuestion}
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Ask"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700">
          {error}
        </div>
      )}

      {answer && (
        <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-indigo-800 mb-2">
            Answer
          </h2>
          <p className="text-gray-800 whitespace-pre-wrap">{answer}</p>
        </div>
      )}

      {/* Example questions */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Try asking:
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            "What are the most common topics?",
            "How many hot leads this week?",
            "What questions can't I answer?",
            "What are peak enquiry hours?",
            "What's my conversion rate?",
          ].map((q) => (
            <button
              key={q}
              onClick={() => {
                setQuestion(q);
                setAnswer("");
                setError("");
              }}
              className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm hover:bg-gray-200 transition"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}