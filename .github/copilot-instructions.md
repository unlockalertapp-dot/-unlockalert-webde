---
description: UnlockAlert Web — Next.js 16 marketing & leaderboard site with Firebase Firestore and Tailwind CSS 4. Use when: working on the web app, building React components, integrating Firebase, styling pages.
---

# UnlockAlert Web — Copilot Instructions

## Project Overview

**UnlockAlert Web** is a Next.js 16 marketing & leaderboard site featuring:
- **Marketing homepage** with hero, challenges, founder membership, and live leaderboard
- **Real-time leaderboard**: Firebase Firestore powers live updates (top 10 users by today/total unlocks)
- **Dual-language UI**: French/English with browser language detection
- **React 19 with React Compiler** enabled for automatic optimization
- **Tailwind CSS 4** for utility-first styling
- **Firebase Authentication & Firestore** for backend data

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Marketing homepage + leaderboard
│   └── globals.css         # Global styles (Tailwind reset)
├── lib/
│   └── firebase.ts         # Firebase config & Firestore instance (db)
public/                     # Static assets
```

**Key Files:**
- [src/app/page.tsx](../src/app/page.tsx) — Main page with hero, heroes section, live leaderboard, founder CTA
- [src/lib/firebase.ts](../src/lib/firebase.ts) — Firebase initialization and exports

## Tech Stack

| Layer | Tech | Version |
|-------|------|---------|
| Framework | Next.js | 16.2.2 |
| React | React | 19.2.4 |
| Language | TypeScript | ^5.0 |
| Styling | Tailwind CSS | ^4.0 |
| Backend | Firebase | ^12.11.0 |
| Linting | ESLint | ^9.0 |
| Optimization | React Compiler | enabled |

## Development Commands

```bash
# Start dev server (localhost:3000)
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint
```

## Code Conventions & Patterns

### Page Structure
- **Inline styles**: All styling uses inline `style={{}}` objects with CSS-in-JS. No separate CSS files for page components.
- **Constants**: Color palette defined at module level (PURPLE, ORANGE, BG, CARD, BORDER)
- **Gradient**: Reusable linear-gradient computed at top level and applied via inline `background`

### React Patterns
- **"use client"** directive at top of page for client-side features (hooks, event handlers, browser APIs)
- **useState + useEffect** for state management—no external state library
- **Multiple effects**: One for language detection, one for leaderboard subscription
- **Firebase listeners**: Return unsubscribe function from useEffect to clean up on unmount

### i18n (Internationalization)
- **Translation object** at module top as `const t = { fr: {...}, en: {...} }`
- **Language detection**: `navigator.language.startsWith('fr')` in useEffect at mount
- **Access translations**: Use `const tx = t[lang]` then `tx.key_name` throughout component
- **Language switcher**: Buttons toggle lang state → entire UI re-renders

### Firebase Patterns
- **Firestore setup**: `db` exported from [src/lib/firebase.ts](../src/lib/firebase.ts) for "use client" components
- **Real-time listeners**: Use `onSnapshot(query, callback)` to subscribe to Firestore updates
- **Queries**: Construct with `collection()`, `query()`, `orderBy()`, `limit()` from 'firebase/firestore'
- **Data mapping**: `snap.docs.map(d => ({...d.data()}))` for typed objects
- **Environment variables**: Firebase config via `process.env.NEXT_PUBLIC_*` (public keys only)

### Styling Conventions
- **Inline styles only**—no external CSS modules in components
- **Reusable gradients**: Define as `const grad = `linear-gradient(...)`
- **CSS-in-JS**: All `background`, `border`, `color` properties use inline objects
- **Tailwind utilities**: Defined in [src/app/globals.css](../src/app/globals.css) but component styles are inline
- **Responsive design**: Use `clamp()` for fluid font sizes, CSS Grid for layouts

### Component Guidelines
- **No component extraction**: Currently one monolithic page component; consider extracting when > 500 lines
- **Event handlers**: Use arrow functions in onClick handlers
- **Accessibility**: Use semantic HTML (`<main>`, `<nav>`, `<section>`, `<footer>`, `<button>`, `<a>`)
- **Loading states**: Show "Chargement..." placeholder while Firestore data loads

## Common Tasks

### Add a Translation
1. Open [src/app/page.tsx](../src/app/page.tsx)
2. Add key to both `t.fr` and `t.en` objects at top
3. Use via `tx.key_name` in component

### Update Leaderboard Logic
1. Firestore query in second `useEffect` hook (lines ~80)
2. Change `orderBy` field or `limit()` to modify ranking
3. Update `snap.docs.map()` if Firestore fields change

### Add a New Section
1. Create `<section>` with `maxWidth: 700, margin: '0 auto'` and padding
2. Use gradient for headers: `background: grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'`
3. Follow color scheme (PURPLE #8B5CF6, ORANGE #F97316, BG #07010F)

### Connect a New Firebase Collection
1. Add collection name to query in useEffect
2. Map returned docs to TypeScript interface (e.g., `type LeaderboardEntry`)
3. Use fetched data in JSX render

## Environment Variables

Create `.env.local` in workspace root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_STRIPE_FOUNDER_URL=https://stripe_checkout_link
```

## Important Context

### Real-time Updates
The leaderboard uses `onSnapshot` listeners—changes in Firestore appear instantly on all connected clients. Subscription is cleaned up on component unmount.

### Heroes System
Two selectable characters with different colors & icons:
- **N'LOCK** (🔷 purple): Relentless Strategist
- **N'LUCK** (🔶 orange): Daring Unpredictable

User's selected hero is stored in Firestore and fetched for leaderboard display.

### Language Persistence
Language is detected from browser on mount but **not persisted**—refreshing resets to browser language. Consider localStorage if you want user preference persistence.

### Stripe Integration
Founder checkout link passed via environment variable. Confirm `NEXT_PUBLIC_STRIPE_FOUNDER_URL` is set before going to production.

### React Compiler
React Compiler is enabled in Next.js config—it automatically optimizes memoization. No need to manually add `React.memo` or `useMemo`.

## Debugging Tips

- **Firestore data not loading?** Check:
  - Firebase config in [src/lib/firebase.ts](../src/lib/firebase.ts) matches project
  - `NEXT_PUBLIC_*` env vars are set and correct
  - Firestore security rules allow reads from public
- **Language not changing?** Language state updates but may require page refresh for initial detection
- **Leaderboard empty?** Ensure Firestore has documents with `todayUnlocks` or `totalUnlocks` fields
- **Styling issues?** All styles are inline—search for the component in [src/app/page.tsx](../src/app/page.tsx) and modify `style={{}}` directly

## Anti-Patterns (Avoid)

- ❌ Adding external CSS files to page components (use inline styles or globals.css)
- ❌ Storing language preference in state only (consider localStorage for persistence)
- ❌ Making Firestore queries without proper indexing for complex filters
- ❌ Hardcoding Stripe URLs in component (use env vars)

## Next Steps / Future Improvements

- Extract repeated sections (Heroes, Leaderboard rows) into reusable components when complexity grows
- Add localStorage for language & user preferences persistence
- Implement user authentication (Firebase Auth)
- Add analytics tracking
- Optimize images with `next/image`
