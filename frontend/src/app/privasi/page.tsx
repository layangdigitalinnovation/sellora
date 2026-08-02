import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';
import '../landing.css';

export default function Privasi() {
  return (
    <div className="landing-wrapper min-h-screen bg-[#f8f9fc] pb-20">
      {/* Header / Hero */}
      <div className="bg-gradient-to-br from-[#24263a] to-[#7c2cff] pt-12 pb-32 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-10 transition-colors font-medium">
            <ArrowLeft className="w-5 h-5 mr-2" /> Kembali ke Beranda
          </Link>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Kebijakan Privasi</h1>
          </div>
          <p className="text-white/80 mt-4 text-lg">Terakhir diperbarui: 2 Agustus 2026</p>
        </div>
      </div>

      {/* Content Card */}
      <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 p-8 md:p-12 border border-slate-100">
          <div className="space-y-8 text-slate-600 leading-relaxed text-lg">
            
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm">1</span>
                Informasi yang Kami Kumpulkan
              </h2>
              <p>Kami sangat menghargai privasi Anda. Kami mengumpulkan informasi dari Anda saat Anda mendaftar di situs kami, menempatkan pesanan, atau mengisi formulir. Informasi yang dikumpulkan mencakup nama, alamat email, alamat surat, nomor telepon, dan data analitik dasar untuk meningkatkan layanan kami.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm">2</span>
                Penggunaan Informasi
              </h2>
              <p>Informasi yang kami kumpulkan dari Anda secara eksklusif digunakan untuk mempersonalisasi pengalaman Anda, mengembangkan platform, memproses transaksi secara aman, dan mengirimkan email berkala mengenai pembaruan atau pesanan Anda. Kami tidak pernah menjual data pribadi Anda kepada pihak ketiga.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm">3</span>
                Keamanan & Perlindungan Data
              </h2>
              <p>Kami menerapkan berbagai langkah keamanan tingkat lanjut (enkripsi SSL, hashing kata sandi) untuk menjaga kerahasiaan informasi pribadi Anda. Sistem kami secara rutin diaudit untuk mencegah akses yang tidak sah atau kebocoran data.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm">4</span>
                Penggunaan Cookie
              </h2>
              <p>Kami menggunakan cookie untuk membantu kami mengingat status login Anda, melacak preferensi Anda, dan memahami bagaimana Anda berinteraksi dengan situs web kami. Anda dapat memilih untuk menonaktifkan cookie melalui pengaturan peramban (browser) Anda, namun beberapa fitur platform mungkin tidak berfungsi optimal.</p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
