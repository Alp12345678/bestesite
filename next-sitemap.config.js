/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.izmirdesen.com',
  generateRobotsTxt: false, // robots.txt zaten oluşturuldu, her build'de tekrar oluşturmasına gerek yok
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/login'],
      },
    ],
  },
  exclude: ['/admin', '/admin/*', '/login', '/login/*'],
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  generateIndexSitemap: false,
  // Transform fonksiyonu ile dinamik sayfalar için özelleştirme
  transform: async (config, path) => {
    // Blog sayfaları için yüksek öncelik
    if (path.startsWith('/blog/') && path !== '/blog') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      };
    }

    // Ana kategoriler için yüksek öncelik
    if (
      path === '/dugunler' ||
      path === '/etkinlikler' ||
      path === '/mekanlar' ||
      path === '/blog'
    ) {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      };
    }

    // Ana sayfa
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      };
    }

    // Diğer sayfalar için varsayılan değerler
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };
  },
};
