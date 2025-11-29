import React, { useState, useEffect } from 'react';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { FaCloudUploadAlt, FaTimes, FaPlus, FaTrash, FaSave } from 'react-icons/fa';

interface ArticleCreatorProps {
  onSave?: (content: string, url: string) => void;
  initialData?: any;
}

// Türkçe karakter destekli url (slug) oluşturma
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Türkçe karakter destekli Title Case
const toTitleCase = (text: string) => {
  return text
    .split(' ')
    .map(
      (word) => word.toLocaleUpperCase('tr-TR').charAt(0) + word.toLocaleLowerCase('tr-TR').slice(1)
    )
    .join(' ');
};

export default function ArticleCreator({ onSave, initialData }: ArticleCreatorProps) {
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    author: 'Beste Caner',
    description: '',
    folder: '',
    image: '',
  });

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [content, setContent] = useState('');
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [generatedMarkdown, setGeneratedMarkdown] = useState('');

  // initialData varsa formu doldur
  useEffect(() => {
    if (initialData) {
      const { frontmatter, content: markdownContent } = initialData;
      if (frontmatter) {
        setFormData({
          title: frontmatter.title || '',
          date: frontmatter.date
            ? frontmatter.date.split('T')[0]
            : new Date().toISOString().split('T')[0],
          author: frontmatter.author || 'Beste Caner',
          description: frontmatter.description || '',
          folder: frontmatter.folder || '',
          image: frontmatter.image || '',
        });
        setTags(frontmatter.tags || []);
      }
      if (markdownContent) {
        setContent(markdownContent);
      }
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'folder') {
      setFormData((prev) => ({ ...prev, [name]: toTitleCase(value) }));
    } else if (name === 'title') {
      setFormData((prev) => ({ ...prev, [name]: toTitleCase(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const uploadFile = async (file: File, folder: string = 'blog-images') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    formData.append('public_id', `blog_${Date.now()}`);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.url;
  };

  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: previewUrl }));
    }
  };

  const handleEditorImageUpload = async (file: File) => {
    try {
      const url = await uploadFile(file, 'blog-content');
      return url;
    } catch (error) {
      console.error('Editor image upload failed:', error);
      alert('Resim yüklenirken bir hata oluştu.');
      return '';
    }
  };

  const generateMarkdown = async () => {
    setUploading(true);
    try {
      let finalImageUrl = formData.image;

      if (coverImageFile) {
        finalImageUrl = await uploadFile(coverImageFile, 'blog-covers');
      }

      const url = slugify(formData.title);

      // Tarih formatı: ISO string (örn: 2025-11-29T18:21:58.840Z)
      // Seçilen tarihe şu anki saati ekleyerek oluşturuyoruz
      const selectedDate = new Date(formData.date);
      const now = new Date();
      selectedDate.setHours(
        now.getHours(),
        now.getMinutes(),
        now.getSeconds(),
        now.getMilliseconds()
      );
      const isoDate = selectedDate.toISOString();

      const frontmatter = `---
title: '${formData.title}'
date: '${isoDate}'
author: '${formData.author}'
description: '${formData.description}'
tags: [${tags.map((t) => `'${t}'`).join(', ')}]
folder: '${formData.folder}'
image: '${finalImageUrl}'
---

`;
      const fullContent = frontmatter + content;
      setGeneratedMarkdown(fullContent);

      if (onSave) {
        onSave(fullContent, url);
      }
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Makale oluşturulurken bir hata oluştu.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-[#23C8B9] to-[#1fa89b] p-6 text-white flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaPlus className="text-white/80" />
            Yeni Makale Oluştur
          </h1>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-1 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Başlık</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#23C8B9] focus:border-transparent transition-all outline-none"
                  placeholder="Makale başlığı..."
                />
                {formData.title && (
                  <p className="text-xs text-gray-500 mt-1">URL: {slugify(formData.title)}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tarih</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#23C8B9] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Yazar</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    readOnly
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Kategori / Klasör
                </label>
                <input
                  type="text"
                  name="folder"
                  value={formData.folder}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#23C8B9] outline-none"
                  placeholder="Örn: İzmir Mekan Rehberi"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Açıklama
                  <span
                    className={`ml-2 text-xs ${formData.description.length > 155 ? 'text-red-500' : 'text-gray-400'}`}
                  >
                    ({formData.description.length}/155)
                  </span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={155}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#23C8B9] outline-none resize-none"
                  placeholder="Kısa özet (max 155 karakter)..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Etiketler</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-[#23C8B9]/10 text-[#23C8B9] px-2 py-1 rounded-md text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button onClick={() => removeTag(index)} className="hover:text-red-500">
                        <FaTimes size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#23C8B9] outline-none"
                  placeholder="Etiket ekle ve Enter'a bas..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Kapak Resmi
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#23C8B9] transition-colors relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {formData.image ? (
                    <div className="relative">
                      <img
                        src={formData.image}
                        alt="Kapak"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                        <span className="text-white font-medium">Değiştir</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8">
                      <FaCloudUploadAlt className="mx-auto text-4xl text-gray-400 mb-2" />
                      <p className="text-gray-500 text-sm">
                        Resim seçmek için tıklayın veya sürükleyin
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editor */}
          <div className="lg:col-span-2 flex flex-col h-full min-h-[600px]">
            <label className="block text-sm font-semibold text-gray-700 mb-1">İçerik Editörü</label>
            <div className="flex-1 border border-gray-300 rounded-lg overflow-hidden shadow-sm">
              <MdEditor
                value={content}
                style={{ height: '100%' }}
                renderHTML={(text) => (
                  <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
                    {text}
                  </ReactMarkdown>
                )}
                onChange={({ text }) => setContent(text)}
                onImageUpload={handleEditorImageUpload}
                view={{ menu: true, md: true, html: true }}
                canView={{
                  menu: true,
                  md: true,
                  html: true,
                  fullScreen: true,
                  hideMenu: true,
                  both: true,
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 p-6 border-t border-gray-200 flex justify-end gap-4">
          <button
            onClick={generateMarkdown}
            disabled={uploading}
            className="flex items-center gap-2 px-6 py-3 bg-[#23C8B9] text-white rounded-lg hover:bg-[#1fa89b] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Oluşturuluyor...
              </>
            ) : (
              <>
                <FaSave />
                Makaleyi Oluştur
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Output Preview */}
    </div>
  );
}
