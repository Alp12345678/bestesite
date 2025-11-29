export interface Konum {
  lat: number;
  lng: number;
}

export interface MekanVerisi {
  id: string;
  baslik: string;
  url: string; // Slug: "grand-hotel-izmir"
  resim: string;
  kategori: string;
  ilce: string;
  adres?: string;
  konum?: Konum;
  puan: number;
  yorumSayisi: number;
  fiyat?: string; // "75.000 ₺" veya "500 ₺"
  durum: 'aktif' | 'pasif';
  populer?: boolean;

  // İsteğe bağlı özel alanlar
  tarih?: string; // Etkinlikler için
  ozellikler?: string[]; // "Wifi", "Otopark" vb.
}

// Kategori Metadata Tipi
export interface KategoriBilgisi {
  label: string;
  title: string;
  description: string;
  heroImage: string;
}
