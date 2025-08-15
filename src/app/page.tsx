import Link from 'next/link'
import { ViewsCard } from '@/components/ViewsCard'
import { HowItWorks } from '@/components/HowItWorks'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-tiktok-dark via-tiktok-dark-light to-tiktok-dark">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
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
        </div>
      </section>

      {/* Views Card Section */}
      <section className="py-16 bg-tiktok-dark">
        <div className="container mx-auto px-4">
          <ViewsCard />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-tiktok-dark-light">
        <div className="container mx-auto px-4">
          <HowItWorks />
        </div>
      </section>
    </div>
  )
}
