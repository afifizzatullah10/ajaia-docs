# Ajaia Docs — Build Plan

## The App in One Sentence
A simple doc editor where users can sign up, create/edit rich-text documents, upload files, and share docs with other users. Everything persists in Supabase.

---

## Stack
- **Supabase** — auth + database + file storage, all free, no backend server needed
- **React + Vite** — fast frontend setup
- **TipTap** — rich text editor
- **Vercel** — one-click deployment
- **Vitest** — one test

---

## Step 1 — Supabase Setup (15 min)

1. Go to supabase.com → create free project → note **Project URL** and **anon public key**
2. SQL Editor → run:

```sql
create table documents (
  id uuid default gen_random_uuid() primary key,
  title text not null default 'Untitled',
  content text default '',
  owner_id uuid references auth.users(id),
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table document_shares (
  id uuid default gen_random_uuid() primary key,
  document_id uuid references documents(id) on delete cascade,
  shared_with_email text not null,
  shared_with_id uuid references auth.users(id),
  created_at timestamp default now()
);
```

3. Storage → create bucket called `uploads`, set to public
4. Authentication → Email signup is on by default, leave it

---

## Step 2 — Scaffold Project (5 min)

```bash
npm create vite@latest ajaia-docs -- --template react
cd ajaia-docs
npm install
npm install @supabase/supabase-js @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-underline @tiptap/extension-text-align react-router-dom
```

Create `.env` in root:
```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## Step 3 — Cursor Prompts (run in order)

### Prompt 1 — Supabase client
```
Create src/lib/supabase.js that initializes and exports a Supabase client using import.meta.env.VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
```

---

### Prompt 2 — Auth pages
```
Create src/pages/Login.jsx and Register.jsx with email/password forms using the Supabase client from src/lib/supabase.js. Login calls supabase.auth.signInWithPassword, Register calls supabase.auth.signUp. On success both redirect to /dashboard. Keep styling minimal but clean.
```

---

### Prompt 3 — Router and auth guard
```
Update src/App.jsx to use react-router-dom with these routes:
/ → redirect to /login
/login → Login page
/register → Register page
/dashboard → Dashboard page (protected, redirect to /login if no session)
/doc/:id → Editor page (protected)

Create a ProtectedRoute wrapper component that checks supabase.auth.getSession()
```

---

### Prompt 4 — Dashboard
```
Create src/pages/Dashboard.jsx that:
- Gets the current user from supabase.auth.getUser()
- Fetches documents where owner_id = user.id from the documents table (owned docs)
- Fetches document_shares where shared_with_id = user.id, then fetches those documents (shared docs)
- Shows two sections: "My Documents" and "Shared With Me"
- Has a "New Document" button that inserts a new row into documents with default title "Untitled" and redirects to /doc/:id
- Has a logout button that calls supabase.auth.signOut()
- Each document shows its title and a link to /doc/:id
```

---

### Prompt 5 — Editor
```
Create src/pages/Editor.jsx that:
- Gets the doc id from useParams()
- Fetches the document from Supabase on load
- Uses TipTap editor with StarterKit and Underline extensions
- Shows an editable title input at the top
- Has a toolbar with buttons for: Bold, Italic, Underline, H1, H2, Bullet List, Numbered List
- Auto-saves content and title to Supabase every 3 seconds if changes detected
- Shows "Saving..." and "Saved" status
- Has a Share button that opens a modal — user enters an email, app looks up that user via RPC and inserts into document_shares table
- Has a File Upload button that uploads a file to Supabase storage bucket "uploads" and appends the filename as a link into the document content
```

---

### Prompt 6 — Fix share lookup

First run this in Supabase SQL Editor:

```sql
create or replace function get_user_id_by_email(email_input text)
returns uuid
language sql
security definer
as $$
  select id from auth.users where email = email_input limit 1;
$$;
```

Then in Cursor:
```
In Editor.jsx, update the share flow to call the Supabase RPC function get_user_id_by_email(email) to look up the user ID before inserting into document_shares. If the user is not found, show an error "No user found with that email".
```

---

### Prompt 7 — Styling
```
Add clean minimal CSS to make the app look professional. Use a white background, clean sans-serif font, subtle borders, and a simple top navigation bar. The editor should feel like a real document editor — full width content area, toolbar at top, title above content. No frameworks needed, just clean CSS in src/index.css.
```

---

### Prompt 8 — Test
```
Create src/tests/document.test.js using Vitest. Write one test that verifies a document object with title and content fields passes basic validation (title is non-empty string, content is a string). Run with npm run test.
```

Also add to `vite.config.js`:
```js
test: { environment: 'jsdom' }
```

---

## Step 4 — Deploy (10 min)

```bash
git init
git add .
git commit -m "init"
gh repo create ajaia-docs --public
git push -u origin main
```

Then: vercel.com → Import repo → add env vars (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) → Deploy → copy live URL

---

## Step 5 — Loom Video (10 min)

Cover in order:
1. Register two accounts (incognito for second user)
2. Create a doc, rename it, format text (bold, italic, heading, list)
3. Upload a file
4. Share doc with second user's email
5. Log in as second user → confirm "Shared With Me" shows it
6. Mention what you deprioritized and why
7. Show live Vercel URL

---

## Step 6 — Submission Docs (20 min)

Four files needed — come back to Claude after the build and he'll draft all four:
- `README.md` — setup and run instructions
- `ARCHITECTURE.md` — what you built and why
- `AI_WORKFLOW.md` — how you used AI (be specific)
- `SUBMISSION.md` — index of everything included

---

## Time Budget

| Step | Time |
|------|------|
| Supabase setup | 15 min |
| Project scaffold | 10 min |
| Cursor prompts 1-8 | 2.5 hrs |
| Deploy | 15 min |
| Loom video | 15 min |
| Submission docs | 20 min |
| Buffer / debugging | 45 min |
| **Total** | **~4.5 hrs** |

---

## Rules While Building
- Stuck on an error for more than 5 min → paste it to Claude immediately
- Don't chase stretch features until all 5 core requirements work end to end
- Core requirements: create/edit doc, file upload, sharing, persistence, deployment
- Deploy early (after Prompt 4) so you have a live URL even if something breaks later
