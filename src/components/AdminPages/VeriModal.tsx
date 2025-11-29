import React, { useState } from 'react';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { MekanVerisi } from '@/types';
import {
  MEKAN_KATEGORILERI,
  DUGUN_KATEGORILERI,
  ETKINLIK_KATEGORILERI,
} from '@/veriler/kategoriler';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'mekan' | 'dugun' | 'etkinlik';
  onSave: (data: Partial<MekanVerisi>) => Promise<string | undefined> | void;
  initialData?: Partial<MekanVerisi>;
}

const ILCELER = [
  'Aliağa',
  'Balçova',
  'Bayındır',
  'Bayraklı',
  'Bergama',
  'Beydağ',
  'Bornova',
  'Buca',
  'Çeşme',
  'Çiğli',
  'Dikili',
  'Foça',
  'Gaziemir',
  'Güzelbahçe',
  'Karabağlar',
  'Karaburun',
  'Karşıyaka',
  'Kemalpaşa',
  'Kınık',
  'Kiraz',
  'Konak',
  'Menderes',
  'Menemen',
  'Narlıdere',
  'Ödemiş',
  'Seferihisar',
  'Selçuk',
  'Tire',
  'Torbalı',
  'Urla',
];

export default function Modal({ isOpen, onClose, type, onSave, initialData }: ModalProps) {
  const [formData, setFormData] = useState<Partial<MekanVerisi>>(
    initialData || {
      baslik: '',
      url: '',
      resim: '',
      kategori: '',
      ilce: '',
      adres: '',
      konum: '',
      koordinat: '',
      fiyat: '',
      durum: 'aktif',
      populer: false,
      tarih: '',
      ozellikler: [],
      aciklama: '',
      galeri: [],
      instagram: '',
    }
  );

  const [ozellik, setOzellik] = useState('');
  // Dosya yönetimi için state'ler
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  // Modal açıldığında veya tip değiştiğinde formu sıfırla
  React.useEffect(() => {
    if (isOpen) {
      setFormData(
        initialData || {
          baslik: '',
          url: '',
          resim: '',
          kategori: '',
          ilce: '',
          adres: '',
          konum: '',
          koordinat: '',
          fiyat: '',
          durum: 'aktif',
          populer: false,
          tarih: '',
          ozellikler: [],
          aciklama: '',
          galeri: [],
          instagram: '',
        }
      );
      setOzellik('');
      setCoverImageFile(null);
      setGalleryFiles([]);
      setUploading(false);
    }
  }, [isOpen, type, initialData]);

  if (!isOpen) return null;

  const getTitle = () => {
    switch (type) {
      case 'mekan':
        return 'Mekan Ekle';
      case 'dugun':
        return 'Düğün Hizmeti Ekle';
      case 'etkinlik':
        return 'Etkinlik Ekle';
    }
  };

  const getKategoriler = () => {
    switch (type) {
      case 'mekan':
        return MEKAN_KATEGORILERI.filter((k) => k.key !== 'tumu');
      case 'dugun':
        return DUGUN_KATEGORILERI.filter((k) => k.key !== 'tumu');
      case 'etkinlik':
        return ETKINLIK_KATEGORILERI.filter((k) => k.key !== 'tumu');
      default:
        return [];
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type: inputType } = e.target;

    if (inputType === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddOzellik = () => {
    if (ozellik.trim()) {
      setFormData((prev) => ({
        ...prev,
        ozellikler: [...(prev.ozellikler || []), ozellik.trim()],
      }));
      setOzellik('');
    }
  };

  const handleRemoveOzellik = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ozellikler: (prev.ozellikler || []).filter((_, i) => i !== index),
    }));
  };

  const handleRemoveGaleri = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      galeri: (prev.galeri || []).filter((_, i) => i !== index),
    }));
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFile = async (file: File, folder: string, public_id: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    formData.append('public_id', public_id);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kapak fotoğrafı zorunluluğu kontrolü
    if (!coverImageFile && !formData.resim) {
      alert('Lütfen bir kapak fotoğrafı yükleyiniz.');
      return;
    }

    setUploading(true);

    try {
      // 1. URL slug oluştur
      const slug =
        formData.baslik
          ?.toLowerCase()
          .replace(/ğ/g, 'g')
          .replace(/ü/g, 'u')
          .replace(/ş/g, 's')
          .replace(/ı/g, 'i')
          .replace(/ö/g, 'o')
          .replace(/ç/g, 'c')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') || 'adsiz';

      const folderPath = `${type === 'mekan' ? 'mekanlar' : type === 'dugun' ? 'dugunler' : 'etkinlikler'}/${slug}`;
      let coverImageUrl = formData.resim;
      let galleryUrls = [...(formData.galeri || [])];

      // 2. Kapak fotoğrafını yükle (varsa)
      if (coverImageFile) {
        coverImageUrl = await uploadFile(coverImageFile, folderPath, 'kapak');
      }

      // 3. Galeri fotoğraflarını yükle (varsa)
      if (galleryFiles.length > 0) {
        const uploadPromises = galleryFiles.map(async (file, index) => {
          const existingCount = (formData.galeri?.length || 0) - galleryFiles.length;
          const fileIndex = existingCount + index + 1;
          return await uploadFile(file, folderPath, fileIndex.toString());
        });

        const uploadedUrls = await Promise.all(uploadPromises);

        const currentGallery = [...(formData.galeri || [])];
        const startIndex = currentGallery.length - galleryFiles.length;

        for (let i = 0; i < uploadedUrls.length; i++) {
          currentGallery[startIndex + i] = uploadedUrls[i];
        }
        galleryUrls = currentGallery;
      }

      // 4. Veri temizliği ve kaydetme
      let cleanData: any = {
        id: initialData?.id || Date.now().toString(),
        url: slug,
        baslik: formData.baslik,
        resim: coverImageUrl,
        durum: formData.durum || 'aktif',
        createdAt: new Date().toISOString(),
      };

      // Diğer tipler için mevcut mantık
      const categories = getKategoriler();
      const selectedCategory = categories.find((c) => c.key === formData.kategori);
      const categoryLabel = selectedCategory ? selectedCategory.label : formData.kategori;

      cleanData = {
        ...cleanData,
        kategori: categoryLabel,
        galeri: galleryUrls,
      };

      if (type === 'mekan') {
        Object.assign(cleanData, {
          ilce: formData.ilce,
          adres: formData.adres,
          konum: formData.konum,
          koordinat: formData.koordinat,
          instagram: formData.instagram,
          populer: formData.populer,
          ozellikler: formData.ozellikler,
        });
      } else if (type === 'etkinlik') {
        Object.assign(cleanData, {
          ilce: formData.ilce,
          adres: formData.adres,
          konum: formData.konum,
          koordinat: formData.koordinat,
          tarih: formData.tarih,
          fiyat: formData.fiyat,
          aciklama: formData.aciklama,
        });
      }

      await onSave(cleanData);
      onClose();
    } catch (error) {
      console.error('Yükleme hatası:', error);
      alert('Dosya yüklenirken bir hata oluştu.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#23C8B9] to-[#1fa89b]">
          <h2 className="text-2xl font-bold text-white">{getTitle()}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <FaTimes className="text-white text-xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Kategori ve Adı - Her tip için */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {type === 'mekan'
                    ? 'Mekan Türü'
                    : type === 'dugun'
                      ? 'Hizmetin Türü'
                      : 'Etkinliğin Türü'}{' '}
                  *
                </label>
                <select
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23C8B9] focus:border-transparent"
                >
                  <option value="">Seçiniz</option>
                  {getKategoriler().map((kat) => (
                    <option key={kat.key} value={kat.key}>
                      {kat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {type === 'mekan'
                    ? 'Mekan Adı'
                    : type === 'dugun'
                      ? 'Hizmetin Adı'
                      : 'Etkinliğin Adı'}{' '}
                  *
                </label>
                <input
                  type="text"
                  name="baslik"
                  value={formData.baslik}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23C8B9] focus:border-transparent"
                  placeholder="Ör: Grand Hotel İzmir"
                />
              </div>
            </div>

            {/* Mekan ve Etkinlik için İlçe ve Adres */}
            {(type === 'mekan' || type === 'etkinlik') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {type === 'mekan' ? 'Mekan İlçesi' : 'Etkinliğin İlçesi'} *
                  </label>
                  <select
                    name="ilce"
                    value={formData.ilce}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23C8B9] focus:border-transparent"
                  >
                    <option value="">Seçiniz</option>
                    {ILCELER.map((ilce) => (
                      <option key={ilce} value={ilce}>
                        {ilce}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {type === 'mekan' ? 'Mekan Adresi' : 'Etkinliğin Adresi'}
                  </label>
                  <input
                    type="text"
                    name="adres"
                    value={formData.adres}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23C8B9] focus:border-transparent"
                    placeholder="Tam adres"
                  />
                </div>
              </div>
            )}

            {/* Sadece Mekan için Instagram */}
            {type === 'mekan' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram Kullanıcı Adı
                </label>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23C8B9] focus:border-transparent"
                  placeholder="@kullaniciadi"
                />
              </div>
            )}

            {/* Mekan ve Etkinlik için Google Maps */}
            {(type === 'mekan' || type === 'etkinlik') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Maps URL
                  </label>
                  <input
                    type="url"
                    name="konum"
                    value={formData.konum}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23C8B9] focus:border-transparent"
                    placeholder="https://maps.google.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Koordinat</label>
                  <input
                    type="text"
                    name="koordinat"
                    value={formData.koordinat}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23C8B9] focus:border-transparent"
                    placeholder="38.42624707332537, 27.13658353815675"
                  />
                </div>
              </div>
            )}

            {/* Sadece Etkinlik için Tarih, Açıklama, Ücret */}
            {type === 'etkinlik' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Etkinliğin Tarihi
                    </label>
                    <input
                      type="date"
                      name="tarih"
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, tarih: e.target.value }));
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23C8B9] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Etkinliğin Ücreti
                    </label>
                    <input
                      type="text"
                      name="fiyat"
                      value={formData.fiyat}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23C8B9] focus:border-transparent"
                      placeholder="Ör: 100 ₺"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Etkinliğin Açıklaması
                  </label>
                  <textarea
                    name="aciklama"
                    value={formData.aciklama}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23C8B9] focus:border-transparent"
                    placeholder="Detaylı açıklama"
                  />
                </div>
              </>
            )}

            {/* Kapak Fotoğrafı - Her tip için */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {type === 'mekan'
                  ? 'Mekanın Kapak Fotoğrafı'
                  : type === 'dugun'
                    ? 'Hizmetin Kapak Fotoğrafı'
                    : 'Etkinliğin Kapak Fotoğrafı'}{' '}
                *
                <span className="text-xs text-gray-500 ml-2 font-normal">
                  (Otomatik olarak .webp formatına dönüştürülecektir)
                </span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    setFormData((prev) => ({ ...prev, resim: previewUrl }));
                    setCoverImageFile(file);
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23C8B9] focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#23C8B9] file:text-white hover:file:bg-[#1fa89b]"
              />
              {formData.resim && (
                <div className="mt-2">
                  <img
                    src={formData.resim}
                    alt="Önizleme"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Diğer Fotoğraflar (Galeri) - Her tip için */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {type === 'mekan'
                  ? 'Mekanın Diğer Fotoğrafları'
                  : type === 'dugun'
                    ? 'Hizmetin Diğer Fotoğrafları'
                    : 'Etkinliğin Diğer Fotoğrafları'}
                <span className="text-xs text-gray-500 ml-2 font-normal">
                  (Otomatik olarak .webp formatına dönüştürülecektir)
                </span>
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) {
                      const newUrls = files.map((file) => URL.createObjectURL(file));
                      setFormData((prev) => ({
                        ...prev,
                        galeri: [...(prev.galeri || []), ...newUrls],
                      }));
                      setGalleryFiles((prev) => [...prev, ...files]);
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23C8B9] focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#23C8B9] file:text-white hover:file:bg-[#1fa89b]"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {formData.galeri?.map((url, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={url}
                      alt={`Galeri ${i + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveGaleri(i)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Sadece Mekan için Popüler checkbox */}
            {type === 'mekan' && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="populer"
                  id="populer"
                  checked={formData.populer}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#23C8B9] focus:ring-[#23C8B9] rounded"
                />
                <label
                  htmlFor="populer"
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  Bu mekan popüler mekanlara eklensin mi?
                </label>
              </div>
            )}

            {/* Özellikler - Sadece Mekan için */}
            {type === 'mekan' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Özellikler</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={ozellik}
                    onChange={(e) => setOzellik(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23C8B9] focus:border-transparent"
                    placeholder="Ör: Wifi"
                  />
                  <button
                    type="button"
                    onClick={handleAddOzellik}
                    className="px-4 py-2 bg-[#23C8B9] text-white rounded-lg hover:bg-[#1fa89b] transition-colors flex items-center gap-2"
                  >
                    <FaPlus />
                    Ekle
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.ozellikler?.map((oz, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2"
                    >
                      {oz}
                      <button
                        type="button"
                        onClick={() => handleRemoveOzellik(i)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 px-6 py-3 bg-[#23C8B9] text-white rounded-lg hover:bg-[#1fa89b] transition-colors font-medium shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Yükleniyor...
                </>
              ) : (
                'Kaydet'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
