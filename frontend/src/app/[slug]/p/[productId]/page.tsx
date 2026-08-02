'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { CountdownTimer } from '@/components/CountdownTimer';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const productId = params?.productId as string;
  
  const [store, setStore] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Features state
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [customPrice, setCustomPrice] = useState<string>('');

  // Checkout state
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({ buyerName: '', buyerEmail: '', buyerPhone: '', buyerAddress: '' });
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    if (!slug || !productId) return;
    
    const fetchStore = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/stores/${slug}`);
        if (!res.ok) throw new Error('Toko tidak ditemukan.');
        const data = await res.json();
        setStore(data);
        
        const foundProduct = data.products?.find((p: any) => p.id === productId);
        if (!foundProduct) throw new Error('Produk tidak ditemukan.');
        setProduct(foundProduct);

        if (foundProduct.isPwyw) {
          setCustomPrice(foundProduct.minPwywPrice?.toString() || '0');
        }

        if (foundProduct.type === 'BOOKING' || foundProduct.type === 'EVENT') {
          const slotsRes = await fetch(`http://localhost:3001/api/bookings/product/${productId}`);
          if (slotsRes.ok) {
            setSlots(await slotsRes.json());
          }
        }

        // Track VIEW
        fetch('http://localhost:3001/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            storeId: data.id,
            productId: foundProduct.id,
            eventType: 'VIEW',
            visitorId: 'visitor_' + Math.random().toString(36).substr(2, 9) // Simulated cookie ID
          })
        }).catch(console.error);

      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStore();
  }, [slug, productId]);

  const parsedPrice = parseFloat(customPrice);
  const minPrice = product?.minPwywPrice || 0;
  const isPriceValid = !product?.isPwyw || (!isNaN(parsedPrice) && parsedPrice >= minPrice);

  const handleCheckoutClick = () => {
    // Track CHECKOUT_CLICK
    if (store && product) {
      fetch('http://localhost:3001/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId: store.id,
          productId: product.id,
          eventType: 'CHECKOUT_CLICK',
          visitorId: 'visitor_' + Math.random().toString(36).substr(2, 9)
        })
      }).catch(console.error);
    }
    
    if ((product.type === 'BOOKING' || product.type === 'EVENT') && !selectedSlotId) {
      alert('Pilih jadwal terlebih dahulu');
      return;
    }
    
    if (product.isPwyw) {
      const p = parseFloat(customPrice);
      if (isNaN(p) || p < (product.minPwywPrice || 0)) {
        alert(`Harga minimum adalah Rp ${Number(product.minPwywPrice || 0).toLocaleString()}`);
        return;
      }
    }

    setShowCheckout(true);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckingOut(true);
    try {
      const payload: any = {
        productId: product.id,
        ...checkoutForm,
      };

      if (product.isPwyw) {
        payload.amount = parseFloat(customPrice);
      }
      if (selectedSlotId) {
        payload.bookingSlotId = selectedSlotId;
      }

      const res = await fetch('http://localhost:3001/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
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
      setIsCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-[#4361EE] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !store || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <h1 className="text-2xl font-black text-slate-800 mb-2">Oops!</h1>
        <p className="text-slate-500 mb-6">{error || 'Produk tidak ditemukan.'}</p>
        <Link href={`/${slug}`} className="px-6 py-3 bg-[#4361EE] text-white rounded-xl font-bold text-sm shadow-lg">
          Kembali ke Toko
        </Link>
      </div>
    );
  }

  const isDark = store.theme === 'dark';
  const primaryColor = store.primaryColor || '#4361EE';
  const bgColor = store.contentBgColor || (isDark ? '#1E1E1E' : '#ffffff');
  const textColor = isDark ? '#FFFFFF' : '#1e293b';

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-start ${isDark ? 'text-white' : 'text-slate-800'}`} style={{ backgroundColor: bgColor }}>
      <div className="w-full max-w-[480px] min-h-screen flex flex-col relative bg-white" style={{ backgroundColor: bgColor }}>
        
        {/* Header Navigation */}
        <div className="w-full p-4 flex items-center gap-3 sticky top-0 z-20 backdrop-blur-md" style={{ backgroundColor: isDark ? 'rgba(30,30,30,0.8)' : 'rgba(255,255,255,0.8)' }}>
          <button onClick={() => router.push(`/${slug}`)} className={`w-10 h-10 flex items-center justify-center rounded-full ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-100 hover:bg-slate-200'} transition-colors`}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
              {store.profileImageUrl ? <img src={store.profileImageUrl} alt="Profile" className="w-full h-full object-cover"/> : <span className="w-full h-full flex items-center justify-center text-xs font-black bg-slate-800 text-white">{store.name?.charAt(0)}</span>}
            </div>
            <span className="font-bold text-sm" style={{ color: textColor }}>{store.name}</span>
          </div>
        </div>

        {/* Product Details Content */}
        <div className="w-full flex-1 pb-32">
          {product.imageUrl && (
            <div className="w-full aspect-square bg-slate-100 relative">
              <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-6">
            {product.flashSaleEndDate && new Date(product.flashSaleEndDate) > new Date() && (
              <div className="mb-4 flex flex-col gap-2">
                <span className="text-sm font-bold text-red-500 uppercase tracking-widest">⚡ Flash Sale</span>
                <CountdownTimer targetDate={product.flashSaleEndDate} />
              </div>
            )}
            
            <h1 className="text-2xl font-black mb-2 leading-tight" style={{ color: textColor }}>{product.title}</h1>
            
            <div className="flex items-end gap-2 mb-6">
              {!product.isPwyw && (
                <>
                  <span className="text-2xl font-black" style={{ color: primaryColor }}>Rp {Number(product.price).toLocaleString()}</span>
                  {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                    <span className={`text-sm font-medium line-through mb-1 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Rp {Number(product.originalPrice).toLocaleString()}</span>
                  )}
                </>
              )}
            </div>

            {product.isPwyw && (
              <div className={`mb-6 p-4 rounded-xl border ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                <label className={`text-xs font-bold uppercase tracking-widest mb-2 block ${isDark ? 'text-white/50' : 'text-slate-500'}`}>Bayar Sesukamu (Min. Rp {Number(product.minPwywPrice || 0).toLocaleString()})</label>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg" style={{ color: textColor }}>Rp</span>
                  <input 
                    type="number" 
                    value={customPrice} 
                    onChange={e => setCustomPrice(e.target.value)} 
                    className={`flex-1 px-4 py-3 rounded-lg border font-bold text-lg focus:ring-2 focus:outline-none ${isDark ? 'bg-white/5 border-white/10 text-white focus:ring-white/20' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-indigo-100'} ${!isPriceValid && customPrice !== '' ? 'border-red-500 focus:ring-red-100' : ''}`} 
                  />
                </div>
                {!isPriceValid && customPrice !== '' && (
                  <p className="text-red-500 text-xs font-bold mt-2">
                    Minimal pembayaran adalah Rp {Number(minPrice).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {(product.type === 'BOOKING' || product.type === 'EVENT') && (
              <div className={`mb-6 p-4 rounded-xl border ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                <label className={`text-xs font-bold uppercase tracking-widest mb-2 block ${isDark ? 'text-white/50' : 'text-slate-500'}`}>Pilih Jadwal</label>
                <div className="space-y-2">
                  {slots.map(slot => (
                    <button 
                      key={slot.id} 
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg border flex justify-between items-center transition-colors ${selectedSlotId === slot.id ? 'border-[3px]' : 'border'} ${isDark ? (selectedSlotId === slot.id ? 'bg-white/10 border-white text-white' : 'border-white/10 text-white/80') : (selectedSlotId === slot.id ? 'bg-indigo-50 border-indigo-500 text-indigo-900' : 'border-slate-200 text-slate-700')}`}
                    >
                      <span className="font-semibold text-sm">
                        {new Date(slot.startTime).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </button>
                  ))}
                  {slots.length === 0 && (
                    <div className="text-sm text-red-500 font-medium">Belum ada jadwal yang tersedia.</div>
                  )}
                </div>
              </div>
            )}

            <div className={`w-full h-px mb-6 ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}></div>

            <h3 className={`text-sm font-bold mb-3 uppercase tracking-wider ${isDark ? 'text-white/50' : 'text-slate-400'}`}>Deskripsi Produk</h3>
            <div className={`text-sm leading-relaxed whitespace-pre-wrap ${isDark ? 'text-white/80' : 'text-slate-600'}`}>
              {product.description || 'Tidak ada deskripsi.'}
            </div>

            <div className={`mt-8 p-4 rounded-2xl flex items-start gap-3 ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
              <ShieldCheck className={`w-6 h-6 shrink-0 ${isDark ? 'text-white/50' : 'text-slate-400'}`} />
              <div>
                <h4 className={`text-sm font-bold ${isDark ? 'text-white/90' : 'text-slate-800'}`}>Transaksi Aman & Cepat</h4>
                <p className={`text-xs mt-1 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Pembayaran diproses secara instan melalui sistem pihak ketiga yang terpercaya.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Buy Button */}
        <div className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-4 border-t z-30 ${isDark ? 'bg-[#1E1E1E] border-white/10' : 'bg-white border-slate-100'}`}>
          <button 
            onClick={handleCheckoutClick}
            disabled={!isPriceValid}
            className="w-full py-4 rounded-xl font-black text-white shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: primaryColor }}
          >
            Beli Sekarang
          </button>
        </div>

        {/* Checkout Modal */}
        {showCheckout && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-md sm:items-center">
            <div className={`w-full max-w-[480px] p-6 rounded-t-3xl sm:rounded-3xl shadow-2xl relative animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 ${isDark ? 'bg-[#1E1E1E]' : 'bg-white'}`}>
              <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-6 sm:hidden"></div>
              
              <h2 className={`text-xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Informasi Pembeli</h2>
              <p className={`text-xs mb-6 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Isi data diri Anda untuk memproses pesanan.</p>

              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <label className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-white/50' : 'text-slate-400'}`}>Nama Lengkap</label>
                  <input type="text" required value={checkoutForm.buyerName} onChange={e => setCheckoutForm({...checkoutForm, buyerName: e.target.value})} className={`w-full mt-1 px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none ${isDark ? 'bg-white/5 border-white/10 text-white focus:ring-white/20' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-indigo-100'}`} placeholder="Budi Santoso" />
                </div>
                <div>
                  <label className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-white/50' : 'text-slate-400'}`}>Email</label>
                  <input type="email" required value={checkoutForm.buyerEmail} onChange={e => setCheckoutForm({...checkoutForm, buyerEmail: e.target.value})} className={`w-full mt-1 px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none ${isDark ? 'bg-white/5 border-white/10 text-white focus:ring-white/20' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-indigo-100'}`} placeholder="budi@email.com" />
                </div>
                <div>
                  <label className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-white/50' : 'text-slate-400'}`}>No. WhatsApp</label>
                  <input type="tel" value={checkoutForm.buyerPhone} onChange={e => setCheckoutForm({...checkoutForm, buyerPhone: e.target.value})} className={`w-full mt-1 px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none ${isDark ? 'bg-white/5 border-white/10 text-white focus:ring-white/20' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-indigo-100'}`} placeholder="08123456789 (Opsional)" />
                </div>
                <div>
                  <label className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-white/50' : 'text-slate-400'}`}>Alamat Lengkap</label>
                  <textarea value={checkoutForm.buyerAddress} onChange={e => setCheckoutForm({...checkoutForm, buyerAddress: e.target.value})} rows={2} className={`w-full mt-1 px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none resize-none ${isDark ? 'bg-white/5 border-white/10 text-white focus:ring-white/20' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-indigo-100'}`} placeholder="Jl. Sudirman No. 123... (Opsional)"></textarea>
                </div>

                <div className="flex gap-3 mt-8">
                  <button type="button" onClick={() => setShowCheckout(false)} className={`flex-1 py-4 rounded-xl font-bold ${isDark ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-600'}`}>Batal</button>
                  <button type="submit" disabled={isCheckingOut} className="flex-2 py-4 rounded-xl font-black text-white shadow-lg disabled:opacity-50 flex items-center justify-center gap-2" style={{ backgroundColor: primaryColor }}>
                    {isCheckingOut ? (
                       <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : 'Lanjut Pembayaran'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
