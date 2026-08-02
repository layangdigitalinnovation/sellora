'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const slug = searchParams.get('slug');

  useEffect(() => {
    // Show the success animation for 2.5 seconds, then redirect to order page
    if (slug && orderId) {
      const timer = setTimeout(() => {
        router.push(`/${slug}/order/${orderId}`);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [orderId, slug, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 font-sans p-6 text-center">
      <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/40 animate-[bounce_1s_infinite]">
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h1 className="text-3xl font-black mb-2 tracking-tight">Pembayaran Berhasil!</h1>
      <p className="text-slate-500 font-medium text-lg">Tunggu sebentar, mengarahkan ke pesanan Anda...</p>
    </div>
  );
}
