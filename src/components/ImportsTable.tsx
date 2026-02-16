import { Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Importacion } from '../types'

interface ImportsTableProps {
  data: Importacion[]
  onEdit: (importacion: Importacion) => void
  onDelete: (id: number) => void
}

const ImportsTable = ({ data, onEdit, onDelete }: ImportsTableProps) => {
  const getEstadoBadge = (estado: string) => {
    const styles = {
      'Pendiente': 'bg-yellow-100 text-yellow-800',
      'En Tránsito': 'bg-orange-100 text-orange-800',
      'Recibido': 'bg-green-100 text-green-800',
      'Aprobado': 'bg-purple-100 text-purple-800'
    }
    return styles[estado as keyof typeof styles] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">
          Importaciones Registradas ({data.length})
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proveedor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                País Origen
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Llegada
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((imp) => (
              <tr key={imp.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {imp.codigo_importacion}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {imp.proveedor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {imp.pais_origen}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(imp.fecha_llegada).toLocaleDateString('es-ES')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoBadge(imp.estado)}`}>
                    {imp.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  ${imp.monto_total.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(imp)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(imp.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ImportsTable
