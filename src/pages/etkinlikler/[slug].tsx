import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MekanVerisi } from '@/types';
import DetayLayout from '@/components/Genel/DetayLayout';

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

  return (
    <>
      <Head>
        <title>{`${etkinlik.baslik} | İzmirde Sen`}</title>
        <meta
          name="description"
          content={
            etkinlik.aciklama ||
            `${etkinlik.baslik} hakkında detaylı bilgiler, bilet fiyatları ve konum.`
          }
        />
      </Head>

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
