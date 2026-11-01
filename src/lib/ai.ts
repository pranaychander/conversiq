import OpenAI from "openai";
import { queryAll, queryOne, execute } from "./db";

function getClient(): OpenAI {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const SYSTEM_PROMPT = `You are ConversiQ, an AI enquiry assistant for a business. Your role:
1. Answer visitor questions using the knowledge base provided.
2. If you cannot answer, politely ask for their name, email, and phone to escalate.
3. Be friendly, professional, and concise.
4. At the end of the conversation, tag it with: topic, intent (faq/qualify/escalate), lead_quality (hot/warm/cold), and outcome (faq_resolved/escalated/booked/unanswered).

Knowledge base:
{knowledge_base}`;

export async function chatCompletion(
  conversationId: string,
  messages: { role: string; content: string }[]
): Promise<string> {
  const kb = await queryAll("SELECT question, answer FROM knowledge_base");
  const kbText = kb
    .map((k) => `Q: ${k.question}\nA: ${k.answer}`)
    .join("\n\n");

  const systemMsg = SYSTEM_PROMPT.replace("{knowledge_base}", kbText);

  const client = getClient();
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemMsg },
      ...messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    ],
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content || "I'm sorry, I couldn't process that.";
}

export async function tagConversation(
  conversationId: string,
  messages: { role: string; content: string }[]
) {
  const transcript = messages
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n");

  const client = getClient();
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `Analyze this conversation and return a JSON object with:
- topic: the main topic discussed
- intent: "faq" (answered from knowledge base), "qualify" (collected contact info), "escalate" (needed human handoff)
- lead_quality: "hot" (ready to buy), "warm" (interested), "cold" (just browsing)
- outcome: "faq_resolved" (answered), "escalated" (handed off), "booked" (scheduled something), "unanswered" (couldn't answer)

Return ONLY valid JSON, no other text.`,
      },
      { role: "user", content: transcript },
    ],
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content || "{}";
  const tag = JSON.parse(content);

  await execute(
    `INSERT INTO conversation_tags (conversation_id, topic, intent, lead_quality, outcome)
     VALUES (?, ?, ?, ?, ?)`,
    [conversationId, tag.topic, tag.intent, tag.lead_quality, tag.outcome]
  );

  return tag;
}

export async function generateInsight(
  question: string
): Promise<string> {
  const totalEnquiries = (await queryOne("SELECT COUNT(*) as c FROM conversations"))?.c as number || 0;
  const topicCounts = await queryAll(
    `SELECT topic, COUNT(*) as count FROM conversation_tags GROUP BY topic ORDER BY count DESC LIMIT 10`
  );
  const outcomeCounts = await queryAll(
    `SELECT outcome, COUNT(*) as count FROM conversation_tags GROUP BY outcome`
  );
  const leadQuality = await queryAll(
    `SELECT lead_quality, COUNT(*) as count FROM conversation_tags GROUP BY lead_quality`
  );
  const unanswered = await queryAll(
    `SELECT topic, COUNT(*) as count FROM conversation_tags WHERE outcome = 'unanswered' GROUP BY topic ORDER BY count DESC LIMIT 5`
  );
  const hourly = await queryAll(
    `SELECT strftime('%H', created_at) as hour, COUNT(*) as count FROM conversations GROUP BY hour ORDER BY hour`
  );

  const dataSummary = JSON.stringify({
    total_enquiries: totalEnquiries,
    topics: topicCounts,
    outcomes: outcomeCounts,
    lead_quality: leadQuality,
    unanswered_topics: unanswered,
    hourly_breakdown: hourly,
  });

  const client = getClient();
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a business analyst. Given aggregated enquiry data, answer the user's question concisely. Data: ${dataSummary}`,
      },
      { role: "user", content: question },
    ],
    temperature: 0.3,
  });

  return response.choices[0]?.message?.content || "No insights available.";
}

export async function generateWeeklySummary(): Promise<string> {
  const now = new Date();
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const weekEnd = now.toISOString().split("T")[0];

  const data = (await queryOne(
    `SELECT
        COUNT(*) as total,
        SUM(CASE WHEN outcome = 'faq_resolved' THEN 1 ELSE 0 END) as resolved,
        SUM(CASE WHEN outcome = 'escalated' THEN 1 ELSE 0 END) as escalated,
        SUM(CASE WHEN outcome = 'unanswered' THEN 1 ELSE 0 END) as unanswered,
        SUM(CASE WHEN lead_quality = 'hot' THEN 1 ELSE 0 END) as hot,
        SUM(CASE WHEN lead_quality = 'warm' THEN 1 ELSE 0 END) as warm
       FROM conversation_tags ct
       JOIN conversations c ON c.id = ct.conversation_id
       WHERE c.created_at >= ?`,
    [weekStart]
  ))!;

  const topUnanswered = await queryAll(
    `SELECT topic, COUNT(*) as count FROM conversation_tags
       WHERE outcome = 'unanswered' AND created_at >= ?
       GROUP BY topic ORDER BY count DESC LIMIT 3`,
    [weekStart]
  );

  const prevWeekStart = new Date(
    now.getTime() - 14 * 24 * 60 * 60 * 1000
  ).toISOString().split("T")[0];
  const prevData = (await queryOne(
    `SELECT COUNT(*) as total FROM conversation_tags ct
       JOIN conversations c ON c.id = ct.conversation_id
       WHERE c.created_at >= ? AND c.created_at < ?`,
    [prevWeekStart, weekStart]
  ))!;

  const trend =
    (prevData.total as number) > 0
      ? Math.round(((data.total as number - (prevData.total as number)) / (prevData.total as number)) * 100)
      : 0;

  const client = getClient();
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a business analyst. Generate a concise weekly insight summary. Data:
- Total enquiries: ${data.total} (${trend >= 0 ? "+" : ""}${trend}% vs prior week)
- Resolved by AI: ${data.resolved}
- Escalated: ${data.escalated}
- Unanswered: ${data.unanswered}
- Hot leads: ${data.hot}
- Warm leads: ${data.warm}
- Top unanswered topics: ${JSON.stringify(topUnanswered)}

Provide actionable recommendations. Keep it under 200 words.`,
      },
      {
        role: "user",
        content: "Generate this week's insight summary.",
      },
    ],
    temperature: 0.5,
  });

  const summary = response.choices[0]?.message?.content || "No summary available.";

  await execute(
    "INSERT INTO weekly_reports (week_start, week_end, summary_json) VALUES (?, ?, ?)",
    [weekStart, weekEnd, JSON.stringify({ summary, trend, total: data.total })]
  );

  return summary;
}