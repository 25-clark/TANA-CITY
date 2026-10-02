-- À exécuter dans Supabase → SQL Editor → Run
-- Crée la 3e table : inscriptions (registre joueurs/enfants + paiements)

create table if not exists inscriptions (
  id bigint generated always as identity primary key,
  first_name text not null,
  last_name text not null,
  birth_date date,
  gender text,
  category text,
  parent_name text,
  parent_phone text,
  parent_email text,
  address text,
  medical_notes text,
  photo_url text,
  payment_status text default 'unpaid',
  payment_amount numeric default 0,
  payment_method text,
  payment_ref text,
  payment_date date,
  status text default 'pending',
  notes text,
  created_at timestamptz default now()
);

alter table inscriptions enable row level security;

drop policy if exists "public_insert_inscriptions" on inscriptions;
create policy "public_insert_inscriptions"
  on inscriptions for insert with check (true);

drop policy if exists "public_read_inscriptions" on inscriptions;
create policy "public_read_inscriptions"
  on inscriptions for select using (true);

drop policy if exists "auth_update_inscriptions" on inscriptions;
create policy "auth_update_inscriptions"
  on inscriptions for update using (auth.role() = 'authenticated');

drop policy if exists "auth_delete_inscriptions" on inscriptions;
create policy "auth_delete_inscriptions"
  on inscriptions for delete using (auth.role() = 'authenticated');
