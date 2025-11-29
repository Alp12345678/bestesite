import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaInstagram,
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaHeart,
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-gray-800 pt-16 pb-8 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          {/* Marka ve Hakkında (Mobilde Ortalı) - LG: 4 Sütun */}
          <div className="lg:col-span-4 space-y-6 text-center lg:text-left">
            <Link href="/" className="inline-block group">
              <h2 className="text-4xl  font-bold text-[#23C8B9] group-hover:text-emerald-500 transition-colors">
                İzmirde Sen
              </h2>
            </Link>
            <p className="text-gray-500 leading-relaxed">
              İzmir'in en özel mekanlarını, gizli kalmış lezzet duraklarını ve şehrin ritmini
              bizimle keşfedin. Şehri yaşamanın en keyifli yolu.
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <SocialLink href="#" icon={<FaInstagram />} />
              <SocialLink href="#" icon={<FaTwitter />} />
              <SocialLink href="#" icon={<FaFacebookF />} />
              <SocialLink href="#" icon={<FaLinkedinIn />} />
            </div>
          </div>

          {/* Linkler ve Kategoriler (Mobilde Yan Yana) - LG: 5 Sütun */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 sm:gap-8">
            {/* Hızlı Erişim */}
            <div className="text-center lg:text-left">
              <h3 className="text-xl font-bold mb-6 text-gray-900">Hızlı Erişim</h3>
              <ul className="space-y-3">
                <FooterLink href="/" text="Anasayfa" />
                <FooterLink href="#" text="Düğün" />
                <FooterLink href="#" text="Mekanlar" />
                <FooterLink href="#" text="Etkinlikler" />
                <FooterLink href="#" text="Kariyer" />
                <FooterLink href="#" text="İletişim" />
              </ul>
            </div>

            {/* Kategoriler */}
            <div className="text-center lg:text-left">
              <h3 className="text-xl font-bold mb-6 text-gray-900">Kategoriler</h3>
              <ul className="space-y-3">
                <FooterLink href="#" text="Meyhane" />
                <FooterLink href="#" text="Kahvaltı" />
                <FooterLink href="#" text="Yemek" />
                <FooterLink href="#" text="Gece Hayatı" />
                <FooterLink href="#" text="Plaj" />
                <FooterLink href="#" text="Cafe" />
              </ul>
            </div>
          </div>

          {/* İletişim (Mobilde Ortalı) - LG: 3 Sütun */}
          <div className="lg:col-span-3 text-center lg:text-left">
            <h3 className="text-xl font-bold mb-6 text-gray-900">İletişim</h3>
            <ul className="space-y-4">
              <li className="flex items-start justify-center lg:justify-start gap-3 text-gray-500">
                <FaMapMarkerAlt className="text-[#23C8B9] mt-1 flex-shrink-0" />
                <span className="text-center lg:text-left">
                  Alsancak, Kordon Boyu No:123
                  <br />
                  Konak, İzmir
                </span>
              </li>
              <li className="flex items-center justify-center lg:justify-start gap-3 text-gray-500">
                <FaPhone className="text-[#23C8B9] flex-shrink-0" />
                <span>+90 (232) 123 45 67</span>
              </li>
              <li className="flex items-center justify-center lg:justify-start gap-3 text-gray-500">
                <FaEnvelope className="text-[#23C8B9] flex-shrink-0" />
                <span>info@izmirdesen.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Alt Çizgi ve Telif */}
        <div className="border-t border-gray-100 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            &copy; {currentYear} İzmirde Sen. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span>İzmir'de</span>
            <FaHeart className="text-red-500 animate-pulse" />
            <span>ile tasarlandı</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Yardımcı Bileşenler
const SocialLink = ({ href, icon }: { href: string; icon: React.ReactNode }) => (
  <a
    href={href}
    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#23C8B9] hover:text-white transition-all duration-300 shadow-sm"
  >
    {icon}
  </a>
);

const FooterLink = ({ href, text }: { href: string; text: string }) => (
  <li>
    <Link
      href={href}
      className="text-gray-500 hover:text-[#23C8B9] transition-colors duration-300 flex items-center justify-center lg:justify-start gap-2 group"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#23C8B9] opacity-0 group-hover:opacity-100 transition-opacity"></span>
      {text}
    </Link>
  </li>
);

export default Footer;
