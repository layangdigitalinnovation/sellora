'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Check, 
  Menu,
  X,
  Globe, 
  Zap, 
  BarChart3, 
  Users,
  Shield, 
  Star,
  ArrowRight,
  Sparkles,
  ChevronRight,
  PlayCircle,
  Video,
  Smartphone,
  Calendar,
  GraduationCap,
  Mail,
  XCircle
} from 'lucide-react';

const dict = {
  en: {
    nav: { features: 'Features', blog: 'Blog', showcase: 'Showcase', login: 'Login', cta: 'Create Store' },
    hero: {
      badge: 'SaaS Creator Store No. 1',
      title: 'Meet Your All-in-One',
      titleHighlight: 'Creator Store',
      desc: 'The easiest way to sell Digital Products, Courses, and Memberships. Get your own professional storefront in minutes with zero coding required.',
      placeholder: 'yourname',
      cta: 'Get Started',
      socialProof: 'Trusted by 1,000+ Creators'
    },
    creators: {
      title: 'The Real Creators Use Sellora 🚀',
      desc: 'Join thousands of creators who are already monetizing their audience.',
    },
    testimonials: {
      title: 'See What People Are Saying ✨',
      desc: 'Creators are making more money with Sellora than any other platform.'
    },
    zeroFees: {
      title: '0%',
      desc: 'Transaction Fees, Always.'
    },
    features: {
      title: 'Not just another link in bio 🚀',
      desc: 'Everything you need to run your digital business from one place.',
      list: [
        { title: 'Digital Products', desc: 'Sell ebooks, templates, & more.' },
        { title: 'Courses', desc: 'Host and sell your video courses.' },
        { title: 'Memberships', desc: 'Build recurring revenue.' },
        { title: 'Calendar', desc: 'Book 1:1 sessions effortlessly.' },
      ]
    },
    comparison: {
      title: 'A Simple Solution ✌️',
      desc: 'Stop paying for multiple tools. Get everything in one place.',
      items: [
        { icon: 'Smartphone', name: 'Mobile Optimized "Link-in-Bio" Store', replaces: 'Replaces Linktree, Beacons', price: '$29' },
        { icon: 'Calendar', name: 'Calendar Invites & Bookings', replaces: 'Replaces Calendly', price: '$15' },
        { icon: 'GraduationCap', name: 'Course Builder', replaces: 'Replaces Kajabi, Teachable', price: '$119' },
        { icon: 'BarChart3', name: 'Audience Analytics', replaces: 'Replaces Google Analytics', price: '$10' },
        { icon: 'Mail', name: 'Email List / Newsletter Builder', replaces: 'Replaces Mailchimp', price: '$29' },
      ],
      totalText: 'What You\'d Spend Otherwise',
      totalPrice: '$202/yr',
      selloraText: 'Join the Sellora Fam ✨',
      selloraPrice: '$8.32/yr'
    },
    integrations: {
      title: 'No Coding Required',
      desc: 'Connect your favorite tools in 1-click and start selling instantly.',
      checkoutTitle: '1-Tap Checkout',
      checkoutDesc: 'Frictionless checkout experience optimized for maximum conversion.'
    },
    pricing: {
      title: 'Simple Pricing for Creators.',
      monthly: 'Monthly',
      yearly: 'Yearly',
      save: 'Save 20%',
      freeTitle: 'Starter',
      freePrice: 'Rp 0',
      freeDesc: '/forever',
      select: 'Select',
      startNow: 'Start Now'
    },
    cta: {
      title: 'Try Sellora For 14 Days Free',
      btn: 'Start Your Free Trial'
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        { q: 'What is Sellora?', a: 'Sellora is an all-in-one platform for creators to sell digital products, courses, and memberships without coding.' },
        { q: 'Are there any transaction fees?', a: 'No, Sellora takes 0% transaction fees. You keep 100% of what you earn.' },
        { q: 'Can I use my own custom domain?', a: 'Yes! You can connect your custom domain on all our paid plans.' }
      ]
    },
    footer: {
      desc: 'The best solution for creators to monetize their digital works independently and professionally.',
      faq: 'FAQ',
      privacy: 'Privacy Policy',
      terms: 'Terms & Conditions',
      rights: '© 2026 Sellora. Made with ❤️ for Creators worldwide.'
    }
  },
  id: {
    nav: { features: 'Fitur', blog: 'Blog', showcase: 'Showcase', login: 'Masuk', cta: 'Buat Toko' },
    hero: {
      badge: 'SaaS Jualan Digital No. 1',
      title: 'Temui Toko',
      titleHighlight: 'Kreator All-in-One Kamu',
      desc: 'Cara termudah menjual Produk Digital, Kursus, dan Membership. Miliki toko profesionalmu dalam hitungan menit tanpa perlu coding.',
      placeholder: 'namakamu',
      cta: 'Mulai Sekarang',
      socialProof: 'Dipercaya 1.000+ Kreator'
    },
    creators: {
      title: 'Kreator Asli Menggunakan Sellora 🚀',
      desc: 'Bergabunglah dengan ribuan kreator yang sudah menghasilkan uang dari audiens mereka.',
    },
    testimonials: {
      title: 'Apa Kata Mereka ✨',
      desc: 'Kreator menghasilkan lebih banyak uang dengan Sellora dibanding platform lain.'
    },
    zeroFees: {
      title: '0%',
      desc: 'Biaya Transaksi, Selamanya.'
    },
    features: {
      title: 'Bukan sekadar link in bio biasa 🚀',
      desc: 'Semua yang kamu butuhkan untuk menjalankan bisnis digital dari satu tempat.',
      list: [
        { title: 'Produk Digital', desc: 'Jual ebook, template, & lainnya.' },
        { title: 'Kursus', desc: 'Hosting dan jual kursus videomu.' },
        { title: 'Membership', desc: 'Bangun pendapatan berulang.' },
        { title: 'Kalender', desc: 'Booking sesi 1:1 dengan mudah.' },
      ]
    },
    comparison: {
      title: 'Solusi Simpel ✌️',
      desc: 'Berhenti bayar banyak tools. Dapatkan semuanya di satu tempat.',
      items: [
        { icon: 'Smartphone', name: 'Toko "Link-in-Bio" Optimasi Mobile', replaces: 'Menggantikan Linktree, Beacons', price: 'Rp 435rb' },
        { icon: 'Calendar', name: 'Sistem Booking & Kalender', replaces: 'Menggantikan Calendly', price: 'Rp 225rb' },
        { icon: 'GraduationCap', name: 'Pembuat Kursus Digital', replaces: 'Menggantikan Kajabi, Teachable', price: 'Rp 1,78jt' },
        { icon: 'BarChart3', name: 'Analisis Audiens', replaces: 'Menggantikan Google Analytics', price: 'Rp 150rb' },
        { icon: 'Mail', name: 'Email & Newsletter Builder', replaces: 'Menggantikan Mailchimp', price: 'Rp 435rb' },
      ],
      totalText: 'Apa Yang Kamu Bayar Di Tempat Lain',
      totalPrice: 'Rp 3,03jt/thn',
      selloraText: 'Bergabung dengan Sellora Fam ✨',
      selloraPrice: 'Rp 150.000/thn'
    },
    integrations: {
      title: 'Tanpa Perlu Coding',
      desc: 'Hubungkan tool favoritmu dengan 1-klik dan mulai jualan instan.',
      checkoutTitle: 'Checkout 1-Klik',
      checkoutDesc: 'Pengalaman checkout tanpa hambatan yang dioptimalkan untuk konversi maksimal.'
    },
    pricing: {
      title: 'Harga Simpel untuk Kreator.',
      monthly: 'Bulanan',
      yearly: 'Tahunan',
      save: 'Hemat 20%',
      freeTitle: 'Starter',
      freePrice: 'Rp 0',
      freeDesc: '/selamanya',
      select: 'Pilih',
      startNow: 'Mulai Sekarang'
    },
    cta: {
      title: 'Coba Sellora Gratis 14 Hari',
      btn: 'Mulai Trial Gratis'
    },
    faq: {
      title: 'Pertanyaan yang Sering Diajukan',
      items: [
        { q: 'Apa itu Sellora?', a: 'Sellora adalah platform all-in-one bagi kreator untuk menjual produk digital, kursus, dan membership tanpa perlu coding.' },
        { q: 'Apakah ada potongan biaya transaksi?', a: 'Tidak, Sellora mengenakan biaya transaksi 0%. Anda mendapatkan 100% dari penghasilan Anda.' },
        { q: 'Bisakah saya menggunakan domain custom?', a: 'Tentu! Anda bisa menghubungkan domain Anda sendiri di semua paket berbayar kami.' }
      ]
    },
    footer: {
      desc: 'Solusi terbaik kreator untuk menguangkan karya digital secara mandiri dan profesional.',
      faq: 'FAQ',
      privacy: 'Kebijakan Privasi',
      terms: 'Syarat & Ketentuan',
      rights: '© 2026 Sellora. Dibuat dengan ❤️ untuk Kreator.'
    }
  }
};

export default function HomePage() {
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const t = dict[lang];

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans selection:bg-[#5C4CFC]/20 selection:text-[#5C4CFC] overflow-x-hidden">
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="container max-w-7xl mx-auto px-8 md:px-12 lg:px-16 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#5C4CFC] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#5C4CFC]/20 group-hover:rotate-6 transition-transform">
              S
            </div>
            <span className="font-bold text-2xl tracking-tighter text-slate-900">Sellora</span>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-600">
            <Link href="#features" className="hover:text-[#5C4CFC] transition-colors">{t.nav.features}</Link>
            <Link href="/blog" className="hover:text-[#5C4CFC] transition-colors">{t.nav.blog}</Link>
            <Link href="#" className="hover:text-[#5C4CFC] transition-colors">{t.nav.showcase}</Link>
            
            {/* Language Toggle */}
            <div className="flex bg-slate-100 rounded-full p-1 border border-slate-200">
              <button 
                onClick={() => setLang('en')} 
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${lang === 'en' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLang('id')} 
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${lang === 'id' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
              >
                ID
              </button>
            </div>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-sm font-bold text-slate-700 hover:text-[#5C4CFC] transition-colors">{t.nav.login}</Link>
            <Link href="/register" className="bg-[#5C4CFC] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-[#5C4CFC]/20 hover:bg-[#4a3ce0] transition-colors">
              {t.nav.cta}
            </Link>
            <button 
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-xl"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-100 p-6 space-y-4">
            <Link href="#features" className="block text-lg font-bold text-slate-600" onClick={() => setIsMobileMenuOpen(false)}>{t.nav.features}</Link>
            <Link href="/blog" className="block text-lg font-bold text-slate-600" onClick={() => setIsMobileMenuOpen(false)}>{t.nav.blog}</Link>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setLang('en')} className={`px-4 py-2 rounded-lg text-sm font-bold ${lang === 'en' ? 'bg-[#5C4CFC] text-white' : 'bg-slate-100 text-slate-600'}`}>English</button>
              <button onClick={() => setLang('id')} className={`px-4 py-2 rounded-lg text-sm font-bold ${lang === 'id' ? 'bg-[#5C4CFC] text-white' : 'bg-slate-100 text-slate-600'}`}>Indonesia</button>
            </div>
            <Link href="/login" className="block text-lg font-bold text-slate-600 pt-2">{t.nav.login}</Link>
          </div>
        )}
      </header>

      {/* Vibrant Hero Section */}
      <section className="relative pt-20 pb-10 lg:pt-24 lg:pb-12 bg-[#5C4CFC] overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-[#7A6BFF] to-transparent rounded-full opacity-50 blur-[100px] translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-t from-[#4335C7] to-transparent rounded-full opacity-40 blur-[80px] -translate-x-1/4 translate-y-1/4"></div>
        
        <div className="container max-w-7xl mx-auto px-8 md:px-12 lg:px-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white font-bold text-xs uppercase tracking-widest mx-auto lg:mx-0">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00D879]"></span>
                </span>
                {t.hero.badge}
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-black tracking-tight leading-[1.1] text-white">
                {t.hero.title} <br />
                <span className="text-[#00D879]">{t.hero.titleHighlight}</span>
              </h1>
              
              <p className="text-base md:text-lg text-white/80 font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
                {t.hero.desc}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link href="/register" className="w-full sm:w-auto bg-[#00D879] text-slate-900 px-8 py-4 rounded-full text-lg font-black shadow-[0_0_40px_rgba(0,216,121,0.4)] hover:scale-105 transition-transform flex items-center justify-center gap-2">
                  {t.hero.cta} <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-[#5C4CFC] overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Creator" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="text-sm font-bold text-white/90">
                  {t.hero.socialProof}
                </div>
              </div>
            </div>

            {/* Hero Mockup */}
            <div className="relative hidden lg:block h-[500px]">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-[320px] h-[640px] bg-white rounded-[2.5rem] shadow-2xl p-3.5 rotate-[-5deg] hover:rotate-[-2deg] transition-transform duration-700 ease-out border-8 border-slate-900 overflow-hidden z-20">
                <div className="w-full h-full bg-slate-50 rounded-[1.5rem] overflow-hidden relative">
                  {/* Mockup Store UI */}
                  <div className="h-48 bg-slate-200 relative">
                    <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" alt="Cover" />
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full border-4 border-white overflow-hidden shadow-lg">
                      <img src="https://i.pravatar.cc/150?img=47" className="w-full h-full object-cover" alt="Profile" />
                    </div>
                  </div>
                  <div className="pt-14 px-6 text-center">
                    <h3 className="text-xl font-black text-slate-900">Sarah Design</h3>
                    <p className="text-sm text-slate-500 font-medium mb-6">Digital Creator & Designer</p>
                    
                    <div className="space-y-3">
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center"><Sparkles className="w-5 h-5"/></div>
                          <div className="text-left"><p className="text-sm font-bold text-slate-900">UI/UX Kit 2026</p><p className="text-xs text-slate-500">$49.00</p></div>
                        </div>
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center"><ChevronRight className="w-4 h-4 text-slate-400"/></div>
                      </div>
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><PlayCircle className="w-5 h-5"/></div>
                          <div className="text-left"><p className="text-sm font-bold text-slate-900">Figma Masterclass</p><p className="text-xs text-slate-500">$99.00</p></div>
                        </div>
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center"><ChevronRight className="w-4 h-4 text-slate-400"/></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating UI Card */}
              <div className="absolute right-[260px] top-[100px] bg-white p-3.5 rounded-2xl shadow-xl z-30 animate-[float_5s_ease-in-out_infinite]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">New Sale</p>
                    <p className="text-lg font-black text-slate-900">+$49.00</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 0% Fees Banner */}
      <div className="bg-[#00D879] py-8 border-b-4 border-slate-900">
        <div className="container mx-auto px-8 md:px-12 lg:px-16 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 flex items-center justify-center gap-3 flex-wrap">
            <span className="bg-white px-4 py-1 rounded-xl shadow-sm">{t.zeroFees.title}</span> {t.zeroFees.desc}
          </h2>
        </div>
      </div>

      {/* Creator Showcase */}
      <section className="py-24 bg-white">
        <div className="container max-w-7xl mx-auto px-8 md:px-12 lg:px-16">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">{t.creators.title}</h2>
            <p className="text-lg text-slate-500">{t.creators.desc}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Showcase Card 1 */}
            <div className="bg-slate-50 rounded-[2rem] p-6 lg:p-8 border border-slate-100 flex flex-col items-center text-center group hover:bg-purple-50 transition-colors">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white shadow-xl group-hover:scale-105 transition-transform">
                <img src="https://i.pravatar.cc/300?img=44" alt="Creator" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-1">Alex Photography</h3>
              <p className="text-sm text-slate-500 font-medium mb-6">Makes $10k/mo selling presets</p>
              
              <div className="w-full max-w-[220px] h-[320px] bg-white rounded-[1.5rem] border-4 border-slate-900 shadow-lg overflow-hidden relative translate-y-6 group-hover:-translate-y-2 transition-transform duration-500">
                 {/* Mini Mockup */}
                 <div className="w-full h-24 bg-gradient-to-r from-purple-400 to-pink-300"></div>
                 <div className="px-3 -mt-6">
                   <div className="w-12 h-12 bg-white rounded-full border-2 border-white mx-auto overflow-hidden shadow-sm">
                     <img src="https://i.pravatar.cc/150?img=44" alt="Alex" className="w-full h-full object-cover" />
                   </div>
                   <div className="mt-4 space-y-2 text-left">
                     <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2 shadow-sm">
                       <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center shrink-0"><Sparkles className="w-4 h-4 text-purple-500"/></div>
                       <div><p className="text-[10px] font-bold text-slate-800 leading-tight mb-0.5">Wedding Presets</p><p className="text-[9px] text-slate-500 leading-none">$29.00</p></div>
                     </div>
                     <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2 shadow-sm">
                       <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center shrink-0"><Video className="w-4 h-4 text-pink-500"/></div>
                       <div><p className="text-[10px] font-bold text-slate-800 leading-tight mb-0.5">Editing Course</p><p className="text-[9px] text-slate-500 leading-none">$99.00</p></div>
                     </div>
                   </div>
                 </div>
              </div>
            </div>

            {/* Showcase Card 2 */}
            <div className="bg-slate-50 rounded-[2rem] p-6 lg:p-8 border border-slate-100 flex flex-col items-center text-center group hover:bg-blue-50 transition-colors">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white shadow-xl group-hover:scale-105 transition-transform">
                <img src="https://i.pravatar.cc/300?img=32" alt="Creator" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-1">Code with Jane</h3>
              <p className="text-sm text-slate-500 font-medium mb-6">Makes $15k/mo selling courses</p>
              
              <div className="w-full max-w-[220px] h-[320px] bg-white rounded-[1.5rem] border-4 border-slate-900 shadow-lg overflow-hidden relative translate-y-6 group-hover:-translate-y-2 transition-transform duration-500">
                 {/* Mini Mockup */}
                 <div className="w-full h-24 bg-gradient-to-r from-blue-400 to-indigo-400"></div>
                 <div className="px-3 -mt-6">
                   <div className="w-12 h-12 bg-white rounded-full border-2 border-white mx-auto overflow-hidden shadow-sm">
                     <img src="https://i.pravatar.cc/150?img=32" alt="Jane" className="w-full h-full object-cover" />
                   </div>
                   <div className="mt-4 space-y-2 text-left">
                     <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2 shadow-sm">
                       <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0"><PlayCircle className="w-4 h-4 text-blue-500"/></div>
                       <div><p className="text-[10px] font-bold text-slate-800 leading-tight mb-0.5">React Masterclass</p><p className="text-[9px] text-slate-500 leading-none">$149.00</p></div>
                     </div>
                     <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2 shadow-sm">
                       <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0"><Users className="w-4 h-4 text-indigo-500"/></div>
                       <div><p className="text-[10px] font-bold text-slate-800 leading-tight mb-0.5">1:1 Mentoring</p><p className="text-[9px] text-slate-500 leading-none">$200/hr</p></div>
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section id="features" className="py-24 bg-[#F9FAFB]">
        <div className="container max-w-7xl mx-auto px-8 md:px-12 lg:px-16">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">{t.features.title}</h2>
            <p className="text-lg text-slate-500">{t.features.desc}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Mockup Composition */}
            <div className="relative h-[400px] lg:h-[500px]">
              <div className="absolute inset-0 bg-[#5C4CFC]/10 rounded-full blur-[80px]"></div>
              
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4/5 h-[300px] lg:h-[400px] bg-white rounded-2xl shadow-2xl ring-1 ring-slate-900/5 z-10 overflow-hidden">
                 <div className="w-full h-10 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-400"></div>
                   <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                   <div className="w-3 h-3 rounded-full bg-green-400"></div>
                 </div>
                 <div className="p-6">
                   <div className="flex justify-between items-end mb-8">
                     <div>
                       <p className="text-sm text-slate-400 font-bold mb-1">Total Revenue</p>
                       <h3 className="text-3xl font-black text-slate-900">$12,450.00</h3>
                     </div>
                     <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold">+15%</div>
                   </div>
                   <div className="w-full h-32 flex items-end gap-2">
                     {[40, 60, 45, 80, 50, 70, 90, 65, 85].map((h, i) => (
                       <div key={i} className="flex-1 bg-[#5C4CFC] rounded-t-sm" style={{height: `${h}%`}}></div>
                     ))}
                   </div>
                 </div>
              </div>

              <div className="absolute right-0 bottom-0 w-[180px] h-[360px] bg-white rounded-[2rem] shadow-2xl border-4 border-slate-900 z-20 overflow-hidden">
                <div className="p-4 pt-8 bg-slate-50 h-full">
                  <div className="w-full h-24 bg-purple-100 rounded-xl mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
                    <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
                  </div>
                  <div className="mt-8 h-10 w-full bg-[#5C4CFC] rounded-xl"></div>
                </div>
              </div>
            </div>

            {/* Feature List */}
            <div className="space-y-8">
              {t.features.list.map((feat, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-[#5C4CFC] group-hover:text-white group-hover:scale-110 transition-all duration-300">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-1">{feat.title}</h4>
                    <p className="text-slate-500 font-medium">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Value Comparison */}
      <section className="py-24 bg-white">
        <div className="container max-w-4xl mx-auto px-8 md:px-12 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">{t.comparison.title}</h2>
            <p className="text-lg text-slate-500">{t.comparison.desc}</p>
          </div>

          <div className="bg-white rounded-[2rem] shadow-xl ring-1 ring-slate-900/5 p-8 lg:p-12">
            <div className="space-y-2 mb-8">
              {t.comparison.items.map((item, i) => {
                const IconComponent = {
                  Smartphone,
                  Calendar,
                  GraduationCap,
                  BarChart3,
                  Mail
                }[item.icon as string] || Check;
                
                return (
                  <div key={i} className="flex justify-between items-center py-4 border-b border-slate-200 last:border-0 hover:bg-slate-100 rounded-xl px-4 -mx-4 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-700">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-slate-900 font-bold text-base md:text-lg">{item.name}</h4>
                        <p className="text-slate-400 text-xs md:text-sm font-medium">{item.replaces}</p>
                      </div>
                    </div>
                    <span className="text-slate-900 font-black text-lg md:text-xl">{item.price}</span>
                  </div>
                );
              })}
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-center py-6 border-t border-slate-200 mb-2 gap-4">
              <div className="flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-400 shrink-0" />
                <span className="text-lg md:text-xl font-bold text-slate-300 line-through leading-tight">{t.comparison.totalText}</span>
              </div>
              <span className="text-lg md:text-xl font-black text-red-400 line-through whitespace-nowrap">{t.comparison.totalPrice}</span>
            </div>

            <div className="flex flex-col sm:flex-row justify-between sm:items-center py-6 border-t border-slate-200 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#5C4CFC] flex items-center justify-center text-white font-black text-sm shrink-0">S</div>
                <span className="text-xl md:text-2xl font-black text-[#5C4CFC] leading-tight">{t.comparison.selloraText}</span>
              </div>
              <span className="text-xl md:text-2xl font-black text-[#5C4CFC] whitespace-nowrap">{t.comparison.selloraPrice}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Masonry (Simplified for now) */}
      <section className="py-24 bg-[#F9FAFB] overflow-hidden">
        <div className="container mx-auto px-8 md:px-12 lg:px-16 text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4">{t.testimonials.title}</h2>
          <p className="text-lg text-slate-500">{t.testimonials.desc}</p>
        </div>
        
        {/* Infinite Scroll Marquee effect */}
        <div className="flex gap-6 w-max animate-shimmer" style={{ animationDuration: '40s' }}>
          {[1,2,3,4,5,6,7,8].map((i) => (
            <div key={i} className="w-[300px] bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex gap-3 items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden"><img src={`https://i.pravatar.cc/150?img=${i+20}`} alt="user"/></div>
                <div className="text-left">
                  <h4 className="font-bold text-sm text-slate-900">Creator {i}</h4>
                  <div className="flex text-amber-400"><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/></div>
                </div>
              </div>
              <p className="text-slate-600 text-sm font-medium text-left">"Since switching to Sellora, my conversion rate doubled. The 1-tap checkout is incredible and saving me so much in fees!"</p>
            </div>
          ))}
        </div>
      </section>


      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-[#F9FAFB] border-t border-slate-100">
        <div className="container max-w-3xl mx-auto px-8 md:px-12 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900">{t.faq.title}</h2>
          </div>
          <div className="space-y-4">
            {t.faq.items.map((item, i) => (
              <details key={i} className="group bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-slate-900 hover:text-[#5C4CFC] transition-colors">
                  <span>{item.q}</span>
                  <span className="transition group-open:rotate-180">
                    <ChevronRight className="w-5 h-5 rotate-90" />
                  </span>
                </summary>
                <div className="text-slate-500 font-medium px-6 pb-6">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="container max-w-5xl mx-auto px-8 md:px-12 lg:px-16">
          <div className="bg-[#5C4CFC] rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-[0_20px_50px_rgba(92,76,252,0.3)]">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#7A6BFF] blur-[100px] rounded-full -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">{t.cta.title}</h2>
              <div className="pt-4">
                <Link href="/register" className="inline-block bg-[#00D879] text-slate-900 px-10 py-5 rounded-full text-lg font-black hover:scale-105 transition-transform shadow-[0_0_40px_rgba(0,216,121,0.3)]">
                  {t.cta.btn}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-16 pb-8 border-t border-slate-100">
        <div className="container max-w-7xl mx-auto px-8 md:px-12 lg:px-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#5C4CFC] rounded-lg flex items-center justify-center text-white font-black text-lg">S</div>
              <span className="font-black text-xl text-slate-900">Sellora</span>
            </Link>
            
            <div className="flex gap-6 text-sm font-bold text-slate-500 flex-wrap justify-center">
              <Link href="#faq" className="hover:text-[#5C4CFC]">{t.footer.faq}</Link>
              <Link href="/privacy" className="hover:text-[#5C4CFC]">{t.footer.privacy}</Link>
              <Link href="/terms" className="hover:text-[#5C4CFC]">{t.footer.terms}</Link>
            </div>
          </div>
          
          <div className="text-center pt-8 border-t border-slate-100">
            <p className="text-slate-400 text-xs font-bold">{t.footer.rights}</p>
          </div>
        </div>
      </footer>

      {/* Global Styles for Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes shimmer {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-shimmer {
          animation: shimmer linear infinite;
        }
      `}</style>
    </div>
  );
}

