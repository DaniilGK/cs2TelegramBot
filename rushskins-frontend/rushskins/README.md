# RushSkins — Telegram Mini App

CS2 skins marketplace built as a Telegram Mini App.

## Stack
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** with custom design tokens
- **Zustand** for global state
- **Framer Motion** for animations
- **@telegram-apps/sdk** for Telegram integration

## Fonts
- `Barlow Condensed` — display / headings
- `DM Sans` — body text
- `JetBrains Mono` — prices / numbers

## Project structure

```
src/
├── components/
│   ├── layout/       # BottomNav, AppShell
│   ├── market/       # SkinCard, FilterBar, Cart
│   ├── cases/        # CaseCard, CaseSpinner (Sprint 3)
│   ├── profile/      # AvatarBlock, WalletCard
│   └── ui/           # Button, Badge, Sheet, Toast
├── pages/            # HomePage, MarketPage, CasesPage, FriendsPage, ProfilePage
├── store/            # Zustand store (useAppStore)
├── hooks/            # useTelegram, useMarket, useEnergy
├── lib/
│   ├── market.ts     # LIS-SKINS API client + mock data
│   ├── cases.ts      # Case generation algorithm (Sprint 3)
│   └── payments.ts   # Deposit/withdraw via CryptoPay (Sprint 5)
└── assets/
```

## Getting started

```bash
npm install
npm run dev
```

## Environment variables

```env
VITE_LIS_API_KEY=your_lis_skins_key
VITE_STEAM_API_KEY=your_steam_key
VITE_BOT_TOKEN=your_telegram_bot_token
```

## Telegram setup

1. Create bot via @BotFather
2. Enable Mini Apps: `/newapp`
3. Set Web App URL to your deployed frontend URL
4. The app auto-calls `tg.expand()` and sets dark header/bg colors

## Roadmap by sprint

| Sprint | Focus |
|--------|-------|
| 1-2 | Project setup, design system, routing shell |
| 3-4 | Home page (tapper + daily check-in), Profile + Steam Auth |
| 5-6 | Marketplace + LIS-SKINS API integration |
| 7-8 | Case system (custom case algorithm) |
| 9-10 | Payments (CryptoPay / fiat gateway) |
| 11 | Friends + referral system |
| 12 | QA, performance, anti-fraud |
