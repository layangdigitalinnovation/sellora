import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans selection:bg-[#5C4CFC]/20 selection:text-[#5C4CFC]">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="container max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-[#5C4CFC] rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg shadow-[#5C4CFC]/20 group-hover:rotate-6 transition-transform">
              S
            </div>
            <span className="font-bold text-xl tracking-tighter text-slate-900">Sellora</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#5C4CFC] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-3xl mx-auto px-6 py-16 md:py-24">
        <div className="bg-white rounded-[2rem] p-8 md:p-12 lg:p-16 shadow-xl ring-1 ring-slate-900/5">
          <div className="mb-12 border-b border-slate-100 pb-8">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Terms & Conditions</h1>
            <p className="text-slate-500 font-medium">Last updated: August 1, 2026</p>
          </div>
          
          <div className="space-y-8">
            <section>
              <h3 className="text-2xl font-black text-slate-900 mb-4">1. Agreement to Terms</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Sellora ("Company," "we," "us," or "our"), concerning your access to and use of the Sellora website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-black text-slate-900 mb-4">2. Intellectual Property Rights</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights and unfair competition laws.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-black text-slate-900 mb-4">3. User Representations</h3>
              <p className="text-slate-600 leading-relaxed font-medium mb-4">
                By using the Site, you represent and warrant that: 
              </p>
              <ul className="list-decimal pl-5 space-y-2 text-slate-600 font-medium">
                <li>All registration information you submit will be true, accurate, current, and complete.</li>
                <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
                <li>You will not access the Site through automated or non-human means, whether through a bot, script or otherwise.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-black text-slate-900 mb-4">4. Prohibited Activities</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us. As a user of the Site, you agree not to systematically retrieve data or other content from the Site to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-black text-slate-900 mb-4">5. Digital Products and Payouts</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                As a creator on Sellora, you are responsible for the digital products, courses, and memberships you sell. We facilitate the platform and checkout experience but do not hold ownership over your content. Payouts are processed subject to our payment partners' terms and timelines. We reserve the right to suspend accounts engaging in fraudulent activity or violating intellectual property rights.
              </p>
            </section>
            
            <hr className="border-slate-100 my-8" />
            
            <p className="text-sm text-slate-500 font-bold">
              If you have any questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@sellora.com" className="text-[#5C4CFC] hover:underline">
                legal@sellora.com
              </a>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
