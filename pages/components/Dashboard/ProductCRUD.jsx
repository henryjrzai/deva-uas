import React, { useState, useEffect } from 'react';
import { fetchProducts } from '@/utils/api';

// Assuming these API functions exist in the api.js file
// If not, you'll need to implement them
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';

async function fetchAPI(endpoint, options = {}) {
  try {
    if (!options.headers) {
      options.headers = {
        'Content-Type': 'application/json',
      };
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Additional API functions for CRUD operations
async function createProduct(productData) {
  return fetchAPI('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
}

async function updateProduct(id, productData) {
  return fetchAPI(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  });
}

async function deleteProduct(id) {
  return fetchAPI(`/products/${id}`, {
    method: 'DELETE',
  });
}

async function fetchProductById(id) {
  return fetchAPI(`/products/${id}`);
}

const ProductCRUD = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  
  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    name: '',
    price: 0,
    category: 'sembako',
    stock: 0,
    image: ''
  });
  
  // For confirmation dialog
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Categories
  const categories = ['sembako', 'bumbu', 'bahan-kue', 'minuman'];

  // Load products on component mount
  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
        console.error('Error fetching products:', err);
      }
    };

    getProducts();
  }, []);

  // For demo purposes if API is not ready
  useEffect(() => {
    // Only use demo data if real API call isn't working
    if (products.length === 0 && !loading) {
      const demoProducts = [
        { id: 1, name: 'Beras Premium', price: 65000, category: 'sembako', stock: 25, image: '/assets/produk-a.jpg' },
        { id: 2, name: 'Minyak Goreng', price: 20000, category: 'sembako', stock: 30, image: '/assets/produk-b.jpg' },
        { id: 3, name: 'Kecap Manis', price: 15000, category: 'bumbu', stock: 40, image: '/assets/produk-c.jpg' },
        { id: 4, name: 'Gula Pasir', price: 12500, category: 'sembako', stock: 20, image: '/assets/produk-a.jpg' },
        { id: 5, name: 'Tepung Terigu', price: 10000, category: 'bahan-kue', stock: 15, image: '/assets/produk-b.jpg' },
        { id: 6, name: 'Susu Kaleng', price: 15000, category: 'minuman', stock: 25, image: '/assets/produk-c.jpg' },
      ];
      setProducts(demoProducts);
    }
  }, [products, loading]);

  // Filter and sort products
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

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Convert price and stock to numbers
    if (name === 'price' || name === 'stock') {
      setCurrentProduct({
        ...currentProduct,
        [name]: value === '' ? '' : Number(value)
      });
    } else {
      setCurrentProduct({
        ...currentProduct,
        [name]: value
      });
    }
  };

  const resetForm = () => {
    setCurrentProduct({
      id: null,
      name: '',
      price: 0,
      category: 'sembako',
      stock: 0,
      image: ''
    });
    setIsEditing(false);
    setIsFormOpen(false);
  };

  const openNewProductForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const editProduct = (product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  // API operations
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let updatedProducts = [...products];
      
      // Validate form data
      if (!currentProduct.name || currentProduct.price <= 0 || currentProduct.stock < 0) {
        throw new Error('Please fill all required fields with valid values');
      }
      
      if (isEditing) {
        // Update existing product
        await updateProduct(currentProduct.id, currentProduct);
        
        // Update local state
        const index = updatedProducts.findIndex(p => p.id === currentProduct.id);
        updatedProducts[index] = currentProduct;
      } else {
        // Create new product
        // For demo, generate an ID if we're not actually using an API
        const newId = Math.max(...products.map(p => p.id), 0) + 1;
        const newProduct = { ...currentProduct, id: newId };
        
        // In real implementation, the API would return the created product with an ID
        // const createdProduct = await createProduct(currentProduct);
        
        updatedProducts = [...updatedProducts, newProduct];
      }
      
      setProducts(updatedProducts);
      resetForm();
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to save product');
      setLoading(false);
      console.error('Error saving product:', err);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    
    setLoading(true);
    try {
      // Delete from API
      await deleteProduct(productToDelete.id);
      
      // Update local state
      setProducts(products.filter(p => p.id !== productToDelete.id));
      setShowDeleteConfirm(false);
      setProductToDelete(null);
      setLoading(false);
    } catch (err) {
      setError('Failed to delete product');
      setLoading(false);
      console.error('Error deleting product:', err);
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
          <button 
            onClick={openNewProductForm}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors duration-300"
          >
            Add New Product
          </button>
        </div>
        
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
            <button 
              className="absolute top-0 right-0 px-4 py-3" 
              onClick={() => setError(null)}
            >
              ×
            </button>
          </div>
        )}
        
        {/* Search and Filters */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
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
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
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
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Lowest)</option>
              <option value="price-desc">Price (Highest)</option>
            </select>
          </div>
        </div>
        
        {/* Product Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative mx-auto p-5 border w-full max-w-md my-6 rounded-md shadow-lg bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {isEditing ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button 
                  onClick={resetForm} 
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Product Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={currentProduct.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                    Price (Rp)*
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={currentProduct.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                    Category*
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={currentProduct.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">
                    Stock*
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={currentProduct.stock}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                    Image URL
                  </label>
                  <input
                    type="text"
                    id="image"
                    name="image"
                    value={currentProduct.image}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="/assets/product-image.jpg"
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {isEditing ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative mx-auto p-5 border w-full max-w-sm my-6 rounded-md shadow-lg bg-white">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
              <p className="mb-6">
                Are you sure you want to delete <strong>{productToDelete?.name}</strong>? This action cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Products Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={product.image || '/assets/placeholder.jpg'} 
                            alt="" 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">ID: {product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Rp {product.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => editProduct(product)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(product)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductCRUD;