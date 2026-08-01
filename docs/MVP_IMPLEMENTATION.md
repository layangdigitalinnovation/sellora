# Creator Commerce Platform — MVP Implementation Guide
> Version 1.0 | Fase 1: Foundation MVP (Bulan 0–3)

---

## OVERVIEW

Platform all-in-one untuk kreator digital Indonesia:
- White-label storefront dengan custom domain
- CRM & data ownership penuh
- Pembayaran lokal (QRIS, VA, e-wallet)
- 0% fee di plan berbayar

---

## TECH STACK FINAL

| Layer | Teknologi | Versi |
|---|---|---|
| **Frontend** | Next.js + TypeScript | 14.x |
| **Styling** | Tailwind CSS | 3.x |
| **Backend** | Next.js API Routes (monorepo) | 14.x |
| **Database** | PostgreSQL + Prisma ORM | 5.x |
| **Auth** | NextAuth.js (magic link + Google) | 4.x |
| **Payment** | Midtrans / Xendit | latest |
| **Storage** | Cloudflare R2 (produk digital) | — |
| **Email** | Resend + React Email | latest |
| **Queue** | BullMQ + Redis (Upstash) | 5.x |
| **Analytics** | PostHog | latest |
| **Monitoring** | Sentry + Uptime Robot | — |
| **Hosting** | Vercel (frontend) + Railway (worker) | — |

---

## ARSITEKTUR SISTEM

```
┌─────────────────────────────────────────────────────────────┐
│                     NEXT.JS APP (Vercel)                     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  /app        │  │  /api        │  │  /[store]        │  │
│  │  (dashboard) │  │  (REST API)  │  │  (storefront)    │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
         │                    │
         ▼                    ▼
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│  PostgreSQL  │     │  Redis (Upstash)  │     │  R2 Storage │
│  (Railway)   │     │  + BullMQ Queue   │     │  (Cloudflare│
└─────────────┘     └──────────────────┘     └─────────────┘
         │                    │
         ▼                    ▼
┌─────────────┐     ┌──────────────────┐
│  Midtrans/   │     │  Worker Process   │
│  Xendit API  │     │  (Railway)        │
└─────────────┘     └──────────────────┘
```

---

## STRUKTUR FOLDER PROJECT

```
creator-platform/
├── apps/
│   └── web/                        # Next.js 14 App
│       ├── app/
│       │   ├── (auth)/             # Login, register, onboarding
│       │   │   ├── login/
│       │   │   ├── register/
│       │   │   └── onboarding/
│       │   ├── (dashboard)/        # Dashboard kreator
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx        # Overview / analytics
│       │   │   ├── products/       # Manajemen produk
│       │   │   ├── orders/         # Daftar pesanan
│       │   │   ├── customers/      # CRM pelanggan
│       │   │   ├── settings/       # Pengaturan toko
│       │   │   └── withdraw/       # Penarikan saldo
│       │   ├── (storefront)/       # Halaman publik kreator
│       │   │   └── [store]/
│       │   │       ├── page.tsx    # Halaman utama toko
│       │   │       └── [product]/  # Halaman produk
│       │   ├── api/
│       │   │   ├── auth/           # NextAuth endpoints
│       │   │   ├── products/       # CRUD produk
│       │   │   ├── orders/         # Manajemen order
│       │   │   ├── payments/       # Webhook Midtrans/Xendit
│       │   │   ├── stores/         # Pengaturan toko
│       │   │   ├── customers/      # CRM API
│       │   │   └── webhooks/       # External webhooks
│       │   ├── layout.tsx
│       │   └── page.tsx            # Landing page
│       ├── components/
│       │   ├── ui/                 # shadcn/ui components
│       │   ├── dashboard/          # Dashboard components
│       │   ├── storefront/         # Storefront components
│       │   └── shared/             # Shared components
│       ├── lib/
│       │   ├── db.ts               # Prisma client
│       │   ├── auth.ts             # NextAuth config
│       │   ├── payment.ts          # Payment gateway utils
│       │   ├── storage.ts          # R2 storage utils
│       │   ├── email.ts            # Resend utils
│       │   └── queue.ts            # BullMQ utils
│       ├── prisma/
│       │   ├── schema.prisma       # Database schema
│       │   └── migrations/
│       ├── public/
│       ├── .env.local
│       └── package.json
└── packages/
    └── email-templates/            # React Email templates
```

---

## DATABASE SCHEMA (Prisma)

### Entitas Utama Fase 1

**User (Kreator)**
- id, email, name, avatar
- plan (STARTER | PRO | BUSINESS | ENTERPRISE)
- balance (saldo tersedia)
- pendingBalance

**Store (Toko Kreator)**
- id, userId
- slug (subdomain unik)
- customDomain
- name, description, logoUrl
- theme, primaryColor, customCss
- isVerified, isActive

**Product**
- id, storeId
- type (DIGITAL_FILE | LINK | BUNDLE)
- title, description, price
- fileUrl, fileSize, mimeType
- isActive, totalSales

**Order**
- id, storeId, productId
- buyerEmail, buyerName, buyerPhone
- amount, status
- paymentGateway, paymentMethod
- paymentRef, externalId
- paidAt, downloadUrl, downloadExpiry

**Customer (CRM)**
- id, storeId
- email, name, phone
- totalSpent, totalOrders
- tags, notes
- lastOrderAt

**Withdrawal**
- id, userId
- amount, fee, netAmount
- bankName, accountNumber, accountHolder
- status, processedAt

---

## IMPLEMENTASI FASE 1 — DETAIL

### 1. Setup Project

```bash
# Install dependencies
npx create-next-app@latest creator-platform --typescript --tailwind --app
cd creator-platform

# Database & ORM
npm install prisma @prisma/client
npx prisma init

# Auth
npm install next-auth @auth/prisma-adapter

# Payment
npm install midtrans-client xendit-node

# Storage
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner

# Email
npm install resend react-email @react-email/components

# Queue
npm install bullmq ioredis

# UI Components (shadcn)
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input card dialog table badge

# Analytics
npm install posthog-js posthog-node

# Monitoring
npm install @sentry/nextjs
```

### 2. Environment Variables

```env
# App
NEXT_PUBLIC_APP_URL=https://platform.co.id
NEXT_PUBLIC_APP_NAME=NamaplatformAnda

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Auth
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://platform.co.id
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Payment - Midtrans
MIDTRANS_SERVER_KEY=SB-Mid-server-...
MIDTRANS_CLIENT_KEY=SB-Mid-client-...
MIDTRANS_IS_PRODUCTION=false

# Payment - Xendit (opsional, bisa pilih salah satu)
XENDIT_SECRET_KEY=xnd_development_...
XENDIT_WEBHOOK_TOKEN=...

# Storage - Cloudflare R2
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=creator-platform-files
R2_PUBLIC_URL=https://files.platform.co.id

# Email
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@platform.co.id

# Queue - Upstash Redis
UPSTASH_REDIS_URL=rediss://...
UPSTASH_REDIS_TOKEN=...

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=https://...
```

---

## FITUR KRITIS FASE 1

### A. Onboarding Flow (< 10 menit)

**Step 1: Register**
- Email + password ATAU Google OAuth
- Magic link tersedia sebagai opsi

**Step 2: Setup Toko**
- Nama toko + slug (subdomain) — auto-check ketersediaan
- Upload logo (opsional)
- Pilih tema warna dasar

**Step 3: Connect Payment**
- Input nomor rekening bank
- Verifikasi KTP (integrasikan dengan Xendit KYC atau manual)
- QRIS otomatis tersedia setelah verifikasi

**Step 4: Upload Produk Pertama**
- Drag & drop file (PDF, ZIP, MP4, dll)
- Input judul, deskripsi, harga
- Template deskripsi tersedia

**Step 5: Share Link**
- Tampilkan URL toko: platform.co.id/[slug]
- Tombol copy + share ke WA/IG/TikTok

### B. Checkout Flow (< 30 detik)

1. Pembeli buka halaman produk
2. Klik "Beli Sekarang"
3. Input nama, email (+ nomor HP opsional)
4. Pilih metode bayar (QRIS / VA / e-wallet / minimarket)
5. Midtrans Snap pop-up — pembayaran selesai
6. Email otomatis ke pembeli (link download)
7. Notifikasi real-time ke kreator (Telegram + email)
8. File tersedia download selama 7 hari (link expire)

### C. Dashboard Overview

- Total revenue (hari ini / bulan ini / total)
- Jumlah order (pending / selesai / refund)
- Produk terlaris
- Grafik revenue 30 hari terakhir
- Daftar order terbaru (real-time)

### D. CRM Dasar

- List semua pembeli dengan total pembelian
- Filter berdasarkan produk yang dibeli
- Export CSV kapanpun (unlimited di plan berbayar)
- Catatan per pelanggan
- Tag manual (VIP, alumni, dll)

### E. Penarikan Saldo

- Flat fee Rp 3.000–5.000 (bukan persentase)
- Payout time < 24 jam (target)
- History penarikan lengkap
- Laporan rekap untuk keperluan pajak

---

## API ENDPOINTS

### Products
```
GET    /api/products              # List produk kreator
POST   /api/products              # Buat produk baru
GET    /api/products/:id          # Detail produk
PUT    /api/products/:id          # Update produk
DELETE /api/products/:id          # Hapus produk
POST   /api/products/:id/upload   # Upload file produk ke R2
```

### Orders
```
GET    /api/orders                # List orders (dengan filter)
GET    /api/orders/:id            # Detail order
POST   /api/orders/:id/refund     # Proses refund
GET    /api/orders/:id/download   # Generate download link
```

### Payments
```
POST   /api/payments/create       # Buat payment intent (Midtrans Snap)
POST   /api/webhooks/midtrans     # Webhook notifikasi Midtrans
POST   /api/webhooks/xendit       # Webhook notifikasi Xendit
```

### Stores
```
GET    /api/stores/me             # Info toko sendiri
PUT    /api/stores/me             # Update pengaturan toko
GET    /api/stores/check-slug     # Cek ketersediaan slug
PUT    /api/stores/domain         # Setup custom domain
```

### Customers (CRM)
```
GET    /api/customers             # List pelanggan
GET    /api/customers/:id         # Detail pelanggan
PUT    /api/customers/:id         # Update catatan/tag
GET    /api/customers/export      # Export CSV
```

### Withdrawals
```
GET    /api/withdrawals           # History penarikan
POST   /api/withdrawals           # Request penarikan
GET    /api/withdrawals/balance   # Cek saldo tersedia
```

---

## PAYMENT INTEGRATION

### Midtrans (Rekomendasi Utama)

```typescript
// lib/payment.ts
import midtransClient from 'midtrans-client';

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

export async function createPaymentToken(order: {
  orderId: string;
  amount: number;
  buyerName: string;
  buyerEmail: string;
  productName: string;
}) {
  const parameter = {
    transaction_details: {
      order_id: order.orderId,
      gross_amount: order.amount,
    },
    customer_details: {
      first_name: order.buyerName,
      email: order.buyerEmail,
    },
    item_details: [{
      id: order.orderId,
      price: order.amount,
      quantity: 1,
      name: order.productName,
    }],
    enabled_payments: [
      'credit_card', 'bca_va', 'bni_va', 'bri_va',
      'mandiri_bill', 'gopay', 'shopeepay', 'qris',
      'indomaret', 'alfamart',
    ],
  };

  const transaction = await snap.createTransaction(parameter);
  return transaction.token;
}
```

### Webhook Handler

```typescript
// app/api/webhooks/midtrans/route.ts
export async function POST(req: Request) {
  const body = await req.json();
  
  // Verifikasi signature dari Midtrans
  const serverKey = process.env.MIDTRANS_SERVER_KEY!;
  const signatureKey = createHash('sha512')
    .update(`${body.order_id}${body.status_code}${body.gross_amount}${serverKey}`)
    .digest('hex');
  
  if (signatureKey !== body.signature_key) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 });
  }

  if (body.transaction_status === 'settlement' || 
      body.transaction_status === 'capture') {
    // Update order status ke PAID
    await db.order.update({
      where: { id: body.order_id },
      data: { 
        status: 'PAID',
        paidAt: new Date(),
        paymentMethod: body.payment_type,
      }
    });
    
    // Queue email ke pembeli + notifikasi ke kreator
    await emailQueue.add('order-confirmation', { orderId: body.order_id });
    await notifyQueue.add('creator-sale', { orderId: body.order_id });
    
    // Update balance kreator
    await updateCreatorBalance(body.order_id);
  }
  
  return Response.json({ status: 'ok' });
}
```

---

## FILE STORAGE (Cloudflare R2)

```typescript
// lib/storage.ts
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

// Upload file produk
export async function uploadProductFile(
  file: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {
  const key = `products/${randomUUID()}/${fileName}`;
  
  await r2.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: mimeType,
  }));
  
  return key;
}

// Generate download link sementara (expire 7 hari)
export async function generateDownloadUrl(
  fileKey: string,
  expirySeconds = 604800 // 7 hari
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileKey,
  });
  
  return getSignedUrl(r2, command, { expiresIn: expirySeconds });
}
```

---

## EMAIL SYSTEM (Resend + React Email)

### Template: Order Confirmation ke Pembeli

```tsx
// packages/email-templates/OrderConfirmation.tsx
import { Button, Html, Text, Heading, Container } from '@react-email/components';

interface OrderConfirmationProps {
  buyerName: string;
  productName: string;
  storeName: string;
  downloadUrl: string;
  amount: number;
}

export function OrderConfirmation({
  buyerName, productName, storeName, downloadUrl, amount
}: OrderConfirmationProps) {
  return (
    <Html>
      <Container>
        <Heading>Pembelian Berhasil! 🎉</Heading>
        <Text>Halo {buyerName},</Text>
        <Text>
          Terima kasih telah membeli <strong>{productName}</strong> 
          dari {storeName}. Pembayaran sebesar{' '}
          <strong>Rp{amount.toLocaleString('id-ID')}</strong> telah dikonfirmasi.
        </Text>
        <Button href={downloadUrl}>
          Download Produk Sekarang
        </Button>
        <Text style={{ fontSize: '12px', color: '#666' }}>
          Link download berlaku 7 hari. Jika ada masalah, 
          hubungi kreator langsung.
        </Text>
      </Container>
    </Html>
  );
}
```

---

## STOREFRONT — MULTI-TENANT

### Routing Strategy

```
platform.co.id/[slug]          → Toko kreator (subdomain via path)
kreator.co.id                  → Custom domain (via middleware)
```

### Middleware untuk Custom Domain

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const hostname = req.headers.get('host') || '';
  const mainDomain = process.env.NEXT_PUBLIC_APP_URL?.replace('https://', '') || '';
  
  // Jika custom domain (bukan main domain)
  if (hostname !== mainDomain && hostname !== `www.${mainDomain}`) {
    // Lookup store by custom domain
    const url = req.nextUrl.clone();
    url.pathname = `/api/resolve-domain${url.pathname}`;
    
    // Rewrite ke storefront dengan slug yang sesuai
    return NextResponse.rewrite(
      new URL(`/store-host/${hostname}${req.nextUrl.pathname}`, req.url)
    );
  }
  
  return NextResponse.next();
}
```

---

## BACKGROUND JOBS (BullMQ)

```typescript
// lib/queue.ts
import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis(process.env.UPSTASH_REDIS_URL!);

// Email Queue
export const emailQueue = new Queue('emails', { connection });
export const notifyQueue = new Queue('notifications', { connection });
export const withdrawQueue = new Queue('withdrawals', { connection });

// Workers (Railway Worker Dyno)
const emailWorker = new Worker('emails', async (job) => {
  if (job.name === 'order-confirmation') {
    await sendOrderConfirmationEmail(job.data.orderId);
  }
}, { connection });

const notifyWorker = new Worker('notifications', async (job) => {
  if (job.name === 'creator-sale') {
    await sendCreatorTelegramNotification(job.data.orderId);
    await sendCreatorEmailNotification(job.data.orderId);
  }
}, { connection });
```

---

## DEPLOYMENT CHECKLIST

### Vercel (Frontend + API Routes)
- [ ] Connect GitHub repository
- [ ] Set semua environment variables
- [ ] Setup custom domain + wildcard subdomain (*.platform.co.id)
- [ ] Enable Vercel Analytics
- [ ] Setup Sentry integration

### Railway (Worker + Database)
- [ ] Deploy PostgreSQL database
- [ ] Deploy Redis instance
- [ ] Deploy worker process (npm run worker)
- [ ] Set resource limits sesuai traffic

### Cloudflare (Storage + DNS)
- [ ] Setup R2 bucket
- [ ] Configure public access untuk download files
- [ ] Setup CNAME untuk custom domains kreator
- [ ] Enable WAF rules

### Midtrans
- [ ] Daftar akun merchant
- [ ] Verifikasi bisnis
- [ ] Setup webhook URL
- [ ] Test di sandbox dulu

---

## KPI MONITORING (Fase 1)

| Metric | Target | Tool |
|---|---|---|
| Register → produk live | < 10 menit | PostHog funnel |
| Register → transaksi | < 48 jam | PostHog |
| Checkout time | < 30 detik | PostHog |
| Platform uptime | > 99.5% | Uptime Robot |
| Payout time | < 24 jam | Internal dashboard |
| Kreator aktif (bulan 3) | 50+ | Internal |
| NPS kreator | > 50 | Typeform |

---

## ROADMAP FASE 2 (Bulan 4–7)

Setelah Fase 1 stabil dan ada 50+ kreator aktif:

1. **Kursus Berjenjang** — video course, drip content, progress tracking
2. **Sertifikat Otomatis** — PDF branded per kreator
3. **Quiz Interaktif** — untuk kursus berjenjang
4. **Email Automation** — sequence, broadcast, segmentasi
5. **Sistem Afiliasi** — link unik, dashboard komisi
6. **SEO Optimization** — meta tag, sitemap, Open Graph
7. **Tema Lanjutan** — custom CSS editor, 20+ tema

---

## ESTIMASI BIAYA OPERASIONAL (Fase 1)

| Layanan | Biaya/Bulan |
|---|---|
| Vercel Pro | $20 |
| Railway (DB + Worker) | $25–50 |
| Cloudflare R2 (10GB) | ~$2 |
| Upstash Redis | $10 |
| Resend (10k email) | $20 |
| Sentry | Gratis (free tier) |
| Uptime Robot | Gratis |
| **Total** | **~$80–105/bulan** |

> Biaya ini sangat terjangkau untuk startup tahap awal. Scale bisa dilakukan bertahap sesuai traffic.

---

*Dokumen ini adalah living document — update setiap sprint.*
