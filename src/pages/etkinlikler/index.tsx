import React from 'react';
import { NextSeo } from 'next-seo';

import Filtreler from '@/components/Genel/Filtreler';
import EtkinlikKarti from '@/components/Etkinlik/EtkinlikKarti';
import { ETKINLIK_KATEGORILERI, ETKINLIK_KATEGORI_BILGILERI } from '@/veriler/kategoriler';
import { useCategoryData } from '@/hooks/useCategoryData';

export default function EtkinliklerPage() {
  const { activeCategoryKey, activeCategoryInfo, filteredData, loading, handleCategoryChange } =
    useCategoryData('etkinlikler', ETKINLIK_KATEGORI_BILGILERI);

  return (
    <>
      <NextSeo
        title={`${activeCategoryInfo.title} | İzmirde Sen`}
        description={activeCategoryInfo.description}
        canonical={`https://www.izmirdesen.com/etkinlikler`}
        openGraph={{
          url: `https://www.izmirdesen.com/etkinlikler`,
          title: `${activeCategoryInfo.title} | İzmirde Sen`,
          description: activeCategoryInfo.description,
          images: [
            {
              url: 'https://www.izmirdesen.com/og-image.png',
              width: 1200,
              height: 630,
              alt: `${activeCategoryInfo.title} | İzmirde Sen`,
            },
          ],
          siteName: 'İzmirde Sen',
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
      />

      <main className="bg-[#F9FAFB] min-h-screen pb-20">
        {/* Hero Bölümü */}
        <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden mb-8">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-pink-800/80 z-10" />
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
            <h1 className="text-5xl md:text-6xl  font-bold mb-4 drop-shadow-lg animate-fade-in">
              {activeCategoryInfo.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-light drop-shadow-md">
              {activeCategoryInfo.description}
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4">
          {/* Filtreler */}
          <div className="mb-10 py-4 border-b border-gray-100">
            <Filtreler
              categories={ETKINLIK_KATEGORILERI}
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
              {filteredData.map((etkinlik) => (
                <EtkinlikKarti key={etkinlik.id} etkinlik={etkinlik} />
              ))}
            </div>
          )}

          {/* Sonuç Bulunamadı Durumu */}
          {!loading && filteredData.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <p className="text-xl">Bu kategoride henüz etkinlik bulunmuyor.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
