import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { FaEye, FaEyeSlash, FaLock, FaEnvelope, FaSpinner } from 'react-icons/fa';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Beni Hatırla seçeneğine göre persistence ayarla
      const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistence);

      // Giriş yap
      await signInWithEmailAndPassword(auth, email, password);

      // Başarılı giriş sonrası yönlendir
      router.push('/admin');
    } catch (err: any) {
      console.error('Login error:', err);
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password'
      ) {
        setError('E-posta adresi veya şifre hatalı.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyiniz.');
      } else {
        setError('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyiniz.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Şifre sıfırlama bağlantısı için lütfen e-posta adresinizi giriniz.');
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setError('');
    } catch (err: any) {
      console.error('Reset password error:', err);
      if (err.code === 'auth/user-not-found') {
        setError('Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı.');
      } else {
        setError('Şifre sıfırlama e-postası gönderilemedi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Yönetici Girişi | İzmirde Sen</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Arkaplan Deseni */}
        <div className="absolute inset-0 z-0 opacity-5">
          <Image src="/logo.svg" alt="Background Pattern" fill className="object-cover" />
        </div>

        <div className="max-w-md w-full space-y-8 relative z-10 bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100">
          <div className="text-center">
            <div className="relative w-48 h-24 mx-auto mb-6">
              <Image
                src="/logo.svg"
                alt="İzmirde Sen Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Yönetici Girişi
            </h2>
            <p className="mt-2 text-sm text-gray-600">Devam etmek için lütfen giriş yapınız.</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-shake">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {resetSent && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md animate-fade-in">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaCheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.
                  </p>
                </div>
              </div>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email-address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  E-posta Adresi
                </label>
                <div className="relative">
                  <div
                    className="absolute left-0 top-3 pl-5 pointer-events-none"
                    style={{ zIndex: 999999 }}
                  >
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-3 pl-14 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-[#23C8B9] focus:border-[#23C8B9] focus:z-10 sm:text-sm transition-all"
                    placeholder="admin@izmirdesen.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Şifre
                </label>
                <div className="relative">
                  <div
                    className="absolute left-0 top-3 pl-5 pointer-events-none"
                    style={{ zIndex: 999999 }}
                  >
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-3 pl-14 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-[#23C8B9] focus:border-[#23C8B9] focus:z-10 sm:text-sm transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none"
                    style={{ zIndex: 999999 }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#23C8B9] focus:ring-[#23C8B9] border-gray-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900 cursor-pointer select-none"
                >
                  Beni Hatırla
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="font-medium text-[#23C8B9] hover:text-[#1fa89b] transition-colors focus:outline-none"
                >
                  Şifremi Unuttum?
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[#23C8B9] hover:bg-[#1fa89b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#23C8B9] transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <FaSpinner className="animate-spin h-5 w-5 text-white" /> : 'Giriş Yap'}
              </button>
            </div>
          </form>
        </div>

        <div className="absolute bottom-4 text-center text-gray-400 text-xs">
          &copy; {new Date().getFullYear()} İzmirde Sen. Tüm hakları saklıdır.
        </div>
      </div>
    </>
  );
}

import { FaCheckCircle } from 'react-icons/fa';
