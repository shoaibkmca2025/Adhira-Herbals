import { api } from './client.js';

export const authApi = {
  register: (data) => api.post('/auth/register', data).then((r) => r.data),
  login: (data) => api.post('/auth/login', data).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
  updateProfile: (data) => api.patch('/auth/me', data).then((r) => r.data),
  addAddress: (data) => api.post('/auth/addresses', data).then((r) => r.data),
  deleteAddress: (id) => api.delete(`/auth/addresses/${id}`).then((r) => r.data),
};

export const productsApi = {
  list: (params) => api.get('/products', { params }).then((r) => r.data),
  featured: () => api.get('/products/featured').then((r) => r.data),
  bySlug: (slug) => api.get(`/products/${slug}`).then((r) => r.data),
};

export const reviewsApi = {
  list: (productId) => api.get(`/reviews/${productId}`).then((r) => r.data),
  create: (productId, data) => api.post(`/reviews/${productId}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/reviews/${id}`).then((r) => r.data),
};

export const cartApi = {
  get: () => api.get('/cart').then((r) => r.data),
  add: (data) => api.post('/cart', data).then((r) => r.data),
  update: (itemId, quantity) => api.patch(`/cart/${itemId}`, { quantity }).then((r) => r.data),
  remove: (itemId) => api.delete(`/cart/${itemId}`).then((r) => r.data),
  clear: () => api.delete('/cart').then((r) => r.data),
};

export const ordersApi = {
  create: (data) => api.post('/orders', data).then((r) => r.data),
  mine: () => api.get('/orders/me').then((r) => r.data),
  byId: (id) => api.get(`/orders/${id}`).then((r) => r.data),
  cancel: (id) => api.post(`/orders/${id}/cancel`).then((r) => r.data),
};

export const paymentsApi = {
  simulate: (orderId) => api.post('/payments/simulate', { orderId }).then((r) => r.data),
  verify: (data) => api.post('/payments/verify', data).then((r) => r.data),
};

export const adminApi = {
  stats: () => api.get('/admin/stats').then((r) => r.data),
  products: {
    list: () => api.get('/admin/products').then((r) => r.data),
    create: (data) => api.post('/admin/products', data).then((r) => r.data),
    update: (id, data) => api.patch(`/admin/products/${id}`, data).then((r) => r.data),
    remove: (id) => api.delete(`/admin/products/${id}`).then((r) => r.data),
  },
  orders: {
    list: (params) => api.get('/admin/orders', { params }).then((r) => r.data),
    updateStatus: (id, data) => api.patch(`/admin/orders/${id}/status`, data).then((r) => r.data),
  },
  users: {
    list: () => api.get('/admin/users').then((r) => r.data),
    updateRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }).then((r) => r.data),
  },
};
