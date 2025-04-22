import { useRouter } from 'next/router';
import Layout from '../components/Layout/Layout';
import loading from '../components/Layout/Loading';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createTransaction } from '../service/transaction.service';
import { isAuthenticated } from '@/pages/service/auth.service'
import { getProductByIdDB } from '../service/product.service';

export default function Page() {
    const router = useRouter();
    const [product, setProduct] = useState({});
    const [load, setLoad] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [total, setTotal] = useState(0);
    const [user, setUser] = useState("");

    useEffect(() => {
        if (!router.isReady) return;
        if (!isAuthenticated()) {
            router.push('/katalog');
            return;
        }

        const fetchProducts = async () => {
            try {
                const productDB = await getProductByIdDB(router.query.id);
                setProduct(productDB.data[0]); // sesuai struktur API handler kamu
                setTotal(productDB.data[0].price); 
                setLoad(false);
            } catch (error) {
                console.error("Gagal mengambil data produk:", error);
            }
        };
    
        fetchProducts();
        setTotal(product.price * quantity)
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser.name);
        }
    }, [router.query.id]);

    const addQty = () => {
        setQuantity(quantity + 1);
        setTotal(product.price * (quantity + 1))
    }

    const subQty = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
            setTotal(product.price * (quantity - 1))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            id: `#TRX-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '')}`,
            date: new Date().toLocaleDateString('id-ID'),
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            item: product.product,
            qty: quantity,
            customer: user, 
            amount: total,
            status: "Selesai",
        };
        // buatkan fungsi untuk menyimpan data transaksi
        const transaction = createTransaction(data);
        console.log(data)
        if (transaction) {
            alert('Transaksi berhasil');
            router.push('/katalog');
        } else {
            alert('Transaksi gagal');
        }
    }

    if (load) {
        return <loading/>
    }

    return (
        <Layout>
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <Link href="/katalog" className="italic text-blue-500">&#x21d0; Kembali</Link>
                        <h2 className="text-2xl font-bold">Detail Produk</h2>
                        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-2">
                            <div className="flex items-center">
                                <img src={`/${product.image}`} alt={product.name} className="w-sm h-full object-cover"/>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold">{product.name}</h3>
                                <p className="italic">{product.category}</p>
                                <p>{product.price?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
                                <p>{product.description}</p>
                                <div className="mt-4">
                                <form class="max-w-sm" onSubmit={handleSubmit}>
                                    <label for="qty" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Jumlah :</label>
                                    <div className="flex gap-2 items-center">
                                        <button onClick={subQty} type="button" class="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:focus:ring-yellow-900">-</button>
                                        <input type="number" id="qty" readOnly aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={quantity} required />
                                        <button onClick={addQty} type="button" class="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:focus:ring-yellow-900">+</button>
                                    </div>
                                    <div className="mt-4">
                                        <label for="totalPrice" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total harga :</label>
                                        <h3 className="text-xl font-bold">{total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</h3>
                                        <input type="number" hidden id="totalPrice" aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={total} required />
                                    </div>
                                    <button type="submit" class="w-full mt-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-bold rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Beli</button>
                                </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}