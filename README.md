# ConversiQ

AI-powered enquiry capture, dashboard, and insight platform.

## Features

- **AI Chat Widget** — Embeddable widget that answers FAQs, qualifies leads, and escalates to humans
- **Smart Tagging** — Every conversation auto-tagged with topic, intent, lead quality, and outcome
- **BI Dashboard** — 8 tiles: enquiries over time, top topics, lead quality, outcomes, peak hours, unanswered questions, and more
- **Ask Your Data** — Natural language queries on aggregated enquiry data
- **Weekly Insights** — Auto-generated summaries with actionable recommendations

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Turso (SQLite-compatible edge DB) — local file fallback
- **Charts**: Recharts
- **AI**: OpenAI GPT-4o-mini

## Getting Started

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment file and add your OpenAI API key:
   ```bash
   cp .env.example .env
   # Edit .env and add your OPENAI_API_KEY
   ```

3. Seed the knowledge base:
   ```bash
   curl http://localhost:3000/api/seed
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Deploy on Vercel

1. Push to GitHub
2. Import into Vercel
3. Add these environment variables in Vercel dashboard:
   - `OPENAI_API_KEY` — Your OpenAI API key
   - `TURSO_DATABASE_URL` — Your Turso database URL (create free at https://turso.tech)
   - `TURSO_AUTH_TOKEN` — Your Turso auth token
4. Deploy

> **Note**: For local development, the app uses a local SQLite file. On Vercel, set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` to use Turso's edge database.
