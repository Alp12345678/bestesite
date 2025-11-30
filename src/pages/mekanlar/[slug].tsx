import React from 'react';
import { GetServerSideProps } from 'next';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MekanVerisi } from '@/types';
import DetayLayout from '@/components/Genel/DetayLayout';
import { NextSeo } from 'next-seo';

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

  // Description oluştur - 70-155 karakter arası
  const createDescription = () => {
    if (mekan.aciklama && mekan.aciklama.length >= 70) {
      return mekan.aciklama.length > 155
        ? mekan.aciklama.substring(0, 152) + '...'
        : mekan.aciklama;
    }
    return `${mekan.baslik} - İzmir'deki en iyi mekanlardan biri. Detaylı bilgi, fotoğraflar ve yorumlar için tıklayın.`;
  };

  const imageUrl = mekan.kapak || 'https://www.izmirdesen.com/og-image.png';

  return (
    <>
      <NextSeo
        title={`${mekan.baslik} | İzmirde Sen`}
        description={createDescription()}
        canonical={`https://www.izmirdesen.com/mekanlar/${mekan.url}`}
        openGraph={{
          url: `https://www.izmirdesen.com/mekanlar/${mekan.url}`,
          title: `${mekan.baslik} | İzmirde Sen`,
          description: createDescription(),
          images: [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: mekan.baslik,
            },
          ],
          siteName: 'İzmirde Sen',
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
      />

      <DetayLayout data={mekan} type="mekan" />
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
