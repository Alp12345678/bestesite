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
  const isHome = router.pathname === '/';

  return (
    <div className={`${montserrat.variable} font-sans`}>
      <Navbar isHome={isHome} />
      <div id="main-content">
        <Component {...pageProps} />
      </div>
      <Footer />
    </div>
  );
}
