import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FaTimes } from 'react-icons/fa';
import YaziOlusturucu from './YaziOlusturucu';

interface YaziModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'create' | 'edit';
  editSlug?: string;
}

export default function YaziModal({ isOpen, onClose, mode = 'create', editSlug }: YaziModalProps) {
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && mode === 'edit' && editSlug) {
      fetchArticle();
    } else {
      setInitialData(null);
    }
  }, [isOpen, mode, editSlug]);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/icerik/get-makale?url=${editSlug}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Makale çekilemedi');
      }

      setInitialData({
        frontmatter: data.frontmatter,
        content: data.content,
        url: data.url,
      });
    } catch (error: any) {
      console.error('Makale çekme hatası:', error);
      alert('Hata: ' + error.message);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (content: string, url: string) => {
    try {
      if (mode === 'edit' && editSlug) {
        // Güncelleme
        const res = await fetch('/api/icerik/guncelle-makale', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ oldUrl: editSlug, newUrl: url, content }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Bir hata oluştu');
        }

        alert('Makale başarıyla güncellendi!');
      } else {
        // Yeni oluşturma
        const res = await fetch('/api/icerik/makale-olustur', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content, url }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Bir hata oluştu');
        }

        alert('Makale başarıyla oluşturuldu!');
      }

      onClose();
    } catch (error: any) {
      console.error('Kaydetme hatası:', error);
      alert('Hata: ' + error.message);
    }
  };

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
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="h-screen w-screen bg-white">
              <div className="relative h-full">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 bg-white hover:bg-gray-100 rounded-full transition-colors shadow-lg"
                >
                  <FaTimes className="text-gray-500 text-xl" />
                </button>

                {/* Content */}
                <div className="h-full overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Makale yükleniyor...</p>
                      </div>
                    </div>
                  ) : (
                    <YaziOlusturucu onSave={handleSave} initialData={initialData} />
                  )}
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
