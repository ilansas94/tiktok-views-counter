# TikTok Views Counter

A web application that allows TikTok creators to view the total number of views across all their videos by connecting their TikTok account through official OAuth.

## Features

- **OAuth Integration**: Secure TikTok account connection using official OAuth
- **Total Views Display**: Shows combined view count across all videos
- **Sample Data Mode**: Demonstrates functionality while awaiting API approval
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Privacy Focused**: No permanent storage of user data

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tiktok-views-counter
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your TikTok OAuth credentials:
```
NEXT_PUBLIC_APP_BASE_URL=http://localhost:3000
NEXT_PUBLIC_TIKTOK_CLIENT_KEY=your_tiktok_client_key_here
NEXT_PUBLIC_TIKTOK_SCOPES=user.info.basic,video.list
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_APP_BASE_URL` | Your application's base URL | Yes |
| `NEXT_PUBLIC_TIKTOK_CLIENT_KEY` | TikTok OAuth client key | Yes |
| `NEXT_PUBLIC_TIKTOK_SCOPES` | TikTok OAuth scopes | Yes |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # OAuth routes
│   │   ├── login/         # Login page
│   │   └── callback/      # OAuth callback
│   ├── privacy/           # Privacy policy
│   ├── terms/             # Terms of service
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── Header.tsx         # Site header
│   └── Footer.tsx         # Site footer
public/
├── favicon.png           # App icon
└── Assets/               # Original assets
```

## Development Phases

### Phase 0 (Current)
- ✅ Basic application structure
- ✅ OAuth UI flow (stub)
- ✅ Sample data display
- ✅ Legal pages (Privacy, Terms)
- ✅ Responsive design

### Phase 1 (Pre-approval)
- 🔄 Enhanced UI/UX
- 🔄 SEO optimization
- 🔄 Mobile QA

### Phase 2 (Post-approval)
- ⏳ Real TikTok API integration
- ⏳ Token exchange
- ⏳ View calculation
- ⏳ Live data display

## Deployment

The application is configured for deployment on Vercel:

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Privacy

This application respects user privacy and does not store personal data permanently. All TikTok data access is performed through official APIs with user consent.
