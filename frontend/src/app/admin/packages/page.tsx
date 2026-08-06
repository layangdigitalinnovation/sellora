'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Check, X } from 'lucide-react';

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [form, setForm] = useState({
    id: '',
    name: '',
    slug: '',
    price: 0,
    billingPeriod: 'MONTHLY',
    features: ['']
  });

  const fetchPackages = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/subscriptions/packages`);
      const data = await res.json();
      setPackages(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const openModal = (pkg: any = null) => {
    if (pkg) {
      setForm({ ...pkg, features: Array.isArray(pkg.features) ? pkg.features : [''] });
    } else {
      setForm({ id: '', name: '', slug: '', price: 0, billingPeriod: 'MONTHLY', features: [''] });
    }
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = form.id ? 'PUT' : 'POST';
      const url = form.id 
        ? `${process.env.NEXT_PUBLIC_API_URL!}/subscriptions/packages/${form.id}`
        : `${process.env.NEXT_PUBLIC_API_URL!}/subscriptions/packages`;
        
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      setShowModal(false);
      fetchPackages();
    } catch (err) {
      alert('Gagal menyimpan paket');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Manajemen Paket</h1>
          <p className="text-slate-500 text-sm mt-1">Atur harga dan fitur paket langganan</p>
        </div>
        <button onClick={() => openModal()} className="px-6 py-3 bg-[#4361EE] text-white rounded-xl font-bold text-sm shadow-md flex items-center gap-2 hover:bg-[#3b55d9]">
          <Plus className="w-4 h-4" /> Tambah Paket
        </button>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center"><span className="animate-spin w-8 h-8 border-4 border-[#4361EE] border-t-transparent rounded-full"></span></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map(pkg => (
            <div key={pkg.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-black text-slate-800">{pkg.name}</h3>
                <button onClick={() => openModal(pkg)} className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-slate-100">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-black text-[#4361EE]">Rp {Number(pkg.price).toLocaleString()}</span>
                <span className="text-sm font-bold text-slate-400">/{pkg.billingPeriod === 'MONTHLY' ? 'bln' : 'thn'}</span>
              </div>

              <ul className="space-y-3 flex-1 mb-6">
                {pkg.features?.map((f: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              
              <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Status:</span>
                <span className={pkg.isActive ? "text-green-500" : "text-slate-400"}>{pkg.isActive ? "Aktif" : "Non-aktif"}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-black text-slate-800">{form.id ? 'Edit Paket' : 'Tambah Paket Baru'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nama Paket</label>
                  <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full mt-1 px-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4361EE]" placeholder="Misal: PRO" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Slug</label>
                  <input type="text" required value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="w-full mt-1 px-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4361EE]" placeholder="pro-monthly" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Harga (Rp)</label>
                  <input type="number" required value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} className="w-full mt-1 px-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4361EE]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Periode</label>
                  <select value={form.billingPeriod} onChange={e => setForm({...form, billingPeriod: e.target.value})} className="w-full mt-1 px-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4361EE]">
                    <option value="MONTHLY">Bulanan</option>
                    <option value="YEARLY">Tahunan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex justify-between items-center">
                  Fitur Paket
                  <button type="button" onClick={() => setForm({...form, features: [...form.features, '']})} className="text-[#4361EE] hover:underline">Tambah</button>
                </label>
                <div className="space-y-2 mt-2">
                  {form.features.map((f, i) => (
                    <div key={i} className="flex gap-2">
                      <input type="text" value={f} onChange={e => {
                        const newF = [...form.features];
                        newF[i] = e.target.value;
                        setForm({...form, features: newF});
                      }} className="w-full px-4 py-2 bg-slate-50 border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4361EE]" placeholder="Deskripsi fitur..." />
                      <button type="button" onClick={() => {
                        const newF = form.features.filter((_, idx) => idx !== i);
                        setForm({...form, features: newF});
                      }} className="w-10 flex shrink-0 items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-100"><X className="w-4 h-4"/></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100">Batal</button>
                <button type="submit" className="px-6 py-3 rounded-xl font-black text-white bg-[#4361EE] shadow-lg">Simpan Paket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
