// Merkezi SEO konfigürasyonu
// next-seo 6.x için

export const seoConfig = {
  titleTemplate: '%s | İzmirde Sen',
  defaultTitle: 'İzmirde Sen',
  description:
    "İzmir'deki en güncel etkinlikler, mekanlar, düğünler ve daha fazlası. İzmir'in nabzını tutan rehberiniz.",
  siteUrl: 'https://www.izmirdesen.com',
  openGraph: {
    type: 'website' as const,
    locale: 'tr_TR',
    url: 'https://www.izmirdesen.com',
    siteName: 'İzmirde Sen',
    images: [
      {
        url: 'https://www.izmirdesen.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'İzmirde Sen',
      },
    ],
  },
  twitter: {
    handle: '@izmirde.sen',
    site: '@izmirde.sen',
    cardType: 'summary_large_image',
  },
};

// Her sayfa için custom SEO oluşturma helper fonksiyonu
export function createPageSeo(title: string, description?: string, imageUrl?: string) {
  return {
    title,
    description: description || seoConfig.description,
    openGraph: {
      ...seoConfig.openGraph,
      title: `${title} | İzmirde Sen`,
      description: description || seoConfig.description,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : seoConfig.openGraph.images,
    },
    twitter: seoConfig.twitter,
  };
}
