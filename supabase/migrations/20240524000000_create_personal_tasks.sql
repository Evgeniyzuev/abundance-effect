create table if not exists public.personal_tasks (
    id uuid not null default gen_random_uuid(),
    user_id uuid not null default auth.uid(),
    title text not null,
    description text null,
    type text not null check (type in ('one_time', 'streak', 'daily')),
    status text not null default 'active' check (status in ('active', 'completed', 'canceled')),
    streak_goal integer null,
    streak_current integer null default 0,
    progress_percentage integer null default 0,
    last_completed_at timestamptz null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint personal_tasks_pkey primary key (id),
    constraint personal_tasks_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
);

-- Enable RLS
alter table public.personal_tasks enable row level security;

-- Create policies
create policy "Users can view their own tasks"
    on public.personal_tasks for select
    using (auth.uid() = user_id);

create policy "Users can insert their own tasks"
    on public.personal_tasks for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
    on public.personal_tasks for update
    using (auth.uid() = user_id);

create policy "Users can delete their own tasks"
    on public.personal_tasks for delete
    using (auth.uid() = user_id);

-- Create updated_at trigger
create trigger handle_updated_at before update on public.personal_tasks
    for each row execute procedure moddatetime (updated_at);
