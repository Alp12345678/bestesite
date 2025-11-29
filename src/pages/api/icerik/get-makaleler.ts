import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page = 1, limit = 10 } = req.query;
  const pageInt = parseInt(page as string, 10);
  const limitInt = parseInt(limit as string, 10);

  const dirPath = path.join(process.cwd(), 'src/content/icerik');

  if (!fs.existsSync(dirPath)) {
    return res.status(200).json({ posts: [], totalCount: 0 });
  }

  const files = fs.readdirSync(dirPath);
  const posts = files
    .filter((file) => file.endsWith('.md'))
    .map((filename) => {
      const filePath = path.join(dirPath, filename);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent);

      return {
        id: filename.replace('.md', ''),
        slug: filename.replace('.md', ''),
        title: data.title,
        date: data.date,
        author: data.author,
        description: data.description,
        tags: data.tags,
        folder: data.folder,
        image: data.image || null,
        ...data,
      };
    })
    // @ts-ignore
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const startIndex = (pageInt - 1) * limitInt;
  const endIndex = startIndex + limitInt;
  const paginatedPosts = posts.slice(startIndex, endIndex);

  res.status(200).json({
    posts: paginatedPosts,
    totalCount: posts.length,
    totalPages: Math.ceil(posts.length / limitInt),
    currentPage: pageInt,
  });
}
