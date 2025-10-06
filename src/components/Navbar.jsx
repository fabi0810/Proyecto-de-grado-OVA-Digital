import { Link, useLocation } from 'react-router-dom'
import programaLogo from '../image/logo-uts.jpeg'

function Navbar() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Inicio' },
    { path: '/convertidor', label: 'Convertidor Numérico' },
    { path: '/simulador', label: 'Simulador de Circuitos' },
    { path: '/algebra', label: 'Álgebra de Boole' }
  ]

  return (
    <nav className="bg-white shadow-lg border-b border-white-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo UTS */}
          <Link to="/" className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              {/* Logo UTS SVG */}
              <div className="w-10 h-10 bg-gradient-to-br from-black-600 to-white-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 overflow-hidden">
  <img
    src={programaLogo}
    alt="Logo Programa"
    className="w-full h-full object-contain"
  />
</div>

            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-bold text-gradient-uts">
                OVA Lógica Digital
              </div>
              <div className="text-xs text-green-600 font-medium">
                UTS - Unidades Tecnológicas
              </div>
            </div>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link relative overflow-hidden group ${
                  location.pathname === item.path
                    ? 'bg-green-100 text-green-700 shadow-md'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                {/* Efecto de hover animado */}
                <span className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left opacity-10"></span>
                
                {/* Indicador activo */}
                {location.pathname === item.path && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-green-600 animate-pulse"></span>
                )}
                
                <span className="relative z-10 font-medium">
                  {item.label}
                </span>
                
                {/* Efecto shimmer en hover */}
                <span className="absolute inset-0 -top-2 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -skew-x-12 group-hover:animate-shimmer"></span>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 transition-colors duration-200"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menú principal</span>
              {/* Hamburger icon */}
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-green-50/80 backdrop-blur-sm border-t border-green-100">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-700 hover:text-green-600 hover:bg-green-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar