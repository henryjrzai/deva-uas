// API URL
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Product categories
export const PRODUCT_CATEGORIES = [
  { id: 'sembako', name: 'Sembako' },
  { id: 'makanan-ringan', name: 'Makanan Ringan' },
  { id: 'minuman', name: 'Minuman' },
  { id: 'bumbu', name: 'Bumbu Dapur' },
  { id: 'bahan-kue', name: 'Bahan Kue' },
  { id: 'kebersihan', name: 'Perlengkapan Kebersihan' },
  { id: 'perawatan', name: 'Perawatan Pribadi' },
  { id: 'lainnya', name: 'Lainnya' }    
];

// Sort options
export const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Nama (A-Z)' },
  { value: 'name-desc', label: 'Nama (Z-A)' },
  { value: 'price-asc', label: 'Harga (Terendah)' },
  { value: 'price-desc', label: 'Harga (Tertinggi)' },
  { value: 'stock-asc', label: 'Stok (Terendah)' },
  { value: 'stock-desc', label: 'Stok (Tertinggi)' },
  { value: 'newest', label: 'Terbaru' },
  { value: 'oldest', label: 'Terlama' }
];

// Pagination
export const DEFAULT_PAGE_SIZE = 12;
export const PAGE_SIZE_OPTIONS = [12, 24, 48, 96];

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  CUSTOMER: 'customer'
};

// Transaction status
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELED: 'canceled'
};

// Payment methods
export const PAYMENT_METHODS = [
  { id: 'cash', name: 'Tunai' },
  { id: 'transfer', name: 'Transfer Bank' },
  { id: 'ewallet', name: 'E-Wallet' },
  { id: 'qris', name: 'QRIS' }
];

// Image placeholder
export const DEFAULT_IMAGE = '/assets/placeholder.jpg';

// Admin menu items
export const ADMIN_MENU_ITEMS = [
  { name: 'Dashboard', path: '/admin', icon: 'dashboard' },
  { name: 'Produk', path: '/admin/menu', icon: 'shopping-bag' },
  { name: 'Riwayat Transaksi', path: '/admin/histori', icon: 'history' },
  { name: 'Pengaturan Toko', path: '/admin/settings', icon: 'settings' }
];

// Format currency to Rupiah
export const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};