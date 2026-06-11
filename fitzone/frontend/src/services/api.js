import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fitzone_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('fitzone_token');
      localStorage.removeItem('fitzone_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// ─── Auth ────────────────────────────────────────────────────
export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// ─── Cours ───────────────────────────────────────────────────
export const coursService = {
  getAll: (params) => api.get('/cours', { params }),
  getOne: (id) => api.get(`/cours/${id}`),
  create: (data) => api.post('/cours', data),
  update: (id, data) => api.put(`/cours/${id}`, data),
  delete: (id) => api.delete(`/cours/${id}`),
  inscrire: (id) => api.post(`/cours/${id}/inscrire`),
  desinscrire: (id) => api.delete(`/cours/${id}/desinscrire`),
};

// ─── Salles ──────────────────────────────────────────────────
export const salleService = {
  getAll: () => api.get('/salles'),
  create: (data) => api.post('/salles', data),
  update: (id, data) => api.put(`/salles/${id}`, data),
  delete: (id) => api.delete(`/salles/${id}`),
};

// ─── Abonnés (admin) ─────────────────────────────────────────
export const abonneService = {
  getAll: (params) => api.get('/abonnes', { params }),
  getOne: (id) => api.get(`/abonnes/${id}`),
  create: (data) => api.post('/abonnes', data),
  update: (id, data) => api.put(`/abonnes/${id}`, data),
  delete: (id) => api.delete(`/abonnes/${id}`),
  stats: () => api.get('/abonnes/stats'),
  ajouterVisite: (id, data) => api.post(`/abonnes/${id}/visite`, data),
};

// ─── Paiements ───────────────────────────────────────────────
export const paiementService = {
  getAll: (params) => api.get('/paiements', { params }),
  recap: (params) => api.get('/paiements/recap', { params }),
  gestion: (params) => api.get('/paiements/gestion', { params }),
  marquerMensuel: (data) => api.post('/paiements/mensuel', data),
  create: (data) => api.post('/paiements/store', data),
  marquerPaye: (id) => api.post(`/paiements/${id}/payer`),
  update: (id, data) => api.put(`/paiements/${id}`, data),
  delete: (id) => api.delete(`/paiements/${id}`),
};
