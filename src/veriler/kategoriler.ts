import { KategoriBilgisi } from '@/types';

// MEKAN KATEGORİLERİ
export const MEKAN_KATEGORILERI = [
  { label: 'Tümü', key: 'tumu' },
  { label: 'Meyhane', key: 'meyhane' },
  { label: 'Kahvaltı', key: 'kahvalti' },
  { label: 'Yemek', key: 'yemek' },
  { label: 'Gece Hayatı', key: 'gece-hayati' },
  { label: 'Plaj', key: 'plaj' },
  { label: 'Cafe', key: 'cafe' },
];

export const MEKAN_KATEGORI_BILGILERI: Record<string, KategoriBilgisi> = {
  tumu: {
    label: 'Tümü',
    title: 'İzmir Mekanları',
    description: "İzmir'in en popüler mekanlarını keşfedin.",
    heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80',
  },
  meyhane: {
    label: 'Meyhane',
    title: 'İzmir Meyhaneleri',
    description: "Ege'nin en keyifli meyhaneleri, fasıl mekanları ve rakı balık keyfi.",
    heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80',
  },
  kahvalti: {
    label: 'Kahvaltı',
    title: 'İzmir Kahvaltı Mekanları',
    description:
      "Güne harika bir başlangıç için İzmir'in en iyi serpme kahvaltı ve brunch mekanları.",
    heroImage: 'https://images.unsplash.com/photo-1533089862017-5614fa6753f5?w=1600&q=80',
  },
  yemek: {
    label: 'Yemek',
    title: 'İzmir Restoranları',
    description: "Dünya mutfağından yerel lezzetlere, İzmir'in en seçkin restoranları.",
    heroImage: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1600&q=80',
  },
  'gece-hayati': {
    label: 'Gece Hayatı',
    title: 'İzmir Gece Hayatı',
    description: 'Canlı müzik, gece kulüpleri ve barlar. İzmir gecelerinin nabzını tutun.',
    heroImage: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1600&q=80',
  },
  plaj: {
    label: 'Plaj',
    title: 'İzmir Beach Club & Plajlar',
    description: 'Deniz, kum ve güneşin tadını çıkarabileceğiniz en popüler beach clublar.',
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80',
  },
  cafe: {
    label: 'Cafe',
    title: 'İzmir Kafeleri',
    description: 'Keyifli bir kahve molası ve tatlı kaçamakları için en iyi kafeler.',
    heroImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1600&q=80',
  },
};

// DÜĞÜN KATEGORİLERİ
export const DUGUN_KATEGORILERI = [
  { label: 'Tümü', key: 'tumu' },
  { label: 'Düğün Mekanları', key: 'mekan' },
  { label: 'Organizasyon', key: 'organizasyon' },
  { label: 'Fotoğraf & Video', key: 'fotograf' },
  { label: 'Gelinlik & Moda', key: 'gelinlik' },
  { label: 'Düğün Pastası', key: 'pasta' },
];

export const DUGUN_KATEGORI_BILGILERI: Record<string, KategoriBilgisi> = {
  tumu: {
    label: 'Tümü',
    title: 'Düğün Hizmetleri',
    description: 'Hayalinizdeki düğün için en seçkin mekanlar ve profesyonel hizmetler.',
    heroImage: '/dugun/mekan.jpg',
  },
  mekan: {
    label: 'Düğün Mekanları',
    title: 'Düğün Mekanları',
    description: 'Kır düğünü, otel, havuz başı veya salon düğünü için en iyi mekanlar.',
    heroImage: '/dugun/mekan.jpg',
  },
  organizasyon: {
    label: 'Organizasyon',
    title: 'Düğün Organizasyon',
    description: 'Kusursuz bir düğün için profesyonel organizasyon ve planlama firmaları.',
    heroImage: '/dugun/organizasyon.jpg',
  },
  fotograf: {
    label: 'Fotoğraf & Video',
    title: 'Düğün Fotoğrafçıları',
    description: 'En özel anlarınızı ölümsüzleştirecek profesyonel düğün fotoğrafçıları.',
    heroImage: '/dugun/foto.jpg',
  },
  gelinlik: {
    label: 'Gelinlik & Moda',
    title: 'Gelinlik ve Moda',
    description: 'En trend gelinlik modelleri, damatlıklar ve abiye seçenekleri.',
    heroImage: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=1600&q=80',
  },
  pasta: {
    label: 'Düğün Pastası',
    title: 'Düğün Pastası & Tatlı',
    description: 'Düğününüzü tatlandıracak özel tasarım pastalar ve ikramlıklar.',
    heroImage: '/dugun/pasta.jpg',
  },
};

// ETKİNLİK KATEGORİLERİ
export const ETKINLIK_KATEGORILERI = [
  { label: 'Tümü', key: 'tumu' },
  { label: 'Konser', key: 'konser' },
  { label: 'Tiyatro', key: 'tiyatro' },
  { label: 'Workshop', key: 'workshop' },
];

export const ETKINLIK_KATEGORI_BILGILERI: Record<string, KategoriBilgisi> = {
  tumu: {
    label: 'Tümü',
    title: 'Etkinlikler & Atölyeler',
    description: 'Şehrin en iyi konserleri, tiyatro oyunları ve yaratıcı workshopları.',
    heroImage: 'https://images.unsplash.com/photo-1459749411177-3c2ea1f61c4d?w=1600&q=80',
  },
  konser: {
    label: 'Konser',
    title: 'Konserler',
    description: 'Sevdiğiniz sanatçıların canlı performansları ve müzik dolu geceler.',
    heroImage: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1600&q=80',
  },
  tiyatro: {
    label: 'Tiyatro',
    title: 'Tiyatro Oyunları',
    description: 'Sahne sanatlarının en seçkin örnekleri ve unutulmaz oyunlar.',
    heroImage: 'https://images.unsplash.com/photo-1507676184212-d0370926727c?w=1600&q=80',
  },
  workshop: {
    label: 'Workshop',
    title: 'Workshop & Atölye',
    description: 'Yeni beceriler edinebileceğiniz yaratıcı atölye çalışmaları.',
    heroImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80',
  },
};
