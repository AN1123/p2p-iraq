# P2P Iraq — USDT Exchange Platform

منصة تبادل USDT موثوقة في العراق — P2P + وسيط + تيليجرام

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 (App Router) + Tailwind + shadcn/ui |
| Backend API | Node.js + Express + TypeScript |
| Bot | Telegram Bot (grammY) |
| Database | PostgreSQL (via Prisma ORM) |
| Hosting | Vercel (web) + Render (api/bot) |
| File Storage | Cloudflare R2 (payment proofs) |

## Structure

```
p2p-iraq/
├── apps/
│   ├── web/     → Next.js frontend (landing, pricing, order forms)
│   ├── api/     → REST API + order management + escrow logic
│   └── bot/     → Telegram bot (grammY state machine)
├── packages/
│   └── shared/  → Shared types, constants, utils
└── docs/        → Product design & architecture docs
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Copy env files
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
cp apps/bot/.env.example apps/bot/.env

# Run all services
pnpm dev
```

## Payment Methods
- 🏦 FIB (First Iraqi Bank)
- 📱 ZainCash
- 💳 Qi Card

## Networks Supported
- TRC20 (Recommended — lowest fees)
- ERC20 (High fees — warned)
- BEP20

## Commission
- 1% per trade (charged to initiating party)

---

> ⚠️ Private repository. Not for public distribution.
