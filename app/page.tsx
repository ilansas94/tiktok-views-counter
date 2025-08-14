import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#fe2c55] to-[#e62a4d] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Total views across your TikTok — in one number.
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Connect your account to see the sum of views across all your videos.
          </p>
          <Link 
            href="/auth/login"
            className="btn-primary text-lg px-8 py-4 inline-block"
          >
            Login with TikTok
          </Link>
        </div>
      </section>

      {/* Total Views Card */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card text-center">
            <div className="mb-4">
              <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
                Sample Data
              </span>
            </div>
            <h2 className="text-6xl md:text-8xl font-bold text-gray-900 mb-4">
              12,345,678
            </h2>
            <p className="text-xl text-gray-600">
              Total Views
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            How it works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#fe2c55] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Connect</h3>
              <p className="text-gray-600">
                Securely connect your TikTok account using official OAuth
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#fe2c55] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Sum</h3>
              <p className="text-gray-600">
                We calculate the total views across all your videos
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#fe2c55] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">See total</h3>
              <p className="text-gray-600">
                View your combined total in one beautiful number
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
