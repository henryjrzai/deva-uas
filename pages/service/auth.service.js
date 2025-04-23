export const login = (data) => {
  const token = `mock-token-${Math.random().toString(36).substring(2, 15)}`;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(data));
}

export function isAuthenticated() {
  // if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
}
