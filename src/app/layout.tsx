import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })
const siteUrl = process.env.NEXT_PUBLIC_APP_BASE_URL || 'https://tiktok-views-counter.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'TotalViews',
  description: 'Tool for creators to log in and see total views across all their videos (sample until API approval).',
  keywords: ['TikTok', 'views', 'counter', 'creator', 'analytics'],
  authors: [{ name: 'TotalViews' }],
  manifest: '/manifest.json',
  openGraph: {
    title: 'TotalViews',
    description: 'Tool for creators to log in and see total views across all their videos (sample until API approval).',
    url: siteUrl,
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TotalViews',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TotalViews',
    description: 'Tool for creators to log in and see total views across all their videos (sample until API approval).',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [{ url: '/favicon.ico' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" type="image/png" />
        <link rel="icon" href="/favicon.ico" sizes="any" type="image/x-icon" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
