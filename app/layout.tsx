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
  title: 'Split Bill Dong! - Bagi Tagihan Bareng Temen',
  description:
    'Daripada ribut soal duit, mending pake tools ini aja buat bagi tagihan dengan adil. Gampang banget!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={dmSans.className}>
      <body>{children}</body>
    </html>
  );
}
