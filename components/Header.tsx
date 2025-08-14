import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/favicon.png"
                alt="TikTok Views Counter"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-xl font-bold text-gray-900">
                TikTok Views Counter
              </span>
            </Link>
          </div>
          
          <nav className="flex space-x-8">
            <Link 
              href="/privacy" 
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
            >
              Privacy
            </Link>
            <Link 
              href="/terms" 
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
            >
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
