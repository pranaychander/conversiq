export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">About ConversiQ</h1>

      <div className="prose prose-lg text-gray-700 space-y-4">
        <p>
          ConversiQ is an AI-powered enquiry capture and insight platform built
          for modern businesses. We help you understand every visitor who lands
          on your website — what they ask, what they need, and whether they're
          ready to buy.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8">
          Why ConversiQ?
        </h2>

        <p>
          Most businesses lose valuable leads because they can't respond to every
          visitor in real time. Chatbots help, but they often feel robotic and
          don't capture structured data you can actually use.
        </p>

        <p>
          ConversiQ bridges that gap. Our AI agent answers FAQs from your
          knowledge base, qualifies leads by collecting contact details, and
          escalates complex enquiries to your team. Every conversation is
          automatically tagged with topic, intent, lead quality, and outcome —
          giving you a rich dataset to understand your customers.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8">
          Key Features
        </h2>

        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>AI Chat Widget</strong> — Embeddable widget that handles
            FAQs, lead qualification, and escalation
          </li>
          <li>
            <strong>Smart Tagging</strong> — Every conversation is auto-tagged
            with topic, intent, lead quality, and outcome
          </li>
          <li>
            <strong>BI Dashboard</strong> — Real-time analytics with enquiry
            trends, topic analysis, and conversion tracking
          </li>
          <li>
            <strong>Ask Your Data</strong> — Natural language queries on your
            aggregated enquiry data
          </li>
          <li>
            <strong>Weekly Insights</strong> — Auto-generated summaries with
            actionable recommendations
          </li>
        </ul>
      </div>
    </div>
  );
}