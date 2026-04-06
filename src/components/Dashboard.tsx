import { useState, useEffect } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import StatsCards from './StatsCards'
import ImportsTable from './ImportsTable'
import ImportacionForm from './ImportacionForm'
import ShippingMap from './ShippingMap'
import Footer from './Footer'
import type { Importacion } from '../types'
import { getImportaciones, saveImportacion, deleteImportacion } from '../services/api'
import {Warehouse } from 'lucide-react'
import {Compass } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Login } from '@/components/login'

const Dashboard = () => {
  const [importaciones, setImportaciones] = useState<Importacion[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [importacionEditando, setImportacionEditando] = useState<Importacion | null>(null)
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    // Revisar sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setAuthLoading(false)
    })

    // Escuchar cambios (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Tu useEffect actual se mantiene igual:
  useEffect(() => {
    if (session) cargarImportaciones() // Solo carga si hay sesión
  }, [session])

  useEffect(() => {
    cargarImportaciones()
  }, [])

  const cargarImportaciones = async () => {
  try {
    setLoading(true)
    // Cambia api.getImportaciones() por:
    const data = await getImportaciones() 
    setImportaciones(data)
  } catch (error) {
    console.error("Error al cargar:", error)
  } finally {
    setLoading(false)
  }
}

  const handleActualizar = () => {
    cargarImportaciones()
  }

  const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error('Error al salir:', error.message);
  // El onAuthStateChange que pusimos en Dashboard detectará esto y te mandará al Login
};

  const handleGuardar = async (data: Omit<Importacion, 'id'>) => {
  try {
    setLoading(true);

    // 1. Quitar tildes y normalizar
    const normalizarTexto = (texto: string) => {
      return texto
        .normalize("NFD") // Descompone caracteres (ej: 'ó' -> 'o' + '´')
        .replace(/[\u0300-\u036f]/g, "") // Elimina los acentos
        .trim();
    };

    const paisLimpio = normalizarTexto(data.pais_origen);
    
    // 2. Formato Final: "Japon" (Primera Mayúscula, resto minúscula, sin tilde)
    const paisFormateado = paisLimpio.charAt(0).toUpperCase() + 
                          paisLimpio.slice(1).toLowerCase();

    const payload: any = {
      ...data,
      pais_origen: paisFormateado
    };

    if (importacionEditando?.id) {
      payload.id = importacionEditando.id;
    }
// 3. Al ser nuevo, Supabase ahora usará su "Identity" autoincremental
    await saveImportacion(payload);

    
    
    
    await cargarImportaciones();
    setMostrarFormulario(false);
    setImportacionEditando(null);
  } catch (error) {
    console.error('Error al guardar:', error);
  } finally {
    setLoading(false);
  }
};

  const handleEditar = (importacion: Importacion) => {
    setImportacionEditando(importacion)
    setMostrarFormulario(true)
  }

  const handleEliminar = async (id: number) => {
  if (window.confirm('¿Estás seguro de eliminar esta importación?')) {
    try {
      setLoading(true)
      await await deleteImportacion(id); 
      await cargarImportaciones()
    } catch (error) {
      console.error('Error al eliminar:', error)
    } finally {
      setLoading(false)
    }
  }
}

  const importacionesFiltradas = importaciones.filter((imp) => {
    const searchLower = busqueda.toLowerCase()
    return (
      imp.codigo_importacion.toLowerCase().includes(searchLower) ||
      imp.proveedor.toLowerCase().includes(searchLower) ||
      imp.pais_origen.toLowerCase().includes(searchLower)
    )
  })

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">Verificando acceso...</div>
  if (!session) return <Login />

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* --- SIDEBAR LATERAL --- */}
      {/* --- SIDEBAR INTERACTIVO --- */}
<aside className="group w-16 hover:w-64 transition-all duration-300 ease-in-out bg-white border-r flex flex-col flex-shrink-0 z-50">
  <div className="p-4 overflow-hidden whitespace-nowrap">
    <h2 className="text-xl font-bold text-blue-600 flex items-center gap-4">
      <Warehouse className="w-8 h-8 flex-shrink-0" />
      <span className="opacity-0 group-hover:opacity-100 transition-opacity">NexusTI</span>
    </h2>
  </div>

  <nav className="flex-1 px-2 space-y-2 overflow-hidden">
    {/* Botón Monitor */}
    <Button 
      variant="ghost" 
      className="w-full justify-start gap-4 hover:bg-blue-50 text-gray-600"
      onClick={() => document.getElementById('seccion-monitor')?.scrollIntoView({ behavior: 'smooth' })}
    >
      <Warehouse className="w-6 h-6 flex-shrink-0" />
      <span className="opacity-0 group-hover:opacity-100 transition-opacity">Monitor</span>
    </Button>

    {/* Botón Mapa */}
    <Button 
      variant="ghost" 
      className="w-full justify-start gap-4 hover:bg-blue-50 text-gray-600"
      onClick={() => document.getElementById('seccion-mapa')?.scrollIntoView({ behavior: 'smooth' })}
    >
      <Compass className="w-6 h-6 flex-shrink-0" />
      <span className="opacity-0 group-hover:opacity-100 transition-opacity">Mapa</span>
    </Button>
  </nav>

  {/* Footer del Sidebar */}
  <div className="p-4 border-t overflow-hidden">
    <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-4">
      <p className="text-xs text-gray-400">Usuario</p>
      <p className="text-sm font-medium truncate text-gray-700">{session?.user?.email}</p>
    </div>
    <Button 
      variant="outline" 
      className="w-full justify-start gap-4 text-red-600 border-transparent hover:bg-red-50 group-hover:border-red-100"
      onClick={handleLogout}
    >
      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">🚪</div>
      <span className="opacity-0 group-hover:opacity-100 transition-opacity">Salir</span>
    </Button>
  </div>
</aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          {/* --- SECCIÓN MONITOR --- */}
<div id="seccion-monitor" className="mb-8 scroll-mt-8">
  <h1 className="text-3xl font-bold text-black mb-2 flex items-center gap-3">
    <Warehouse className="w-6 h-6" />
    Monitor de Importaciones
  </h1>
  <p className="text-gray-600">
    Gestiona y supervisa todas tus importaciones en tiempo real
  </p>
</div>

          {/* Stats Cards */}
          <StatsCards data={importaciones} />

          {/* Búsqueda y botones */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="🔍 Buscar por código, proveedor o país..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleActualizar}
              className="gap-2"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            <Button
              onClick={() => {
                setImportacionEditando(null)
                setMostrarFormulario(true)
              }}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Nueva Importación
            </Button>
          </div>

          {/* Tabla */}
          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando importaciones...</p>
            </div>
          ) : (
            <ImportsTable
              data={importacionesFiltradas}
              onEdit={handleEditar}
              onDelete={handleEliminar}
            />
          )}

          {/* Mapa Mundial */}
          {/* --- SECCIÓN MAPA --- */}
<div id="seccion-mapa" className="mt-12 scroll-mt-8">
  <h2 className="text-2xl font-bold text-black-800 mb-2 flex items-center gap-2">
    <Compass className="w-6 h-6" />
    Mapa de Importaciones
  </h2>
  <p className="text-gray-600 mb-6">
    Visualiza el origen de tus importaciones y sus rutas hacia Perú
  </p>
  {importaciones.length > 0 ? (
    <ShippingMap importaciones={importaciones} />
  ) : (
    <div className="bg-white rounded-lg shadow-md p-12 text-center">
      <p className="text-gray-600">
        📭 No hay importaciones para mostrar en el mapa
      </p>
    </div>
  )}
</div>

          {/* Footer */}
          <Footer />
        </div>
      </main>

      {/* Modal de formulario (Fuera del main para evitar problemas de z-index) */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ImportacionForm
              importacion={importacionEditando}
              onSave={handleGuardar}
              onCancel={() => {
                setMostrarFormulario(false)
                setImportacionEditando(null)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard