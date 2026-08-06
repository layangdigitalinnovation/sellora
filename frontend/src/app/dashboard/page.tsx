'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  Users,
  Settings,
  Plus,
  TrendingUp,
  CreditCard,
  Bell,
  Search,
  ChevronRight,
  ChevronLeft,
  Package,
  Globe,
  Loader2,
  AlertCircle,
  Shield,
  ArrowRight,
  ExternalLink,
  Save,
  CheckCircle2,
  Download,
  Menu,
  X,
  Share2,
  Eye,
  MoreHorizontal,
  Link2,
  Image as ImageIcon,
  FileText,
  PlayCircle,
  Smartphone,
  Upload,
  Cloud,
  Mail,
  Calendar,
  Filter,
  ArrowDownToLine,
  Layout,
  Palette,
  Type,
  Link as LinkIcon,
  Wallet,
  History,
  Landmark,
  Building2,
  DollarSign,
  Gem,
  Send,
  Check,
  Clock
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ReferralsTab from '@/components/ReferralsTab';
import * as XLSX from 'xlsx';

const STORE_DOMAIN = process.env.NEXT_PUBLIC_STORE_DOMAIN || 'kamu.dijaminsuka.com';

type View = 'home' | 'my-link' | 'appearance' | 'analytics' | 'orders' | 'settings' | 'add-product' | 'customers' | 'earnings' | 'referrals';

export default function DashboardPage() {
  const { lang, setLang, t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    customersTrend: 0,
    ordersTrend: 0,
    revenueTrend: 0
  });
  const [activeTab, setActiveTab] = useState<View>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [bankDetails, setBankDetails] = useState({ bankName: '', accountNumber: '', accountHolder: '' });
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isUpgradeLimitModalOpen, setIsUpgradeLimitModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [productSearch, setProductSearch] = useState('');
  const [productFilter, setProductFilter] = useState('ALL');
  const [productPage, setProductPage] = useState(1);
  const productsPerPage = 5;

  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('ALL');


  const [visitorPeriod, setVisitorPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [visitorChartData, setVisitorChartData] = useState<{labels: string[], data: number[]}>({labels: [], data: []});
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'30_days' | '90_days'>('30_days');
  const [funnelData, setFunnelData] = useState({ views: 0, clicks: 0, paid: 0 });

  // Forms State
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    originalPrice: '',
    type: 'DIGITAL_FILE',
    description: '',
    platform: 'upload',
    fileUrl: '',
    imageUrl: '',
    isPwyw: false,
    minPwywPrice: '',
    isFlashSale: false,
    flashSaleEndDate: '',
    flashSaleMaxQuota: '',
    bookingSlots: [] as Array<{ id?: string, startTime: string, endTime: string, maxParticipants: string, meetingLink: string }>,
  });
  const [storeSettings, setStoreSettings] = useState({
    name: '',
    slug: '',
    customDomain: '',
    description: ''
  });
  const [storeAppearance, setStoreAppearance] = useState({
    primaryColor: '#7c2cff',
    theme: 'Inter',
    customCss: 'list', // mapping layout to customCss
    headerImageUrl: '',
    profileImageUrl: '',
    socialLinks: { instagram: '', tiktok: '', youtube: '', x: '' } as Record<string, string>,
    contentBgColor: '#F8FAFC',
    bannerImageUrl: '',
    ctaText: '',
    ctaLink: ''
  });
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notif, setNotif] = useState({ show: false, message: '', type: 'success' });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if(!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL!}/analytics/chart?period=${visitorPeriod}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(r => r.json())
    .then(data => {
      if(data.labels) setVisitorChartData(data);
    })
    .catch(e => console.error(e));
  }, [visitorPeriod, token]);

  useEffect(() => {
    if(!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL!}/analytics/funnel?period=${analyticsPeriod}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(r => r.json())
    .then(data => {
      if(data.views !== undefined) setFunnelData(data);
    })
    .catch(e => console.error(e));
  }, [analyticsPeriod, token]);

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchData = async () => {
      try {
        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!profileRes.ok) throw new Error('Unauthorized');
        const profileData = await profileRes.json();

        if (profileData.id || profileData.userId) {
          setUser(profileData);

          if (profileData.role === 'ADMIN') {
            window.location.href = '/admin';
            return;
          }


          const storeRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/stores/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (storeRes.ok) {
            const storeText = await storeRes.text();
            if (storeText) {
              const storeData = JSON.parse(storeText);
              setStore(storeData);
              setStoreSettings({
                name: storeData.name || '',
                slug: storeData.slug || '',
                customDomain: storeData.customDomain || '',
                description: storeData.description || ''
              });
              setStoreAppearance({
                primaryColor: storeData.primaryColor || '#7c2cff',
                theme: storeData.theme || 'Inter',
                customCss: storeData.customCss || 'list',
                headerImageUrl: storeData.headerImageUrl || '',
                profileImageUrl: storeData.profileImageUrl || '',
                socialLinks: (typeof storeData.socialLinks === 'object' && storeData.socialLinks !== null) ? storeData.socialLinks : { instagram: '', tiktok: '', youtube: '', x: '' },
                contentBgColor: storeData.contentBgColor || '#F8FAFC',
                bannerImageUrl: storeData.bannerImageUrl || '',
                ctaText: storeData.ctaText || '',
                ctaLink: storeData.ctaLink || ''
              });

              const [productsRes, customersRes, statsRes, withdrawalsRes, ordersRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL!}/products`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL!}/customers`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL!}/analytics/stats`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL!}/withdrawals`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL!}/stores/me/orders`, { headers: { 'Authorization': `Bearer ${token}` } })
              ]);

              if (productsRes.ok) setProducts(await productsRes.json());
              if (customersRes.ok) setCustomers(await customersRes.json());
              if (statsRes.ok) setStats(await statsRes.json());
              if (withdrawalsRes.ok) setWithdrawals(await withdrawalsRes.json());
              if (ordersRes.ok) setOrders(await ordersRes.json());

              setBankDetails({
                bankName: profileData.bankName || '',
                accountNumber: profileData.accountNumber || '',
                accountHolder: profileData.accountHolder || ''
              });
            }
          }
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotif({ show: true, message, type });
    setTimeout(() => setNotif({ ...notif, show: false }), 3000);
  };

  const handleCreateStore = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/stores`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `${user.name}'s Store`,
          slug: user.name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000)
        })
      });
      const data = await res.json();
      if (data.id) {
        setStore(data);
        showNotification('Toko berhasil diaktifkan!');
      }
    } catch (err) {
      showNotification('Gagal mengaktifkan toko', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const isEditing = !!editingProduct;
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL!}/products/${editingProduct.id}`
        : `${process.env.NEXT_PUBLIC_API_URL!}/products`;

      const { platform, ...productData } = newProduct;

      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...productData,
          price: parseFloat(newProduct.price),
          originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : null,
          minPwywPrice: newProduct.isPwyw && newProduct.minPwywPrice ? parseFloat(newProduct.minPwywPrice) : null,
          flashSaleMaxQuota: newProduct.isFlashSale && newProduct.flashSaleMaxQuota ? parseInt(newProduct.flashSaleMaxQuota, 10) : null,
          flashSaleEndDate: newProduct.isFlashSale && newProduct.flashSaleEndDate ? new Date(newProduct.flashSaleEndDate).toISOString() : null,
          bookingSlots: newProduct.type === 'BOOKING' ? newProduct.bookingSlots : [],
        })
      });
      const data = await res.json();
      if (res.ok && data.id) {
        if (isEditing) {
          setProducts(products.map(p => p.id === data.id ? data : p));
          showNotification(t('product_modal.success_updated') || 'Produk berhasil diperbarui!');
        } else {
          setProducts([...products, data]);
          setStats({ ...stats, totalProducts: stats.totalProducts + 1 });
          showNotification(t('product_modal.success_added') || 'Produk berhasil ditambahkan!');
        }
        setIsProductModalOpen(false);
        setCurrentStep(1);
        setNewProduct({ title: '', price: '', originalPrice: '', type: 'DIGITAL_FILE', description: '', platform: 'upload', fileUrl: '', imageUrl: '', isPwyw: false, minPwywPrice: '', isFlashSale: false, flashSaleEndDate: '', flashSaleMaxQuota: '', bookingSlots: [] });
        setEditingProduct(null);
      } else if (res.status === 403 && data.message?.includes('Starter plan')) {
        setIsProductModalOpen(false);
        setIsUpgradeLimitModalOpen(true);
      } else {
        throw new Error(data.message || 'Error occurred');
      }
    } catch (err: any) {
      showNotification(err.message || (editingProduct ? (t('product_modal.error_updating') || 'Gagal memperbarui produk') : (t('product_modal.error_adding') || 'Gagal menambahkan produk')), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProductClick = (product: any) => {
    setEditingProduct(product);
    setNewProduct({
      title: product.title,
      price: product.price.toString(),
      originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
      type: product.type,
      description: product.description || '',
      platform: product.fileUrl?.startsWith('http') ? 'other' : 'upload',
      fileUrl: product.fileUrl || '',
      imageUrl: product.imageUrl || '',
      isPwyw: product.isPwyw || false,
      minPwywPrice: product.minPwywPrice ? product.minPwywPrice.toString() : '',
      isFlashSale: !!product.flashSaleEndDate,
      flashSaleEndDate: product.flashSaleEndDate ? new Date(product.flashSaleEndDate).toISOString().slice(0, 16) : '',
      flashSaleMaxQuota: product.flashSaleMaxQuota ? product.flashSaleMaxQuota.toString() : '',
      bookingSlots: product.bookingSlots ? product.bookingSlots.map((s: any) => ({
        id: s.id,
        startTime: new Date(s.startTime).toISOString().slice(0, 16),
        endTime: new Date(s.endTime).toISOString().slice(0, 16),
        maxParticipants: s.maxParticipants.toString(),
        meetingLink: s.meetingLink || ''
      })) : [],
    });
    setIsProductModalOpen(true);
    setCurrentStep(1);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStoreAppearance(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleProduct = async (product: any) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !product.isActive })
      });
      const data = await res.json();
      if (data.id) {
        setProducts(products.map(p => p.id === data.id ? data : p));
        showNotification(`Produk ${data.isActive ? 'diaktifkan' : 'dinonaktifkan'}`);
      }
    } catch (err) {
      showNotification('Gagal mengubah status produk', 'error');
    }
  };

  const handleUpdateAppearance = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/stores/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(storeAppearance)
      });
      const data = await res.json();
      if (data.id) {
        setStore(data);
        showNotification('Tampilan berhasil disimpan!');
      }
    } catch (err) {
      showNotification('Gagal menyimpan tampilan', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/stores/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(storeSettings)
      });
      const data = await res.json();
      if (data.id) {
        setStore(data);
        showNotification('Pengaturan berhasil disimpan!');
      }
    } catch (err) {
      showNotification('Gagal menyimpan pengaturan', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const exportCustomers = () => {
    if (customers.length === 0) return showNotification('Tidak ada data pelanggan', 'error');

    const headers = ['Nama', 'Email', 'Total Pesanan', 'Total Belanja'];
    const data = customers.map(c => [c.name, c.email, c.totalOrders || 0, c.totalSpent || 0]);

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pelanggan");
    
    XLSX.writeFile(workbook, `pelanggan_${store?.slug || 'toko'}.xlsx`);
    showNotification('Database pelanggan berhasil diexport ke Excel!');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleUpdateBankDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/withdrawals/bank`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(bankDetails)
      });
      if (res.ok) {
        showNotification('Informasi rekening berhasil disimpan!');
        setIsBankModalOpen(false);
      } else {
        const error = await res.json();
        showNotification(error.message || 'Gagal menyimpan rekening', 'error');
      }
    } catch (err) {
      showNotification('Gagal menyimpan rekening', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/withdrawals`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(withdrawAmount) })
      });
      if (res.ok) {
        const data = await res.json();
        setWithdrawals([data, ...withdrawals]);
        setUser({ ...user, balance: user.balance - parseFloat(withdrawAmount) });
        showNotification('Penarikan dana (Instant Payout) berhasil diproses!');
        setIsWithdrawModalOpen(false);
        setWithdrawAmount('');
      } else {
        const error = await res.json();
        showNotification(error.message || 'Gagal menarik dana', 'error');
      }
    } catch (err) {
      showNotification('Gagal menarik dana', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const SidebarContent = () => (
    <>
      <div className="p-8 shrink-0">
        <Link href="/" className="flex items-center gap-3 group">
          <svg className="w-10 h-10" viewBox="0 0 64 64" aria-hidden="true">
            <defs><linearGradient id="kgdash" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ff8a00"/><stop offset=".42" stopColor="#f13e8e"/><stop offset="1" stopColor="#5f2cff"/></linearGradient></defs>
            <rect x="8" y="7" width="13" height="50" rx="6.5" fill="url(#kgdash)"/>
            <path d="M25 32 47 8c4-4 11-1 11 5v4c0 2-1 4-3 6L42 35l13 8c2 1 3 3 3 5v3c0 6-7 9-12 6L25 44c-5-3-6-9-2-13l2-2v3Z" fill="url(#kgdash)"/>
          </svg>
          <span className="font-bold text-2xl tracking-tighter text-slate-900 leading-none flex flex-col justify-center" style={{ textAlign: 'left' }}>
            KAMU<span className="text-[10px] text-slate-500 font-medium tracking-normal -mt-1">Kelola Aktivitas Monetisasi</span>
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 py-2">
        <div className="px-4 mb-4">
          <p className="px-5 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{t('nav.main_menu') || 'Menu Utama'}</p>
          <nav className="space-y-1.5">
            {[
              { id: 'home', icon: LayoutDashboard, label: t('nav.home') || 'Beranda' },
              { id: 'my-link', icon: Link2, label: t('nav.my_link') || 'Toko Saya' },
              { id: 'appearance', icon: Smartphone, label: t('nav.appearance') || 'Tampilan' },
              { id: 'analytics', icon: TrendingUp, label: t('nav.analytics') || 'Statistik' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id as View); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-5 py-3 rounded-2xl text-sm transition-all ${activeTab === item.id
                    ? 'bg-indigo-50 text-[#7c2cff] font-black'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-bold'
                  }`}
              >
                <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-[#7c2cff]' : 'text-slate-400'}`} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="px-4">
          <p className="px-5 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{t('nav.business') || 'Bisnis'}</p>
          <nav className="space-y-1.5">
            {[
              { id: 'orders', icon: ShoppingBag, label: t('nav.orders') || 'Pesanan' },
              { id: 'customers', icon: Users, label: t('nav.customers') || 'Pelanggan' },
              { id: 'earnings', icon: Wallet, label: t('nav.earnings') || 'Pendapatan' },
              { id: 'settings', icon: Settings, label: t('nav.settings') || 'Pengaturan' },
              { id: 'referrals', icon: Share2, label: lang === 'en' ? 'Referrals' : 'Afiliasi / Referral' },
              { id: 'subscription', icon: Shield, label: t('nav.subscription') || 'Langganan', isRoute: true },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.isRoute) {
                    window.location.href = '/dashboard/subscription';
                  } else {
                    setActiveTab(item.id as any);
                    setIsSidebarOpen(false);
                  }
                }}
                className={`w-full flex items-center gap-3 px-5 py-3 rounded-2xl text-sm transition-all ${activeTab === item.id
                    ? 'bg-indigo-50 text-[#7c2cff] font-black'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-bold'
                  }`}
              >
                <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-[#7c2cff]' : 'text-slate-400'}`} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

    </>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-100 border-t-[#7c2cff] rounded-full animate-spin"></div>
          <p className="font-black text-slate-400 text-xs tracking-widest uppercase">Memuat Dasbor...</p>
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(productSearch.toLowerCase());
    if (productFilter === 'DIGITAL_FILE') return matchesSearch && p.type === 'DIGITAL_FILE';
    if (productFilter === 'BOOKING') return matchesSearch && p.type === 'BOOKING';
    if (productFilter === 'COURSES') return matchesSearch && p.type === 'COURSES';
    return matchesSearch;
  });

  const totalProductPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice((productPage - 1) * productsPerPage, productPage * productsPerPage);

  const filteredOrders = orders.filter(o => {
    const searchString = orderSearch.toLowerCase();
    const matchesSearch = 
      (o.id || '').toLowerCase().includes(searchString) ||
      (o.buyerName || '').toLowerCase().includes(searchString) ||
      (o.buyerEmail || '').toLowerCase().includes(searchString) ||
      (o.product?.name || '').toLowerCase().includes(searchString);
      
    if (orderFilter === 'ALL') return matchesSearch;
    return matchesSearch && o.status === orderFilter;
  });

  if (user?.role === 'ADMIN') {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#7c2cff]" />
      </div>
    );
  }

  if (!store && user) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-2xl border border-slate-100">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-8 text-[#7c2cff]">
            <Globe className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Siapkan Tokomu!</h2>
          <p className="text-slate-500 font-medium mb-10 leading-relaxed">
            Aktifkan storefront premium kamu sekarang dan mulai berjualan.
          </p>
          <button
            onClick={handleCreateStore}
            disabled={isSubmitting}
            className="w-full bg-[#7c2cff] text-white py-5 rounded-2xl font-black shadow-xl shadow-[#7c2cff]/20 hover:scale-105 transition-all"
          >
            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Aktifkan Sekarang'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col lg:flex-row font-sans">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-100 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-100 z-101 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-400 hover:bg-slate-50 rounded-xl">
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">
              {activeTab === 'home' && (t('nav.home') || 'Beranda')}
              {activeTab === 'my-link' && (t('nav.my_link') || 'Toko Saya')}
              {activeTab === 'appearance' && (t('nav.appearance') || 'Tampilan')}
              {activeTab === 'analytics' && (t('nav.analytics') || 'Statistik')}
              {activeTab === 'settings' && (t('nav.settings') || 'Pengaturan')}
              {activeTab === 'add-product' && (t('nav.add_product') || 'Tambah Produk')}
              {activeTab === 'customers' && (t('nav.customers') || 'Pelanggan')}
              {activeTab === 'orders' && (t('nav.orders') || 'Pesanan')}
              {activeTab === 'earnings' && (t('nav.earnings') || 'Pendapatan')}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex bg-slate-100 rounded-full p-1 border border-slate-200">
              <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${lang === 'en' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}>EN</button>
              <button onClick={() => setLang('id')} className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${lang === 'id' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}>ID</button>
            </div>
            <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-slate-50 rounded-full transition-all">
              <Bell className="w-5 h-5" />
            </button>
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="w-10 h-10 bg-indigo-50 text-[#7c2cff] rounded-full flex items-center justify-center font-black text-sm hover:ring-2 ring-[#7c2cff] ring-offset-2 transition-all focus:outline-none"
              >
                {user?.name?.charAt(0)}
              </button>

              {isProfileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileDropdownOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 origin-top-right">
                    <div className="px-4 py-3 border-b border-slate-50 mb-1">
                      <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-semibold transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Main Content Area */}
          <div className="flex-1 p-6 lg:p-10 overflow-x-hidden">
            {activeTab === 'home' && (
              <div className="space-y-10 animate-in fade-in duration-500">
                {/* Account Card */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-[#7c2cff] font-black text-2xl">
                      {user?.name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-black text-xl text-slate-900">{store?.name}</h3>
                      <Link href={`/${store?.slug}`} target="_blank" className="text-sm font-bold text-[#7c2cff] hover:underline flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                        {STORE_DOMAIN}/{store?.slug} <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => window.location.href = '/dashboard/subscription'}
                      className="px-6 py-4 bg-linear-to-r from-amber-400 to-orange-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-orange-100 hover:scale-105 transition-all flex items-center gap-2.5"
                    >
                      <Gem className="w-4 h-4" /> Upgrade
                    </button>
                    <button className="px-8 py-4 bg-[#7c2cff] text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 hover:scale-105 transition-all flex items-center gap-2.5">
                      <Share2 className="w-4 h-4" /> {t('dashboard_content.share') || 'Bagikan'}
                    </button>
                    <button onClick={() => setActiveTab('settings')} className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-all">
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  {[
                    { label: t('dashboard_content.add_link') || 'Tambah Link', icon: Link2, color: 'bg-blue-50 text-blue-500' },
                    { label: t('dashboard_content.digital_product') || 'Produk Digital', icon: ShoppingBag, color: 'bg-indigo-50 text-[#7c2cff]', action: () => setActiveTab('add-product') },
                    { label: t('dashboard_content.blog_content') || 'Blog Konten', icon: FileText, color: 'bg-orange-50 text-orange-500' },
                    { label: t('dashboard_content.video_course') || 'Video Kursus', icon: PlayCircle, color: 'bg-purple-50 text-purple-500' },
                  ].map((btn, i) => (
                    <button key={i} onClick={btn.action} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center gap-4 group text-center">
                      <div className={`w-14 h-14 ${btn.color} rounded-[1.25rem] flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <btn.icon className="w-7 h-7" />
                      </div>
                      <span className="text-[13px] font-black text-slate-700 tracking-tight">{btn.label}</span>
                    </button>
                  ))}
                </div>

                {/* Premium Stats Summary Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { 
                      label: t('dashboard_content.total_revenue') || 'Total Pendapatan', 
                      value: `Rp ${stats.totalRevenue.toLocaleString()}`, 
                      icon: CreditCard, 
                      color: 'text-emerald-500', 
                      bg: 'bg-emerald-50/50', 
                      trend: `${(stats.revenueTrend || 0) >= 0 ? '+' : ''}${(stats.revenueTrend || 0).toFixed(1)}%`, 
                      trendColor: (stats.revenueTrend || 0) >= 0 ? 'text-emerald-500' : 'text-red-500',
                      trendBg: (stats.revenueTrend || 0) >= 0 ? 'bg-emerald-50' : 'bg-red-50'
                    },
                    { 
                      label: t('dashboard_content.active_customers') || 'Pelanggan Aktif', 
                      value: stats.totalCustomers, 
                      icon: Users, 
                      color: 'text-indigo-500', 
                      bg: 'bg-indigo-50/50', 
                      trend: `${(stats.customersTrend || 0) >= 0 ? '+' : ''}${(stats.customersTrend || 0).toFixed(1)}%`, 
                      trendColor: (stats.customersTrend || 0) >= 0 ? 'text-indigo-500' : 'text-red-500',
                      trendBg: (stats.customersTrend || 0) >= 0 ? 'bg-indigo-50' : 'bg-red-50'
                    },
                    { 
                      label: t('dashboard_content.products_sold') || 'Produk Terjual', 
                      value: stats.totalOrders, 
                      icon: ShoppingBag, 
                      color: 'text-amber-500', 
                      bg: 'bg-amber-50/50', 
                      trend: `${(stats.ordersTrend || 0) >= 0 ? '+' : ''}${(stats.ordersTrend || 0).toFixed(1)}%`, 
                      trendColor: (stats.ordersTrend || 0) >= 0 ? 'text-amber-500' : 'text-red-500',
                      trendBg: (stats.ordersTrend || 0) >= 0 ? 'bg-amber-50' : 'bg-red-50'
                    },
                  ].map((s, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden">
                      <div className={`absolute top-0 right-0 w-32 h-32 ${s.bg} rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
                      <div className="flex items-center justify-between mb-6 relative">
                        <div className={`w-14 h-14 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                          <s.icon className="w-7 h-7" />
                        </div>
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${s.trendBg} ${s.trendColor} text-[10px] font-black tracking-widest`}>
                          <TrendingUp className={`w-3 h-3 ${s.trendColor.includes('red') ? 'rotate-180' : ''}`} /> {s.trend}
                        </div>
                      </div>
                      <div className="relative">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">{s.label}</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tight">{s.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Analytics Chart Card (Visual Placeholder) */}
                <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-1">{t('dashboard_content.visitor_stats') || 'Statistik Pengunjung'}</h3>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        {visitorPeriod === 'weekly' 
                          ? (t('dashboard_content.store_traffic') || 'Traffic Toko 7 Hari Terakhir') 
                          : 'Traffic Toko 4 Minggu Terakhir'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl">
                      <button 
                        onClick={() => setVisitorPeriod('weekly')}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${visitorPeriod === 'weekly' ? 'bg-white text-[#7c2cff] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {t('dashboard_content.weekly') || 'Mingguan'}
                      </button>
                      <button 
                        onClick={() => setVisitorPeriod('monthly')}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${visitorPeriod === 'monthly' ? 'bg-white text-[#7c2cff] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {t('dashboard_content.monthly') || 'Bulanan'}
                      </button>
                    </div>
                  </div>

                  <div className="h-64 flex items-end gap-3 md:gap-6 relative z-10">
                    {(visitorChartData.data && visitorChartData.data.length > 0 ? visitorChartData.data : [0,0,0,0,0,0,0]).map((h, i) => {
                      const maxH = Math.max(...(visitorChartData.data && visitorChartData.data.length > 0 ? visitorChartData.data : [1]), 10);
                      const heightPx = (h / maxH) * 200; // max 200px
                      return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar">
                        <div className="relative w-full">
                          <div
                            className="w-full bg-slate-100 rounded-t-xl group-hover/bar:bg-indigo-50 transition-colors relative overflow-hidden"
                            style={{ height: `${heightPx}px` }}
                          >
                            <div className="absolute bottom-0 w-full bg-[#7c2cff] rounded-t-xl transition-all duration-500 ease-out" style={{ height: h > 0 ? '100%' : '0%' }} />
                          </div>
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none">
                            {h}
                          </div>
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          {visitorChartData.labels[i] || ''}
                        </span>
                      </div>
                    )})}
                  </div>

                  {/* Decorative Background Elements */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/30 rounded-full blur-[100px] z-0 -mr-48 -mt-48"></div>
                </div>
              </div>
            )}

            {activeTab === 'my-link' && (
              <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{t('dashboard_content.main_store_url') || 'URL Toko Utama'}</p>
                    <p className="font-black text-slate-900 text-base md:text-lg break-all">{STORE_DOMAIN}/{store?.slug}</p>
                  </div>
                  <div className="flex gap-2.5">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${STORE_DOMAIN}/${store?.slug}`);
                        showNotification('URL berhasil disalin!');
                      }}
                      className="px-4 py-2.5 border border-slate-200 rounded-xl text-[11px] font-black text-slate-500 hover:bg-slate-50 transition-all whitespace-nowrap"
                    >
                      {t('dashboard_content.copy') || 'Salin'}
                    </button>
                    <button onClick={() => setActiveTab('settings')} className="px-4 py-2.5 bg-indigo-50 text-[#7c2cff] rounded-xl text-[11px] font-black hover:bg-indigo-100 transition-all whitespace-nowrap">{t('dashboard_content.change_slug') || 'Ubah Slug'}</button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setNewProduct({ title: '', price: '', originalPrice: '', type: 'DIGITAL_FILE', description: '', platform: 'upload', fileUrl: '', imageUrl: '', isPwyw: false, minPwywPrice: '', isFlashSale: false, flashSaleEndDate: '', flashSaleMaxQuota: '', bookingSlots: [] });
                    setIsProductModalOpen(true);
                    setCurrentStep(1);
                  }}
                  className="w-full py-4 bg-[#7c2cff] text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Plus className="w-5 h-5" /> {t('dashboard_content.add_new_block') || 'Tambah Blok Baru'}
                </button>

                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-3">
                    <p className="font-black text-[10px] text-slate-400 uppercase tracking-widest">{t('dashboard_content.active_content_list') || 'Daftar Konten Aktif'} ({products.length})</p>

                    <div className="flex w-full sm:w-auto items-center gap-2">
                      <div className="relative flex-1 sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="w-4 h-4 text-slate-400" />
                        </div>
                        <input
                          type="text"
                          placeholder={t('dashboard_content.search_product') || 'Cari nama produk...'}
                          value={productSearch}
                          onChange={(e) => { setProductSearch(e.target.value); setProductPage(1); }}
                          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 focus:border-[#7c2cff] focus:ring-2 focus:ring-[#7c2cff]/20 rounded-xl transition-all outline-none text-sm font-medium text-slate-700"
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Filter className="w-4 h-4 text-slate-400" />
                        </div>
                        <select
                          value={productFilter}
                          onChange={(e) => { setProductFilter(e.target.value); setProductPage(1); }}
                          className="bg-white border border-slate-200 focus:border-[#7c2cff] focus:ring-2 focus:ring-[#7c2cff]/20 rounded-xl pl-9 pr-8 py-2 outline-none font-bold text-sm text-slate-700 appearance-none transition-all cursor-pointer h-9.5"
                        >
                          <option value="ALL">Semua Tipe</option>
                          <option value="DIGITAL_FILE">Digital File</option>
                          <option value="BOOKING">Booking</option>
                          <option value="COURSES">Courses</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {paginatedProducts.map((p) => (
                    <div key={p.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                      <div className="flex items-center gap-5 flex-1 cursor-pointer" onClick={() => handleEditProductClick(p)}>
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 overflow-hidden shrink-0">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-7 h-7" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 group-hover:text-[#7c2cff] transition-colors">{p.title}</h4>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                            {p.type} •
                            {p.originalPrice && Number(p.originalPrice) > Number(p.price) && (
                              <span className="line-through text-slate-300 mx-1">Rp {Number(p.originalPrice).toLocaleString()}</span>
                            )}
                            Rp {Number(p.price).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() => handleToggleProduct(p)}
                          className={`w-11 h-6 rounded-full relative flex items-center px-1 cursor-pointer transition-colors ${p.isActive ? 'bg-indigo-50' : 'bg-slate-200'}`}
                        >
                          <div className={`w-4 h-4 rounded-full absolute shadow-sm transition-all ${p.isActive ? 'bg-[#7c2cff] right-1' : 'bg-white left-1'}`}></div>
                        </div>
                        <button onClick={() => handleEditProductClick(p)} className="p-3 hover:bg-slate-50 rounded-xl text-slate-300 hover:text-slate-500 transition-all">
                          <MoreHorizontal className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {paginatedProducts.length === 0 && (
                    <div className="bg-white p-10 rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center text-center">
                      <Package className="w-12 h-12 text-slate-200 mb-4" />
                      <h4 className="font-bold text-slate-600 mb-1">Produk Tidak Ditemukan</h4>
                      <p className="text-sm text-slate-400">Silakan sesuaikan filter atau kata kunci pencarian Anda.</p>
                    </div>
                  )}

                  {/* Pagination Controls */}
                  {filteredProducts.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-2">
                      <span className="text-sm text-slate-500 font-medium">
                        Menampilkan {Math.min(filteredProducts.length, (productPage - 1) * productsPerPage + 1)} - {Math.min(filteredProducts.length, productPage * productsPerPage)} dari {filteredProducts.length} produk
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setProductPage(prev => Math.max(prev - 1, 1))}
                          disabled={productPage === 1}
                          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalProductPages }).map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setProductPage(i + 1)}
                              className={`w-8 h-8 rounded-xl font-bold text-xs transition-all ${productPage === i + 1 ? 'bg-[#7c2cff] text-white shadow-md shadow-[#7c2cff]/20' : 'text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200'}`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => setProductPage(prev => Math.min(prev + 1, totalProductPages))}
                          disabled={productPage === totalProductPages || totalProductPages === 0}
                          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-10 animate-in fade-in duration-500 max-w-4xl pb-20">
                <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-indigo-50 text-[#7c2cff] rounded-2xl flex items-center justify-center">
                      <Palette className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">{t('dashboard_content.appearance_customization') || 'Kustomisasi Tampilan'}</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('dashboard_content.theme_brand') || 'Tema & Identitas Brand'}</p>
                    </div>
                  </div>

                  <div className="space-y-10 max-w-3xl">
                    {/* Warna Tema */}
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-5 block">{t('dashboard_content.main_theme_color') || 'Warna Tema Utama'}</label>
                      <div className="flex flex-wrap gap-5">
                        {['#7c2cff', '#ff416c', '#F72585', '#7209B7', '#3A0CA3'].map(color => (
                          <button
                            key={color}
                            onClick={() => setStoreAppearance({ ...storeAppearance, primaryColor: color })}
                            className={`w-12 h-12 rounded-full transition-all flex items-center justify-center ${color === storeAppearance.primaryColor ? 'ring-2 ring-offset-4 ring-[#7c2cff] scale-105 shadow-md' : 'opacity-80 hover:opacity-100 hover:scale-105 hover:shadow-sm border border-black/5'}`}
                            style={{ backgroundColor: color }}
                          >
                            {color === storeAppearance.primaryColor && <CheckCircle2 className="w-5 h-5 text-white drop-shadow-md" />}
                          </button>
                        ))}
                        <button className="w-12 h-12 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-600 transition-all">
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Tipografi & Layout Blok */}
                    <div className="grid lg:grid-cols-2 gap-10">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-5 block">{t('dashboard_content.typography') || 'Tipografi (Font)'}</label>
                        <div className="flex flex-wrap gap-3">
                          {[
                            { name: 'Inter', css: 'var(--font-inter)' },
                            { name: 'Montserrat', css: 'var(--font-montserrat)' },
                            { name: 'Open Sans', css: 'var(--font-open-sans)' },
                            { name: 'Jakarta Sans', css: 'var(--font-jakarta)' },
                            { name: 'Lato', css: 'var(--font-lato)' }
                          ].map(font => (
                            <button
                              key={font.name}
                              onClick={() => setStoreAppearance({ ...storeAppearance, theme: font.name })}
                              className={`py-2 px-4 rounded-xl text-xs whitespace-nowrap transition-all border ${font.name === storeAppearance.theme ? 'bg-indigo-50 border-[#7c2cff] text-[#7c2cff] shadow-sm font-bold' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:border-slate-300 font-medium'}`}>
                              <span style={{ fontFamily: font.css }}>{font.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-5 block">{t('dashboard_content.block_layout') || 'Layout Blok'}</label>
                        <div className="flex flex-wrap gap-4">
                          {[
                            { id: 'list', icon: Menu },
                            { id: 'grid', icon: Layout },
                            { id: 'card', icon: ShoppingBag },
                          ].map(l => (
                            <button
                              key={l.id}
                              onClick={() => setStoreAppearance({ ...storeAppearance, customCss: l.id })}
                              className={`w-14 h-14 shrink-0 rounded-xl transition-all flex items-center justify-center border-2 ${l.id === storeAppearance.customCss ? 'bg-indigo-50 border-[#7c2cff] text-[#7c2cff] shadow-sm scale-105' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}>
                              <l.icon className="w-6 h-6" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* New Link in Bio Customizations */}
                    <div className="space-y-10 pt-10 border-t border-slate-100">
                      <div>
                        <h4 className="font-black text-slate-800 text-sm tracking-tight mb-6">{t('dashboard_content.profile_header') || 'Profil & Header'}</h4>
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">{t('dashboard_content.profile_photo') || 'Foto Profil'}</label>
                            <div className="relative group w-20 h-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-full flex items-center justify-center overflow-hidden hover:border-[#7c2cff] transition-colors cursor-pointer">
                              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'profileImageUrl')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                              {storeAppearance.profileImageUrl ? (
                                <img src={storeAppearance.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                              ) : (
                                <Upload className="w-5 h-5 text-slate-300 group-hover:text-[#7c2cff]" />
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">{t('dashboard_content.header_bg') || 'Gambar Header (Background)'}</label>
                            <div className="relative group w-full h-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden hover:border-[#7c2cff] transition-colors cursor-pointer">
                              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'headerImageUrl')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                              {storeAppearance.headerImageUrl ? (
                                <img src={storeAppearance.headerImageUrl} alt="Header" className="w-full h-full object-cover" />
                              ) : (
                                <div className="text-center flex flex-col items-center">
                                  <ImageIcon className="w-5 h-5 text-slate-300 group-hover:text-[#7c2cff] mb-1" />
                                  <span className="text-[10px] text-slate-400 font-bold">Upload Header</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">{t('dashboard_content.short_bio') || 'Deskripsi Singkat (Bio)'}</label>
                        <textarea
                          value={storeSettings.description}
                          onChange={(e) => setStoreSettings({ ...storeSettings, description: e.target.value })}
                          placeholder="Deskripsikan diri Anda atau toko Anda..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium text-slate-700 focus:bg-white focus:border-[#7c2cff] focus:ring-4 focus:ring-indigo-50 transition-all min-h-25"
                        ></textarea>
                      </div>

                      <div>
                        <h4 className="font-black text-slate-800 text-sm tracking-tight mb-6">{t('dashboard_content.social_links') || 'Tautan Sosial Media'}</h4>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {['instagram', 'tiktok', 'youtube', 'x'].map(platform => (
                            <div key={platform} className="flex items-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-2">
                              <span className="text-xs font-bold text-slate-400 capitalize w-20">{platform}</span>
                              <input
                                type="url"
                                placeholder="https://"
                                value={storeAppearance.socialLinks[platform] || ''}
                                onChange={(e) => setStoreAppearance({
                                  ...storeAppearance,
                                  socialLinks: { ...storeAppearance.socialLinks, [platform]: e.target.value }
                                })}
                                className="flex-1 bg-transparent border-none text-xs font-medium text-slate-700 focus:ring-0 p-2"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-black text-slate-800 text-sm tracking-tight mb-6">{t('dashboard_content.promo_cta') || 'Promosi & CTA'}</h4>
                        <div className="space-y-6">
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">{t('dashboard_content.promo_banner') || 'Banner Promosi (Gambar)'}</label>
                            <div className="relative group w-full h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center overflow-hidden hover:border-[#7c2cff] transition-colors cursor-pointer">
                              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'bannerImageUrl')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                              {storeAppearance.bannerImageUrl ? (
                                <img src={storeAppearance.bannerImageUrl} alt="Banner" className="w-full h-full object-cover" />
                              ) : (
                                <>
                                  <ImageIcon className="w-6 h-6 text-slate-300 group-hover:text-[#7c2cff] mb-2" />
                                  <span className="text-xs font-bold text-slate-400 group-hover:text-[#7c2cff]">Upload Banner Promo</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">{t('dashboard_content.cta_text') || 'Teks Tombol CTA'}</label>
                              <input
                                type="text"
                                placeholder={t('dashboard_content.cta_text_placeholder') || "Contoh: Gabung Komunitas"}
                                value={storeAppearance.ctaText}
                                onChange={(e) => setStoreAppearance({ ...storeAppearance, ctaText: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:bg-white focus:border-[#7c2cff] focus:ring-4 focus:ring-indigo-50 transition-all"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">{t('dashboard_content.cta_link') || 'Link Tombol CTA'}</label>
                              <input
                                type="url"
                                placeholder="https://"
                                value={storeAppearance.ctaLink}
                                onChange={(e) => setStoreAppearance({ ...storeAppearance, ctaLink: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:bg-white focus:border-[#7c2cff] focus:ring-4 focus:ring-indigo-50 transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">{t('dashboard_content.content_bg_color') || 'Warna Latar Konten'}</label>
                        <div className="flex flex-wrap gap-4">
                          {['#F8FAFC', '#FFF1E6', '#E0FAEE', '#F3E8FF', '#FFFFFF'].map(color => (
                            <button
                              key={color}
                              onClick={() => setStoreAppearance({ ...storeAppearance, contentBgColor: color })}
                              className={`w-10 h-10 rounded-xl border transition-all ${color === storeAppearance.contentBgColor ? 'border-[#7c2cff] scale-110 shadow-sm' : 'border-slate-200 hover:scale-105'}`}
                              style={{ backgroundColor: color }}
                            ></button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 bg-slate-50/80 px-4 py-2.5 rounded-xl border border-slate-100 w-full sm:w-auto">
                        <AlertCircle className="w-4 h-4 text-[#7c2cff] shrink-0" />
                        <span className="truncate">{t('dashboard_content.live_preview_note') || 'Perubahan langsung terlihat di Live Preview'}</span>
                      </div>

                      <button
                        onClick={handleUpdateAppearance}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto shrink-0 px-6 py-2.5 bg-[#7c2cff] text-white rounded-xl font-bold whitespace-nowrap shadow-md hover:bg-indigo-600 active:scale-95 transition-all flex items-center justify-center gap-2.5 text-sm"
                      >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> {t('dashboard_content.save_appearance') || 'Simpan Tampilan'}</>}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-10 animate-in fade-in duration-500 max-w-5xl">
                <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 text-[#7c2cff] rounded-2xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">{t('dashboard_content.performance_analytics') || 'Analitik Performa'}</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {analyticsPeriod === '30_days' 
                            ? (t('dashboard_content.traffic_conv_30d') || 'Traffic & Konversi 30 Hari Terakhir')
                            : 'Traffic & Konversi 90 Hari Terakhir'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 p-1.5 bg-slate-100 rounded-xl">
                      <button 
                        onClick={() => setAnalyticsPeriod('30_days')}
                        className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${analyticsPeriod === '30_days' ? 'bg-white text-[#7c2cff] shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                      >
                        {t('dashboard_content.thirty_days') || '30 Hari'}
                      </button>
                      <button 
                        onClick={() => setAnalyticsPeriod('90_days')}
                        className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${analyticsPeriod === '90_days' ? 'bg-white text-[#7c2cff] shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                      >
                        {t('dashboard_content.ninety_days') || '90 Hari'}
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                      { label: t('dashboard_content.total_views') || 'Total Views', value: funnelData.views.toString(), change: '', color: 'text-slate-900' },
                      { label: t('dashboard_content.total_clicks') || 'Total Clicks', value: funnelData.clicks.toString(), change: '', color: 'text-[#7c2cff]' },
                      { label: 'CTR', value: funnelData.views > 0 ? ((funnelData.clicks / funnelData.views) * 100).toFixed(1) + '%' : '0.0%', change: '', color: 'text-emerald-500' },
                      { label: t('dashboard_content.conversion') || 'Konversi', value: funnelData.views > 0 ? ((funnelData.paid / funnelData.views) * 100).toFixed(1) + '%' : '0.0%', change: '', color: 'text-amber-500' },
                    ].map((s, i) => (
                      <div key={i} className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{s.label}</p>
                        <div className="flex items-baseline gap-2">
                          <span className={`text-2xl font-black ${s.color}`}>{s.value}</span>
                          {s.change && <span className="text-[10px] font-bold text-slate-400">{s.change}</span>}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="h-80 w-full flex flex-col justify-center bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">{t('dashboard_content.conversion_funnel') || 'Funnel Konversi'}</h4>
                    <div className="flex-1 flex flex-col justify-center gap-6">
                      
                      <div className="w-full flex items-center gap-4 group">
                        <div className="w-24 text-xs font-black text-slate-400 uppercase tracking-widest">Views</div>
                        <div className="flex-1 h-10 bg-slate-50 rounded-2xl overflow-hidden relative">
                           <div className="absolute left-0 top-0 bottom-0 bg-slate-900 rounded-2xl transition-all duration-1000 ease-out" style={{ width: '100%' }}></div>
                        </div>
                        <div className="w-16 text-right text-lg font-black text-slate-900">{funnelData.views}</div>
                      </div>
                      
                      <div className="w-full flex items-center gap-4 group">
                        <div className="w-24 text-xs font-black text-slate-400 uppercase tracking-widest">Clicks</div>
                        <div className="flex-1 h-10 bg-slate-50 rounded-2xl overflow-hidden relative">
                           <div className="absolute left-0 top-0 bottom-0 bg-[#7c2cff] rounded-2xl transition-all duration-1000 ease-out" style={{ width: funnelData.views > 0 ? `${(funnelData.clicks/funnelData.views)*100}%` : '0%' }}></div>
                        </div>
                        <div className="w-16 text-right text-lg font-black text-slate-900">{funnelData.clicks}</div>
                      </div>
                      
                      <div className="w-full flex items-center gap-4 group">
                        <div className="w-24 text-xs font-black text-slate-400 uppercase tracking-widest">Sales</div>
                        <div className="flex-1 h-10 bg-slate-50 rounded-2xl overflow-hidden relative">
                           <div className="absolute left-0 top-0 bottom-0 bg-emerald-500 rounded-2xl transition-all duration-1000 ease-out" style={{ width: funnelData.views > 0 ? `${(funnelData.paid/funnelData.views)*100}%` : '0%' }}></div>
                        </div>
                        <div className="w-16 text-right text-lg font-black text-slate-900">{funnelData.paid}</div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'customers' && (
              <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
                <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-[#7c2cff] rounded-2xl flex items-center justify-center">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">{t('dashboard_content.customer_db') || 'Database Pelanggan'}</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{customers.length} {t('dashboard_content.registered_customers') || 'Pelanggan Terdaftar'}</p>
                    </div>
                  </div>
                  <button
                    onClick={exportCustomers}
                    className="flex items-center gap-2 px-6 py-3 bg-[#7c2cff] text-white rounded-xl font-black text-sm shadow-xl shadow-indigo-100 hover:scale-105 transition-all"
                  >
                    <ArrowDownToLine className="w-4 h-4" /> Export Excel
                  </button>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('dashboard_content.customer') || 'Pelanggan'}</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('dashboard_content.customer_email') || 'Email'}</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t('dashboard_content.customer_orders') || 'Pesanan'}</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">{t('dashboard_content.customer_spent') || 'Total Belanja'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {customers.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-50 text-[#7c2cff] rounded-xl flex items-center justify-center font-black text-sm">
                                  {c.name.charAt(0)}
                                </div>
                                <span className="font-bold text-slate-900">{c.name}</span>
                              </div>
                            </td>
                            <td className="px-8 py-5 font-medium text-slate-500">{c.email}</td>
                            <td className="px-8 py-5 text-center font-black text-slate-700">{c.totalOrders || 0}</td>
                            <td className="px-8 py-5 text-right font-black text-slate-900">Rp {(c.totalSpent || 0).toLocaleString()}</td>
                          </tr>
                        ))}
                        {customers.length === 0 && (
                          <tr>
                            <td colSpan={4} className="px-8 py-20 text-center">
                              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                                <Users className="w-8 h-8" />
                              </div>
                              <p className="text-sm font-black text-slate-300 uppercase tracking-widest">{t('dashboard_content.no_customer_data') || 'Belum ada data pelanggan'}</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-[#7c2cff] rounded-2xl flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">{t('dashboard_content.order_list') || 'Daftar Pesanan'}</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('dashboard_content.store_txn_history') || 'Riwayat Transaksi Toko'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        placeholder={t('dashboard_content.search_orders') || "Cari pesanan..."} 
                        className="bg-slate-100 border-none rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-indigo-100/50 w-64" 
                      />
                    </div>
                    <select 
                      value={orderFilter}
                      onChange={(e) => setOrderFilter(e.target.value)}
                      className="bg-slate-100 border-none rounded-xl px-4 py-3 outline-none font-bold text-sm text-slate-700 transition-all cursor-pointer"
                    >
                      <option value="ALL">Semua Status</option>
                      <option value="PAID">Paid</option>
                      <option value="PENDING">Pending</option>
                      <option value="EXPIRED">Expired</option>
                      <option value="FAILED">Failed</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('dashboard_content.order_id') || 'Order ID'}</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('dashboard_content.customer') || 'Pelanggan'}</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('dashboard_content.product') || 'Produk'}</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('dashboard_content.status') || 'Status'}</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">{t('dashboard_content.total') || 'Total'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredOrders.map((o, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-5 text-sm font-black text-slate-900">
                              #{o.id.substring(0, 8)}
                              <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase mt-0.5">{new Date(o.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                            </td>
                            <td className="px-8 py-5">
                              <p className="text-sm font-bold text-slate-700">{o.buyerName}</p>
                              <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase mt-0.5">{o.buyerEmail}</p>
                            </td>
                            <td className="px-8 py-5">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-[#7c2cff] border border-indigo-100">
                                {o.product?.name || 'Produk'}
                              </span>
                            </td>
                            <td className="px-8 py-5">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                o.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                o.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                'bg-red-50 text-red-600 border border-red-100'
                              }`}>
                                {o.status}
                              </span>
                            </td>
                            <td className="px-8 py-5 text-right font-black text-slate-900">
                              Rp {o.amount.toLocaleString('id-ID')}
                            </td>
                          </tr>
                        ))}
                        {filteredOrders.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-8 py-20 text-center">
                              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                                <ShoppingBag className="w-8 h-8" />
                              </div>
                              <p className="text-sm font-black text-slate-300 uppercase tracking-widest">{t('dashboard_content.no_order_history') || 'Belum ada riwayat pesanan'}</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-10 animate-in fade-in duration-500 max-w-4xl pb-20">
                <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-indigo-50 text-[#7c2cff] rounded-2xl flex items-center justify-center">
                      <Settings className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">{t('dashboard_content.store_settings') || 'Pengaturan Toko'}</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('dashboard_content.store_config_desc') || 'White-label & Konfigurasi Umum'}</p>
                    </div>
                  </div>

                  <form onSubmit={handleUpdateSettings} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('dashboard_content.store_name') || 'Nama Toko'}</label>
                          <input
                            type="text"
                            value={storeSettings.name}
                            onChange={(e) => setStoreSettings({ ...storeSettings, name: e.target.value })}
                            className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 px-6 text-slate-900 focus:bg-white focus:border-indigo-100 transition-all font-bold"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('dashboard_content.store_slug') || 'Slug Toko (URL)'}</label>
                          <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{STORE_DOMAIN}/</span>
                            <input
                              type="text"
                              value={storeSettings.slug}
                              onChange={(e) => setStoreSettings({ ...storeSettings, slug: e.target.value })}
                              className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-24 pr-6 text-slate-900 focus:bg-white focus:border-indigo-100 transition-all font-bold"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center justify-between">
                            Custom Domain (PRO)
                            <span className="bg-indigo-50 text-[#7c2cff] px-2 py-0.5 rounded text-[8px]">WHITE-LABEL</span>
                          </label>
                          <div className="relative">
                            <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                            <input
                              type="text"
                              placeholder="toko-anda.com"
                              value={storeSettings.customDomain}
                              onChange={(e) => setStoreSettings({ ...storeSettings, customDomain: e.target.value })}
                              className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-14 pr-6 text-slate-900 focus:bg-white focus:border-indigo-100 transition-all font-bold"
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('dashboard_content.store_description') || 'Deskripsi Toko'}</label>
                          <textarea
                            rows={3}
                            value={storeSettings.description}
                            onChange={(e) => setStoreSettings({ ...storeSettings, description: e.target.value })}
                            className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 px-6 text-slate-900 focus:bg-white focus:border-indigo-100 transition-all font-bold"
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-slate-50 flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-10 py-4 bg-[#7c2cff] text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 hover:scale-105 transition-all flex items-center gap-2"
                      >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4" /> {t('dashboard_content.save_changes') || 'Simpan Perubahan'}</>}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal Tambah/Edit Produk (Stepper) */}
            {isProductModalOpen && (
              <div className="fixed inset-0 z-999 flex items-center justify-center p-4 sm:p-6">
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsProductModalOpen(false)}></div>
                <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-300">

                  {/* Modal Header */}
                  <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white z-10 shrink-0">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 text-[#7c2cff] rounded-2xl flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">{editingProduct ? t('product_modal.edit') || 'Edit Produk' : t('product_modal.add_new') || 'Tambah Produk Baru'}</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{t('product_modal.setup') || 'Setup produk digital Anda'}</p>
                      </div>
                    </div>
                    <button onClick={() => setIsProductModalOpen(false)} className="w-10 h-10 bg-slate-50 text-slate-400 hover:text-[#7c2cff] hover:bg-indigo-50 rounded-full flex items-center justify-center transition-all">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Stepper Indicator */}
                  <div className="px-8 py-5 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between shrink-0">
                    <div className="flex items-center">
                      {[1, 2, 3].map((step) => (
                        <div key={step} className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${currentStep === step ? 'bg-[#7c2cff] text-white shadow-md shadow-indigo-200' : currentStep > step ? 'bg-indigo-100 text-[#7c2cff]' : 'bg-white text-slate-300 border-2 border-slate-100'}`}>
                            {currentStep > step ? <Check className="w-4 h-4" /> : step}
                          </div>
                          {step < 3 && (
                            <div className={`w-12 sm:w-24 h-1 mx-2 rounded-full transition-all duration-300 ${currentStep > step ? 'bg-indigo-100' : 'bg-slate-100'}`}></div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="hidden sm:block">
                      <span className="text-xs font-black text-[#7c2cff] uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-xl">
                        {t('product_modal.step') || 'Langkah'} {currentStep} {t('product_modal.of') || 'dari'} 3: {currentStep === 1 ? (t('product_modal.basic_info') || 'Info Dasar') : currentStep === 2 ? (t('product_modal.price_promo') || 'Harga & Promo') : (t('product_modal.done') || 'Selesai')}
                      </span>
                    </div>
                  </div>

                  {/* Modal Body / Form Content */}
                  <div className="flex-1 overflow-y-auto p-8 lg:p-10 bg-slate-50/30" id="modal-body-scroll">
                    <form id="productForm" onSubmit={(e) => { e.preventDefault(); if (currentStep === 3) handleAddProduct(e); }}>

                      {/* STEP 1: INFO DASAR */}
                      {currentStep === 1 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-6">
                              <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('product_modal.title') || 'Judul Produk'}</label>
                                <input type="text" required value={newProduct.title} onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} placeholder={t('product_modal.title_placeholder') || "Contoh: Ebook Strategi Konten 2024"} className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 px-6 text-slate-900 focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50/50 transition-all font-bold text-sm shadow-sm" />
                              </div>
                              <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('product_modal.desc') || 'Deskripsi Singkat'}</label>
                                <textarea rows={4} value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} placeholder={t('product_modal.desc_placeholder') || "Jelaskan apa yang pembeli dapatkan..."} className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 px-6 text-slate-900 focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50/50 transition-all font-bold text-sm shadow-sm"></textarea>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('product_modal.cover') || 'Gambar Cover'}</label>
                              <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center text-center gap-4 h-55">
                                {newProduct.imageUrl ? (
                                  <div className="relative w-full h-full rounded-xl overflow-hidden group">
                                    <img src={newProduct.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                      <button type="button" onClick={() => setNewProduct({ ...newProduct, imageUrl: '' })} className="w-10 h-10 bg-white text-red-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                                        <X className="w-5 h-5" />
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-2">
                                      <ImageIcon className="w-8 h-8" />
                                    </div>
                                    <input type="file" id="cover-upload" accept="image/*" className="hidden" onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        if (file.size > 5 * 1024 * 1024) return showNotification('Ukuran gambar terlalu besar (Maks 5MB)', 'error');
                                        const reader = new FileReader();
                                        reader.onloadend = () => setNewProduct({ ...newProduct, imageUrl: reader.result as string });
                                        reader.readAsDataURL(file);
                                      }
                                    }} />
                                    <label htmlFor="cover-upload" className="text-xs font-black text-[#7c2cff] bg-indigo-50 px-4 py-2 rounded-xl cursor-pointer hover:bg-indigo-100 transition-colors">
                                      {t('product_modal.select_image') || 'Pilih Gambar'}
                                    </label>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{t('product_modal.max_5mb') || 'Maks 5MB'}</p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-slate-100 pt-8">
                            <div className="space-y-5">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('product_modal.type_delivery') || 'Tipe & Pengiriman Produk'}</label>
                              <div className="grid grid-cols-3 gap-4">
                                {[
                                  { id: 'DIGITAL_FILE', label: t('product_modal.type_file') || 'File Digital', desc: t('product_modal.type_file_desc') || 'Upload file / PDF' },
                                  { id: 'LINK', label: t('product_modal.type_link') || 'Link Akses', desc: t('product_modal.type_link_desc') || 'G-Drive / Notion' },
                                  { id: 'BOOKING', label: t('product_modal.type_booking') || 'Konsultasi', desc: t('product_modal.type_booking_desc') || 'Sesi Zoom / Live' }
                                ].map(t => (
                                  <div
                                    key={t.id}
                                    onClick={() => setNewProduct({ ...newProduct, type: t.id as any })}
                                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${newProduct.type === t.id ? 'border-[#7c2cff] bg-indigo-50/50 shadow-md shadow-indigo-100/50' : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'}`}
                                  >
                                    <div className="flex items-center gap-3 mb-2">
                                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${newProduct.type === t.id ? 'border-[#7c2cff]' : 'border-slate-300'}`}>
                                        {newProduct.type === t.id && <div className="w-2 h-2 bg-[#7c2cff] rounded-full"></div>}
                                      </div>
                                      <span className="text-sm font-black text-slate-800">{t.label}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-bold ml-7">{t.desc}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Delivery Setup based on Type */}
                          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mt-6">
                            {newProduct.type === 'DIGITAL_FILE' && (
                              <div className="space-y-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-indigo-50 text-[#7c2cff] rounded-xl flex items-center justify-center"><Upload className="w-5 h-5" /></div>
                                  <div>
                                    <h4 className="text-sm font-black text-slate-800">{t('product_modal.upload_main') || 'Upload File Utama'}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{t('product_modal.buyers_download') || 'Pembeli akan mendownload ini'}</p>
                                  </div>
                                </div>
                                <div onClick={() => fileInputRef.current?.click()} className="w-full py-10 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#7c2cff] hover:bg-indigo-50/30 transition-all">
                                  <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
                                    if (e.target.files?.[0]) { setNewProduct({ ...newProduct, fileUrl: e.target.files[0].name, platform: 'upload' }); showNotification('File: ' + e.target.files[0].name); }
                                  }} />
                                  <Plus className="w-8 h-8 text-slate-300" />
                                  {newProduct.platform === 'upload' && newProduct.fileUrl ? (
                                    <p className="text-xs font-black text-[#7c2cff] bg-indigo-50 px-4 py-2 rounded-lg">{newProduct.fileUrl}</p>
                                  ) : (
                                    <p className="text-sm font-bold text-slate-500">{t('product_modal.click_to_select') || 'Klik untuk Pilih File Maks 50MB'}</p>
                                  )}
                                </div>
                              </div>
                            )}

                            {newProduct.type === 'LINK' && (
                              <div className="space-y-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-indigo-50 text-[#7c2cff] rounded-xl flex items-center justify-center"><Link2 className="w-5 h-5" /></div>
                                  <div>
                                    <h4 className="text-sm font-black text-slate-800">{t('product_modal.secret_link') || 'Tautan Akses Rahasia'}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{t('product_modal.buyers_download') || 'Pembeli akan mendownload ini'}</p>
                                  </div>
                                </div>
                                <input type="url" value={newProduct.fileUrl} onChange={(e) => setNewProduct({ ...newProduct, fileUrl: e.target.value, platform: 'other' })} placeholder="https://docs.google.com/..." className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 px-5 text-slate-900 focus:bg-white focus:border-indigo-100 font-bold text-sm" />
                              </div>
                            )}

                            {newProduct.type === 'BOOKING' && (
                              <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-50 text-[#7c2cff] rounded-xl flex items-center justify-center"><Calendar className="w-5 h-5" /></div>
                                    <div>
                                      <h4 className="text-sm font-black text-slate-800">{t('product_modal.session_schedule') || 'Jadwal Sesi & Kuota'}</h4>
                                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{t('product_modal.determine_availability') || 'Tentukan ketersediaan Anda'}</p>
                                    </div>
                                  </div>
                                  <button type="button" onClick={() => setNewProduct({ ...newProduct, bookingSlots: [...newProduct.bookingSlots, { startTime: '', endTime: '', maxParticipants: '1', meetingLink: '' }] })} className="text-xs font-black text-white bg-slate-900 px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors shadow-md">
                                    {t('product_modal.add_slot') || '+ Tambah Slot'}
                                  </button>
                                </div>

                                {newProduct.bookingSlots.length === 0 ? (
                                  <div className="text-center py-6 text-slate-400 text-sm font-bold border border-dashed border-slate-200 rounded-xl bg-slate-50/50">{t('product_modal.no_schedule') || 'Belum ada jadwal. Tambahkan slot pertama Anda.'}</div>
                                ) : (
                                  <div className="space-y-4">
                                    {newProduct.bookingSlots.map((slot, index) => (
                                      <div key={index} className="bg-slate-50 p-5 rounded-[1.5rem] border border-slate-200 relative group flex flex-col gap-5">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                          <div className="flex-1 w-full space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('product_modal.session_date') || 'Tanggal Sesi'}</label>
                                            <div className="relative">
                                              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                              <input type="date" value={slot.startTime ? slot.startTime.split('T')[0] : ''} onChange={(e) => { const s = [...newProduct.bookingSlots]; const date = e.target.value; const startT = s[index].startTime && s[index].startTime.includes('T') ? s[index].startTime.split('T')[1] : '09:00'; const endT = s[index].endTime && s[index].endTime.includes('T') ? s[index].endTime.split('T')[1] : '10:00'; s[index].startTime = date ? `${date}T${startT}` : ''; s[index].endTime = date ? `${date}T${endT}` : ''; setNewProduct({ ...newProduct, bookingSlots: s }); }} className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm font-bold text-slate-700 focus:border-[#7c2cff] focus:ring-4 focus:ring-indigo-50 transition-all" />
                                            </div>
                                          </div>
                                          <div className="flex-1 w-full space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('product_modal.time_start_end') || 'Jam (Mulai - Selesai)'}</label>
                                            <div className="flex items-center gap-2">
                                              <div className="relative flex-1">
                                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input type="time" value={slot.startTime && slot.startTime.includes('T') ? slot.startTime.split('T')[1] : ''} onChange={(e) => { const s = [...newProduct.bookingSlots]; const date = s[index].startTime && s[index].startTime.includes('T') ? s[index].startTime.split('T')[0] : new Date().toISOString().split('T')[0]; s[index].startTime = `${date}T${e.target.value}`; setNewProduct({ ...newProduct, bookingSlots: s }); }} className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-9 pr-2 text-sm font-bold text-slate-700 focus:border-[#7c2cff] focus:ring-4 focus:ring-indigo-50 transition-all" />
                                              </div>
                                              <span className="text-slate-300 font-bold">-</span>
                                              <div className="relative flex-1">
                                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input type="time" value={slot.endTime && slot.endTime.includes('T') ? slot.endTime.split('T')[1] : ''} onChange={(e) => { const s = [...newProduct.bookingSlots]; const date = s[index].endTime && s[index].endTime.includes('T') ? s[index].endTime.split('T')[0] : (s[index].startTime && s[index].startTime.includes('T') ? s[index].startTime.split('T')[0] : new Date().toISOString().split('T')[0]); s[index].endTime = `${date}T${e.target.value}`; setNewProduct({ ...newProduct, bookingSlots: s }); }} className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-9 pr-2 text-sm font-bold text-slate-700 focus:border-[#7c2cff] focus:ring-4 focus:ring-indigo-50 transition-all" />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-1 border-t border-slate-100/50">
                                          <div className="w-full sm:w-1/3 space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('product_modal.participant_quota') || 'Kuota Peserta'}</label>
                                            <div className="relative">
                                              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                              <input type="number" min="1" value={slot.maxParticipants} onChange={(e) => { const s = [...newProduct.bookingSlots]; s[index].maxParticipants = e.target.value; setNewProduct({ ...newProduct, bookingSlots: s }); }} className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm font-bold text-slate-700 focus:border-[#7c2cff] focus:ring-4 focus:ring-indigo-50 transition-all" />
                                            </div>
                                          </div>
                                          <div className="flex-1 w-full space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('product_modal.meeting_link') || 'Link Meeting (Opsional)'}</label>
                                            <div className="relative">
                                              <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                              <input type="url" placeholder="https://zoom.us/j/..." value={slot.meetingLink} onChange={(e) => { const s = [...newProduct.bookingSlots]; s[index].meetingLink = e.target.value; setNewProduct({ ...newProduct, bookingSlots: s }); }} className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm font-bold text-slate-700 focus:border-[#7c2cff] focus:ring-4 focus:ring-indigo-50 transition-all" />
                                            </div>
                                          </div>
                                        </div>
                                        <button type="button" onClick={() => { const s = [...newProduct.bookingSlots]; s.splice(index, 1); setNewProduct({ ...newProduct, bookingSlots: s }); }} className="absolute -top-3 -right-3 w-8 h-8 bg-white border border-slate-100 shadow-sm text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:scale-110">
                                          <X className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* STEP 2: HARGA & PENAWARAN */}
                      {currentStep === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 max-w-3xl mx-auto">
                          {/* Harga Dasar */}
                          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center"><DollarSign className="w-5 h-5" /></div>
                              <div>
                                <h4 className="text-sm font-black text-slate-800">{t('product_modal.selling_price') || 'Harga Jual'}</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{t('product_modal.determine_value') || 'Tentukan nilai produk Anda'}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('product_modal.main_price') || 'Harga Utama (IDR)'}</label>
                                <div className="relative">
                                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-300 text-sm">Rp</span>
                                  <input type="number" required value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-14 pr-6 text-slate-900 focus:bg-white focus:border-indigo-100 font-black text-base shadow-inner" />
                                </div>
                              </div>
                              <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('product_modal.original_price') || 'Harga Coret / Asli (Opsional)'}</label>
                                <div className="relative">
                                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-300 text-sm">Rp</span>
                                  <input type="number" value={newProduct.originalPrice} onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-14 pr-6 text-slate-900 focus:bg-white focus:border-indigo-100 font-black text-base shadow-inner" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Fitur Pemasaran Spesial */}
                          <div className="space-y-4">
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] px-2">Marketing Enhancements</p>

                            {/* PWYW */}
                            <div className={`p-6 rounded-3xl border-2 transition-all ${newProduct.isPwyw ? 'border-[#7c2cff] bg-indigo-50/30' : 'border-slate-100 bg-white hover:border-indigo-100/50'}`}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-base font-black text-slate-800 tracking-tight">Pay What You Want (PWYW)</p>
                                  <p className="text-[11px] font-bold text-slate-400 mt-1">{t('product_modal.pwyw_desc') || 'Pembeli bebas membayar lebih dari harga rekomendasi'}</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" className="sr-only peer" checked={newProduct.isPwyw} onChange={(e) => setNewProduct({ ...newProduct, isPwyw: e.target.checked })} />
                                  <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7c2cff]"></div>
                                </label>
                              </div>
                              {newProduct.isPwyw && (
                                <div className="mt-5 pt-5 border-t border-indigo-100/50 flex flex-col sm:flex-row gap-4 items-end animate-in slide-in-from-top-2 duration-300">
                                  <div className="space-y-2 flex-1 w-full">
                                    <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest ml-1">{t('product_modal.min_price') || 'Batas Harga Minimum (IDR)'}</label>
                                    <div className="relative">
                                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-sm">Rp</span>
                                      <input type="number" required={newProduct.isPwyw} value={newProduct.minPwywPrice} onChange={(e) => setNewProduct({ ...newProduct, minPwywPrice: e.target.value })} className="w-full bg-white border border-indigo-100 rounded-xl py-3 pl-12 pr-4 text-slate-900 font-bold text-sm focus:ring-2 focus:ring-[#7c2cff]" />
                                    </div>
                                  </div>
                                  <div className="flex-1 text-[10px] font-bold text-indigo-400 bg-indigo-50 p-3 rounded-xl">
                                    {t('product_modal.pwyw_note') || 'Dengan mengaktifkan PWYW, kolom "Harga Utama" di atas akan menjadi "Harga Rekomendasi" bagi pembeli.'}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Flash Sale */}
                            <div className={`p-6 rounded-3xl border-2 transition-all ${newProduct.isFlashSale ? 'border-orange-500 bg-orange-50/50' : 'border-slate-100 bg-white hover:border-orange-200/50'}`}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-base font-black text-slate-800 tracking-tight">Flash Sale Countdown</p>
                                    {newProduct.isFlashSale && <span className="bg-orange-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full animate-pulse">Hot</span>}
                                  </div>
                                  <p className="text-[11px] font-bold text-slate-400 mt-1">{t('product_modal.fomo_desc') || 'Munculkan timer urgency untuk meningkatkan konversi (FOMO)'}</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" className="sr-only peer" checked={newProduct.isFlashSale} onChange={(e) => setNewProduct({ ...newProduct, isFlashSale: e.target.checked })} />
                                  <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                                </label>
                              </div>
                              {newProduct.isFlashSale && (
                                <div className="mt-5 pt-5 border-t border-orange-100 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                                  <div className="space-y-2">
                                    <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest ml-1">{t('product_modal.ends_at') || 'Berakhir Pada'}</label>
                                    <input type="datetime-local" required={newProduct.isFlashSale} value={newProduct.flashSaleEndDate} onChange={(e) => setNewProduct({ ...newProduct, flashSaleEndDate: e.target.value })} className="w-full bg-white border border-orange-200 rounded-xl py-3 px-4 text-slate-900 font-bold text-sm focus:ring-2 focus:ring-orange-500" />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest ml-1">{t('product_modal.quota_limit') || 'Batas Kuota (Opsional)'}</label>
                                    <input type="number" placeholder={t('product_modal.quota_placeholder') || "Contoh: 100"} value={newProduct.flashSaleMaxQuota} onChange={(e) => setNewProduct({ ...newProduct, flashSaleMaxQuota: e.target.value })} className="w-full bg-white border border-orange-200 rounded-xl py-3 px-4 text-slate-900 font-bold text-sm focus:ring-2 focus:ring-orange-500" />
                                  </div>
                                </div>
                              )}
                            </div>

                          </div>
                        </div>
                      )}

                      {/* STEP 3: SELESAI / REVIEW */}
                      {currentStep === 3 && (
                        <div className="animate-in fade-in zoom-in-95 duration-500 max-w-2xl mx-auto text-center py-10 space-y-8">
                          <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] rotate-3 flex items-center justify-center mx-auto shadow-xl shadow-indigo-200/50">
                            <Send className="w-12 h-12 text-[#7c2cff] -rotate-3" />
                          </div>
                          <div>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{t('product_modal.ready_publish') || 'Siap Diterbitkan!'}</h3>
                            <p className="text-sm font-bold text-slate-500 mt-3 max-w-md mx-auto">
                              {t('product_modal.ready_desc_1') || 'Produk'} <span className="text-[#7c2cff] font-black">{newProduct.title || t('product_modal.untitled') || 'Tanpa Judul'}</span> {t('product_modal.ready_desc_2') || 'Anda sudah siap. Anda bisa mereview ulang atau langsung menyimpannya.'}
                            </p>
                          </div>

                          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm text-left max-w-md mx-auto flex items-center gap-4">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 shrink-0 overflow-hidden">
                              {newProduct.imageUrl ? <img src={newProduct.imageUrl} className="w-full h-full object-cover" /> : <Package className="w-8 h-8" />}
                            </div>
                            <div>
                              <p className="font-black text-slate-900 text-lg line-clamp-1">{newProduct.title || t('product_modal.untitled') || 'Tanpa Judul'}</p>
                              <p className="text-xs font-bold text-slate-400 mt-1">
                                Rp {newProduct.price || '0'} • {newProduct.type === 'DIGITAL_FILE' ? 'File' : newProduct.type === 'LINK' ? 'Link' : 'Konsultasi'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                    </form>
                  </div>

                  {/* Modal Footer / Navigation */}
                  <div className="px-8 py-5 border-t border-slate-100 bg-white shrink-0 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        if (currentStep > 1) {
                          setCurrentStep(currentStep - 1);
                          document.getElementById('modal-body-scroll')?.scrollTo({ top: 0, behavior: 'smooth' });
                        } else {
                          setIsProductModalOpen(false);
                        }
                      }}
                      className="px-6 py-3 text-xs font-black text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all uppercase tracking-widest"
                    >
                      {currentStep > 1 ? (t('product_modal.back') || '← Sebelumnya') : (t('product_modal.cancel') || 'Batal')}
                    </button>

                    <button
                      type={currentStep === 3 ? "submit" : "button"}
                      form="productForm"
                      disabled={isSubmitting || (currentStep === 1 && !newProduct.title)}
                      onClick={(e) => {
                        if (currentStep < 3) {
                          // Basic validation before next
                          if (currentStep === 1 && !newProduct.title) {
                            showNotification(t('product_modal.title_required') || 'Judul produk wajib diisi', 'error');
                            return;
                          }
                          if (currentStep === 2 && !newProduct.price) {
                            showNotification(t('product_modal.price_required') || 'Harga wajib diisi', 'error');
                            return;
                          }
                          setCurrentStep(currentStep + 1);
                          document.getElementById('modal-body-scroll')?.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className="px-8 py-3.5 bg-[#7c2cff] text-white rounded-xl font-black shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95 transition-all text-sm flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : currentStep < 3 ? (
                        <>{t('product_modal.next') || 'Selanjutnya'} &rarr;</>
                      ) : (
                        <><Save className="w-4 h-4" /> {editingProduct ? (t('product_modal.save_changes') || 'Simpan Perubahan') : (t('product_modal.publish') || 'Terbitkan Produk')}</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'earnings' && (
              <div className="space-y-10 animate-in fade-in duration-500 max-w-5xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-indigo-50 text-[#7c2cff] rounded-2xl flex items-center justify-center">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{t('dashboard_content.earnings_payouts') || 'Pendapatan & Pencairan'}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('dashboard_content.withdraw_anytime') || 'Tarik dana instan kapan saja'}</p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    {/* My Earnings Card (New Design) */}
                    <div className="bg-linear-to-br from-[#7c2cff] via-[#5A75F6] to-[#3a56d4] rounded-3xl p-6 shadow-xl shadow-indigo-500/20 relative overflow-hidden group border border-white/10">
                      {/* Fluid Background Shapes */}
                      <div className="absolute top-[-30%] left-[-10%] w-[60%] h-[150%] bg-white/10 rounded-[100%] -rotate-12 blur-3xl pointer-events-none mix-blend-overlay"></div>
                      <div className="absolute bottom-[-30%] right-[-10%] w-[70%] h-[130%] bg-indigo-300/30 rounded-[100%] rotate-12 blur-3xl pointer-events-none mix-blend-overlay"></div>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none"></div>

                      <div className="relative z-10 flex flex-col gap-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            {/* Gem Icon Container */}
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)]">
                              <Gem className="w-8 h-8 text-white drop-shadow-md" />
                            </div>

                            {/* Earnings Info */}
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-indigo-100 font-medium text-sm">{t('dashboard_content.available_balance') || 'Saldo Tersedia'}</span>
                                <Eye className="w-4 h-4 text-indigo-200" />
                              </div>
                              <h2 className="text-3xl font-black text-white tracking-tighter mb-1 flex items-baseline drop-shadow-sm">
                                <span className="text-lg mr-1.5 font-bold opacity-80">Rp</span>
                                {user?.balance?.toLocaleString() || 0}
                              </h2>
                              <button
                                onClick={() => setIsBankModalOpen(true)}
                                className="text-[11px] text-indigo-200 hover:text-white transition-colors text-left"
                              >
                                {t('dashboard_content.payout_settings') || 'Pengaturan Pencairan'}
                              </button>
                            </div>
                          </div>

                          {/* Withdraw Button */}
                          <button
                            onClick={() => setIsWithdrawModalOpen(true)}
                            className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center transition-all border border-white/20 group-hover:scale-105 active:scale-95 shadow-sm"
                          >
                            <Send className="w-5 h-5 text-white" />
                          </button>
                        </div>

                        {/* Bottom Glassy Box */}
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-1 relative mt-5 border border-white/20 shadow-inner">
                          <div className="absolute -top-4 left-4 bg-[#5A75F6] px-4 py-1.5 rounded-t-xl text-[10px] font-black text-white uppercase tracking-wider border-x border-t border-white/20 shadow-sm">
                            {t('dashboard_content.last_withdrawal') || 'Penarikan Terakhir'}
                          </div>
                          <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm mt-1">
                            <span className="text-indigo-100 font-medium text-xs">
                              {t('dashboard_content.instant_payout_active') || 'Sistem Instant Payout Aktif'}
                            </span>
                            <span className="font-black text-white drop-shadow-sm">
                              Rp {withdrawals[0]?.amount?.toLocaleString() || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* History */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="font-black text-slate-900 text-lg">{t('dashboard_content.payout_history') || 'Riwayat Pencairan'}</h4>
                        <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#7c2cff] flex items-center gap-1">
                          {t('dashboard_content.all') || 'Semua'} <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      {withdrawals.length === 0 ? (
                        <div className="text-center py-10">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <History className="w-8 h-8" />
                          </div>
                          <p className="text-slate-500 font-medium text-sm">{t('dashboard_content.no_withdrawal_history') || 'Belum ada riwayat penarikan.'}</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {withdrawals.slice(0, 5).map((w, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${w.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-500' : w.status === 'PROCESSING' ? 'bg-amber-100 text-amber-500' : 'bg-red-100 text-red-500'}`}>
                                  {w.status === 'COMPLETED' ? <CheckCircle2 className="w-6 h-6" /> : w.status === 'PROCESSING' ? <Loader2 className="w-6 h-6 animate-spin" /> : <AlertCircle className="w-6 h-6" />}
                                </div>
                                <div>
                                  <p className="font-black text-slate-900 text-sm">{w.bankName} - {w.accountNumber}</p>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(w.createdAt).toLocaleDateString()} • {w.status}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-black text-slate-900">Rp {w.amount.toLocaleString()}</p>
                                <p className="text-[10px] font-bold text-slate-400">Net: Rp {w.netAmount.toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sidebar (Bank Details) */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                      <div className="flex items-center justify-between mb-5">
                        <h4 className="font-black text-slate-900 text-lg">{t('dashboard_content.withdraw_to') || 'Cairkan Ke'}</h4>
                        <button
                          onClick={() => setIsBankModalOpen(true)}
                          className="w-10 h-10 bg-indigo-50 text-[#7c2cff] hover:bg-[#7c2cff] hover:text-white transition-all rounded-xl flex items-center justify-center"
                        >
                          <Settings className="w-5 h-5" />
                        </button>
                      </div>

                      {bankDetails.bankName && bankDetails.accountNumber ? (
                        <div className="bg-linear-to-r from-slate-900 to-slate-800 p-6 rounded-3xl text-white relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                            <Building2 className="w-16 h-16" />
                          </div>
                          <div className="relative z-10">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('dashboard_content.bank_ewallet') || 'Bank / E-Wallet'}</p>
                            <p className="text-xl font-black mb-6">{bankDetails.bankName}</p>

                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('dashboard_content.account_number') || 'Nomor Rekening'}</p>
                            <p className="font-mono text-lg tracking-widest mb-4 opacity-90">{bankDetails.accountNumber}</p>

                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('dashboard_content.account_holder') || 'Atas Nama'}</p>
                            <p className="font-bold text-sm uppercase">{bankDetails.accountHolder}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => setIsBankModalOpen(true)}>
                          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-400">
                            <Landmark className="w-7 h-7" />
                          </div>
                          <h5 className="font-black text-slate-700 mb-1">{t('dashboard_content.no_account_yet') || 'Belum Ada Rekening'}</h5>
                          <p className="text-[10px] text-slate-500 font-bold mb-4">{t('dashboard_content.add_account_desc') || 'Tambahkan rekening untuk mulai menarik dana pendapatanmu.'}</p>
                          <span className="text-xs font-black text-[#7c2cff] bg-indigo-50 px-4 py-2 rounded-xl">{t('dashboard_content.add_account') || 'Tambah Rekening'}</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-indigo-50/50 rounded-3xl p-6 border border-indigo-100/50 text-center">
                      <div className="w-10 h-10 bg-[#7c2cff] text-white rounded-xl flex items-center justify-center mx-auto mb-3">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <h5 className="font-black text-[#7c2cff] mb-2 text-sm">{t('dashboard_content.withdrawal_info') || 'Informasi Penarikan'}</h5>
                      <p className="text-[11px] font-medium text-slate-600 leading-relaxed">
                        {t('dashboard_content.transfer_fee_info') || 'Biaya transfer flat Rp 3.500 per penarikan. Sistem Instant Payout akan langsung memproses dana ke rekening Anda dalam hitungan detik.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'referrals' && (
              <ReferralsTab token={token} />
            )}
          </div>

          {/* Right Sidebar - Preview (ONLY VISIBLE IN STORE & APPEARANCE MENU) */}
          {['my-link', 'appearance', 'add-product'].includes(activeTab) && (
            <div className="w-full lg:w-120 bg-white border-l border-slate-100 p-10 hidden lg:flex flex-col sticky top-20 h-[calc(100vh-80px)] overflow-y-auto animate-in slide-in-from-right-10 duration-500">
              <div className="flex items-center justify-between mb-12">
                <h3 className="font-black text-slate-800 tracking-tight">{t('dashboard_content.live_preview') || 'Tampilan Live'}</h3>
                <div className="flex items-center gap-2.5 text-[10px] font-black text-[#7c2cff] uppercase tracking-[0.2em] bg-indigo-50 px-4 py-1.5 rounded-full">
                  <div className="w-2 h-2 bg-[#7c2cff] rounded-full animate-pulse"></div> Live Preview
                </div>
              </div>

              <div className="w-full max-w-[320px] mx-auto aspect-9/18.5 bg-slate-900 rounded-[3.5rem] p-4 shadow-[0_50px_100px_-20px_rgba(67,97,238,0.1)] relative border-8 border-slate-800">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-[1.5rem] z-20 flex items-center justify-center">
                  <div className="w-10 h-1 bg-slate-700 rounded-full"></div>
                </div>
                <div
                  className="w-full h-full rounded-[2.5rem] overflow-y-auto overflow-x-hidden flex flex-col relative scrollbar-hide"
                  style={{
                    fontFamily:
                      storeAppearance.theme === 'Montserrat' ? 'var(--font-montserrat)' :
                        storeAppearance.theme === 'Open Sans' ? 'var(--font-open-sans)' :
                          storeAppearance.theme === 'Jakarta Sans' ? 'var(--font-jakarta)' :
                            storeAppearance.theme === 'Lato' ? 'var(--font-lato)' : 'var(--font-inter)',
                    backgroundColor: storeAppearance.contentBgColor || '#F8FAFC'
                  }}
                >
                  {/* Header Background */}
                  <div
                    className="h-32 shrink-0 bg-cover bg-center transition-colors duration-500 relative"
                    style={{
                      backgroundColor: storeAppearance.headerImageUrl ? 'transparent' : storeAppearance.primaryColor,
                      backgroundImage: storeAppearance.headerImageUrl ? `url(${storeAppearance.headerImageUrl})` : 'none'
                    }}
                  >
                  </div>

                  {/* Content Container */}
                  <div className="px-5 pb-8 flex flex-col items-center relative -mt-10">
                    {/* Profile Picture */}
                    <div className="w-20 h-20 rounded-full border-4 border-white shadow-sm flex items-center justify-center overflow-hidden z-10 shrink-0" style={{ backgroundColor: storeAppearance.profileImageUrl ? 'transparent' : storeAppearance.primaryColor }}>
                      {storeAppearance.profileImageUrl ? (
                        <img src={storeAppearance.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white text-2xl font-black">
                          {storeSettings.name ? storeSettings.name.charAt(0).toUpperCase() : 'S'}
                        </span>
                      )}
                    </div>

                    {/* Store Info */}
                    <div className="mt-3 text-center w-full">
                      <h4 className="font-black text-slate-900 text-sm tracking-tight">{storeSettings.name || 'Nama Toko'}</h4>
                      <p className="text-[10px] text-slate-500 font-bold mt-0.5">@{storeSettings.slug || 'slug'}</p>
                      {storeSettings.description && (
                        <p className="text-[10px] text-slate-600 mt-3 whitespace-pre-wrap leading-relaxed">{storeSettings.description}</p>
                      )}
                    </div>

                    {/* Social Links */}
                    {(storeAppearance.socialLinks?.instagram || storeAppearance.socialLinks?.tiktok || storeAppearance.socialLinks?.youtube || storeAppearance.socialLinks?.x) && (
                      <div className="flex items-center gap-3 mt-4">
                        {['instagram', 'tiktok', 'youtube', 'x'].map(p => storeAppearance.socialLinks[p] ? (
                          <a key={p} href={storeAppearance.socialLinks[p]} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-slate-200 bg-white shadow-sm flex items-center justify-center text-slate-700 hover:text-[#7c2cff] hover:border-[#7c2cff] transition-all">
                            {p === 'instagram' && <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>}
                            {p === 'tiktok' && <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>}
                            {p === 'youtube' && <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>}
                            {p === 'x' && <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>}
                          </a>
                        ) : null)}
                      </div>
                    )}

                    {/* Promo Banner */}
                    {storeAppearance.bannerImageUrl && (
                      <div className="w-full mt-6 rounded-2xl overflow-hidden shadow-sm border border-slate-100/50">
                        <img src={storeAppearance.bannerImageUrl} alt="Banner" className="w-full object-cover" />
                      </div>
                    )}

                    {/* CTA Button */}
                    {storeAppearance.ctaText && (
                      <div className="w-full mt-5">
                        <a href={storeAppearance.ctaLink || '#'} target="_blank" rel="noreferrer" className="w-full block py-3.5 rounded-xl font-black text-xs text-center transition-all shadow-md hover:scale-[1.02] border border-white/10" style={{ backgroundColor: storeAppearance.primaryColor, color: '#FFF' }}>
                          {storeAppearance.ctaText}
                        </a>
                      </div>
                    )}

                    {/* Product List */}
                    <div className={`w-full mt-6 ${storeAppearance.customCss === 'grid' ? 'grid grid-cols-2 gap-3 content-start' : 'space-y-3.5'}`}>
                      {products.filter(p => p.isActive).length === 0 ? (
                        <div className="space-y-3 opacity-40 col-span-2">
                          {[1, 2, 3].map(i => <div key={i} className="h-12 bg-slate-100/50 rounded-2xl w-full border border-slate-200"></div>)}
                        </div>
                      ) : (
                        products.filter(p => p.isActive).slice(0, 5).map((p) => (
                          <a
                            href={`/${storeSettings.slug || 'slug'}/p/${p.id}`}
                            target="_blank"
                            rel="noreferrer"
                            key={p.id}
                            className="block w-full"
                          >
                            <div
                              className={`w-full bg-white border border-slate-100 shadow-sm flex relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform ${storeAppearance.customCss === 'card'
                                  ? 'rounded-2xl flex-col'
                                  : storeAppearance.customCss === 'grid'
                                    ? 'rounded-2xl flex-col aspect-square justify-end'
                                    : 'rounded-2xl items-center p-4 gap-4'
                                }`}
                            >
                              {p.imageUrl && (
                                <div className={`${storeAppearance.customCss === 'card'
                                    ? 'w-full h-32'
                                    : storeAppearance.customCss === 'grid'
                                      ? 'absolute inset-0 w-full h-full z-0'
                                      : 'w-10 h-10 rounded-xl shrink-0'
                                  }`}>
                                  <img src={p.imageUrl} className="w-full h-full object-cover" alt={p.title} />
                                  {storeAppearance.customCss === 'grid' && <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent"></div>}
                                </div>
                              )}

                              <div className={`flex items-center justify-between flex-1 ${storeAppearance.customCss === 'card'
                                  ? 'p-4 flex-col items-start gap-2 w-full'
                                  : storeAppearance.customCss === 'grid'
                                    ? 'p-4 flex-col gap-2 relative z-10 w-full'
                                    : 'w-full'
                                }`}>
                                <span className={`text-[10px] font-black tracking-tight line-clamp-2 ${storeAppearance.customCss === 'card'
                                    ? 'text-xs text-slate-800'
                                    : storeAppearance.customCss === 'grid'
                                      ? (p.imageUrl ? 'text-white text-center' : 'text-slate-800 text-center')
                                      : 'text-slate-800'
                                  }`}>{p.title}</span>

                                {storeAppearance.customCss === 'card' ? (
                                  <div className="w-full flex justify-between items-center mt-1 pt-3 border-t border-slate-50">
                                    <div className="flex flex-col">
                                      {p.originalPrice && Number(p.originalPrice) > Number(p.price) && (
                                        <span className="text-[8px] font-medium text-slate-300 line-through">Rp {Number(p.originalPrice).toLocaleString()}</span>
                                      )}
                                      <span className="text-[10px] font-bold text-slate-400">Rp {Number(p.price).toLocaleString()}</span>
                                    </div>
                                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0" style={{ backgroundColor: storeAppearance.primaryColor }}><ChevronRight className="w-3.5 h-3.5" /></div>
                                  </div>
                                ) : storeAppearance.customCss === 'grid' ? (
                                  <div className={`mt-1 text-[8px] font-bold px-3 py-1 rounded-full border ${p.imageUrl ? 'border-white/30 text-white/90 backdrop-blur-sm' : 'border-slate-100 text-slate-400'}`}>Lihat</div>
                                ) : (
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                                )}
                              </div>
                            </div>
                          </a>
                        ))
                      )}
                    </div>

                    <div className="pt-8 pb-4 text-center opacity-50">
                      <span className="text-[8px] font-black text-slate-800 uppercase tracking-widest">Powered by KAMU</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bank Details Modal */}
        {isBankModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-100 flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-900">{t('dashboard_content.destination_account') || 'Rekening Tujuan'}</h3>
                <button onClick={() => setIsBankModalOpen(false)} className="text-slate-400 hover:bg-slate-50 p-2 rounded-xl transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleUpdateBankDetails} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('dashboard_content.bank_name_code') || 'Nama Bank / Kode Xendit'}</label>
                  <input
                    type="text"
                    value={bankDetails.bankName}
                    onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value.toUpperCase() })}
                    placeholder="BCA, MANDIRI, BNI, BRI, OVO, DANA"
                    required
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-3.5 px-5 text-slate-900 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50/50 transition-all font-bold text-sm"
                  />
                  <p className="text-[9px] text-slate-400 font-bold ml-1">{t('dashboard_content.bank_code_note') || 'Pastikan kode bank sesuai dengan format Xendit.'}</p>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('dashboard_content.account_number') || 'Nomor Rekening'}</label>
                  <input
                    type="text"
                    value={bankDetails.accountNumber}
                    onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                    placeholder="0812345678"
                    required
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-3.5 px-5 text-slate-900 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50/50 transition-all font-bold text-sm"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('dashboard_content.account_holder_name') || 'Nama Pemilik Rekening'}</label>
                  <input
                    type="text"
                    value={bankDetails.accountHolder}
                    onChange={(e) => setBankDetails({ ...bankDetails, accountHolder: e.target.value })}
                    placeholder="Ahmad Fauzi"
                    required
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-3.5 px-5 text-slate-900 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50/50 transition-all font-bold text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#7c2cff] text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center mt-4"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (t('dashboard_content.save_account') || 'Simpan Rekening')}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Withdraw Modal */}
        {isWithdrawModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-100 flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-900">{t('dashboard_content.instant_payout') || 'Tarik Dana Instan'}</h3>
                <button onClick={() => setIsWithdrawModalOpen(false)} className="text-slate-400 hover:bg-slate-50 p-2 rounded-xl transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-6 mb-8 text-center border border-emerald-100">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{t('dashboard_content.available_balance') || 'Saldo Tersedia'}</p>
                <p className="text-3xl font-black text-emerald-600">Rp {user?.balance?.toLocaleString() || 0}</p>
              </div>

              <form onSubmit={handleWithdraw} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('dashboard_content.withdrawal_amount') || 'Nominal Penarikan'}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <span className="text-slate-400 font-bold">Rp</span>
                    </div>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="100000"
                      min="10000"
                      max={user?.balance || 0}
                      required
                      className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-5 text-slate-900 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50/50 transition-all font-black text-lg"
                    />
                  </div>
                </div>

                {withdrawAmount && parseFloat(withdrawAmount) > 3500 && (
                  <div className="bg-slate-50 rounded-2xl p-5 space-y-3 border border-slate-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-medium">{t('dashboard_content.withdrawal_amount_label') || 'Nominal Penarikan'}</span>
                      <span className="font-bold text-slate-800">Rp {parseFloat(withdrawAmount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-red-500">
                      <span className="font-medium">{t('dashboard_content.instant_payout_fee') || 'Biaya Instan Payout'}</span>
                      <span className="font-bold">- Rp 3.500</span>
                    </div>
                    <div className="pt-3 border-t border-slate-200 flex justify-between">
                      <span className="font-black text-slate-800">{t('dashboard_content.received_in_account') || 'Diterima di Rekening'}</span>
                      <span className="font-black text-emerald-600 text-lg">Rp {(parseFloat(withdrawAmount) - 3500).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !withdrawAmount || parseFloat(withdrawAmount) > user?.balance || parseFloat(withdrawAmount) <= 3500 || !bankDetails.bankName}
                  className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black shadow-xl shadow-emerald-200 hover:bg-emerald-600 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center mt-4 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (t('dashboard_content.withdraw_now') || 'Cairkan Sekarang')}
                </button>

                {!bankDetails.bankName && (
                  <p className="text-[10px] text-red-500 font-bold text-center mt-2">{t('dashboard_content.no_bank_warning') || 'Anda belum mengatur rekening tujuan penarikan.'}</p>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Upgrade Limit Modal */}
        {isUpgradeLimitModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-100 flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6 text-amber-500">
                <Gem className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Batas Produk Tercapai</h3>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                Paket Starter hanya memungkinkan maksimal 3 produk aktif. Tingkatkan paket Anda untuk membuat produk tanpa batas dan nikmati fitur premium lainnya!
              </p>
              
              <div className="flex gap-4 w-full">
                <button 
                  onClick={() => setIsUpgradeLimitModalOpen(false)}
                  className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl font-black hover:bg-slate-100 transition-all"
                >
                  Batal
                </button>
                <button 
                  onClick={() => {
                    setIsUpgradeLimitModalOpen(false);
                    window.location.href = '/dashboard/subscription';
                  }}
                  className="flex-1 py-4 bg-linear-to-r from-amber-400 to-orange-500 text-white rounded-2xl font-black shadow-xl shadow-orange-100 hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <Gem className="w-5 h-5" /> Upgrade
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {notif.show && (
          <div className={`fixed bottom-6 right-6 z-100 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-bottom-5 fade-in duration-300 ${notif.type === 'success'
              ? 'bg-white border-emerald-100 text-slate-800'
              : 'bg-white border-red-100 text-slate-800'
            }`}>
            {notif.type === 'success' ? (
              <div className="w-8 h-8 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-8 h-8 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
            )}
            <p className="text-sm font-black tracking-tight">{notif.message}</p>
            <button
              onClick={() => setNotif({ ...notif, show: false })}
              className="ml-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
