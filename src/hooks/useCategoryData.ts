import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MekanVerisi, KategoriBilgisi } from '@/types';

export function useCategoryData(
  collectionName: string,
  kategoriBilgileri: Record<string, KategoriBilgisi>
) {
  const router = useRouter();
  const [activeCategoryKey, setActiveCategoryKey] = useState('tumu');
  const [data, setData] = useState<MekanVerisi[]>([]);
  const [loading, setLoading] = useState(true);

  // URL'den kategori oku
  useEffect(() => {
    if (!router.isReady) return;

    const { kategori } = router.query;
    if (kategori && typeof kategori === 'string') {
      setActiveCategoryKey(kategori);
    } else {
      setActiveCategoryKey('tumu');
    }
  }, [router.isReady, router.query]);

  // Firebase'den veri çek
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const ref = collection(db, collectionName);
        const q = query(ref);
        const querySnapshot = await getDocs(q);
        const fetchedData: MekanVerisi[] = [];
        querySnapshot.forEach((doc) => {
          fetchedData.push({ id: doc.id, ...doc.data() } as MekanVerisi);
        });
        setData(fetchedData);
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName]);

  // Kategori değiştirme fonksiyonu
  const handleCategoryChange = (key: string) => {
    setActiveCategoryKey(key);
    const basePath = router.pathname; // /mekanlar, /dugunler, /etkinlikler
    const url = key === 'tumu' ? basePath : `${basePath}?kategori=${key}`;
    router.push(url, undefined, { shallow: true });
  };

  // Aktif kategori bilgilerini bul
  const activeCategoryInfo = kategoriBilgileri[activeCategoryKey] || kategoriBilgileri['tumu'];

  // Verileri filtrele
  const filteredData =
    activeCategoryKey === 'tumu'
      ? data
      : data.filter((item) => item.kategori === activeCategoryInfo.label);

  return {
    activeCategoryKey,
    activeCategoryInfo,
    filteredData,
    loading,
    handleCategoryChange,
  };
}
