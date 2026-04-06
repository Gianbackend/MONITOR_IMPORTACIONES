import Dashboard from './components/Dashboard'

function App() {
  return (
    // Quitamos el padding y dejamos el fondo transparente
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto h-screen flex items-center justify-center">
        {/* Eliminamos el estilo de 'background', 'blur' y 'border' de aquí */}
        <div className="w-full h-full overflow-hidden">
          <Dashboard />
        </div>
      </div>
    </div>
  )
}

export default App