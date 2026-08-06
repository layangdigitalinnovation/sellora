'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, Link2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useParams } from 'next/navigation';

export default function BlogPost() {
  const { lang, setLang } = useLanguage();
  const params = useParams();
  
  const [post, setPost] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!params.slug) return;
    const fetchPost = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
        const res = await fetch(`${apiUrl}/blogs/${params.slug}`);
        if (res.ok) {
          const data = await res.json();
          setPost({
            title: data.title,
            category: data.category?.name || 'Uncategorized',
            date: new Date(data.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            author: {
              name: data.author?.name || 'Sellora Team',
              avatar: data.author?.avatar || null
            },
            image: data.coverImage || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop',
            content: data.content
          });
        } else {
          setPost(null);
        }
      } catch (e) {
        console.error('Failed to load post', e);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [params.slug]);

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center font-bold text-slate-500">Loading...</div>;
  if (!post) return <div className="min-h-screen bg-white flex items-center justify-center font-bold text-slate-500">Post not found.</div>;

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
            <Link href="/register" className="bg-[#7c2cff] text-white px-5 py-2 rounded-full text-sm font-bold">Start Free Trial</Link>
          </div>
        </div>
      </nav>

      <article className="pt-32 pb-24">
        <div className="container max-w-4xl mx-auto px-6">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-[#7c2cff] text-sm font-black uppercase tracking-wider">{post.category}</span>
              <span className="text-slate-300 text-sm font-medium">•</span>
              <span className="text-slate-500 text-sm font-medium">{post.date}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black font-serif text-slate-900 leading-tight mb-8">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-4">
              {post.author.avatar ? (
                <img src={post.author.avatar} alt={post.author.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#7c2cff] text-white flex items-center justify-center font-black text-xl uppercase shadow-sm">
                  {post.author.name.charAt(0)}
                </div>
              )}
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
                <button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')} className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-colors bg-white shadow-sm" title="Share on Twitter/X">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </button>
                <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')} className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#1877F2] hover:border-[#1877F2] transition-colors bg-white shadow-sm" title="Share on Facebook">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </button>
                <button onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' - ' + window.location.href)}`, '_blank')} className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#25D366] hover:border-[#25D366] transition-colors bg-white shadow-sm" title="Share on WhatsApp">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </button>
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copied! Open Instagram to share.'); window.open('https://instagram.com', '_blank'); }} className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#E1306C] hover:border-[#E1306C] transition-colors bg-white shadow-sm" title="Share on Instagram">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </button>
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copied to clipboard!'); }} className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-colors bg-white" title="Copy Link">
                  <Link2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 order-1 md:order-2 prose prose-lg prose-slate prose-headings:font-black prose-headings:font-serif prose-a:text-[#7c2cff] max-w-none prose-blockquote:border-l-[#7c2cff] prose-blockquote:bg-slate-50 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:italic" dangerouslySetInnerHTML={{ __html: post.content }}>
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
                 <button className="bg-[#7c2cff] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[#4a3ce0] transition-colors">Subscribe</button>
               </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
