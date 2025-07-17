// File: app/page.jsx (Updated)
import { BillProvider } from '@/context/BillContext';
import BillSplitter from '@/components/BillSplitter';

// Komponen statis untuk header dan footer bisa tetap di sini atau dipisah
function Header() {
  return (
    <header className="mb-12 mt-3 relative z-10 flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-4xl spin-slow inline-block">🍩</span>
        <span className="text-4xl spin-reverse inline-block">🥤</span>
        <span className="text-4xl spin-slow inline-block">🍗</span>
        <span className="text-4xl spin-super-slow inline-block">🍕</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 drop-shadow text-center mt-2">
        Split Bill Dong!
      </h1>
      <div className="mt-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-medium shadow-sm flex items-center gap-2 text-base md:text-lg border border-emerald-100">
        <span>Makan bareng, bayar bareng 🤝</span>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-16 text-center text-xs md:text-sm text-gray-400 relative z-10 flex flex-col items-center gap-2">
      <div className="flex items-center justify-center gap-1">
        <span className="text-lg">🍬</span>
        <span className="text-lg">🍩</span>
        <span className="text-lg">🍰</span>
        <span className="text-lg">🍕</span>
      </div>
      <p>
        Built with ☕ by{' '}
        <a href="https://x.com/andreqve" className="text-emerald-500 hover:underline">
          @andreqve
        </a>{' '}
        | Mau atur uang? cek{' '}
        <a href="https://www.monsy.app" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
          monsy.app
        </a>
      </p>
    </footer>
  );
}

// Halaman utama sekarang menjadi Server Component
export default function Home() {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 font-[DM Sans,sans-serif]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Background elemen bisa tetap di sini */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[12%] left-[8%] opacity-20 blur-sm select-none text-7xl">🍩</div>
        <div className="absolute top-[65%] left-[85%] opacity-20 blur-sm select-none text-8xl">🍕</div>
        <div className="absolute top-[30%] left-[60%] opacity-15 blur-sm select-none text-8xl">🥤</div>
        <div className="absolute top-[70%] left-[12%] opacity-20 blur-sm select-none text-7xl">☕</div>
      </div>
      
      <div className="container mx-auto px-4 py-8 max-w-3xl md:max-w-4xl relative z-10">
        <Header />
        
        {/* Bungkus hanya bagian interaktif dengan Provider */}
        <BillProvider>
          <BillSplitter />
        </BillProvider>

        <Footer />
      </div>
    </div>
  );
}