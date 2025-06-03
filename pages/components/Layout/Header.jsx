import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { isAuthenticated } from '@/service/auth.service';
import { logout } from '@/utils/auth';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    setIsLogin(isAuthenticated());
  }, []);

  return (
    <header className="bg-green-600 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo dan nama toko */}
          <div className="flex items-center">
            <div className="mr-3">
              {/* Placeholder untuk logo - ganti dengan logo asli */}
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-600 font-bold text-lg">
                PR
              </div>
            </div>
            <div>
              <h1 className="text-white font-bold text-xl md:text-2xl">Toko Kelontong Pak Rangga</h1>
              <p className="text-green-100 text-xs md:text-sm">Melayani dengan sepenuh hati</p>
            </div>
          </div>

          {/* Menu desktop */}
          <div className="hidden md:flex items-center">
            <nav className="flex space-x-8 mr-8">
              <Link href="/" className="text-white hover:text-green-200 font-medium">
                Beranda
              </Link>
              <Link href="/katalog" className="text-white hover:text-green-200 font-medium">
                Katalog
              </Link>
              <Link href="/tim-kami" className="text-white hover:text-green-200 font-medium">
                Tim Kami
              </Link>
              <Link href="/testimoni" className="text-white hover:text-green-200 font-medium">
                Testimoni
              </Link>
              <Link href="/profil-toko" className="text-white hover:text-green-200 font-medium">
                Profil Toko
              </Link>
            </nav>

            {/* Tombol login */}
            <div className="flex items-center space-x-4">
              
              {!isLogin && (
                <div>
                  <Link href="/login" className="bg-white text-green-600 hover:bg-green-100 font-medium py-2 px-4 rounded-md transition duration-300">
                    Login
                  </Link>
                  <Link href="/register" className="ml-3 text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900 transition duration-300">
                    Buat Akun
                  </Link>
                </div>
              )}
              {isLogin && (
                // <Link href="/admin" className="bg-white text-green-600 hover:bg-green-100 font-medium py-2 px-4 rounded-md transition duration-300">
                //   Logout
                // </Link>
                <button 
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-300"
                  >
                    Logout
                  </button>
              )}
            </div>
          </div>

          {/* Tombol hamburger untuk mobile */}
          <div className="md:hidden flex items-center">
            {/* Keranjang mobile */}
            <Link href="/keranjang" className="text-white hover:text-green-200 mr-4" aria-label="Keranjang Belanja">
              <div className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
              </div>
            </Link>
            
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <nav className="mt-4 md:hidden">
            <div className="flex flex-col space-y-3 pb-3">
              <Link href="/" className="text-white hover:text-green-200 font-medium">
                Beranda
              </Link>
              <Link href="/katalog" className="text-white hover:text-green-200 font-medium">
                Katalog
              </Link>
              <Link href="/tim-kami" className="text-white hover:text-green-200 font-medium">
                Tim Kami
              </Link>
              <Link href="/testimoni" className="text-white hover:text-green-200 font-medium">
                Testimoni
              </Link>
              <Link href="/profil-toko" className="text-white hover:text-green-200 font-medium">
                Profil Toko
              </Link>
              <div className="pt-2 border-t border-green-500">
                <Link href="/login" className="inline-block bg-white text-green-600 hover:bg-green-100 font-medium py-2 px-4 rounded-md transition duration-300">
                  Login
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}