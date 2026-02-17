import type { Importacion, Stats } from '@/types';

// Datos mock para desarrollo
const mockImportaciones: Importacion[] = [
  {
    id: 1,
    codigo_importacion: 'IMP-2026-001',
    pedido_sap: '4503000331',
    proveedor: 'Bajaj Auto Ltd',
    pais_origen: 'India',
    fecha_eta: '2026-03-20',
    estado: 'En Tránsito',
    monto_total: 45000,
  },
  {
    id: 2,
    codigo_importacion: 'IMP-2026-002',
    pedido_sap: '4503000428',
    proveedor: 'Honda Motor Co',
    pais_origen: 'Japón',
    fecha_eta: '2026-05-25',
    estado: 'Pendiente',
    monto_total: 52000,
  },
  {
    id: 3,
    codigo_importacion: 'IMP-2025-003',
    pedido_sap: '4503000512',
    proveedor: 'Yamaha Corporation',
    pais_origen: 'Japón',
    fecha_eta: '2025-11-15',
    estado: 'Recibido',
    monto_total: 38000,
  },
  {
    id: 4,
    codigo_importacion: 'IMP-2026-004',
    pedido_sap: '4503000645',
    proveedor: 'TVS Motor Company',
    pais_origen: 'India',
    fecha_eta: '2026-04-11',
    estado: 'En Tránsito',
    monto_total: 41000,
  },
];

// Simular delay de red
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Calcular estadísticas
const calculateStats = (importaciones: Importacion[]): Stats => {
  return {
    total: importaciones.length,
    pendientes: importaciones.filter((i) => i.estado === 'Pendiente').length,
    en_transito: importaciones.filter((i) => i.estado === 'En Tránsito').length,
    recibidos: importaciones.filter((i) => i.estado === 'Recibido').length,
    monto_total: importaciones.reduce((sum, i) => sum + i.monto_total, 0),
  };
};

// API simulada
export const api = {
  // Obtener todas las importaciones
  getImportaciones: async (): Promise<Importacion[]> => {
    await delay(500);
    return [...mockImportaciones];
  },

  // Obtener estadísticas
  getStats: async (): Promise<Stats> => {
    await delay(300);
    return calculateStats(mockImportaciones);
  },

  // Crear nueva importación
  createImportacion: async (data: Omit<Importacion, 'id'>): Promise<Importacion> => {
    await delay(500);
    const newId = Math.max(...mockImportaciones.map((i) => i.id), 0) + 1;
    const newImportacion: Importacion = {
      id: newId,
      ...data, // ⭐ Simplificado
    };
    mockImportaciones.push(newImportacion);
    return newImportacion;
  },

  // Actualizar importación
  updateImportacion: async (
    id: number,
    data: Omit<Importacion, 'id'>
  ): Promise<Importacion> => {
    await delay(500);
    const index = mockImportaciones.findIndex((i) => i.id === id);
    if (index === -1) {
      throw new Error('Importación no encontrada');
    }
    mockImportaciones[index] = {
      id,
      ...data,
    };
    return mockImportaciones[index];
  },

  // Eliminar importación
  deleteImportacion: async (id: number): Promise<void> => {
    await delay(500);
    const index = mockImportaciones.findIndex((i) => i.id === id);
    if (index === -1) {
      throw new Error('Importación no encontrada');
    }
    mockImportaciones.splice(index, 1);
  },
};
