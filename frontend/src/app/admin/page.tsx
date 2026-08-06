'use client';

import { useEffect, useState } from 'react';
import { Users, Store, Package, Activity, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/analytics`)
      .then(res => res.json())
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="h-full flex items-center justify-center"><span className="animate-spin w-8 h-8 border-4 border-[#4361EE] border-t-transparent rounded-full"></span></div>;
  }

  const stats = [
    { title: 'Total Kreator', value: data?.totalSellers || 0, icon: <Users className="w-6 h-6 text-blue-500" /> },
    { title: 'Langganan Aktif', value: data?.activeSubscriptions || 0, icon: <Activity className="w-6 h-6 text-purple-500" /> },
    { title: 'Total Toko', value: data?.totalStores || 0, icon: <Store className="w-6 h-6 text-orange-500" /> },
    { title: 'Produk Dibuat', value: data?.totalProducts || 0, icon: <Package className="w-6 h-6 text-green-500" /> },
    { title: 'MRR (Langganan)', value: `Rp ${(data?.monthlyRecurringRevenue || 0).toLocaleString('id-ID')}`, icon: <DollarSign className="w-6 h-6 text-emerald-500" /> },
    { title: 'GMV (Pesanan)', value: `Rp ${(data?.totalTransactionVolume || 0).toLocaleString('id-ID')}`, icon: <DollarSign className="w-6 h-6 text-indigo-500" /> },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800">Analitik Dasbor</h1>
        <p className="text-slate-500 text-sm mt-1">Ikhtisar platform dan metrik langganan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
              i === 0 ? 'bg-blue-50' : 
              i === 1 ? 'bg-purple-50' : 
              i === 2 ? 'bg-orange-50' : 
              i === 3 ? 'bg-green-50' : 
              i === 4 ? 'bg-emerald-50' : 'bg-indigo-50'
            }`}>
              {s.icon}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{s.title}</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mt-8">
        <h2 className="text-lg font-bold text-slate-800 mb-6">Pertumbuhan Platform (6 Bulan Terakhir)</h2>
        <div className="h-80 w-full mt-6">
          {data?.chartData && data.chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSellers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4361EE" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4361EE" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorStores" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1E293B', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="Sellers" stroke="#4361EE" strokeWidth={3} fillOpacity={1} fill="url(#colorSellers)" name="Kreator" />
                <Area type="monotone" dataKey="Stores" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorStores)" name="Toko" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center text-slate-400 font-medium">
              Data Tidak Tersedia
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
