import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MekanVerisi } from '@/types';
import DetayLayout from '@/components/Genel/DetayLayout';

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
