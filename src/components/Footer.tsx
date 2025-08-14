import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-tiktok-dark-light border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-gradient-to-r from-tiktok-primary to-tiktok-secondary rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">TV</span>
            </div>
            <span className="text-sm text-gray-400">
              © 2024 TikTok Views Counter. All rights reserved.
            </span>
          </div>
          
          <nav className="flex space-x-6">
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <a 
              href="https://github.com/ilansas94/tiktok-views-counter" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">
            This tool is not affiliated with TikTok Inc. TikTok is a registered trademark of ByteDance Ltd.
          </p>
        </div>
      </div>
    </footer>
  )
}
