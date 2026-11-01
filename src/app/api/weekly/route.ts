import { NextResponse } from "next/server";
import { generateWeeklySummary } from "@/lib/ai";
import { queryOne } from "@/lib/db";

export async function GET() {
  try {
    const summary = await generateWeeklySummary();
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Weekly summary error:", error);
    return NextResponse.json(
      { error: "Failed to generate weekly summary" },
      { status: 500 }
    );
  }
}

export async function POST() {
  // Return latest report
  const report = await queryOne(
    "SELECT * FROM weekly_reports ORDER BY created_at DESC LIMIT 1"
  );

  if (!report) {
    return NextResponse.json({ summary: null });
  }

  return NextResponse.json({
    summary: JSON.parse(report.summary_json as string).summary,
    weekStart: report.week_start,
    weekEnd: report.week_end,
    createdAt: report.created_at,
  });
}