import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, writeBatch, getDocs, query } from 'firebase/firestore';

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

  const deleteAllData = async () => {
    if (!confirm('⚠️ DİKKAT: TÜM VERİTABANI SİLİNECEK! Bu işlem geri alınamaz. Emin misiniz?'))
      return;

    setLoading(true);
    setStatus('Veritabanı temizleniyor...');

    try {
      // Tüm koleksiyonları sil
      await clearCollection('mekanlar');
      setStatus('✅ Mekanlar silindi...');

      await clearCollection('dugunler');
      setStatus('✅ Mekanlar ve Düğünler silindi...');

      await clearCollection('etkinlikler');
      setStatus('✅ Tüm veriler silindi!');

      setTimeout(() => {
        setStatus('✅ İŞLEM TAMAMLANDI! Tüm veritabanı temizlendi.');
      }, 500);
    } catch (error) {
      console.error(error);
      setStatus('❌ Hata: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-lg w-full text-center border-2 border-red-100">
        <div className="mb-6">
          <div className="text-6xl mb-4">🗑️</div>
          <h1 className="text-3xl font-bold mb-3 text-gray-800">Veritabanı Yönetimi</h1>
          <p className="text-gray-600 text-lg mb-2">
            Bu sayfadan tüm veritabanı verilerini silebilirsiniz.
          </p>
        </div>

        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-red-700 mb-3">⚠️ UYARI</h2>
          <p className="text-red-600 text-sm">
            Bu işlem <b>TÜM VERİLERİ SİLER</b> ve <b>GERİ ALINAMAZ</b>.
            <br />
            <br />
            Silinecek veriler:
          </p>
          <ul className="text-left text-sm text-red-700 mt-3 space-y-1">
            <li className="flex items-center gap-2">
              <span className="text-red-500">•</span> Tüm Mekanlar
            </li>
            <li className="flex items-center gap-2">
              <span className="text-red-500">•</span> Tüm Düğünler
            </li>
            <li className="flex items-center gap-2">
              <span className="text-red-500">•</span> Tüm Etkinlikler
            </li>
          </ul>
        </div>

        <button
          onClick={deleteAllData}
          disabled={loading}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-5 px-8 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-red-300 transform hover:scale-105 active:scale-95"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              İşlem Yapılıyor...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span className="text-2xl">🔥</span>
              TÜM VERİLERİ SİL
            </span>
          )}
        </button>

        {status && (
          <div
            className={`mt-6 p-5 rounded-xl font-semibold text-sm animate-fadeIn ${
              status.includes('❌')
                ? 'bg-red-100 text-red-800 border-2 border-red-200'
                : 'bg-green-100 text-green-800 border-2 border-green-200'
            }`}
          >
            {status}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            💡 İpucu: Yeni veri eklemek için Admin Panel'i kullanın
          </p>
        </div>
      </div>
    </div>
  );
}
