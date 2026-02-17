import type { Importacion } from '../types'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Ship, Anchor } from 'lucide-react'
import { renderToString } from 'react-dom/server'
import { useEffect, useRef } from 'react'

const createCustomIcon = (color: string, icon: 'peru' | 'ship') => {
  const iconHtml = icon === 'ship' 
    ? renderToString(<Ship color="white" size={24} />)
    : renderToString(<Anchor color="white" size={24} />)
    
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: 4px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        ${iconHtml}
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  })
}

const peruIcon = createCustomIcon('#ef4444', 'peru')
const indiaIcon = createCustomIcon('#2563eb', 'ship')

const waypointIcon = L.divIcon({
  className: 'waypoint-marker',
  html: `
    <div style="
      background: #3b82f6;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>
  `,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

interface ShippingMapProps {
  importaciones: Importacion[]
}

const mumbaiCoords: [number, number] = [18.9388, 72.8354]
const callaoCoords: [number, number] = [-12.0464, -77.0428]

const indiaToPeruRoute: [number, number][] = [
  [18.9388, 72.8354],
  [10.0, 70.0],
  [0, 68.0],
  [-10, 65.0],
  [-20, 60.0],
  [-30, 50.0],
  [-35, 30.0],
  [-38, 20.0],
  [-40, 10.0],
  [-42, 0],
  [-45, -10.0],
  [-48, -25.0],
  [-52, -40.0],
  [-55, -65.0],
  [-56, -70.0],
  [-52, -75.0],
  [-45, -77.0],
  [-35, -78.0],
  [-25, -78.0],
  [-15, -77.5],
  [-12.0464, -77.0428],
]

const portImages = {
  mumbai: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400&h=250&fit=crop',
  callao: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400&h=250&fit=crop',
  capeTown: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&h=250&fit=crop',
}

const namedWaypoints = [
  { 
    coords: mumbaiCoords, 
    name: 'Puerto de Mumbai 🇮🇳', 
    description: 'Puerto de origen - Bajaj Motos',
    image: portImages.mumbai,
    isOrigin: true,
    isDestination: false
  },
  { 
    coords: [-35, 30.0] as [number, number], 
    name: 'Cerca de Ciudad del Cabo 🇿🇦', 
    description: 'Punto de reabastecimiento',
    image: portImages.capeTown,
    isOrigin: false,
    isDestination: false
  },
  { 
    coords: [-55, -65.0] as [number, number], 
    name: 'Estrecho de Magallanes 🇦🇷', 
    description: 'Paso por Tierra del Fuego',
    image: null,
    isOrigin: false,
    isDestination: false
  },
  { 
    coords: callaoCoords, 
    name: 'Puerto del Callao 🇵🇪', 
    description: 'Puerto de destino final',
    image: portImages.callao,
    isOrigin: false,
    isDestination: true
  },
]

// Componente para animar la línea con CSS
const AnimatedPolyline = ({ positions }: { positions: [number, number][] }) => {
  const polylineRef = useRef<L.Polyline | null>(null)

  useEffect(() => {
    if (polylineRef.current) {
      const pathElement = polylineRef.current.getElement() as SVGPathElement | null
      if (pathElement) {
        // Agregar animación CSS
        pathElement.style.strokeDasharray = '20, 15'
        pathElement.style.strokeDashoffset = '0'
        //pathElement.style.animation = 'dash 3s linear infinite'  //coment para movimiento continuo,
        
        // Inyectar keyframes si no existen
        if (!document.getElementById('dash-animation')) {
          const style = document.createElement('style')
          style.id = 'dash-animation'
          style.textContent = `
            @keyframes dash {
              to {
                stroke-dashoffset: -35;
              }
            }
          `
          document.head.appendChild(style)
        }
      }
    }
  }, [])

  return (
    <Polyline
      ref={polylineRef}
      positions={positions}
      color="#2563eb"
      weight={4}
      opacity={0.85}
      smoothFactor={2}
    />
  )
}

const ShippingMap = ({ importaciones }: ShippingMapProps) => {
  const indiaImports = importaciones.filter(imp => imp.pais_origen === 'India')
  
  if (indiaImports.length === 0) {
    return (
      <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center border-2 border-blue-200">
        <div className="text-center">
          <p className="text-6xl mb-4">🚢</p>
          <p className="text-gray-600 text-lg">No hay importaciones desde India para mostrar</p>
        </div>
      </div>
    )
  }

  const totalValue = indiaImports.reduce((sum, imp) => sum + imp.monto_total, 0)

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-2xl border-4 border-white relative">
      <MapContainer
        center={[-20, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={6}
        maxBounds={[[-90, -180], [90, 180]]}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          noWrap={true}
        />

        {/* Ruta marítima animada */}
        <AnimatedPolyline positions={indiaToPeruRoute} />

        {/* Marcadores de waypoints */}
        {namedWaypoints.map((waypoint, index) => {
          const icon = waypoint.isOrigin 
            ? indiaIcon
            : waypoint.isDestination 
            ? peruIcon
            : waypointIcon

          return (
            <Marker key={`waypoint-${index}`} position={waypoint.coords} icon={icon}>
              <Popup maxWidth={350} className="custom-popup">
                <div className="p-0 min-w-[300px]">
                  {waypoint.image && (
                    <div className="w-full h-40 overflow-hidden rounded-t-lg">
                      <img 
                        src={waypoint.image} 
                        alt={waypoint.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="p-3">
                    <strong className="text-lg block mb-2 text-blue-600 border-b-2 border-blue-200 pb-2">
                      {waypoint.name}
                    </strong>
                    <p className="text-sm text-gray-600 mb-3">{waypoint.description}</p>
                    
                    {waypoint.isOrigin && (
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">🏍️</span>
                          <p className="text-sm font-bold text-blue-700">Bajaj Motos</p>
                        </div>
                        <div className="space-y-1 text-xs text-gray-700">
                          <p className="flex items-center gap-2">
                            <span className="font-semibold">📦 Importaciones:</span>
                            <span>{indiaImports.length}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="font-semibold">💰 Valor total:</span>
                            <span className="text-green-600 font-bold">
                              ${totalValue.toLocaleString('es-PE')}
                            </span>
                          </p>
                          <div className="border-t border-blue-200 pt-2 mt-2">
                            <p className="flex items-center gap-2 text-blue-600 font-semibold">
                              <span>⏱️</span>
                              <span>Tiempo estimado: 35-40 días</span>
                            </p>
                            <p className="flex items-center gap-2 text-gray-600 mt-1">
                              <span>📏</span>
                              <span>Distancia: ~18,000 km</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {waypoint.isDestination && (
                      <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                        <p className="text-sm font-semibold text-red-700 flex items-center gap-2">
                          <span>🎯</span>
                          <span>Destino final de {indiaImports.length} envíos</span>
                        </p>
                      </div>
                    )}

                    {waypoint.name.includes('Ciudad del Cabo') && (
                      <div className="bg-amber-50 p-2 rounded border border-amber-200">
                        <p className="text-xs text-amber-700">
                          ⛽ Punto estratégico de reabastecimiento
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Leyenda con z-index alto */}
      <div 
        className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border-2 border-blue-200"
        style={{ zIndex: 1000 }}
      >
        <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span>🗺️</span>
          <span>Ruta Marítima</span>
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-1">
              <div className="absolute inset-0" style={{ 
                background: 'repeating-linear-gradient(to right, #2563eb 0px, #2563eb 10px, transparent 10px, transparent 15px)',
                height: '4px',
                animation: 'dash 3s linear infinite'
              }}></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[8px] border-l-blue-500 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent"></div>
            </div>
            <span className="text-xs text-gray-700 font-medium">Mumbai → Callao</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow"></div>
            <span className="text-xs text-gray-700">Puntos intermedios</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShippingMap