export type Konum = string;

export interface MekanVerisi {
  id: string;
  baslik: string;
  url: string; // Slug: "grand-hotel-izmir"
  resim: string;
  kategori: string;
  ilce: string;
  adres?: string;
  konum?: Konum;
  koordinat?: string; // "38.4262, 27.1365" formatında

  fiyat?: string; // "75.000 ₺" veya "500 ₺"
  durum: 'aktif' | 'pasif';
  populer?: boolean;

  // İsteğe bağlı özel alanlar
  tarih?: string; // Etkinlikler için
  ozellikler?: string[]; // "Wifi", "Otopark" vb.
  aciklama?: string; // Detay sayfası için açıklama
  galeri?: string[]; // Detay sayfası için galeri görselleri
  instagram?: string;
}

// Kategori Metadata Tipi
export interface KategoriBilgisi {
  label: string;
  title: string;
  description: string;
  heroImage: string;
}
