import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bienvenido al OVA de Lógica Digital
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Aprende los fundamentos de la lógica digital a través de herramientas interactivas 
          y simulaciones prácticas.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <Link
          to="/convertidor"
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
        >
          <div className="text-4xl mb-4">🔢</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Convertidor Numérico
          </h3>
          <p className="text-gray-600">
            Convierte números entre diferentes sistemas numéricos: decimal, binario, octal y hexadecimal.
          </p>
        </Link>

        <Link
          to="/simulador"
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
        >
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Simulador de Circuitos
          </h3>
          <p className="text-gray-600">
            Diseña y simula circuitos lógicos digitales con compuertas AND, OR, NOT y más.
          </p>
        </Link>

        <Link
          to="/algebra"
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
        >
          <div className="text-4xl mb-4">🧮</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Álgebra de Boole
          </h3>
          <p className="text-gray-600">
            Practica y resuelve expresiones booleanas con tablas de verdad y simplificación.
          </p>
        </Link>
      </div>
    </div>
  )
}

export default Home