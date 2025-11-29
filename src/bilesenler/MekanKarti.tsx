import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import { MekanVerisi } from '@/types';

interface MekanKartiProps {
  mekan: MekanVerisi;
}

const MekanKarti: React.FC<MekanKartiProps> = ({ mekan }) => {
  return (
    <Link href={`/mekan/${mekan.url}`} className="block h-full">
      <div className="group bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">
        {/* Görsel */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          <Image
            src={mekan.resim}
            alt={mekan.baslik}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-[#23C8B9] text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
              {mekan.kategori}
            </span>
          </div>
        </div>

        {/* İçerik */}
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-[#23C8B9] transition-colors">
            {mekan.baslik}
          </h3>

          {/* Puanlama */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-yellow-400 text-xs">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={i < Math.floor(mekan.puan) ? 'text-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 font-medium">({mekan.yorumSayisi})</span>
          </div>

          {/* Konum */}
          <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
            <FaMapMarkerAlt className="text-[#23C8B9] text-xs" />
            <span className="line-clamp-1">{mekan.ilce}</span>
          </div>

          {/* Buton */}
          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Detayları Gör</span>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#23C8B9] group-hover:text-white transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MekanKarti;
