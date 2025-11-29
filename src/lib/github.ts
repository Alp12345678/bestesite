const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;

/**
 * GitHub'a tek bir commit oluşturur
 * @param files - Commit edilecek dosyalar
 * @param message - Commit mesajı
 */
export async function createSingleCommit(
  files: { path: string; content: string }[],
  message: string
): Promise<void> {
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

/**
 * GitHub'dan dosya siler
 * @param filePath - Silinecek dosyanın path'i
 * @param message - Commit mesajı
 */
export async function deleteFileFromGitHub(filePath: string, message: string): Promise<void> {
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
