# CLAUDE.md — Habitus

RPG-gamified habit tracker mobile app for ENGF0034 coursework.

## Stack

- **Framework:** Expo (managed, SDK 55) + React Native 0.83 + TypeScript (strict)
- **Routing:** Expo Router (file-based, root in `src/app/`)
- **State:** Zustand v5 (4 stores: auth, profile, quest, boss)
- **Backend:** Supabase (Postgres + Edge Functions + Auth + RLS)
- **Styling:** React Native StyleSheet (no CSS, no styled-components)

## Quick Commands

```bash
npm start              # Expo dev server (scan QR)
npm run android        # Build + run on Android
npm run ios            # Build + run on iOS simulator
npm test               # Jest tests
npx tsc --noEmit       # Type-check (may need direct path on Node 25)
```

> **Node 25 caveat:** `npx expo` and `npx tsc` binaries may fail. Use direct paths from `node_modules/.bin/` if needed.

## Project Structure

```
src/
├── app/                  # Expo Router screens
│   ├── (auth)/           # Login, register, class-select (unprotected)
│   └── (tabs)/           # Quests, character, boss, settings (protected)
├── components/           # UI components by feature
│   ├── avatar/           # SVG avatar renderer + state machine
│   ├── boss/             # Arena, health bar, damage breakdown
│   ├── character/        # Level, stat radar, debuffs, loot
│   ├── quests/           # Quest card, list, campaign progress
│   └── common/           # Loading screen, shared UI
├── stores/               # Zustand stores (auth, profile, quest, boss)
├── types/                # game.ts, database.ts, api.ts
├── lib/                  # Business logic (XP calc, debuff engine, constants)
└── utils/                # Formatters, haptic feedback wrappers
supabase/
├── migrations/           # 10 SQL migrations (00001–00010)
├── functions/            # 4 Deno Edge Functions
└── seed.sql              # Initial data seed
plugins/
└── withAndroidFixes.js   # JDK 17 + async-storage Gradle fix
```

## Key Conventions

### Imports & Naming

- **Absolute imports:** `@/` → `src/` (configured in tsconfig + babel)
- **Database:** `snake_case` (user_id, quest_def_id)
- **TypeScript:** `camelCase` (userId, questDefId)
- **Components:** `PascalCase` files and exports
- **Stores:** `useXxxStore` hooks

### Supabase Type Workarounds

- Database types in `src/types/database.ts` use `Relationships` arrays (Supabase v2 generics)
- Use `as RowType` casts when reading query results
- Use `as any` for insert calls to bypass strict generic constraints
- Edge functions are Deno — excluded from `tsconfig.json`

### State Management

- One Zustand store per domain
- Components subscribe via hooks directly (`useAuthStore()`, `useProfileStore()`, etc.)
- Stores call Supabase directly (no separate API layer)
- Pattern: component → store hook → Supabase query/edge function → state update

### Mock Development

- `src/lib/supabase.mock.ts` provides a full in-memory Supabase client (~800 lines)
- `src/lib/supabase.ts` switches between real and mock client
- To use real Supabase: uncomment real client block, comment mock import, set env vars

## Game Mechanics Reference

### Player Classes & Multipliers

| Class   | 2x Category    |
|---------|----------------|
| Warrior | exercise       |
| Monk    | mental_health, sleep |
| Bard    | recreation     |

### Attributes

| Category       | Primary | Secondary |
|----------------|---------|-----------|
| exercise       | str     | con       |
| diet           | con     | str       |
| sleep          | sta     | con       |
| mental_health  | wis     | —         |
| recreation     | cha     | wis       |

- Secondary gains 50% of primary XP
- Stats: +ceil(xp/10) primary, +ceil(xp×0.5/10) secondary
- Leveling: `xp_required = 100 × level^1.5`

### Debuffs (5 types)

- **exhausted:** 6+ poor sleep days → halves exercise XP
- **malnourished:** 3+ zero diet days → halves ALL XP
- **stressed:** 3+ zero mental health → halves recreation XP
- **isolated:** 3+ zero recreation → halves mental health XP
- **stagnant:** 3+ zero exercise → halves diet XP

### Loot

- Streak-based: awarded at 3, 7, 14, 21, 30, 60 completed quests
- Boss-based: trophy if boss defeated
- Rarities: common < uncommon < rare < epic < legendary
- Slots: helmet, armor, weapon, aura, title, pet

## Edge Functions

| Function           | Trigger     | Purpose                                         |
|--------------------|-------------|--------------------------------------------------|
| `complete-quest`   | On complete | XP calc, stat updates, campaign progress, loot   |
| `seed-daily-quests`| Daily cron  | Insert quest definitions into daily_journal       |
| `evaluate-boss`    | Weekly/manual | Aggregate damage, check defeat, award trophy    |
| `apply-debuffs`    | Weekly cron | Check conditions, insert debuffs with expiry      |

## Design Tokens

```
Background: #FAF6F0 (cream)    Primary: #B8972F (gold)
Surface:    #FFFDF7 (off-white) Secondary: #6B5B3E (brown)
Success:    #1B9E5A (green)    Danger: #C0392B (red)
Warrior:    #C0392B            Monk: #7D3C98      Bard: #C9A834
```

Spacing: 4 / 8 / 16 / 24 / 32 / 48 — Font sizes: 10 / 12 / 14 / 16 / 20 / 24 / 32

## Environment Variables

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

`EXPO_PUBLIC_*` prefix exposes vars to client code.

## Adding Features

1. Define types in `src/types/game.ts` or `database.ts`
2. Add SQL migration in `supabase/migrations/`
3. Add/extend Zustand store action
4. Build components in `src/components/[feature]/`
5. Add route in `src/app/`
6. Add edge function in `supabase/functions/` for complex server logic
7. Mirror logic in `supabase.mock.ts` for offline dev
8. Use `@/` imports, follow naming conventions
