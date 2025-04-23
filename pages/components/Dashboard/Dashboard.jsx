import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// Jika kamu menggunakan alias, pastikan alias tersebut dikonfigurasi di jsconfig.json/tsconfig.json;
// Jika tidak, gunakan path relatif, misalnya: import { isAuthenticated, getCurrentUser, isAdmin, logout } from '../../utils/auth';
import { getCurrentUser, isAdmin, logout } from '@/pages/utils/auth';
import { isAuthenticated } from '@/pages/service/auth.service'
import Loading from '../Layout/Loading';
import Link from 'next/link';
import { getAllTransactions, getAllTransactionsDB } from '@/pages/service/transaction.service';
import { totalIncome } from '@/pages/service/transaction.service';
import { getProductsDB } from "@/pages/service/product.service";

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [transaction, setTransaction] = useState([]);
  const getAllTransactionsData = getAllTransactionsDB();
  const latestTransaction = transaction.slice(0, 5);
  

  useEffect(() => {
    // Cek autentikasi dan status admin
    const checkAuth = () => {
      if (!isAuthenticated()) {
        router.push('/');
        return;
      }

      const fetchProducts = async () => {
        try {
            const productsDB = await getAllTransactionsData;
            setProducts(productsDB.data); 
        } catch (error) {
            console.error("Gagal mengambil data produk:", error);
        }
      };
  
      fetchProducts();

      const fetchTransactions = async () => {
        try {
          const transactionsData = await getAllTransactionsDB();
          setTransaction(transactionsData.data); 
          console.log(transactionsData.data);
        } catch (error) {
            console.error("Gagal mengambil data produk:", error);
        }
      };
  
      fetchTransactions();

      const currentUser = getCurrentUser();
      if (!currentUser || !isAdmin()) {
        router.push('/');
        return;
      }

      setUser(currentUser);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <Loading/>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
          </div>
          <div className="mb-8">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Selamat datang, <span className="font-semibold">{user?.name || user?.username}</span>!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contoh Summary Cards Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Produk</h3>
                  <div className="mt-1 text-3xl font-semibold text-gray-900">{products.length}</div>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/admin/products" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Kelola Produk &rarr;
                </Link>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Transaksi</h3>
                  <div className="mt-1 text-3xl font-semibold text-gray-900">{transaction.length}</div>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/admin/histori" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Lihat Histori &rarr;
                </Link>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Pendapatan</h3>
                  <div className="mt-1 text-3xl font-semibold text-gray-900">{totalIncome}</div>
                </div>
              </div>
              <div className="mt-4">
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Lihat Laporan &rarr;
                </a>
              </div>
            </div>
          </div>

          {/* Tabel Transaksi Terbaru */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Transaksi Terbaru</h2>
            <div className="bg-white border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {latestTransaction.map((transaction) => (
                    <tr key={transaction.id}> {/* Menambahkan key unik untuk setiap transaksi */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.customer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.status === 'Selesai' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
