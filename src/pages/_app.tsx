import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Open_Sans, Dancing_Script } from 'next/font/google';
import Navbar from '@/components/Navbar/Navbar';

// Fontlar
const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing-script',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${openSans.variable} ${dancingScript.variable}`}>
      <Navbar />
      <Component {...pageProps} />
    </div>
  );
}
