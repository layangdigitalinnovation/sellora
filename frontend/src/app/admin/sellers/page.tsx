'use client';

import { useEffect, useState } from 'react';
import { Store, User, CreditCard, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // States for search, filter, and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/sellers`)
      .then(res => res.json())
      .then(res => {
        setSellers(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Filter and paginate sellers
  const filteredSellers = sellers.filter(seller => {
    const matchesSearch = seller.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          seller.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const activeSub = seller.subscriptions?.[0];
    
    if (filterStatus === 'PREMIUM') return matchesSearch && activeSub;
    if (filterStatus === 'FREE') return matchesSearch && !activeSub;
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredSellers.length / itemsPerPage);
  const paginatedSellers = filteredSellers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800">Daftar Sellers</h1>
        <p className="text-slate-500 text-sm mt-1">Kelola pengguna dan lihat status langganan mereka.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#4361EE] focus:ring-4 focus:ring-[#4361EE]/20 rounded-2xl transition-all outline-none text-sm font-medium text-slate-700"
          />
        </div>
        <div className="relative w-full sm:w-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
            <Filter className="w-5 h-5 text-slate-400" />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            className="bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#4361EE] focus:ring-4 focus:ring-[#4361EE]/20 rounded-2xl px-4 py-3 outline-none font-bold text-sm text-slate-700 w-full sm:w-48 appearance-none transition-all cursor-pointer"
          >
            <option value="ALL">Semua Status</option>
            <option value="FREE">Hanya Free</option>
            <option value="PREMIUM">Hanya Premium</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        {loading ? (
          <div className="h-40 flex items-center justify-center"><span className="animate-spin w-8 h-8 border-4 border-[#4361EE] border-t-transparent rounded-full"></span></div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    <th className="p-5">Seller</th>
                    <th className="p-5">Toko (Store)</th>
                    <th className="p-5">Paket Aktif</th>
                    <th className="p-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedSellers.map((seller) => {
                    const activeSub = seller.subscriptions?.[0];
                    const store = seller.Store?.[0];

                    return (
                      <tr key={seller.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg border border-indigo-100">
                              {seller.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-sm">{seller.name}</p>
                              <p className="text-xs text-slate-500">{seller.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-5">
                          {store ? (
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-700 text-sm">{store.name}</span>
                              <span className="text-xs text-slate-400">/{store.slug}</span>
                            </div>
                          ) : (
                            <span className="text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 inline-block">Belum buat toko</span>
                          )}
                        </td>
                        <td className="p-5">
                          {activeSub ? (
                            <div className="flex flex-col">
                              <span className="font-bold text-[#4361EE] text-sm uppercase tracking-wide">{activeSub.package.name}</span>
                              <span className="text-xs text-slate-500">Exp: {new Date(activeSub.endDate).toLocaleDateString()}</span>
                            </div>
                          ) : (
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">STARTER (FREE)</span>
                          )}
                        </td>
                        <td className="p-5">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${activeSub ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
                            {activeSub ? 'Premium' : 'Free'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                  {paginatedSellers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-12 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <User className="w-12 h-12 mb-4 text-slate-200" />
                          <p className="font-bold text-slate-600 text-lg">Tidak ada kreator ditemukan</p>
                          <p className="text-sm mt-1">Coba sesuaikan kata kunci atau filter status.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredSellers.length > 0 && (
              <div className="p-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
                <span className="text-sm text-slate-500 font-medium">
                  Menampilkan <span className="font-bold text-slate-800">{Math.min(filteredSellers.length, (currentPage - 1) * itemsPerPage + 1)}</span> - <span className="font-bold text-slate-800">{Math.min(filteredSellers.length, currentPage * itemsPerPage)}</span> dari <span className="font-bold text-slate-800">{filteredSellers.length}</span> kreator
                </span>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center gap-1 hidden sm:flex">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${currentPage === i + 1 ? 'bg-[#4361EE] text-white shadow-md shadow-[#4361EE]/20' : 'text-slate-600 hover:bg-white border border-transparent hover:border-slate-200'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <span className="sm:hidden text-sm font-bold text-slate-700 mx-2">
                    {currentPage} / {totalPages}
                  </span>

                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

