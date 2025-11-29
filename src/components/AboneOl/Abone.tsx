'use client';

import Image from 'next/image';
import InstagramEmbed from './Instagram';
import { FaPaperPlane, FaInstagram } from 'react-icons/fa';

export default function AboneOl() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Arkaplan Deseni - Opaklığı düşürüldü */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <Image
          src="/abone/1.webp" // Mevcut görseli desen olarak kullanıyoruz
          alt="Pattern"
          fill
          className="object-cover grayscale"
        />
      </div>

      {/* Dekoratif Gradientler - Açık tema için revize edildi */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#23C8B9]/20 rounded-full blur-3xl mix-blend-multiply" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl mix-blend-multiply" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
          {/* Sol: Bülten Aboneliği */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <span className="text-[#23C8B9]  text-4xl md:text-5xl font-bold">
                Keşfetmeye Hazır mısın?
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-gray-900">
                İzmir'in En Özel <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#23C8B9] to-emerald-500">
                  Deneyimlerini Yakala
                </span>
              </h2>
              <p className="text-gray-600 text-lg max-w-xl leading-relaxed">
                Şehrin gizli kalmış mekanları, yaklaşan etkinlikler ve sadece abonelerimize özel
                fırsatlardan ilk senin haberin olsun.
              </p>
            </div>

            <div className="bg-white p-2 rounded-full shadow-lg border border-gray-100 max-w-md group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#23C8B9] to-emerald-400 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500 -z-10" />
              <form className="flex items-center">
                <input
                  type="email"
                  placeholder="E-posta adresinizi yazın..."
                  className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 px-6 py-3 focus:outline-none caret-[#23C8B9]"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#23C8B9] hover:bg-[#1fa89b] text-white p-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
                >
                  <span className="hidden sm:inline font-medium">Abone Ol</span>
                  <FaPaperPlane className="text-sm" />
                </button>
              </form>
            </div>
          </div>

          {/* Sağ: Instagram / Sosyal Medya */}
          <div className="w-full lg:w-5/12">
            <div className="relative group">
              {/* Arka Plan Efekti */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#23C8B9]/20 to-purple-500/20 rounded-[2.5rem] blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative bg-white rounded-[2rem] p-6 shadow-xl border border-gray-100">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px]">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                        <FaInstagram className="text-gray-900 text-xl" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">izmirde.sen</h3>
                      <p className="text-xs text-gray-500">İzmir'in Kalbi Burada Atıyor</p>
                    </div>
                  </div>
                  <a
                    href="https://www.instagram.com/izmirde.sen/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#23C8B9]/10 text-[#23C8B9] px-5 py-2 rounded-full text-sm font-bold hover:bg-[#23C8B9] hover:text-white transition-all duration-300"
                  >
                    Takip Et
                  </a>
                </div>

                {/* Instagram Embed Bileşeni */}
                <div className="rounded-2xl overflow-hidden bg-gray-50 min-h-[400px]">
                  <InstagramEmbed />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
