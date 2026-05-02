# Architecture Notes

## Overview

Single-page React app with Vite, backed entirely by Supabase (auth, database, storage).
No custom backend server — all data operations go through the Supabase JS client.

## Frontend

- React + Vite
- React Router with protected routes
- TipTap for rich text editing (StarterKit + Underline extensions)
- Plain CSS — no UI framework

## Backend / Data

- Supabase Auth — email/password
- Supabase Postgres — two tables: documents, document_shares
- Supabase Storage — file uploads to the `uploads` bucket (public)
- Supabase RPC — `get_user_id_by_email` function for sharing lookup
- Row-level security — policies on `documents` / `document_shares` plus **`SECURITY DEFINER`** helpers (`is_owner_of_document`, `is_shared_with_me_document`) so owner vs. shared access works without policy recursion (see `supabase/rls_and_rpc.sql`)

## Key Decisions

- **Supabase over custom backend:** No server needed. Auth, DB, and storage in one SDK.
- **TipTap over alternatives:** Better React integration, more extensible than Quill.
- **Auto-save cadence:** Persist on a **3-second interval** when the editor or title is dirty, instead of writing on every keystroke—fewer round-trips to Postgres.
- **window.print() for PDF:** Fastest path, no extra dependencies, good enough for scope.
- **No real-time collaboration:** Would require Supabase Realtime + Yjs. Clear next step.

## What I Would Build Next

1. Real-time collaboration — Supabase Realtime + TipTap collaboration extension
2. Version history — snapshot on each save, allow restore
3. Role-based sharing — viewer vs. editor permissions
4. Full .docx import using mammoth.js
