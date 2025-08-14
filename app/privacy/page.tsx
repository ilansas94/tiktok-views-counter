export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Introduction</h2>
          <p className="text-gray-700 mb-4">
            TikTok Views Counter (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, and safeguard your information when you use our service.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Information We Collect</h2>
          <h3 className="text-xl font-medium mb-3 text-gray-900">OAuth Data</h3>
          <p className="text-gray-700 mb-4">
            When you connect your TikTok account, we receive access to:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>Basic user information (username, display name)</li>
            <li>Video list with view counts</li>
            <li>Video creation dates</li>
          </ul>
          <p className="text-gray-700 mb-4">
            We do not store your TikTok access tokens long-term. Tokens are used only for the duration of your session.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">
            We use the collected information solely to:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>Calculate and display your total video views</li>
            <li>Provide the core functionality of our service</li>
            <li>Improve user experience</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Data Storage and Security</h2>
          <p className="text-gray-700 mb-4">
            We do not permanently store your personal TikTok data. All calculations are performed in real-time 
            and we do not maintain a database of your individual video information.
          </p>
          <p className="text-gray-700 mb-4">
            We implement appropriate security measures to protect any temporary data during your session.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Third-Party Services</h2>
          <p className="text-gray-700 mb-4">
            We use TikTok&apos;s official Display API to access your data. This is the only third-party service 
            we interact with, and it is governed by TikTok&apos;s own privacy policy and terms of service.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Your Rights</h2>
          <p className="text-gray-700 mb-4">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>Disconnect your TikTok account at any time</li>
            <li>Request information about what data we access</li>
            <li>Contact us with privacy concerns</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about this Privacy Policy, please contact us through our website.
          </p>
        </section>
      </div>
    </div>
  );
}
