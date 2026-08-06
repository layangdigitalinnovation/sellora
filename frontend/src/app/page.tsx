'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaInstagram, FaWhatsapp, FaTiktok, FaYoutube, FaMeta } from 'react-icons/fa6';
import { FaEnvelope, FaChartBar, FaBolt, FaEllipsisH } from 'react-icons/fa';
import './landing.css';

export interface SubscriptionPackage {
  id: string;
  name: string;
  slug: string;
  price: number;
  billingPeriod: string;
  features: string[];
}

export default function LandingPage() {
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [activeTourIndex, setActiveTourIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState('');
  
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/subscriptions/packages`);
        if (res.ok) {
          const data = await res.json();
          setPackages(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingPackages(false);
      }
    };
    fetchPackages();
  }, []);
  
  const trackRef = useRef<HTMLDivElement>(null);
  
  const tourData = [
    ['Satu halaman, semua peluang.','Bangun halaman profesional dalam hitungan menit.'],
    ['Jual apa yang kamu kuasai.','Produk digital, fisik, kursus, booking, membership, hingga event.'],
    ['Data yang mudah dipahami.','Pantau pesanan, pelanggan, dan performa penjualan dalam satu dashboard.']
  ];

  const handleNextTestimonial = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const handlePrevTestimonial = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.currentTarget.elements.namedItem('newsletterEmail') as HTMLInputElement).value;
    if (!email) return;
    showToast('Berhasil bergabung ke newsletter KAMU');
    e.currentTarget.reset();
  };
  
  // Close modal on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsDemoModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  useEffect(() => {
    if (isDemoModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; }
  }, [isDemoModalOpen]);

  return (
    <div className="landing-wrapper">
      
  <header className="site-header">
    <div className="container nav">
      <a className="brand" href="#top" aria-label="KAMU - Beranda">
        <svg className="brand-mark" viewBox="0 0 64 64" aria-hidden="true">
          <defs><linearGradient id="kg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ff8a00"/><stop offset=".42" stopColor="#f13e8e"/><stop offset="1" stopColor="#5f2cff"/></linearGradient></defs>
          <rect x="8" y="7" width="13" height="50" rx="6.5" fill="url(#kg)"/>
          <path d="M25 32 47 8c4-4 11-1 11 5v4c0 2-1 4-3 6L42 35l13 8c2 1 3 3 3 5v3c0 6-7 9-12 6L25 44c-5-3-6-9-2-13l2-2v3Z" fill="url(#kg)"/>
        </svg>
        <span className="brand-word"><strong>KAMU</strong><small>Kelola Aktivitas Monetisasi Usaha</small></span>
      </a>
      <nav className="nav-links" aria-label="Navigasi utama">
        <a href="#features">Fitur</a><a href="#how-it-works">Cara Kerja</a><a href="#pricing">Harga</a><a href="#testimonials">Contoh Toko</a><a href="#resources">Resources</a>
      </nav>
      <div className="nav-actions"><a className="btn btn-outline" href="/login">Masuk</a><a className="btn btn-primary" href="/register">Mulai Gratis</a></div>
      <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-expanded="false" aria-controls="mobileMenu" aria-label="Buka menu">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>
    </div>
    <div className={`container mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
      <a href="#features">Fitur</a><a href="#how-it-works">Cara Kerja</a><a href="#pricing">Harga</a><a href="#testimonials">Contoh Toko</a><a href="/login">Masuk</a><a href="/register">Mulai Gratis</a>
    </div>
  </header>

  <main id="top">
    <section className="hero" aria-labelledby="heroTitle">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>
            Platform Monetisasi All-in-One untuk Kreator
          </span>
          <h1 id="heroTitle">Cara Kamu Menghasilkan Cuan, dalam <span className="gradient-text">Satu Halaman</span></h1>
          <p className="hero-lead">Jual produk digital &amp; fisik, kelola kursus, booking, membership, dan event dalam satu platform. Tanpa ribet, tanpa biaya transaksi. Fokus berkarya, biar KAMU yang urus sisanya.</p>
          <div className="hero-actions">
            <a className="btn btn-primary btn-large" href="/register">Mulai Gratis 14 Hari <span aria-hidden="true">→</span></a>
            <button className="btn btn-ghost btn-large" onClick={() => setIsDemoModalOpen(true)}><span className="play-icon">▶</span>Lihat Demo 2 Menit</button>
          </div>
          <div className="trust-line">
            <div className="avatar-stack" aria-label="Contoh pengguna KAMU">
              <div className="mini-avatar"><svg viewBox="0 0 80 80"><rect width="80" height="80" fill="#ecd8c7"/><circle cx="40" cy="32" r="18" fill="#b87552"/><path d="M14 80c3-24 15-34 26-34s23 10 26 34" fill="#20233a"/></svg></div>
              <div className="mini-avatar"><svg viewBox="0 0 80 80"><rect width="80" height="80" fill="#d8e2f5"/><circle cx="40" cy="32" r="18" fill="#a46e4a"/><path d="M12 80c4-22 16-34 28-34s24 12 28 34" fill="#5861ac"/></svg></div>
              <div className="mini-avatar"><svg viewBox="0 0 80 80"><rect width="80" height="80" fill="#f3d7da"/><circle cx="40" cy="32" r="18" fill="#c58660"/><path d="M12 80c4-23 16-34 28-34s24 11 28 34" fill="#5c2737"/></svg></div>
              <div className="mini-avatar"><svg viewBox="0 0 80 80"><rect width="80" height="80" fill="#e4ddf2"/><circle cx="40" cy="32" r="18" fill="#986243"/><path d="M12 80c3-23 16-34 28-34s25 11 28 34" fill="#2b2340"/></svg></div>
            </div>
            <div><div><span className="rating">★★★★★</span> <span className="rating-copy"><strong>4.9/5</strong></span></div><div className="rating-copy">Bergabung bersama 10.000+ kreator &amp; bisnis</div></div>
          </div>
          <div className="benefits">
            <div className="benefit"><span className="benefit-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M8 8l8 8M16 8l-8 8"/></svg></span>Tanpa Biaya<br />Transaksi</div>
            <div className="benefit"><span className="benefit-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3 4 6v5c0 5 3 8 8 10 5-2 8-5 8-10V6l-8-3Z"/><path d="m9 12 2 2 4-5"/></svg></span>Aman &amp;<br />Terpercaya</div>
            <div className="benefit"><span className="benefit-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m14 5 5 5L8 21H3v-5L14 5Z"/><path d="m13 6 5 5"/></svg></span>Mudah<br />Digunakan</div>
            <div className="benefit"><span className="benefit-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 14a8 8 0 0 1 16 0"/><path d="M4 14v4h4v-5H4ZM20 14v4h-4v-5h4Z"/><path d="M16 20h-4"/></svg></span>Support<br />24/7</div>
          </div>
        </div>

        <div className="visual-wrap" aria-label="Preview dashboard dan aplikasi KAMU">
          <div className="dashboard" role="img" aria-label="Dashboard KAMU dengan ringkasan penjualan dan grafik">
            <aside className="dash-side">
              <div className="dash-logo"><svg className="tiny-mark" viewBox="0 0 64 64"><defs><linearGradient id="kg2" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ff8a00"/><stop offset=".45" stopColor="#f13e8e"/><stop offset="1" stopColor="#5f2cff"/></linearGradient></defs><rect x="8" y="7" width="13" height="50" rx="6.5" fill="url(#kg2)"/><path d="M25 32 47 8c4-4 11-1 11 5v4c0 2-1 4-3 6L42 35l13 8c2 1 3 3 3 5v3c0 6-7 9-12 6L25 44c-5-3-6-9-2-13l2-2v3Z" fill="url(#kg2)"/></svg>KAMU</div>
              <div className="dash-nav">
                <span className="active"><i>⌂</i>Beranda</span><span><i>□</i>Produk</span><span><i>▣</i>Pesanan</span><span><i>◎</i>Pelanggan</span><span><i>▤</i>Konten</span><span><i>⌁</i>Analitik</span><span><i>⚙</i>Pengaturan</span>
              </div>
            </aside>
            <div className="dash-main">
              <div className="dash-top"><div><strong>Ringkasan</strong><div style={{"fontSize":"8px","color":"#8b8ea0"}}>Periode 30 hari terakhir</div></div><div className="dash-user"><div className="face"><svg viewBox="0 0 80 80"><rect width="80" height="80" fill="#ffe0c5"/><circle cx="40" cy="31" r="18" fill="#b97550"/><path d="M12 80c5-23 17-34 28-34s23 11 28 34" fill="#2f2344"/></svg></div>Halo, Anita⌄</div></div>
              <div className="stat-grid"><div className="stat"><small>Total Penjualan</small><strong>Rp125.450.000</strong><span className="up">+28.5%</span></div><div className="stat"><small>Produk Terjual</small><strong>1.234</strong><span className="up">+32.1%</span></div><div className="stat"><small>Total Pelanggan</small><strong>856</strong><span className="up">+16.0%</span></div></div>
              <div className="chart-card">
                <div className="chart-head"><span>Penjualan</span><span className="chart-select">30 Hari ⌄</span></div>
                <svg className="chart-svg" viewBox="0 0 480 180" preserveAspectRatio="none" aria-hidden="true">
                  <defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#7d3cff" stopOpacity=".25"/><stop offset="1" stopColor="#7d3cff" stopOpacity="0"/></linearGradient></defs>
                  <g stroke="#ececf3" strokeWidth="1"><path d="M0 30H480M0 75H480M0 120H480M0 165H480"/></g>
                  <path d="M20 145 C55 145 62 105 96 110 S135 150 169 118 S205 68 242 92 S287 127 318 91 S354 112 382 75 S421 98 458 48 L458 165 L20 165 Z" fill="url(#area)"/>
                  <path d="M20 145 C55 145 62 105 96 110 S135 150 169 118 S205 68 242 92 S287 127 318 91 S354 112 382 75 S421 98 458 48" fill="none" stroke="#6734f0" strokeWidth="4" strokeLinecap="round"/>
                  <g fill="#6734f0"><circle cx="20" cy="145" r="4"/><circle cx="96" cy="110" r="4"/><circle cx="169" cy="118" r="4"/><circle cx="242" cy="92" r="4"/><circle cx="318" cy="91" r="4"/><circle cx="382" cy="75" r="4"/><circle cx="458" cy="48" r="4"/></g>
                </svg>
              </div>
            </div>
          </div>
          <div className="floating-stat one"><span className="bubble">♙</span><div><small>Penjualan Hari Ini</small><strong>Rp 8.450.000</strong><span className="up">+15.3% dari kemarin</span></div></div>
          <div className="floating-stat two"><span className="bubble">▣</span><div><small>Total Produk</small><strong>48 Produk</strong><span className="up">12 aktif</span></div></div>
          <div className="phone" role="img" aria-label="Aplikasi mobile KAMU">
            <div className="phone-header"><div className="phone-avatar"><svg viewBox="0 0 80 80"><rect width="80" height="80" fill="#ffe5d2"/><circle cx="40" cy="31" r="18" fill="#c48158"/><path d="M10 80c6-24 18-35 30-35s24 11 30 35" fill="#532541"/><path d="M24 30c1-18 31-18 32 0-6-5-25-5-32 0" fill="#38221e"/></svg></div><div className="phone-name">Anita Rahma</div><div className="phone-sub">Content Creator / Educator</div></div>
            <div className="phone-total"><small>Total Saldo</small><strong>Rp24.680.000</strong></div>
            <div className="phone-tabs"><div className="phone-tab"><i>▤</i>Produk</div><div className="phone-tab"><i>▣</i>Pesanan</div><div className="phone-tab"><i>♙</i>Pelanggan</div><div className="phone-tab"><i>⌁</i>Analitik</div></div>
            <div className="phone-orders"><h4>Pesanan Terbaru</h4><div className="order"><div className="thumb"></div><div><b>E-book Digital Marketing</b><span>Rp49.000</span></div></div><div className="order"><div className="thumb"></div><div><b>Kursus Canva untuk Pemula</b><span>Rp199.000</span></div></div></div>
            <div className="phone-bottom"><span className="active">⌂<small>Beranda</small></span><span>□<small>Produk</small></span><span>▣<small>Pesanan</small></span><span>◎<small>Pelanggan</small></span><span>☻<small>Akun</small></span></div>
          </div>
        </div>
      </div>
    </section>

    <section className="section feature-section" id="features">
      <div className="container">
        <h2 className="section-title">Semua yang Kamu Butuhkan untuk Menghasilkan Cuan</h2>
        <p className="section-subtitle">Lengkap. Terintegrasi. Tanpa Ribet.</p>
        <div className="features">
          <article className="feature"><div className="feature-icon"><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3"><path d="M17 22h30l4 34H13l4-34Z"/><path d="M23 25v-7a9 9 0 0 1 18 0v7"/></svg></div><h3>Jual Produk Digital &amp; Fisik</h3><p>E-book, template, merchandise, dan produk lainnya.</p></article>
          <article className="feature"><div className="feature-icon"><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3"><path d="m7 23 25-13 25 13-25 13L7 23Z"/><path d="M17 29v14c8 7 22 7 30 0V29"/><path d="M57 23v18"/></svg></div><h3>Kursus &amp; Pendidikan Online</h3><p>Buat dan jual kursus, kelola siswa, dan sertifikat otomatis.</p></article>
          <article className="feature"><div className="feature-icon"><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3"><rect x="10" y="15" width="44" height="39" rx="5"/><path d="M10 26h44M20 9v12M44 9v12"/><path d="M20 35h6M31 35h6M42 35h6M20 44h6M31 44h6"/></svg></div><h3>Booking &amp; Janji Temu</h3><p>Terima booking, atur jadwal, dan kelola kalendermu.</p></article>
          <article className="feature"><div className="feature-icon"><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="32" cy="22" r="10"/><circle cx="14" cy="27" r="7"/><circle cx="50" cy="27" r="7"/><path d="M14 50c1-10 8-15 18-15s17 5 18 15M3 49c1-8 5-12 11-12M61 49c-1-8-5-12-11-12"/></svg></div><h3>Membership &amp; Komunitas</h3><p>Bangun komunitas berbayar dan sumber income rutin.</p></article>
          <article className="feature"><div className="feature-icon"><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3"><path d="M8 20h48v15a8 8 0 0 0 0 16H8a8 8 0 0 0 0-16V20Z"/><path d="M32 20v31M25 29l14 13M39 29 25 42"/></svg></div><h3>Event &amp; Webinar</h3><p>Buat event online/offline dan jual tiket dengan mudah.</p></article>
          <article className="feature"><div className="feature-icon"><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3"><path d="M11 54V35h9v19M27 54V21h10v33M44 54V10h9v44"/></svg></div><h3>Analitik &amp; Laporan</h3><p>Pantau performa bisnismu secara real-time.</p></article>
        </div>
      </div>
    </section>

    <section className="section" id="how-it-works">
      <div className="container">
        <h2 className="section-title">Cara Kerja KAMU</h2>
        <p className="section-subtitle">Mulai dalam 3 langkah mudah</p>
        <div className="steps">
          <article className="step"><span className="step-number">1</span><div className="step-icon"><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3"><rect x="13" y="13" width="38" height="38" rx="10"/><path d="M32 22v20M22 32h20"/></svg></div><h3>Buat Akun Gratis</h3><p>Daftar gratis dalam 1 menit tanpa kartu kredit.</p><span className="step-arrow" aria-hidden="true">→</span></article>
          <article className="step"><span className="step-number">2</span><div className="step-icon"><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3"><path d="M13 26h38l-3-12H16l-3 12Z"/><path d="M16 27v25h32V27M25 52V38h14v14"/><path d="M13 26c0 6 9 6 9 0 0 6 10 6 10 0 0 6 10 6 10 0 0 6 9 6 9 0"/></svg></div><h3>Buat &amp; Tambah Produk</h3><p>Unggah produk, atur harga, dan publikasikan tokomu.</p><span className="step-arrow" aria-hidden="true">→</span></article>
          <article className="step"><span className="step-number">3</span><div className="step-icon"><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3"><path d="m22 42-10 10 2-15 23-23c6-6 13-5 15-3 2 2 3 9-3 15L26 49l-4-7Z"/><path d="m35 16 13 13M15 49 5 59M22 55l-5 5"/><circle cx="40" cy="23" r="4"/></svg></div><h3>Bagikan &amp; Mulai Jual</h3><p>Bagikan link tokomu di bio, sosial media, atau komunitas.</p></article>
        </div>
      </div>
    </section>

    <section className="section testimonials-section" id="testimonials">
      <div className="container">
        <h2 className="section-title">Dipercaya oleh Kreator Hebat</h2>
        <p className="section-subtitle">Mereka sudah membuktikan KAMU bikin monetisasi jadi lebih mudah.</p>
        <div className="testimonial-shell">
          <button className="slider-button prev" onClick={handlePrevTestimonial} aria-label="Testimoni sebelumnya">←</button>
          <div className="testimonial-track" ref={trackRef}>
            <article className="testimonial"><div className="person"><div className="avatar"><svg viewBox="0 0 80 80"><rect width="80" height="80" fill="#ffe1cc"/><circle cx="40" cy="31" r="18" fill="#bf7d55"/><path d="M9 80c5-23 18-35 31-35s25 12 31 35" fill="#4f233a"/><path d="M23 29c1-17 32-17 34 0-8-5-27-5-34 0" fill="#2a1916"/></svg></div><div><b>Anita Rahma</b><span>@anita.rahma</span></div></div><p className="quote">“KAMU bener membantu aku jualan e-book dan kursus. Semua dalam satu tempat, laporan jelas dan pembayaran cepat!”</p><div className="metric"><small>Penjualan Bulan Ini</small><strong>Rp28.450.000</strong><span className="up">+35%</span><svg className="mini-chart" viewBox="0 0 180 38" preserveAspectRatio="none"><path d="M0 34 18 28 36 30 54 19 72 23 90 13 108 17 126 9 144 13 162 3 180 7" fill="none" stroke="#703cff" strokeWidth="2"/></svg></div></article>
            <article className="testimonial"><div className="person"><div className="avatar"><svg viewBox="0 0 80 80"><rect width="80" height="80" fill="#d7e3ee"/><circle cx="40" cy="31" r="18" fill="#a96f4c"/><path d="M9 80c5-23 18-35 31-35s25 12 31 35" fill="#192936"/><path d="M22 27c4-17 31-16 35 2-8-7-27-7-35-2" fill="#2b201c"/></svg></div><div><b>Deddy Corbuzier Team</b><span>@dc.brand</span></div></div><p className="quote">“Platform terbaik untuk kelola membership dan event. Komunitas kami tumbuh dan revenue meningkat signifikan!”</p><div className="metric"><small>Member Aktif</small><strong>4.250</strong><span className="up">+29%</span><svg className="mini-chart" viewBox="0 0 180 38" preserveAspectRatio="none"><path d="M0 34 18 32 36 28 54 25 72 27 90 18 108 20 126 11 144 13 162 7 180 1" fill="none" stroke="#703cff" strokeWidth="2"/></svg></div></article>
            <article className="testimonial"><div className="person"><div className="avatar"><svg viewBox="0 0 80 80"><rect width="80" height="80" fill="#efd9d6"/><circle cx="40" cy="31" r="18" fill="#b97552"/><path d="M9 80c5-23 18-35 31-35s25 12 31 35" fill="#41263b"/><path d="M22 28c3-17 32-17 36 1-10-4-27-4-36-1" fill="#3d211c"/></svg></div><div><b>Ria SW</b><span>@riasw</span></div></div><p className="quote">“Dari jual template sampai booking mentoring, semua bisa di KAMU. Hemat waktu dan anti ribet!”</p><div className="metric"><small>Total Order</small><strong>1.386</strong><span className="up">+41%</span><svg className="mini-chart" viewBox="0 0 180 38" preserveAspectRatio="none"><path d="M0 35 18 29 36 31 54 20 72 22 90 16 108 18 126 10 144 12 162 3 180 0" fill="none" stroke="#703cff" strokeWidth="2"/></svg></div></article>
            <article className="testimonial"><div className="person"><div className="avatar"><svg viewBox="0 0 80 80"><rect width="80" height="80" fill="#e5dcea"/><circle cx="40" cy="31" r="18" fill="#bc7d59"/><path d="M9 80c5-23 18-35 31-35s25 12 31 35" fill="#2c2a41"/><path d="M21 30c3-18 34-18 38 0-10-6-29-6-38 0" fill="#32211c"/></svg></div><div><b>Gita Savitri</b><span>@gitasav</span></div></div><p className="quote">“Analitiknya lengkap banget. Aku jadi tau produk mana yang paling laku dan audience aku suka apa.”</p><div className="metric"><small>Total Penjualan</small><strong>Rp125.450.000</strong><span className="up">+25%</span><svg className="mini-chart" viewBox="0 0 180 38" preserveAspectRatio="none"><path d="M0 34 18 28 36 26 54 30 72 18 90 16 108 20 126 11 144 7 162 10 180 0" fill="none" stroke="#703cff" strokeWidth="2"/></svg></div></article>
          </div>
          <button className="slider-button next" onClick={handleNextTestimonial} aria-label="Testimoni berikutnya">→</button>
        </div>
      </div>
    </section>

    <section className="section pricing-section" id="pricing">
      <div className="container">
        <h2 className="section-title">Pilih Paket yang Sesuai untukmu</h2>
        <p className="section-subtitle">Semua paket tanpa biaya transaksi. Batalkan kapan saja.</p>
        <div className="pricing-grid">
          <article className="price-card"><h3>Starter</h3><span className="for">Untuk pemula</span><div className="price">Rp0<span>/bulan</span></div><ul className="check-list"><li>Up to 3 Produk</li><li>Link di Bio KAMU</li><li>Akses Analytics Dasar</li><li>Support Komunitas</li></ul><a className="btn btn-outline" href="/register?plan=starter">Mulai Gratis</a></article>
          {isLoadingPackages ? (
             <div style={{ padding: '2rem', textAlign: 'center', gridColumn: 'span 2' }}>Memuat paket...</div>
          ) : (
             packages.map((pkg, idx) => (
                <article key={pkg.id} className={`price-card ${idx === 0 ? 'featured' : ''}`}>
                  {idx === 0 && <span className="popular">Paling Populer</span>}
                  <h3>{pkg.name}</h3>
                  <span className="for">Untuk {idx === 0 ? 'kreator serius' : 'bisnis besar'}</span>
                  <div className="price">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(pkg.price)}
                    <span>/{pkg.billingPeriod === 'MONTHLY' ? 'bulan' : 'tahun'}</span>
                  </div>
                  <ul className="check-list">
                    {pkg.features.map((feature, fIdx) => (
                      <li key={fIdx}>{feature}</li>
                    ))}
                  </ul>
                  <a className="btn btn-primary" href={`/register?plan=${pkg.slug}`}>Mulai Gratis 14 Hari</a>
                </article>
             ))
          )}
          <article className="price-card cta-card"><h3>Siap Menghasilkan Cuan Lebih Banyak?</h3><p>Bergabung dengan ribuan kreator dan bisnis yang sudah sukses bersama kami.</p><a className="btn btn-warm btn-large" href="/register">Mulai Gratis Sekarang</a><div className="secure-note">♢ &nbsp; Tidak perlu kartu kredit</div></article>
        </div>
      </div>
    </section>

    <section className="integrations" id="resources">
      <div className="container"><div className="integrations-title">Terhubung dengan tools favoritmu</div><div className="integration-row">
        <span className="integration"><span className="dot" style={{"background":"linear-gradient(135deg,#7c2cff,#ff416c,#ffb000)"}}><FaInstagram color="white" /></span>Instagram</span><span className="integration"><span className="dot" style={{"background":"#1cc76d"}}><FaWhatsapp color="white" /></span>WhatsApp</span><span className="integration"><span className="dot" style={{"background":"#111"}}><FaTiktok color="white" /></span>TikTok</span><span className="integration"><span className="dot" style={{"background":"#ff1d1d"}}><FaYoutube color="white" /></span>YouTube</span><span className="integration"><span className="dot" style={{"background":"#ff8c2d"}}><FaEnvelope color="white" /></span>Email</span><span className="integration"><span className="dot" style={{"background":"#f6a600"}}><FaChartBar color="white" /></span>Google Analytics</span><span className="integration"><span className="dot" style={{"background":"#24263a"}}><FaMeta color="white" /></span>Meta Ads</span><span className="integration"><span className="dot" style={{"background":"#ff3b21"}}><FaBolt color="white" /></span>Zapier</span><span className="integration"><span className="dot" style={{"background":"#8173ae"}}><FaEllipsisH color="white" /></span>Lainnya</span>
      </div></div>
    </section>
  </main>

  <footer>
    <div className="container">
      <div className="footer-grid">
        <div className="footer-brand"><a className="brand" href="#top"><svg className="brand-mark" viewBox="0 0 64 64"><defs><linearGradient id="kg3" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ff8a00"/><stop offset=".42" stopColor="#f13e8e"/><stop offset="1" stopColor="#5f2cff"/></linearGradient></defs><rect x="8" y="7" width="13" height="50" rx="6.5" fill="url(#kg3)"/><path d="M25 32 47 8c4-4 11-1 11 5v4c0 2-1 4-3 6L42 35l13 8c2 1 3 3 3 5v3c0 6-7 9-12 6L25 44c-5-3-6-9-2-13l2-2v3Z" fill="url(#kg3)"/></svg><span className="brand-word"><strong>KAMU</strong><small>Kelola Aktivitas Monetisasi Usaha</small></span></a><p>Platform all-in-one untuk kreator, pebisnis, dan komunitas untuk menghasilkan cuan lebih mudah.</p><div className="socials"><a href="https://instagram.com/" aria-label="Instagram">IG</a><a href="https://tiktok.com/" aria-label="TikTok">TT</a><a href="https://youtube.com/" aria-label="YouTube">YT</a><a href="https://linkedin.com/" aria-label="LinkedIn">IN</a></div></div>
        <div className="footer-col"><h4>Produk</h4><a href="#features">Fitur</a><a href="#pricing">Harga</a><a href="#testimonials">Contoh Toko</a><a href="#resources">Integrasi</a></div>
        <div className="footer-col"><h4>Resources</h4><a href="/blog">Blog</a><a href="/panduan">Panduan</a><a href="/webinar">Webinar</a><a href="/help">Help Center</a></div>
        <div className="footer-col"><h4>Perusahaan</h4><a href="/tentang">Tentang Kami</a><a href="/karir">Karir</a><a href="/kontak">Kontak</a><h4 style={{"marginTop":"18px"}}>Legal</h4><a href="/syarat-ketentuan">Syarat &amp; Ketentuan</a><a href="/privasi">Privasi</a><a href="/refund">Kebijakan Refund</a></div>
        <div className="newsletter"><h4>Dapatkan Tips &amp; Update</h4><p>Seputar monetisasi untuk kreator.</p><form className="newsletter-form" onSubmit={handleNewsletterSubmit}><label className="sr-only" htmlFor="newsletterEmail" style={{"position":"absolute","left":"-9999px"}}>Email kamu</label><input id="newsletterEmail" type="email" autoComplete="email" placeholder="Email kamu" required /><button type="submit" aria-label="Daftar newsletter">→</button></form></div>
      </div>
      <div className="copyright">© 2026 KAMU di bawah naungan DijaminSuka.com. All rights reserved.</div>
    </div>
  </footer>

  <div className={`modal ${isDemoModalOpen ? "open" : ""}`} onClick={(e) => { if (e.target === e.currentTarget) setIsDemoModalOpen(false); }} role="dialog" aria-modal="true" aria-labelledby="demoTitle" aria-hidden="true">
    <div className="modal-card">
      <div className="modal-head"><h2 id="demoTitle">Demo Singkat KAMU</h2><button className="modal-close" onClick={() => setIsDemoModalOpen(false)} aria-label="Tutup demo">×</button></div>
      <div className="tour"><div className="tour-list">
    {tourData.map((tour, idx) => (
      <button 
        key={idx} 
        className={`tour-item ${activeTourIndex === idx ? 'active' : ''}`} 
        onClick={() => setActiveTourIndex(idx)}
      >
        {idx + 1}. {tour[0].split(',')[0]}
      </button>
    ))}
  </div><div className="tour-preview">
    <h3>{tourData[activeTourIndex][0]}</h3>
    <p>{tourData[activeTourIndex][1]}</p>
  </div></div>
    </div>
  </div>
  <div className={`toast ${toastMessage ? "show" : ""}`}>{toastMessage}</div>

  
    </div>
  );
}
