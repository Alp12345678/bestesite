'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaSearch, FaBars } from 'react-icons/fa';

// İkonlar
import HomeIcon from '@/icons/home.svg';
import DugunIcon from '@/icons/dugun.svg';
import MekanIcon from '@/icons/mekanlar.svg';
import EtkinlikIcon from '@/icons/etkinlik.svg';
import IletisimIcon from '@/icons/iletisim.svg';
import MeyhaneIcon from '@/icons/meyhane.svg';
import KahvaltiIcon from '@/icons/kahvalti.svg';
import RestoranIcon from '@/icons/restorant.svg';
import GeceIcon from '@/icons/gece.svg';
import PlajIcon from '@/icons/plaj.svg';
import CafeIcon from '@/icons/kafe.svg';

// --- TİPLER ---
type MenuItem = {
  label: string;
  icon: React.ReactNode;
  href: string;
};

// --- VERİ ---
const menuItems: MenuItem[] = [
  { href: '/', label: 'Anasayfa', icon: <HomeIcon className="w-6 h-6" /> },
  { href: '/dugunler', label: 'Düğün', icon: <DugunIcon className="w-6 h-6" /> },
  { href: '/mekanlar', label: 'Mekanlar', icon: <MekanIcon className="w-6 h-6" /> },
  {
    href: '/mekanlar?kategori=meyhane',
    label: 'Meyhane',
    icon: <MeyhaneIcon className="w-6 h-6" />,
  },
  {
    href: '/mekanlar?kategori=kahvalti',
    label: 'Kahvaltı',
    icon: <KahvaltiIcon className="w-6 h-6" />,
  },
  { href: '/mekanlar?kategori=yemek', label: 'Yemek', icon: <RestoranIcon className="w-6 h-6" /> },
  { href: '/mekanlar?kategori=gece-hayati', label: 'Gece', icon: <GeceIcon className="w-6 h-6" /> },
  { href: '/mekanlar?kategori=plaj', label: 'Plaj', icon: <PlajIcon className="w-6 h-6" /> },
  { href: '/mekanlar?kategori=cafe', label: 'Cafe', icon: <CafeIcon className="w-6 h-6" /> },
  { href: '/etkinlikler', label: 'Etkinlik', icon: <EtkinlikIcon className="w-6 h-6" /> },
  { href: '/iletisim', label: 'İletişim', icon: <IletisimIcon className="w-6 h-6" /> },
];

// --- ALT BİLEŞENLER ---

const Background = () => (
  <div className="absolute inset-0 z-0">
    <Image
      src="/carousel/1.webp"
      alt="İzmir Manzarası"
      fill
      priority
      className="object-cover animate-subtle-zoom"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
  </div>
);

const LogoSection = () => (
  <div className="flex justify-center py-4 md:py-6 flex-shrink-0">
    <Link href="/" className="hover:opacity-90 transition-opacity">
      <Image
        src="/logo.svg"
        alt="İzmirde Sen Logo"
        width={120}
        height={60}
        priority
        className="drop-shadow-lg w-[120px] md:w-[140px]"
      />
    </Link>
  </div>
);

const HeroSection = ({
  query,
  setQuery,
  handleSearch,
  handleKeyDown,
}: {
  query: string;
  setQuery: (q: string) => void;
  handleSearch: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}) => (
  <div className="flex-grow flex flex-col items-center justify-center px-4 text-center -mt-4 md:mt-0">
    <div className="mb-6 md:mb-10 animate-fade-in-up">
      <h1 className="text-white  text-4xl md:text-7xl font-bold tracking-tight drop-shadow-xl">
        <span className="font-normal block text-[#23C8B9] mb-1 md:mb-2 text-5xl md:text-8xl">
          İzmir’in
        </span>
        En Seçkin Mekanları
      </h1>
      <p className="mt-2 md:mt-4 text-gray-200 text-sm md:text-2xl font-light max-w-2xl mx-auto drop-shadow-md">
        Lezzet, eğlence ve keyif dolu anlar için şehrin en iyilerini keşfedin.
      </p>
    </div>

    <div className="w-full max-w-2xl animate-fade-in-up delay-100">
      <div className="relative group">
        <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-full shadow-2xl border border-white/30 transition-all duration-300 group-hover:bg-white/30" />
        <div className="relative flex items-center p-1.5 md:p-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Mekan, etkinlik veya kategori ara..."
            className="w-full bg-transparent text-white placeholder-gray-200 px-4 md:px-6 py-2 md:py-3 text-sm md:text-lg focus:outline-none font-light caret-[#23C8B9]"
          />
          <button
            onClick={handleSearch}
            className="bg-[#23C8B9] hover:bg-[#1fa89b] text-white p-2.5 md:p-4 rounded-full transition-colors shadow-lg flex-shrink-0"
            aria-label="Ara"
          >
            <FaSearch className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

const MenuSection = () => (
  <div className="flex-shrink-0 w-full pb-4 pt-2 md:pb-8 md:pt-12 bg-gradient-to-t from-black/90 to-transparent">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-4 md:flex md:justify-center gap-y-2 gap-x-1 md:gap-12">
        {menuItems.map((item, index) => (
          <Link key={index} href={item.href}>
            <div className="flex flex-col items-center gap-1 group cursor-pointer">
              <div className="p-2 md:p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 group-hover:bg-[#23C8B9] group-hover:border-[#23C8B9] transition-all duration-300 shadow-lg group-hover:scale-105">
                <div className="text-white group-hover:text-white transition-colors">
                  {item.icon}
                </div>
              </div>
              <span className="text-[10px] md:text-sm text-gray-300 font-medium tracking-wide group-hover:text-white transition-colors whitespace-nowrap">
                {item.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </div>
);

// --- ANA BİLEŞEN ---

// --- ANA BİLEŞEN ---

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Scroll dinleyicisi
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setScrolled(true);
      } else {
        setScrolled(false);
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/arama?query=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <>
      {/* 1. ORİJİNAL HERO NAVBAR (Sayfa başındayken görünen) */}
      <div className="relative w-full min-h-screen font-sans">
        <Background />

        <div className="relative z-10 flex flex-col min-h-screen w-full">
          <LogoSection />
          <HeroSection
            query={query}
            setQuery={setQuery}
            handleSearch={handleSearch}
            handleKeyDown={handleKeyDown}
          />
          <MenuSection />
        </div>
      </div>

      {/* 2. COMPACT STICKY NAVBAR (Scroll yapınca gelen) */}
      <div
        className={`fixed top-0 left-0 w-full z-[999] bg-white/95 backdrop-blur-md shadow-lg transition-transform duration-500 transform ${
          scrolled ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Logo (Sol) */}
            <Link href="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
              <Image
                src="/logo.svg"
                alt="İzmirde Sen"
                width={120}
                height={45}
                className="w-auto h-8 md:h-10"
              />
            </Link>

            {/* Masaüstü Menü (Orta) */}
            <div className="hidden xl:flex items-center justify-center flex-grow gap-1 mx-4">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="group flex flex-col items-center justify-center hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-all min-w-[70px]"
                >
                  <div className="text-gray-400 group-hover:text-[#23C8B9] transition-colors mb-0.5">
                    <div className="w-5 h-5">{item.icon}</div>
                  </div>
                  <span className="text-[11px] font-bold text-gray-600 group-hover:text-[#23C8B9] whitespace-nowrap">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* Mobil Hamburger Butonu (Sağ) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-gray-600 hover:text-[#23C8B9] transition-colors"
            >
              <FaBars className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. FULL SCREEN MOBİL MENÜ (Navbar'dan bağımsız, fixed) */}
      <div
        className={`xl:hidden fixed inset-0 z-[998] bg-white transition-all duration-300 pt-[70px] ${
          mobileMenuOpen && scrolled
            ? 'opacity-100 visible'
            : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="h-full overflow-y-auto pb-20">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-2 gap-3">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 border border-gray-100 active:scale-95 transition-all duration-200"
                >
                  <div className="text-[#23C8B9] mb-2">
                    <div className="w-6 h-6">{item.icon}</div>
                  </div>
                  <span className="text-sm font-bold text-gray-700 text-center">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
