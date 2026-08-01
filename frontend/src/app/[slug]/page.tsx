'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ChevronRight, ChevronLeft, Package, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function StorePage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!slug) return;
    
    const fetchStore = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:3001/api/stores/${slug}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Toko tidak ditemukan.');
          }
          throw new Error('Gagal memuat toko.');
        }
        const data = await res.json();
        setStore(data);
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStore();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-[#4361EE] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <h1 className="text-2xl font-black text-slate-800 mb-2">Oops!</h1>
        <p className="text-slate-500 mb-6">{error || 'Toko tidak ditemukan.'}</p>
        <Link href="/" className="px-6 py-3 bg-[#4361EE] text-white rounded-xl font-bold text-sm shadow-lg hover:opacity-90 transition-opacity">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const products = store.products?.filter((p: any) => p.isActive) || [];
  const productsPerPage = 5;
  const totalPages = Math.ceil(products.length / productsPerPage);
  const paginatedProducts = products.slice((page - 1) * productsPerPage, page * productsPerPage);

  const isDark = store.theme === 'dark';
  const customCss = store.customCss || 'list'; // list, card, grid
  const primaryColor = store.primaryColor || '#4361EE';
  const bgColor = store.contentBgColor || (isDark ? '#1E1E1E' : '#ffffff');
  const textColor = isDark ? '#FFFFFF' : '#1e293b'; // slate-800
  const socialLinks = store.socialLinks || {};

  return (
    <div 
      className={`min-h-screen w-full flex flex-col items-center justify-start ${isDark ? 'text-white' : 'text-slate-800'}`}
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-full max-w-[480px] min-h-screen flex flex-col relative px-4 py-8 shadow-2xl shadow-black/5" style={{ backgroundColor: bgColor }}>
        
        {/* Header Background */}
        {store.headerImageUrl ? (
          <div className="absolute top-0 left-0 w-full h-40 z-0">
            <img src={store.headerImageUrl} alt="Header" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="absolute top-0 left-0 w-full h-32 z-0" style={{ backgroundColor: primaryColor }}></div>
        )}

        <div className="relative z-10 flex flex-col items-center mt-12">
          {/* Profile Image */}
          <div className={`w-24 h-24 rounded-full border-4 ${isDark ? 'border-[#1E1E1E]' : 'border-white'} flex items-center justify-center overflow-hidden shadow-lg`} style={{ backgroundColor: primaryColor }}>
            {store.profileImageUrl ? (
              <img src={store.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-3xl font-black">
                {store.name ? store.name.charAt(0).toUpperCase() : 'S'}
              </span>
            )}
          </div>
          
          {/* Store Info */}
          <div className="mt-4 text-center w-full px-4">
            <h1 className="font-black text-xl tracking-tight" style={{ color: textColor }}>{store.name || 'Nama Toko'}</h1>
            <p className="text-sm font-bold opacity-70 mt-1" style={{ color: textColor }}>@{store.slug}</p>
            {store.description && (
              <p className="text-sm mt-4 whitespace-pre-wrap leading-relaxed opacity-80" style={{ color: textColor }}>{store.description}</p>
            )}
          </div>

          {/* Social Links */}
          {(socialLinks.instagram || socialLinks.tiktok || socialLinks.youtube || socialLinks.x) && (
            <div className="flex items-center justify-center gap-4 mt-6">
              {['instagram', 'tiktok', 'youtube', 'x'].map(p => socialLinks[p] ? (
                <a key={p} href={socialLinks[p]} target="_blank" rel="noreferrer" className={`w-10 h-10 rounded-full border shadow-sm flex items-center justify-center transition-all hover:-translate-y-1 ${isDark ? 'border-white/10 bg-white/5 text-white hover:border-white/30' : 'border-slate-200 bg-white text-slate-700 hover:border-[#4361EE] hover:text-[#4361EE]'}`}>
                  {p === 'instagram' && <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>}
                  {p === 'tiktok' && <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>}
                  {p === 'youtube' && <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>}
                  {p === 'x' && <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>}
                </a>
              ) : null)}
            </div>
          )}

          {/* Promo Banner */}
          {store.bannerImageUrl && (
            <div className="w-full mt-8 rounded-2xl overflow-hidden shadow-md border border-white/10">
              <img src={store.bannerImageUrl} alt="Banner" className="w-full object-cover" />
            </div>
          )}

          {/* CTA Button */}
          {store.ctaText && (
            <div className="w-full mt-6">
              <a href={store.ctaLink || '#'} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center py-4 rounded-xl font-black text-sm transition-all shadow-lg hover:scale-[1.02] border border-white/10" style={{ backgroundColor: primaryColor, color: '#FFF' }}>
                {store.ctaText}
              </a>
            </div>
          )}

          {/* Product List */}
          <div className={`w-full mt-8 ${customCss === 'grid' ? 'grid grid-cols-2 gap-4 content-start' : 'space-y-4'}`}>
            {products.length === 0 ? (
              <div className="col-span-2 py-10 text-center opacity-50">
                <p>Belum ada produk.</p>
              </div>
            ) : (
              paginatedProducts.map((p: any) => (
                <Link href={`/${slug}/p/${p.id}`} key={p.id} className="block w-full">
                  <div 
                    className={`w-full cursor-pointer hover:scale-[1.02] transition-transform shadow-sm flex relative overflow-hidden border ${isDark ? 'bg-[#2A2A2A] border-white/5' : 'bg-white border-slate-100'} ${
                      customCss === 'card' 
                        ? 'rounded-3xl flex-col' 
                        : customCss === 'grid' 
                          ? 'rounded-3xl flex-col aspect-square justify-end' 
                          : 'rounded-2xl items-center p-4 gap-4'
                    }`}
                  >
                  {p.imageUrl && (
                    <div className={`${
                      customCss === 'card' 
                        ? 'w-full h-40' 
                        : customCss === 'grid'
                          ? 'absolute inset-0 w-full h-full z-0'
                          : 'w-12 h-12 rounded-xl shrink-0'
                    }`}>
                      <img src={p.imageUrl} className="w-full h-full object-cover" alt={p.title} />
                      {customCss === 'grid' && <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent"></div>}
                    </div>
                  )}
                  
                  <div className={`flex items-center justify-between flex-1 ${
                    customCss === 'card' 
                      ? 'p-5 flex-col items-start gap-3 w-full' 
                      : customCss === 'grid'
                        ? 'p-4 flex-col gap-2 relative z-10 w-full'
                        : 'w-full'
                  }`}>
                    <span className={`text-sm font-black tracking-tight line-clamp-2 ${
                      customCss === 'card' 
                        ? (isDark ? 'text-white' : 'text-slate-800')
                        : customCss === 'grid'
                          ? (p.imageUrl ? 'text-white text-center' : (isDark ? 'text-white text-center' : 'text-slate-800 text-center'))
                          : (isDark ? 'text-white' : 'text-slate-800')
                    }`}>{p.title}</span>
                    
                    {customCss === 'card' ? (
                      <div className={`w-full flex justify-between items-center mt-2 pt-4 border-t ${isDark ? 'border-white/5' : 'border-slate-50'}`}>
                        <div className="flex flex-col">
                          {p.originalPrice && Number(p.originalPrice) > Number(p.price) && (
                            <span className={`text-[10px] font-medium line-through ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Rp {Number(p.originalPrice).toLocaleString()}</span>
                          )}
                          <span className={`text-sm font-bold ${isDark ? 'text-white/80' : 'text-slate-600'}`}>Rp {Number(p.price).toLocaleString()}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 shadow-md" style={{ backgroundColor: primaryColor }}>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    ) : customCss === 'grid' ? (
                       <div className={`mt-1 text-[10px] font-bold px-4 py-1.5 rounded-full border ${p.imageUrl ? 'border-white/30 text-white/90 backdrop-blur-md bg-black/20' : (isDark ? 'border-white/20 text-white/80' : 'border-slate-200 text-slate-500')}`}>
                         Lihat
                       </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                          {p.originalPrice && Number(p.originalPrice) > Number(p.price) && (
                            <span className={`text-[9px] font-medium line-through ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Rp {Number(p.originalPrice).toLocaleString()}</span>
                          )}
                          <span className={`text-xs font-bold ${isDark ? 'text-white/80' : 'text-slate-600'}`}>Rp {Number(p.price).toLocaleString()}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 ${isDark ? 'text-white/30' : 'text-slate-300'}`} />
                      </div>
                    )}
                  </div>
                </div>
                </Link>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="w-full flex items-center justify-between mt-8 px-2">
              <button 
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className={`w-10 h-10 rounded-full shadow-sm flex items-center justify-center transition-all ${isDark ? 'bg-[#2A2A2A] text-white disabled:opacity-30' : 'bg-white text-slate-800 disabled:opacity-30 border border-slate-100'} ${page !== 1 && 'hover:scale-110 active:scale-95'}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <span className={`text-[10px] font-black tracking-widest uppercase ${isDark ? 'text-white/50' : 'text-slate-400'}`}>
                Halaman {page} dari {totalPages}
              </span>
              
              <button 
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className={`w-10 h-10 rounded-full shadow-sm flex items-center justify-center transition-all ${isDark ? 'bg-[#2A2A2A] text-white disabled:opacity-30' : 'bg-white text-slate-800 disabled:opacity-30 border border-slate-100'} ${page !== totalPages && 'hover:scale-110 active:scale-95'}`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
          
          {/* Footer Badge */}
          <div className="mt-12 mb-8 text-center opacity-40 hover:opacity-100 transition-opacity">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-800'}`}>Powered by Sellora</span>
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
}
