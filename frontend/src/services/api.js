/**
 * HWMS API Client - Bridges the React Frontend to the Django REST Backend
 * Backend URL: http://localhost:8000/api
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Universal request wrapper with automatic error handling and fallback support
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(url, config);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.detail || `HTTP Error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[HWMS API] Request failed for ${endpoint}:`, err.message);
    throw err;
  }
}

export const api = {
  // Backend health check
  health: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard/stats/`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Authentication & Users (matching requested 5 roles)
  auth: {
    login: async (emailOrUsername, password) => {
      return request('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ emailOrUsername, password }),
      });
    },

    getUsers: async () => {
      const data = await request('/users/');
      return Array.isArray(data) ? data : data.results || [];
    },

    createUser: async (userData) => {
      return request('/users/', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },

    updateUser: async (id, userData) => {
      return request(`/users/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(userData),
      });
    },

    deleteUser: async (id) => {
      return request(`/users/${id}/`, {
        method: 'DELETE',
      });
    },
  },

  // Weaver Artisan Management (Screens 3 & 4 + AddWeaverPage)
  weavers: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams();
      if (params.search) query.append('search', params.search);
      if (params.village && params.village !== 'All') query.append('village', params.village);
      if (params.status && params.status !== 'All') query.append('status', params.status);

      const qs = query.toString() ? `?${query.toString()}` : '';
      const data = await request(`/weavers/${qs}`);
      return Array.isArray(data) ? data : data.results || [];
    },

    getById: async (id) => {
      return request(`/weavers/${id}/`);
    },

    create: async (weaverData) => {
      return request('/weavers/', {
        method: 'POST',
        body: JSON.stringify(weaverData),
      });
    },

    update: async (id, weaverData) => {
      return request(`/weavers/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(weaverData),
      });
    },

    delete: async (id) => {
      return request(`/weavers/${id}/`, {
        method: 'DELETE',
      });
    },

    exportExcelUrl: (params = {}) => {
      const query = new URLSearchParams();
      if (params.village && params.village !== 'All') query.append('village', params.village);
      if (params.status && params.status !== 'All') query.append('status', params.status);
      const qs = query.toString() ? `?${query.toString()}` : '';
      return `${API_BASE_URL}/weavers/export-excel/${qs}`;
    },

    importExcel: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE_URL}/weavers/import-excel/`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
      return await res.json();
    },

    sampleTemplateUrl: `${API_BASE_URL}/weavers/sample-template/`,
  },

  // Loom Asset Tracking (Screens 5 & 6)
  looms: {
    getAll: async () => {
      const data = await request('/looms/');
      return Array.isArray(data) ? data : data.results || [];
    },

    create: async (loomData) => {
      return request('/looms/', {
        method: 'POST',
        body: JSON.stringify(loomData),
      });
    },

    update: async (id, loomData) => {
      return request(`/looms/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(loomData),
      });
    },

    delete: async (id) => {
      return request(`/looms/${id}/`, {
        method: 'DELETE',
      });
    },
  },

  // Yarn & Stock Management (Screen 7)
  stock: {
    getAll: async () => {
      const data = await request('/stock/');
      return Array.isArray(data) ? data : data.results || [];
    },

    create: async (stockData) => {
      return request('/stock/', {
        method: 'POST',
        body: JSON.stringify(stockData),
      });
    },

    update: async (id, stockData) => {
      return request(`/stock/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(stockData),
      });
    },

    delete: async (id) => {
      return request(`/stock/${id}/`, {
        method: 'DELETE',
      });
    },
  },

  // Production Tracking (Screen 8)
  production: {
    getAll: async () => {
      const data = await request('/production/');
      return Array.isArray(data) ? data : data.results || [];
    },

    create: async (recordData) => {
      return request('/production/', {
        method: 'POST',
        body: JSON.stringify(recordData),
      });
    },

    update: async (id, recordData) => {
      return request(`/production/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(recordData),
      });
    },

    delete: async (id) => {
      return request(`/production/${id}/`, {
        method: 'DELETE',
      });
    },
  },

  // Salary & Wage Management (Screen 9)
  salaries: {
    getAll: async () => {
      const data = await request('/salaries/');
      return Array.isArray(data) ? data : data.results || [];
    },

    create: async (salaryData) => {
      return request('/salaries/', {
        method: 'POST',
        body: JSON.stringify(salaryData),
      });
    },

    update: async (id, salaryData) => {
      return request(`/salaries/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(salaryData),
      });
    },

    delete: async (id) => {
      return request(`/salaries/${id}/`, {
        method: 'DELETE',
      });
    },
  },

  // Executive Dashboard Stats (Screen 2)
  dashboard: {
    getStats: async () => {
      return request('/dashboard/stats/');
    },
  },
};
