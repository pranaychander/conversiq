import { createClient, type Client } from "@libsql/client";
import path from "path";

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;
const LOCAL_PATH = path.join(process.cwd(), "data", "conversiq.db");

let db: Client;

export async function getDb(): Promise<Client> {
  if (!db) {
    if (TURSO_URL) {
      db = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });
    } else {
      const fs = await import("fs");
      const dir = path.dirname(LOCAL_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      db = createClient({ url: `file:${LOCAL_PATH}` });
    }
    await initSchema(db);
  }
  return db;
}

async function initSchema(db: Client) {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      visitor_name TEXT,
      email TEXT,
      phone TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conversation_id TEXT NOT NULL REFERENCES conversations(id),
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS conversation_tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conversation_id TEXT NOT NULL REFERENCES conversations(id),
      topic TEXT,
      intent TEXT,
      lead_quality TEXT,
      outcome TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS knowledge_base (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      category TEXT,
      keywords TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS weekly_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      week_start TEXT NOT NULL,
      week_end TEXT NOT NULL,
      summary_json TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

/** Execute a query and return all rows as objects */
export async function queryAll(
  sql: string,
  args: any[] = []
): Promise<Record<string, unknown>[]> {
  const client = await getDb();
  const result = await client.execute(sql, args);
  return result.rows.map((row) => {
    const obj: Record<string, unknown> = {};
    result.columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj;
  });
}

/** Execute a query and return the first row */
export async function queryOne(
  sql: string,
  args: any[] = []
): Promise<Record<string, unknown> | null> {
  const rows = await queryAll(sql, args);
  return rows.length > 0 ? rows[0] : null;
}

/** Execute a write query (INSERT/UPDATE/DELETE) */
export async function execute(
  sql: string,
  args: any[] = []
): Promise<void> {
  const client = await getDb();
  await client.execute(sql, args);
}

/** Execute multiple SQL statements */
export async function executeMultiple(sql: string): Promise<void> {
  const client = await getDb();
  await client.executeMultiple(sql);
}