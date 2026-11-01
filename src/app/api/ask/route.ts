import { NextResponse } from "next/server";
import { generateInsight } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    if (!question?.trim()) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }
    const answer = await generateInsight(question);
    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Ask error:", error);
    return NextResponse.json(
      { error: "Failed to generate insight" },
      { status: 500 }
    );
  }
}