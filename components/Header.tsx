import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Image
                  src="/favicon.png"
                  alt="TikTok Views Counter"
                  width={36}
                  height={36}
                  className="rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#fe2c55]/20 to-[#e62a4d]/20 rounded-xl"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-gray-900 group-hover:text-[#fe2c55] transition-colors duration-300">
                  TikTok Views Counter
                </span>
                <span className="text-xs text-gray-500 font-medium">Total Views Tracker</span>
              </div>
            </Link>
          </div>
          
          <nav className="flex space-x-1">
            <Link 
              href="/privacy" 
              className="text-gray-600 hover:text-[#fe2c55] px-4 py-2 text-sm font-semibold transition-all duration-300 hover:bg-gray-50 rounded-lg"
            >
              Privacy
            </Link>
            <Link 
              href="/terms" 
              className="text-gray-600 hover:text-[#fe2c55] px-4 py-2 text-sm font-semibold transition-all duration-300 hover:bg-gray-50 rounded-lg"
            >
              Terms
            </Link>
            <Link 
              href="/auth/login" 
              className="ml-2 bg-gradient-to-r from-[#fe2c55] to-[#e62a4d] hover:from-[#e62a4d] hover:to-[#d4284a] text-white px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Login
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
