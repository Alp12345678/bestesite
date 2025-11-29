import React from 'react';
import Image from 'next/image';
import {
  FaMapMarkerAlt,
  FaCheck,
  FaPhone,
  FaWhatsapp,
  FaInstagram,
  FaCalendarAlt,
} from 'react-icons/fa';
import MapsEmbed from '@/components/Genel/MapsEmbed';
import Galeri from '@/components/Genel/Galeri';
import { MekanVerisi } from '@/types';

interface DetayLayoutProps {
  data: MekanVerisi;
  type: 'mekan' | 'dugun' | 'etkinlik';
}

export default function DetayLayout({ data, type }: DetayLayoutProps) {
  // Başlık belirleme (Tip'e göre)
  const getAboutTitle = () => {
    switch (type) {
      case 'mekan':
        return 'Mekan Hakkında';
      case 'dugun':
        return 'Hizmet Hakkında';
      case 'etkinlik':
        return 'Etkinlik Hakkında';
      default:
        return 'Hakkında';
    }
  };

  return (
    <main className="bg-[#F9FAFB] min-h-screen pb-2">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] w-full">
        <Image src={data.resim} alt={data.baslik} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white z-10">
          <div className="container mx-auto">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="bg-[#23C8B9] px-4 py-1.5 rounded-full text-sm font-bold tracking-wider">
                {data.kategori}
              </span>
              {type === 'etkinlik' && data.tarih && (
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">
                  <FaCalendarAlt className="text-white" />
                  <span className="font-bold text-white">{data.tarih}</span>
                </div>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">{data.baslik}</h1>

            {type !== 'dugun' && (
              <div className="flex items-center gap-2 text-white/90 text-lg">
                <FaMapMarkerAlt className="text-[#23C8B9]" />
                <span>{data.ilce}, İzmir</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-6 lg:-mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Kolon: İçerik */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hakkında (Sadece Etkinlik) */}
            {type === 'etkinlik' && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{getAboutTitle()}</h2>
                <div className="prose prose-lg text-gray-600 max-w-none">
                  {data.aciklama ? (
                    <p className="whitespace-pre-line">{data.aciklama}</p>
                  ) : (
                    <p>Bu içerik için henüz detaylı açıklama eklenmemiştir.</p>
                  )}
                </div>
              </div>
            )}

            {/* Galeri */}
            <Galeri resimler={data.galeri || []} baslik={data.baslik} />

            {/* Harita (Düğün hariç) */}
            {type !== 'dugun' && (
              <MapsEmbed
                konum={data.konum}
                baslik={data.baslik}
                adres={data.adres}
                koordinat={data.koordinat}
              />
            )}

            {/* Özellikler */}
            {data.ozellikler && data.ozellikler.length > 0 && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {type === 'etkinlik' ? 'Detaylar' : 'Özellikler'}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {data.ozellikler.map((ozellik, index) => (
                    <div key={index} className="flex items-center gap-3 text-gray-600">
                      <div className="w-8 h-8 rounded-full bg-[#23C8B9]/10 flex items-center justify-center flex-shrink-0">
                        <FaCheck className="text-[#23C8B9] text-sm" />
                      </div>
                      <span className="text-sm font-medium">{ozellik}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sağ Kolon: İletişim & Konum */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">İletişim Bilgileri</h3>

              <div className="space-y-6">
                {type !== 'dugun' && data.adres && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <FaMapMarkerAlt className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-1">Adres</p>
                      <a
                        href={data.konum || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 text-sm leading-relaxed hover:text-[#23C8B9] transition-colors"
                      >
                        {data.adres}
                      </a>
                    </div>
                  </div>
                )}

                {/* Etkinlik Fiyatı */}
                {type === 'etkinlik' && data.fiyat && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-400 font-bold">₺</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-1">Bilet Fiyatı</p>
                      <p className="text-gray-600 text-sm">{data.fiyat} ₺</p>
                    </div>
                  </div>
                )}
              </div>

              {/* İletişim Butonları */}
              {type === 'etkinlik' ? (
                // Etkinlik İçin Tek Buton (Instagram)
                <a
                  href="https://www.instagram.com/izmirde.sen/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-8 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#FD1D1D]/20 flex items-center justify-center gap-2"
                >
                  <FaInstagram className="text-xl" />
                  <span>Instagram'dan Kayıt Ol</span>
                </a>
              ) : (
                // Mekan ve Düğün İçin 3'lü Buton Grubu (Tel, WP, Insta)
                <div className="flex gap-3 mt-8">
                  {/* Sabit Telefon */}
                  <a
                    href="tel:+905052555079"
                    className="flex-1 bg-[#23C8B9] text-white py-4 rounded-xl font-bold hover:bg-[#1fa89b] transition-all duration-300 shadow-lg shadow-[#23C8B9]/20 flex items-center justify-center"
                  >
                    <FaPhone className="text-xl" />
                  </a>

                  {/* Sabit WhatsApp */}
                  <a
                    href="https://wa.me/905052555079"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#25D366] text-white py-4 rounded-xl font-bold hover:bg-[#20bd5a] transition-all duration-300 shadow-lg shadow-[#25D366]/20 flex items-center justify-center"
                  >
                    <FaWhatsapp className="text-2xl" />
                  </a>

                  {/* Dinamik Instagram (Düğün hariç) */}
                  {data.instagram && type !== 'dugun' && (
                    <a
                      href={`https://instagram.com/${data.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gradient-to-tr from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#FD1D1D]/20 flex items-center justify-center"
                    >
                      <FaInstagram className="text-2xl" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
