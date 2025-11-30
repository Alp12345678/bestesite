import { useRouter } from 'next/router';
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

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isHome = router.pathname === '/';

  // Admin ve login sayfalarında navbar/footer gösterme
  const hideNavAndFooter = router.pathname.startsWith('/admin') || router.pathname === '/login';

  return (
    <>
      <div className={`${montserrat.variable} font-sans`}>
        {!hideNavAndFooter && <Navbar isHome={isHome} />}
        <div id="main-content">
          <Component {...pageProps} />
        </div>
        {!hideNavAndFooter && <Footer />}
      </div>
    </>
  );
}
