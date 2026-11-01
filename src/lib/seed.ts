import { queryOne, execute, executeMultiple } from "./db";

export async function seedKnowledgeBase() {
  const count = await queryOne("SELECT COUNT(*) as c FROM knowledge_base");
  if (!count || (count.c as number) > 0) return;

  const faqs = [
    {
      question: "What is ConversiQ?",
      answer:
        "ConversiQ is an AI-powered enquiry capture and insight platform that helps businesses understand their customers better. It qualifies leads, answers FAQs, and provides actionable analytics.",
      category: "general",
      keywords: '["conversiq", "platform", "what is"]',
    },
    {
      question: "How much does ConversiQ cost?",
      answer:
        "We offer flexible pricing plans starting from $29/month for small businesses. Enterprise plans with custom features are also available. Contact our sales team for a detailed quote.",
      category: "pricing",
      keywords: '["pricing", "cost", "price", "plans", "subscription"]',
    },
    {
      question: "Can I try ConversiQ before buying?",
      answer:
        "Yes! We offer a 14-day free trial with full access to all features. No credit card required. Sign up on our website to get started.",
      category: "pricing",
      keywords: '["trial", "demo", "free", "try"]',
    },
    {
      question: "How does the AI chat widget work?",
      answer:
        "Our AI chat widget embeds directly on your website. It answers visitor questions using your knowledge base, qualifies leads by collecting contact details, and escalates complex enquiries to your team automatically.",
      category: "features",
      keywords: '["chat", "widget", "ai", "how it works"]',
    },
    {
      question: "What kind of analytics do you provide?",
      answer:
        "ConversiQ provides a comprehensive dashboard with enquiry trends, topic analysis, lead quality scoring, conversion tracking, unanswered question identification, and peak hour analysis. You can also ask natural language questions about your data.",
      category: "features",
      keywords: '["analytics", "dashboard", "insights", "reports"]',
    },
    {
      question: "Is my data secure?",
      answer:
        "Absolutely. We use industry-standard encryption for all data in transit and at rest. We never share your data with third parties, and you retain full ownership of your information.",
      category: "security",
      keywords: '["security", "data", "privacy", "encryption", "safe"]',
    },
    {
      question: "Do you offer customer support?",
      answer:
        "Yes! All plans include email support during business hours. Enterprise plans include priority phone support and a dedicated account manager. Our average response time is under 2 hours.",
      category: "support",
      keywords: '["support", "help", "customer service", "contact"]',
    },
    {
      question: "Can I integrate ConversiQ with my existing tools?",
      answer:
        "ConversiQ integrates with popular CRM platforms, Slack, email marketing tools, and more via our API. Custom integrations are available on enterprise plans.",
      category: "features",
      keywords: '["integrations", "api", "crm", "slack", "tools"]',
    },
    {
      question: "What happens when the AI can't answer a question?",
      answer:
        "When the AI cannot answer a question, it collects the visitor's contact details and escalates the enquiry to your team. The unanswered question is logged and appears on your dashboard so you know what content to add.",
      category: "features",
      keywords: '["unanswered", "escalate", "handoff", "human"]',
    },
    {
      question: "How do I get started?",
      answer:
        "Getting started is easy! Sign up for a free trial, embed our chat widget code snippet on your website, and add your FAQ knowledge base. The AI starts working immediately.",
      category: "general",
      keywords: '["getting started", "setup", "onboarding", "sign up"]',
    },
  ];

  for (const faq of faqs) {
    await execute(
      "INSERT INTO knowledge_base (question, answer, category, keywords) VALUES (?, ?, ?, ?)",
      [faq.question, faq.answer, faq.category, faq.keywords]
    );
  }
}