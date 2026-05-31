# Database Schema Draft

This draft assumes Postgres and Supabase-style auth/RLS.

Before turning this draft into migrations, review
`docs/INGREDIENTS_TODO.md`. The current frontend ingredient fields are shaped by
the static ice cream calculator dataset; not every nutrient or calculator field
should necessarily become a required database column.

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
  sugars numeric not null default 0,
  fat numeric not null default 0,
  protein numeric not null default 0,
  lactose numeric not null default 0,
  solids numeric not null default 0,
  water numeric not null default 0,
  pod numeric not null default 0,
  pac numeric not null default 0,
  cocoa_nf numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table recipe_types (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  title text not null,
  created_at timestamptz not null default now()
);

create table validation_rules (
  id uuid primary key default gen_random_uuid(),
  recipe_type_id uuid not null references recipe_types(id) on delete cascade,
  metric text not null,
  rule_type text not null check (rule_type in ('range', 'max', 'target')),
  min_value numeric,
  max_value numeric,
  target_value numeric,
  tolerance numeric,
  sort_order integer not null default 0,
  unique (recipe_type_id, metric)
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
  totals jsonb not null,
  validation jsonb not null,
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
