'use client';

import { useEffect, useState, Suspense } from 'react';
import { CheckCircle2, Shield, CreditCard, ChevronRight, ArrowLeft } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

function SubscriptionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, lang } = useLanguage();
  const status = searchParams?.get('status');

  const [packages, setPackages] = useState<any[]>([]);
  const [activeSub, setActiveSub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchData = async () => {
      try {
        const profileRes = await fetch('http://127.0.0.1:3001/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!profileRes.ok) throw new Error('Unauthorized');
        const profileData = await profileRes.json();
        const currentUserId = profileData.userId;
        setUser(profileData);

        const [pkgRes, subRes] = await Promise.all([
          fetch('http://localhost:3001/api/subscriptions/packages'),
          fetch(`http://localhost:3001/api/subscriptions/user/${currentUserId}`)
        ]);

        const pkgs = await pkgRes.json();
        setPackages(pkgs);

        if (subRes.ok) {
          const text = await subRes.text();
          if (text) {
            const sub = JSON.parse(text);
            if (sub && sub.status === 'ACTIVE') {
              setActiveSub(sub);
            }
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCheckout = async (packageId: string) => {
    if (!user || !user.userId) {
      alert(t('subscription_page.invalid_session') || "Sesi pengguna tidak valid, silakan login kembali.");
      return;
    }

    setIsCheckingOut(packageId);
    try {
      const res = await fetch('http://localhost:3001/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.userId, packageId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Checkout gagal');

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('URL Pembayaran tidak ditemukan');
      }
    } catch (err: any) {
      alert(err.message);
      setIsCheckingOut(null);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="relative flex justify-center items-center">
          <div className="absolute animate-ping w-16 h-16 rounded-full bg-indigo-400 opacity-20"></div>
          <span className="relative z-10 animate-spin w-12 h-12 border-4 border-[#4361EE] border-t-transparent rounded-full shadow-lg"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12 font-sans text-slate-900 relative overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">

      {/* Background Orbs for Modern Glow */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-[120px] -translate-x-1/4 -translate-y-1/4 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-[120px] translate-x-1/4 translate-y-1/4 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto space-y-10 relative z-10">

        {/* Header & Back Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/70 backdrop-blur-xl p-5 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-white mb-8 gap-4 sm:gap-0">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-100/80 hover:text-[#4361EE] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('subscription_page.back_dashboard') || 'Kembali ke Dasbor'}
          </button>
          <div className="flex items-center gap-3 px-2 sm:px-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#4361EE] shadow-inner border border-indigo-100/50">
              <Shield className="w-5 h-5" />
            </div>
            <span className="font-black text-lg tracking-tight text-slate-800">{t('subscription_page.manage_subscription') || 'Manajemen Langganan'}</span>
          </div>
        </div>

        {/* Status Alerts */}
        {status === 'success' && (
          <div className="bg-emerald-50 text-emerald-700 p-6 rounded-[2rem] flex items-center gap-4 border border-emerald-200 shadow-lg shadow-emerald-100/50 animate-in fade-in slide-in-from-top-4">
            <div className="bg-emerald-100 p-2 rounded-full">
              <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-black text-emerald-800 text-lg">{t('subscription_page.payment_success') || 'Pembayaran Berhasil!'}</h4>
              <p className="text-sm font-medium mt-1">{t('subscription_page.payment_success_desc') || 'Paket berlangganan Anda sedang diaktifkan. Harap tunggu beberapa saat.'}</p>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="bg-red-50 text-red-700 p-6 rounded-[2rem] flex items-center gap-4 border border-red-200 shadow-lg shadow-red-100/50 animate-in fade-in slide-in-from-top-4">
            <p className="text-sm font-bold">{t('subscription_page.payment_failed') || 'Pembayaran gagal atau dibatalkan. Silakan coba kembali.'}</p>
          </div>
        )}

        {/* Current Plan Overview */}
        <div className="bg-white/80 backdrop-blur-2xl p-8 md:p-10 rounded-[3rem] shadow-2xl shadow-indigo-100/40 border border-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-linear-to-bl from-[#4361EE]/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 transition-all duration-700 group-hover:bg-[#4361EE]/20 pointer-events-none"></div>

          <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
            <div className="w-24 h-24 rounded-[2rem] bg-linear-to-br from-indigo-50 to-blue-50/50 border border-indigo-100 flex items-center justify-center text-[#4361EE] shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-500">
              <Shield className="w-12 h-12" />
            </div>
            <div className="space-y-1.5">
              <p className="text-[11px] font-black text-[#4361EE] uppercase tracking-[0.25em]">{t('subscription_page.current_plan') || 'Paket Saat Ini'}</p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
                {activeSub ? activeSub.package.name : (t('subscription_page.starter') || 'STARTER')}
              </h2>
              <p className="text-sm text-slate-500 font-medium max-w-sm leading-relaxed">
                {activeSub
                  ? `${t('subscription_page.valid_until') || 'Berlaku sampai'} ${new Date(activeSub.endDate).toLocaleDateString(lang === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`
                  : (t('subscription_page.starter_desc') || 'Gratis selamanya. Cocok untuk mencoba jualan pertama Anda.')}
              </p>
            </div>
          </div>
          <div className="relative z-10 w-full md:w-auto flex justify-start md:justify-end">
            <span className={`inline-flex items-center justify-center px-8 py-4 ${activeSub ? 'bg-linear-to-r from-emerald-400 to-green-500 text-white shadow-xl shadow-green-500/30' : 'bg-slate-100/80 text-slate-500'} rounded-2xl text-xs font-black uppercase tracking-widest backdrop-blur-md`}>
              {activeSub ? (t('subscription_page.premium_active') || 'Premium Aktif') : (t('subscription_page.free_active') || 'Free Plan Aktif')}
            </span>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="pt-12 pb-8">
          <div className="text-center mb-16 space-y-5 px-4">
            <h3 className="text-4xl md:text-5xl font-black tracking-tight inline-block text-transparent bg-clip-text bg-linear-to-r from-slate-900 to-slate-600">
              {t('subscription_page.choose_best') || 'Pilih Paket Terbaikmu'}
            </h3>
            <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
              {t('subscription_page.unlock_features') || 'Buka semua fitur eksklusif, hapus batasan, dan maksimalkan pendapatan toko Anda hari ini juga.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">

            {/* Starter Card (Always Free) */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-8 lg:p-10 shadow-xl shadow-slate-200/50 border border-white flex flex-col hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/80 transition-all duration-500 relative group overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-b from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

              <div className="relative z-10 flex-1 flex flex-col">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{t('subscription_page.starter') || 'STARTER'}</h4>
                <div className="mt-6 mb-10 flex items-baseline flex-wrap gap-1.5">
                  <span className="text-4xl xl:text-5xl font-black text-slate-800 tracking-tighter">Rp0</span>
                  <span className="text-sm font-bold text-slate-400">{t('subscription_page.forever') || '/selamanya'}</span>
                </div>

                <ul className="space-y-5 flex-1 mb-10">
                  {[
                    t('subscription_page.fee_3_percent') || 'Fee transaksi 3%',
                    t('subscription_page.subdomain_platform') || 'Subdomain platform',
                    t('subscription_page.max_3_products') || 'Maksimal 3 produk digital'
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3.5 text-sm text-slate-600 font-semibold leading-relaxed">
                      <div className="mt-0.5 bg-slate-100 p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" /></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button disabled className="w-full py-4 lg:py-5 rounded-2xl font-black bg-slate-100/80 text-slate-400 uppercase tracking-widest text-[10px] lg:text-xs">
                  {activeSub ? (t('subscription_page.downgrade') || 'Turunkan Paket') : (t('subscription_page.current_plan_btn') || 'Paket Saat Ini')}
                </button>
              </div>
            </div>

            {/* Dynamic Packages from API */}
            {packages.map((pkg, index) => {
              const isCurrent = activeSub?.packageId === pkg.id;
              const isHighlighted = index === packages.length - 1; // Highlight the last package (Enterprise)
              return (
                <div key={pkg.id} className={`rounded-[3rem] p-1 relative flex flex-col transform hover:-translate-y-2 transition-all duration-500 group ${
                  isHighlighted 
                    ? 'shadow-2xl shadow-indigo-500/20 bg-linear-to-b from-[#4361EE] to-[#2b44b8] hover:shadow-indigo-500/40' 
                    : 'shadow-xl shadow-slate-200/50 bg-slate-200 hover:shadow-slate-300/50'
                }`}>
                  <div className="bg-white h-full rounded-[2.8rem] p-8 lg:p-10 relative flex flex-col overflow-hidden">

                    {/* Glowing effect inside card */}
                    <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-colors duration-500 ${
                      isHighlighted ? 'bg-indigo-400/10 group-hover:bg-indigo-400/20' : 'bg-slate-400/5 group-hover:bg-slate-400/10'
                    }`}></div>

                    {isHighlighted && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-linear-to-r from-[#4361EE] to-[#3a55d6] text-white px-6 py-1.5 lg:px-8 lg:py-2 rounded-b-2xl text-[9px] lg:text-[10px] whitespace-nowrap font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/30">
                        {t('subscription_page.recommended') || 'Rekomendasi'}
                      </div>
                    )}

                    <div className={`relative z-10 flex-1 flex flex-col ${isHighlighted ? 'mt-4' : 'mt-0'}`}>
                      <h4 className={`text-xs font-black uppercase tracking-[0.2em] ${isHighlighted ? 'text-[#4361EE]' : 'text-slate-500'}`}>{pkg.name}</h4>
                      <div className="mt-6 mb-10 flex items-baseline flex-wrap gap-1.5">
                        <span className="text-4xl xl:text-5xl font-black text-slate-800 tracking-tighter">Rp{Number(pkg.price).toLocaleString()}</span>
                        <span className="text-sm font-bold text-slate-400">{pkg.billingPeriod === 'MONTHLY' ? (t('subscription_page.mo') || '/bln') : (t('subscription_page.yr') || '/thn')}</span>
                      </div>

                      <ul className="space-y-5 flex-1 mb-10">
                        {pkg.features?.map((f: string, i: number) => (
                          <li key={i} className="flex items-start gap-3.5 text-sm text-slate-700 font-semibold leading-relaxed">
                            <div className={`mt-0.5 p-1 rounded-full ${isHighlighted ? 'bg-indigo-50 text-[#4361EE]' : 'bg-slate-100 text-slate-500'}`}>
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                            </div>
                            {f}
                          </li>
                        ))}
                      </ul>

                      <button
                        disabled={isCurrent || isCheckingOut === pkg.id}
                        onClick={() => handleCheckout(pkg.id)}
                        className={`w-full py-4 lg:py-5 px-2 rounded-2xl font-black shadow-xl flex items-center justify-center gap-1 lg:gap-2.5 transition-all duration-300 uppercase tracking-widest text-[10px] lg:text-xs ${isCurrent
                            ? 'bg-linear-to-r from-green-400 to-emerald-500 text-white shadow-green-500/25'
                            : isHighlighted 
                              ? 'bg-linear-to-r from-[#4361EE] to-[#3651c9] text-white hover:shadow-indigo-500/40 hover:scale-[1.02]'
                              : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-slate-500/30 hover:scale-[1.02]'
                          }`}
                      >
                        {isCheckingOut === pkg.id ? (
                          <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span>
                        ) : isCurrent ? (
                          <>{t('subscription_page.current_plan_btn') || 'Paket Saat Ini'}</>
                        ) : (
                          <>{t('subscription_page.subscribe_now') || 'Berlangganan Sekarang'} <ChevronRight className="w-4 h-4" /></>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="relative flex justify-center items-center">
          <div className="absolute animate-ping w-16 h-16 rounded-full bg-indigo-400 opacity-20"></div>
          <span className="relative z-10 animate-spin w-12 h-12 border-4 border-[#4361EE] border-t-transparent rounded-full shadow-lg"></span>
        </div>
      </div>
    }>
      <SubscriptionContent />
    </Suspense>
  );
}
