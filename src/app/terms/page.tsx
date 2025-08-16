import Link from 'next/link'

// Global configuration values
const COMPANY_NAME = "TotalViews"
const CONTACT_EMAIL = "ilansas94@gmail.com"
const JURISDICTION = "Israel"
const RETENTION_MONTHS = 12

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
            <p className="text-gray-400">Effective date: {new Date().toISOString().slice(0,10)}</p>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="space-y-6 text-gray-300">
              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Overview</h2>
                <p>{COMPANY_NAME} provides a tool to view your total TikTok views and optionally submit your total to a public leaderboard. These Terms govern your use of the service.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Eligibility</h2>
                <p>You must be 13+ and the rightful owner/controller of the TikTok account you connect.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Permissions and TikTok Scopes</h2>
                <p>By authorizing via TikTok, you allow us to access the scopes you approve (user.info.basic, user.info.profile, video.list) solely to provide the features described in the app.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">User Content &amp; License</h2>
                <p>You grant us a limited, revocable license to display your public TikTok profile (name, avatar) and your total views in the app and on the leaderboard. You can withdraw by removing access or deleting your entry.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Data &amp; Deletion</h2>
                <p>Leaderboard entries are stored in Vercel KV (Upstash Redis). You may remove your entry at any time in the app, or by emailing {CONTACT_EMAIL}. We process deletion within 7 days.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Prohibited Uses</h2>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>No scraping, reverse engineering, or bypassing TikTok security.</li>
                  <li>No misuse of tokens or data; only use the service as intended.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Availability &amp; Changes</h2>
                <p>We may update, suspend, or discontinue the service at any time.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Disclaimers &amp; Liability</h2>
                <p>The service is provided &quot;as is&quot; without warranties. To the extent permitted by law, our liability is limited to direct damages and capped at the greater of USD $50 or the amount you paid us in the last 12 months.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Governing Law</h2>
                <p>These Terms are governed by the laws of {JURISDICTION}, unless mandatory law says otherwise.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Contact</h2>
                <p>Contact us at <a href={`mailto:${CONTACT_EMAIL}`} className="text-tiktok-primary hover:underline">{CONTACT_EMAIL}</a>.</p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
