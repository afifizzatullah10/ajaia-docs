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

Prompted Cursor to add Markdown export (TipTap HTML via `getHTML()`, converted with Turndown)
and PDF export via `window.print()` plus a print stylesheet that hides app chrome. Minor
tweaks after the first pass.

## What I Changed or Rejected

- **Rejected:** Cursor initially generated an Express backend for sharing lookup.
  Redirected to Supabase RPC instead — simpler, no extra server.
- **Changed:** Auto-save was on every keystroke. Changed to 3-second debounce.
- **Changed:** Considered a PDF library; used `window.print()` with print CSS instead —
  fewer dependencies, good enough for this scope.

## How I Verified Correctness

- Tested each feature manually after each Cursor prompt
- Verified persistence by refreshing after save
- Verified sharing with two separate browser sessions (main + incognito)
- Ran Vitest for the automated test
- Checked live Vercel deployment matched local behavior before recording
