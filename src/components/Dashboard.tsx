import { useState, useEffect } from 'react'
import { LogOut, Plus, RefreshCw, Warehouse, Compass, FileBarChart, FileSpreadsheet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import StatsCards from './StatsCards'
import ImportsTable from './ImportsTable'
import ImportacionForm from './ImportacionForm'
import ShippingMap from './ShippingMap'
import Footer from './Footer'
import type { Importacion } from '../types'
import { getImportaciones, saveImportacion, deleteImportacion } from '../services/api'
import { supabase } from '../lib/supabase'
import { Login } from '@/components/login'
import * as XLSX from 'xlsx' // Importación para el Excel

const LOGO_URL = "https://assets.nexusti.uk/crosland1.jpg"

const Dashboard = () => {
  const [importaciones, setImportaciones] = useState<Importacion[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [importacionEditando, setImportacionEditando] = useState<Importacion | null>(null)
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [vistaActual, setVistaActual] = useState<'dashboard' | 'reportes'>('dashboard')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) cargarImportaciones()
  }, [session])

  const cargarImportaciones = async () => {
    try {
      setLoading(true)
      const data = await getImportaciones() 
      setImportaciones(data)
    } catch (error) {
      console.error("Error al cargar:", error)
    } finally {
      setLoading(false)
    }
  }

  // --- LÓGICA DE DESCARGA EXCEL ---
 const descargarExcel = (inicio: string, fin: string) => {
  const filtradas = importaciones.filter(imp => 
    imp.fecha_eta >= inicio && imp.fecha_eta <= fin
  );

  if (filtradas.length === 0) return alert("No hay datos en ese rango de fechas");

  const datosExcel = filtradas.map(imp => ({
    'Pedido SAP': imp.pedido_sap,
    'Proveedor': imp.proveedor,
    'País Origen': imp.pais_origen,
    'Fecha ETA': imp.fecha_eta,
    'Estado': imp.estado,
    'Monto Total': imp.monto_total, // <--- CAMBIADO A monto_total
    'Código': imp.codigo_importacion
  }));

  const ws = XLSX.utils.json_to_sheet(datosExcel);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Importaciones");
  XLSX.writeFile(wb, `Reporte_Crosland_${inicio}_al_${fin}.xlsx`);
};

  const handleActualizar = () => cargarImportaciones()
  const handleLogout = async () => await supabase.auth.signOut()

  const handleGuardar = async (data: Omit<Importacion, 'id'>) => {
    try {
      setLoading(true)
      const normalizarTexto = (texto: string) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim()
      const paisLimpio = normalizarTexto(data.pais_origen)
      const paisFormateado = paisLimpio.charAt(0).toUpperCase() + paisLimpio.slice(1).toLowerCase()
      const payload: any = { ...data, pais_origen: paisFormateado }
      if (importacionEditando?.id) payload.id = importacionEditando.id
      await saveImportacion(payload)
      await cargarImportaciones()
      setMostrarFormulario(false)
      setImportacionEditando(null)
    } catch (error) {
      console.error('Error al guardar:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditar = (importacion: Importacion) => {
    setImportacionEditando(importacion)
    setMostrarFormulario(true)
  }

  const handleEliminar = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta importación?')) {
      try {
        setLoading(true)
        await deleteImportacion(id)
        await cargarImportaciones()
      } catch (error) {
        console.error('Error al eliminar:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const importacionesFiltradas = importaciones.filter((imp) => {
    const normalizar = (texto: string) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    const searchNormal = normalizar(busqueda)
    return (
      normalizar(imp.codigo_importacion || '').includes(searchNormal) ||
      normalizar(imp.proveedor || '').includes(searchNormal) ||
      normalizar(imp.pais_origen || '').includes(searchNormal) ||
      normalizar(imp.estado || '').includes(searchNormal) ||
      (imp.pedido_sap?.toString() || '').includes(searchNormal)
    )
  })

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">Verificando acceso...</div>
  if (!session) return <Login />

  return (



    <div className="h-screen bg-slate-50 overflow-hidden relative">
      <aside className="absolute left-0 top-0 h-full z-[999] group w-16 hover:w-64 transition-all duration-300 ease-in-out bg-white border-r flex flex-col shadow-xl">
        <div className="p-4 overflow-hidden whitespace-nowrap flex items-center gap-4">
          <img src={LOGO_URL} alt="Crosland Logo" className="w-8 h-8 object-contain flex-shrink-0" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xl font-bold" style={{ color: '#0055A5' }}>
            Crosland
          </span>
        </div>
        <nav className="flex-1 px-2 space-y-2 overflow-hidden mt-4">
  {/* Botón Monitor */}
  <Button
    variant="ghost"
    className={`w-full justify-start gap-4 transition-colors ${
      vistaActual === 'dashboard' 
      ? 'bg-blue-50 text-[#0055A5]' 
      : 'text-gray-600 hover:bg-blue-50'
    }`}
    onClick={() => {
      setVistaActual('dashboard');
      // Forzar scroll al inicio si ya estabas en dashboard
      if(vistaActual === 'dashboard') {
        document.getElementById('seccion-monitor')?.scrollIntoView({ behavior: 'smooth' });
      }
    }}
  >
    <Warehouse className="w-6 h-6 flex-shrink-0" />
    <span className="opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
      Monitor
    </span>
  </Button>

  {/* Botón Mapa */}
  <Button
    variant="ghost"
    className="w-full justify-start gap-4 hover:bg-blue-50 text-gray-600"
    onClick={() => {
      // 1. Si no estamos en dashboard, cambiamos la vista primero
      if (vistaActual !== 'dashboard') {
        setVistaActual('dashboard');
      }
      
      // 2. Esperamos un breve momento a que React renderice el dashboard
      // y luego ejecutamos el scroll
      setTimeout(() => {
        const elemento = document.getElementById('seccion-mapa');
        if (elemento) {
          elemento.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // 100ms es suficiente para el re-render
    }}
  >
    <Compass className="w-6 h-6 flex-shrink-0" />
    <span className="opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
      Mapa
    </span>
  </Button>

  {/* Botón Reportes */}
  <Button
    variant="ghost"
    className={`w-full justify-start gap-4 transition-colors ${
      vistaActual === 'reportes' 
      ? 'bg-blue-50 text-[#0055A5]' 
      : 'text-gray-600 hover:bg-blue-50'
    }`}
    onClick={() => setVistaActual('reportes')}
  >
    <FileBarChart className="w-6 h-6 flex-shrink-0" />
    <span className="opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
      Reportes
    </span>
  </Button>
</nav>
        <div className="p-4 border-t overflow-hidden">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-4">
            <p className="text-xs text-gray-400">Usuario</p>
            <p className="text-sm font-medium truncate text-gray-700">{session?.user?.email}</p>
          </div>
          <Button variant="outline" className="w-full justify-start gap-4 text-red-600 border-transparent hover:bg-red-50 group-hover:border-red-100" onClick={handleLogout}>
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">Cerrar Sesión</span>
          </Button>
        </div>
      </aside>

      <main className="ml-16 overflow-y-auto h-full p-8 transition-all">
        {vistaActual === 'dashboard' ? (
          <div className="max-w-7xl mx-auto">
            <div id="seccion-monitor" className="mb-8 scroll-mt-8">
              <h1 className="text-3xl font-bold text-black mb-2 flex items-center gap-3">
                <Warehouse className="w-6 h-6" /> Monitor de Importaciones
              </h1>
              <p className="text-gray-600">Gestiona y supervisa todas tus importaciones en línea</p>
            </div>
            <StatsCards data={importaciones} />
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <Input placeholder="🔍 Buscar por código, proveedor o país..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="w-full" />
              </div>
              <Button variant="outline" onClick={handleActualizar} className="gap-2" disabled={loading}>
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Actualizar
              </Button>
              <Button onClick={() => { setImportacionEditando(null); setMostrarFormulario(true); }} className="gap-2">
                <Plus className="w-4 h-4" /> Nueva Importación
              </Button>
            </div>
            {loading ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando importaciones...</p>
              </div>
            ) : (
              <ImportsTable data={importacionesFiltradas} onEdit={handleEditar} onDelete={handleEliminar} />
            )}
            <div id="seccion-mapa" className="mt-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-black-800 mb-2 flex items-center gap-2">
                <Compass className="w-6 h-6" /> Mapa de Importaciones
              </h2>
              {importaciones.length > 0 ? <ShippingMap importaciones={importaciones} /> : <p>No hay importaciones para mostrar</p>}
            </div>
            <Footer />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto py-10">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <FileBarChart className="w-8 h-8 text-[#0055A5]" /> Generar Reportes ETA
              </h1>
              <p className="text-gray-500 mt-2">Exporta los datos históricos a Excel filtrando por rango de llegada.</p>
            </header>
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Desde:</label>
                  <Input type="date" id="rep-inicio" className="h-12 text-lg" />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Hasta:</label>
                  <Input type="date" id="rep-fin" className="h-12 text-lg" />
                </div>
              </div>
              <Button 
                className="w-full h-14 bg-[#0055A5] hover:bg-blue-800 text-white font-bold text-lg gap-3 rounded-xl transition-all"
                onClick={() => {
                  const i = (document.getElementById('rep-inicio') as HTMLInputElement).value
                  const f = (document.getElementById('rep-fin') as HTMLInputElement).value
                  if(i && f) descargarExcel(i, f)
                  else alert("Selecciona ambas fechas")
                }}>
                <FileSpreadsheet className="w-6 h-6" /> Descargar Excel (.xlsx)
              </Button>
            </div>
          </div>
        )}
      </main>

      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ImportacionForm importacion={importacionEditando} onSave={handleGuardar} onCancel={() => { setMostrarFormulario(false); setImportacionEditando(null); }} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard