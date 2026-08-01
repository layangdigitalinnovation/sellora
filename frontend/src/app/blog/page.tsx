'use client';

import React from 'react';
import Link from 'next/link';
import { Search, ChevronDown, ArrowRight, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function BlogIndex() {
  const { lang, setLang } = useLanguage();

  const posts = [
    {
      id: 1,
      category: 'Sellora Success',
      date: 'Jul 10, 2026',
      title: 'How to Turn What You Know Into a Course on Sellora',
      slug: 'how-to-turn-what-you-know-into-a-course',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 2,
      category: 'Mindset & Creator Life',
      date: 'Jun 25, 2026',
      title: '7 Signals From Cannes Lions 2026 on Where the Creator Economy is Headed',
      slug: '7-signals-cannes-lions-2026',
      image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 3,
      category: 'Case Studies',
      date: 'Jun 12, 2026',
      title: 'How Zee Became a Star Millionaire Without A Massive Following',
      slug: 'how-zee-became-millionaire',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 4,
      category: 'Platform Tips',
      date: 'May 30, 2026',
      title: 'How to Sell Digital Downloads on Sellora',
      slug: 'how-to-sell-digital-downloads',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 5,
      category: 'Sellora Success',
      date: 'May 15, 2026',
      title: 'How to Use Sellora Order Bumps to Maximize Your Sales',
      slug: 'how-to-use-order-bumps',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 6,
      category: 'Creator Guides',
      date: 'May 02, 2026',
      title: 'How to Become a UGC Creator and Get Paid to Make Content',
      slug: 'how-to-become-ugc-creator',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop',
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar Minimal for Blog */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="container max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#5C4CFC] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#5C4CFC]/20">S</div>
            <span className="font-bold text-2xl tracking-tighter text-slate-900">Sellora</span>
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/" className="text-sm font-bold text-slate-600 hover:text-[#5C4CFC]">Home</Link>
            <Link href="/blog" className="text-sm font-bold text-[#5C4CFC]">Blog</Link>
            <div className="flex bg-slate-100 rounded-full p-1 border border-slate-200">
              <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${lang === 'en' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}>EN</button>
              <button onClick={() => setLang('id')} className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${lang === 'id' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}>ID</button>
            </div>
            <Link href="/login" className="text-sm font-bold text-slate-700">Login</Link>
            <Link href="/register" className="bg-[#5C4CFC] text-white px-5 py-2 rounded-full text-sm font-bold">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="pt-40 pb-20 text-center relative overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-100 rounded-full blur-3xl opacity-60"></div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tight text-slate-900 mb-6 uppercase" style={{ fontFamily: 'var(--font-lato), sans-serif' }}>
          The Daily <br/> Creator
        </h1>
        <p className="text-slate-500 font-medium max-w-lg mx-auto text-sm md:text-base px-4">
          A semi-regular, fully-committed collection of hot takes, helpful tips, and behind-the-scenes scoops from the frontlines of the Creator economy.
        </p>
      </header>

      <main className="container max-w-6xl mx-auto px-6 pb-24">
        {/* Featured Post */}
        <div className="bg-gradient-to-r from-[#5C4CFC] to-[#8F81FF] rounded-[2rem] p-1 flex flex-col md:flex-row mb-24 shadow-2xl shadow-[#5C4CFC]/20">
          <div className="w-full md:w-1/2 p-8 md:p-12 text-white flex flex-col justify-center">
            <div className="flex gap-4 mb-6">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">Getting Started</span>
              <span className="text-white/80 text-xs font-bold mt-1">Jul 17, 2026</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black leading-tight mb-4" style={{ fontFamily: 'var(--font-lato), sans-serif' }}>
              Sellora vs. Shopify: Which Platform Should Creators Use?
            </h2>
            <p className="text-white/80 mb-8 font-medium line-clamp-3">
              If organic traffic is the go-to for anyone who wants to start an online store, the internet has changed... and not in the way you secretly wish it did.
            </p>
            <Link href="/blog/sellora-vs-shopify" className="bg-white text-[#5C4CFC] px-6 py-3 rounded-full font-bold w-max flex items-center gap-2 hover:bg-slate-50 transition-colors">
              Read article <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="w-full md:w-1/2 min-h-[300px] relative rounded-[1.5rem] overflow-hidden bg-white/10 m-2 border border-white/20 flex items-center justify-center p-8">
             {/* Mock graphic */}
             <div className="flex items-center justify-center gap-8 animate-[float_6s_ease-in-out_infinite]">
                <div className="w-24 h-24 bg-[#5C4CFC] rounded-2xl flex items-center justify-center shadow-2xl rotate-[-10deg] border-4 border-white"><span className="text-5xl font-black text-white">S</span></div>
                <div className="text-white font-black italic text-xl">VS</div>
                <div className="w-24 h-24 bg-[#00D879] rounded-2xl flex items-center justify-center shadow-2xl rotate-[10deg] border-4 border-white"><span className="text-5xl font-black text-white">Sh</span></div>
             </div>
          </div>
        </div>

        {/* More to explore */}
        <div className="mb-12">
          <h2 className="text-4xl font-black text-center mb-12" style={{ fontFamily: 'var(--font-lato), sans-serif' }}>More to explore</h2>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12">
            <div className="relative w-full md:w-64">
              <select className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-3 px-4 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#5C4CFC]/20">
                <option>Select a category</option>
                <option>Sellora Success</option>
                <option>Mindset & Creator Life</option>
                <option>Case Studies</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search something" 
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 py-3 pl-10 pr-4 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#5C4CFC]/20"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post.id} className="group cursor-pointer flex flex-col h-full">
                <div className="rounded-[1.5rem] overflow-hidden mb-6 aspect-video bg-slate-100 border border-slate-100 shadow-sm relative">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex gap-3 items-center mb-3">
                  <span className="text-[#5C4CFC] text-xs font-black uppercase tracking-wider">{post.category}</span>
                  <span className="text-slate-400 text-xs font-medium">•</span>
                  <span className="text-slate-400 text-xs font-medium">{post.date}</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 leading-snug mb-4 group-hover:text-[#5C4CFC] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <div className="mt-auto">
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-slate-700 group-hover:text-[#5C4CFC] transition-colors">
                    Read more <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-16 gap-2">
             <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">1</button>
             <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-900">2</button>
             <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-900">3</button>
             <span className="w-10 h-10 flex items-center justify-center text-slate-400">...</span>
             <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-900">20</button>
             <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-900"><ArrowRight className="w-4 h-4"/></button>
          </div>
        </div>
      </main>

      {/* Newsletter Section */}
      <section className="container max-w-6xl mx-auto px-6 pb-24">
        <div className="bg-[#7A6BFF] rounded-[2rem] p-12 text-center relative overflow-hidden text-white shadow-xl">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
           <div className="relative z-10 max-w-2xl mx-auto space-y-6">
             <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily: 'var(--font-lato), sans-serif' }}>Subscribe to our Creator newsletter</h2>
             <p className="text-white/80 font-medium">Your dose of Creator news, tools, strategies, and inspiration</p>
             <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-4">
               <input type="email" placeholder="Email" className="flex-1 bg-white text-slate-900 px-6 py-3 rounded-full focus:outline-none font-medium" />
               <button className="bg-[#5C4CFC] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[#4a3ce0] transition-colors">Subscribe</button>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
}
