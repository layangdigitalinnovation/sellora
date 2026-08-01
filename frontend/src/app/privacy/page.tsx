import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Privacy Policy</h1>
            <p className="text-slate-500 font-medium">Last updated: August 1, 2026</p>
          </div>
          
          <div className="space-y-8">
            <section>
              <h3 className="text-2xl font-black text-slate-900 mb-4">1. Introduction</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Welcome to Sellora. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-black text-slate-900 mb-4">2. The Data We Collect About You</h3>
              <p className="text-slate-600 leading-relaxed font-medium mb-4">
                Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-600 font-medium">
                <li><strong className="text-slate-800">Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong className="text-slate-800">Contact Data:</strong> includes billing address, email address and telephone numbers.</li>
                <li><strong className="text-slate-800">Financial Data:</strong> includes bank account and payment card details (processed securely via our payment partners).</li>
                <li><strong className="text-slate-800">Transaction Data:</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-black text-slate-900 mb-4">3. How We Use Your Personal Data</h3>
              <p className="text-slate-600 leading-relaxed font-medium mb-4">
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-600 font-medium">
                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                <li>Where we need to comply with a legal obligation.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-black text-slate-900 mb-4">4. Data Security</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-black text-slate-900 mb-4">5. Your Legal Rights</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.
              </p>
            </section>
            
            <hr className="border-slate-100 my-8" />
            
            <p className="text-sm text-slate-500 font-bold">
              If you have any questions about this privacy policy or our privacy practices, please contact us at{' '}
              <a href="mailto:privacy@sellora.com" className="text-[#5C4CFC] hover:underline">
                privacy@sellora.com
              </a>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
