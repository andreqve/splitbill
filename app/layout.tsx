import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Split Bill Dong! - Bagi Tagihan Bareng Temen',
  description: 'Daripada ribut soal duit, mending pake tools ini aja buat bagi tagihan dengan adil. Gampang banget!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  );
}