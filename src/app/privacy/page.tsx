import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-tiktok-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card">
          <div className="mb-8">
            <Link href="/" className="text-tiktok-primary hover:underline mb-4 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="space-y-6 text-gray-300">
              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Data Collection</h2>
                <p>
                  We do not collect or sell personal information. During pre-approval, this site displays sample data only and does not access your TikTok account.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Account Connection</h2>
                <p>
                  After you choose to connect your account (upon TikTok approval), we will request the minimal scopes needed to read your video list and view counts. Access tokens are used in memory to fetch totals and are not stored server-side by default.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Data Sharing</h2>
                <p>
                  No data is shared with third parties. We only use the data to calculate and display your total view count.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Data Retention</h2>
                <p>
                  We do not store your personal data or access tokens on our servers. All data processing happens in memory and is discarded after each request.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Cookies</h2>
                <p>
                  This site uses minimal cookies only for essential functionality. No tracking or analytics cookies are used.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Your Rights</h2>
                <p>
                  You have the right to:
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Revoke access to your TikTok account at any time</li>
                  <li>Request information about what data we process</li>
                  <li>Contact us with privacy concerns</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Contact</h2>
                <p>
                  For privacy-related questions, please contact us at:{' '}
                  <a href="mailto:support@yourdomain.com" className="text-tiktok-primary hover:underline">
                    support@yourdomain.com
                  </a>
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Changes to This Policy</h2>
                <p>
                  We may update this privacy policy from time to time. We will notify users of any material changes by posting the new policy on this page.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
