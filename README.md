# Ajaia Docs

A lightweight collaborative document editor built with React, TipTap, and Supabase.

## Live Demo

https://ajaia-docs-livid.vercel.app

**Submission package (Google Drive):** [folder with all deliverables](https://drive.google.com/drive/folders/1J3j6XHuJrmm1iy-EbIcPACI6LYa5Orj_?usp=sharing) — see also **`SUBMISSION.md`** in this repo.

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

1. Clone: `git clone https://github.com/afifizzatullah10/ajaia-docs`
2. Install: `npm install`
3. Create `.env`:

   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

4. Run: `npm run dev`
5. Open: http://localhost:5173

## Deploy on Vercel

Import this repo on [Vercel](https://vercel.com) and set **`VITE_SUPABASE_URL`** and **`VITE_SUPABASE_ANON_KEY`** (same values as local `.env`). The repo includes **`vercel.json`** so routes like **`/login`**, **`/dashboard`**, and **`/doc/:id`** still load after a **hard refresh** or when opened directly (static SPA rewrite to `index.html`).

## Run Tests

`npm run test`

## Supported File Upload Types

The editor shows the same facts in the UI: **.txt**, **.md**, **.docx**, **PDF**, and common **images** can be chosen; every upload is stored in the **`uploads`** bucket and **inserted as a link** in the doc. **No file type is parsed into the editor body** (no automatic .txt/.md/.docx import).
