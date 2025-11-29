import React from 'react';
import { FaMapMarkedAlt, FaExternalLinkAlt } from 'react-icons/fa';

interface MapsEmbedProps {
  konum?: string;
  baslik?: string;
  adres?: string;
  koordinat?: string;
}

const MapsEmbed: React.FC<MapsEmbedProps> = ({ konum, baslik, adres, koordinat }) => {
  // 1. Eğer koordinat varsa direkt onu kullan (En hızlı ve garantili yöntem)
  if (koordinat) {
    // Koordinat formatı: "38.4262, 27.1365"
    // Boşlukları temizle
    const cleanCoord = koordinat.replace(/\s/g, '');
    const embedUrl = `https://maps.google.com/maps?q=${cleanCoord}&hl=tr&z=15&output=embed`;

    return (
      <div className="w-full h-full min-h-[300px] rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50">
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0, minHeight: '300px' }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={baslik || 'Harita Konumu'}
        />
      </div>
    );
  }

  // 2. Eğer konum bir embed linki ise direkt kullan
  if (konum && (konum.includes('embed') || konum.includes('output=embed'))) {
    return (
      <div className="w-full h-full min-h-[300px] rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50">
        <iframe
          src={konum}
          width="100%"
          height="100%"
          style={{ border: 0, minHeight: '300px' }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={baslik || 'Harita Konumu'}
        />
      </div>
    );
  }

  // 3. Eğer konum yoksa ve adres yoksa hiçbir şey yapma
  if (!konum) return null;

  // Çözümlenemezse veya hata olursa eski fallback kartını göster
  return (
    <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-gray-200 p-6 text-center">
      <div className="w-16 h-16 bg-[#23C8B9]/10 rounded-full flex items-center justify-center mb-4">
        <FaMapMarkedAlt className="text-3xl text-[#23C8B9]" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">Konumu Haritada Gör</h3>
      <p className="text-gray-500 text-sm mb-6 max-w-xs">
        Bu konumu detaylı incelemek ve yol tarifi almak için Google Haritalar'da açın.
      </p>
      <a
        href={konum}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-50 hover:border-[#23C8B9] hover:text-[#23C8B9] transition-all duration-300 shadow-sm"
      >
        <span>Haritada Aç</span>
        <FaExternalLinkAlt className="text-sm" />
      </a>
    </div>
  );
};

export default MapsEmbed;
