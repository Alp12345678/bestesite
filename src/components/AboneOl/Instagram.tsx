'use client';

import { useEffect, useState } from 'react';

export default function InstagramEmbed() {
  const [paddingTop, setPaddingTop] = useState('85%'); // Default oran

  useEffect(() => {
    const updatePadding = () => {
      if (window.innerWidth < 640) {
        setPaddingTop('100%'); // sm altı: %100 oran
      } else {
        setPaddingTop('85%'); // normalde 85%
      }
    };

    updatePadding(); // ilk yükleme
    window.addEventListener('resize', updatePadding);
    return () => window.removeEventListener('resize', updatePadding);
  }, []);

  return (
    <div className="w-full overflow-hidden rounded-3xl">
      <div className="relative w-full" style={{ paddingTop }}>
        <iframe
          src="https://www.instagram.com/izmirde.sen/embed/?cr=1&amp;v=15"
          allowFullScreen={true}
          frameBorder="0"
          scrolling="no"
          loading="lazy"
          className="absolute top-0 left-0 w-full h-full border-0"
          style={{ backgroundColor: 'transparent' }}
        />
      </div>
    </div>
  );
}
