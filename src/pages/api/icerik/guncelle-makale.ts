import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;

async function createSingleCommit(files: { path: string; content: string }[], message: string) {
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    throw new Error('GitHub credentials eksik');
  }

  const baseUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;

  // Get main branch ref
  const refRes = await fetch(`${baseUrl}/git/refs/heads/main`, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!refRes.ok) throw new Error('Ref alınamadı');
  const refData = await refRes.json();
  const latestCommitSha = refData.object.sha;

  // Get base tree
  const commitRes = await fetch(`${baseUrl}/git/commits/${latestCommitSha}`, {
    headers: { Authorization: `token ${GITHUB_TOKEN}` },
  });
  if (!commitRes.ok) throw new Error('Commit alınamadı');
  const commitData = await commitRes.json();
  const baseTreeSha = commitData.tree.sha;

  // Create blobs and tree
  const tree = [];
  for (const file of files) {
    const blobRes = await fetch(`${baseUrl}/git/blobs`, {
      method: 'POST',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: file.content,
        encoding: 'utf-8',
      }),
    });

    if (!blobRes.ok) throw new Error('Blob oluşturulamadı');
    const blobData = await blobRes.json();

    tree.push({
      path: file.path,
      mode: '100644',
      type: 'blob',
      sha: blobData.sha,
    });
  }

  const treeRes = await fetch(`${baseUrl}/git/trees`, {
    method: 'POST',
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree,
    }),
  });

  if (!treeRes.ok) throw new Error('Tree oluşturulamadı');
  const treeData = await treeRes.json();

  // Create commit
  const newCommitRes = await fetch(`${baseUrl}/git/commits`, {
    method: 'POST',
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      tree: treeData.sha,
      parents: [latestCommitSha],
    }),
  });

  if (!newCommitRes.ok) throw new Error('Commit oluşturulamadı');
  const newCommitData = await newCommitRes.json();

  // Update ref
  const updateRefRes = await fetch(`${baseUrl}/git/refs/heads/main`, {
    method: 'PATCH',
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sha: newCommitData.sha,
    }),
  });

  if (!updateRefRes.ok) throw new Error('Ref güncellenemedi');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Sadece PUT istekleri desteklenir.' });
  }

  const { oldUrl, newUrl, content } = req.body;

  if (!oldUrl || !content) {
    return res.status(400).json({ message: 'oldUrl ve content gerekli.' });
  }

  try {
    const folderPath = 'src/icerik';
    const oldFilePath = `${folderPath}/${oldUrl}.md`;
    const newFilePath = `${folderPath}/${newUrl || oldUrl}.md`;

    // Geliştirme ortamında ve GitHub token yoksa yerel dosyaya yaz
    if (process.env.NODE_ENV === 'development' && !GITHUB_TOKEN) {
      const absoluteFolderPath = path.join(process.cwd(), folderPath);
      const absoluteOldFilePath = path.join(process.cwd(), oldFilePath);
      const absoluteNewFilePath = path.join(process.cwd(), newFilePath);

      // Eski dosyayı sil (eğer URL değiştiyse)
      if (oldUrl !== newUrl && fs.existsSync(absoluteOldFilePath)) {
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
    const message = `Makale güncellendi: ${newUrl || oldUrl}`;

    // Eğer URL değiştiyse eski dosyayı sil
    if (oldUrl !== newUrl) {
      // GitHub'da dosya silmek için boş blob oluşturmak yerine
      // sadece yeni dosyayı commit ediyoruz
      // Eski dosyayı silmek için ayrı bir commit gerekir
    }

    await createSingleCommit(files, message);

    return res.status(200).json({ message: "Makale GitHub'a başarıyla güncellendi." });
  } catch (error: any) {
    console.error('API Hatası:', error);
    return res.status(500).json({ message: 'İşlem başarısız oldu', error: error.message });
  }
}
