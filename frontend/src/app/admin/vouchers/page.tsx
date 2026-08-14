'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Check, X, Tag, Trash2 } from 'lucide-react';

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [form, setForm] = useState({
    id: '',
    code: '',
    discountPercent: 0,
    isActive: true
  });

  const fetchVouchers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/admin/vouchers`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      setVouchers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const openModal = (voucher: any = null) => {
    if (voucher) {
      setForm({ ...voucher });
    } else {
      setForm({ id: '', code: '', discountPercent: 0, isActive: true });
    }
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = form.id ? 'PUT' : 'POST';
      const url = form.id 
        ? `${process.env.NEXT_PUBLIC_API_URL!}/admin/vouchers/${form.id}`
        : `${process.env.NEXT_PUBLIC_API_URL!}/admin/vouchers`;
        
      await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          code: form.code.toUpperCase(),
          discountPercent: Number(form.discountPercent),
          isActive: form.isActive
        })
      });
      
      setShowModal(false);
      fetchVouchers();
    } catch (err) {
      alert('Gagal menyimpan voucher');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus voucher ini?')) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/admin/vouchers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchVouchers();
    } catch (err) {
      alert('Gagal menghapus voucher');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800">Manajemen Voucher</h1>
          <p className="text-slate-500 font-medium mt-1">Buat dan kelola kode diskon untuk pelanggan</p>
        </div>
        <button onClick={() => openModal()} className="px-6 py-3 bg-linear-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-200/50 flex items-center gap-2 hover:scale-105 hover:shadow-indigo-500/30 transition-all duration-300 uppercase tracking-widest">
          <Plus className="w-4 h-4" /> Tambah Voucher
        </button>
      </div>

      {loading ? (
        <div className="h-60 flex items-center justify-center">
          <span className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full shadow-lg"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vouchers.map((voucher, idx) => (
            <div key={voucher.id} className="group bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/40 border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-purple-400/20 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100 shadow-inner group-hover:scale-110 transition-transform">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">{voucher.code}</h3>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${voucher.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {voucher.isActive ? 'Aktif' : 'Non-aktif'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openModal(voucher)} className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(voucher.id)} className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Diskon</span>
                <span className="text-2xl font-black text-indigo-600">{voucher.discountPercent}%</span>
              </div>
              
              <div className="mt-6 flex justify-between items-center text-[11px] font-semibold text-slate-400">
                <span>Dibuat: {new Date(voucher.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                {voucher.discountPercent === 100 && (
                  <span className="text-amber-500 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">Bypass Payment</span>
                )}
              </div>
            </div>
          ))}
          {vouchers.length === 0 && (
            <div className="col-span-full h-40 flex flex-col items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded-3xl text-slate-400">
              <Tag className="w-8 h-8 mb-2 opacity-50" />
              <p className="font-semibold text-sm">Belum ada voucher yang dibuat</p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden flex flex-col border border-white/50 animate-in zoom-in-95">
            <div className="p-6 md:p-8 flex justify-between items-center bg-slate-50/80 border-b border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-400/10 rounded-full blur-2xl pointer-events-none"></div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight relative z-10">{form.id ? 'Edit Voucher' : 'Buat Voucher Baru'}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 shadow-sm relative z-10"><X className="w-4 h-4"/></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 md:p-8 space-y-6">
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Kode Voucher</label>
                <input 
                  type="text" 
                  required 
                  value={form.code} 
                  onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} 
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all uppercase placeholder:normal-case placeholder:font-medium" 
                  placeholder="Misal: GRATIS100" 
                />
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Persentase Diskon (%)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    required 
                    min="1" 
                    max="100" 
                    value={form.discountPercent || ''} 
                    onChange={e => setForm({...form, discountPercent: Number(e.target.value)})} 
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all pr-12" 
                    placeholder="100"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-400">%</span>
                </div>
                {form.discountPercent === 100 && (
                  <p className="mt-2 text-xs font-semibold text-amber-600 bg-amber-50 p-2 rounded-lg flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    Diskon 100% akan mem-bypass payment gateway.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <input 
                  type="checkbox" 
                  id="isActive" 
                  checked={form.isActive} 
                  onChange={e => setForm({...form, isActive: e.target.checked})} 
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300"
                />
                <label htmlFor="isActive" className="text-sm font-bold text-slate-700 cursor-pointer select-none">
                  Voucher Aktif
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3.5 rounded-2xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors">Batal</button>
                <button type="submit" className="px-6 py-3.5 rounded-2xl font-black text-white bg-linear-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 hover:scale-105 transition-all">Simpan Voucher</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
