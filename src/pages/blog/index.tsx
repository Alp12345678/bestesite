import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaCalendarAlt, FaUser, FaFolderOpen, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { parse, format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { NextSeo } from 'next-seo';

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

export default function BlogPage() {
  const topRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/icerik/get-makaleler?page=${currentPage}`);
        const data = await res.json();
        if (isMounted) {
          setPosts(data.posts);
          setTotalCount(data.totalCount);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [currentPage]);

  function formatDate(dateStr: string): string {
    try {
      // API'den gelen tarih formatı yyyy-MM-dd olabilir
      const parsed = new Date(dateStr);
      return format(parsed, 'd MMMM yyyy', { locale: tr });
    } catch {
      return dateStr;
    }
  }

  return (
    <>
      <NextSeo
        title="Blog | İzmirde Sen"
        description="İzmir'deki etkinlikler, mekanlar ve düğünler hakkında güncel yazılar ve rehberler."
        canonical="https://www.izmirdesen.com/blog"
        openGraph={{
          url: 'https://www.izmirdesen.com/blog',
          title: 'Blog | İzmirde Sen',
          description:
            "İzmir'deki etkinlikler, mekanlar ve düğünler hakkında güncel yazılar, rehberler ve haberler.",
          images: [
            {
              url: 'https://www.izmirdesen.com/og-image.png',
              width: 1200,
              height: 630,
              alt: 'İzmirde Sen - Blog',
            },
          ],
          siteName: 'İzmirde Sen',
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
      />

      <div ref={topRef} className="min-h-screen bg-[#F9FAFB] py-4">
        <div className="container mx-auto px-4">
          {/* Başlık */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Blog</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              İzmir'in nabzını tutan güncel yazılar, etkinlik rehberleri ve mekan incelemeleri.
            </p>
          </div>

          {/* Makale Listesi */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
              >
                {/* Resim Alanı */}
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
                </div>

                {/* Kart İçeriği */}
                <div className="p-8 flex flex-col flex-grow">
                  {/* Kategori Badge */}
                  <div className="mb-4">
                    <span className="bg-[#23C8B9]/10 text-[#23C8B9] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {post.folder}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#23C8B9] transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                    {post.description}
                  </p>

                  {/* Meta Bilgiler */}
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-6 border-t border-gray-100 mt-auto">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUser />
                      <span>{post.author}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalCount > postsPerPage && (
            <div className="flex justify-center mt-12 gap-4">
              <button
                onClick={() => {
                  setCurrentPage((prev) => Math.max(prev - 1, 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === 1}
                className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#23C8B9] hover:text-white hover:border-[#23C8B9] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaChevronLeft />
              </button>

              <button
                onClick={() => {
                  const nextPage = currentPage + 1;
                  setCurrentPage(nextPage);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage * postsPerPage >= totalCount}
                className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#23C8B9] hover:text-white hover:border-[#23C8B9] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
