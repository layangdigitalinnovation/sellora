'use client';

import React from 'react';
import Link from 'next/link';
import { Search, ChevronDown, ArrowRight, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  createdAt: string;
  category: Category;
  author: {
    name: string;
    avatar: string;
  };
}

export default function BlogIndex() {
  const { lang, setLang } = useLanguage();

  const [posts, setPosts] = React.useState<Post[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
        const [postsRes, categoriesRes] = await Promise.all([
          fetch(`${apiUrl}/blogs`),
          fetch(`${apiUrl}/blogs/categories/all`)
        ]);

        if (postsRes.ok) {
          const postsData = await postsRes.json();
          setPosts(postsData);
        }
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Failed to fetch blog data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category?.id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = posts.length > 0 ? posts[0] : null;
  // If no search/filter is active, skip the featured post in the grid list
  const gridPosts = (searchQuery === '' && selectedCategory === 'all') 
    ? filteredPosts.slice(1) 
    : filteredPosts;

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar Minimal for Blog */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="container max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <svg className="w-10 h-10" viewBox="0 0 64 64" aria-hidden="true">
              <defs><linearGradient id="kgblog" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ff8a00"/><stop offset=".42" stopColor="#f13e8e"/><stop offset="1" stopColor="#5f2cff"/></linearGradient></defs>
              <rect x="8" y="7" width="13" height="50" rx="6.5" fill="url(#kgblog)"/>
              <path d="M25 32 47 8c4-4 11-1 11 5v4c0 2-1 4-3 6L42 35l13 8c2 1 3 3 3 5v3c0 6-7 9-12 6L25 44c-5-3-6-9-2-13l2-2v3Z" fill="url(#kgblog)"/>
            </svg>
            <span className="font-bold text-2xl tracking-tighter text-slate-900 leading-none flex flex-col justify-center">
              KAMU<span className="text-[10px] text-slate-500 font-medium tracking-normal -mt-1">Kelola Aktivitas Monetisasi Usaha</span>
            </span>
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/" className="text-sm font-bold text-slate-600 hover:text-[#7c2cff]">Home</Link>
            <Link href="/blog" className="text-sm font-bold text-[#7c2cff]">Blog</Link>
            <div className="flex bg-slate-100 rounded-full p-1 border border-slate-200">
              <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${lang === 'en' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}>EN</button>
              <button onClick={() => setLang('id')} className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${lang === 'id' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}>ID</button>
            </div>
            <Link href="/login" className="text-sm font-bold text-slate-700">Login</Link>
            <Link href="/register" className="bg-[#7c2cff] text-white px-5 py-2 rounded-full text-sm font-bold">Sign Up</Link>
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
        {featuredPost && (
          <div className="bg-gradient-to-r from-[#7c2cff] to-[#ff416c] rounded-[2rem] p-1 flex flex-col md:flex-row mb-24 shadow-2xl shadow-[#7c2cff]/20">
            <div className="w-full md:w-1/2 p-8 md:p-12 text-white flex flex-col justify-center">
              <div className="flex gap-4 mb-6">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                  {featuredPost.category?.name || 'Uncategorized'}
                </span>
                <span className="text-white/80 text-xs font-bold mt-1">
                  {new Date(featuredPost.publishedAt || featuredPost.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black leading-tight mb-4" style={{ fontFamily: 'var(--font-lato), sans-serif' }}>
                {featuredPost.title}
              </h2>
              <p className="text-white/80 mb-8 font-medium line-clamp-3">
                {featuredPost.excerpt || 'No description available for this post.'}
              </p>
              <Link href={`/blog/${featuredPost.slug}`} className="bg-white text-[#7c2cff] px-6 py-3 rounded-full font-bold w-max flex items-center gap-2 hover:bg-slate-50 transition-colors">
                Read article <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="w-full md:w-1/2 min-h-[300px] relative rounded-[1.5rem] overflow-hidden bg-white/10 m-2 border border-white/20 flex items-center justify-center p-8">
              {featuredPost.coverImage ? (
                <img src={featuredPost.coverImage} alt={featuredPost.title} className="w-full h-full object-cover absolute inset-0 opacity-80 mix-blend-overlay" />
              ) : (
                <div className="flex items-center justify-center gap-8 animate-[float_6s_ease-in-out_infinite]">
                  <div className="w-24 h-24 bg-[#7c2cff] rounded-2xl flex items-center justify-center shadow-2xl rotate-[-10deg] border-4 border-white"><span className="text-5xl font-black text-white">K</span></div>
                  <div className="text-white font-black italic text-xl">VS</div>
                  <div className="w-24 h-24 bg-[#00D879] rounded-2xl flex items-center justify-center shadow-2xl rotate-[10deg] border-4 border-white"><span className="text-5xl font-black text-white">Sh</span></div>
                </div>
              )}
            </div>
          </div>
        )}


        {/* More to explore */}
        <div className="mb-12">
          <h2 className="text-4xl font-black text-center mb-12" style={{ fontFamily: 'var(--font-lato), sans-serif' }}>More to explore</h2>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12">
            <div className="relative w-full md:w-64">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-3 px-4 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#7c2cff]/20"
              >
                <option value="all">All categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search something"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 py-3 pl-10 pr-4 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#7c2cff]/20"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-[#7c2cff] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : gridPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gridPosts.map((post) => (
                <Link href={`/blog/${post.slug}`} key={post.id} className="group cursor-pointer flex flex-col h-full">
                  <div className="rounded-[1.5rem] overflow-hidden mb-6 aspect-video bg-slate-100 border border-slate-100 shadow-sm relative">
                    {post.coverImage ? (
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                        <span className="text-slate-400 font-bold">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 items-center mb-3">
                    <span className="text-[#7c2cff] text-xs font-black uppercase tracking-wider">{post.category?.name || 'Uncategorized'}</span>
                    <span className="text-slate-400 text-xs font-medium">•</span>
                    <span className="text-slate-400 text-xs font-medium">
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 leading-snug mb-4 group-hover:text-[#7c2cff] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="mt-auto">
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-slate-700 group-hover:text-[#7c2cff] transition-colors">
                      Read more <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-500 font-medium">No posts found matching your criteria.</p>
            </div>
          )}
          
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
               <button className="bg-[#7c2cff] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[#4a3ce0] transition-colors">Subscribe</button>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
}
