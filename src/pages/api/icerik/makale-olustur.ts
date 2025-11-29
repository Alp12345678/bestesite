import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { sanitizeUrl } from '@/lib/sanitize';
import { createSingleCommit } from '@/lib/github';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Sadece POST istekleri desteklenir.' });
  }

  const { content, url } = req.body;

  if (!content || typeof content !== 'string') {
    return res.status(400).json({ message: 'Content gerekli.' });
  }

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ message: 'URL gerekli.' });
  }

  if (content.length > 1000000) {
    return res.status(400).json({ message: 'Content çok büyük (max 1MB).' });
  }

  try {
    // Path traversal koruması
    const safeUrl = sanitizeUrl(url);

    const fileName = `${safeUrl}.md`;
    const folderPath = 'src/icerik';
    const filePath = `${folderPath}/${fileName}`;

    // Geliştirme ortamında ve GitHub token yoksa yerel dosyaya yaz
    if (process.env.NODE_ENV === 'development' && !process.env.GITHUB_TOKEN) {
      const absoluteFolderPath = path.join(process.cwd(), folderPath);

      if (!fs.existsSync(absoluteFolderPath)) {
        fs.mkdirSync(absoluteFolderPath, { recursive: true });
      }

      fs.writeFileSync(path.join(absoluteFolderPath, fileName), content, 'utf8');

      return res.status(200).json({
        message: 'Makale yerel diske kaydedildi (GitHub Token eksik).',
        path: filePath,
      });
    }

    // GitHub'a yükle
    const files = [{ path: filePath, content }];
    const message = `Yeni makale: ${safeUrl}`;

    await createSingleCommit(files, message);

    return res.status(200).json({ message: "Makale GitHub'a başarıyla kaydedildi." });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
    console.error('API Hatası:', errorMessage);

    return res.status(500).json({
      message: 'İşlem başarısız oldu',
      ...(process.env.NODE_ENV === 'development' && { error: errorMessage }),
    });
  }
}
