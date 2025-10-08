import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Home() {
  const [scrolled, setScrolled] = useState(false)
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
  }, [displayText, currentIndex, isDeleting])
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const modules = [
    {
      title: 'Convertidor Numérico',
      description: 'Convierte números entre diferentes sistemas numéricos: decimal, binario, octal y hexadecimal.',
      path: '/convertidor',
      icon: '🔢',
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'Simulador de Circuitos',
      description: 'Diseña y simula circuitos lógicos digitales con compuertas AND, OR, NOT y más.',
      path: '/simulador',
      icon: '⚡',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Álgebra de Boole',
      description: 'Practica y resuelve expresiones booleanas con tablas de verdad y simplificación.',
      path: '/algebra',
      icon: '🧮',
      gradient: 'from-violet-500 to-purple-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      {/* Navbar fija */}
      
      {/* Hero Section */}
      <section id="inicio" className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 mb-16">
            <div className="inline-block">
              <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold animate-fade-in">
                Plataforma Educativa Interactiva
              </span>
            </div>
            
            <h1
  className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 leading-tight animate-slide-up"
  style={{
    textShadow: '2px 2px 4px rgba(0,0,0,0.3), 4px 4px 8px rgba(0,0,0,0.2)',
    transform: 'perspective(600px) rotateX(10deg) rotateY(-5deg)',
  }}
> 
  Bienvenido al OVA de Lógica Digital
</h1>
            
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 animate-slide-up-delay">
              Unidades Tecnológicas de Santander
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto animate-fade-in-delay">
              Explora los fundamentos de la lógica digital a través de herramientas interactivas y simulaciones prácticas. Aprende los conceptos clave de la electrónica digital.
            </p>
            <div className="flex flex-wrap gap-4 pt-4 justify-center animate-fade-in-delay-2">
              <a href="#modulos" className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
                Explorar Módulos
              </a>
              
            </div>
          </div>
        </div>
      </section>

      {/* Módulos Interactivos */}
      <section id="modulos" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explora lo modulos</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Elige un módulo para comenzar tu aprendizaje en lógica digital
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Convertidor Numérico */}
            <Link
              to={modules[0].path}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden text-left w-full animate-fade-in-up"
            >
              <div className={`h-2 bg-gradient-to-r ${modules[0].gradient}`}></div>
              
              <div className="p-8">
                {/* Ilustración SVG - Convertidor */}
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-2xl blur-xl"></div>
                  <div className="relative bg-white/50 backdrop-blur-sm rounded-2xl p-6">
                    <svg viewBox="0 0 200 150" className="w-full h-auto">
                      <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" style={{stopColor: '#10b981', stopOpacity: 1}} />
                          <stop offset="100%" style={{stopColor: '#14b8a6', stopOpacity: 1}} />
                        </linearGradient>
                      </defs>
                      
                      <text x="30" y="40" fontSize="24" fill="url(#grad1)" fontWeight="bold">10</text>
                      <text x="150" y="40" fontSize="20" fill="#6b7280" fontWeight="bold">DEC</text>
                      
                      <path d="M 100 50 L 100 80" stroke="#10b981" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)"/>
                      <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                          <polygon points="0 0, 10 5, 0 10" fill="#10b981" />
                        </marker>
                      </defs>
                      
                      <text x="20" y="110" fontSize="20" fill="#3b82f6" fontWeight="bold">1010</text>
                      <text x="150" y="110" fontSize="16" fill="#6b7280" fontWeight="bold">BIN</text>
                      
                      <text x="30" y="140" fontSize="20" fill="#8b5cf6" fontWeight="bold">0xA</text>
                      <text x="150" y="140" fontSize="16" fill="#6b7280" fontWeight="bold">HEX</text>
                      
                      <circle cx="80" cy="90" r="3" fill="#10b981">
                        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite"/>
                      </circle>
                      <circle cx="120" cy="90" r="3" fill="#3b82f6">
                        <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
                      </circle>
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                  {modules[0].title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {modules[0].description}
                </p>
                
                <div className="flex items-center text-emerald-600 font-semibold group-hover:text-emerald-700">
                  <span>Explorar módulo</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700"></div>
            </Link>

            {/* Simulador de Circuitos */}
            <Link
              to={modules[1].path}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden text-left w-full animate-fade-in-up"
              style={{animationDelay: '150ms'}}
            >
              <div className={`h-2 bg-gradient-to-r ${modules[1].gradient}`}></div>
              
              <div className="p-8">
                {/* Ilustración SVG - Circuito */}
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-2xl blur-xl"></div>
                  <div className="relative bg-white/50 backdrop-blur-sm rounded-2xl p-6">
                    <svg viewBox="0 0 200 150" className="w-full h-auto">
                      <rect x="10" y="10" width="180" height="130" fill="#1e293b" rx="6"/>
                      
                      <path d="M 25 50 L 75 50" stroke="#3b82f6" strokeWidth="3" fill="none"/>
                      <path d="M 75 50 L 100 75" stroke="#3b82f6" strokeWidth="3" fill="none"/>
                      <path d="M 100 75 L 150 75" stroke="#3b82f6" strokeWidth="3" fill="none"/>
                      <path d="M 75 50 L 100 25" stroke="#10b981" strokeWidth="3" fill="none"/>
                      <path d="M 100 25 L 150 25" stroke="#10b981" strokeWidth="3" fill="none"/>
                      
                      <circle cx="75" cy="50" r="10" fill="#3b82f6">
                        <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
                      </circle>
                      <text x="75" y="53" fontSize="8" fill="white" textAnchor="middle" fontWeight="bold">AND</text>
                      
                      <circle cx="100" cy="25" r="10" fill="#10b981">
                        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
                      </circle>
                      <text x="100" y="28" fontSize="8" fill="white" textAnchor="middle" fontWeight="bold">OR</text>
                      
                      <circle cx="100" cy="75" r="10" fill="#8b5cf6">
                        <animate attributeName="opacity" values="1;0.7;1" dur="2.5s" repeatCount="indefinite"/>
                      </circle>
                      <text x="100" y="78" fontSize="8" fill="white" textAnchor="middle" fontWeight="bold">NOT</text>
                      
                      <rect x="140" y="18" width="20" height="15" fill="#475569" rx="2"/>
                      <rect x="140" y="68" width="20" height="15" fill="#475569" rx="2"/>
                      
                      <circle cx="25" cy="50" r="4" fill="#fbbf24"/>
                      <circle cx="150" cy="25" r="4" fill="#fbbf24"/>
                      <circle cx="150" cy="75" r="4" fill="#fbbf24"/>
                      
                      <text x="50" y="40" fontSize="14" fill="#3b82f6" opacity="0.7" fontWeight="bold">1</text>
                      <text x="125" y="60" fontSize="14" fill="#10b981" opacity="0.7" fontWeight="bold">0</text>
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {modules[1].title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {modules[1].description}
                </p>
                
                <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                  <span>Explorar módulo</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700"></div>
            </Link>

            {/* Álgebra de Boole */}
            <Link
              to={modules[2].path}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden text-left w-full animate-fade-in-up"
              style={{animationDelay: '300ms'}}
            >
              <div className={`h-2 bg-gradient-to-r ${modules[2].gradient}`}></div>
              
              <div className="p-8">
                {/* Ilustración SVG - Álgebra de Boole */}
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-2xl blur-xl"></div>
                  <div className="relative bg-white/50 backdrop-blur-sm rounded-2xl p-6">
                    <svg viewBox="0 0 200 150" className="w-full h-auto">
                      <rect x="15" y="15" width="170" height="120" fill="#f9fafb" stroke="#8b5cf6" strokeWidth="2" rx="6"/>
                      
                      <text x="35" y="35" fontSize="12" fill="#8b5cf6" fontWeight="bold">A</text>
                      <text x="75" y="35" fontSize="12" fill="#8b5cf6" fontWeight="bold">B</text>
                      <text x="115" y="35" fontSize="12" fill="#8b5cf6" fontWeight="bold">A∧B</text>
                      <text x="155" y="35" fontSize="12" fill="#8b5cf6" fontWeight="bold">A∨B</text>
                      
                      <line x1="20" y1="42" x2="180" y2="42" stroke="#8b5cf6" strokeWidth="1"/>
                      
                      <text x="35" y="60" fontSize="11" fill="#6b7280">0</text>
                      <text x="75" y="60" fontSize="11" fill="#6b7280">0</text>
                      <text x="120" y="60" fontSize="11" fill="#ef4444">0</text>
                      <text x="160" y="60" fontSize="11" fill="#ef4444">0</text>
                      
                      <text x="35" y="80" fontSize="11" fill="#6b7280">0</text>
                      <text x="75" y="80" fontSize="11" fill="#6b7280">1</text>
                      <text x="120" y="80" fontSize="11" fill="#ef4444">0</text>
                      <text x="160" y="80" fontSize="11" fill="#10b981">1</text>
                      
                      <text x="35" y="100" fontSize="11" fill="#6b7280">1</text>
                      <text x="75" y="100" fontSize="11" fill="#6b7280">0</text>
                      <text x="120" y="100" fontSize="11" fill="#ef4444">0</text>
                      <text x="160" y="100" fontSize="11" fill="#10b981">1</text>
                      
                      <text x="35" y="120" fontSize="11" fill="#6b7280">1</text>
                      <text x="75" y="120" fontSize="11" fill="#6b7280">1</text>
                      <text x="120" y="120" fontSize="11" fill="#10b981">1</text>
                      <text x="160" y="120" fontSize="11" fill="#10b981">1</text>
                      
                      <text x="30" y="145" fontSize="16" fill="#8b5cf6" opacity="0.4" fontWeight="bold">¬</text>
                      <text x="100" y="145" fontSize="16" fill="#8b5cf6" opacity="0.4" fontWeight="bold">∧</text>
                      <text x="170" y="145" fontSize="16" fill="#8b5cf6" opacity="0.4" fontWeight="bold">∨</text>
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-violet-600 transition-colors">
                  {modules[2].title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {modules[2].description}
                </p>
                
                <div className="flex items-center text-violet-600 font-semibold group-hover:text-violet-700">
                  <span>Explorar módulo</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* Sección informativa */}
      <section id="info" className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué estudiar Lógica Digital?
            </h2>
            <p className="text-xl text-gray-600">
              Descubre la importancia de esta disciplina fundamental
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-emerald-500">
              <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Fundamentos de la Computación
              </h3>
              <p className="text-gray-600 leading-relaxed">
                La lógica digital es la base de todos los sistemas informáticos modernos, desde microprocesadores hasta aplicaciones de software.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-blue-500">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Diseño de Circuitos
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Aprende a diseñar circuitos electrónicos que pueden realizar operaciones lógicas complejas de manera eficiente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Lógica Digital</h3>
                  <p className="text-sm text-emerald-400">UTS</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Plataforma educativa para el aprendizaje de lógica digital y diseño de circuitos.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-gray-400">
              <li>
    <Link to="/" className="hover:text-emerald-400 transition-colors">
      Inicio
    </Link>
  </li>
  <li>
    <Link to="/convertidor" className="hover:text-emerald-400 transition-colors">
      Convertidor Numérico
    </Link>
  </li>
  <li>
    <Link to="/simulador" className="hover:text-emerald-400 transition-colors">
      Simulador de Circuitos
    </Link>
  </li>
  <li>
    <Link to="/algebra" className="hover:text-emerald-400 transition-colors">
      Álgebra de Boole
    </Link>
  </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Universidad</h4>
              <p className="text-gray-400 text-sm mb-2">
                Unidades Tecnológicas de Santander
              </p>
              <p className="text-gray-400 text-sm">
                Bucaramanga, Colombia
              </p>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 Lógica Digital - UTS. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

     
<style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-up {
          animation: slideUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-up-delay {
          animation: slideUp 0.8s ease-out 0.2s forwards;
          opacity: 0;
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-delay {
          animation: fadeIn 0.8s ease-out 0.4s forwards;
          opacity: 0;
        }

        .animate-fade-in-delay-2 {
          animation: fadeIn 0.8s ease-out 0.6s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}



export default Home
