import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { MekanVerisi } from '@/types';

interface HizmetKartiProps {
  hizmet: MekanVerisi;
}

const HizmetKarti: React.FC<HizmetKartiProps> = ({ hizmet }) => {
  return (
    <Link href={`/dugunler/${hizmet.url}`} className="block h-full">
      <div className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">
        {/* Görsel */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          <Image
            src={hizmet.resim}
            alt={hizmet.baslik}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-[#23C8B9] text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
              {hizmet.kategori}
            </span>
          </div>
        </div>

        {/* İçerik */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-[#23C8B9] transition-colors">
            {hizmet.baslik}
          </h3>

          {/* Konum */}
          <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
            <FaMapMarkerAlt className="text-[#23C8B9] text-xs" />
            <span className="line-clamp-1">{hizmet.ilce}</span>
          </div>

          {/* Fiyat ve Buton */}
          <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-end">
            <div className="bg-gray-900 text-white text-sm font-bold px-4 py-2 rounded-lg group-hover:bg-[#23C8B9] transition-colors">
              İncele
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HizmetKarti;
