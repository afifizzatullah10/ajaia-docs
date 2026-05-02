-- Run in Supabase SQL Editor after creating tables from plan.md.
-- Uses SECURITY DEFINER helpers so documents <-> document_shares policies do not recurse.

-- ---------------------------------------------------------------------------
-- RPC: resolve a registered user's id by email (used when sharing)
-- ---------------------------------------------------------------------------
create or replace function public.get_user_id_by_email(email_input text)
returns uuid
language sql
security definer
set search_path = public
as $$
  select id from auth.users where lower(email) = lower(trim(email_input)) limit 1;
$$;

revoke all on function public.get_user_id_by_email(text) from public;
grant execute on function public.get_user_id_by_email(text) to authenticated;

-- ---------------------------------------------------------------------------
-- RLS helpers (bypass RLS inside the function body — breaks policy cycles)
-- ---------------------------------------------------------------------------
create or replace function public.is_owner_of_document(doc_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.documents d
    where d.id = doc_id and d.owner_id = auth.uid()
  );
$$;

revoke all on function public.is_owner_of_document(uuid) from public;
grant execute on function public.is_owner_of_document(uuid) to authenticated;

create or replace function public.is_shared_with_me_document(doc_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.document_shares s
    where s.document_id = doc_id and s.shared_with_id = auth.uid()
  );
$$;

revoke all on function public.is_shared_with_me_document(uuid) from public;
grant execute on function public.is_shared_with_me_document(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- documents — drop old policies if re-running
-- ---------------------------------------------------------------------------
alter table public.documents enable row level security;

drop policy if exists "documents_select_owner_or_shared" on public.documents;
drop policy if exists "documents_insert_owner" on public.documents;
drop policy if exists "documents_update_owner_or_shared" on public.documents;
drop policy if exists "documents_delete_owner" on public.documents;

create policy "documents_select_owner_or_shared"
on public.documents for select
using (
  auth.uid() = owner_id
  or public.is_shared_with_me_document(id)
);

create policy "documents_insert_owner"
on public.documents for insert
with check (auth.uid() = owner_id);

create policy "documents_update_owner_or_shared"
on public.documents for update
using (
  auth.uid() = owner_id
  or public.is_shared_with_me_document(id)
)
with check (
  auth.uid() = owner_id
  or public.is_shared_with_me_document(id)
);

create policy "documents_delete_owner"
on public.documents for delete
using (auth.uid() = owner_id);

-- ---------------------------------------------------------------------------
-- document_shares
-- ---------------------------------------------------------------------------
alter table public.document_shares enable row level security;

drop policy if exists "shares_select_owner_or_recipient" on public.document_shares;
drop policy if exists "shares_insert_owner" on public.document_shares;

create policy "shares_select_owner_or_recipient"
on public.document_shares for select
using (
  shared_with_id = auth.uid()
  or public.is_owner_of_document(document_id)
);

create policy "shares_insert_owner"
on public.document_shares for insert
with check (public.is_owner_of_document(document_id));

-- ---------------------------------------------------------------------------
-- Storage bucket "uploads" (create bucket in Dashboard if missing)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;

drop policy if exists "uploads_select_public" on storage.objects;
drop policy if exists "uploads_insert_authenticated" on storage.objects;

create policy "uploads_select_public"
on storage.objects for select
using (bucket_id = 'uploads');

create policy "uploads_insert_authenticated"
on storage.objects for insert to authenticated
with check (bucket_id = 'uploads');
