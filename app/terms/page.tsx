export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Terms of Service</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Acceptance of Terms</h2>
          <p className="text-gray-700 mb-4">
            By accessing and using TikTok Views Counter, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Service Description</h2>
          <p className="text-gray-700 mb-4">
            TikTok Views Counter is a web application that allows TikTok creators to view the total number of views 
            across all their videos by connecting their TikTok account through official OAuth.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">User Responsibilities</h2>
          <p className="text-gray-700 mb-4">
            You agree to:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>Provide accurate information when connecting your TikTok account</li>
            <li>Use the service only for lawful purposes</li>
            <li>Not attempt to circumvent any security measures</li>
            <li>Comply with TikTok&apos;s terms of service</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Data Usage</h2>
          <p className="text-gray-700 mb-4">
            We access your TikTok data solely to provide the core functionality of calculating total views. 
            We do not store your personal data permanently and do not share it with third parties.
          </p>
          <p className="text-gray-700 mb-4">
            Your use of our service is also subject to TikTok&apos;s privacy policy and terms of service.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Service Availability</h2>
          <p className="text-gray-700 mb-4">
            We strive to maintain high availability but cannot guarantee uninterrupted service. 
            The service may be temporarily unavailable due to maintenance or technical issues.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Limitation of Liability</h2>
          <p className="text-gray-700 mb-4">
            TikTok Views Counter is provided &quot;as is&quot; without warranties of any kind. 
            We are not liable for any damages arising from the use of our service.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Changes to Terms</h2>
          <p className="text-gray-700 mb-4">
            We reserve the right to modify these terms at any time. Continued use of the service 
            after changes constitutes acceptance of the new terms.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Contact</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about these Terms of Service, please contact us through our website.
          </p>
        </section>
      </div>
    </div>
  );
}
