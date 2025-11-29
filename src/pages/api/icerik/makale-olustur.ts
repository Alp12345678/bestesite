import type { NextApiRequest, NextApiResponse } from 'next';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || process.env.REPO_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO || process.env.REPO_NAME;
const BRANCH = 'main';

async function createSingleCommit(files: { path: string; content: string }[], message: string) {
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    throw new Error('GitHub konfigürasyonu eksik (TOKEN, REPO_OWNER, REPO_NAME)');
  }

  const baseUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;

  // 1. Son commit SHA değerini al
  const refRes = await fetch(`${baseUrl}/git/ref/heads/${BRANCH}`, {
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
  });
  if (!refRes.ok) throw new Error('GitHub ref alınamadı');
  const refData = await refRes.json();
  const latestCommitSha = refData.object.sha;

  // 2. Son committen tree SHA değerini al
  const commitRes = await fetch(`${baseUrl}/git/commits/${latestCommitSha}`, {
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
  });
  const commitData = await commitRes.json();
  const baseTreeSha = commitData.tree.sha;

  // 3. Yeni tree oluştur
  const treeRes = await fetch(`${baseUrl}/git/trees`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    },
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree: files.map((file) => ({
        path: file.path,
        mode: '100644',
        type: 'blob',
        content: file.content,
      })),
    }),
  });
  const treeData = await treeRes.json();

  // 4. Yeni commit oluştur
  const commitCreateRes = await fetch(`${baseUrl}/git/commits`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    },
    body: JSON.stringify({
      message,
      tree: treeData.sha,
      parents: [latestCommitSha],
    }),
  });
  const commitCreateData = await commitCreateRes.json();

  // 5. Branch referansını yeni commit ile güncelle
  await fetch(`${baseUrl}/git/refs/heads/${BRANCH}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    },
    body: JSON.stringify({
      sha: commitCreateData.sha,
    }),
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Sadece POST istekleri desteklenir.' });
  }

  const { content, url } = req.body;

  if (!content || !url) {
    return res.status(400).json({ message: 'İçerik veya url bulunamadı.' });
  }

  try {
    const fileName = `${url}.md`;
    const folderPath = 'src/icerik';
    const filePath = `${folderPath}/${fileName}`;

    // Geliştirme ortamında ve GitHub token yoksa yerel dosyaya yaz
    if (process.env.NODE_ENV === 'development' && !GITHUB_TOKEN) {
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
    await createSingleCommit(
      [
        {
          path: filePath,
          content: content,
        },
      ],
      `Yeni makale eklendi: ${url}`
    );

    return res.status(200).json({ message: "Makale GitHub'a başarıyla yüklendi." });
  } catch (error: any) {
    console.error('API Hatası:', error);
    return res.status(500).json({ message: 'İşlem başarısız oldu', error: error.message });
  }
}
