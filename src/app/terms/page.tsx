import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-tiktok-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card">
          <div className="mb-8">
            <Link href="/" className="text-tiktok-primary hover:underline mb-4 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
            <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="space-y-6 text-gray-300">
              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Service Description</h2>
                <p>
                  This site provides aggregated view totals for your TikTok account. You must be the owner of the connected account to use this service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Acceptable Use</h2>
                <p>
                  You agree not to misuse the service or attempt to scrape or reverse engineer TikTok. You must use the service in compliance with TikTok&apos;s Terms of Service and our own policies.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Account Ownership</h2>
                <p>
                  You must be the legitimate owner of the TikTok account you connect to this service. You are responsible for maintaining the security of your account credentials.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Data Usage</h2>
                <p>
                  We only access the data necessary to calculate your total view count. We do not store your personal data or access tokens on our servers. All processing happens in memory and is discarded after each request.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Service Availability</h2>
                <p>
                  The service is provided &quot;as is&quot; without warranties of any kind. We do not guarantee uninterrupted access to the service or accurate results.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Limitation of Liability</h2>
                <p>
                  Our liability is limited to the maximum extent permitted by law. We are not responsible for any damages arising from the use of this service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Third-Party Services</h2>
                <p>
                  This service integrates with TikTok&apos;s API. Your use of this service is also subject to TikTok&apos;s Terms of Service and Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Termination</h2>
                <p>
                  We reserve the right to terminate or suspend access to the service at any time, with or without cause. You may also terminate your use of the service by revoking access to your TikTok account.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Changes to Terms</h2>
                <p>
                  We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Contact</h2>
                <p>
                  For questions about these terms, please contact us at:{' '}
                  <a href="mailto:legal@yourdomain.com" className="text-tiktok-primary hover:underline">
                    legal@yourdomain.com
                  </a>
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Governing Law</h2>
                <p>
                  These terms are governed by the laws of the jurisdiction in which this service operates. Any disputes will be resolved in the appropriate courts of that jurisdiction.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
