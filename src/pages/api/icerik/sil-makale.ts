import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;

async function deleteFileFromGitHub(filePath: string, message: string) {
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    throw new Error('GitHub credentials eksik');
  }

  const baseUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;

  // Get file SHA
  const fileRes = await fetch(`${baseUrl}/contents/${filePath}`, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
    },
  });

  if (!fileRes.ok) {
    throw new Error('Dosya bulunamadı');
  }

  const fileData = await fileRes.json();
  const fileSha = fileData.sha;

  // Delete file
  const deleteRes = await fetch(`${baseUrl}/contents/${filePath}`, {
    method: 'DELETE',
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      sha: fileSha,
    }),
  });

  if (!deleteRes.ok) {
    throw new Error('Dosya silinemedi');
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Sadece DELETE istekleri desteklenir.' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: 'URL gerekli.' });
  }

  try {
    const folderPath = 'src/icerik';
    const filePath = `${folderPath}/${url}.md`;

    // Geliştirme ortamında ve GitHub token yoksa yerel dosyayı sil
    if (process.env.NODE_ENV === 'development' && !GITHUB_TOKEN) {
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
    await deleteFileFromGitHub(filePath, `Makale silindi: ${url}`);

    return res.status(200).json({ message: "Makale GitHub'dan başarıyla silindi." });
  } catch (error: any) {
    console.error('API Hatası:', error);
    return res.status(500).json({ message: 'İşlem başarısız oldu', error: error.message });
  }
}
