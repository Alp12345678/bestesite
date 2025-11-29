import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FaTimes, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface VeriSilmeModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'mekan_sil' | 'dugun_sil' | 'etkinlik_sil';
}

interface DataItem {
  id: string;
  baslik: string;
  kategori?: string;
  createdAt: string;
}

export default function VeriSilmeModal({ isOpen, onClose, type }: VeriSilmeModalProps) {
  const [items, setItems] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const getCollectionName = () => {
    switch (type) {
      case 'mekan_sil':
        return 'mekanlar';
      case 'dugun_sil':
        return 'dugunler';
      case 'etkinlik_sil':
        return 'etkinlikler';
      default:
        return 'mekanlar';
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'mekan_sil':
        return 'Mekan Sil';
      case 'dugun_sil':
        return 'Düğün Sil';
      case 'etkinlik_sil':
        return 'Etkinlik Sil';
      default:
        return 'Veri Sil';
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const collectionName = getCollectionName();
      const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const data: DataItem[] = [];
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        data.push({
          id: doc.id,
          baslik: docData.baslik || 'İsimsiz',
          kategori: docData.kategori,
          createdAt: docData.createdAt || '',
        });
      });

      setItems(data);
    } catch (error) {
      console.error('Veri çekme hatası:', error);
      alert('Veriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const collectionName = getCollectionName();
      await deleteDoc(doc(db, collectionName, id));

      // Listeyi güncelle
      setItems(items.filter((item) => item.id !== id));
      setDeleteConfirm(null);
      alert('Başarıyla silindi!');
    } catch (error) {
      console.error('Silme hatası:', error);
      alert('Silme işlemi başarısız oldu.');
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Tarih yok';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, type]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white flex justify-between items-center">
                  <h2 className="text-2xl font-bold">{getTitle()}</h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <FaTimes className="text-white text-xl" />
                  </button>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
                      <p className="mt-4 text-gray-600">Yükleniyor...</p>
                    </div>
                  ) : items.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">Silinecek veri bulunamadı.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-red-300 transition-colors"
                        >
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{item.baslik}</h3>
                            <div className="flex gap-4 mt-1 text-sm text-gray-500">
                              {item.kategori && (
                                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-md">
                                  {item.kategori}
                                </span>
                              )}
                              <span>{formatDate(item.createdAt)}</span>
                            </div>
                          </div>

                          {deleteConfirm === item.id ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                              >
                                Evet, Sil
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                              >
                                İptal
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(item.id)}
                              className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors ml-4"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-4 border-t border-gray-200 flex items-center gap-2 text-sm text-gray-600">
                  <FaExclamationTriangle className="text-yellow-500" />
                  <span>Silme işlemi geri alınamaz. Lütfen dikkatli olun.</span>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
