'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Package, LogOut, PenTool } from 'lucide-react';

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
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><span className="animate-spin w-8 h-8 border-4 border-[#4361EE] border-t-transparent rounded-full"></span></div>;
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const menu = [
    { name: 'Ikhtisar Platform', href: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Kreator', href: '/admin/sellers', icon: <Users className="w-5 h-5" /> },
    { name: 'CMS Blog', href: '/admin/blog', icon: <PenTool className="w-5 h-5" /> },
    { name: 'Pengaturan Paket', href: '/admin/packages', icon: <Package className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 fixed h-full flex flex-col z-10">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-[#4361EE]">
            <div className="w-8 h-8 rounded-lg bg-[#4361EE] text-white flex items-center justify-center font-black text-lg">A</div>
            <span className="font-black text-xl tracking-tight text-slate-800">Admin</span>
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
                    ? 'bg-[#4361EE]/10 text-[#4361EE]' 
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
