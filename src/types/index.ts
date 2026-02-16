export interface Importacion {
  id: number;
  codigo_importacion: string;
  proveedor: string;
  pais_origen: string;
  fecha_llegada: string;
  estado: 'Pendiente' | 'En Tránsito' | 'Recibido' | 'Aprobado';
  monto_total: number;
  created_at?: string; // Opcional
  updated_at?: string; // Opcional
}

export interface Stats {
  total: number;
  pendientes: number;
  en_transito: number;
  recibidos: number;
  monto_total: number;
}
