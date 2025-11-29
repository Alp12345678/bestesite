import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Montserrat } from 'next/font/google';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';

// Fontlar
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Sayfa yüklendiğinde veya route değiştiğinde çalışır
    if (!router.isReady) return;

    // Eğer anasayfada değilsek VEYA anasayfada olsak bile query parametresi varsa (örn: ?kategori=...)
    if (router.pathname !== '/' || Object.keys(router.query).length > 0) {
      // Hero bölümünü geçip içeriğe scroll ol
      // Yaklaşık 100ms gecikme ile çalıştırıyoruz ki sayfa tam render olsun
      setTimeout(() => {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          // Navbar yüksekliğini (yaklaşık 80-100px) hesaba katarak scroll yap
          const yOffset = -100;
          const y = mainContent.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [router.pathname, router.query, router.isReady]);

  return (
    <div className={`${montserrat.variable}`}>
      <Navbar />
      <div id="main-content">
        <Component {...pageProps} />
      </div>
      <Footer />
    </div>
  );
}
