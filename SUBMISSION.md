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

https://github.com/afifizzatullah10/ajaia-docs

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
