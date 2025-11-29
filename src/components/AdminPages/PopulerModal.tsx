import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FaTimes, FaSave, FaCheck } from 'react-icons/fa';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface PopulerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MekanItem {
  id: string;
  baslik: string;
  kategori?: string;
  populer: boolean;
  createdAt: string;
}

export default function PopulerModal({ isOpen, onClose }: PopulerModalProps) {
  const [items, setItems] = useState<MekanItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmItem, setConfirmItem] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Record<string, boolean>>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'mekanlar'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const data: MekanItem[] = [];
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        data.push({
          id: doc.id,
          baslik: docData.baslik || 'İsimsiz',
          kategori: docData.kategori,
          populer: docData.populer || false,
          createdAt: docData.createdAt || '',
        });
      });

      setItems(data);
      setPendingChanges({});
    } catch (error) {
      console.error('Veri çekme hatası:', error);
      alert('Veriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchChange = (id: string, currentValue: boolean) => {
    setConfirmItem(id);
  };

  const confirmChange = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const newValue = !item.populer;

    // Pending changes'e ekle
    setPendingChanges((prev) => ({
      ...prev,
      [id]: newValue,
    }));

    // UI'da güncelle
    setItems((prevItems) => prevItems.map((i) => (i.id === id ? { ...i, populer: newValue } : i)));

    setConfirmItem(null);
  };

  const handleSave = async () => {
    if (Object.keys(pendingChanges).length === 0) {
      alert('Değişiklik yok.');
      return;
    }

    setSaving(true);
    try {
      const batch = writeBatch(db);

      Object.entries(pendingChanges).forEach(([id, populer]) => {
        const docRef = doc(db, 'mekanlar', id);
        batch.update(docRef, { populer });
      });

      await batch.commit();

      setPendingChanges({});
      alert('Değişiklikler başarıyla kaydedildi!');
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      alert('Kaydetme işlemi başarısız oldu.');
    } finally {
      setSaving(false);
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
      });
    } catch {
      return dateStr;
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const hasChanges = Object.keys(pendingChanges).length > 0;

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
              <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 text-white flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Popüler Mekan Yönetimi</h2>
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
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
                      <p className="mt-4 text-gray-600">Yükleniyor...</p>
                    </div>
                  ) : items.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">Mekan bulunamadı.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                            item.populer
                              ? 'bg-yellow-50 border-yellow-300'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                              {item.baslik}
                              {item.populer && (
                                <span className="text-yellow-500 text-sm">⭐ Popüler</span>
                              )}
                            </h3>
                            <div className="flex gap-4 mt-1 text-sm text-gray-500">
                              {item.kategori && (
                                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-md">
                                  {item.kategori}
                                </span>
                              )}
                              <span>{formatDate(item.createdAt)}</span>
                            </div>
                          </div>

                          {confirmItem === item.id ? (
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => confirmChange(item.id)}
                                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                              >
                                Evet, Değiştir
                              </button>
                              <button
                                onClick={() => setConfirmItem(null)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                              >
                                İptal
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleSwitchChange(item.id, item.populer)}
                              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ml-4 ${
                                item.populer ? 'bg-yellow-500' : 'bg-gray-300'
                              }`}
                            >
                              <span
                                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                                  item.populer ? 'translate-x-7' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {hasChanges ? (
                      <span className="text-yellow-600 font-medium">
                        {Object.keys(pendingChanges).length} değişiklik kaydedilmeyi bekliyor
                      </span>
                    ) : (
                      <span>Değişiklik yok</span>
                    )}
                  </div>

                  <button
                    onClick={handleSave}
                    disabled={!hasChanges || saving}
                    className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Kaydediliyor...
                      </>
                    ) : (
                      <>
                        <FaSave />
                        Değişiklikleri Kaydet
                      </>
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
