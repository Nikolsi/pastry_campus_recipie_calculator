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

## RLS Policy Intent

- System ingredients are readable by authenticated users.
- School ingredients are readable by members of that school.
- User ingredients are readable and writable by their creator.
- Recipes are writable by their owner.
- School-visible recipes are readable by school members.
- Teachers can read assigned student recipes only within their school.

Policies should be implemented before any client write flow is shipped.
