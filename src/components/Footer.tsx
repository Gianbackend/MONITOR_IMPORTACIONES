const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-12 py-8 border-t border-white/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <div className="text-gray-700 text-sm">
            © {currentYear} <strong className="text-blue-600">Grupo Crosland</strong>. 
            Todos los derechos reservados.
          </div>

          {/* Links adicionales (opcional) */}
          <div className="flex gap-6 text-sm text-gray-600">
            <a 
              href="#" 
              className="hover:text-blue-600 transition-colors"
            >
              Términos de Servicio
            </a>
            <a 
              href="#" 
              className="hover:text-blue-600 transition-colors"
            >
              Política de Privacidad
            </a>
            <a 
              href="#" 
              className="hover:text-blue-600 transition-colors"
            >
              Contacto
            </a>
          </div>

          {/* Versión (opcional) */}
          <div className="text-xs text-gray-500">
            v1.0.0
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
