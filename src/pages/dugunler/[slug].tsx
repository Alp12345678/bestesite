import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { GetServerSideProps } from 'next';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MekanVerisi } from '@/types';

import { FaMapMarkerAlt, FaCheck, FaPhone, FaWhatsapp } from 'react-icons/fa';

interface DugunDetayProps {
  hizmet: MekanVerisi | null;
}

export default function DugunDetay({ hizmet }: DugunDetayProps) {
  if (!hizmet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Hizmet Bulunamadı</h1>
          <p className="text-gray-600">
            Aradığınız hizmet bulunamadı veya yayından kaldırılmış olabilir.
          </p>
          <a
            href="/dugunler"
            className="mt-6 inline-block bg-[#23C8B9] text-white px-6 py-3 rounded-full font-medium hover:bg-[#1fa89b] transition-colors"
          >
            Düğün Hizmetlerine Dön
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`${hizmet.baslik} | İzmirde Sen`}</title>
        <meta
          name="description"
          content={
            hizmet.aciklama ||
            `${hizmet.baslik} hakkında detaylı bilgiler, yorumlar ve fotoğraflar.`
          }
        />
      </Head>

      <main className="bg-[#F9FAFB] min-h-screen pb-20">
        {/* Hero Section */}
        <div className="relative h-[50vh] min-h-[400px] w-full">
          <Image src={hizmet.resim} alt={hizmet.baslik} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white z-10">
            <div className="container mx-auto">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="bg-[#23C8B9] px-4 py-1.5 rounded-full text-sm font-bold  tracking-wider">
                  {hizmet.kategori}
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">{hizmet.baslik}</h1>

              <div className="flex items-center gap-2 text-white/90 text-lg">
                <FaMapMarkerAlt className="text-[#23C8B9]" />
                <span>{hizmet.ilce}, İzmir</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-10 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sol Kolon: İçerik */}
            <div className="lg:col-span-2 space-y-8">
              {/* Galeri - Hakkında yerine buraya alındı */}
              {hizmet.galeri && hizmet.galeri.length > 0 ? (
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Galeri</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hizmet.galeri.map((img, index) => (
                      <div
                        key={index}
                        className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer"
                      >
                        <Image
                          src={img}
                          alt={`${hizmet.baslik} galeri ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center text-gray-500">
                  Görsel bulunmuyor.
                </div>
              )}

              {/* Özellikler */}
              {hizmet.ozellikler && hizmet.ozellikler.length > 0 && (
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Özellikler</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {hizmet.ozellikler.map((ozellik, index) => (
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
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100  top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6">İletişim Bilgileri</h3>

                <div className="flex gap-3 mt-8">
                  {/* Sabit Telefon */}
                  <a
                    href="tel:905555555555"
                    className="flex-1 bg-[#23C8B9] text-white py-4 rounded-xl font-bold hover:bg-[#1fa89b] transition-all duration-300 shadow-lg shadow-[#23C8B9]/20 flex items-center justify-center"
                  >
                    <FaPhone className="text-xl" />
                  </a>

                  {/* Sabit WhatsApp */}
                  <a
                    href="https://wa.me/905555555555"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#25D366] text-white py-4 rounded-xl font-bold hover:bg-[#20bd5a] transition-all duration-300 shadow-lg shadow-[#25D366]/20 flex items-center justify-center"
                  >
                    <FaWhatsapp className="text-2xl" />
                  </a>
                </div>
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
    const q = query(collection(db, 'dugunler'), where('url', '==', slug), limit(1));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {
        notFound: true,
      };
    }

    const doc = querySnapshot.docs[0];
    const hizmet = { id: doc.id, ...doc.data() } as MekanVerisi;
    const serializedHizmet = JSON.parse(JSON.stringify(hizmet));

    return {
      props: {
        hizmet: serializedHizmet,
      },
    };
  } catch (error) {
    console.error('Düğün hizmeti detay çekme hatası:', error);
    return {
      notFound: true,
    };
  }
};
