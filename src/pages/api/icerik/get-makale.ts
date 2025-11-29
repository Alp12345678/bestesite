import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Sadece GET istekleri desteklenir.' });
  }

  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ message: 'URL parametresi gerekli.' });
  }

  try {
    const filePath = path.join(process.cwd(), 'src/icerik', `${url}.md`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Makale bulunamadı.' });
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);

    return res.status(200).json({
      frontmatter,
      content,
      url,
    });
  } catch (error: any) {
    console.error('API Hatası:', error);
    return res.status(500).json({ message: 'İşlem başarısız oldu', error: error.message });
  }
}
