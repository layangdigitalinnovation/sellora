import type { Metadata } from "next";
import { Inter, Montserrat, Open_Sans, Plus_Jakarta_Sans, Lato, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans" });
const jakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kamu - Kelola Aktivitas Monetisasi Usaha",
  description: "Platform Creator Store terbaik untuk menjual karya digital, kelas, dan layanan Anda dengan mudah.",
  keywords: [
    "Creator Store",
    "Jual Produk Digital",
    "Platform Kreator",
    "Jual Kelas Online",
    "Sellora",
    "Kreator Indonesia",
    "Jasa Freelance"
  ],
  authors: [{ name: "Kamu" }],
  openGraph: {
    title: "Kamu - Kelola Aktivitas Monetisasi Usaha",
    description: "Platform Creator Store terbaik untuk menjual karya digital, kelas, dan layanan Anda dengan mudah.",
    siteName: "Kamu",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kamu - Kelola Aktivitas Monetisasi Usaha",
    description: "Platform Creator Store terbaik untuk menjual karya digital, kelas, dan layanan Anda dengan mudah.",
  },
};

import { LanguageProvider } from "@/contexts/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${montserrat.variable} ${openSans.variable} ${jakartaSans.variable} ${lato.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
