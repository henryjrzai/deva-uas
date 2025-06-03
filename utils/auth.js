import { API_URL } from './constants.js';

// Mock users for development/testing
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin1@tokokelontong.com',
    username: 'admin1',
    password: '123',
    name: 'Admin Toko',
    role: 'admin',
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'user1@gmail.com',
    username: 'user1',
    password: '1234',
    name: 'Pembeli Setia',
    role: 'customer',
    createdAt: '2023-02-15T00:00:00Z'
  }
];

// Determine if we should use the mock backend
const useMockBackend = process.env.NEXT_PUBLIC_USE_MOCK === 'true' || !API_URL;

/**
 * Helper function for safe JSON parsing of a response.
 * If parsing fails, returns an empty object.
 * @param {Response} response
 * @returns {Promise<Object>}
 */
async function safeJsonParse(response) {
  console.log('Response status:', response.status, response.statusText);
  console.log('Response URL:', response.url);
  try {
    return await response.json();
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return {};
  }
}

/**
 * Register a new user.
 * @param {Object} userData - User registration data.
 * @returns {Promise<Object>} - User data with token.
 */
export async function register(userData) {
  if (useMockBackend) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingUser = MOCK_USERS.find(
          user =>
            user.email.toLowerCase() === userData.email.trim().toLowerCase() ||
            user.username.toLowerCase() === (userData.username ? userData.username.trim().toLowerCase() : '')
        );
        if (existingUser) {
          reject(new Error('Email atau username sudah terdaftar'));
          return;
        }
        const newUser = {
          id: String(MOCK_USERS.length + 1),
          email: userData.email.trim(),
          username: userData.username ? userData.username.trim() : userData.email.trim().split('@')[0],
          password: userData.password.trim(),
          name: userData.name || userData.username,
          role: 'customer',
          createdAt: new Date().toISOString()
        };
        MOCK_USERS.push(newUser);
        const token = `mock-token-${Math.random().toString(36).substring(2, 15)}`;
        const { password, ...userWithoutPassword } = newUser;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        resolve({
          user: userWithoutPassword,
          token
        });
      }, 500);
    });
  }
  
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await safeJsonParse(response);
    if (!response.ok) {
      throw new Error(data.message || `Registration failed: ${response.status}`);
    }
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
}

/**
 * Login user.
 * @param {string} email - User email or username.
 * @param {string} password - User password.
 * @returns {Promise<Object>} - User data with token.
 */


/**
 * Logout user.
 */
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
}

/**
 * Get current user data from localStorage.
 * @returns {Object|null} - User data or null if not logged in.
 */
export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Failed to parse user data', error);
    return null;
  }
}

/**
 * Check if user is authenticated.
 * @returns {boolean} - True if authenticated.
 */
export function isAuthenticated() {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
}

/**
 * Check if user is admin.
 * @returns {boolean} - True if user is admin.
 */
export function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === 'admin';
}

/**
 * Protected route middleware for Next.js.
 * @param {Function} getServerSideProps - Next.js getServerSideProps function.
 * @param {Object} options - Options for redirection.
 * @returns {Function} - Modified getServerSideProps function.
 */
export function withAuth(getServerSideProps = () => ({ props: {} }), options = {}) {
  const { adminOnly = false, redirectTo = '/login' } = options;
  return async (context) => {
    const { req } = context;
    // For client-side rendering or mock backend, handle auth on the client.
    if (typeof window !== 'undefined' || useMockBackend) {
      return getServerSideProps(context);
    }
    const token = req.cookies.token;
    if (!token) {
      return {
        redirect: {
          destination: redirectTo,
          permanent: false,
        },
      };
    }
    if (adminOnly) {
      try {
        const response = await fetch(`${API_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await safeJsonParse(response);
        if (!response.ok || !data.user || data.user.role !== 'admin') {
          return {
            redirect: {
              destination: '/',
              permanent: false,
            },
          };
        }
      } catch (error) {
        return {
          redirect: {
            destination: redirectTo,
            permanent: false,
          },
        };
      }
    }
    return getServerSideProps(context);
  };
}
