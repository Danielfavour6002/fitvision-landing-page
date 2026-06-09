// src/pages/PrivacyPolicy.tsx
// formiq brand — #1E56F5 blue · Satoshi font · Black background

function Pill({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center bg-[#1E56F5] text-white text-[10px] font-black tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-5">
      {text}
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-white font-black text-base uppercase tracking-wider pb-2 border-b border-white/10"
        style={{ fontFamily: "Satoshi, Inter, sans-serif" }}>
        {title}
      </h2>
      <div className="space-y-3 text-white/65 text-[14px] leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#0a1530] border border-[#1E56F5]/30 rounded-xl p-5">
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 bg-[#1E56F5] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg width="12" height="12" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div className="text-white/80 text-[13px] leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function ThirdPartyRow({ name, purpose, link }: { name: string; purpose: string; link: string }) {
  return (
    <div className="bg-[#111] rounded-xl p-4 flex items-start justify-between gap-4">
      <div>
        <p className="text-white font-bold text-sm">{name}</p>
        <p className="text-white/45 text-[12px] mt-0.5">{purpose}</p>
      </div>
      <a href={link} target="_blank" rel="noopener noreferrer"
        className="text-[#1E56F5] text-[10px] uppercase tracking-wider hover:underline flex-shrink-0 mt-1">
        Policy →
      </a>
    </div>
  );
}

export default function PrivacyPolicy() {
  return (
    <div className="bg-black min-h-screen" style={{ fontFamily: "Satoshi, Inter, sans-serif" }}>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/95 backdrop-blur-sm border-b border-white/8">
        <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="w-7 h-7 bg-[#1E56F5] rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="4" r="2.5" fill="white"/>
              <path d="M12 7L8 12L10 14L9 20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M12 7L16 11L14 14L15 20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-white font-black text-base">formiq</span>
        </a>
        <a href="/" className="text-white/40 hover:text-white text-[11px] font-semibold tracking-[0.12em] uppercase transition-colors">
          ← Back to Home
        </a>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">

        {/* Header */}
        <Pill text="Legal"/>
        <h1 className="font-black text-white uppercase leading-tight mb-3"
          style={{ fontFamily: "Satoshi, Inter, sans-serif", fontSize: "clamp(1.8rem,5vw,3rem)" }}>
          Privacy Policy
        </h1>
        <p className="text-white/40 text-sm mb-12">
          Last updated: June 2026 · Effective: June 2026
        </p>

        <div className="space-y-10">

          <p className="text-white/65 text-[14px] leading-relaxed">
            formiq ("we", "our", "us") is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, and protect your
            information when you use the formiq app and website (the "Service").
            By using our Service, you agree to the terms of this policy.
          </p>

          {/* Camera notice — most important for fitness AI app */}
          <Highlight>
            <strong className="text-white block mb-1">📷 Camera & Microphone</strong>
            formiq uses your device camera and microphone to provide real-time
            coaching. <strong className="text-white">Your camera feed is processed in real time and is
            never stored, recorded, or retained after the session ends.</strong> Video
            frames are sent to Google's Gemini AI for analysis only during the
            active session. You can revoke these permissions at any time in your
            device settings.
          </Highlight>

          <Section title="1. Information We Collect">
            <div className="space-y-5">
              <div>
                <p className="text-white font-bold text-sm mb-2">Information You Provide</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>First name (to personalise your coaching experience)</li>
                  <li>Email address (when joining the waitlist or creating an account)</li>
                  <li>Approximate weight range (used only for calorie estimates)</li>
                  <li>Fitness goals and exercise preferences</li>
                </ul>
              </div>
              <div>
                <p className="text-white font-bold text-sm mb-2">Session Data We Generate</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Exercise type, duration, and set count</li>
                  <li>Form score (a numerical score — not video)</li>
                  <li>AI coaching summary (text only)</li>
                  <li>Calorie estimate (calculated from exercise type and weight range)</li>
                  <li>Session timestamps</li>
                </ul>
              </div>
              <div>
                <p className="text-white font-bold text-sm mb-2">Usage Data</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Device type and operating system</li>
                  <li>App usage patterns and session frequency</li>
                  <li>Crash reports and error logs</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section title="2. How We Use Your Information">
            <ul className="list-disc list-inside space-y-2">
              <li>To provide real-time AI coaching and form analysis</li>
              <li>To generate your form score history and progress tracking</li>
              <li>To calculate calorie estimates for completed sessions</li>
              <li>To send session summaries and progress updates</li>
              <li>To notify you about product updates and your waitlist status</li>
              <li>To process payments and manage your subscription</li>
              <li>To improve AI coaching accuracy using anonymised, aggregated data only</li>
              <li>To comply with legal obligations</li>
            </ul>
            <p className="mt-2 p-3 bg-white/5 rounded-lg text-[13px]">
              We do not sell your personal information. We do not use your data for advertising.
            </p>
          </Section>

          <Section title="3. Third-Party Services">
            <p className="mb-4">
              We share your information only with the following service providers
              who help us operate the Service:
            </p>
            <div className="space-y-3">
              <ThirdPartyRow
                name="Google (Gemini AI)"
                purpose="Real-time AI coaching analysis and voice generation"
                link="https://policies.google.com/privacy"
              />
              <ThirdPartyRow
                name="Stream (GetStream.io)"
                purpose="Real-time video call infrastructure for coaching sessions"
                link="https://getstream.io/legal/privacy-policy/"
              />
              <ThirdPartyRow
                name="Supabase"
                purpose="Database storage for session history and account data"
                link="https://supabase.com/privacy"
              />
              <ThirdPartyRow
                name="Stripe"
                purpose="Payment processing for Pro Coach subscriptions"
                link="https://stripe.com/privacy"
              />
            </div>
          </Section>

          <Section title="4. Data Retention">
            <ul className="list-disc list-inside space-y-2">
              <li>Session history and form scores are retained while your account is active</li>
              <li>If you delete your account, all personal data is deleted within 30 days</li>
              <li>Waitlist email addresses are retained until you unsubscribe or request deletion</li>
              <li><strong className="text-white">Video footage is never stored</strong> — processed in real time only</li>
              <li>Payment records are retained as required by applicable law</li>
            </ul>
          </Section>

          <Section title="5. Your Rights">
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-white">Access</strong> — request a copy of all data we hold about you</li>
              <li><strong className="text-white">Correction</strong> — request correction of inaccurate data</li>
              <li><strong className="text-white">Deletion</strong> — request deletion of your account and all data</li>
              <li><strong className="text-white">Portability</strong> — request your session data in a portable format</li>
              <li><strong className="text-white">Withdrawal</strong> — withdraw consent at any time by deleting your account</li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, email{" "}
              <a href="mailto:privacy@formiq.app" className="text-[#1E56F5] hover:underline">
                privacy@formiq.app
              </a>.
              We respond within 30 days.
            </p>
          </Section>

          <Section title="6. Security">
            <p>
              We use industry-standard security measures including SSL/TLS encryption
              for all data in transit and encrypted database storage. No method of
              internet transmission is 100% secure. Contact us immediately if you
              suspect unauthorised access to your account.
            </p>
          </Section>

          <Section title="7. Children's Privacy">
            <p>
              formiq is not intended for users under 13. We do not knowingly collect
              data from children under 13. If you believe your child has provided us
              with personal information, contact{" "}
              <a href="mailto:privacy@formiq.app" className="text-[#1E56F5] hover:underline">
                privacy@formiq.app
              </a>{" "}
              and we will delete it immediately.
            </p>
          </Section>

          <Section title="8. Changes to This Policy">
            <p>
              We may update this Privacy Policy. We will notify you of significant
              changes by email or through the app. Continued use after changes are
              posted constitutes acceptance.
            </p>
          </Section>

          <Section title="9. Contact">
            <div className="bg-[#111] rounded-xl p-5 space-y-2 mt-2">
              <p className="text-white font-black">formiq</p>
              <p className="text-sm">Privacy: <a href="mailto:privacy@formiq.app" className="text-[#1E56F5] hover:underline">privacy@formiq.app</a></p>
              <p className="text-sm">Support: <a href="mailto:support@formiq.app" className="text-[#1E56F5] hover:underline">support@formiq.app</a></p>
              <p className="text-sm">Website: <a href="https://formiq.app" className="text-[#1E56F5] hover:underline">formiq.app</a></p>
            </div>
          </Section>

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black border-t border-white/8 py-8 px-5 text-center">
        <div className="flex flex-wrap items-center justify-center gap-6 mb-4">
          <a href="/privacy" className="text-[#1E56F5] text-[10px] uppercase tracking-[0.2em]">Privacy Policy</a>
          <a href="/terms" className="text-white/30 hover:text-white/65 text-[10px] uppercase tracking-[0.2em] transition-colors">Terms of Service</a>
          <a href="/" className="text-white/30 hover:text-white/65 text-[10px] uppercase tracking-[0.2em] transition-colors">Home</a>
        </div>
        <p className="text-white/15 text-[9px] tracking-wider">© 2026 formiq. All rights reserved.</p>
      </footer>

    </div>
  );
}