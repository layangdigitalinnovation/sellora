import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import '../landing.css';

export default function KebijakanRefund() {
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
              <RefreshCw className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Kebijakan Refund</h1>
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
                Ketentuan Umum Pengembalian Dana
              </h2>
              <p>KAMU bertindak sebagai platform penyedia sistem. Kebijakan pengembalian dana (refund) untuk produk atau layanan yang dibeli pelanggan pada dasarnya tunduk pada kebijakan masing-masing penjual/kreator. Pembeli diharap menghubungi penjual secara langsung sebelum mengajukan permohonan sengketa.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm">2</span>
                Produk Digital
              </h2>
              <p>Mengingat sifat produk digital yang dapat langsung diunduh, disalin, atau diakses, pengembalian dana umumnya <strong>tidak berlaku</strong> setelah transaksi selesai. Pengecualian hanya diberikan apabila terbukti bahwa file yang diunduh rusak (corrupted) atau sama sekali tidak sesuai dengan deskripsi awal penjual.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm">3</span>
                Tiket Event & Kelas Online
              </h2>
              <p>Untuk pembelian tiket acara, sesi mentoring, atau kelas online, pembatalan dan refund hanya dapat diproses apabila pengajuan dilakukan selambat-lambatnya H-3 (tiga hari) sebelum jadwal acara, atau apabila terjadi pembatalan sepihak dari pihak penyelenggara.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm">4</span>
                Proses Pengembalian Dana
              </h2>
              <p>Setiap pengajuan refund yang telah disetujui akan diproses ke rekening/metode pembayaran awal Anda dalam estimasi waktu <strong>7-14 hari kerja</strong>. Potongan biaya administrasi gerbang pembayaran (payment gateway) mungkin berlaku dan tidak dapat dikembalikan.</p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
