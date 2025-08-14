import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-[#fe2c55]/10 to-[#e62a4d]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-[#fe2c55]/5 to-[#e62a4d]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#fe2c55]/3 to-[#e62a4d]/3 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Floating elements */}
          <div className="absolute top-20 left-20 w-4 h-4 bg-[#fe2c55] rounded-full floating-animation opacity-60"></div>
          <div className="absolute top-40 right-32 w-6 h-6 bg-[#e62a4d] rounded-full floating-animation opacity-40" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-32 left-32 w-3 h-3 bg-[#fe2c55] rounded-full floating-animation opacity-70" style={{animationDelay: '4s'}}></div>
          
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
              <span className="gradient-text">Total views</span>
              <br />
              <span className="text-gray-900">across your TikTok</span>
              <br />
              <span className="text-gray-600 text-4xl md:text-5xl lg:text-6xl font-bold">— in one number.</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Connect your account to see the sum of views across all your videos in a beautiful, 
              <span className="gradient-text font-semibold"> real-time dashboard</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link 
                href="/auth/login"
                className="btn-primary text-lg px-10 py-5 pulse-glow"
              >
                <span className="flex items-center gap-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                  Login with TikTok
                </span>
              </Link>
              
              <div className="flex items-center gap-4 text-gray-500">
                <div className="w-8 h-px bg-gray-300"></div>
                <span className="text-sm font-medium">Sample Data</span>
                <div className="w-8 h-px bg-gray-300"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Total Views Card */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="card text-center relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#fe2c55]/5 to-[#e62a4d]/5"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#fe2c55]/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#e62a4d]/10 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              <div className="mb-8">
                <span className="inline-block bg-gradient-to-r from-[#fe2c55] to-[#e62a4d] text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg">
                  Sample Data
                </span>
              </div>
              
              <div className="mb-8">
                <h2 className="text-7xl md:text-9xl font-black gradient-text mb-4 leading-none">
                  12,345,678
                </h2>
                <p className="text-2xl text-gray-600 font-semibold">
                  Total Views
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm">
                  <div className="text-3xl font-bold gradient-text mb-2">1,234</div>
                  <div className="text-gray-600">Videos</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm">
                  <div className="text-3xl font-bold gradient-text mb-2">567</div>
                  <div className="text-gray-600">Followers</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm">
                  <div className="text-3xl font-bold gradient-text mb-2">89</div>
                  <div className="text-gray-600">Likes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="gradient-text">How it works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get your total TikTok views in just three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-[#fe2c55] to-[#e62a4d] rounded-2xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-[#fe2c55] font-bold text-sm">1</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Connect</h3>
              <p className="text-gray-600 leading-relaxed">
                Securely connect your TikTok account using official OAuth. 
                We never store your password.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-[#fe2c55] to-[#e62a4d] rounded-2xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-[#fe2c55] font-bold text-sm">2</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Sum</h3>
              <p className="text-gray-600 leading-relaxed">
                We instantly calculate the total views across all your videos 
                using TikTok's official API.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-[#fe2c55] to-[#e62a4d] rounded-2xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-[#fe2c55] font-bold text-sm">3</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">See Total</h3>
              <p className="text-gray-600 leading-relaxed">
                View your combined total in one beautiful, animated number 
                that updates in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card">
            <h2 className="text-3xl md:text-4xl font-black mb-6">
              Ready to see your <span className="gradient-text">total views</span>?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of creators who are tracking their TikTok success
            </p>
            <Link 
              href="/auth/login"
              className="btn-primary text-lg px-10 py-5"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
