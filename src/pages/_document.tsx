import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  const siteNavigationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: 'İzmirde Sen Navigasyon',
    url: 'https://www.izmirdesen.com',
    hasPart: [
      { '@type': 'WebPage', name: 'Düğünler', url: 'https://www.izmirdesen.com/dugunler' },
      { '@type': 'WebPage', name: 'Etkinlikler', url: 'https://www.izmirdesen.com/etkinlikler' },
      { '@type': 'WebPage', name: 'Mekanlar', url: 'https://www.izmirdesen.com/mekanlar' },
      { '@type': 'WebPage', name: 'Blog', url: 'https://www.izmirdesen.com/blog' },
    ],
  };

  return (
    <Html lang="tr">
      <Head>
        <meta charSet="utf-8" />

        {/* Favicon ve Icons */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Meta Tags */}
        <meta name="publisher" content="İzmirde Sen" />
        <meta name="author" content="Beste Caner" />
        <meta
          name="keywords"
          content="izmir, etkinlikler, mekanlar, düğünler, blog, izmirde sen, izmir rehberi, izmir gezi, izmir etkinlik"
        />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        <meta name="bingbot" content="noindex, nofollow" />
        <meta name="theme-color" content="#e9ebea" />

        {/* Open Graph */}
        <meta property="og:site_name" content="İzmirde Sen" />
        <meta property="og:locale" content="tr_TR" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@izmirde.sen" />
        <meta name="twitter:creator" content="@izmirde.sen" />

        {/* Schema.org */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'İzmirde Sen',
              url: 'https://www.izmirdesen.com/',
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationSchema) }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
