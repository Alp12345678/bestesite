import React from 'react';
import Image from 'next/image';
import { FaCalendarAlt, FaUser, FaArrowRight } from 'react-icons/fa';

// Mock Blog Verisi
const BLOG_POSTS = [
  {
    id: 1,
    title: "İzmir'in En İyi 3. Nesil Kahvecileri",
    excerpt:
      "Alsancak'tan Bostanlı'ya, kahve tutkunları için şehrin en iyi duraklarını sizin için derledik. Aromatik çekirdekler ve samimi ortamlar...",
    date: '28 Kasım 2024',
    author: 'Beste Gezgin',
    image: '/blog/blog-1.jpg',
    category: 'Yeme & İçme',
    featured: true,
  },
  {
    id: 2,
    title: 'Hafta Sonu İçin Urla Gezi Rehberi',
    excerpt:
      "Bağ yolları, sanat sokağı ve gastronomi rotasıyla Urla'da unutulmaz bir hafta sonu planı.",
    date: '25 Kasım 2024',
    author: 'Can Yılmaz',
    image: '/blog/blog-2.jpg',
    category: 'Seyahat',
    featured: false,
  },
  {
    id: 3,
    title: "Alsancak'ta Gizli Kalmış Lezzet Durakları",
    excerpt:
      'Sadece müdavimlerinin bildiği, ara sokaklarda kalmış lezzet hazinelerini keşfediyoruz.',
    date: '22 Kasım 2024',
    author: 'Selin Demir',
    image: '/blog/blog-3.jpg',
    category: 'Keşif',
    featured: false,
  },
  {
    id: 4,
    title: 'Ekim Ayı Etkinlik Takvimi',
    excerpt:
      "Konserler, tiyatrolar ve festivaller... Bu ay İzmir'de kaçırmamanız gereken etkinlikler.",
    date: '20 Kasım 2024',
    author: 'Etkinlik Ekibi',
    image: '/blog/blog-4.jpg',
    category: 'Etkinlik',
    featured: false,
  },
  {
    id: 5,
    title: "Bostanlı'da Gün Batımı Eşliğinde Akşam Yemeği",
    excerpt:
      'Deniz kokusu ve muhteşem manzara eşliğinde keyifli bir akşam yemeği için en iyi mekanlar.',
    date: '18 Kasım 2024',
    author: 'Deniz Soylu',
    image: '/blog/blog-5.jpg',
    category: 'Mekan Önerisi',
    featured: false,
  },
];

const Blog = () => {
  const featuredPost = BLOG_POSTS.find((post) => post.featured);
  const otherPosts = BLOG_POSTS.filter((post) => !post.featured);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Başlık */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-dancing font-bold text-gray-900 mb-4">Son Yazılar</h2>
          <div className="w-24 h-1 bg-primary-500 mx-auto rounded-full opacity-80"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            İzmir'in nabzını tutan en güncel içerikler, mekan önerileri ve gezi rehberleri.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sol: Öne Çıkan Yazı (Büyük Kart) */}
          {featuredPost && (
            <div className="group relative h-full min-h-[400px] lg:min-h-[500px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer">
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="absolute top-6 left-6">
                <span className="bg-primary-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                  {featuredPost.category}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="flex items-center gap-4 text-gray-300 text-sm mb-3">
                  <div className="flex items-center gap-1.5">
                    <FaCalendarAlt className="text-primary-400" />
                    <span>{featuredPost.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FaUser className="text-primary-400" />
                    <span>{featuredPost.author}</span>
                  </div>
                </div>

                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-primary-400 transition-colors">
                  {featuredPost.title}
                </h3>

                <p className="text-gray-300 mb-6 line-clamp-3 text-lg">{featuredPost.excerpt}</p>

                <button className="flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all duration-300">
                  Devamını Oku <FaArrowRight className="text-primary-500" />
                </button>
              </div>
            </div>
          )}

          {/* Sağ: Diğer Yazılar (Grid 2x2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {otherPosts.map((post) => (
              <div
                key={post.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 text-gray-400 text-xs mb-3">
                    <div className="flex items-center gap-1">
                      <FaCalendarAlt />
                      <span>{post.date}</span>
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {post.title}
                  </h4>

                  <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
                    {post.excerpt}
                  </p>

                  <div className="pt-4 border-t border-gray-100 mt-auto">
                    <span className="text-primary-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Oku <FaArrowRight className="text-xs" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;
