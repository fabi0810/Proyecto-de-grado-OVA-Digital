import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Inicio' },
    { path: '/convertidor', label: 'Convertidor Numérico' },
    { path: '/simulador', label: 'Simulador de Circuitos' },
    { path: '/algebra', label: 'Álgebra de Boole' }
  ]

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-blue-600">
            OVA Lógica Digital
          </Link>
          
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar