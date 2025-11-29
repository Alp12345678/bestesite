import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, writeBatch, doc, getDocs, query } from 'firebase/firestore';
import {
  MEKAN_KATEGORILERI,
  DUGUN_KATEGORILERI,
  ETKINLIK_KATEGORILERI,
} from '@/veriler/kategoriler';
import { MekanVerisi } from '@/types';

export default function SeedPage() {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Koleksiyonu temizleme fonksiyonu
  const clearCollection = async (collectionName: string) => {
    const q = query(collection(db, collectionName));
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  };

  const resetAndSeed = async () => {
    if (!confirm('DİKKAT: Tüm veritabanı silinecek ve baştan oluşturulacak. Emin misiniz?')) return;

    setLoading(true);
    setStatus('Veritabanı temizleniyor...');

    try {
      // 1. Önce her şeyi sil
      await clearCollection('mekanlar');
      await clearCollection('dugunler');
      await clearCollection('etkinlikler');

      setStatus('Temizlik tamamlandı. Yeni veriler yükleniyor...');
      const batch = writeBatch(db);

      // 2. Mekanlar (Her kategoriden 1 tane)
      MEKAN_KATEGORILERI.filter((k) => k.key !== 'tumu').forEach((kat, index) => {
        const id = `mekan-${kat.key}`;
        const docRef = doc(db, 'mekanlar', id);
        const data: MekanVerisi = {
          id: id,
          baslik: `Örnek ${kat.label}`,
          url: `ornek-${kat.key}`,
          kategori: kat.label,
          // Tüm resimler aynı olsun isteği üzerine:
          resim: '/images/popular-venue-2.png',

          ilce: 'Alsancak',
          adres: 'Örnek Adres No:1',
          konum: 'https://maps.app.goo.gl/6E5eSjt7QtsNCV1s9',
          koordinat: '38.42624707332537, 27.13658353815675',
          instagram: 'izmirde.sen',
          durum: 'aktif',
          fiyat: '500', // Sadece rakam
          populer: Math.random() > 0.5, // %50 şansla popüler
        };
        batch.set(docRef, { ...data, type: 'mekan', createdAt: new Date().toISOString() });
      });

      // 3. Düğünler (Her kategoriden 1 tane)
      DUGUN_KATEGORILERI.filter((k) => k.key !== 'tumu').forEach((kat, index) => {
        const id = `dugun-${kat.key}`;
        const docRef = doc(db, 'dugunler', id);
        const data: MekanVerisi = {
          id: id,
          baslik: `Örnek ${kat.label}`,
          url: `ornek-${kat.key}`,
          kategori: kat.label,
          resim: '/images/popular-venue-2.png',

          ilce: 'Çeşme',
          adres: 'Örnek Düğün Adresi',
          konum: 'https://maps.app.goo.gl/6E5eSjt7QtsNCV1s9',
          koordinat: '38.42624707332537, 27.13658353815675',
          instagram: 'izmirde.sen',
          durum: 'aktif',
          fiyat: '50.000',
        };
        batch.set(docRef, { ...data, type: 'dugun', createdAt: new Date().toISOString() });
      });

      // 4. Etkinlikler (Her kategoriden 1 tane)
      ETKINLIK_KATEGORILERI.filter((k) => k.key !== 'tumu').forEach((kat, index) => {
        const id = `etkinlik-${kat.key}`;
        const docRef = doc(db, 'etkinlikler', id);
        const data: MekanVerisi = {
          id: id,
          baslik: `Örnek ${kat.label} Atölyesi`,
          url: `ornek-${kat.key}`,
          kategori: kat.label,
          resim: '/images/popular-venue-2.png',

          ilce: 'Urla',
          adres: 'Sanat Sokağı',
          konum: 'https://maps.app.goo.gl/6E5eSjt7QtsNCV1s9',
          koordinat: '38.42624707332537, 27.13658353815675',
          instagram: 'izmirde.sen',
          durum: 'aktif',
          fiyat: '350',
          tarih: '25 Ekim 2023',
        };
        batch.set(docRef, { ...data, type: 'etkinlik', createdAt: new Date().toISOString() });
      });

      await batch.commit();
      setStatus('✅ İŞLEM TAMAMLANDI! Her kategoriden 1 örnek veri yüklendi.');
    } catch (error) {
      console.error(error);
      setStatus('❌ Hata: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">⚠️ Veritabanı Sıfırlama</h1>
        <p className="text-gray-600 mb-8">
          Bu işlem mevcut <b>TÜM VERİLERİ SİLER</b> ve her kategori için sadece 1 tane örnek veri
          oluşturur.
        </p>

        <button
          onClick={resetAndSeed}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl transition-colors disabled:opacity-50 shadow-lg hover:shadow-red-200"
        >
          {loading ? 'İşlem Yapılıyor...' : '🔥 HEPSİNİ SİL VE ÖRNEK VERİ YÜKLE'}
        </button>

        {status && (
          <div
            className={`mt-6 p-4 rounded-lg font-bold ${status.includes('❌') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
          >
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
