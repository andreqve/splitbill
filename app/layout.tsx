import './globals.css';
import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import { Analytics } from "@vercel/analytics/next"

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Split Bill Dong! - Aplikasi Bagi Tagihan, Split Bill, dan Patungan Makan Bareng Teman',
  description: 'Split Bill Dong! adalah aplikasi split bill & bagi tagihan digital untuk patungan bareng teman. Cocok buat makan bareng, liburan, ngopi, kos, arisan, atau acara apapun. Bagi uang & tagihan dengan mudah, adil, dan transparan. Bisa dipakai gratis di Indonesia!',
  keywords: [
    'split bill',
    'aplikasi split bill',
    'bagi tagihan',
    'aplikasi bagi tagihan',
    'aplikasi patungan',
    'patungan online',
    'bagi uang',
    'bagi pembayaran',
    'pembagi uang',
    'aplikasi keuangan',
    'patungan makan',
    'aplikasi makan bareng',
    'pembagian biaya',
    'bagi tagihan digital',
    'aplikasi split bill Indonesia',
    'tools patungan',
    'patungan liburan',
    'aplikasi bagi uang',
    'bagi tagihan teman',
    'pembagian uang arisan',
    'bagi pembayaran bersama',
    'bagi tagihan kos',
    'bagi biaya traveling',
    'bagi tagihan karyawan',
    'aplikasi arisan digital',
    'aplikasi pembagian uang',
    'bagi pengeluaran',
    'aplikasi ngopi bareng',
    'aplikasi keuangan gratis',
    'split bill app',
    'digital split bill',
    'money splitter',
    'group bill splitter'
  ],
  openGraph: {
    title: 'Split Bill Dong! - Aplikasi Bagi Tagihan & Patungan Digital',
    description: 'Aplikasi split bill & tools patungan bareng teman. Bagi tagihan makan, minum, ngopi, liburan, arisan, dan pengeluaran bersama. Praktis, gratis, dan transparan. Solusi bagi uang digital di Indonesia!',
    url: 'https://sb.monsy.app', // Ganti sesuai domain kamu
    siteName: 'Split Bill Dong!',
    images: [
      {
        url: 'https://sb.monsy.app/splitbilldong.png', // Ganti sesuai gambar kamu
        width: 1200,
        height: 630,
        alt: 'Split Bill Dong! - Bagi Tagihan & Patungan Online',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@andreqve',
    title: 'Aplikasi Split Bill - Bagi Tagihan & Patungan: Split Bill Dong!',
    description: 'Tools split bill & bagi tagihan digital buat patungan bareng teman. Bagi uang, pembayaran, atau pengeluaran bareng jadi gampang!',
    images: ['https://sb.monsy.app/splitbilldong.png'], // Ganti sesuai gambar kamu
  },
  metadataBase: new URL('https://sb.monsy.app'), // Ganti sesuai domain kamu
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={dmSans.className}>
      <head>
        {/* Extra meta for SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="author" content="Andre" />
        {/* Favicon (optional) */}
        <link rel="icon" href="/favicon.ico" />
        {/* Canonical */}
        <link rel="canonical" href="https://sb.monsy.app/" />
        {/* Structured data JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: `
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Split Bill Dong!",
            "url": "https://sb.monsy.app",
            "description": "Aplikasi split bill, bagi tagihan, dan patungan digital Indonesia. Solusi mudah dan adil bagi pembayaran bareng teman.",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "All",
            "author": {
              "@type": "Person",
              "name": "Andre"
            }
          }
        `
        }} />
      </head>
      <body>{children}<Analytics /></body>
    </html>
  );
}
