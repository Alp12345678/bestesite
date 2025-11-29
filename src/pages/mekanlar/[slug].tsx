import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { GetServerSideProps } from 'next';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MekanVerisi } from '@/types';

import {
  FaMapMarkerAlt,
  FaComment,
  FaCheck,
  FaClock,
  FaPhone,
  FaWhatsapp,
  FaInstagram,
} from 'react-icons/fa';
import MapsEmbed from '@/components/Genel/MapsEmbed';

interface MekanDetayProps {
  mekan: MekanVerisi | null;
}

export default function MekanDetay({ mekan }: MekanDetayProps) {
  if (!mekan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Mekan Bulunamadı</h1>
          <p className="text-gray-600">
            Aradığınız mekan bulunamadı veya yayından kaldırılmış olabilir.
          </p>
          <a
            href="/mekanlar"
            className="mt-6 inline-block bg-[#23C8B9] text-white px-6 py-3 rounded-full font-medium hover:bg-[#1fa89b] transition-colors"
          >
            Mekanlara Dön
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`${mekan.baslik} | İzmirde Sen`}</title>
        <meta
          name="description"
          content={
            mekan.aciklama || `${mekan.baslik} hakkında detaylı bilgiler, yorumlar ve fotoğraflar.`
          }
        />
      </Head>

      {/* Navbar zaten _app.tsx'te var ama layout yapısına göre burada da olabilir veya _app.tsx yönetir. 
          _app.tsx'te Navbar var, o yüzden buraya eklemeye gerek yok. */}

      <main className="bg-[#F9FAFB] min-h-screen pb-20">
        {/* Hero Section */}
        <div className="relative h-[50vh] min-h-[400px] w-full">
          <Image src={mekan.resim} alt={mekan.baslik} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white z-10">
            <div className="container mx-auto">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="bg-[#23C8B9] px-4 py-1.5 rounded-full text-sm font-bold  tracking-wider">
                  {mekan.kategori}
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">{mekan.baslik}</h1>

              <div className="flex items-center gap-2 text-white/90 text-lg">
                <FaMapMarkerAlt className="text-[#23C8B9]" />
                <span>{mekan.ilce}, İzmir</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-10 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sol Kolon: İçerik */}
            <div className="lg:col-span-2 space-y-8">
              {/* Harita / Konum */}
              <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100 overflow-hidden">
                <MapsEmbed
                  konum={mekan.konum}
                  baslik={mekan.baslik}
                  adres={mekan.adres}
                  koordinat={mekan.koordinat}
                />
              </div>

              {/* Galeri */}
              {mekan.galeri && mekan.galeri.length > 0 && (
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Galeri</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {mekan.galeri.map((img, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                      >
                        <Image
                          src={img}
                          alt={`${mekan.baslik} galeri ${index + 1}`}
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
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6">İletişim Bilgileri</h3>

                <div className="space-y-6">
                  {mekan.adres && (
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                        <FaMapMarkerAlt className="text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 mb-1">Adres</p>
                        <a
                          href={mekan.konum || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 text-sm leading-relaxed hover:text-[#23C8B9] transition-colors"
                        >
                          {mekan.adres}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

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

                  {/* Dinamik Instagram */}
                  {mekan.instagram && (
                    <a
                      href={`https://instagram.com/${mekan.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gradient-to-tr from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#FD1D1D]/20 flex items-center justify-center"
                    >
                      <FaInstagram className="text-2xl" />
                    </a>
                  )}
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
    const q = query(collection(db, 'mekanlar'), where('url', '==', slug), limit(1));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {
        notFound: true,
      };
    }

    const doc = querySnapshot.docs[0];
    const mekan = { id: doc.id, ...doc.data() } as MekanVerisi;

    // Serializable hale getirme (Firestore timestamp vb. varsa)
    const serializedMekan = JSON.parse(JSON.stringify(mekan));

    return {
      props: {
        mekan: serializedMekan,
      },
    };
  } catch (error) {
    console.error('Mekan detay çekme hatası:', error);
    return {
      notFound: true,
    };
  }
};
