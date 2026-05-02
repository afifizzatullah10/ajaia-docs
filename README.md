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

1. Clone: `git clone https://github.com/afifizzatullah10/ajaia-docs`
2. Install: `npm install`
3. Create `.env`:

   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

4. Run: `npm run dev`
5. Open: http://localhost:5173

## Run Tests

`npm run test`

## Supported File Upload Types

The editor shows the same facts in the UI: **.txt**, **.md**, **.docx**, **PDF**, and common **images** can be chosen; every upload is stored in the **`uploads`** bucket and **inserted as a link** in the doc. **No file type is parsed into the editor body** (no automatic .txt/.md/.docx import).
