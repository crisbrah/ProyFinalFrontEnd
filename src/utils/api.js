import axios from 'axios';

const API_URL = 'http://localhost:63789/ms-perez-huatuco/v1';
const PERSONAS_URL = 'http://localhost:63789/ms-perez-huatuco/v1';

// Función para obtener el token del almacenamiento local
const getToken = () => localStorage.getItem('token');

// Configuración de axios con el token
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  }
});

// Servicios para Personas
export const personaService = {
  getAll: () => axiosInstance.get(`${PERSONAS_URL}/persona/buscartodos`),
  getById: (id) => axiosInstance.get(`${PERSONAS_URL}/persona/buscar/${id}`),
  create: (data) => axiosInstance.post(`${PERSONAS_URL}/persona/crear`, data),
  update: (id, data) => axiosInstance.put(`${PERSONAS_URL}/persona/actualizar/${id}`, data),
  delete: (id) => axiosInstance.delete(`${PERSONAS_URL}/persona/borrar/${id}`),
  getByDni: (dni) => axiosInstance.get(`${PERSONAS_URL}/persona/buscardni/${dni}`)
};

// Servicios para Miembros
export const miembroService = {
  getAll: () => axiosInstance.get('/miembro/buscartodos'),
  getById: (id) => axiosInstance.get(`/miembro/buscar/${id}`),
  create: (data) => axiosInstance.post('/miembro/crear', data),
  update: (id, data) => axiosInstance.put(`/miembro/actualizar/${id}`, data),
  delete: (id) => axiosInstance.delete(`/miembro/borrar/${id}`)
};

// Servicios para Células
export const celulaService = {
  getAll: () => axiosInstance.get('/celula/buscartodos'),
  getById: (id) => axiosInstance.get(`/celula/buscar/${id}`),
  create: (data) => axiosInstance.post('/celula/crear', data),
  update: (id, data) => axiosInstance.put(`/celula/actualizar/${id}`, data),
  delete: (id) => axiosInstance.delete(`/celula/borrar/${id}`)
};

// Servicios para Ingresos
export const ingresoService = {
  getAll: () => axiosInstance.get('/ingreso/buscartodos'),
  create: (data) => axiosInstance.post('/ingreso/crear', data),
  // Agrega otros métodos según sea necesario
};