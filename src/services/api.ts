import type { Importacion, Stats } from '@/types';

const API_BASE_URL = 'http://localhost:8080/api/importaciones';

export const api = {
  // Obtener todos los registros reales de PostgreSQL
  getImportaciones: async (): Promise<Importacion[]> => {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error('Error al obtener importaciones');
    return await response.json();
  },

  // Obtener estadísticas calculadas dinámicamente
  getStats: async (): Promise<Stats> => {
    const data = await api.getImportaciones();
    return {
      total: data.length,
      pendientes: data.filter(i => i.estado === 'Pendiente').length,
      en_transito: data.filter(i => i.estado === 'En Tránsito').length,
      recibidos: data.filter(i => i.estado === 'Recibido').length,
      monto_total: data.reduce((sum, i) => sum + (i.monto_total || 0), 0),
    };
  },

  // Crear nuevo registro (Acepta objeto único o array)
  createImportacion: async (data: Partial<Importacion>): Promise<Importacion> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data), // Objeto directo { ... }
  });
  if (!response.ok) throw new Error('Error al crear');
  return await response.json();
},

  // ACTUALIZAR registro existente (El que te faltaba)
  updateImportacion: async (id: number, data: Partial<Importacion>): Promise<Importacion> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al actualizar');
    return await response.json();
  },

  // Eliminar registro
  deleteImportacion: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar');
  }
};