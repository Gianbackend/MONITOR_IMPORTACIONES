import { Package, Clock, CheckCircle, DollarSign, FileCheck } from 'lucide-react'
import type { Importacion } from '../types'

interface StatsCardsProps {
  data: Importacion[]
}

const StatsCards = ({ data }: StatsCardsProps) => {
  const total = data.length
  const pendientes = data.filter(imp => imp.estado === 'Pendiente').length
  const enTransito = data.filter(imp => imp.estado === 'En Tránsito').length
  const recibidos = data.filter(imp => imp.estado === 'Recibido').length
  const aprobados = data.filter(imp => imp.estado === 'Aprobado').length
  const montoTotal = data.reduce((sum, imp) => sum + imp.monto_total, 0)

  
  const stats = [
    {
      title: 'Total',
      value: total,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Pendientes',
      value: pendientes,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'En Tránsito',
      value: enTransito,
      icon: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Recibidos',
      value: recibidos,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    // {
    //   title: 'Aprobados',
    //   value: aprobados,
    //   icon: FileCheck,
    //   color: 'text-purple-600',
    //   bgColor: 'bg-purple-50'
    // },
    {
      title: 'Monto Total',
      value: `$${montoTotal.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ]
  //grid -cols 6 cuando descomentes el de aprobados
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6"> 
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.title}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StatsCards
