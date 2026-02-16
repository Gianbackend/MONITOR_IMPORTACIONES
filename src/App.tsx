import Dashboard from './components/Dashboard'

function App() {
  return (
    <div className="min-h-screen py-8 px-4">
      {/* Contenedor principal con efecto vidrio */}
      <div className="max-w-7xl mx-auto">
        <div 
          className="rounded-2xl shadow-2xl overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.50)', /* 85% blanco - moderado */
            backdropFilter: 'blur(15px)', /* Blur moderado */
            WebkitBackdropFilter: 'blur(15px)', /* Safari */
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <Dashboard />
        </div>
      </div>
    </div>
  )
}

export default App
