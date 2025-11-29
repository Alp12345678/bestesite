import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { sanitizeUrl } from '@/lib/sanitize';
import { createSingleCommit } from '@/lib/github';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Sadece PUT istekleri desteklenir.' });
  }

  const { oldUrl, newUrl, content } = req.body;

  if (!oldUrl || typeof oldUrl !== 'string') {
    return res.status(400).json({ message: 'oldUrl gerekli.' });
  }

  if (!content || typeof content !== 'string') {
    return res.status(400).json({ message: 'content gerekli.' });
  }

  if (content.length > 1000000) {
    return res.status(400).json({ message: 'Content çok büyük (max 1MB).' });
  }

  try {
    // Path traversal koruması
    const safeOldUrl = sanitizeUrl(oldUrl);
    const safeNewUrl = newUrl ? sanitizeUrl(newUrl) : safeOldUrl;

    const folderPath = 'src/icerik';
    const oldFilePath = `${folderPath}/${safeOldUrl}.md`;
    const newFilePath = `${folderPath}/${safeNewUrl}.md`;

    // Geliştirme ortamında ve GitHub token yoksa yerel dosyaya yaz
    if (process.env.NODE_ENV === 'development' && !process.env.GITHUB_TOKEN) {
      const absoluteFolderPath = path.join(process.cwd(), folderPath);
      const absoluteOldFilePath = path.join(process.cwd(), oldFilePath);
      const absoluteNewFilePath = path.join(process.cwd(), newFilePath);

      // Eski dosyayı sil (eğer URL değiştiyse)
      if (safeOldUrl !== safeNewUrl && fs.existsSync(absoluteOldFilePath)) {
        fs.unlinkSync(absoluteOldFilePath);
      }

      if (!fs.existsSync(absoluteFolderPath)) {
        fs.mkdirSync(absoluteFolderPath, { recursive: true });
      }

      fs.writeFileSync(absoluteNewFilePath, content, 'utf8');

      return res.status(200).json({
        message: 'Makale yerel diske güncellendi (GitHub Token eksik).',
        path: newFilePath,
      });
    }

    // GitHub'a yükle
    const files = [{ path: newFilePath, content }];
    const message = `Makale güncellendi: ${safeNewUrl}`;

    // TODO: Eski dosyayı silmek için ayrı bir commit gerekir (URL değiştiyse)

    await createSingleCommit(files, message);

    return res.status(200).json({ message: "Makale GitHub'a başarıyla güncellendi." });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
    console.error('API Hatası:', errorMessage);

    return res.status(500).json({
      message: 'İşlem başarısız oldu',
      ...(process.env.NODE_ENV === 'development' && { error: errorMessage }),
    });
  }
}
