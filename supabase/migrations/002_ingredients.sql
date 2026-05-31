-- Core ingredient identity
create table public.ingredients (
  id          uuid primary key default gen_random_uuid(),
  legacy_id   integer unique,
  name        text not null,
  name_ru     text,
  category    text,
  scope       text not null default 'system'
                check (scope in ('system', 'school', 'user')),
  created_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.ingredients enable row level security;

-- System ingredients are readable by everyone including anon
create policy "system ingredients are public"
  on public.ingredients for select
  using (scope = 'system');

-- User ingredients: only visible to their creator
create policy "user ingredients readable by creator"
  on public.ingredients for select
  using (scope = 'user' and auth.uid() = created_by);

-- Authenticated users can create their own ingredients
create policy "users can create own ingredients"
  on public.ingredients for insert
  with check (scope = 'user' and auth.uid() = created_by);

create policy "users can update own ingredients"
  on public.ingredients for update
  using (scope = 'user' and auth.uid() = created_by);

create policy "users can delete own ingredients"
  on public.ingredients for delete
  using (scope = 'user' and auth.uid() = created_by);

-- Calculator-specific profiles (ice_cream, nutrition, etc.)
create table public.ingredient_profiles (
  id             uuid primary key default gen_random_uuid(),
  ingredient_id  uuid not null references public.ingredients(id) on delete cascade,
  profile_type   text not null
                   check (profile_type in ('ice_cream', 'nutrition', 'cost', 'dough', 'chocolate')),
  values         jsonb not null default '{}'::jsonb,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (ingredient_id, profile_type)
);

alter table public.ingredient_profiles enable row level security;

-- Profiles follow the visibility of their parent ingredient
create policy "profiles follow ingredient visibility"
  on public.ingredient_profiles for select
  using (
    exists (
      select 1 from public.ingredients i
      where i.id = ingredient_id
        and (
          i.scope = 'system'
          or (i.scope = 'user' and auth.uid() = i.created_by)
        )
    )
  );

create policy "users can insert own ingredient profiles"
  on public.ingredient_profiles for insert
  with check (
    exists (
      select 1 from public.ingredients i
      where i.id = ingredient_id
        and i.scope = 'user'
        and auth.uid() = i.created_by
    )
  );

create policy "users can update own ingredient profiles"
  on public.ingredient_profiles for update
  using (
    exists (
      select 1 from public.ingredients i
      where i.id = ingredient_id
        and i.scope = 'user'
        and auth.uid() = i.created_by
    )
  );

create policy "users can delete own ingredient profiles"
  on public.ingredient_profiles for delete
  using (
    exists (
      select 1 from public.ingredients i
      where i.id = ingredient_id
        and i.scope = 'user'
        and auth.uid() = i.created_by
    )
  );

-- Flat denormalised view for the ice cream calculator
-- security_invoker=true means RLS from underlying tables is applied
create or replace view public.ice_cream_ingredients
  with (security_invoker = true)
as
  select
    i.id,
    i.legacy_id,
    i.name,
    i.name_ru,
    i.category,
    i.scope,
    i.created_by,
    (ip.values ->> 'fat')::numeric      as fat,
    (ip.values ->> 'lactose')::numeric  as lactose,
    (ip.values ->> 'protein')::numeric  as protein,
    (ip.values ->> 'solids')::numeric   as solids,
    (ip.values ->> 'sugars')::numeric   as sugars,
    (ip.values ->> 'water')::numeric    as water,
    (ip.values ->> 'pod')::numeric      as pod,
    (ip.values ->> 'pac')::numeric      as pac,
    (ip.values ->> 'cocoa_nf')::numeric as cocoa_nf
  from public.ingredients i
  join public.ingredient_profiles ip
    on ip.ingredient_id = i.id
   and ip.profile_type = 'ice_cream';

-- Grant read access to anon + authenticated roles
grant select on public.ingredients        to anon, authenticated;
grant select on public.ingredient_profiles to anon, authenticated;
grant select on public.ice_cream_ingredients to anon, authenticated;
grant insert, update, delete
  on public.ingredients, public.ingredient_profiles
  to authenticated;
