'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, Link2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useParams } from 'next/navigation';

export default function BlogPost() {
  const { lang, setLang } = useLanguage();
  const params = useParams();
  
  // Dummy data
  const post = {
    title: 'How to Turn What You Know Into a Course on Sellora',
    category: 'Sellora Success',
    date: 'Jul 10, 2026',
    author: {
      name: 'Sellora Team',
      avatar: 'https://i.pravatar.cc/150?img=68'
    },
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop',
    content: `
      <p>Creating a course can seem daunting, but it’s actually one of the most rewarding ways to monetize your expertise. Whether you're a fitness coach, a graphic designer, or a productivity guru, you have knowledge that people are willing to pay for.</p>
      
      <h3>1. Identify Your Core Expertise</h3>
      <p>The first step is to figure out exactly what you want to teach. Don't try to be everything to everyone. Niche down. Instead of "How to be healthy", try "Nutrition and Meal Prep for Busy Entrepreneurs".</p>
      
      <blockquote>
        "The riches are in the niches. The more specific your course is, the easier it will be to sell it."
      </blockquote>

      <h3>2. Outline Your Curriculum</h3>
      <p>Break your knowledge down into digestible modules. A good course takes the student from Point A (their current struggle) to Point B (the desired outcome) in the shortest path possible.</p>
      <ul>
        <li>Module 1: The Foundations</li>
        <li>Module 2: Advanced Strategies</li>
        <li>Module 3: Putting it all together</li>
      </ul>

      <h3>3. Film and Upload to Sellora</h3>
      <p>You don't need a fancy camera. Your smartphone is more than enough. Once you've recorded your videos, simply create a new 'Course' product in your Sellora dashboard, upload your videos, and set your price.</p>

      <p>Ready to start? Log in to your Sellora dashboard today and create your first course!</p>
    `
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar Minimal for Blog */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="container max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 group text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold text-sm">Back to Blog</span>
          </Link>
          <div className="flex gap-6 items-center">
            <div className="flex bg-slate-100 rounded-full p-1 border border-slate-200">
              <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${lang === 'en' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}>EN</button>
              <button onClick={() => setLang('id')} className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${lang === 'id' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}>ID</button>
            </div>
            <Link href="/register" className="bg-[#5C4CFC] text-white px-5 py-2 rounded-full text-sm font-bold">Start Free Trial</Link>
          </div>
        </div>
      </nav>

      <article className="pt-32 pb-24">
        <div className="container max-w-4xl mx-auto px-6">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-[#5C4CFC] text-sm font-black uppercase tracking-wider">{post.category}</span>
              <span className="text-slate-300 text-sm font-medium">•</span>
              <span className="text-slate-500 text-sm font-medium">{post.date}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black font-serif text-slate-900 leading-tight mb-8">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-4">
              <img src={post.author.avatar} alt={post.author.name} className="w-12 h-12 rounded-full" />
              <div className="text-left">
                <p className="font-bold text-slate-900">{post.author.name}</p>
                <p className="text-xs font-medium text-slate-500">Author</p>
              </div>
            </div>
          </header>

          {/* Cover Image */}
          <div className="rounded-[2rem] overflow-hidden mb-16 shadow-lg">
            <img src={post.image} alt={post.title} className="w-full h-auto aspect-video object-cover" />
          </div>

          {/* Content & Sidebar */}
          <div className="flex flex-col md:flex-row gap-12 relative">
            {/* Share Sidebar (Sticky) */}
            <div className="md:w-16 shrink-0 order-2 md:order-1">
              <div className="sticky top-32 flex flex-row md:flex-col gap-4 justify-center">
                <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-colors bg-white">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </button>
                <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#1877F2] hover:border-[#1877F2] transition-colors bg-white">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </button>
                <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-colors bg-white">
                  <Link2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 order-1 md:order-2 prose prose-lg prose-slate prose-headings:font-black prose-headings:font-serif prose-a:text-[#5C4CFC] max-w-none prose-blockquote:border-l-[#5C4CFC] prose-blockquote:bg-slate-50 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:italic" dangerouslySetInnerHTML={{ __html: post.content }}>
            </div>
          </div>
        </div>
      </article>

      {/* Newsletter Section */}
      <section className="bg-slate-50 py-24">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="bg-[#7A6BFF] rounded-[2rem] p-12 text-center relative overflow-hidden text-white shadow-xl">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
             <div className="relative z-10 space-y-6">
               <h2 className="text-4xl font-black font-serif">Loved this article?</h2>
               <p className="text-white/80 font-medium max-w-md mx-auto">Get more tips on how to grow your creator business straight to your inbox.</p>
               <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-4">
                 <input type="email" placeholder="Email" className="flex-1 bg-white text-slate-900 px-6 py-3 rounded-full focus:outline-none font-medium" />
                 <button className="bg-[#5C4CFC] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[#4a3ce0] transition-colors">Subscribe</button>
               </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
