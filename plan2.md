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

## Step 1 — Supabase Setup ✅ DONE

## Step 2 — Scaffold Project ✅ DONE

## Step 3 — Cursor Prompts ✅ DONE

## Step 4 — Deploy to Vercel ✅ DONE
Live URL: https://ajaia-docs-livid.vercel.app

---

## Step 5 — Stretch Feature: Export to PDF or Markdown (30 min)

Tell Cursor:
```
Add an Export button to the Editor toolbar with two options: "Export as Markdown" and "Export as PDF".

For Markdown: convert the TipTap content to markdown and download it as a .md file. Install and use the tiptap-markdown package or manually serialize the editor JSON to markdown.
For PDF: use the browser's window.print() with a print stylesheet added to index.css that hides the toolbar, sidebar, and all UI chrome — just showing the title and document content cleanly.
```

**Test it:**
1. Open a document with formatted content (bold, headings, bullet list)
2. Click Export → Export as Markdown → file downloads as `.md` with correct formatting
3. Click Export → Export as PDF → print dialog opens showing clean document only

---

## Step 6 — Loom Video (15 min)

Record 3-5 minutes. Cover in this order:

1. Show the live Vercel URL in the browser
2. Register `test1@ajaia.com` — land on Dashboard
3. Click New Document → rename to `Project Brief`
4. Type content, apply Bold, Italic, H1, H2, Bullet List, Numbered List
5. Wait for "Saved" → refresh → confirm content persists
6. Upload a `.txt` file → confirm link appears in document
7. Click Share → enter `test2@ajaia.com` → confirm success
8. Open incognito → register `test2@ajaia.com` → Dashboard → confirm `Project Brief` under Shared With Me
9. Export as Markdown → show downloaded file
10. Export as PDF → show clean print preview
11. Say: "I deprioritized real-time collaboration, version history, and comments to focus on a clean working core with one well-executed stretch feature"
12. Briefly mention AI tools: Cursor + Claude, show plan.md

Upload to YouTube (unlisted) or Loom. Copy the link.

---

## Step 7 — Submission Docs (20 min)

Create a Google Drive folder: `Ajaia Docs — Afif Izzatullah`

Add these four files:

---

### README.md
```markdown
# Ajaia Docs

A lightweight collaborative document editor built with React, TipTap, and Supabase.

## Live Demo
https://ajaia-docs-livid.vercel.app

## Test Accounts
- User 1: mizzatul@tepper.cmu.edu / 12345678
- User 2: afifizzatullah10@gmail.com / 12345678

## Features
- Email auth (register, login, logout)
- Create, rename, and edit documents with rich text formatting
- Auto-save every 3 seconds
- File upload to Supabase Storage
- Share documents with other users by email
- Owned vs. shared document distinction on dashboard
- Export to Markdown (download) and PDF (browser print)

## Local Setup
1. Clone: `git clone https://github.com/YOURUSERNAME/ajaia-docs`
2. Install: `npm install`
3. Create `.env`:
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
4. Run: `npm run dev`
5. Open: http://localhost:5173

## Run Tests
`npm run test`

## Supported File Upload Types
.txt and .md preferred. .docx uploads as link only — content not extracted.
```

---

### ARCHITECTURE.md
```markdown
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

## Key Decisions
- **Supabase over custom backend:** No server needed. Auth, DB, and storage in one SDK.
- **TipTap over alternatives:** Better React integration, more extensible than Quill.
- **Auto-save with debounce:** 3-second debounce avoids excessive Supabase writes.
- **window.print() for PDF:** Fastest path, no extra dependencies, good enough for scope.
- **No real-time collaboration:** Would require Supabase Realtime + Yjs. Clear next step.

## What I Would Build Next
1. Real-time collaboration — Supabase Realtime + TipTap collaboration extension
2. Version history — snapshot on each save, allow restore
3. Role-based sharing — viewer vs. editor permissions
4. Full .docx import using mammoth.js
```

---

### AI_WORKFLOW.md
```markdown
# AI Workflow Notes

## Tools Used
- **Cursor** — primary coding environment, Agent mode throughout
- **Claude (claude.ai)** — planning, prompt design, debugging, architecture decisions

## Where AI Materially Sped Up My Work

### 1. Project scaffolding
Used Claude to generate a structured build plan (plan.md) with exact terminal commands,
Supabase SQL, and sequenced Cursor prompts. Saved ~45 minutes of setup time.

### 2. TipTap integration
Prompted Cursor to generate the full editor component with toolbar, extensions, and
auto-save in one pass. Got a working editor in ~20 minutes instead of ~90.

### 3. Supabase sharing flow
Claude identified upfront that auth.users is not directly accessible from the client
and designed the RPC function workaround before I hit the error — saved a debugging cycle.

### 4. Export feature
Prompted Cursor to add Markdown export via TipTap JSON serialization and PDF export
via window.print() with a print stylesheet. Both worked on first attempt with minor tweaks.

## What I Changed or Rejected
- **Rejected:** Cursor initially generated an Express backend for sharing lookup.
  Redirected to Supabase RPC instead — simpler, no extra server.
- **Changed:** Auto-save was on every keystroke. Changed to 3-second debounce.
- **Changed:** PDF export initially used html2pdf.js. Replaced with window.print() —
  fewer dependencies, same result for this scope.

## How I Verified Correctness
- Tested each feature manually after each Cursor prompt
- Verified persistence by refreshing after save
- Verified sharing with two separate browser sessions (main + incognito)
- Ran Vitest for the automated test
- Checked live Vercel deployment matched local behavior before recording
```

---

### SUBMISSION.md
```markdown
# Submission Index

**Candidate:** Muhammad Afif Izzatullah
**Email:** mizzatul@tepper.cmu.edu
**Role:** AI Implementation Manager / Technical Program and Project Manager

## Live Deployment
https://ajaia-docs-livid.vercel.app

## Test Accounts
- User 1: mizzatul@tepper.cmu.edu / 12345678
- User 2: afifizzatullah10@gmail.com / 12345678 (has a doc shared with them)

## Walkthrough Video
[paste Loom or YouTube link here]

## GitHub Source
[paste GitHub repo link here]

## Files in This Folder
| File | Description |
|------|-------------|
| README.md | Local setup and feature list |
| ARCHITECTURE.md | Tech decisions and tradeoffs |
| AI_WORKFLOW.md | How AI tools were used |
| SUBMISSION.md | This file |

## What Is Working
- User registration and login
- Document creation, rename, rich text editing (bold, italic, underline, H1, H2, bullets, numbers)
- Auto-save with status indicator
- File upload to Supabase Storage
- Document sharing by email with owned vs. shared distinction
- Export to Markdown and PDF
- Full persistence after refresh and logout

## What Is Incomplete
- Real-time collaboration
- Document version history
- Role-based sharing permissions
- Full .docx content extraction on upload

## What I Would Build Next (2-4 hours)
1. Real-time collaboration — Supabase Realtime + TipTap + Yjs
2. Version history — snapshot on save, allow restore
3. Role-based permissions — viewer vs. editor
```

---

## Remaining Time Budget

| Step | Time |
|------|------|
| Stretch feature (Export) | 30 min |
| Push to Vercel | 5 min |
| Loom video | 15 min |
| Submission docs | 20 min |
| Google Drive folder | 10 min |
| Buffer | 20 min |
| **Total** | **~100 min** |

---

## Rules
- Stuck on error for more than 5 min → paste to Claude immediately
- Do NOT add more stretch features — one is enough
- Push to GitHub before recording video: `git add . && git commit -m "export feature" && git push`
