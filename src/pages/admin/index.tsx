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
  {
    label: 'Mekan Ekle',
    icon: FaStore,
    type: 'mekan',
    gradient: 'from-[#23C8B9] to-[#1da598]',
    iconBg: 'bg-[#23C8B9]/10',
    iconColor: 'text-[#23C8B9]',
  },
  {
    label: 'Düğün Ekle',
    icon: FaRing,
    type: 'dugun',
    gradient: 'from-pink-500 to-pink-600',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
  },
  {
    label: 'Etkinlik Ekle',
    icon: FaCalendarAlt,
    type: 'etkinlik',
    gradient: 'from-purple-500 to-purple-600',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
];

const BLOG_ACTIONS = [
  {
    label: 'Blog Yazısı Ekle',
    icon: FaPenFancy,
    type: 'blog_ekle',
    gradient: 'from-emerald-500 to-emerald-600',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    label: 'Blog Yazısı Düzenle/Sil',
    icon: FaListUl,
    type: 'blog_listele',
    gradient: 'from-teal-500 to-teal-600',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
  },
];

const DELETE_ACTIONS = [
  {
    label: 'Mekan Sil',
    icon: FaTrash,
    type: 'mekan_sil',
    gradient: 'from-red-500 to-red-600',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
  },
  {
    label: 'Düğün Sil',
    icon: FaTrash,
    type: 'dugun_sil',
    gradient: 'from-orange-500 to-orange-600',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    label: 'Etkinlik Sil',
    icon: FaTrash,
    type: 'etkinlik_sil',
    gradient: 'from-rose-500 to-rose-600',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
  },
];

const POPULAR_ACTIONS = [
  {
    label: 'Popüler Mekan Yönet',
    icon: FaStar,
    type: 'populer_ekle',
    gradient: 'from-amber-500 to-yellow-500',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
];

const HEADER_STYLE = 'bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20';
const CARD_STYLE =
  'bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 p-6 h-full transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]';
const BUTTON_BASE =
  'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg';

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
      gradient: 'from-[#23C8B9] via-[#1da598] to-[#188b82]',
      shimmer: 'from-white/0 via-white/30 to-white/0',
    },
    {
      label: 'Toplam Düğün',
      value: stats.dugun,
      icon: FaRing,
      gradient: 'from-pink-500 via-pink-600 to-pink-700',
      shimmer: 'from-white/0 via-white/20 to-white/0',
    },
    {
      label: 'Toplam Etkinlik',
      value: stats.etkinlik,
      icon: FaCalendarAlt,
      gradient: 'from-purple-500 via-purple-600 to-purple-700',
      shimmer: 'from-white/0 via-white/20 to-white/0',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-[#23C8B9]/5 to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#23C8B9] mx-auto"></div>
            <div className="absolute inset-0 animate-pulse rounded-full bg-[#23C8B9]/10 blur-xl"></div>
          </div>
          <p className="mt-6 text-gray-700 font-medium">Yükleniyor...</p>
          <div className="mt-2 flex items-center justify-center gap-1">
            <span
              className="h-2 w-2 bg-[#23C8B9] rounded-full animate-bounce"
              style={{ animationDelay: '0ms' }}
            ></span>
            <span
              className="h-2 w-2 bg-[#23C8B9] rounded-full animate-bounce"
              style={{ animationDelay: '150ms' }}
            ></span>
            <span
              className="h-2 w-2 bg-[#23C8B9] rounded-full animate-bounce"
              style={{ animationDelay: '300ms' }}
            ></span>
          </div>
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

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#23C8B9]/5 to-purple-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#23C8B9]/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-300/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '2s' }}
          ></div>
        </div>
        {/* Header */}
        <header className={`${HEADER_STYLE} relative z-10`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-[#23C8B9] to-purple-600 bg-clip-text text-transparent">
                  Yönetim Paneli
                </h1>
                <p className="text-sm text-gray-600 mt-2">
                  Hoş geldiniz, <span className="font-semibold text-[#23C8B9]">{user?.email}</span>
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className={`${BUTTON_BASE} text-white bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black shadow-lg hover:shadow-xl`}
              >
                <FaSignOutAlt />
                Çıkış Yap
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {STATS_CONFIG.map((stat, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
              >
                {/* Animated Shimmer Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${stat.shimmer} opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-shimmer`}
                ></div>

                <div className={`bg-gradient-to-br ${stat.gradient} p-8 relative`}>
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-white/90 text-sm font-semibold tracking-wide uppercase">
                        {stat.label}
                      </p>
                      <p className="text-white text-4xl font-bold mt-3 drop-shadow-lg">
                        {stat.value}
                      </p>
                    </div>
                    <div className="bg-white/25 backdrop-blur-md p-4 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="text-white text-3xl drop-shadow-md" />
                    </div>
                  </div>

                  {/* Decorative Circles */}
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute -top-4 -left-4 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                </div>

                <div className="px-6 py-4 bg-white/95 backdrop-blur-sm flex items-center gap-2 text-sm">
                  <FaChartLine className="text-green-500 text-lg" />
                  <span className="text-gray-700 font-medium">Son 30 gün</span>
                </div>
              </div>
            ))}
          </div>

          {/* Actions Grid - 4 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1: Add Actions */}
            <div className={CARD_STYLE}>
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3 pb-4 border-b-2 border-gray-100">
                <div className="p-3 bg-gradient-to-br from-[#23C8B9] to-[#1da598] rounded-xl shadow-md">
                  <FaPlus className="text-white text-lg" />
                </div>
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  İçerik Ekle
                </span>
              </h2>
              <div className="space-y-3">
                {ADD_ACTIONS.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleAction(action.type)}
                    className={`w-full bg-gradient-to-r ${action.gradient} text-white p-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.03] hover:shadow-xl active:scale-95 flex items-center gap-3 shadow-lg group relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300"></div>
                    <div className="bg-white/25 backdrop-blur-sm p-2.5 rounded-lg group-hover:bg-white/40 transition-all duration-300 relative z-10">
                      <action.icon className="text-xl" />
                    </div>
                    <span className="relative z-10">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Column 2: Delete Actions */}
            <div className={CARD_STYLE}>
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3 pb-4 border-b-2 border-gray-100">
                <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-md">
                  <FaTrash className="text-white text-lg" />
                </div>
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  İçerik Sil
                </span>
              </h2>
              <div className="space-y-3">
                {DELETE_ACTIONS.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleAction(action.type)}
                    className={`w-full bg-gradient-to-r ${action.gradient} text-white p-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.03] hover:shadow-xl active:scale-95 flex items-center gap-3 shadow-lg group relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300"></div>
                    <div className="bg-white/25 backdrop-blur-sm p-2.5 rounded-lg group-hover:bg-white/40 transition-all duration-300 relative z-10">
                      <action.icon className="text-xl" />
                    </div>
                    <span className="relative z-10">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Column 3: Popular Actions */}
            <div className={CARD_STYLE}>
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3 pb-4 border-b-2 border-gray-100">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl shadow-md">
                  <FaStar className="text-white text-lg" />
                </div>
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Popüler İşlemler
                </span>
              </h2>
              <div className="space-y-3">
                {POPULAR_ACTIONS.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleAction(action.type)}
                    className={`w-full bg-gradient-to-r ${action.gradient} text-white p-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.03] hover:shadow-xl active:scale-95 flex items-center gap-3 shadow-lg group relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300"></div>
                    <div className="bg-white/25 backdrop-blur-sm p-2.5 rounded-lg group-hover:bg-white/40 transition-all duration-300 relative z-10">
                      <action.icon className="text-xl" />
                    </div>
                    <span className="relative z-10">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Column 4: Blog Actions */}
            <div className={CARD_STYLE}>
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3 pb-4 border-b-2 border-gray-100">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-md">
                  <FaPenFancy className="text-white text-lg" />
                </div>
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Blog Yazıları
                </span>
              </h2>
              <div className="space-y-3">
                {BLOG_ACTIONS.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleAction(action.type)}
                    className={`w-full bg-gradient-to-r ${action.gradient} text-white p-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.03] hover:shadow-xl active:scale-95 flex items-center gap-3 shadow-lg group relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300"></div>
                    <div className="bg-white/25 backdrop-blur-sm p-2.5 rounded-lg group-hover:bg-white/40 transition-all duration-300 relative z-10">
                      <action.icon className="text-xl" />
                    </div>
                    <span className="relative z-10">{action.label}</span>
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
