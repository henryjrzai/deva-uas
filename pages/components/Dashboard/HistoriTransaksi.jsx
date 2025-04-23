import Link from 'next/link';
import { getAllTransactions, getAllTransactionsDB } from '@/pages/service/transaction.service';
import { useEffect, useState } from 'react';
export default function HistoriTransaksi() {
  const [transactions, setTransactions] = useState([]);
  const transactionsDB = getAllTransactionsDB()
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const transactionsData = await transactionsDB;
        setTransactions(transactionsData.data); 
      } catch (error) {
          console.error("Gagal mengambil data produk:", error);
      }
    };

    fetchTransactions();
    setTransactions(getAllTransactions);
  }, transactionsDB)
    return (
      <div className="">
        <Link href="/admin" className="italic text-blue-500">&#x21d0; Kembali</Link>
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
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah
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
              {transactions.map((transaction) => (
              <tr key={transaction.id}> {/* Menambahkan key unik untuk setiap transaksi */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.trxid}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.customername}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.item}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.qty}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${transaction.status==='Selesai' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {transaction.status}
                  </span>
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  