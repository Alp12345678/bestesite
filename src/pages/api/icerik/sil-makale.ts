import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { sanitizeUrl } from '@/lib/sanitize';
import { deleteFileFromGitHub } from '@/lib/github';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Sadece DELETE istekleri desteklenir.' });
  }

  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ message: 'URL gerekli.' });
  }

  try {
    // Path traversal koruması
    const safeUrl = sanitizeUrl(url);

    const folderPath = 'src/icerik';
    const filePath = `${folderPath}/${safeUrl}.md`;

    // Geliştirme ortamında ve GitHub token yoksa yerel dosyayı sil
    if (process.env.NODE_ENV === 'development' && !process.env.GITHUB_TOKEN) {
      const absoluteFilePath = path.join(process.cwd(), filePath);

      if (!fs.existsSync(absoluteFilePath)) {
        return res.status(404).json({ message: 'Dosya bulunamadı.' });
      }

      fs.unlinkSync(absoluteFilePath);

      return res.status(200).json({
        message: 'Makale yerel diskten silindi (GitHub Token eksik).',
      });
    }

    // GitHub'dan sil
    await deleteFileFromGitHub(filePath, `Makale silindi: ${safeUrl}`);

    return res.status(200).json({ message: "Makale GitHub'dan başarıyla silindi." });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
    console.error('API Hatası:', errorMessage);

    return res.status(500).json({
      message: 'İşlem başarısız oldu',
      ...(process.env.NODE_ENV === 'development' && { error: errorMessage }),
    });
  }
}
