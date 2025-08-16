# TikTok Scope Explanation for App Review

## App: TotalViews - TikTok Views Counter

### Scopes Requested and Their Purpose

#### 1. `user.info.basic`
**Purpose:** Display user's basic profile information in the app
**Usage:** 
- Show the user's TikTok display name in the app interface
- Display user's avatar/profile picture
- Personalize the user experience with their TikTok identity

#### 2. `user.info.profile` 
**Purpose:** Access additional profile information for enhanced display
**Usage:**
- Display complete profile information including bio, follower count
- Show profile picture in higher resolution
- Provide richer user experience with full profile data

#### 3. `video.list`
**Purpose:** Calculate total views across all user's public videos
**Usage:**
- Fetch list of user's public videos
- Read view count for each public video
- Calculate and display the sum of all video views
- **Important:** Only accesses public videos, never private content

### Feature Implementation

**Core Feature:** Total Views Calculator
- User connects their TikTok account via OAuth
- App fetches all public videos using `video.list` scope
- Sums up view counts from all public videos
- Displays total in a simple, clean interface

**Optional Feature:** Public Leaderboard
- User can choose to submit their total views to a public leaderboard
- Uses `user.info.basic` and `user.info.profile` to display username and avatar
- Leaderboard entries stored in EU-based Vercel KV (Upstash Redis)
- 12-month retention policy with user deletion rights

### Data Handling

**Data Collected:**
- TikTok user ID, username, display name, avatar URL
- Public video metadata (video IDs, view counts)
- Short-lived access tokens (server-side only, not stored)

**Data Storage:**
- Leaderboard entries stored in EU (Frankfurt) via Vercel KV
- User can delete their leaderboard entry at any time
- No persistent storage of TikTok access tokens

**Privacy:**
- Only public videos are accessed
- No private video content is ever read
- Users can revoke access through TikTok app settings
- GDPR-compliant data handling with EU storage

### User Control

**Revocation:** Users can revoke access anytime via TikTok app → Profile → Settings → Security → Apps & Websites

**Deletion:** Users can remove their leaderboard entry through the app or by emailing support

**Transparency:** Clear privacy policy and terms of service explaining all data usage
