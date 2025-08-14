# Execution Tasks (checklist)

## Phase 0 — Planning to Code Bridge (This is what Cursor should implement first)
[ ] Create project scaffold (Next.js or Express; team choice).
[ ] Add pages: Home (/), Privacy (/privacy), Terms (/terms).
[ ] Add header/footer/nav with links to Privacy/Terms.
[ ] Place a “Login with TikTok” button that links to /auth/login.
[ ] Implement /auth/login route that builds the official authorize URL (no token exchange).
[ ] Implement /auth/callback route that reads ?code or ?error and shows a friendly message.
[ ] On Home, show a “Total Views” card with **Sample data** (e.g., 12,345,678) and a badge “Sample”.
[ ] Add .env support for APP_BASE_URL, CLIENT_KEY, CLIENT_SECRET, SCOPES; but do not require them to run.
[ ] Deploy to a public preview URL (Vercel/Netlify). Output the URL.

## Phase 1 — Pre-approval polish (still before API access)
[ ] Add “How it works” section (3 steps).
[ ] Add favicon/app icon (from ICON_BRIEF.md).
[ ] Add basic SEO (title, description).
[ ] Mobile QA.

## Phase 2 — After TikTok approval (wire real API)
[ ] Exchange code → token.
[ ] Call /v2/video/list (fields id, view_count, create_time).
[ ] Paginate via cursor; sum view_count.
[ ] Replace Sample badge with “Live Data” and show videosCounted.
[ ] Add subtle error states and retry logic.
