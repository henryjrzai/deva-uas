import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// Gunakan path relatif jika folder utils berada di root
import { isAuthenticated, getCurrentUser } from '@/pages/utils/auth';
import { login } from "../../service/auth.service";
import Link from 'next/link';

const LoginPage = () => {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Cek jika user sudah login, langsung redirect ke dashboard atau landing page
  useEffect(() => {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      console.log('User already authenticated:', user);
      if (user && user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value.trim() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        username: credentials.email,
        password: credentials.password,
      }
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("password", data.password);

      const response = await fetch("/api/loginUser", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if(result.status === 200) {
        setMessage('Login berhasil! Mengalihkan...');
        // Redirect berdasarkan role user
        if (result.user.role === 'admin') {
          login(result.user);
          router.push('/admin');
        } else {
          login(result.user);
          router.push('/');
        }
      } else {
        setError(result.message);
      }
      
    } catch (err) {
      console.error('Error during login:', err);
      setError(err.message || 'Login gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Login ke Toko Kelontong
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Silakan masukkan email dan password Anda
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p>{error}</p>
          </div>
        )}

        {message && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
            <p>{message}</p>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email atau username
              </label>
              <input
                id="email"
                name="email"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Email atau username"
                value={credentials.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Memproses...' : 'Login'}
            </button>
          </div>

          <div className="text-center">
            <p className=" text-sm text-gray-600">
              Belum punya akun?{' '}
              <Link
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
                onClick={(e) => {
                  e.preventDefault();
                  router.push('/register');
                }}
              >
                Daftar di sini
              </Link>
            </p>
            <p className=" text-sm text-gray-600">
              <Link
                href="/auth/forgotpassword"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                lupa password?
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
