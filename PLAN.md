# Project Plan — TikTok Total Views

## Goal
Build a public website that lets a TikTok creator log in (OAuth) and see a single number: the total views across all their videos. Launch the site first; plug in the official TikTok Display API after app approval.

## Approach
1) **Phase 0 (This review pack):** Create the site skeleton, legal pages, and UI that shows how the app will work after login (with stubbed numbers). No scraping. No private APIs.
2) **Phase 1 (Pre-approval build):** Implement OAuth UI flow (button, callback pages) without calling protected endpoints. Show demo data flag ("sample data").
3) **Phase 2 (Post-approval):** Call `/v2/video/list` with scopes `user.info.basic, video.list`, paginate, sum `view_count`, and show the real total.

## Non-negotiables (for TikTok review)
- Public site URL.
- Working navigation: Home, Privacy, Terms.
- Visible "Login with TikTok" entry point.
- Clear description of what happens after login.
- Privacy/ToS must mention token handling and data retention.
- No scraping or unapproved data collection.

## Tech (recommended)
- Framework: Next.js **or** simple Express + EJS (either is fine).
- Hosting: Vercel/Netlify for public preview (required for review).
- Styling: minimal, fast load.
- Env: `.env` for CLIENT_KEY/SECRET, `APP_BASE_URL`, scopes.
- Analytics: none (avoid until after approval).

## Pages (MVP)
- `/` Home: headline, explainer, CTA "Login with TikTok", space for Total Views card (shows "sample data" before approval).
- `/privacy` Privacy Policy.
- `/terms` Terms of Service.
- `/auth/login` starts OAuth (stub).
- `/auth/callback` explains next step ("App pending review; showing sample data").

## Data flow (after approval)
1. User clicks "Login with TikTok".
2. Redirect to TikTok OAuth authorize (scopes: `user.info.basic,video.list`).
3. Redirect back with `code` → exchange for access token.
4. Call `/v2/video/list` repeatedly (cursor pagination), sum `view_count`.
5. Render total; never store per-video data server-side by default.

## Security & Privacy
- Do not store tokens long-term for MVP.
- If storing later, encrypt at rest, short TTL.
- No sharing with third parties.

## Success criteria (for MVP submission)
- Site live with home, terms, privacy.
- OAuth button present and routes exist.
- Mock total clearly labeled "Sample".
- Clean, simple UI. Loads fast on mobile.
