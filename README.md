# ZBD x Vercel Agent Template

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fzbdpay%2Fvercel-template&env=ZBD_API_KEY&envDescription=Get%20your%20ZBD%20API%20key%20at%20developer.zbdpay.com&envLink=https%3A%2F%2Fdeveloper.zbdpay.com&stores=[{"type":"kv"}])

A Next.js starter for building AI agents that can pay and get paid over Lightning, deployed on Vercel.

---

## What's Included

- **Buy-side payments:** `agentFetch` with `zbdPayL402Invoice` for fetching L402-protected APIs and paying automatically
- **Sell-side payments:** `withPaymentRequired` middleware for putting your own API endpoints behind a Lightning paywall
- **AI SDK integration:** Streaming chat endpoint with optional paid context fetched via L402
- **Balance endpoint:** Check your ZBD wallet balance at any time
- **Token caching:** `VercelKVTokenCache` for persisting L402 tokens across serverless invocations

---

## Prerequisites

- Node.js >= 22
- A [Vercel](https://vercel.com) account
- A ZBD API key — get one at [developer.zbdpay.com](https://developer.zbdpay.com)
- An OpenAI API key (optional, only needed for the chat demo)

---

## Setup

1. **Clone and install**

   ```bash
   git clone https://github.com/zbdpay/vercel-template.git
   cd vercel-template
   npm install
   ```

2. **Initialize your ZBD wallet**

   ```bash
   npx @zbdpay/agent-wallet init --key YOUR_ZBD_API_KEY
   ```

   This creates a Lightning address for your agent and prints it out. Save it for the next step.

3. **Add Vercel KV**

   ```bash
   vercel kv add
   ```

   Or create a KV store from the [Vercel dashboard](https://vercel.com/dashboard) and link it to your project. This is used to cache L402 tokens between requests.

4. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Then open `.env.local` and fill in:

   | Variable | Description |
   |---|---|
   | `ZBD_API_KEY` | Your ZBD API key |
   | `ZBD_LIGHTNING_ADDRESS` | The Lightning address from step 2 |
   | `KV_REST_API_URL` | From Vercel KV dashboard |
   | `KV_REST_API_TOKEN` | From Vercel KV dashboard |
   | `OPENAI_API_KEY` | Optional, for the chat endpoint |

5. **Run the dev server**

   ```bash
   npm run dev
   ```

6. **Deploy**

   ```bash
   vercel deploy
   ```

---

## Test It

With the dev server running on `http://localhost:3000`:

```bash
# Check your wallet balance
curl http://localhost:3000/api/balance

# Buy-side: fetch a paid L402 API (agent pays automatically)
curl -X POST http://localhost:3000/api/agent \
  -H "Content-Type: application/json" \
  -d '{"url": "https://some-l402-api.example.com/data"}'

# Sell-side: hit the premium endpoint (returns 402 Payment Required)
curl -v http://localhost:3000/api/premium

# Chat with AI (streaming)
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Hello!"}]}'
```

---

## File Structure

```
vercel-template/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Interactive demo UI
│   └── api/
│       ├── agent/route.ts   # Buy-side: fetch paid APIs via L402
│       ├── balance/route.ts # Wallet balance check
│       ├── chat/route.ts    # AI SDK streaming + optional paid context
│       └── premium/route.ts # Sell-side: L402 paywall (100 sats)
├── lib/
│   ├── kv-token-cache.ts    # VercelKV-backed TokenCache implementation
│   └── zbd.ts               # Configured agentFetch helper
├── .env.example
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## References

- [ZBD Agent Docs](https://docs.zbdpay.com/agents)
- [@zbdpay/agent-fetch on npm](https://www.npmjs.com/package/@zbdpay/agent-fetch)
- [@zbdpay/agent-pay on npm](https://www.npmjs.com/package/@zbdpay/agent-pay)
- [Vercel AI SDK](https://sdk.vercel.ai)
- [Vercel KV](https://vercel.com/docs/storage/vercel-kv)
