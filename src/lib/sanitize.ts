/**
 * URL'i sanitize eder ve path traversal saldırılarını önler
 * @param url - Sanitize edilecek URL
 * @returns Güvenli URL string
 */
export function sanitizeUrl(url: string): string {
  // Sadece alfanumerik karakterler ve tire kabul et
  const sanitized = url.replace(/[^a-zA-Z0-9-]/g, '');

  if (sanitized.length === 0) {
    throw new Error('Geçersiz URL formatı');
  }

  if (sanitized.length > 200) {
    throw new Error('URL çok uzun');
  }

  return sanitized;
}

/**
 * URL formatını validate eder
 * @param url - Kontrol edilecek URL
 * @returns URL geçerli mi?
 */
export function validateUrl(url: string): boolean {
  return /^[a-zA-Z0-9-]+$/.test(url) && url.length > 0 && url.length <= 200;
}
