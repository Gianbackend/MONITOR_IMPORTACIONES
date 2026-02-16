import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Importacion } from '../types'

interface ImportacionFormProps {
  importacion: Importacion | null
  onSave: (importacion: Omit<Importacion, 'id'>) => void
  onCancel: () => void
}

const ImportacionForm = ({ importacion, onSave, onCancel }: ImportacionFormProps) => {
  const [formData, setFormData] = useState({
    codigo_importacion: '',
    proveedor: '',
    pais_origen: '',
    fecha_llegada: '',
    estado: 'Pendiente' as 'Pendiente' | 'En Tránsito' | 'Recibido' | 'Aprobado',
    monto_total: 0
  })

  useEffect(() => {
    if (importacion) {
      setFormData({
        codigo_importacion: importacion.codigo_importacion,
        proveedor: importacion.proveedor,
        pais_origen: importacion.pais_origen,
        fecha_llegada: importacion.fecha_llegada.split('T')[0],
        estado: importacion.estado,
        monto_total: importacion.monto_total
      })
    }
  }, [importacion])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-4">
        {importacion ? 'Editar Importación' : 'Nueva Importación'}
      </h2>

      <div>
        <label htmlFor="codigo_importacion" className="block text-sm font-medium text-gray-700 mb-1">
          Código
        </label>
        <Input
          id="codigo_importacion"
          value={formData.codigo_importacion}
          onChange={(e) => setFormData({ ...formData, codigo_importacion: e.target.value })}
          required
        />
      </div>

      <div>
        <label htmlFor="proveedor" className="block text-sm font-medium text-gray-700 mb-1">
          Proveedor
        </label>
        <Input
          id="proveedor"
          value={formData.proveedor}
          onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
          required
        />
      </div>

      <div>
        <label htmlFor="pais_origen" className="block text-sm font-medium text-gray-700 mb-1">
          País de Origen
        </label>
        <Input
          id="pais_origen"
          value={formData.pais_origen}
          onChange={(e) => setFormData({ ...formData, pais_origen: e.target.value })}
          required
        />
      </div>

      <div>
        <label htmlFor="fecha_llegada" className="block text-sm font-medium text-gray-700 mb-1">
          Fecha de Llegada
        </label>
        <Input
          id="fecha_llegada"
          type="date"
          value={formData.fecha_llegada}
          onChange={(e) => setFormData({ ...formData, fecha_llegada: e.target.value })}
          required
        />
      </div>

      <div>
        <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
          Estado
        </label>
        <Select
          value={formData.estado}
          onValueChange={(value: 'Pendiente' | 'En Tránsito' | 'Recibido' | 'Aprobado') =>
            setFormData({ ...formData, estado: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pendiente">Pendiente</SelectItem>
            <SelectItem value="En Tránsito">En Tránsito</SelectItem>
            <SelectItem value="Recibido">Recibido</SelectItem>
            <SelectItem value="Aprobado">Aprobado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="monto_total" className="block text-sm font-medium text-gray-700 mb-1">
          Monto
        </label>
        <Input
          id="monto_total"
          type="number"
          value={formData.monto_total}
          onChange={(e) => setFormData({ ...formData, monto_total: Number(e.target.value) })}
          required
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          Guardar
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
      </div>
    </form>
  )
}

export default ImportacionForm
