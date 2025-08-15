import Link from 'next/link'

export function ViewsCard() {
  const sampleViews = 0

  return (
    <div className="card max-w-md w-full">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-300 mb-2">
          Total Views
        </h3>
        
        <div className="mb-4">
          <span className="text-4xl md:text-5xl font-bold gradient-text">
            {sampleViews.toLocaleString()}
          </span>
        </div>
        
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Preview
        </div>
        
        <div className="text-sm text-gray-400 mb-4">
          0 videos counted
        </div>
        
        <p className="text-sm text-gray-400 mb-4">
          Connect your account to see your actual total views.
        </p>
        
        <Link href="/auth/login" className="btn-primary w-full block">
          Login with TikTok
        </Link>
      </div>
    </div>
  )
}
