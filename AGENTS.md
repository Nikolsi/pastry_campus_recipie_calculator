# Agent Guide

This repository contains a mobile-first recipe calculator for pastry schools.
The current product focus is ice cream formulation, with room for future
calculators such as chocolate.

## Stack

- React 19, TypeScript, Vite
- Tailwind CSS with shadcn-style UI primitives in `src/components/ui`
- Domain calculation code in `src/calc`
- Domain types in `src/domain`
- Static seed ingredient data in `src/data/ingredients.json`

## Commands

- `npm run build` checks TypeScript and builds the Vite app.
- `npm run lint` runs ESLint.
- `npm test` compiles focused unit tests and runs them with Node's built-in
  test runner.
- `npm run dev` starts the local Vite dev server.
- `npm run preview` serves a built bundle.

## Current Architecture

- `src/App.tsx` is still the main feature container. It owns recipe state,
  invokes calculation/validation, and renders the full screen.
- `src/calc/formulator.ts` contains pure recipe math. Keep this file UI-free.
- `src/calc/ranges.ts` contains recipe validation ranges. Keep validation
  deterministic and testable.
- `src/data/ingredients.ts` loads static JSON data and should be replaced by a
  repository/API layer when the database is introduced.

## Working Rules

- Preserve user changes in the working tree. Check `git status --short` before
  broad edits.
- Prefer small domain-first changes before UI changes.
- Keep calculation logic independent from React and backend clients.
- Do not use ingredient names as stable recipe references in new code. Use
  ingredient IDs or database UUIDs.
- Before adding backend state, document schema/policy changes in `docs/DB_SCHEMA.md`.
- Before adding Telegram-specific behavior, keep a regular web/PWA fallback.

## Verification

Run `npm test`, `npm run build`, and `npm run lint` after code changes. When
calculator math changes, add or update focused tests under `tests/`.
