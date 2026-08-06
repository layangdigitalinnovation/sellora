'use client';

import { useEffect, useState } from 'react';
import { Save, Settings } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL!;

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${apiUrl}/admin/settings`);
      const data = await res.json();
      setSettings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch(`${apiUrl}/admin/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (!res.ok) throw new Error('Gagal menyimpan pengaturan');
      setMessage('Pengaturan berhasil disimpan!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(err.message || 'Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center"><div className="animate-pulse">Memuat pengaturan...</div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-black text-slate-800">Pengaturan Sistem</h1>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-6">Program Afiliasi</h2>
        
        <form onSubmit={handleSave} className="space-y-6 max-w-xl">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tipe Komisi</label>
              <select 
                value={settings.AFFILIATE_COMMISSION_TYPE || 'PERCENTAGE'} 
                onChange={(e) => setSettings({...settings, AFFILIATE_COMMISSION_TYPE: e.target.value})}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="PERCENTAGE">Persentase (%)</option>
                <option value="FIXED">Nominal Tetap (Rp)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nilai Komisi</label>
              <div className="relative">
                {settings.AFFILIATE_COMMISSION_TYPE === 'FIXED' && (
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
                )}
                <input 
                  type="number" 
                  required
                  value={settings.AFFILIATE_COMMISSION_VALUE || '20'} 
                  onChange={(e) => setSettings({...settings, AFFILIATE_COMMISSION_VALUE: e.target.value})}
                  className={`w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${settings.AFFILIATE_COMMISSION_TYPE === 'FIXED' ? 'pl-10' : ''}`}
                />
                {settings.AFFILIATE_COMMISSION_TYPE !== 'FIXED' && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">
                {settings.AFFILIATE_COMMISSION_TYPE === 'FIXED' 
                  ? 'Contoh: 50000 (untuk Rp 50.000)' 
                  : 'Contoh: 20 (untuk 20% dari harga paket)'}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center gap-4">
            <button 
              type="submit" 
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
            </button>
            {message && (
              <span className={`text-sm font-bold ${message.includes('Gagal') || message.includes('kesalahan') ? 'text-red-500' : 'text-emerald-500'}`}>
                {message}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
