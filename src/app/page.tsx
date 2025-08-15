import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { HowItWorks } from '@/components/HowItWorks'
import { ViewsCard } from '@/components/ViewsCard'

export default function HomePage() {
  // Deployment v2.1.0 - API endpoint fixes
  return (
    <div className="min-h-screen bg-tiktok-dark">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Track Your TikTok Success
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Connect your TikTok account and see the total views across all your videos in one place. 
            Get insights into your content performance with our easy-to-use dashboard.
          </p>
          
          <Link 
            href="/auth/login" 
            className="btn-primary text-lg px-8 py-4 inline-block"
          >
            Connect TikTok Account
          </Link>
        </div>

        <ViewsCard />
        <HowItWorks />
      </main>

      <Footer />
    </div>
  )
}
