import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import '../landing.css';

export default function SyaratKetentuan() {
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
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Syarat & Ketentuan</h1>
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
                Pendahuluan
              </h2>
              <p>Selamat datang di KAMU (Sistem Kelola Aktivitas Monetisasi Usaha). Dengan menggunakan layanan kami, Anda menyetujui syarat dan ketentuan berikut ini. Harap baca dengan saksama karena dokumen ini mengikat secara hukum antara Anda dan platform KAMU.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm">2</span>
                Layanan Kami
              </h2>
              <p>Kami menyediakan platform inovatif bagi kreator dan pebisnis untuk menjual produk digital, layanan fisik, keanggotaan, kelas online, dan fitur monetisasi lainnya. Semua transaksi, penyediaan produk, dan komunikasi dengan pelanggan akhir sepenuhnya berada di bawah kendali dan tanggung jawab Anda sebagai pengguna layanan.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm">3</span>
                Kewajiban Pengguna Akun
              </h2>
              <p>Pengguna bertanggung jawab penuh atas keamanan dan kerahasiaan akun mereka. Anda tidak diperkenankan menggunakan platform KAMU untuk aktivitas ilegal, penipuan, pelanggaran hak cipta, atau distribusi konten yang melanggar norma yang berlaku. Setiap aktivitas mencurigakan harus dilaporkan segera kepada tim dukungan kami.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm">4</span>
                Biaya & Pembayaran
              </h2>
              <p>KAMU berhak mengenakan biaya berlangganan atau biaya layanan sesuai dengan paket yang Anda pilih. Semua pembayaran bersifat final dan tidak dapat dikembalikan kecuali diatur secara khusus dalam <Link href="/refund" className="text-indigo-600 hover:underline">Kebijakan Refund</Link> kami.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm">5</span>
                Perubahan Ketentuan
              </h2>
              <p>Kami berhak mengubah, memperbarui, atau memodifikasi syarat dan ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya. Penggunaan platform secara berkelanjutan setelah adanya perubahan dianggap sebagai bentuk persetujuan Anda terhadap ketentuan yang baru.</p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
