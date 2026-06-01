# Database Schema Draft

This draft assumes Postgres and Supabase-style auth/RLS.

Before turning this draft into migrations, review
`docs/INGREDIENTS_TODO.md`. The current frontend ingredient fields are shaped by
the static ice cream calculator dataset; not every nutrient or calculator field
should necessarily become a required database column.

Also review `docs/CALCULATOR_PLATFORM.md`. The schema should support multiple
culinary calculator modules, metric definitions, optional ingredient profiles,
costing, and report/export snapshots.

## Platform Direction

Avoid a single wide `ingredients` table with every possible technical field.
Prefer:

- `ingredients` for identity, ownership, translations, and metadata.
- `ingredient_profiles` for calculator-specific or nutrition/cost profiles.
- `calculator_modules` for ice cream, chocolate bars, molded chocolates,
  praline fillings, dough, pizza, sourdough, and future calculators.
- `metric_definitions` for values that calculators can compute or validate.
- `validation_rules` tied to recipe type and metric.
- `calculation_snapshots` for versioned results used by reports/exports.

Long term, RecipeHub features may add recipe versions, recipe sources,
collections/books, import jobs, access policies, and export artifacts. See
`docs/RECIPE_HUB_VISION.md`; these should be separate from calculator-specific
logic.

Telegram-led school operations may add funnels, course products, cohorts,
announcements, live events, and cohort chat access. These should be separate
from calculator math and should grant access through entitlements rather than
hard-coded frontend flags.

The frontend currently exposes an adapter from static ice cream ingredients to
core + profile records in `src/domain/ingredientProfiles.ts`. Use that as the
starting point for database seed scripts.

## Core Tables

```sql
create table schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  school_id uuid references schools(id),
  telegram_id bigint unique,
  role text not null check (role in ('admin', 'teacher', 'student')),
  display_name text,
  locale text not null default 'ru',
  created_at timestamptz not null default now()
);

create table ingredients (
  id uuid primary key default gen_random_uuid(),
  legacy_id integer unique,
  slug text unique not null,
  name text not null,
  name_ru text,
  name_es text,
  category text,
  scope text not null default 'system' check (scope in ('system', 'school', 'user')),
  school_id uuid references schools(id),
  created_by uuid references auth.users(id),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table calculator_modules (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  title text not null,
  status text not null default 'draft'
    check (status in ('draft', 'active', 'archived')),
  created_at timestamptz not null default now()
);

create table ingredient_profiles (
  id uuid primary key default gen_random_uuid(),
  ingredient_id uuid not null references ingredients(id) on delete cascade,
  profile_type text not null,
  values jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (ingredient_id, profile_type)
);

create table recipe_types (
  id uuid primary key default gen_random_uuid(),
  calculator_module_id uuid references calculator_modules(id),
  code text unique not null,
  title text not null,
  created_at timestamptz not null default now()
);

create table metric_definitions (
  id uuid primary key default gen_random_uuid(),
  calculator_module_id uuid references calculator_modules(id),
  code text not null,
  label text not null,
  unit text,
  value_type text not null default 'number'
    check (value_type in ('number', 'percent', 'currency', 'text')),
  sort_order integer not null default 0,
  unique (calculator_module_id, code)
);

create table validation_rules (
  id uuid primary key default gen_random_uuid(),
  recipe_type_id uuid not null references recipe_types(id) on delete cascade,
  metric_definition_id uuid references metric_definitions(id),
  metric_code text not null,
  rule_type text not null check (rule_type in ('range', 'max', 'target')),
  min_value numeric,
  max_value numeric,
  target_value numeric,
  tolerance numeric,
  sort_order integer not null default 0,
  unique (recipe_type_id, metric_code)
);

create table recipes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  school_id uuid references schools(id),
  recipe_type_id uuid not null references recipe_types(id),
  title text not null,
  target_grams numeric not null default 1000,
  visibility text not null default 'private'
    check (visibility in ('private', 'school', 'public')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table recipe_items (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references recipes(id) on delete cascade,
  ingredient_id uuid not null references ingredients(id),
  grams numeric not null default 0,
  sort_order integer not null default 0
);

create table calculation_snapshots (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references recipes(id) on delete cascade,
  formula_version text not null,
  calculator_module_code text not null,
  totals jsonb not null,
  validation jsonb not null,
  created_at timestamptz not null default now()
);

create table ingredient_price_entries (
  id uuid primary key default gen_random_uuid(),
  ingredient_id uuid not null references ingredients(id) on delete cascade,
  school_id uuid references schools(id),
  currency text not null default 'EUR',
  price numeric not null,
  package_grams numeric,
  valid_from date,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
```

## Education, Funnel, And Access Tables

These tables are not required for the first ingredient migration, but they
document the likely direction for Telegram-led sales and school workflows.

```sql
create table courses (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references schools(id),
  slug text unique not null,
  title text not null,
  status text not null default 'draft'
    check (status in ('draft', 'active', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references schools(id),
  course_id uuid references courses(id),
  code text unique not null,
  title text not null,
  product_type text not null
    check (product_type in ('course', 'calculator_addon', 'export_pack', 'recipe_pack', 'consultation')),
  status text not null default 'draft'
    check (status in ('draft', 'active', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table lead_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references auth.users(id),
  telegram_id bigint,
  source text,
  campaign text,
  start_payload text,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table purchases (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references products(id),
  provider text not null
    check (provider in ('manual', 'website', 'telegram_stars')),
  provider_payment_id text,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'refunded', 'cancelled')),
  amount numeric,
  currency text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table entitlements (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid references products(id),
  course_id uuid references courses(id),
  code text not null,
  source text not null default 'manual'
    check (source in ('manual', 'purchase', 'school_grant', 'cohort_enrollment')),
  starts_at timestamptz,
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (profile_id, code)
);

create table course_cohorts (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  title text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  curator_profile_id uuid references auth.users(id),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table cohort_enrollments (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references course_cohorts(id) on delete cascade,
  profile_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'active'
    check (status in ('active', 'paused', 'completed', 'cancelled')),
  purchase_id uuid references purchases(id),
  created_at timestamptz not null default now(),
  unique (cohort_id, profile_id)
);

create table cohort_chats (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references course_cohorts(id) on delete cascade,
  telegram_chat_id bigint not null,
  chat_type text not null
    check (chat_type in ('group', 'supergroup', 'channel')),
  purpose text not null default 'community'
    check (purpose in ('community', 'curator_support', 'announcements', 'live_stream')),
  invite_link text,
  requires_join_request boolean not null default true,
  created_at timestamptz not null default now()
);

create table live_events (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id),
  cohort_id uuid references course_cohorts(id),
  title text not null,
  starts_at timestamptz not null,
  join_url text,
  telegram_chat_id bigint,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table announcements (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references schools(id),
  course_id uuid references courses(id),
  cohort_id uuid references course_cohorts(id),
  title text not null,
  body text not null,
  status text not null default 'draft'
    check (status in ('draft', 'scheduled', 'sent', 'cancelled')),
  scheduled_at timestamptz,
  sent_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
```

## RLS Policy Intent

- System ingredients are readable by authenticated users.
- School ingredients are readable by members of that school.
- User ingredients are readable and writable by their creator.
- Recipes are writable by their owner.
- School-visible recipes are readable by school members.
- Teachers can read assigned student recipes only within their school.
- Course/cohort data is readable by enrolled students and school staff.
- Purchases are readable by the buyer and school admins.
- Entitlements are readable by the owner and by server-side access checks.
- Lead attribution and payment metadata should not be exposed to students unless
  explicitly needed in the UI.
- Cohort chat invite links should be returned only to enrolled students or
  admins, preferably through backend functions that can verify current access.

Policies should be implemented before any client write flow is shipped.
