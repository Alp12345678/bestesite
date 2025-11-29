import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, getCountFromServer } from 'firebase/firestore';
import { MekanVerisi, ModalType, DeleteModalType } from '@/types';
import Modal from '@/components/AdminPages/VeriModal';
import YaziModal from '@/components/AdminPages/Yazi/YaziModal';
import VeriSilmeModal from '@/components/AdminPages/VeriSilmeModal';
import PopulerModal from '@/components/AdminPages/PopulerModal';
import YaziListeModal from '@/components/AdminPages/Yazi/YaziListeModal';
import {
  FaStore,
  FaRing,
  FaCalendarAlt,
  FaChartLine,
  FaPlus,
  FaSignOutAlt,
  FaTrash,
  FaStar,
  FaPenFancy,
  FaListUl,
  FaEdit,
} from 'react-icons/fa';

// Constants
const ADD_ACTIONS = [
  { label: 'Mekan Ekle', icon: FaStore, type: 'mekan', color: 'bg-blue-500 hover:bg-blue-600' },
  { label: 'Düğün Ekle', icon: FaRing, type: 'dugun', color: 'bg-pink-500 hover:bg-pink-600' },
  {
    label: 'Etkinlik Ekle',
    icon: FaCalendarAlt,
    type: 'etkinlik',
    color: 'bg-purple-500 hover:bg-purple-600',
  },
];

const BLOG_ACTIONS = [
  {
    label: 'Blog Yazısı Ekle',
    icon: FaPenFancy,
    type: 'blog_ekle',
    color: 'bg-teal-500 hover:bg-teal-600',
  },
  {
    label: 'Blog Yazısı Düzenle/Sil',
    icon: FaListUl,
    type: 'blog_listele',
    color: 'bg-teal-600 hover:bg-teal-700',
  },
];

const DELETE_ACTIONS = [
  { label: 'Mekan Sil', icon: FaTrash, type: 'mekan_sil', color: 'bg-red-500 hover:bg-red-600' },
  { label: 'Düğün Sil', icon: FaTrash, type: 'dugun_sil', color: 'bg-red-500 hover:bg-red-600' },
  {
    label: 'Etkinlik Sil',
    icon: FaTrash,
    type: 'etkinlik_sil',
    color: 'bg-red-500 hover:bg-red-600',
  },
];

const POPULAR_ACTIONS = [
  {
    label: 'Popüler Mekan Yönet',
    icon: FaStar,
    type: 'populer_ekle',
    color: 'bg-yellow-500 hover:bg-yellow-600',
  },
];

const HEADER_STYLE = 'bg-white shadow-sm border-b border-gray-200';
const CARD_STYLE = 'bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full';
const BUTTON_BASE =
  'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-lg';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isYaziModalOpen, setIsYaziModalOpen] = useState(false);
  const [isYaziListeModalOpen, setIsYaziListeModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPopulerModalOpen, setIsPopulerModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('mekan');
  const [deleteModalType, setDeleteModalType] = useState<DeleteModalType>('mekan_sil');
  const [yaziModalMode, setYaziModalMode] = useState<'create' | 'edit'>('create');
  const [editSlug, setEditSlug] = useState<string>('');

  // İstatistik state'leri
  const [stats, setStats] = useState({
    mekan: 0,
    dugun: 0,
    etkinlik: 0,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
        setLoading(false);
        fetchStats(); // Kullanıcı giriş yaptıysa istatistikleri çek
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchStats = async () => {
    try {
      const mekanColl = collection(db, 'mekanlar');
      const dugunColl = collection(db, 'dugunler');
      const etkinlikColl = collection(db, 'etkinlikler');

      const [mekanSnapshot, dugunSnapshot, etkinlikSnapshot] = await Promise.all([
        getCountFromServer(mekanColl),
        getCountFromServer(dugunColl),
        getCountFromServer(etkinlikColl),
      ]);

      setStats({
        mekan: mekanSnapshot.data().count,
        dugun: dugunSnapshot.data().count,
        etkinlik: etkinlikSnapshot.data().count,
      });
    } catch (error) {
      console.error('İstatistikler çekilemedi:', error);
    }
  };

  const handleAction = (type: string) => {
    // Blog işlemleri
    if (type === 'blog_ekle') {
      setYaziModalMode('create');
      setEditSlug('');
      setIsYaziModalOpen(true);
      return;
    }

    if (type === 'blog_listele') {
      setIsYaziListeModalOpen(true);
      return;
    }

    // Popüler mekan yönetimi
    if (type === 'populer_ekle') {
      setIsPopulerModalOpen(true);
      return;
    }

    // Silme işlemleri
    if (['mekan_sil', 'dugun_sil', 'etkinlik_sil'].includes(type)) {
      setDeleteModalType(type as 'mekan_sil' | 'dugun_sil' | 'etkinlik_sil');
      setIsDeleteModalOpen(true);
      return;
    }

    // Ekleme işlemleri
    if (['mekan', 'dugun', 'etkinlik'].includes(type)) {
      setModalType(type as ModalType);
      setIsModalOpen(true);
    } else {
      alert('Bu özellik henüz yapım aşamasında.');
    }
  };

  const handleEditBlogPost = (slug: string) => {
    setEditSlug(slug);
    setYaziModalMode('edit');
    setIsYaziModalOpen(true);
  };

  const handleSaveData = async (data: Partial<MekanVerisi>) => {
    try {
      const collectionName =
        modalType === 'mekan' ? 'mekanlar' : modalType === 'dugun' ? 'dugunler' : 'etkinlikler';
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date().toISOString(),
        createdBy: user?.email,
      });
      alert('Başarıyla kaydedildi!');
      fetchStats(); // Kayıt sonrası istatistikleri güncelle
      return docRef.id;
    } catch (error) {
      console.error('Kayıt hatası:', error);
      alert('Kayıt sırasında bir hata oluştu.');
      return undefined;
    }
  };

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/login');
  };

  const STATS_CONFIG = [
    {
      label: 'Toplam Mekan',
      value: stats.mekan,
      icon: FaStore,
      color: 'from-blue-500 to-blue-600',
    },
    { label: 'Toplam Düğün', value: stats.dugun, icon: FaRing, color: 'from-pink-500 to-pink-600' },
    {
      label: 'Toplam Etkinlik',
      value: stats.etkinlik,
      icon: FaCalendarAlt,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#23C8B9] mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard | İzmirde Sen</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className={HEADER_STYLE}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Yönetim Paneli</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Hoş geldiniz, <span className="font-medium text-[#23C8B9]">{user?.email}</span>
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className={`${BUTTON_BASE} text-gray-700 bg-white border border-gray-300 hover:bg-gray-50`}
              >
                <FaSignOutAlt />
                Çıkış Yap
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {STATS_CONFIG.map((stat, index) => (
              <div
                key={index}
                className={`${CARD_STYLE} overflow-hidden hover:shadow-md transition-shadow !p-0`}
              >
                <div className={`bg-gradient-to-br ${stat.color} p-6`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm font-medium">{stat.label}</p>
                      <p className="text-white text-3xl font-bold mt-2">{stat.value}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                      <stat.icon className="text-white text-2xl" />
                    </div>
                  </div>
                </div>
                <div className="px-6 py-3 bg-gray-50 flex items-center gap-2 text-sm text-gray-600">
                  <FaChartLine className="text-green-500" />
                  <span>Son 30 gün</span>
                </div>
              </div>
            ))}
          </div>

          {/* Actions Grid - 4 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1: Add Actions */}
            <div className={CARD_STYLE}>
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaPlus className="text-blue-600" />
                </div>
                İçerik Ekle
              </h2>
              <div className="space-y-3">
                {ADD_ACTIONS.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleAction(action.type)}
                    className={`w-full ${action.color} text-white p-4 rounded-xl font-medium transition-all transform hover:scale-[1.02] active:scale-95 flex items-center gap-3 shadow-md group`}
                  >
                    <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
                      <action.icon className="text-xl" />
                    </div>
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Column 2: Delete Actions */}
            <div className={CARD_STYLE}>
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FaTrash className="text-red-600" />
                </div>
                İçerik Sil
              </h2>
              <div className="space-y-3">
                {DELETE_ACTIONS.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleAction(action.type)}
                    className={`w-full ${action.color} text-white p-4 rounded-xl font-medium transition-all transform hover:scale-[1.02] active:scale-95 flex items-center gap-3 shadow-md group`}
                  >
                    <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
                      <action.icon className="text-xl" />
                    </div>
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Column 3: Popular Actions */}
            <div className={CARD_STYLE}>
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <FaStar className="text-yellow-600" />
                </div>
                Popüler İşlemler
              </h2>
              <div className="space-y-3">
                {POPULAR_ACTIONS.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleAction(action.type)}
                    className={`w-full ${action.color} text-white p-4 rounded-xl font-medium transition-all transform hover:scale-[1.02] active:scale-95 flex items-center gap-3 shadow-md group`}
                  >
                    <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
                      <action.icon className="text-xl" />
                    </div>
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Column 4: Blog Actions */}
            <div className={CARD_STYLE}>
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <FaPenFancy className="text-teal-600" />
                </div>
                Blog Yazıları
              </h2>
              <div className="space-y-3">
                {BLOG_ACTIONS.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleAction(action.type)}
                    className={`w-full ${action.color} text-white p-4 rounded-xl font-medium transition-all transform hover:scale-[1.02] active:scale-95 flex items-center gap-3 shadow-md group`}
                  >
                    <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
                      <action.icon className="text-xl" />
                    </div>
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalType}
        onSave={handleSaveData}
      />

      {/* Yazi Modal */}
      <YaziModal
        isOpen={isYaziModalOpen}
        onClose={() => setIsYaziModalOpen(false)}
        mode={yaziModalMode}
        editSlug={editSlug}
      />

      {/* Yazi Liste Modal */}
      <YaziListeModal
        isOpen={isYaziListeModalOpen}
        onClose={() => setIsYaziListeModalOpen(false)}
        onEdit={handleEditBlogPost}
      />

      {/* Veri Silme Modal */}
      <VeriSilmeModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        type={deleteModalType}
      />

      {/* Popüler Modal */}
      <PopulerModal isOpen={isPopulerModalOpen} onClose={() => setIsPopulerModalOpen(false)} />
    </>
  );
}
