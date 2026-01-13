-- Create table for storing user notification preferences
create table public.notification_preferences (
  id uuid default gen_random_uuid() primary key,
  user_identifier text unique not null, -- Could be email or a unique device ID
  email text not null,
  enabled boolean default true,
  notification_thresholds jsonb default '{"7": true, "2": true, "1": true, "0": true}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for faster lookups
create index notification_preferences_user_identifier_idx on public.notification_preferences(user_identifier);

-- Enable Row Level Security (RLS)
alter table public.notification_preferences enable row level security;

-- Allow anyone to read/write their own preferences (using user_identifier)
-- Note: Since this is a local-first app without auth, we allow public access
-- In production, you'd want proper authentication
create policy "Allow public read access" on public.notification_preferences
  for select using (true);

create policy "Allow public insert access" on public.notification_preferences
  for insert with check (true);

create policy "Allow public update access" on public.notification_preferences
  for update using (true);

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at
create trigger set_updated_at
  before update on public.notification_preferences
  for each row
  execute procedure public.handle_updated_at();
