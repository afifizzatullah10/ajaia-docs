# Submission Index

**Candidate:** Muhammad Afif Izzatullah
**Email:** mizzatul@tepper.cmu.edu
**Role:** AI Implementation Manager / Technical Program and Project Manager

## Live Deployment

https://ajaia-docs-livid.vercel.app

(Static Vite build on Vercel with **`vercel.json`** SPA rewrites so deep links and refresh do not 404.)

## Test Accounts

- User 1: mizzatul@tepper.cmu.edu / 12345678
- User 2: afifizzatullah10@gmail.com / 12345678 (has a doc shared with them)

## Walkthrough Video

https://youtu.be/GtwZOf_581k

## GitHub Source

https://github.com/afifizzatullah10/ajaia-docs

## Google Drive (all deliverables)

Submission folder with the same markdown docs, walkthrough URL file, and related materials:

https://drive.google.com/drive/folders/1J3j6XHuJrmm1iy-EbIcPACI6LYa5Orj_?usp=sharing

## Files in This Folder

These files are in the **repo** and mirrored in the **Drive** folder above.

| File | Description |
|------|-------------|
| README.md | Local setup and feature list |
| ARCHITECTURE.md | Tech decisions and tradeoffs |
| AI_WORKFLOW.md | How AI tools were used |
| SUBMISSION.md | This file |
| WALKTHROUGH_VIDEO.txt | Walkthrough video URL (same as below) |

## What Is Working

- User registration and login
- Document creation, rename, rich text editing (bold, italic, underline, H1, H2, bullets, numbers)
- Auto-save with status indicator
- File upload to Supabase Storage
- Document sharing by email with owned vs. shared distinction
- Export to Markdown and PDF
- Full persistence after refresh and logout
- Vercel production: client routes work on **direct URL** and **browser refresh** (SPA rewrite)

## What Is Incomplete

- Real-time collaboration
- Document version history
- Role-based sharing permissions
- Full .docx content extraction on upload

## What I Would Build Next (2-4 hours)

1. Real-time collaboration — Supabase Realtime + TipTap + Yjs
2. Version history — snapshot on save, allow restore
3. Role-based permissions — viewer vs. editor
