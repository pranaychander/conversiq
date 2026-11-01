import { NextResponse } from "next/server";
import { queryOne, queryAll, execute } from "@/lib/db";
import { chatCompletion, tagConversation } from "@/lib/ai";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { conversationId, message, messages, contact, close } =
      await req.json();

    // Create conversation if new
    const existing = await queryOne(
      "SELECT id FROM conversations WHERE id = ?",
      [conversationId]
    );

    if (!existing) {
      await execute(
        "INSERT INTO conversations (id, status) VALUES (?, 'active')",
        [conversationId]
      );
    }

    // Save user message
    if (message?.trim()) {
      await execute(
        "INSERT INTO messages (conversation_id, role, content) VALUES (?, 'user', ?)",
        [conversationId, message]
      );
    }

    // Update contact info
    if (contact) {
      await execute(
        "UPDATE conversations SET visitor_name = ?, email = ?, phone = ?, updated_at = datetime('now') WHERE id = ?",
        [contact.name, contact.email, contact.phone || "", conversationId]
      );
    }

    // Close and tag conversation
    if (close) {
      await execute(
        "UPDATE conversations SET status = 'closed', updated_at = datetime('now') WHERE id = ?",
        [conversationId]
      );

      const allMessages = await queryAll(
        "SELECT role, content FROM messages WHERE conversation_id = ? ORDER BY id",
        [conversationId]
      );

      // Tag asynchronously
      tagConversation(conversationId, allMessages as { role: string; content: string }[]).catch(console.error);

      return NextResponse.json({ ok: true });
    }

    // Get AI reply
    const reply = await chatCompletion(conversationId, messages || []);

    // Save assistant message
    await execute(
      "INSERT INTO messages (conversation_id, role, content) VALUES (?, 'assistant', ?)",
      [conversationId, reply]
    );

    const needsContact =
      reply.toLowerCase().includes("email") ||
      reply.toLowerCase().includes("contact") ||
      reply.toLowerCase().includes("name");

    return NextResponse.json({ reply, needsContact });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { reply: "Sorry, something went wrong." },
      { status: 500 }
    );
  }
}