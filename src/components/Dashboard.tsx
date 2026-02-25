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
import { api } from '../services/api'
import {Warehouse } from 'lucide-react'
import {Compass } from 'lucide-react'

const Dashboard = () => {
  const [importaciones, setImportaciones] = useState<Importacion[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [importacionEditando, setImportacionEditando] = useState<Importacion | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    cargarImportaciones()
  }, [])

  const cargarImportaciones = async () => {
    try {
      setLoading(true)
      const data = await api.getImportaciones()
      setImportaciones(data)
    } catch (error) {
      console.error('Error al cargar importaciones:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleActualizar = () => {
    cargarImportaciones()
  }

  const handleGuardar = async (data: Omit<Importacion, 'id'>) => {
  try {
    setLoading(true)
    
    if (importacionEditando) {
      // ✅ Actualizar
      await api.updateImportacion(importacionEditando.id, data)
    } else {
      // ✅ Crear
      await api.createImportacion(data)
    }
    
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
      await api.deleteImportacion(id) // ✅ Cambio aquí
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

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
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
<div className="mt-12">
  <h2 className="text-2xl font-bold text-black-800 mb-2 flex items-center gap-2">
  <Compass className="w-6 h-6" />
  Mapa de Importaciones
</h2>
  <p className="text-gray-600 mb-6">
    Visualiza el origen de tus importaciones y sus rutas hacia Perú
  </p>
  {/* ✅ Agregar esta validación */}
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
      
      
      
      {/* Modal de formulario */}
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
