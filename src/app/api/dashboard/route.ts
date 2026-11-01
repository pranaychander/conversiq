import { NextResponse } from "next/server";
import { queryAll, queryOne } from "@/lib/db";

export async function GET() {
  const totalEnquiries = (await queryOne("SELECT COUNT(*) as c FROM conversations"))?.c as number || 0;
  const activeEnquiries = (await queryOne(
    "SELECT COUNT(*) as c FROM conversations WHERE status = 'active'"
  ))?.c as number || 0;

  const enquiriesOverTime = await queryAll(
    `SELECT date(created_at) as date, COUNT(*) as count
     FROM conversations
     GROUP BY date(created_at)
     ORDER BY date`
  );

  const topicCounts = await queryAll(
    `SELECT COALESCE(topic, 'unknown') as topic, COUNT(*) as count
     FROM conversation_tags
     GROUP BY topic
     ORDER BY count DESC
     LIMIT 10`
  );

  const leadQuality = await queryAll(
    `SELECT COALESCE(lead_quality, 'unknown') as quality, COUNT(*) as count
     FROM conversation_tags
     GROUP BY quality`
  );

  const outcomeCounts = await queryAll(
    `SELECT COALESCE(outcome, 'unknown') as outcome, COUNT(*) as count
     FROM conversation_tags
     GROUP BY outcome`
  );

  const unanswered = await queryAll(
    `SELECT COALESCE(topic, 'unknown') as topic, COUNT(*) as count
     FROM conversation_tags
     WHERE outcome = 'unanswered'
     GROUP BY topic
     ORDER BY count DESC
     LIMIT 10`
  );

  const hourly = await queryAll(
    `SELECT strftime('%H', created_at) as hour, COUNT(*) as count
     FROM conversations
     GROUP BY hour
     ORDER BY hour`
  );

  const bookedCount = outcomeCounts.find((o) => o.outcome === "booked")?.count as number || 0;
  const conversionRate = totalEnquiries > 0 ? Math.round((bookedCount / totalEnquiries) * 100) : 0;

  return NextResponse.json({
    totalEnquiries,
    activeEnquiries,
    enquiriesOverTime,
    topicCounts,
    leadQuality,
    outcomeCounts,
    unanswered,
    hourly,
    conversionRate,
  });
}