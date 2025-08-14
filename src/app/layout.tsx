import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TikTok Total Views',
  description: 'Tool for creators to log in and see total views across all their videos (sample until API approval).',
  keywords: ['TikTok', 'views', 'counter', 'creator', 'analytics'],
  authors: [{ name: 'TikTok Views Counter' }],
  openGraph: {
    title: 'TikTok Total Views',
    description: 'Tool for creators to log in and see total views across all their videos (sample until API approval).',
    type: 'website',
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'TikTok Total Views',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TikTok Total Views',
    description: 'Tool for creators to log in and see total views across all their videos (sample until API approval).',
    images: ['/logo.svg'],
  },
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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
