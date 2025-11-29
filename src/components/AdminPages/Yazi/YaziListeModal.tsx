import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FaTimes, FaEdit, FaTrash } from 'react-icons/fa';

interface YaziListeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (url: string) => void;
}

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  folder: string;
}

export default function YaziListeModal({ isOpen, onClose, onEdit }: YaziListeModalProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/icerik/get-makaleler');
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Veri çekme hatası:', error);
      alert('Yazılar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (url: string) => {
    try {
      const res = await fetch('/api/icerik/sil-makale', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Bir hata oluştu');
      }

      alert('Makale başarıyla silindi!');
      setPosts(posts.filter((p) => p.slug !== url));
      setDeleteConfirm(null);
    } catch (error: any) {
      console.error('Silme hatası:', error);
      alert('Hata: ' + error.message);
    }
  };

  const formatDate = (dateStr: string) => {
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
      fetchPosts();
    }
  }, [isOpen]);

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
                <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 text-white flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Blog Yazıları</h2>
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
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
                      <p className="mt-4 text-gray-600">Yükleniyor...</p>
                    </div>
                  ) : posts.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">Blog yazısı bulunamadı.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {posts.map((post) => (
                        <div
                          key={post.slug}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-teal-300 transition-colors"
                        >
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{post.title}</h3>
                            <div className="flex gap-4 mt-1 text-sm text-gray-500">
                              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-md">
                                {post.folder}
                              </span>
                              <span>{formatDate(post.date)}</span>
                            </div>
                          </div>

                          {deleteConfirm === post.slug ? (
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => handleDelete(post.slug)}
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
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => {
                                  onEdit(post.slug);
                                  onClose();
                                }}
                                className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(post.slug)}
                                className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
