import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaUser, FaArrowRight } from 'react-icons/fa';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  author: string;
  folder: string;
  description: string;
  tags: string[];
  image?: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/icerik/get-makaleler?limit=5');
        const data = await res.json();
        setPosts(data.posts);
      } catch (error) {
        console.error('Blog yazıları yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return null;
  }

  if (posts.length === 0) {
    return null;
  }

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1, 5);

  function formatDate(dateStr: string) {
    try {
      return format(new Date(dateStr), 'd MMMM yyyy', { locale: tr });
    } catch {
      return dateStr;
    }
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Başlık */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">Son Yazılar</h2>
          <div className="w-24 h-1 bg-[#23C8B9] mx-auto rounded-full opacity-80"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            İzmir'in nabzını tutan en güncel içerikler, mekan önerileri ve gezi rehberleri.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sol: Öne Çıkan Yazı (Büyük Kart) */}
          {featuredPost && (
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group relative h-full min-h-[400px] lg:min-h-[500px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer block"
            >
              <div className="absolute inset-0 bg-gray-200">
                {featuredPost.image ? (
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900"></div>
                )}
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="absolute top-6 left-6 z-10">
                <span className="bg-[#23C8B9] text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                  {featuredPost.folder}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                <div className="flex items-center gap-4 text-gray-300 text-sm mb-3">
                  <div className="flex items-center gap-1.5">
                    <FaCalendarAlt className="text-[#23C8B9]" />
                    <span>{formatDate(featuredPost.date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FaUser className="text-[#23C8B9]" />
                    <span>{featuredPost.author}</span>
                  </div>
                </div>

                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-[#23C8B9] transition-colors">
                  {featuredPost.title}
                </h3>

                <p className="text-gray-300 mb-6 line-clamp-3 text-lg">
                  {featuredPost.description}
                </p>

                <div className="flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all duration-300">
                  Devamını Oku <FaArrowRight className="text-[#23C8B9]" />
                </div>
              </div>
            </Link>
          )}

          {/* Sağ: Diğer Yazılar (Grid 2x2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {otherPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full block"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400">
                      <span className="text-4xl opacity-20">Beste</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm">
                      {post.folder}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 text-gray-400 text-xs mb-3">
                    <div className="flex items-center gap-1">
                      <FaCalendarAlt />
                      <span>{formatDate(post.date)}</span>
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#23C8B9] transition-colors">
                    {post.title}
                  </h4>

                  <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
                    {post.description}
                  </p>

                  <div className="pt-4 border-t border-gray-100 mt-auto">
                    <span className="text-[#23C8B9] text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Oku <FaArrowRight className="text-xs" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;
