import { NextResponse } from "next/server";
import { seedKnowledgeBase } from "@/lib/seed";

export async function GET() {
  await seedKnowledgeBase();
  return NextResponse.json({ ok: true, message: "Knowledge base seeded" });
}