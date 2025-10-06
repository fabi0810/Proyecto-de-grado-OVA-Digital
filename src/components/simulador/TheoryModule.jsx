import { useState } from 'react'
const AndIcon = () => (
  <svg viewBox="0 0 100 80" className="w-full h-full">
    <path d="M 20,20 L 50,20 Q 80,20 80,50 Q 80,80 50,80 L 20,80 Z" 
          fill="currentColor" stroke="currentColor" strokeWidth="2"/>
    <line x1="5" y1="35" x2="20" y2="35" stroke="currentColor" strokeWidth="2"/>
    <line x1="5" y1="65" x2="20" y2="65" stroke="currentColor" strokeWidth="2"/>
    <line x1="80" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="2"/>
  </svg>
)

const OrIcon = () => (
  <svg viewBox="0 0 100 80" className="w-full h-full">
    <path d="M 20,20 Q 40,20 50,50 Q 40,80 20,80 Q 30,50 20,20" 
          fill="currentColor" stroke="currentColor" strokeWidth="2"/>
    <path d="M 50,50 Q 70,30 85,50 Q 70,70 50,50" 
          fill="currentColor" stroke="currentColor" strokeWidth="2"/>
    <line x1="5" y1="35" x2="20" y2="35" stroke="currentColor" strokeWidth="2"/>
    <line x1="5" y1="65" x2="20" y2="65" stroke="currentColor" strokeWidth="2"/>
    <line x1="85" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="2"/>
  </svg>
)

const NotIcon = () => (
  <svg viewBox="0 0 100 80" className="w-full h-full">
    <path d="M 20,20 L 70,50 L 20,80 Z" 
          fill="currentColor" stroke="currentColor" strokeWidth="2"/>
    <circle cx="77" cy="50" r="7" fill="none" stroke="currentColor" strokeWidth="2"/>
    <line x1="5" y1="50" x2="20" y2="50" stroke="currentColor" strokeWidth="2"/>
    <line x1="84" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="2"/>
  </svg>
)

const NandIcon = () => (
  <svg viewBox="0 0 100 80" className="w-full h-full">
    <path d="M 20,20 L 50,20 Q 75,20 75,50 Q 75,80 50,80 L 20,80 Z" 
          fill="currentColor" stroke="currentColor" strokeWidth="2"/>
    <circle cx="82" cy="50" r="7" fill="none" stroke="currentColor" strokeWidth="2"/>
    <line x1="5" y1="35" x2="20" y2="35" stroke="currentColor" strokeWidth="2"/>
    <line x1="5" y1="65" x2="20" y2="65" stroke="currentColor" strokeWidth="2"/>
    <line x1="89" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="2"/>
  </svg>
)

const NorIcon = () => (
  <svg viewBox="0 0 100 80" className="w-full h-full">
    <path d="M 20,20 Q 40,20 50,50 Q 40,80 20,80 Q 30,50 20,20" 
          fill="currentColor" stroke="currentColor" strokeWidth="2"/>
    <path d="M 50,50 Q 65,35 77,50 Q 65,65 50,50" 
          fill="currentColor" stroke="currentColor" strokeWidth="2"/>
    <circle cx="84" cy="50" r="7" fill="none" stroke="currentColor" strokeWidth="2"/>
    <line x1="5" y1="35" x2="20" y2="35" stroke="currentColor" strokeWidth="2"/>
    <line x1="5" y1="65" x2="20" y2="65" stroke="currentColor" strokeWidth="2"/>
    <line x1="91" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="2"/>
  </svg>
)

const XorIcon = () => (
  <svg viewBox="0 0 100 80" className="w-full h-full">
    <path d="M 15,20 Q 25,50 15,80" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M 23,20 Q 43,20 53,50 Q 43,80 23,80 Q 33,50 23,20" 
          fill="currentColor" stroke="currentColor" strokeWidth="2"/>
    <path d="M 53,50 Q 73,30 88,50 Q 73,70 53,50" 
          fill="currentColor" stroke="currentColor" strokeWidth="2"/>
    <line x1="5" y1="35" x2="23" y2="35" stroke="currentColor" strokeWidth="2"/>
    <line x1="5" y1="65" x2="23" y2="65" stroke="currentColor" strokeWidth="2"/>
    <line x1="88" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="2"/>
  </svg>
)

const XnorIcon = () => (
  <svg viewBox="0 0 100 80" className="w-full h-full">
    <path d="M 15,20 Q 25,50 15,80" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M 23,20 Q 43,20 53,50 Q 43,80 23,80 Q 33,50 23,20" 
          fill="currentColor" stroke="currentColor" strokeWidth="2"/>
    <path d="M 53,50 Q 68,35 80,50 Q 68,65 53,50" 
          fill="currentColor" stroke="currentColor" strokeWidth="2"/>
    <circle cx="87" cy="50" r="7" fill="none" stroke="currentColor" strokeWidth="2"/>
    <line x1="5" y1="35" x2="23" y2="35" stroke="currentColor" strokeWidth="2"/>
    <line x1="5" y1="65" x2="23" y2="65" stroke="currentColor" strokeWidth="2"/>
    <line x1="94" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="2"/>
  </svg>
)


const TheoryModule = () => {
  const [activeGate, setActiveGate] = useState('AND')
  const [showVisualization, setShowVisualization] = useState(false)
  const [activeTab, setActiveTab] = useState('basics')

  const gates = {
    AND: {
      name: 'Compuerta AND',
      symbol: '&',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: AndIcon,
      description: 'La compuerta AND produce salida 1 solo cuando TODAS sus entradas son 1. Es como una puerta que necesita múltiples llaves.',
      formula: 'Y = A · B',
      applications: [
        'Sistemas de seguridad multinivel',
        'Validación de condiciones múltiples',
        'Control de acceso combinado',
        'Circuitos de habilitación'
      ],
      truthTable: [
        { A: 0, B: 0, Y: 0, description: 'Ambas desactivadas' },
        { A: 0, B: 1, Y: 0, description: 'Solo B activa' },
        { A: 1, B: 0, Y: 0, description: 'Solo A activa' },
        { A: 1, B: 1, Y: 1, description: 'Ambas activas ✓' }
      ],
      realExample: 'Un auto solo arranca si la llave está insertada Y el cinturón está abrochado.',
      visualization: {
        title: 'Funcionamiento de AND',
        description: 'Todos los interruptores deben estar cerrados',
        circuit: 'A ──┬──┐\n    │  │AND├── Y\nB ──┴──┘'
      }
    },
    OR: {
      name: 'Compuerta OR',
      symbol: '≥1',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: OrIcon,
      description: 'La compuerta OR produce salida 1 cuando AL MENOS UNA entrada es 1. Es como múltiples caminos que llevan al mismo destino.',
      formula: 'Y = A + B',
      applications: [
        'Sistemas de alarma con múltiples sensores',
        'Detección de eventos alternativos',
        'Circuitos de respaldo',
        'Señales de emergencia'
      ],
      truthTable: [
        { A: 0, B: 0, Y: 0, description: 'Ninguna activa' },
        { A: 0, B: 1, Y: 1, description: 'B activa ✓' },
        { A: 1, B: 0, Y: 1, description: 'A activa ✓' },
        { A: 1, B: 1, Y: 1, description: 'Ambas activas ✓' }
      ],
      realExample: 'Una luz se enciende si presionas el interruptor de la pared O el control remoto.',
      visualization: {
        title: 'Funcionamiento de OR',
        description: 'Cualquier interruptor puede activar la salida',
        circuit: 'A ──┐\n    │OR├── Y\nB ──┘'
      }
    },
    NOT: {
      name: 'Compuerta NOT',
      symbol: '¬',
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: NotIcon,
      description: 'La compuerta NOT invierte la señal: convierte 0 en 1 y 1 en 0. Es el operador de negación lógica.',
      formula: 'Y = Ā',
      applications: [
        'Inversión de señales de control',
        'Generación de complementos',
        'Lógica de negación',
        'Circuitos de reset'
      ],
      truthTable: [
        { A: 0, Y: 1, description: 'Entrada baja → Salida alta ✓' },
        { A: 1, Y: 0, description: 'Entrada alta → Salida baja ✓' }
      ],
      realExample: 'Un ventilador que funciona cuando NO hace frío (sensor de temperatura invertido).',
      visualization: {
        title: 'Funcionamiento de NOT',
        description: 'Invierte el estado de la señal',
        circuit: 'A ──┤o├── Y'
      }
    },
    NAND: {
      name: 'Compuerta NAND',
      symbol: '⊼',
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      icon: NandIcon,
      description: 'NAND es NOT + AND. Produce 0 solo cuando TODAS las entradas son 1. Es una compuerta universal.',
      formula: 'Y = (A · B)̄',
      applications: [
        'Construcción de otras compuertas',
        'Memoria NAND Flash',
        'Circuitos lógicos universales',
        'Flip-flops básicos'
      ],
      truthTable: [
        { A: 0, B: 0, Y: 1, description: 'Ninguna activa ✓' },
        { A: 0, B: 1, Y: 1, description: 'Solo B ✓' },
        { A: 1, B: 0, Y: 1, description: 'Solo A ✓' },
        { A: 1, B: 1, Y: 0, description: 'Ambas activas' }
      ],
      realExample: 'Sistema de emergencia que se activa cuando NO están todas las condiciones seguras.',
      visualization: {
        title: 'Funcionamiento de NAND',
        description: 'AND invertido - universal para construir cualquier circuito',
        circuit: 'A ──┬──┐\n    │  │NAND├── Y\nB ──┴──┘'
      }
    },
    NOR: {
      name: 'Compuerta NOR',
      symbol: '⊽',
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: NorIcon,
      description: 'NOR es NOT + OR. Produce 1 solo cuando TODAS las entradas son 0. También es una compuerta universal.',
      formula: 'Y = (A + B)̄',
      applications: [
        'Detección de condición cero',
        'Construcción universal de circuitos',
        'Flip-flops SR',
        'Comparadores'
      ],
      truthTable: [
        { A: 0, B: 0, Y: 1, description: 'Ninguna activa ✓' },
        { A: 0, B: 1, Y: 0, description: 'B activa' },
        { A: 1, B: 0, Y: 0, description: 'A activa' },
        { A: 1, B: 1, Y: 0, description: 'Ambas activas' }
      ],
      realExample: 'Modo ahorro de energía que se activa solo cuando NO hay movimiento Y NO hay luz.',
      visualization: {
        title: 'Funcionamiento de NOR',
        description: 'OR invertido - también universal',
        circuit: 'A ──┐\n    │NOR├── Y\nB ──┘'
      }
    },
    XOR: {
      name: 'Compuerta XOR',
      symbol: '⊕',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: XorIcon,
      description: 'XOR (OR Exclusivo) produce 1 cuando las entradas son DIFERENTES. Detecta cambios y diferencias.',
      formula: 'Y = A ⊕ B',
      applications: [
        'Sumadores binarios',
        'Comparadores de igualdad',
        'Encriptación básica',
        'Detección de paridad'
      ],
      truthTable: [
        { A: 0, B: 0, Y: 0, description: 'Iguales (ambas 0)' },
        { A: 0, B: 1, Y: 1, description: 'Diferentes ✓' },
        { A: 1, B: 0, Y: 1, description: 'Diferentes ✓' },
        { A: 1, B: 1, Y: 0, description: 'Iguales (ambas 1)' }
      ],
      realExample: 'Interruptor de escalera: la luz cambia cuando accionas cualquiera de los dos switches.',
      visualization: {
        title: 'Funcionamiento de XOR',
        description: 'Activa cuando hay diferencia entre entradas',
        circuit: 'A ──┐\n    │XOR├── Y\nB ──┘'
      }
    },
    XNOR: {
      name: 'Compuerta XNOR',
      symbol: '⊙',
      color: 'bg-pink-100 text-pink-800 border-pink-200',
      icon: XnorIcon,
      description: 'XNOR es XOR invertido. Produce 1 cuando las entradas son IGUALES. Detector de igualdad.',
      formula: 'Y = (A ⊕ B)̄',
      applications: [
        'Comparadores de igualdad',
        'Verificación de bits',
        'Sistemas de paridad',
        'Detección de coincidencias'
      ],
      truthTable: [
        { A: 0, B: 0, Y: 1, description: 'Iguales ✓' },
        { A: 0, B: 1, Y: 0, description: 'Diferentes' },
        { A: 1, B: 0, Y: 0, description: 'Diferentes' },
        { A: 1, B: 1, Y: 1, description: 'Iguales ✓' }
      ],
      realExample: 'Sistema de verificación que confirma cuando dos sensores dan la misma lectura.',
      visualization: {
        title: 'Funcionamiento de XNOR',
        description: 'Activa cuando hay igualdad entre entradas',
        circuit: 'A ──┐\n    │XNOR├── Y\nB ──┘'
      }
    }
  }

  const tabs = [
    { id: 'basics', label: 'Conceptos Básicos', icon: '📚' },
    { id: 'gates', label: 'Compuertas', icon: '⚡' },
    { id: 'laws', label: 'Leyes Lógicas', icon: '⚖️' },
    { id: 'comparison', label: 'Tabla Comparativa', icon: '📊' }
  ]

  const currentGate = gates[activeGate]

  const renderBasics = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Fundamentos de Circuitos Lógicos
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Los circuitos lógicos procesan información binaria (0 y 1) y son la base de toda la computación digital moderna.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg p-6">
          <div className="text-3xl mb-3">💾</div>
          <h3 className="text-lg font-bold text-blue-900 mb-2">Sistema Binario</h3>
          <p className="text-blue-800 text-sm">
            Solo existen dos estados: <span className="font-bold">0 (falso/apagado)</span> y <span className="font-bold">1 (verdadero/encendido)</span>. 
            Esta simplicidad permite construir sistemas complejos de forma confiable.
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-lg p-6">
          <div className="text-3xl mb-3">⚡</div>
          <h3 className="text-lg font-bold text-green-900 mb-2">Compuertas Lógicas</h3>
          <p className="text-green-800 text-sm">
            Son dispositivos físicos que implementan operaciones lógicas básicas. 
            Combinándolas podemos crear desde calculadoras hasta procesadores modernos.
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-lg p-6">
          <div className="text-3xl mb-3">🔗</div>
          <h3 className="text-lg font-bold text-purple-900 mb-2">Circuitos Digitales</h3>
          <p className="text-purple-800 text-sm">
            Al conectar múltiples compuertas creamos circuitos que realizan tareas complejas: 
            sumar, multiplicar, almacenar datos y tomar decisiones.
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
        <h3 className="text-lg font-bold text-yellow-900 mb-3">¿Por qué estudiar circuitos lógicos?</h3>
        <ul className="space-y-2 text-yellow-800">
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Entender cómo funcionan las computadoras a nivel fundamental</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Desarrollar pensamiento lógico y habilidades de resolución de problemas</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Base para diseño de hardware, programación de bajo nivel e IoT</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Aplicación en IA, criptografía y sistemas embebidos</span>
          </li>
        </ul>
      </div>
    </div>
  )

  const renderGates = () => (
    <div className="space-y-6">
      {/* Selector de compuertas */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
      {Object.entries(gates).map(([key, gate]) => {
  const GateIconComponent = gate.icon
  return (
    <button
            key={key}
            onClick={() => setActiveGate(key)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              activeGate === key
                ? `${gate.color} border-current shadow-lg scale-105`
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
<div className="w-16 h-12 mx-auto mb-2">
  <GateIconComponent />
</div>            <div className="font-semibold text-xs">{key}</div>
            </button>
  )
})}</div>

      {/* Detalles de la compuerta */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-md">
        <div className="flex items-center mb-6">
          <div className="text-4xl mr-4">{currentGate.icon}</div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{currentGate.name}</h3>
            <p className="text-gray-600">Símbolo lógico: <span className="font-mono text-lg">{currentGate.symbol}</span> | Fórmula: <span className="font-mono text-lg">{currentGate.formula}</span></p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 mb-4 text-lg">{currentGate.description}</p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Ejemplo del mundo real:</h4>
            <p className="text-blue-800 italic">{currentGate.realExample}</p>
          </div>
        </div>

        {/* Tabla de verdad */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 text-lg">📋 Tabla de Verdad</h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  {currentGate.truthTable[0].A !== undefined && (
                    <th className="border border-gray-300 px-4 py-2 font-semibold">A</th>
                  )}
                  {currentGate.truthTable[0].B !== undefined && (
                    <th className="border border-gray-300 px-4 py-2 font-semibold">B</th>
                  )}
                  <th className="border border-gray-300 px-4 py-2 font-semibold bg-green-100">Y (Salida)</th>
                  <th className="border border-gray-300 px-4 py-2 font-semibold">Descripción</th>
                </tr>
              </thead>
              <tbody>
                {currentGate.truthTable.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {row.A !== undefined && (
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                          row.A === 1 ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'
                        }`}>
                          {row.A}
                        </span>
                      </td>
                    )}
                    {row.B !== undefined && (
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                          row.B === 1 ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'
                        }`}>
                          {row.B}
                        </span>
                      </td>
                    )}
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                        row.Y === 1 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {row.Y}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                      {row.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Aplicaciones */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 text-lg">🔧 Aplicaciones Prácticas</h4>
          <div className="grid md:grid-cols-2 gap-3">
            {currentGate.applications.map((app, index) => (
              <div key={index} className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-gray-700 text-sm">{app}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Visualización */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900 text-lg">🎨 Visualización del Circuito</h4>
            <button
              onClick={() => setShowVisualization(!showVisualization)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              {showVisualization ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>

          {showVisualization && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-blue-200">
              <h5 className="font-semibold mb-2 text-blue-900">{currentGate.visualization.title}</h5>
              <p className="text-sm text-blue-800 mb-4">{currentGate.visualization.description}</p>
              
              <div className="bg-white p-4 rounded border-2 border-blue-300 font-mono text-sm whitespace-pre">
                {currentGate.visualization.circuit}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderLaws = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Leyes y Propiedades de la Lógica Digital
        </h2>
        <p className="text-gray-600">
          Estas leyes te permiten simplificar y optimizar circuitos lógicos complejos.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">⚖️ Leyes de De Morgan</h3>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-mono text-sm mb-2">NOT (A AND B) = NOT A OR NOT B</p>
              <p className="text-xs text-blue-800">La negación de un AND es un OR de negaciones</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-mono text-sm mb-2">NOT (A OR B) = NOT A AND NOT B</p>
              <p className="text-xs text-blue-800">La negación de un OR es un AND de negaciones</p>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-green-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-900 mb-4">🔄 Propiedades Conmutativas</h3>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="font-mono text-sm mb-2">A AND B = B AND A</p>
              <p className="text-xs text-green-800">El orden no altera el resultado en AND</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="font-mono text-sm mb-2">A OR B = B OR A</p>
              <p className="text-xs text-green-800">El orden no altera el resultado en OR</p>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-purple-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-4">🔗 Propiedades Asociativas</h3>
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="font-mono text-sm mb-2">(A AND B) AND C = A AND (B AND C)</p>
              <p className="text-xs text-purple-800">Podemos agrupar operaciones AND libremente</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="font-mono text-sm mb-2">(A OR B) OR C = A OR (B OR C)</p>
              <p className="text-xs text-purple-800">Podemos agrupar operaciones OR libremente</p>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-orange-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-orange-900 mb-4">📐 Propiedades Distributivas</h3>
          <div className="space-y-4">
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="font-mono text-sm mb-2">A AND (B OR C) = (A AND B) OR (A AND C)</p>
              <p className="text-xs text-orange-800">AND se distribuye sobre OR</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="font-mono text-sm mb-2">A OR (B AND C) = (A OR B) AND (A OR C)</p>
              <p className="text-xs text-orange-800">OR se distribuye sobre AND</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
        <h3 className="text-lg font-bold text-yellow-900 mb-3">💡 Leyes de Identidad y Complemento</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-yellow-800 mb-2">Identidad:</h4>
            <ul className="space-y-1 text-yellow-800">
              <li>• A AND 1 = A</li>
              <li>• A OR 0 = A</li>
              <li>• A XOR 0 = A</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-yellow-800 mb-2">Complemento:</h4>
            <ul className="space-y-1 text-yellow-800">
              <li>• A AND NOT A = 0</li>
              <li>• A OR NOT A = 1</li>
              <li>• NOT (NOT A) = A</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )

  const renderComparison = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Tabla Comparativa de Compuertas
        </h2>
        <p className="text-gray-600">
          Visualiza todas las compuertas y sus comportamientos en paralelo
        </p>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-md overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 font-semibold">A</th>
              <th className="border border-gray-300 px-3 py-2 font-semibold">B</th>
              <th className="border border-gray-300 px-3 py-2 font-semibold bg-blue-100">AND</th>
              <th className="border border-gray-300 px-3 py-2 font-semibold bg-green-100">OR</th>
              <th className="border border-gray-300 px-3 py-2 font-semibold bg-orange-100">NAND</th>
              <th className="border border-gray-300 px-3 py-2 font-semibold bg-red-100">NOR</th>
              <th className="border border-gray-300 px-3 py-2 font-semibold bg-yellow-100">XOR</th>
              <th className="border border-gray-300 px-3 py-2 font-semibold bg-pink-100">XNOR</th>
            </tr>
          </thead>
          <tbody>
            {[
              { a: 0, b: 0, and: 0, or: 0, nand: 1, nor: 1, xor: 0, xnor: 1 },
              { a: 0, b: 1, and: 0, or: 1, nand: 1, nor: 0, xor: 1, xnor: 0 },
              { a: 1, b: 0, and: 0, or: 1, nand: 1, nor: 0, xor: 1, xnor: 0 },
              { a: 1, b: 1, and: 1, or: 1, nand: 0, nor: 0, xor: 0, xnor: 1 }
            ].map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 px-3 py-2 text-center font-mono font-bold">{row.a}</td>
                <td className="border border-gray-300 px-3 py-2 text-center font-mono font-bold">{row.b}</td>
                <td className={`border border-gray-300 px-3 py-2 text-center font-mono font-bold ${row.and === 1 ? 'bg-green-200' : 'bg-red-200'}`}>
                  {row.and}
                </td>
                <td className={`border border-gray-300 px-3 py-2 text-center font-mono font-bold ${row.or === 1 ? 'bg-green-200' : 'bg-red-200'}`}>
                  {row.or}
                </td>
                <td className={`border border-gray-300 px-3 py-2 text-center font-mono font-bold ${row.nand === 1 ? 'bg-green-200' : 'bg-red-200'}`}>
                  {row.nand}
                </td>
                <td className={`border border-gray-300 px-3 py-2 text-center font-mono font-bold ${row.nor === 1 ? 'bg-green-200' : 'bg-red-200'}`}>
                  {row.nor}
                </td>
                <td className={`border border-gray-300 px-3 py-2 text-center font-mono font-bold ${row.xor === 1 ? 'bg-green-200' : 'bg-red-200'}`}>
                  {row.xor}
                </td>
                <td className={`border border-gray-300 px-3 py-2 text-center font-mono font-bold ${row.xnor === 1 ? 'bg-green-200' : 'bg-red-200'}`}>
                  {row.xnor}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4">🎯 Compuertas Universales</h3>
          <div className="space-y-3">
            <div className="bg-white p-3 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-1">NAND</h4>
              <p className="text-xs text-blue-700">
                Puedes construir CUALQUIER otra compuerta usando solo NAND. 
                Es por eso que se llama "universal".
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-1">NOR</h4>
              <p className="text-xs text-blue-700">
                También puedes construir cualquier compuerta usando solo NOR. 
                Otra compuerta universal.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-yellow-50 border-2 border-green-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-green-900 mb-4">🔍 Dato Curioso</h3>
          <div className="space-y-2 text-sm text-green-800">
            <p>
              <strong>¿Sabías que?</strong> Los procesadores modernos contienen miles de millones de transistores 
              organizados en compuertas lógicas.
            </p>
            <p>
              Un procesador Intel Core i9 tiene más de <strong>10 mil millones</strong> de transistores, 
              todos trabajando en conjunto usando las mismas compuertas básicas que estás estudiando.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'basics':
        return renderBasics()
      case 'gates':
        return renderGates()
      case 'laws':
        return renderLaws()
      case 'comparison':
        return renderComparison()
      default:
        return renderBasics()
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          📚 Teoría de Circuitos Lógicos Digitales
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Domina los fundamentos que impulsan toda la tecnología digital moderna
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-2 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[150px] px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        {renderContent()}
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6 mt-12">
        <h3 className="text-lg font-bold text-blue-900 mb-4 text-center">
          🎓 Objetivos de Aprendizaje
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <ul className="space-y-2 text-blue-800 text-sm">
            <li className="flex items-start">
              <span className="text-green-600 mr-2 mt-1">✓</span>
              <span>Comprender el funcionamiento de las 7 compuertas lógicas básicas</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 mt-1">✓</span>
              <span>Aplicar las leyes del álgebra booleana para simplificar circuitos</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 mt-1">✓</span>
              <span>Analizar tablas de verdad y predecir comportamientos</span>
            </li>
          </ul>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li className="flex items-start">
              <span className="text-green-600 mr-2 mt-1">✓</span>
              <span>Identificar aplicaciones prácticas en tecnología moderna</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 mt-1">✓</span>
              <span>Prepararte para diseñar circuitos lógicos en el simulador</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 mt-1">✓</span>
              <span>Desarrollar pensamiento computacional y lógico estructurado</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default TheoryModule