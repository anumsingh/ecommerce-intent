import axios from 'axios';

// Get or generate stable session ID for intent sequence tracking
export const getSessionId = () => {
  let sid = localStorage.getItem('ecom_session_id');
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now();
    localStorage.setItem('ecom_session_id', sid);
  }
  return sid;
};

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'x-session-id': getSessionId()
  }
});

// Attach JWT token if logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ecom_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['x-session-id'] = getSessionId();
  return config;
});

// 1. Search Products across Amazon, Myntra, Ajio
export const searchProducts = async (query) => {
  const response = await api.get('/products/search', {
    params: { query, session_id: getSessionId() }
  });
  return response.data;
};

// 2. Track Real-Time Intent Event
export const trackIntentEvent = async (eventType, itemIdentifier = '', metadata = {}) => {
  try {
    const response = await api.post('/intent/track', {
      session_id: getSessionId(),
      event_type: eventType,
      item_id: itemIdentifier,
      metadata: metadata
    });
    return response.data.intent;
  } catch (error) {
    console.warn('Intent tracking error:', error);
    return null;
  }
};

// 3. Get Current Session Intent
export const fetchCurrentIntent = async () => {
  const response = await api.get('/intent/current', {
    params: { session_id: getSessionId() }
  });
  return response.data.intent;
};

// 4. Reset Intent Tracker
export const resetIntentTracker = async () => {
  const response = await api.post('/intent/reset', {
    session_id: getSessionId()
  });
  return response.data.intent;
};

// 5. Price History
export const fetchPriceHistory = async (link, currentPrice, platform) => {
  const response = await api.get('/products/price-history', {
    params: { link, current_price: currentPrice, platform }
  });
  return response.data.history;
};

// 6. Create Price Alert
export const createPriceAlert = async (alertData) => {
  const response = await api.post('/alerts', alertData);
  return response.data;
};

// 7. Wishlist APIs
export const fetchWishlist = async (email) => {
  const response = await api.get('/wishlist', { params: { email } });
  return response.data.items || [];
};

export const addToWishlist = async (item) => {
  const response = await api.post('/wishlist', item);
  return response.data;
};

export const removeFromWishlist = async (id) => {
  const response = await api.delete(`/wishlist/${id}`);
  return response.data;
};

// 8. Auth APIs
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// 9. Export to Excel
export const exportToExcel = async (products, query) => {
  const response = await api.post('/products/export', { products, query }, {
    responseType: 'blob'
  });
  
  const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `PriceComparison_${query || 'results'}.xlsx`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export default api;
