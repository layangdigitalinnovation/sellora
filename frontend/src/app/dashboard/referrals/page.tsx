'use client';

import { useState, useEffect } from 'react';
import { Share2, Users, Wallet, Copy, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ReferralsPage() {
  const [stats, setStats] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [withdrawError, setWithdrawError] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState('');
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const statsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api'}/referrals/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (statsRes.ok) setStats(await statsRes.json());

      const historyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api'}/referrals/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (historyRes.ok) setHistory(await historyRes.json());

    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const referralLink = typeof window !== 'undefined' && stats 
    ? `${window.location.origin}/?ref=${stats.referralCode}` 
    : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWithdraw = async () => {
    setWithdrawError('');
    setWithdrawSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api'}/withdrawals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount: stats.currentBalance })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Withdrawal failed');
      setWithdrawSuccess('Pencairan dana berhasil diajukan!');
      fetchData(); // refresh balance
    } catch (e: any) {
      setWithdrawError(e.message);
    }
  };

  if (isLoading) return <div className="p-8 text-center"><div className="animate-pulse">Memuat data...</div></div>;

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Program Afiliasi</h1>
        <p className="text-slate-500 mt-2">Undang teman dan dapatkan komisi Rp 50.000 untuk setiap konversi Premium!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-br from-[#7c2cff] to-[#631fcc] rounded-3xl p-6 text-white shadow-xl shadow-[#7c2cff]/20">
          <div className="flex items-center gap-3 mb-4 opacity-80">
            <Wallet className="w-5 h-5" />
            <h3 className="font-semibold text-sm">Saldo Komisi</h3>
          </div>
          <p className="text-3xl font-black mb-6">
            Rp {(stats?.currentBalance || 0).toLocaleString('id-ID')}
          </p>
          <button 
            onClick={handleWithdraw}
            disabled={stats?.currentBalance < 50000}
            className="w-full bg-white text-[#7c2cff] py-3 rounded-xl font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
          >
            {stats?.currentBalance < 50000 ? 'Minimum Pencairan Rp 50.000' : 'Cairkan Dana'}
          </button>
          {withdrawError && <p className="text-red-300 text-xs mt-2">{withdrawError}</p>}
          {withdrawSuccess && <p className="text-green-300 text-xs mt-2">{withdrawSuccess}</p>}
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-slate-500">
            <Users className="w-5 h-5" />
            <h3 className="font-semibold text-sm">Total Undang Teman</h3>
          </div>
          <p className="text-3xl font-black text-slate-900 mb-2">
            {stats?.totalReferrals || 0}
          </p>
          <p className="text-sm text-slate-400">Pengguna terdaftar</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-slate-500">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-semibold text-sm">Total Penghasilan</h3>
          </div>
          <p className="text-3xl font-black text-slate-900 mb-2">
            Rp {(stats?.totalEarned || 0).toLocaleString('id-ID')}
          </p>
          <p className="text-sm text-slate-400">Total komisi yang didapat</p>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl p-8 mb-10 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Bagikan Link Anda</h2>
        <p className="text-slate-500 text-sm mb-6">Bagikan link di bawah ini ke teman atau followers Anda.</p>
        
        <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
          <div className="flex-1 overflow-hidden">
            <p className="text-slate-900 font-medium truncate">{referralLink}</p>
          </div>
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-800 transition-colors"
          >
            {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Tersalin' : 'Salin'}
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6">Riwayat Komisi</h2>
        {history.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-100">
            <p className="text-slate-500 font-medium">Belum ada riwayat komisi</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Teman</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Paket</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Komisi</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm text-slate-900">{new Date(item.createdAt).toLocaleDateString('id-ID')}</td>
                    <td className="py-4 px-6 text-sm text-slate-900 font-medium">{item.referee.name}</td>
                    <td className="py-4 px-6 text-sm text-slate-500">{item.subscription.package.name}</td>
                    <td className="py-4 px-6 text-sm font-bold text-[#7c2cff]">Rp {item.amount.toLocaleString('id-ID')}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Selesai
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
