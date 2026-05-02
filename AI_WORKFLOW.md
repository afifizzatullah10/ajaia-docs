# AI Workflow Notes

## Tools Used

- **Cursor (Agent mode)** — implementation, Supabase SQL, debugging, git, and doc updates in this repo
- **Claude (claude.ai)** — early planning: breaking the assignment into a sequenced build (`plan.md`), prompt ordering, and follow-on outline (`plan2.md` for stretch + submission)
- **`plan.md` / `plan2.md`** — execution checklists I used as the source of truth so the Agent did not improvise scope.

## Where AI Materially Sped Up My Work

### 1. End-to-end build from the plans

Starting after Supabase was already created, I had the Agent read `assesment.md` + `plan.md` and execute from **Step 2** (scaffold). It handled a non-empty project folder by scaffolding in a temp directory and moving files, installed the planned dependencies, and implemented the equivalent of **Prompts 1–8** in one pass: Supabase client, login/register, protected routes, dashboard (owned vs shared), TipTap editor with toolbar and **3-second autosave**, share flow calling **`get_user_id_by_email`**, Vitest validation, and baseline CSS. That replaced what would have been a long manual wiring session.

### 2. RLS “infinite recursion” fix

After the first RLS script, Postgres reported **`infinite recursion detected in policy for relation "documents"`** because `documents` policies queried `document_shares` and `document_shares` policies queried `documents`. The Agent **rewrote `supabase/rls_and_rpc.sql`** to add **`SECURITY DEFINER`** helpers (`is_owner_of_document`, `is_shared_with_me_document`) and `DROP POLICY IF EXISTS` + recreated policies so checks no longer recurse. That was a real production bug, not a hypothetical.

### 3. Environment variables and GitHub

I pasted Supabase values with **`NEXT_PUBLIC_`** names from the dashboard; the Agent explained that **Vite only exposes `VITE_*`** and wrote `.env` with `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`. Later I asked for **commit + push**; the Agent ran **`git init`**, initial commit, and **`gh repo create` / `git push`** to my GitHub account.

### 4. `plan2.md` stretch + submission pack

I pointed the Agent at **`plan2.md`** (external path). It implemented **Export → Markdown** (TipTap `getHTML()` + **Turndown** download) and **Export → PDF** (`window.print()` + print stylesheet / `html.is-printing-doc`), added **`README.md`**, **`ARCHITECTURE.md`**, **`SUBMISSION.md`**, and updated this file, then committed and pushed.

### 5. Upload UI iteration

I removed long helper copy next to **Upload file** for a cleaner layout, then **re-read the assessment** (supported types must be clear in the UI) and had the Agent add a **short gray hint** under the button. In a follow-up pass, I had the Agent **align the hint and `README.md` with what the code actually does**: the file input accepts **.txt, .md, .docx, PDF, and common images**; every file is stored in the **`uploads`** bucket and **inserted as a link** in the document, with **no import of file contents into the editor body**. That keeps UI + README factual and consistent with the `accept` attribute and the upload handler.

## What I Changed or Rejected (accurate to this project)

- **Changed (RLS):** Replaced the first cross-table `EXISTS` policies with **security-definer helper functions** to stop policy recursion (see `supabase/rls_and_rpc.sql`).
- **Changed (Markdown export):** `plan2.md` suggested `tiptap-markdown` or manual JSON serialization; we shipped **Turndown on HTML** instead—simpler dependency and fine for this scope.
- **Rejected (documentation):** An earlier draft of this file claimed an **Express** sharing backend and **keystroke-level** auto-save had been tried and reverted—those **did not happen** in this repo’s timeline. I removed them so this note stays truthful.

## How I Verified Correctness

- Manual flows on localhost: auth, new doc, edit, wait for save, refresh, file upload link, share with a second registered user, incognito “shared with me”
- **`npm run test`**, **`npm run build`**, **`npm run lint`** after larger edits
- Confirmed **`.env` is gitignored** and secrets are not in the remote repo
- Before recording / submitting: **spot-check the live Vercel build** the same way as local
