import { useState, useEffect } from 'react';
import { Share2, Users, Wallet, Copy, CheckCircle2, ArrowRight, History, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ReferralsTab({ token }: { token: string | null }) {
  const [stats, setStats] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [withdrawError, setWithdrawError] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState('');

  const [showWithdrawalsModal, setShowWithdrawalsModal] = useState(false);
  const [withdrawalsHistory, setWithdrawalsHistory] = useState<any[]>([]);
  const [withdrawalsPage, setWithdrawalsPage] = useState(1);
  const [loadingWithdrawals, setLoadingWithdrawals] = useState(false);
  
  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
      
      const statsRes = await fetch(`${apiUrl}/referrals/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (statsRes.ok) setStats(await statsRes.json());

      const historyRes = await fetch(`${apiUrl}/referrals/history`, {
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

  const openWithdrawalsModal = async () => {
    setShowWithdrawalsModal(true);
    setLoadingWithdrawals(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
      const res = await fetch(`${apiUrl}/withdrawals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setWithdrawalsHistory(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingWithdrawals(false);
    }
  };

  const handleWithdraw = async () => {
    setWithdrawError('');
    setWithdrawSuccess('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
      const res = await fetch(`${apiUrl}/withdrawals`, {
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

  const commissionText = stats 
    ? (stats.commissionType === 'FIXED' 
        ? `Rp ${parseInt(stats.commissionValue).toLocaleString('id-ID')}` 
        : `${stats.commissionValue}%`)
    : 'menarik';

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Program Afiliasi</h1>
          <p className="text-slate-500 mt-2 font-medium">Undang teman dan dapatkan komisi {commissionText} untuk setiap konversi Premium!</p>
        </div>
        <div className="flex flex-col items-end">
          <button 
            onClick={handleWithdraw}
            disabled={stats?.currentBalance < 50000}
            className="bg-linear-to-r from-[#7c2cff] to-[#631fcc] text-white px-8 py-4 rounded-2xl font-black text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all shadow-xl shadow-indigo-200"
          >
            {stats?.currentBalance < 50000 ? 'Min. Cair Rp 50.000' : 'Cairkan Dana Instan'}
          </button>
          {withdrawError && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-wider">{withdrawError}</p>}
          {withdrawSuccess && <p className="text-emerald-500 text-[10px] font-bold mt-2 uppercase tracking-wider">{withdrawSuccess}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-linear-to-br from-[#7c2cff] to-[#631fcc] p-8 rounded-[2.5rem] border border-indigo-500/20 shadow-xl shadow-[#7c2cff]/20 hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="flex items-center justify-between mb-6 relative">
            <div className="w-14 h-14 bg-white/20 text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <Wallet className="w-7 h-7" />
            </div>
            <button 
              onClick={openWithdrawalsModal}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-xl backdrop-blur-md transition-all flex items-center gap-2"
              title="Riwayat Pencairan"
            >
              <History className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <p className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em] mb-1.5">Saldo Komisi</p>
            <p className="text-3xl font-black tracking-tight">Rp {(stats?.currentBalance || 0).toLocaleString('id-ID')}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/80 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="flex items-center justify-between mb-6 relative">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <Users className="w-7 h-7" />
            </div>
          </div>
          <div className="relative">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">Total Undang Teman</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{stats?.totalReferrals || 0}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/80 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="flex items-center justify-between mb-6 relative">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <CheckCircle2 className="w-7 h-7" />
            </div>
          </div>
          <div className="relative">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">Total Penghasilan</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">Rp {(stats?.totalEarned || 0).toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
        <div className="p-8 md:p-10 flex-1 w-full">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-indigo-50 text-[#7c2cff] rounded-2xl flex items-center justify-center shrink-0">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Bagikan Link Anda</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Dapatkan komisi dari setiap konversi</p>
            </div>
          </div>
          
          <div className="flex w-full mt-6 items-center gap-3 bg-slate-50 border-2 border-slate-100 p-2.5 rounded-2xl">
            <div className="flex-1 overflow-hidden px-4">
              <p className="text-slate-900 font-bold text-sm truncate">{referralLink}</p>
            </div>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-2 bg-[#7c2cff] text-white px-6 py-3 rounded-xl font-black text-xs hover:scale-105 transition-all shadow-md shadow-[#7c2cff]/20 shrink-0"
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Tersalin' : 'Salin'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 md:px-10 md:py-8 border-b border-slate-50 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-[#7c2cff] rounded-2xl flex items-center justify-center shrink-0">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Riwayat Komisi</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Riwayat transaksi afiliasi Anda</p>
          </div>
        </div>
        
        {history.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-200">
              <Wallet className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-900 font-black text-lg tracking-tight mb-1">Belum Ada Riwayat</p>
            <p className="text-slate-500 text-sm font-medium">Anda belum memiliki riwayat komisi dari referral.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal</th>
                  <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Teman</th>
                  <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Paket</th>
                  <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Komisi</th>
                  <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 px-6 text-sm text-slate-500 font-medium">{new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                    <td className="py-5 px-6 text-sm text-slate-900 font-black">{item.referee.name}</td>
                    <td className="py-5 px-6 text-sm text-slate-500 font-medium">{item.subscription?.package?.name || 'Premium'}</td>
                    <td className="py-5 px-6 text-sm font-black text-emerald-600">Rp {item.amount.toLocaleString('id-ID')}</td>
                    <td className="py-5 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-wider bg-emerald-50 text-emerald-600 uppercase border border-emerald-100">
                        Sukses
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Withdrawals Modal */}
      {showWithdrawalsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-black text-slate-800">Riwayat Pencairan Dana</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">Daftar semua penarikan dana komisi Anda.</p>
              </div>
              <button onClick={() => setShowWithdrawalsModal(false)} className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {loadingWithdrawals ? (
                <div className="py-12 text-center animate-pulse text-slate-500 font-medium">Memuat data...</div>
              ) : withdrawalsHistory.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-200">
                    <History className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-slate-800 font-bold">Belum Ada Pencairan</p>
                  <p className="text-slate-500 text-sm mt-1">Anda belum pernah melakukan penarikan dana komisi.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-y border-slate-100">
                        <th className="py-4 px-4 text-xs font-black text-slate-500 uppercase tracking-wider">Tanggal</th>
                        <th className="py-4 px-4 text-xs font-black text-slate-500 uppercase tracking-wider">Jumlah (Rp)</th>
                        <th className="py-4 px-4 text-xs font-black text-slate-500 uppercase tracking-wider">Bank</th>
                        <th className="py-4 px-4 text-xs font-black text-slate-500 uppercase tracking-wider">No. Rekening</th>
                        <th className="py-4 px-4 text-xs font-black text-slate-500 uppercase tracking-wider text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {withdrawalsHistory
                        .slice((withdrawalsPage - 1) * 5, withdrawalsPage * 5)
                        .map((w, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 px-4 text-sm text-slate-500 font-medium">{new Date(w.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                            <td className="py-4 px-4 text-sm font-black text-slate-800">{w.amount.toLocaleString('id-ID')}</td>
                            <td className="py-4 px-4 text-sm text-slate-500">{w.bankName}</td>
                            <td className="py-4 px-4 text-sm text-slate-500">{w.accountNumber}</td>
                            <td className="py-4 px-4 text-right">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                w.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                w.status === 'FAILED' ? 'bg-red-50 text-red-600 border border-red-100' :
                                'bg-amber-50 text-amber-600 border border-amber-100'
                              }`}>
                                {w.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  
                  {/* Pagination */}
                  {Math.ceil(withdrawalsHistory.length / 5) > 1 && (
                    <div className="flex items-center justify-between mt-6 border-t border-slate-100 pt-6">
                      <p className="text-sm text-slate-500">
                        Halaman {withdrawalsPage} dari {Math.ceil(withdrawalsHistory.length / 5)}
                      </p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setWithdrawalsPage(p => Math.max(1, p - 1))}
                          disabled={withdrawalsPage === 1}
                          className="p-2 bg-slate-50 text-slate-600 rounded-lg disabled:opacity-50 hover:bg-slate-100 transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => setWithdrawalsPage(p => Math.min(Math.ceil(withdrawalsHistory.length / 5), p + 1))}
                          disabled={withdrawalsPage === Math.ceil(withdrawalsHistory.length / 5)}
                          className="p-2 bg-slate-50 text-slate-600 rounded-lg disabled:opacity-50 hover:bg-slate-100 transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
