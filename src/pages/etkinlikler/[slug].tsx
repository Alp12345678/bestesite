import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { GetServerSideProps } from 'next';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MekanVerisi } from '@/types';

import { FaMapMarkerAlt, FaCalendarAlt, FaCheck, FaTicketAlt, FaInstagram } from 'react-icons/fa';

interface EtkinlikDetayProps {
  etkinlik: MekanVerisi | null;
}

export default function EtkinlikDetay({ etkinlik }: EtkinlikDetayProps) {
  if (!etkinlik) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Etkinlik Bulunamadı</h1>
          <p className="text-gray-600">
            Aradığınız etkinlik bulunamadı veya süresi dolmuş olabilir.
          </p>
          <a
            href="/etkinlikler"
            className="mt-6 inline-block bg-[#23C8B9] text-white px-6 py-3 rounded-full font-medium hover:bg-[#1fa89b] transition-colors"
          >
            Etkinliklere Dön
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`${etkinlik.baslik} | İzmirde Sen`}</title>
        <meta
          name="description"
          content={
            etkinlik.aciklama || `${etkinlik.baslik} hakkında detaylı bilgiler, tarih ve biletler.`
          }
        />
      </Head>

      <main className="bg-[#F9FAFB] min-h-screen pb-20">
        {/* Hero Section */}
        <div className="relative h-[50vh] min-h-[400px] w-full">
          <Image
            src={etkinlik.resim}
            alt={etkinlik.baslik}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white z-10">
            <div className="container mx-auto">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="bg-[#23C8B9] px-4 py-1.5 rounded-full text-sm font-bold  tracking-wider">
                  {etkinlik.kategori}
                </span>
                {etkinlik.tarih && (
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">
                    <FaCalendarAlt className="text-white" />
                    <span className="font-bold text-white">{etkinlik.tarih}</span>
                  </div>
                )}
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                {etkinlik.baslik}
              </h1>

              <div className="flex items-center gap-2 text-white/90 text-lg">
                <FaMapMarkerAlt className="text-[#23C8B9]" />
                <span>{etkinlik.ilce}, İzmir</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-10 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sol Kolon: İçerik */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hakkında */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Etkinlik Hakkında</h2>
                <div className="prose prose-lg text-gray-600 max-w-none">
                  {etkinlik.aciklama ? (
                    <p className="whitespace-pre-line">{etkinlik.aciklama}</p>
                  ) : (
                    <p>Bu etkinlik için henüz detaylı açıklama eklenmemiştir.</p>
                  )}
                </div>

                {/* Özellikler */}
                {etkinlik.ozellikler && etkinlik.ozellikler.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Detaylar</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {etkinlik.ozellikler.map((ozellik, index) => (
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

              {/* Galeri */}
              {etkinlik.galeri && etkinlik.galeri.length > 0 && (
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Galeri</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {etkinlik.galeri.map((img, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                      >
                        <Image
                          src={img}
                          alt={`${etkinlik.baslik} galeri ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sağ Kolon: İletişim & Konum */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100  top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Bilet & Konum</h3>

                <div className="space-y-6">
                  {etkinlik.adres && (
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                        <FaMapMarkerAlt className="text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 mb-1">Adres</p>
                        <p className="text-gray-600 text-sm leading-relaxed">{etkinlik.adres}</p>
                      </div>
                    </div>
                  )}

                  {etkinlik.fiyat && (
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-400 font-bold">₺</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 mb-1">Bilet Fiyatı</p>
                        <p className="text-gray-600 text-sm">{etkinlik.fiyat}</p>
                      </div>
                    </div>
                  )}
                </div>

                <a
                  href="https://www.instagram.com/izmirde.sen/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-8 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#FD1D1D]/20 flex items-center justify-center gap-2"
                >
                  <FaInstagram className="text-xl" />
                  <span>Instagram'dan Kayıt Ol</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };

  try {
    const q = query(collection(db, 'etkinlikler'), where('url', '==', slug), limit(1));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {
        notFound: true,
      };
    }

    const doc = querySnapshot.docs[0];
    const etkinlik = { id: doc.id, ...doc.data() } as MekanVerisi;
    const serializedEtkinlik = JSON.parse(JSON.stringify(etkinlik));

    return {
      props: {
        etkinlik: serializedEtkinlik,
      },
    };
  } catch (error) {
    console.error('Etkinlik detay çekme hatası:', error);
    return {
      notFound: true,
    };
  }
};
