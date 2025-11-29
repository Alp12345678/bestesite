import React, { useState, useEffect } from 'react';
import MekanKarti from '@/bilesenler/MekanKarti';
import { MekanVerisi } from '@/types';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

// --- ANA BİLEŞEN ---

const Populer = () => {
  const [populerMekanlar, setPopulerMekanlar] = useState<MekanVerisi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopulerMekanlar = async () => {
      try {
        // Mekanlar koleksiyonundan popüler olanları çek
        // Not: Şimdilik sadece 'mekanlar' koleksiyonuna bakıyoruz.
        // İleride düğün ve etkinliklerden de karma yapılabilir.
        const q = query(
          collection(db, 'mekanlar'),
          where('populer', '==', true),
          limit(8) // En fazla 8 tane göster
        );

        const querySnapshot = await getDocs(q);
        const data: MekanVerisi[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as MekanVerisi);
        });

        setPopulerMekanlar(data);
      } catch (error) {
        console.error('Popüler mekanlar çekilirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopulerMekanlar();
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#23C8B9] mx-auto"></div>
        </div>
      </section>
    );
  }

  // Eğer hiç popüler mekan yoksa bölümü gösterme veya mesaj göster
  if (populerMekanlar.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Başlık Bölümü */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-dancing font-bold text-gray-900 mb-4">Popüler Mekanlar</h2>
          {/* Başlık altındaki dekoratif çizgi */}
          <div className="w-24 h-1 bg-[#23C8B9] mx-auto rounded-full opacity-80"></div>
        </div>

        {/* Mekanlar Izgarası (Grid Yapısı) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {populerMekanlar.map((mekan) => (
            <MekanKarti key={mekan.id} mekan={mekan} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Populer;
