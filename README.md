# TikTok Total Views Counter

A modern web application that allows TikTok creators to view the total number of views across all their videos by connecting their TikTok account through official OAuth.

## 🚀 Features

- **Secure OAuth Integration**: Official TikTok OAuth 2.0 flow with server-side token handling
- **Real-Time Data**: Fetch actual view counts from TikTok API
- **Total Views Calculation**: Sum up views across all your videos
- **Modern UI**: Dark theme with TikTok brand colors
- **Responsive Design**: Works on desktop and mobile
- **Privacy-First**: Secure HTTP-only cookies, no data stored on servers
- **Sandbox Support**: Works with TikTok Sandbox tester accounts

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: TikTok OAuth 2.0 with server-side callback
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- TikTok Developer Account (for OAuth credentials)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/ilansas94/tiktok-views-counter.git
cd tiktok-views-counter
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file:

```bash
cp env.example .env.local
```

Edit `.env.local` and add your TikTok OAuth credentials:

```env
# TikTok OAuth Configuration
TIKTOK_CLIENT_KEY=YOUR_KEY
TIKTOK_CLIENT_SECRET=YOUR_SECRET
TIKTOK_REDIRECT_URI=https://tiktok-views-counter.vercel.app/auth/callback

# App Configuration (Public)
NEXT_PUBLIC_APP_BASE_URL=https://tiktok-views-counter.vercel.app

# TikTok Client Key (Public - needed for client-side OAuth)
NEXT_PUBLIC_TIKTOK_CLIENT_KEY=YOUR_KEY

# TikTok API Scopes (Public)
NEXT_PUBLIC_TIKTOK_SCOPES=user.info.basic,video.list
```

### 4. Get TikTok OAuth Credentials

1. Go to [TikTok for Developers](https://developers.tiktok.com/)
2. Create a new app
3. Add OAuth redirect URL: `https://tiktok-views-counter.vercel.app/auth/callback`
4. Copy your Client Key and Client Secret
5. Add a Sandbox Target User for testing

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Pages

- **Home** (`/`): Hero section, CTA, live data display, "How it works"
- **Login** (`/auth/login`): TikTok OAuth login page
- **Callback** (`/api/auth/callback`): Server-side OAuth callback handler
- **Privacy** (`/privacy`): Privacy policy
- **Terms** (`/terms`): Terms of service

## 🔧 API Endpoints

- **OAuth Callback** (`/api/auth/callback`): Handles TikTok OAuth callback, exchanges code for token, sets secure cookies
- **Video List** (`/api/videos`): Proxies TikTok video.list API calls using stored access token

## 🎨 Design System

### Colors
- **Primary**: TikTok Cyan (#00F2EA)
- **Secondary**: TikTok Pink (#FF0050)
- **Dark**: TikTok Dark (#161823)
- **Background**: Dark theme with gradients

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
- Responsive header with navigation
- Gradient buttons with hover effects
- Card components with shadows
- Smooth animations and transitions

## 🔒 Security & Privacy

- **No Data Storage**: Access tokens used in memory only
- **Minimal Scopes**: Only requests necessary permissions
- **Secure OAuth**: Official TikTok OAuth 2.0 flow
- **HTTPS Only**: All production deployments use HTTPS

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 🔐 TikTok App Verification

### URL-Prefix Verification

To verify your TikTok app, you need to host a verification file:

**File Location**: `/public/tiktok8XFjvtkalpC8JJwfCigGUleCWk3WCY9u.txt`

**Verification URL**: `https://tiktok-views-counter.vercel.app/tiktok8XFjvtkalpC8JJwfCigGUleCWk3WCY9u.txt`

**Setup Instructions**:
1. The verification file is already created in the public directory
2. Replace the placeholder content with the exact token text from TikTok Developer Portal
3. Commit and deploy the changes
4. Verify the URL is accessible and shows the token content
5. Go back to TikTok Developer Portal and click "Verify"

**Note**: The file is served as a static asset from the public directory, so no additional configuration is needed.

### Manual Deployment

```bash
npm run build
npm start
```

## 📊 Phase Development

### Phase 0 (Current)
- ✅ Modern UI with sample data
- ✅ OAuth flow stubs
- ✅ Legal pages
- ✅ Responsive design

### Phase 1 (Pre-approval)
- 🔄 OAuth implementation
- 🔄 Token exchange
- 🔄 Error handling

### Phase 2 (Post-approval)
- ⏳ Real TikTok API integration
- ⏳ Video list fetching
- ⏳ View count calculation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## ⚠️ Disclaimer

This tool is not affiliated with TikTok Inc. TikTok is a registered trademark of ByteDance Ltd.

## 📞 Support

For support, email support@yourdomain.com or create an issue on GitHub.

---

**Note**: This application is currently in Phase 0 and shows sample data. Real TikTok API integration will be implemented after TikTok app approval.
