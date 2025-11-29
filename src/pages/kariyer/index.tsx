import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { FaPaperPlane, FaCheckCircle } from 'react-icons/fa';

export default function Kariyer() {
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    message: '',
  });

  // Error state
  const [errors, setErrors] = useState({
    email: '',
    phone: '',
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Her kelimenin ilk harfini büyüt
    const formatted = val.replace(/\b\w/g, (char) => char.toUpperCase());
    setFormData({ ...formData, name: formatted });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ''); // Sadece rakamları al

    // Eğer 5 ile başlıyorsa başına 0 ekle
    if (val.startsWith('5')) {
      val = '0' + val;
    }

    // Maksimum 11 hane (05XX XXX XX XX)
    if (val.length > 11) {
      val = val.slice(0, 11);
    }

    setFormData({ ...formData, phone: val });

    // Basit validasyon
    if (val.length > 0 && val.length < 11) {
      setErrors((prev) => ({
        ...prev,
        phone: 'Lütfen geçerli bir telefon numarası giriniz (11 hane).',
      }));
    } else {
      setErrors((prev) => ({ ...prev, phone: '' }));
    }
  };

  const handleEmailBlur = () => {
    if (formData.email && !formData.email.includes('@')) {
      setErrors((prev) => ({ ...prev, email: 'Lütfen geçerli bir e-posta adresi giriniz.' }));
    } else {
      setErrors((prev) => ({ ...prev, email: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Son kontrol
    if (!formData.email.includes('@')) {
      setErrors((prev) => ({ ...prev, email: 'Lütfen geçerli bir e-posta adresi giriniz.' }));
      return;
    }
    if (formData.phone.length !== 11) {
      setErrors((prev) => ({ ...prev, phone: 'Telefon numarası 11 haneli olmalıdır.' }));
      return;
    }

    // API çağrısı simülasyonu
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', position: '', message: '' });
    }, 5000);
  };

  return (
    <>
      <Head>
        <title>Kariyer | İzmirde Sen</title>
        <meta
          name="description"
          content="İzmirde Sen ekibine katılın! Başvuru formunu doldurarak bize katılın."
        />
      </Head>

      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/carousel/1.webp" alt="Kariyer Hero" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            Birlikte <span className="text-[#23C8B9]">Büyüyelim</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8 animate-fade-in-up delay-100">
            İzmir'in en dinamik ekibine katılın ve şehrin ritmini birlikte belirleyelim. Yaratıcı,
            tutkulu ve yenilikçi takım arkadaşları arıyoruz.
          </p>
          <button
            onClick={() =>
              document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="bg-[#23C8B9] hover:bg-[#1fa89b] text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg animate-fade-in-up delay-200"
          >
            Başvuru Yap
          </button>
        </div>
      </div>

      {/* Başvuru Formu */}
      <section id="application-form" className="py-4 bg-[#F9FAFB]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Başvuru Formu</h2>
              <p className="text-gray-600">
                Aşağıdaki formu doldurarak bize katılmak için ilk adımı atın.
              </p>
            </div>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center animate-fade-in">
                <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Başvurunuz Alındı!</h3>
                <p className="text-gray-600">
                  Başvurunuz bize ulaştı. En kısa sürede sizinle iletişime geçeceğiz.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleNameChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#23C8B9] focus:ring-2 focus:ring-[#23C8B9]/20 outline-none transition-all"
                      placeholder="Adınız Soyadınız"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta Adresi
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      onBlur={handleEmailBlur}
                      className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:border-[#23C8B9] focus:ring-2 focus:ring-[#23C8B9]/20 outline-none transition-all`}
                      placeholder="ornek@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon Numarası
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.phone ? 'border-red-500' : 'border-gray-200'} focus:border-[#23C8B9] focus:ring-2 focus:ring-[#23C8B9]/20 outline-none transition-all`}
                      placeholder="05052555079"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label
                      htmlFor="position"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Başvurulan Pozisyon
                    </label>
                    <select
                      id="position"
                      required
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#23C8B9] focus:ring-2 focus:ring-[#23C8B9]/20 outline-none transition-all appearance-none"
                    >
                      <option value="">Seçiniz</option>
                      <option value="social-media">Sosyal Medya Uzmanı</option>
                      <option value="content-editor">İçerik Editörü</option>
                      <option value="marketing">Satış & Pazarlama</option>
                      <option value="videographer">Videographer</option>
                      <option value="general">Genel Başvuru</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Ön Yazı / Mesajınız
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#23C8B9] focus:ring-2 focus:ring-[#23C8B9]/20 outline-none transition-all resize-none"
                    placeholder="Kendinizden kısaca bahsedin..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#23C8B9] hover:bg-[#1fa89b] text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <FaPaperPlane />
                  <span>Başvuruyu Gönder</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
