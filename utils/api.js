import { API_URL } from './constants.js';

/**
 * Helper function to safely parse JSON from a response.
 * Jika parsing gagal (misalnya karena respons bukan JSON), mengembalikan objek kosong.
 * @param {Response} response
 * @returns {Promise<Object>}
 */
async function safeJsonParse(response) {
  try {
    return await response.json();
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return {};
  }
}

/**
 * Function to handle API requests with error handling.
 * Memastikan header default, penambahan token (jika ada) dan pengecekan content-type.
 * @param {string} endpoint - API endpoint (misalnya, "/auth/login")
 * @param {Object} options - Options untuk fetch
 * @returns {Promise<Object>} - Response data (JSON)
 */
async function fetchAPI(endpoint, options = {}) {
  try {
    // Set header default jika belum ada.
    if (!options.headers) {
      options.headers = {
        'Content-Type': 'application/json',
      };
    }

    // Tambahkan token jika tersedia dan jika kode berjalan di client-side.
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        options.headers.Authorization = `Bearer ${token}`;
      }
    }

    const fullUrl = `${API_URL}${endpoint}`;
    console.log(`Making API request to: ${fullUrl}`);
    
    const response = await fetch(fullUrl, options);

    // Periksa content-type sebelum mencoba parse JSON.
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error(`Unexpected content type: ${contentType}`);
      throw new Error(`API error: Expected JSON response but got ${contentType || 'unknown'}`);
    }
    
    const data = await safeJsonParse(response);

    // Jika respons tidak OK, lempar error dengan pesan yang didapat atau pesan default.
    if (!response.ok) {
      throw new Error(data.message || `Error: ${response.status} ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * Fetch all products.
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} - Array produk
 */
export async function fetchProducts(params = {}) {
  const queryParams = new URLSearchParams(params).toString();
  const endpoint = `/products${queryParams ? `?${queryParams}` : ''}`;
  return fetchAPI(endpoint);
}

/**
 * Fetch single product by ID.
 * @param {string|number} id - Product ID
 * @returns {Promise<Object>} - Data product
 */
export async function fetchProductById(id) {
  return fetchAPI(`/products/${id}`);
}

/**
 * Create a new product.
 * @param {Object} productData - Data product baru
 * @returns {Promise<Object>} - Data product yang telah dibuat
 */
export async function createProduct(productData) {
  return fetchAPI('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
}

/**
 * Update an existing product.
 * @param {string|number} id - ID produk
 * @param {Object} productData - Data product yang diperbarui
 * @returns {Promise<Object>} - Data product yang diperbarui
 */
export async function updateProduct(id, productData) {
  return fetchAPI(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  });
}

/**
 * Delete a product.
 * @param {string|number} id - ID product
 * @returns {Promise<Object>} - Konfirmasi penghapusan produk
 */
export async function deleteProduct(id) {
  return fetchAPI(`/products/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Fetch transaction history.
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} - Array transaksi
 */
export async function fetchTransactions(params = {}) {
  const queryParams = new URLSearchParams(params).toString();
  const endpoint = `/transactions${queryParams ? `?${queryParams}` : ''}`;
  return fetchAPI(endpoint);
}

/**
 * Create a new transaction.
 * @param {Object} transactionData - Data transaksi
 * @returns {Promise<Object>} - Data transaksi yang dibuat
 */
export async function createTransaction(transactionData) {
  return fetchAPI('/transactions', {
    method: 'POST',
    body: JSON.stringify(transactionData),
  });
}

/**
 * Fetch store profile.
 * @returns {Promise<Object>} - Data profil toko
 */
export async function fetchStoreProfile() {
  return fetchAPI('/store/profile');
}

/**
 * Update store profile.
 * @param {Object} profileData - Data profil toko yang diperbarui
 * @returns {Promise<Object>} - Data profil yang diperbarui
 */
export async function updateStoreProfile(profileData) {
  return fetchAPI('/store/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
}
