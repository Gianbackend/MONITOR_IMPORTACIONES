import type { Importacion, Stats } from '@/types';

// Datos mock para desarrollo
const mockImportaciones: Importacion[] = [
  {
    id: 1,
    codigo_importacion: 'IMP-2024-001',
    proveedor: 'Tech Supplies Inc',
    pais_origen: 'China',
    fecha_llegada: '2024-03-14',
    estado: 'En Tránsito',
    monto_total: 15000,
  },
  {
    id: 2,
    codigo_importacion: 'IMP-2024-002',
    proveedor: 'Global Electronics',
    pais_origen: 'Japón',
    fecha_llegada: '2024-03-19',
    estado: 'Pendiente',
    monto_total: 25000,
  },
  {
    id: 3,
    codigo_importacion: 'IMP-2024-003',
    proveedor: 'Auto Parts Ltd',
    pais_origen: 'Alemania',
    fecha_llegada: '2024-03-09',
    estado: 'Recibido',
    monto_total: 35000,
  },
  // ⭐ NUEVA IMPORTACIÓN DESDE INDIA
  {
    id: 4,
    codigo_importacion: 'IMP-2024-004',
    proveedor: 'Bajaj Auto Ltd',
    pais_origen: 'India',
    fecha_llegada: '2024-04-15',
    estado: 'En Tránsito',
    monto_total: 45000,
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

// Import
export const obtenerImportaciones = async (): Promise<Importacion[]> => {
  await delay(500);
  return [...mockImportaciones];
};

export const crearImportacion = async (data: Omit<Importacion, 'id'>): Promise<Importacion> => {
  await delay(500);
  const newId = Math.max(...mockImportaciones.map((i) => i.id), 0) + 1;
  const newImportacion: Importacion = {
    id: newId,
    codigo_importacion: data.codigo_importacion,
    proveedor: data.proveedor,
    pais_origen: data.pais_origen,
    fecha_llegada: data.fecha_llegada,
    estado: data.estado,
    monto_total: data.monto_total,
  };
  mockImportaciones.push(newImportacion);
  return newImportacion;
};

export const actualizarImportacion = async (
  id: number,
  data: Omit<Importacion, 'id'>
): Promise<Importacion> => {
  await delay(500);
  const index = mockImportaciones.findIndex((i) => i.id === id);
  if (index === -1) {
    throw new Error('Importación no encontrada');
  }
  mockImportaciones[index] = {
    ...mockImportaciones[index],
    ...data,
  };
  return mockImportaciones[index];
};

export const eliminarImportacion = async (id: number): Promise<void> => {
  await delay(500);
  const index = mockImportaciones.findIndex((i) => i.id === id);
  if (index === -1) {
    throw new Error('Importación no encontrada');
  }
  mockImportaciones.splice(index, 1);
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
  createImportacion: async (data: Partial<Importacion>): Promise<Importacion> => {
    await delay(500);
    const newId = Math.max(...mockImportaciones.map((i) => i.id), 0) + 1;
    const newImportacion: Importacion = {
      id: newId,
      codigo_importacion: data.codigo_importacion || '',
      proveedor: data.proveedor || '',
      pais_origen: data.pais_origen || '',
      fecha_llegada: data.fecha_llegada || '',
      estado: data.estado || 'Pendiente',
      monto_total: data.monto_total || 0,
    };
    mockImportaciones.push(newImportacion);
    return newImportacion;
  },

  // Actualizar importación
  updateImportacion: async (
    id: number,
    data: Partial<Importacion>
  ): Promise<Importacion> => {
    await delay(500);
    const index = mockImportaciones.findIndex((i) => i.id === id);
    if (index === -1) {
      throw new Error('Importación no encontrada');
    }
    mockImportaciones[index] = {
      ...mockImportaciones[index],
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
