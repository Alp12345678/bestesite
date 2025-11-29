import React from 'react';
import Head from 'next/head';
import Footer from '@/components/Footer/Footer';
import Filtreler from '@/components/Genel/Filtreler';
import HizmetKarti from '@/components/Dugun/HizmetKarti';
import { DUGUN_KATEGORILERI, DUGUN_KATEGORI_BILGILERI } from '@/veriler/kategoriler';
import { useCategoryData } from '@/hooks/useCategoryData';

export default function Dugunler() {
  const { activeCategoryKey, activeCategoryInfo, filteredData, loading, handleCategoryChange } =
    useCategoryData('dugunler', DUGUN_KATEGORI_BILGILERI);

  return (
    <>
      <Head>
        <title>{`${activeCategoryInfo.title} | İzmirde Sen`}</title>
        <meta name="description" content={activeCategoryInfo.description} />
      </Head>

      <main className="bg-[#F9FAFB] min-h-screen pb-20">
        {/* Hero Bölümü - Dinamik */}
        <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden mb-8">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[#23C8B9]/90 to-emerald-600/90 mix-blend-multiply z-10" />
            <img
              src={activeCategoryInfo.heroImage}
              alt={activeCategoryInfo.title}
              className="w-full h-full object-cover transition-opacity duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://picsum.photos/1920/600';
              }}
            />
          </div>

          <div className="relative z-20 text-center text-white px-4">
            <h1 className="text-5xl md:text-6xl font-dancing font-bold mb-4 drop-shadow-lg animate-fade-in">
              {activeCategoryInfo.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-light drop-shadow-md">
              {activeCategoryInfo.description}
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4">
          {/* Yatay Filtreler */}
          <div className="mb-10 py-4 border-b border-gray-100">
            <Filtreler
              categories={DUGUN_KATEGORILERI}
              activeCategory={activeCategoryKey}
              onSelectCategory={handleCategoryChange}
            />
          </div>

          {/* Yükleniyor Durumu */}
          {loading && (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#23C8B9]"></div>
            </div>
          )}

          {/* Grid Liste */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredData.map((hizmet) => (
                <HizmetKarti key={hizmet.id} hizmet={hizmet} />
              ))}
            </div>
          )}

          {/* Sonuç Bulunamadı Durumu */}
          {!loading && filteredData.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <p className="text-xl">Bu kategoride henüz hizmet bulunmuyor.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
