import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Home() {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const texts = [
    'Bienvenido al OVA de Lógica Digital',
    'Aprende con Herramientas Interactivas',
    'UTS - Unidades Tecnológicas de Santander'
  ]

  useEffect(() => {
    const currentText = texts[currentIndex]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(currentText.slice(0, displayText.length - 1))
        } else {
          setIsDeleting(false)
          setCurrentIndex((prev) => (prev + 1) % texts.length)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timeout)
  }, [displayText, currentIndex, isDeleting, texts])

  const modules = [
    {
      title: 'Convertidor Numérico',
      description: 'Convierte números entre diferentes sistemas numéricos: decimal, binario, octal y hexadecimal.',
      path: '/convertidor',
      icon: '🔢'
    },
    {
      title: 'Simulador de Circuitos',
      description: 'Diseña y simula circuitos lógicos digitales con compuertas AND, OR, NOT y más.',
      path: '/simulador',
      icon: '⚡'
    },
    {
      title: 'Álgebra de Boole',
      description: 'Practica y resuelve expresiones booleanas con tablas de verdad y simplificación.',
      path: '/algebra',
      icon: '🧮'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Título con efecto de escritura */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 h-16 flex items-center justify-center">
          <span className="text-gradient-uts">
            {displayText}
            <span className="animate-pulse text-green-500">|</span>
          </span>
        </h1>
      </div>

      <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12 text-center">
        Aprende los fundamentos de la lógica digital a través de herramientas interactivas 
        y las simulaciones prácticas. Explora los conceptos clave y resuelve problemas prácticos.
        los conceptos básicos de la electrónica digital.
      </p>

      <div className="grid md:grid-cols-3 gap-10 mb-12">
        {modules.map((module, index) => (
          <Link
            key={module.path}
            to={module.path}
            className="module-card-large group relative overflow-hidden"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            {/* Efecto de fondo animado */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-100 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-110 group-hover:scale-100"></div>
            
            {/* Contenido de la tarjeta */}
            <div className="relative z-10">
              <div className="text-6xl mb-6 transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-400 flex justify-center">
                {module.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-700 transition-colors duration-300 text-center">
                {module.title}
              </h3>
              <p className="text-gray-600 group-hover:text-emerald-600 transition-colors duration-300 text-center leading-relaxed text-lg">
                {module.description}
              </p>
            </div>

            {/* Efecto de borde animado verde ópalo */}
            <div className="absolute inset-0 rounded-xl border-3 border-transparent group-hover:border-emerald-400 transition-all duration-300"></div>
            
            {/* Efecto shimmer verde ópalo */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-200 to-transparent transform -skew-x-12 animate-shimmer"></div>
            </div>

            {/* Sombra adicional en hover */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10">
              <div className="absolute inset-0 bg-emerald-400 blur-xl scale-110 opacity-20"></div>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">
          ¿Por qué estudiar Lógica Digital?
        </h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="info-card group">
            <div className="relative z-10">
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-700 transition-colors duration-300">
                Fundamentos de la Computación
              </h3>
              <p className="text-gray-600 group-hover:text-green-600 transition-colors duration-300">
                La lógica digital es la base de todos los sistemas informáticos modernos, desde microprocesadores hasta aplicaciones de software.
              </p>
            </div>
          </div>
          <div className="info-card group">
            <div className="relative z-10">
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-700 transition-colors duration-300">
                Diseño de Circuitos
              </h3>
              <p className="text-gray-600 group-hover:text-green-600 transition-colors duration-300">
                Aprende a diseñar circuitos electrónicos que pueden realizar operaciones lógicas complejas de manera eficiente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home