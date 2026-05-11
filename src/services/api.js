const BASE_URL = 'https://madre-mia-backend.onrender.com/api';

export const productosService = {

  getAll: async () => {
    const res = await fetch(`${BASE_URL}/productos`);
    return res.json();
  },

  create: async (producto) => {
    const res = await fetch(`${BASE_URL}/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto),
    });
    return res.json();
  },

  update: async (id, producto) => {
    const res = await fetch(`${BASE_URL}/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto),
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${BASE_URL}/productos/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

};