'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle2, Clock, AlertCircle, Download, ChevronLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { SecureVideoPlayer } from '@/components/SecureVideoPlayer';
import { SecurePDFViewer } from '@/components/SecurePDFViewer';

export default function OrderSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const orderId = params?.orderId as string;
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    
    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/payments/order/${orderId}`);
        if (!res.ok) throw new Error('Pesanan tidak ditemukan.');
        const data = await res.json();
        setOrder(data);
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();

    const interval = setInterval(() => {
      if (order?.status === 'PENDING') {
        fetchOrder();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId, order?.status]);

  const fetchVideoUrl = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/payments/order/${orderId}/video-url`);
      const data = await res.json();
      if (data.url) setVideoUrl(data.url);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAccessContent = () => {
    if (!order?.product?.fileUrl) return;
    
    const mime = order.product.mimeType || '';
    if (mime.includes('video')) {
      fetchVideoUrl();
    }
    setShowContent(true);
  };

  if (loading && !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-[#4361EE] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <h1 className="text-2xl font-black text-slate-800 mb-2">Oops!</h1>
        <p className="text-slate-500 mb-6">{error || 'Pesanan tidak ditemukan.'}</p>
        <Link href={`/${slug}`} className="px-6 py-3 bg-[#4361EE] text-white rounded-xl font-bold text-sm shadow-lg">
          Kembali ke Toko
        </Link>
      </div>
    );
  }

  const { store, product } = order;
  const isDark = store.theme === 'dark';
  const primaryColor = store.primaryColor || '#4361EE';
  const bgColor = store.contentBgColor || (isDark ? '#1E1E1E' : '#ffffff');
  const textColor = isDark ? '#FFFFFF' : '#1e293b';

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-start ${isDark ? 'text-white' : 'text-slate-800'}`} style={{ backgroundColor: bgColor }}>
      <div className="w-full max-w-[480px] min-h-screen flex flex-col relative px-4 py-8 shadow-2xl shadow-black/5" style={{ backgroundColor: bgColor }}>
        
        {/* Header */}
        <div className="w-full flex items-center justify-center mb-8 relative">
          <button onClick={() => router.push(`/${slug}`)} className={`absolute left-0 w-10 h-10 flex items-center justify-center rounded-full ${isDark ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-600'}`}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-black text-sm uppercase tracking-widest" style={{ color: primaryColor }}>Status Pesanan</span>
        </div>

        {/* Status Card */}
        <div className={`w-full p-6 rounded-3xl flex flex-col items-center text-center shadow-sm border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100'}`}>
          {order.status === 'PAID' ? (
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
          ) : order.status === 'PENDING' ? (
            <Clock className="w-16 h-16 text-orange-500 mb-4" />
          ) : (
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          )}

          <h1 className="text-2xl font-black mb-1" style={{ color: textColor }}>
            {order.status === 'PAID' ? 'Pembayaran Berhasil!' : order.status === 'PENDING' ? 'Menunggu Pembayaran' : 'Pembayaran Gagal'}
          </h1>
          <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>ID: {order.id}</p>

          {order.status === 'PENDING' && (
            <p className={`mt-4 text-sm font-medium p-4 rounded-xl ${isDark ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-600'}`}>
              Silakan selesaikan pembayaran Anda melalui tautan Xendit yang telah diberikan atau cek email Anda. Halaman ini akan otomatis diperbarui.
            </p>
          )}

          {order.status === 'PAID' && (
            <p className={`mt-4 text-sm font-medium p-4 rounded-xl ${isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600'}`}>
              Terima kasih! Pesanan Anda telah kami terima dan pembayaran sudah dikonfirmasi.
            </p>
          )}
        </div>

        {/* Product Summary */}
        <div className={`w-full mt-6 p-5 rounded-3xl border shadow-sm ${isDark ? 'bg-[#2A2A2A] border-white/5' : 'bg-white border-slate-100'}`}>
          <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Ringkasan Produk</h3>
          <div className="flex gap-4 items-center">
            {product.imageUrl && (
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1">
              <h4 className="font-bold text-sm line-clamp-2 leading-snug" style={{ color: textColor }}>{product.title}</h4>
              <p className={`text-xs mt-1 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Rp {Number(order.amount).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Actions & Content */}
        {order.status === 'PAID' ? (
          <div className="mt-8 space-y-6 w-full">
             {!showContent ? (
               <button onClick={handleAccessContent} className="w-full py-4 rounded-xl font-black text-white shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2" style={{ backgroundColor: primaryColor }}>
                 <Download className="w-5 h-5" />
                 Akses Produk
               </button>
             ) : (
               <div className="w-full animate-in fade-in zoom-in duration-300">
                 {order.product?.mimeType?.includes('video') ? (
                   videoUrl ? <SecureVideoPlayer src={videoUrl} /> : <div className="p-4 text-center text-sm">Memuat video...</div>
                 ) : order.product?.mimeType?.includes('pdf') ? (
                   <SecurePDFViewer src={`http://localhost:3001/api/payments/order/${orderId}/download-pdf`} />
                 ) : (
                   <a href={`http://localhost:3001/api/payments/order/${orderId}/download-file`} target="_blank" rel="noreferrer" className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-white" style={{ backgroundColor: primaryColor }}>
                     Unduh File <ExternalLink className="w-4 h-4" />
                   </a>
                 )}
               </div>
             )}

             <Link href={`/${slug}`} className={`w-full block text-center py-4 rounded-xl font-bold transition-colors ${isDark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
               Kembali Belanja
             </Link>
          </div>
        ) : order.status === 'PENDING' ? (
          <div className="mt-8 space-y-3">
             <Link href={`/${slug}`} className={`w-full block text-center py-4 rounded-xl font-bold transition-colors ${isDark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
               Kembali ke Toko
             </Link>
          </div>
        ) : null}

      </div>
    </div>
  );
}
