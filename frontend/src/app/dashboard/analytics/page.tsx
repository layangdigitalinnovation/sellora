'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, MousePointerClick, CheckCircle, TrendingUp } from 'lucide-react';

export default function AnalyticsDashboardPage() {
  const router = useRouter();
  const [funnelData, setFunnelData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return router.push('/login');

        const storeRes = await fetch('http://localhost:3001/api/stores', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const stores = await storeRes.json();
        
        if (stores && stores.length > 0) {
          const storeId = stores[0].id;
          const funnelRes = await fetch(`http://localhost:3001/api/analytics/funnel/${storeId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const funnel = await funnelRes.json();
          setFunnelData(funnel);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [router]);

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[500px]">
        <div className="w-8 h-8 border-4 border-[#4361EE] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const views = funnelData.reduce((acc, curr) => acc + curr.views, 0);
  const clicks = funnelData.reduce((acc, curr) => acc + curr.clicks, 0);
  const conversions = funnelData.reduce((acc, curr) => acc + curr.conversions, 0);
  const conversionRate = views > 0 ? ((conversions / views) * 100).toFixed(1) : '0';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-slate-100 shadow-xl rounded-xl">
          <p className="font-bold text-slate-800 mb-3">{label}</p>
          <div className="space-y-2 text-sm">
            <p className="text-blue-600 font-bold flex justify-between gap-4"><span>Views:</span> <span>{payload[0].payload.views}</span></p>
            <p className="text-orange-500 font-bold flex justify-between gap-4"><span>Clicks:</span> <span>{payload[0].payload.clicks}</span></p>
            <p className="text-green-600 font-bold flex justify-between gap-4"><span>Sales:</span> <span>{payload[0].payload.conversions}</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Analytics Funnel</h1>
        <p className="text-slate-500 mt-2 font-medium">Pantau performa konversi produk Anda secara real-time berdasarkan data traffic terbaru.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-[140px]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Views</p>
          </div>
          <h3 className="text-4xl font-black text-slate-800">{views}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-[140px]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
              <MousePointerClick className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Checkout Clicks</p>
          </div>
          <h3 className="text-4xl font-black text-slate-800">{clicks}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-[140px]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Sales</p>
          </div>
          <h3 className="text-4xl font-black text-slate-800">{conversions}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-[140px]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4361EE]/10 text-[#4361EE] flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Conv. Rate</p>
          </div>
          <h3 className="text-4xl font-black text-slate-800">{conversionRate}%</h3>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="mb-8 flex items-center gap-4">
          <h3 className="text-xl font-black text-slate-800">Product Conversion Funnel</h3>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg uppercase tracking-widest">Real-time</span>
        </div>
        <div className="h-[400px] w-full">
          {funnelData.length === 0 ? (
             <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                <Activity className="w-12 h-12 mb-4 opacity-50" />
                <p className="font-medium">Belum ada data analytics untuk toko ini.</p>
             </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={funnelData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="productTitle" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', radius: 8 }} />
                <Bar dataKey="views" name="Views" fill="#bfdbfe" radius={[8, 8, 0, 0]} barSize={48} />
                <Bar dataKey="clicks" name="Checkout Clicks" fill="#fed7aa" radius={[8, 8, 0, 0]} barSize={48} />
                <Bar dataKey="conversions" name="Conversions" fill="#bbf7d0" radius={[8, 8, 0, 0]} barSize={48} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
