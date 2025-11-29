import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { MekanVerisi } from '@/types';

interface EtkinlikKartiProps {
  etkinlik: MekanVerisi;
}

const EtkinlikKarti: React.FC<EtkinlikKartiProps> = ({ etkinlik }) => {
  return (
    <Link href={`/etkinlik/${etkinlik.url}`} className="block h-full">
      <div className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">
        {/* Görsel */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          <Image
            src={etkinlik.resim}
            alt={etkinlik.baslik}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-[#23C8B9] text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
              {etkinlik.kategori}
            </span>
          </div>
        </div>

        {/* İçerik */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-[#23C8B9] transition-colors">
            {etkinlik.baslik}
          </h3>

          {/* Puanlama */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-yellow-400 text-xs">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={i < Math.floor(etkinlik.puan) ? 'text-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 font-medium">({etkinlik.yorumSayisi})</span>
          </div>

          {/* Konum */}
          <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-1">
            <FaMapMarkerAlt className="text-[#23C8B9] text-xs" />
            <span className="line-clamp-1">{etkinlik.ilce}</span>
          </div>

          {/* Tarih (Varsa) */}
          {etkinlik.tarih && (
            <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
              <FaCalendarAlt className="text-[#23C8B9] text-xs" />
              <span className="line-clamp-1">{etkinlik.tarih}</span>
            </div>
          )}

          {/* Fiyat ve Buton */}
          <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Kişi Başı</span>
              <span className="text-[#23C8B9] font-bold text-lg">{etkinlik.fiyat} ₺</span>
            </div>
            <div className="bg-gray-900 text-white text-sm font-bold px-4 py-2 rounded-lg group-hover:bg-[#23C8B9] transition-colors">
              Katıl
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EtkinlikKarti;
