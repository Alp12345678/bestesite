import React from 'react';
import { GetServerSideProps } from 'next';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MekanVerisi } from '@/types';
import DetayLayout from '@/components/Genel/DetayLayout';
import { NextSeo } from 'next-seo';

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
            Aradığınız etkinlik bulunamadı veya yayından kaldırılmış olabilir.
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

  // Description oluştur - 70-155 karakter arası
  const createDescription = () => {
    if (etkinlik.aciklama && etkinlik.aciklama.length >= 70) {
      return etkinlik.aciklama.length > 155
        ? etkinlik.aciklama.substring(0, 152) + '...'
        : etkinlik.aciklama;
    }
    return `${etkinlik.baslik} - İzmir'deki güncel etkinlikler. Tarih, yer ve detaylı bilgi için tıklayın.`;
  };

  const imageUrl = etkinlik.kapak || 'https://www.izmirdesen.com/og-image.png';

  return (
    <>
      <NextSeo
        title={`${etkinlik.baslik} | İzmirde Sen`}
        description={createDescription()}
        canonical={`https://www.izmirdesen.com/etkinlikler/${etkinlik.url}`}
        openGraph={{
          url: `https://www.izmirdesen.com/etkinlikler/${etkinlik.url}`,
          title: `${etkinlik.baslik} | İzmirde Sen`,
          description: createDescription(),
          images: [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: etkinlik.baslik,
            },
          ],
          siteName: 'İzmirde Sen',
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
      />

      <DetayLayout data={etkinlik} type="etkinlik" />
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
