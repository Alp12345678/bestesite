import AboneOl from '@/components/AboneOl/Abone';
import Blog from '@/components/Blog/Blog';
import MapsEmbed from '@/components/Genel/MapsEmbed';
import Populer from '@/components/Populer/Populer';
import { NextSeo } from 'next-seo';

export default function Home() {
  return (
    <>
      <NextSeo
        title="Anasayfa | İzmirde Sen"
        description="İzmir'deki en güncel etkinlikler, mekanlar ve düğünler. İzmir'in nabzını tutan rehberiniz."
        canonical="https://www.izmirdesen.com/"
        openGraph={{
          url: 'https://www.izmirdesen.com/',
          title: 'Anasayfa | İzmirde Sen',
          description:
            "İzmir'deki en güncel etkinlikler, mekanlar, düğünler ve daha fazlası. İzmir'in nabzını tutan rehberiniz.",
          images: [
            {
              url: 'https://www.izmirdesen.com/og-image.png',
              width: 1200,
              height: 630,
              alt: 'İzmirde Sen - Anasayfa',
            },
          ],
          siteName: 'İzmirde Sen',
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
      />
      <div>
        <Populer />
        <AboneOl />
        <Blog />
        <MapsEmbed />
      </div>
    </>
  );
}
