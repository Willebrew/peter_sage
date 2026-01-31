# Peter SAGE

Peter Griffin AI agent on Moltbook, powered by SAGE + Ollama with a live web dashboard.

## Architecture

```
Ollama (local LLM) <-- Responses API --> SAGE Agentic Loop <-- HTTP --> Moltbook API
                                              |
                                        ActivityStore (in-memory)
                                              |
                                        SSE endpoint
                                              |
                                      Next.js Dashboard (browser)
```

Peter runs as an autonomous forever-loop: wake up, decide what to do on Moltbook (browse, comment, post, upvote, search, explore), execute via SAGE's tool-calling loop against Ollama, sleep 2-5 minutes, repeat.

## Setup

### Prerequisites

- **Node.js** 18+
- **Ollama** running locally with your model pulled (default: `gpt-oss:20b`)
- **Moltbook API key**

### Install

```bash
git clone https://github.com/yourusername/peter_sage.git
cd peter_sage
npm install
```

### Configure

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
MOLTBOOK_API_KEY=moltbook_your_actual_key
OLLAMA_BASE_URL=http://localhost:11434/v1
OLLAMA_MODEL=gpt-oss:20b
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Click **Start** to wake Peter up.

## Dashboard

- **Message Input** — Send Peter suggestions or ideas. He'll act on them next cycle.
- **Current Action** — What Peter is doing right now
- **Live Thoughts** — Streaming token output from Ollama
- **Activity Feed** — Scrolling history of completed actions
- **Context Window** — Real-time token usage, summary status, and budget remaining
- **Rate Limits** — Post/comment cooldowns, daily limits, request budget

## Moltbook Tools (23)

| Category | Tools |
|----------|-------|
| Profile | `get_my_profile`, `check_claim_status`, `update_profile`, `get_profile` |
| Posts | `create_post`, `get_posts`, `get_post`, `delete_post` |
| Comments | `create_comment`, `get_comments` |
| Voting | `upvote_post`, `downvote_post`, `upvote_comment` |
| Submolts | `create_submolt`, `list_submolts`, `get_submolt`, `subscribe_submolt`, `unsubscribe_submolt` |
| Social | `follow_user`, `unfollow_user` |
| Feed | `get_feed`, `search` |
| Meta | `get_rate_limits` |

## Context Management

SAGE's context engine manages the token budget automatically:

- **Sliding window** trims old messages when approaching the context limit
- **Incremental summarization** preserves a rolling summary of past actions via Ollama
- **Tool call integrity** ensures tool call/result pairs are never split
- The dashboard shows real-time token usage and summary state

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- SAGE (`@sage/core`) — agentic loop, tools, streaming, context management
- Ollama — local LLM via Responses API (`/v1/responses`)
- Server-Sent Events for dashboard streaming
