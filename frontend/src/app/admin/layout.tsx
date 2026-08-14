'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Package, LogOut, PenTool, Settings, Tag } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsAuthenticated(true);
      return;
    }

    const token = localStorage.getItem('admin_token');
    const userStr = localStorage.getItem('admin_user');

    if (!token || !userStr) {
      router.replace('/admin/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'ADMIN') {
        router.replace('/admin/login');
        return;
      }
      setIsAuthenticated(true);
    } catch (e) {
      router.replace('/admin/login');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.replace('/admin/login');
  };

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><span className="animate-spin w-8 h-8 border-4 border-[#7c2cff] border-t-transparent rounded-full"></span></div>;
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const menu = [
    { name: 'Ikhtisar Platform', href: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Kreator', href: '/admin/sellers', icon: <Users className="w-5 h-5" /> },
    { name: 'CMS Blog', href: '/admin/blog', icon: <PenTool className="w-5 h-5" /> },
    { name: 'Pengaturan Paket', href: '/admin/packages', icon: <Package className="w-5 h-5" /> },
    { name: 'Manajemen Voucher', href: '/admin/vouchers', icon: <Tag className="w-5 h-5" /> },
    { name: 'Pengaturan', href: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 fixed h-full flex flex-col z-10">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8" viewBox="0 0 64 64" aria-hidden="true">
              <defs><linearGradient id="kgadmin" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ff8a00"/><stop offset=".42" stopColor="#f13e8e"/><stop offset="1" stopColor="#5f2cff"/></linearGradient></defs>
              <rect x="8" y="7" width="13" height="50" rx="6.5" fill="url(#kgadmin)"/>
              <path d="M25 32 47 8c4-4 11-1 11 5v4c0 2-1 4-3 6L42 35l13 8c2 1 3 3 3 5v3c0 6-7 9-12 6L25 44c-5-3-6-9-2-13l2-2v3Z" fill="url(#kgadmin)"/>
            </svg>
            <span className="font-bold text-xl tracking-tighter text-slate-900 leading-none flex flex-col justify-center" style={{ textAlign: 'left' }}>
              KAMU<span className="text-[9px] text-slate-500 font-medium tracking-normal -mt-0.5">Admin Portal</span>
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menu.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  isActive 
                    ? 'bg-[#7c2cff]/10 text-[#7c2cff]' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="font-bold text-slate-800">Panel Admin</h2>
          <div className="flex items-center gap-6">
            <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
               <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Admin" alt="Admin" />
            </div>
          </div>
        </header>
        <div className="p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
