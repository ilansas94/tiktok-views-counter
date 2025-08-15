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
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Total views across your TikTok —{' '}
              <span className="gradient-text">in one number.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto animate-slide-up">
              Connect your account to see the sum of views across all your videos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slide-up">
              <Link href="/auth/login" className="btn-primary text-lg px-8 py-4">
                Login with TikTok
              </Link>
              <span className="text-gray-400 text-sm">
                Free • No data stored • Secure OAuth
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Data Section */}
      <section className="py-16 bg-tiktok-dark-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              See Your Total Views
            </h2>
            <p className="text-gray-300 text-lg">
              Preview of what you&apos;ll see after connecting your account
            </p>
          </div>
          
          <div className="flex justify-center">
            <ViewsCard />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />
    </div>
  )
}
