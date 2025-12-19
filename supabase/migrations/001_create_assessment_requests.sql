create table if not exists assessment_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  request_key varchar(64) not null unique,
  source varchar(20) not null default 'draftspace',
  word_count integer not null default 0,
  content_excerpt text not null,
  created_at timestamptz default now()
);

alter table assessment_requests enable row level security;

create policy "select own requests" on assessment_requests
  for select using (auth.uid() = user_id);

create policy "insert own requests" on assessment_requests
  for insert with check (auth.uid() = user_id);

create index if not exists idx_assessment_requests_key on assessment_requests(request_key);
create index if not exists idx_assessment_requests_user on assessment_requests(user_id);

