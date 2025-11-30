// Firebase User tipini genişlet
import { User } from 'firebase/auth';

export type { User };
export type Konum = string;

// Blog/Makale tipleri
export interface BlogFrontmatter {
  title: string;
  date: string;
  author: string;
  description: string;
  tags: string[];
  folder: string;
  image: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  description: string;
  tags: string[];
  folder: string;
  image: string | null;
}

export interface BlogInitialData {
  frontmatter: BlogFrontmatter;
  content: string;
  url: string;
}

// Modal tipleri
export type ModalType = 'mekan' | 'dugun' | 'etkinlik';
export type DeleteModalType = 'mekan_sil' | 'dugun_sil' | 'etkinlik_sil';

// Mekan/Dugun/Etkinlik Veri Tipi
export interface MekanVerisi {
  id?: string;
  baslik: string;
  url?: string; // Slug: "grand-hotel-izmir"
  resim: string; // Görsel URL - REQUIRED
  kapak: string; // Kapak görseli - REQUIRED (OG Image için de kullanılır)
  kategori: string;
  ilce: string;
  adres: string;
  telefon: string;
  website: string;
  instagram: string;
  facebook: string;
  email: string;
  konum?: Konum;
  koordinat?: string; // "38.4262, 27.1365" formatında
  maps: string;
  fiyat?: string; // "75.000 ₺" veya "500 ₺"
  durum?: 'aktif' | 'pasif';
  populer?: boolean;
  tarih?: string; // Etkinlikler için
  ozellikler: string[]; // "Wifi", "Otopark" vb.
  aciklama: string; // Detay sayfası için açıklama
  galeri: string[]; // Detay sayfası için galeri görselleri
  createdAt?: any;
}

// Kategori Metadata Tipi
export interface KategoriBilgisi {
  label: string;
  title: string;
  description: string;
  heroImage: string;
}
