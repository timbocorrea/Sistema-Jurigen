-- Enable the UUID extension
create extension if not exists "uuid-ossp";

-- Table: dossiers
create table dossiers (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text,
  summary text,
  legal_analysis text,
  risk_assessment text,
  facts_timeline jsonb,
  extracted_entities jsonb,
  strategic_links jsonb
);

-- Table: evidence_items
create table evidence_items (
  id uuid default uuid_generate_v4() primary key,
  dossier_id uuid references dossiers(id) on delete cascade not null,
  title text not null,
  description text,
  status text check (status in ('pending', 'collected')),
  importance text check (importance in ('high', 'medium', 'low')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
-- For development simplicity, we allowing public read/write. 
-- IN PRODUCTION: Enable RLS and restrict access to authenticated users.
alter table dossiers enable row level security;
alter table evidence_items enable row level security;

create policy "Allow public access to dossiers"
on dossiers for all
using (true)
with check (true);

create policy "Allow public access to evidence_items"
on evidence_items for all
using (true)
with check (true);
