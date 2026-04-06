import { supabase } from '../lib/supabase';

// 1. Obtener todas las importaciones
export const getImportaciones = async () => {
  const { data, error } = await supabase
    .from('importaciones') // Nombre de la tabla que creaste
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// 2. Guardar una nueva importación
export const saveImportacion = async (importacion: any) => {
  const { data, error } = await supabase
    .from('importaciones')
    .upsert([importacion]) // Cambia .insert por .upsert
    .select();

  if (error) throw error;
  return data;
};

// 3. Eliminar (Opcional)
export const deleteImportacion = async (id: string | number) => {
  const { error } = await supabase
    .from('importaciones')
    .delete()
    .eq('id', id);

  if (error) throw error;
};