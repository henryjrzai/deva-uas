import React, { useState, useEffect } from 'react';
import { productsData, katalogProduct } from '@/pages/service/data/products';
import { getProductsDB } from "@/pages/service/product.service";
import Link from 'next/link';

const Katalog = (props) => {
  const [products, setProducts] = useState([]);
  const [load, setLoad] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
          const productsDB = await getProductsDB();
          setProducts(productsDB.data); 
      } catch (error) {
          console.error("Gagal mengambil data produk:", error);
      }
    };

    fetchProducts();
    if (props.category) {
      const formattedCategory = props.category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      setCategoryFilter(formattedCategory);
    }
  }, []);

  const katalog = katalogProduct.map(katalog => katalog.nama);
  const categories = ['all', ...katalog];

  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
      (categoryFilter === 'all' || product.category === categoryFilter)
    )
    .sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Katalog Produk</h1>
        
        {/* Search and Filters */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari produk..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                {category === 'all' ? 'Semua Kategori' : category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
              </option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name-asc">Nama (A-Z)</option>
              <option value="name-desc">Nama (Z-A)</option>
              <option value="price-asc">Harga (Terendah)</option>
              <option value="price-desc">Harga (Tertinggi)</option>
            </select>
          </div>
        </div>
        
        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Produk tidak ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={`/${product.image}`} 
                    alt={product.product} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {product.category}
                    </span>
                  </div>
                  <p className="text-xl font-bold text-green-600 mt-2">Rp {product.price.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mt-1">Stok: {product.stock}</p>
                  <Link 
                    href={`/beli/${product.id}`}
                    className="inline-block text-center mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-300"
                  >
                    Beli
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Katalog;