'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Loader2, ArrowRight, User, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal melakukan pendaftaran');
      }

      window.location.href = '/login';
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 flex items-center justify-center bg-white relative overflow-hidden font-sans">
      {/* Background Texture */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#4361EE_0.5px,transparent_0.5px)] bg-size-[32px_32px] opacity-[0.03]"></div>
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#4361EE]/5 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#0EAD7B]/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="w-full max-w-[400px] px-6 relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-[0_20px_50px_-12px_rgba(67,97,238,0.1)]">
          <div className="text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 bg-[#4361EE] rounded-lg flex items-center justify-center text-white font-black text-lg group-hover:rotate-6 transition-transform">
                S
              </div>
              <span className="font-bold text-xl tracking-tighter text-[#4361EE]">Sellora</span>
            </Link>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Daftar Akun</h1>
          </div>

          <form onSubmit={handleRegister} className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama</label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#4361EE] transition-colors" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#4361EE]/5 focus:border-[#4361EE] transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#4361EE] transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@anda.com"
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#4361EE]/5 focus:border-[#4361EE] transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#4361EE] transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-10 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#4361EE]/5 focus:border-[#4361EE] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-[10px] font-bold text-center bg-red-50 py-1.5 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full group overflow-hidden py-3 bg-[#4361EE] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#4361EE]/20 hover:bg-[#3551d1] transition-all flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Daftar Sekarang</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-50 text-center">
            <p className="text-slate-400 text-xs font-bold">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-[#4361EE] hover:underline">Masuk</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
