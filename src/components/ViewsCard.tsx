export function ViewsCard() {
  const sampleViews = 12345678

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
        
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Sample Data
        </div>
        
        <p className="text-sm text-gray-400 mt-4">
          This is preview data. Connect your account to see your actual total views.
        </p>
      </div>
    </div>
  )
}
