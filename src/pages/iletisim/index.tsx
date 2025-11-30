import React, { useState } from 'react';
import Image from 'next/image';
import { FaPaperPlane, FaCheckCircle, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { NextSeo } from 'next-seo';
import { LocalBusinessJsonLd } from 'next-seo';

export default function Iletisim() {
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
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
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 5000);
  };

  return (
    <>
      <NextSeo
        title="İletişim | İzmirde Sen"
        description="İzmirde Sen ile iletişime geçin. Sorularınız için bize ulaşın."
        canonical="https://www.izmirdesen.com/iletisim"
        openGraph={{
          url: 'https://www.izmirdesen.com/iletisim',
          title: 'İletişim | İzmirde Sen',
          description:
            'İzmirde Sen ile iletişime geçin. Soru, görüş ve önerileriniz için bize ulaşın.',
          images: [
            {
              url: 'https://www.izmirdesen.com/og-image.png',
              width: 1200,
              height: 630,
              alt: 'İzmirde Sen - İletişim',
            },
          ],
          siteName: 'İzmirde Sen',
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
      />
      <LocalBusinessJsonLd
        type="Organization"
        id="https://www.izmirdesen.com"
        name="İzmirde Sen"
        description="İzmir'in nabzını tutan etkinlik ve mekan rehberi"
        url="https://www.izmirdesen.com"
        telephone="+905052555079"
        address={{
          streetAddress: 'İsmet Kaptan Mah. Gazi Osman Paşa Blv. No:3 D:812',
          addressLocality: 'Konak',
          addressRegion: 'İzmir',
          postalCode: '35210',
          addressCountry: 'TR',
        }}
        geo={{
          latitude: '38.4260832',
          longitude: '27.1340301',
        }}
        images={['https://www.izmirdesen.com/og-image.png']}
        sameAs={[
          'https://twitter.com/izmirdesen',
          'https://www.instagram.com/izmirdesen',
          'https://www.facebook.com/izmirdesen',
        ]}
      />

      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/carousel/1.webp"
            alt="İletişim Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-up">
            İletişime <span className="text-[#23C8B9]">Geçin</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto animate-fade-in-up delay-100">
            Sorularınız, önerileriniz veya işbirlikleri için bizimle iletişime geçmekten çekinmeyin.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* İletişim Bilgileri */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 h-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">İletişim Bilgileri</h2>

              <div className="space-y-8">
                <a
                  href="https://maps.app.goo.gl/6E5eSjt7QtsNCV1s9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 bg-[#23C8B9]/10 rounded-full flex items-center justify-center text-[#23C8B9] group-hover:bg-[#23C8B9] group-hover:text-white transition-colors flex-shrink-0">
                    <FaMapMarkerAlt className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Adres</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Picco Film
                      <br />
                      İsmet Kaptan Mah. Gazi Osman Paşa Blv.
                      <br />
                      No:3 D:812 Konak/İzmir
                    </p>
                  </div>
                </a>

                <a
                  href="https://wa.me/905052555079"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 bg-[#23C8B9]/10 rounded-full flex items-center justify-center text-[#23C8B9] group-hover:bg-[#23C8B9] group-hover:text-white transition-colors flex-shrink-0">
                    <FaPhone className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Telefon</h3>
                    <p className="text-gray-600 text-sm">+90 505 255 50 79</p>
                  </div>
                </a>

                <a href="mailto:info@izmirdesen.com" className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-[#23C8B9]/10 rounded-full flex items-center justify-center text-[#23C8B9] group-hover:bg-[#23C8B9] group-hover:text-white transition-colors flex-shrink-0">
                    <FaEnvelope className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">E-posta</h3>
                    <p className="text-gray-600 text-sm">info@izmirdesen.com</p>
                  </div>
                </a>
              </div>

              <div className="mt-8 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3125.6659890868355!2d27.1340301!3d38.4260832!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14bbd951471c5943%3A0x999e777164605c2!2sPicco%20Film%20%C4%B0zmir!5e0!3m2!1str!2str!4v1764444326834!5m2!1str!2str"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>

          {/* İletişim Formu */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Bize Yazın</h2>
                <p className="text-gray-600">
                  Aşağıdaki formu doldurarak bize mesaj gönderebilirsiniz. En kısa sürede dönüş
                  yapacağız.
                </p>
              </div>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center animate-fade-in py-20">
                  <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Mesajınız Alındı!</h3>
                  <p className="text-gray-600">Mesajınız bize ulaştı. Teşekkür ederiz.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
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
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
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
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
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
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Konu
                      </label>
                      <input
                        type="text"
                        id="subject"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#23C8B9] focus:ring-2 focus:ring-[#23C8B9]/20 outline-none transition-all"
                        placeholder="Mesajınızın konusu"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Mesajınız
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#23C8B9] focus:ring-2 focus:ring-[#23C8B9]/20 outline-none transition-all resize-none"
                      placeholder="Bize iletmek istediğiniz mesaj..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#23C8B9] hover:bg-[#1fa89b] text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    <FaPaperPlane />
                    <span>Mesajı Gönder</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
