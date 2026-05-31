# Decision 0001: Backend And Auth Direction

## Status

Proposed

## Context

The prototype currently stores ingredient data in the frontend bundle. The next
product step needs accounts, school roles, saved recipes, editable ingredients,
and Telegram Mini App support.

## Decision

Use Supabase as the MVP backend direction:

- Postgres for recipes, ingredients, schools, and validation rules.
- Supabase Auth for regular app sessions.
- Row-level security for school/user data access.
- Edge Functions for Telegram `initData` validation and account linking.

## Consequences

- We can move quickly without building custom auth infrastructure.
- Database schema and RLS policies become part of the product contract.
- Telegram identity must be exchanged for a normal app session through backend
  validation.
- If requirements later outgrow Supabase, the domain model and repository layer
  should make migration manageable.

