import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-20">
      <div className="text-center max-w-3xl">
        <div className="inline-block bg-indigo-100 text-indigo-800 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
          AI-Powered Enquiry Platform
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          Never miss a lead again
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
          ConversiQ captures, qualifies, and analyzes every customer enquiry with
          AI. Your website works for you 24/7 — answering FAQs, collecting leads,
          and showing you exactly what your customers want.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/contact"
            className="bg-indigo-600 text-white px-8 py-3 rounded-full font-medium hover:bg-indigo-700 transition"
          >
            Get Started
          </Link>
          <Link
            href="/about"
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition"
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Features grid */}
      <div className="max-w-5xl mx-auto mt-20 px-4 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {[
          {
            title: "AI Chat Widget",
            desc: "Embed a smart chat widget that answers FAQs, qualifies leads, and escalates when needed.",
            icon: "💬",
          },
          {
            title: "Smart Dashboard",
            desc: "Real-time analytics on enquiries, topics, lead quality, and conversion rates.",
            icon: "📊",
          },
          {
            title: "Ask Your Data",
            desc: "Type any question about your enquiries and get instant AI-powered insights.",
            icon: "🔍",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="bg-white border border-gray-200 rounded-2xl p-6 text-center"
          >
            <div className="text-4xl mb-3">{f.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
            <p className="mt-2 text-gray-600 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
