-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  phone text not null,
  terms_accepted boolean default false,
  terms_accepted_at timestamp with time zone,
  email_consent boolean default false,
  email_consent_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- RLS Policies
create policy "Users can view own profile"
  on profiles for select 
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update 
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert 
  with check (auth.uid() = id);

-- Trigger function to auto-create profile
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, phone, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$;

-- Trigger to call function on user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create email_accounts table for future email integration
create table public.email_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  provider text not null,
  email text not null,
  access_token text,
  refresh_token text,
  connected_at timestamp with time zone default now(),
  last_synced_at timestamp with time zone
);

-- Enable RLS on email_accounts
alter table public.email_accounts enable row level security;

-- RLS Policies for email_accounts
create policy "Users can view own email accounts"
  on email_accounts for select 
  using (auth.uid() = user_id);

create policy "Users can insert own email accounts"
  on email_accounts for insert 
  with check (auth.uid() = user_id);

create policy "Users can update own email accounts"
  on email_accounts for update 
  using (auth.uid() = user_id);

create policy "Users can delete own email accounts"
  on email_accounts for delete 
  using (auth.uid() = user_id);