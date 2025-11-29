import { useState } from 'react';
import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeToc from '@jsdevtools/rehype-toc';
import rehypeStringify from 'rehype-stringify';
import remarkBreaks from 'remark-breaks';
import matter from 'gray-matter';
import { GetStaticProps, GetStaticPaths } from 'next';
import { FaChevronUp, FaChevronDown, FaCalendarAlt, FaUser, FaArrowLeft } from 'react-icons/fa';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface Props {
  content: string;
  tocContent: string;
  title: string;
  description: string;
  tags: string[];
  folder: string;
  slug: string;
  date: string;
  author: string;
  image?: string;
}

export default function BlogPost({
  content,
  tocContent,
  title,
  description,
  tags,
  slug,
  date,
  author,
  folder,
  image,
}: Props) {
  const [isTocOpen, setIsTocOpen] = useState(true);

  function formatDate(dateStr: string): string {
    try {
      const parsed = new Date(dateStr);
      return format(parsed, 'd MMMM yyyy', { locale: tr });
    } catch {
      return dateStr;
    }
  }

  return (
    <>
      <Head>
        <title>{`${title} | İzmirde Sen`}</title>
        <meta name="description" content={description || `${title} hakkında detaylı bilgiler.`} />
      </Head>

      <div className="min-h-screen bg-[#F9FAFB] pb-20 pt-32">
        <div className="container mx-auto px-4">
          <article className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 overflow-hidden">
            {/* Hero Image */}
            {image && (
              <div className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden mb-8">
                <Image src={image} alt={title} fill className="object-cover" priority />
              </div>
            )}

            {/* Header */}
            <header className="mb-8 border-b border-gray-100 pb-8 text-center">
              <div className="mb-4 flex justify-center">
                <span className="bg-[#23C8B9]/10 text-[#23C8B9] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {folder}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {title}
              </h1>
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-[#23C8B9]" />
                  <span>{formatDate(date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUser className="text-[#23C8B9]" />
                  <span>{author}</span>
                </div>
              </div>
            </header>

            {/* İçindekiler (Üstte Ortada) */}
            {tocContent && (
              <div className="max-w-2xl mx-auto mb-12 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <button
                  onClick={() => setIsTocOpen(!isTocOpen)}
                  className="flex items-center justify-between w-full font-bold text-gray-900"
                >
                  <span>İçindekiler</span>
                  {isTocOpen ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {isTocOpen && (
                  <div
                    className="toc-content prose prose-sm max-w-none mt-4
                    prose-a:text-gray-600 prose-a:no-underline hover:prose-a:text-[#23C8B9]
                    prose-ul:list-none prose-ul:pl-0
                    prose-li:my-2"
                    dangerouslySetInnerHTML={{ __html: tocContent }}
                  />
                )}
              </div>
            )}

            {/* İçerik */}
            <div
              className="prose prose-lg max-w-none text-gray-600 mx-auto
              prose-headings:font-bold prose-headings:text-gray-900
              prose-a:text-[#23C8B9] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900
              prose-blockquote:border-l-[#23C8B9] prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic
              prose-img:rounded-2xl prose-img:mx-auto"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* Etiketler */}
            {tags && tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-100">
                <div className="flex flex-wrap justify-center gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors cursor-default"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const mdPath = path.join(process.cwd(), 'src/content/icerik', `${slug}.md`);

  if (!fs.existsSync(mdPath)) {
    return { notFound: true };
  }

  const fileContents = fs.readFileSync(mdPath, 'utf8');
  const { data, content: rawContent } = matter(fileContents);

  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkBreaks)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeToc, {
      headings: ['h2', 'h3'],
      cssClasses: {
        list: 'space-y-2',
        listItem: 'text-sm',
        link: 'block py-1 hover:text-[#23C8B9] transition-colors',
      },
    })
    .use(rehypeStringify)
    .process(rawContent);

  const content = processedContent.toString();

  // İçindekiler tablosunu içerikten ayır
  const tocContentMatch = content.match(/<nav[^>]*>([\s\S]*?)<\/nav>/);
  const tocContent = tocContentMatch ? tocContentMatch[0] : '';
  const mainContent = content.replace(tocContent, '');

  return {
    props: {
      content: mainContent,
      tocContent,
      title: data.title || '',
      description: data.description || '',
      tags: data.tags || [],
      folder: data.folder || 'Genel',
      date: data.date || '',
      author: data.author || 'Editör',
      image: data.image || null,
      slug,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const folderPath = path.join(process.cwd(), 'src/content/icerik');

  if (!fs.existsSync(folderPath)) {
    return { paths: [], fallback: false };
  }

  const files = fs.readdirSync(folderPath);
  const slugs = files.filter((f) => f.endsWith('.md')).map((f) => f.replace('.md', ''));

  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};
