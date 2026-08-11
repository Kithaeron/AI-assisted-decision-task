create extension if not exists pgcrypto with schema extensions;

create table public.experiment_assignment_cells (
  study_key text not null,
  condition_key text not null check (condition_key in ('pressure', 'no_pressure')),
  counterbalance_list smallint not null check (counterbalance_list between 1 and 6),
  enabled boolean not null default true,
  assigned_count bigint not null default 0 check (assigned_count >= 0),
  updated_at timestamptz not null default now(),
  primary key (study_key, condition_key, counterbalance_list)
);

insert into public.experiment_assignment_cells (study_key, condition_key, counterbalance_list)
select 'ai_assisted_loan_decision', condition_key, counterbalance_list
from unnest(array['pressure', 'no_pressure']) as condition_key
cross join generate_series(1, 6) as counterbalance_list;

create table public.experiment_sessions (
  id uuid primary key default gen_random_uuid(),
  study_key text not null,
  condition_key text not null check (condition_key in ('pressure', 'no_pressure')),
  counterbalance_list smallint not null check (counterbalance_list between 1 and 6),
  stimulus_set_version text not null,
  timing_policy_version text not null,
  api_contract_version text not null,
  client_build_version text,
  consent_version text not null,
  status text not null default 'started' check (status in ('started', 'completed')),
  write_token_hash text not null check (length(write_token_hash) = 64),
  started_at timestamptz not null default now(),
  last_write_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (id, condition_key, counterbalance_list)
);

create table public.experiment_participant_links (
  id bigint generated always as identity primary key,
  experiment_session_id uuid not null unique references public.experiment_sessions(id) on delete cascade,
  study_key text not null,
  identity_hmac text not null,
  prolific_pid text,
  prolific_study_id text,
  prolific_session_id text,
  created_at timestamptz not null default now(),
  unique (study_key, identity_hmac)
);

comment on table public.experiment_participant_links is
  'Isolated identity linkage. Raw Prolific columns remain null when IDENTIFIER_STORAGE_MODE=hmac_only.';

create table public.experiment_trial_responses (
  id bigint generated always as identity primary key,
  experiment_session_id uuid not null references public.experiment_sessions(id) on delete cascade,
  trial_id text not null check (trial_id ~ '^T(00[1-9]|0[1-5][0-9]|060)$'),
  idempotency_key text not null,
  condition_key text not null check (condition_key in ('pressure', 'no_pressure')),
  counterbalance_list smallint not null check (counterbalance_list between 1 and 6),
  stimulus_set_version text not null,
  timing_policy_version text not null,
  report_completed boolean not null,
  timed_out boolean not null,
  client_decision_timestamp timestamptz,
  payload jsonb not null,
  server_received_at timestamptz not null default now(),
  server_updated_at timestamptz not null default now(),
  unique (experiment_session_id, trial_id),
  unique (idempotency_key),
  foreign key (experiment_session_id, condition_key, counterbalance_list)
    references public.experiment_sessions(id, condition_key, counterbalance_list)
);

create table public.experiment_questionnaires (
  id bigint generated always as identity primary key,
  experiment_session_id uuid not null references public.experiment_sessions(id) on delete cascade,
  stage text not null check (stage in ('pre', 'post')),
  idempotency_key text not null,
  condition_key text not null check (condition_key in ('pressure', 'no_pressure')),
  counterbalance_list smallint not null check (counterbalance_list between 1 and 6),
  stimulus_set_version text not null,
  timing_policy_version text not null,
  payload jsonb not null,
  server_received_at timestamptz not null default now(),
  server_updated_at timestamptz not null default now(),
  unique (experiment_session_id, stage),
  unique (idempotency_key),
  foreign key (experiment_session_id, condition_key, counterbalance_list)
    references public.experiment_sessions(id, condition_key, counterbalance_list)
);

create table public.experiment_api_rate_limits (
  experiment_session_id uuid not null references public.experiment_sessions(id) on delete cascade,
  window_started_at timestamptz not null,
  request_count integer not null default 1,
  primary key (experiment_session_id, window_started_at)
);

alter table public.experiment_assignment_cells enable row level security;
alter table public.experiment_sessions enable row level security;
alter table public.experiment_participant_links enable row level security;
alter table public.experiment_trial_responses enable row level security;
alter table public.experiment_questionnaires enable row level security;
alter table public.experiment_api_rate_limits enable row level security;

revoke all on public.experiment_assignment_cells from anon, authenticated;
revoke all on public.experiment_sessions from anon, authenticated;
revoke all on public.experiment_participant_links from anon, authenticated;
revoke all on public.experiment_trial_responses from anon, authenticated;
revoke all on public.experiment_questionnaires from anon, authenticated;
revoke all on public.experiment_api_rate_limits from anon, authenticated;
revoke usage, select on all sequences in schema public from anon, authenticated;
grant select, insert, update, delete on public.experiment_assignment_cells to service_role;
grant select, insert, update, delete on public.experiment_sessions to service_role;
grant select, insert, update, delete on public.experiment_participant_links to service_role;
grant select, insert, update, delete on public.experiment_trial_responses to service_role;
grant select, insert, update, delete on public.experiment_questionnaires to service_role;
grant select, insert, update, delete on public.experiment_api_rate_limits to service_role;
grant usage, select on all sequences in schema public to service_role;

create or replace function public.allocate_experiment_session(
  p_study_key text,
  p_identity_hmac text,
  p_prolific_pid text,
  p_prolific_study_id text,
  p_prolific_session_id text,
  p_stimulus_set_version text,
  p_timing_policy_version text,
  p_api_contract_version text,
  p_client_build_version text,
  p_consent_version text,
  p_write_token_hash text
)
returns table (
  experiment_session_id uuid,
  resumed boolean,
  condition_key text,
  counterbalance_list smallint,
  stimulus_set_version text,
  timing_policy_version text
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  existing_session public.experiment_sessions%rowtype;
  selected_cell public.experiment_assignment_cells%rowtype;
  new_session_id uuid;
begin
  if p_study_key is null or p_identity_hmac is null or p_write_token_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid allocation input';
  end if;

  perform pg_advisory_xact_lock(hashtextextended('experiment-allocation:' || p_study_key, 0));

  select s.* into existing_session
  from public.experiment_participant_links l
  join public.experiment_sessions s on s.id = l.experiment_session_id
  where l.study_key = p_study_key and l.identity_hmac = p_identity_hmac;

  if found then
    if existing_session.stimulus_set_version <> p_stimulus_set_version
      or existing_session.timing_policy_version <> p_timing_policy_version
      or existing_session.api_contract_version <> p_api_contract_version then
      raise exception 'session version mismatch';
    end if;

    update public.experiment_sessions
    set write_token_hash = p_write_token_hash, last_write_at = now()
    where id = existing_session.id;

    return query select existing_session.id, true, existing_session.condition_key,
      existing_session.counterbalance_list, existing_session.stimulus_set_version,
      existing_session.timing_policy_version;
    return;
  end if;

  select * into selected_cell
  from public.experiment_assignment_cells
  where study_key = p_study_key and enabled
  order by assigned_count asc, random()
  limit 1
  for update;

  if not found then
    raise exception 'no enabled assignment cells';
  end if;

  insert into public.experiment_sessions (
    study_key, condition_key, counterbalance_list, stimulus_set_version,
    timing_policy_version, api_contract_version, client_build_version,
    consent_version, write_token_hash
  ) values (
    p_study_key, selected_cell.condition_key, selected_cell.counterbalance_list,
    p_stimulus_set_version, p_timing_policy_version, p_api_contract_version,
    p_client_build_version, p_consent_version, p_write_token_hash
  ) returning id into new_session_id;

  insert into public.experiment_participant_links (
    experiment_session_id, study_key, identity_hmac, prolific_pid,
    prolific_study_id, prolific_session_id
  ) values (
    new_session_id, p_study_key, p_identity_hmac, p_prolific_pid,
    p_prolific_study_id, p_prolific_session_id
  );

  update public.experiment_assignment_cells as cell
  set assigned_count = assigned_count + 1, updated_at = now()
  where cell.study_key = selected_cell.study_key
    and cell.condition_key = selected_cell.condition_key
    and cell.counterbalance_list = selected_cell.counterbalance_list;

  return query select new_session_id, false, selected_cell.condition_key,
    selected_cell.counterbalance_list, p_stimulus_set_version, p_timing_policy_version;
end;
$$;

create or replace function public.check_experiment_rate_limit(
  p_session_id uuid,
  p_limit integer default 180
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  bucket timestamptz := date_trunc('minute', now());
  current_count integer;
begin
  insert into public.experiment_api_rate_limits (experiment_session_id, window_started_at, request_count)
  values (p_session_id, bucket, 1)
  on conflict (experiment_session_id, window_started_at)
  do update set request_count = public.experiment_api_rate_limits.request_count + 1
  returning request_count into current_count;
  return current_count <= p_limit;
end;
$$;

create or replace function public.complete_experiment_session(
  p_session_id uuid,
  p_write_token_hash text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  target_session public.experiment_sessions%rowtype;
  trial_count integer;
  incomplete_report_count integer;
  missing_trial_count integer;
  trial_version_mismatch_count integer;
  questionnaire_version_mismatch_count integer;
  pre_count integer;
  post_count integer;
begin
  select * into target_session
  from public.experiment_sessions
  where id = p_session_id
  for update;

  if not found or target_session.write_token_hash <> p_write_token_hash then
    return jsonb_build_object('ok', false, 'code', 'invalid_session_token');
  end if;

  select
    count(*),
    count(*) filter (where not report_completed),
    count(*) filter (
      where stimulus_set_version <> target_session.stimulus_set_version
        or timing_policy_version <> target_session.timing_policy_version
        or condition_key <> target_session.condition_key
        or counterbalance_list <> target_session.counterbalance_list
    )
  into trial_count, incomplete_report_count, trial_version_mismatch_count
  from public.experiment_trial_responses
  where experiment_session_id = p_session_id;

  select count(*) into missing_trial_count
  from generate_series(1, 60) n
  where not exists (
    select 1 from public.experiment_trial_responses t
    where t.experiment_session_id = p_session_id
      and t.trial_id = 'T' || lpad(n::text, 3, '0')
  );

  select
    count(*) filter (where stage = 'pre'),
    count(*) filter (where stage = 'post'),
    count(*) filter (
      where stimulus_set_version <> target_session.stimulus_set_version
        or timing_policy_version <> target_session.timing_policy_version
        or condition_key <> target_session.condition_key
        or counterbalance_list <> target_session.counterbalance_list
    )
  into pre_count, post_count, questionnaire_version_mismatch_count
  from public.experiment_questionnaires
  where experiment_session_id = p_session_id;

  if trial_count <> 60 or missing_trial_count <> 0 or incomplete_report_count <> 0
    or trial_version_mismatch_count <> 0 or questionnaire_version_mismatch_count <> 0
    or pre_count <> 1 or post_count <> 1 then
    return jsonb_build_object(
      'ok', false,
      'code', 'session_incomplete',
      'trial_count', trial_count,
      'missing_trial_count', missing_trial_count,
      'incomplete_report_count', incomplete_report_count,
      'trial_version_mismatch_count', trial_version_mismatch_count,
      'questionnaire_version_mismatch_count', questionnaire_version_mismatch_count,
      'pre_questionnaire_count', pre_count,
      'post_questionnaire_count', post_count
    );
  end if;

  update public.experiment_sessions
  set status = 'completed', completed_at = coalesce(completed_at, now()), last_write_at = now()
  where id = p_session_id;

  return jsonb_build_object(
    'ok', true,
    'code', 'session_complete',
    'completed_at', (select completed_at from public.experiment_sessions where id = p_session_id)
  );
end;
$$;

revoke all on function public.allocate_experiment_session(text,text,text,text,text,text,text,text,text,text,text) from public, anon, authenticated;
revoke all on function public.check_experiment_rate_limit(uuid,integer) from public, anon, authenticated;
revoke all on function public.complete_experiment_session(uuid,text) from public, anon, authenticated;
grant execute on function public.allocate_experiment_session(text,text,text,text,text,text,text,text,text,text,text) to service_role;
grant execute on function public.check_experiment_rate_limit(uuid,integer) to service_role;
grant execute on function public.complete_experiment_session(uuid,text) to service_role;

create view public.research_session_trial_export
with (security_invoker = true)
as
select
  s.id as experiment_session_id,
  s.study_key,
  s.condition_key,
  s.counterbalance_list,
  s.stimulus_set_version,
  s.timing_policy_version,
  s.api_contract_version,
  s.client_build_version,
  s.started_at,
  s.completed_at,
  t.trial_id,
  t.report_completed,
  t.timed_out,
  t.server_received_at,
  t.server_updated_at,
  t.payload
from public.experiment_sessions s
join public.experiment_trial_responses t on t.experiment_session_id = s.id;

create view public.research_session_questionnaire_export
with (security_invoker = true)
as
select
  s.id as experiment_session_id,
  s.study_key,
  s.condition_key,
  s.counterbalance_list,
  s.stimulus_set_version,
  s.timing_policy_version,
  q.stage,
  q.server_received_at,
  q.server_updated_at,
  q.payload
from public.experiment_sessions s
join public.experiment_questionnaires q on q.experiment_session_id = s.id;

revoke all on public.research_session_trial_export from public, anon, authenticated;
revoke all on public.research_session_questionnaire_export from public, anon, authenticated;
