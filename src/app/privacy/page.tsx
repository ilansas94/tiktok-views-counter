import Link from 'next/link'

// Global configuration values
const COMPANY_NAME = "TotalViews"
const CONTACT_EMAIL = "ilansas94@gmail.com"
const JURISDICTION = "Israel"
const RETENTION_MONTHS = 12

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
            <p className="text-gray-400">Effective date: {new Date().toISOString().slice(0,10)}</p>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="space-y-6 text-gray-300">
                              <p>
                  {COMPANY_NAME} (&quot;we&quot;, &quot;us&quot;) provides a simple way to view the total views across your TikTok account and optionally submit your total to a public leaderboard.
                </p>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Scopes We Use</h2>
                <p>We ask you to grant the following TikTok scopes so we can provide the core functionality:</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li><code>user.info.basic</code> &amp; <code>user.info.profile</code> — to display your TikTok display name and avatar in the app and (if you choose) on the leaderboard.</li>
                  <li><code>video.list</code> — to read your <em>public</em> videos to calculate your total views (we do not access private videos).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Data We Collect &amp; Store</h2>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li><strong>Profile info</strong> — TikTok user ID, username, display name, avatar URL.</li>
                  <li><strong>Public video metadata</strong> — list of your public videos and their view counts, used only to compute the total views metric.</li>
                  <li><strong>Access tokens</strong> — short-lived tokens issued by TikTok to read the data above after you authorize; used server-side and not kept longer than needed for the request.</li>
                </ul>
                <p className="mt-2">
                  Leaderboard entries (username/display name/avatar/total views) are stored in <strong>Vercel KV (Upstash Redis)</strong> hosted in the <strong>EU (e.g., Frankfurt)</strong>. We retain leaderboard data until you remove it or for <strong>{RETENTION_MONTHS} months of inactivity</strong>, whichever happens first.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">User Choices</h2>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li><strong>Revoke TikTok access</strong>: In the TikTok app → Profile → ☰ → Settings &amp; privacy → Security &amp; permissions → Apps &amp; websites → remove access.</li>
                  <li><strong>Delete leaderboard entry</strong>: use &quot;Remove from Leaderboard&quot; in the app or email us at {CONTACT_EMAIL}. We delete within 7 days.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Sharing</h2>
                <p>We do not sell personal data. We use Vercel (hosting) and Upstash (database) as processors to operate the service; no other third parties receive your data.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Children</h2>
                <p>The service is for individuals aged 13+ only. We do not knowingly process personal data of children under 13.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Security</h2>
                <p>We apply reasonable technical and organizational measures appropriate to the risk to protect your information. No method of transmission or storage is 100% secure.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-white">Contact</h2>
                <p>Questions? Email us at <a href={`mailto:${CONTACT_EMAIL}`} className="text-tiktok-primary hover:underline">{CONTACT_EMAIL}</a>.</p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
