import React from 'react';
import { GetServerSideProps } from 'next';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MekanVerisi } from '@/types';
import DetayLayout from '@/components/Genel/DetayLayout';
import { NextSeo } from 'next-seo';

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

  // Description oluştur - 70-155 karakter arası
  const createDescription = () => {
    if (hizmet.aciklama && hizmet.aciklama.length >= 70) {
      return hizmet.aciklama.length > 155
        ? hizmet.aciklama.substring(0, 152) + '...'
        : hizmet.aciklama;
    }
    return `${hizmet.baslik} - İzmir'de düğün organizasyonu için profesyonel hizmetler. Detaylar için tıklayın.`;
  };

  const imageUrl = hizmet.kapak || 'https://www.izmirdesen.com/og-image.png';

  return (
    <>
      <NextSeo
        title={`${hizmet.baslik} | İzmirde Sen`}
        description={createDescription()}
        canonical={`https://www.izmirdesen.com/dugunler/${hizmet.url}`}
        openGraph={{
          url: `https://www.izmirdesen.com/dugunler/${hizmet.url}`,
          title: `${hizmet.baslik} | İzmirde Sen`,
          description: createDescription(),
          images: [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: hizmet.baslik,
            },
          ],
          siteName: 'İzmirde Sen',
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
      />

      <DetayLayout data={hizmet} type="dugun" />
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
