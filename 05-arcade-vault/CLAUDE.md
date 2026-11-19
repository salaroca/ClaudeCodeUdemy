# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server (Turbopack)
npm run build    # production build
npm run lint     # ESLint
```

No test suite configured yet.

## Stack

- **Next.js 16** (App Router) — breaking changes vs prior versions; check `node_modules/next/dist/docs/` before writing Next-specific code
- **React 19**
- **TypeScript**
- **Tailwind CSS v4** — imported via `@import "tailwindcss"` and configured through `@theme` blocks in CSS, not `tailwind.config.js`
- **Turbopack** in dev (CSS processed via `@tailwindcss/turbopack`)

## Architecture

App Router structure under `app/`. Root layout at `app/layout.tsx` uses `LayoutProps<"/">` (Next 16 typed layout props). Fonts loaded via `next/font/google`.

`next.config.ts` enables `agentFeedback`, `cacheComponents`, and `partialPrefetching` experimentals.

## Workflow

This project uses **spec-driven design** via `/spec` and `/spec-impl` skills (from `Klerith/fernando-skills`). Features should be specced before implementation.
