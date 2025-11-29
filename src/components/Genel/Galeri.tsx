import React, { useState } from 'react';
import Image from 'next/image';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface GaleriProps {
  resimler: string[];
  baslik?: string;
}

export default function Galeri({ resimler, baslik }: GaleriProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  if (!resimler || resimler.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center text-gray-500">
        Görsel bulunmuyor.
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setPhotoIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden'; // Scroll'u engelle
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset'; // Scroll'u aç
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev + 1) % resimler.length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev + resimler.length - 1) % resimler.length);
  };

  return (
    <>
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Galeri</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {resimler.map((img, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              <Image
                src={img}
                alt={`${baslik || 'Galeri'} görseli ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-50"
          >
            <FaTimes className="text-3xl" />
          </button>

          <button
            onClick={prevPhoto}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-4 z-50 hidden md:block"
          >
            <FaChevronLeft className="text-4xl" />
          </button>

          <div className="relative w-full max-w-5xl h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={resimler[photoIndex]}
              alt={`Galeri görseli ${photoIndex + 1}`}
              fill
              className="object-contain"
              quality={100}
            />
          </div>

          <button
            onClick={nextPhoto}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-4 z-50 hidden md:block"
          >
            <FaChevronRight className="text-4xl" />
          </button>

          {/* Mobil Navigasyon */}
          <div className="absolute bottom-10 left-0 w-full flex justify-center gap-8 md:hidden z-50">
            <button onClick={prevPhoto} className="p-3 bg-white/10 rounded-full text-white">
              <FaChevronLeft className="text-2xl" />
            </button>
            <button onClick={nextPhoto} className="p-3 bg-white/10 rounded-full text-white">
              <FaChevronRight className="text-2xl" />
            </button>
          </div>

          <div className="absolute bottom-4 left-0 w-full text-center text-white/50 text-sm">
            {photoIndex + 1} / {resimler.length}
          </div>
        </div>
      )}
    </>
  );
}
