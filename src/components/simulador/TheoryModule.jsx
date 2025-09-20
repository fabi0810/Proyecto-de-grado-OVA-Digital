import { useState } from 'react'

const TheoryModule = () => {
  const [activeSection, setActiveSection] = useState('introduction')

  const sections = [
    { id: 'introduction', title: 'Introducción', icon: '📚' },
    { id: 'gates', title: 'Compuertas Lógicas', icon: '⚡' },
    { id: 'operations', title: 'Operaciones', icon: '🔧' },
    { id: 'circuits', title: 'Circuitos', icon: '🔗' },
    { id: 'applications', title: 'Aplicaciones', icon: '💡' }
  ]

  const gateTypes = [
    {
      id: 'AND',
      name: 'Compuerta AND',
      symbol: '&',
      description: 'La compuerta AND produce una salida de 1 solo cuando todas sus entradas son 1.',
      truthTable: [
        { inputs: [0, 0], output: 0 },
        { inputs: [0, 1], output: 0 },
        { inputs: [1, 0], output: 0 },
        { inputs: [1, 1], output: 1 }
      ],
      explanation: 'Es como un interruptor en serie: todos deben estar activados para que funcione.',
      applications: ['Sistemas de seguridad', 'Validación de datos', 'Control de acceso'],
      color: 'blue'
    },
    {
      id: 'OR',
      name: 'Compuerta OR',
      symbol: '≥1',
      description: 'La compuerta OR produce una salida de 1 cuando al menos una de sus entradas es 1.',
      truthTable: [
        { inputs: [0, 0], output: 0 },
        { inputs: [0, 1], output: 1 },
        { inputs: [1, 0], output: 1 },
        { inputs: [1, 1], output: 1 }
      ],
      explanation: 'Es como interruptores en paralelo: cualquiera puede activar el sistema.',
      applications: ['Sistemas de alarma', 'Múltiples sensores', 'Opciones de entrada'],
      color: 'green'
    },
    {
      id: 'NOT',
      name: 'Compuerta NOT',
      symbol: '1',
      description: 'La compuerta NOT invierte el valor de su entrada: 0 se convierte en 1 y viceversa.',
      truthTable: [
        { inputs: [0], output: 1 },
        { inputs: [1], output: 0 }
      ],
      explanation: 'Es como un inversor: cambia el estado de la señal.',
      applications: ['Inversores de señal', 'Complementos lógicos', 'Control de estado'],
      color: 'purple'
    },
    {
      id: 'NAND',
      name: 'Compuerta NAND',
      symbol: '&̄',
      description: 'La compuerta NAND es la inversa de AND: produce 0 solo cuando todas las entradas son 1.',
      truthTable: [
        { inputs: [0, 0], output: 1 },
        { inputs: [0, 1], output: 1 },
        { inputs: [1, 0], output: 1 },
        { inputs: [1, 1], output: 0 }
      ],
      explanation: 'Es AND seguido de NOT: útil para construir otras compuertas.',
      applications: ['Memoria digital', 'Lógica universal', 'Sistemas de control'],
      color: 'orange'
    },
    {
      id: 'NOR',
      name: 'Compuerta NOR',
      symbol: '≥̄1',
      description: 'La compuerta NOR es la inversa de OR: produce 1 solo cuando todas las entradas son 0.',
      truthTable: [
        { inputs: [0, 0], output: 1 },
        { inputs: [0, 1], output: 0 },
        { inputs: [1, 0], output: 0 },
        { inputs: [1, 1], output: 0 }
      ],
      explanation: 'Es OR seguido de NOT: también es universal para construir otras compuertas.',
      applications: ['Lógica universal', 'Sistemas de seguridad', 'Control de estado'],
      color: 'red'
    },
    {
      id: 'XOR',
      name: 'Compuerta XOR',
      symbol: '=1',
      description: 'La compuerta XOR produce 1 cuando las entradas son diferentes entre sí.',
      truthTable: [
        { inputs: [0, 0], output: 0 },
        { inputs: [0, 1], output: 1 },
        { inputs: [1, 0], output: 1 },
        { inputs: [1, 1], output: 0 }
      ],
      explanation: 'Es como una comparación: detecta diferencias entre las entradas.',
      applications: ['Sumadores binarios', 'Detección de cambios', 'Criptografía'],
      color: 'yellow'
    },
    {
      id: 'XNOR',
      name: 'Compuerta XNOR',
      symbol: '=̄1',
      description: 'La compuerta XNOR es la inversa de XOR: produce 1 cuando las entradas son iguales.',
      truthTable: [
        { inputs: [0, 0], output: 1 },
        { inputs: [0, 1], output: 0 },
        { inputs: [1, 0], output: 0 },
        { inputs: [1, 1], output: 1 }
      ],
      explanation: 'Es XOR seguido de NOT: detecta igualdad entre las entradas.',
      applications: ['Comparadores', 'Detección de patrones', 'Sistemas de validación'],
      color: 'pink'
    }
  ]

  const renderIntroduction = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Teoría de Circuitos Lógicos
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Los circuitos lógicos son la base de la electrónica digital moderna. 
          Aprende cómo funcionan las compuertas lógicas y cómo se combinan para crear sistemas complejos.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-900 mb-3">¿Qué son los Circuitos Lógicos?</h3>
          <p className="text-blue-800">
            Los circuitos lógicos son sistemas electrónicos que procesan información binaria (0 y 1) 
            usando compuertas lógicas. Son la base de las computadoras, teléfonos móviles y 
            todos los dispositivos digitales que usamos diariamente.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-green-900 mb-3">¿Por qué son Importantes?</h3>
          <p className="text-green-800">
            Los circuitos lógicos nos permiten realizar operaciones matemáticas, tomar decisiones 
            automáticas, almacenar información y controlar sistemas complejos. Son fundamentales 
            para entender cómo funcionan las computadoras.
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-yellow-900 mb-3">Conceptos Básicos</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-semibold text-yellow-800 mb-2">Señales Binarias</h4>
            <p className="text-yellow-700 text-sm">
              Solo dos valores: 0 (falso/bajo) y 1 (verdadero/alto)
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-yellow-800 mb-2">Compuertas Lógicas</h4>
            <p className="text-yellow-700 text-sm">
              Dispositivos que procesan señales binarias según reglas específicas
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-yellow-800 mb-2">Tablas de Verdad</h4>
            <p className="text-yellow-700 text-sm">
              Tablas que muestran todas las combinaciones posibles de entrada y salida
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderGates = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Compuertas Lógicas
        </h2>
        <p className="text-lg text-gray-600">
          Las compuertas lógicas son los bloques básicos de construcción de los circuitos digitales.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {gateTypes.map(gate => (
          <div key={gate.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-4 bg-${gate.color}-500`}>
                {gate.symbol}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{gate.name}</h3>
                <p className="text-gray-600">{gate.id}</p>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{gate.description}</p>
            <p className="text-sm text-gray-600 mb-4 italic">"{gate.explanation}"</p>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">Tabla de Verdad:</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      {gate.id === 'NOT' ? (
                        <>
                          <th className="px-2 py-1 border">A</th>
                          <th className="px-2 py-1 border">Salida</th>
                        </>
                      ) : (
                        <>
                          <th className="px-2 py-1 border">A</th>
                          <th className="px-2 py-1 border">B</th>
                          <th className="px-2 py-1 border">Salida</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {gate.truthTable.map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {row.inputs.map((input, i) => (
                          <td key={i} className="px-2 py-1 border text-center">
                            <span className={`inline-block w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              input === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {input}
                            </span>
                          </td>
                        ))}
                        <td className="px-2 py-1 border text-center">
                          <span className={`inline-block w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            row.output === 1 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                          }`}>
                            {row.output}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Aplicaciones:</h4>
              <div className="flex flex-wrap gap-2">
                {gate.applications.map((app, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {app}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderOperations = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Operaciones Lógicas
        </h2>
        <p className="text-lg text-gray-600">
          Las operaciones lógicas son las reglas que siguen las compuertas para procesar información.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Operaciones Básicas</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">AND (Conjunción)</h4>
              <p className="text-gray-600 text-sm">A AND B = 1 solo si A=1 y B=1</p>
              <div className="mt-2 text-xs text-gray-500">Ejemplo: 1 AND 1 = 1, 1 AND 0 = 0</div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">OR (Disyunción)</h4>
              <p className="text-gray-600 text-sm">A OR B = 1 si A=1 o B=1 (o ambos)</p>
              <div className="mt-2 text-xs text-gray-500">Ejemplo: 1 OR 0 = 1, 0 OR 0 = 0</div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">NOT (Negación)</h4>
              <p className="text-gray-600 text-sm">NOT A = 1 si A=0, NOT A = 0 si A=1</p>
              <div className="mt-2 text-xs text-gray-500">Ejemplo: NOT 1 = 0, NOT 0 = 1</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Operaciones Compuestas</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">NAND</h4>
              <p className="text-gray-600 text-sm">A NAND B = NOT (A AND B)</p>
              <div className="mt-2 text-xs text-gray-500">Inversa de AND</div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">NOR</h4>
              <p className="text-gray-600 text-sm">A NOR B = NOT (A OR B)</p>
              <div className="mt-2 text-xs text-gray-500">Inversa de OR</div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">XOR</h4>
              <p className="text-gray-600 text-sm">A XOR B = (A AND NOT B) OR (NOT A AND B)</p>
              <div className="mt-2 text-xs text-gray-500">Exclusivo OR</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-blue-900 mb-4">Leyes de la Lógica</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Leyes de De Morgan</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• NOT (A AND B) = NOT A OR NOT B</li>
              <li>• NOT (A OR B) = NOT A AND NOT B</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Propiedades</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Conmutativa: A AND B = B AND A</li>
              <li>• Asociativa: (A AND B) AND C = A AND (B AND C)</li>
              <li>• Distributiva: A AND (B OR C) = (A AND B) OR (A AND C)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCircuits = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Diseño de Circuitos
        </h2>
        <p className="text-lg text-gray-600">
          Aprende cómo combinar compuertas para crear circuitos lógicos complejos.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Pasos para Diseñar un Circuito</h3>
          <ol className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
              <span>Identifica las entradas y salidas del problema</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
              <span>Crea la tabla de verdad para todas las combinaciones</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
              <span>Simplifica la expresión lógica usando álgebra booleana</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
              <span>Implementa el circuito usando compuertas lógicas</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">5</span>
              <span>Verifica el funcionamiento con todas las combinaciones</span>
            </li>
          </ol>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Tipos de Circuitos</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Circuitos Combinacionales</h4>
              <p className="text-gray-600 text-sm">
                La salida depende únicamente de las entradas actuales. 
                No tienen memoria.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Circuitos Secuenciales</h4>
              <p className="text-gray-600 text-sm">
                La salida depende de las entradas actuales y del estado anterior. 
                Tienen memoria.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Circuitos Híbridos</h4>
              <p className="text-gray-600 text-sm">
                Combinan elementos combinacionales y secuenciales para 
                crear sistemas más complejos.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-green-900 mb-4">Ejemplo Práctico</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-green-800 mb-2">Problema: Alarma de Seguridad</h4>
            <p className="text-green-700">
              Diseña un circuito que active una alarma cuando:
            </p>
            <ul className="text-green-700 text-sm mt-2 ml-4 space-y-1">
              <li>• La puerta está abierta (A=1) Y la ventana está abierta (B=1)</li>
              <li>• O cuando hay movimiento (C=1) Y el sistema está activado (D=1)</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded border">
            <p className="text-sm text-gray-700">
              <strong>Solución:</strong> Alarma = (A AND B) OR (C AND D)
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Este circuito usa dos compuertas AND y una compuerta OR
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderApplications = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Aplicaciones en la Vida Real
        </h2>
        <p className="text-lg text-gray-600">
          Los circuitos lógicos están en todas partes en nuestro mundo digital.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-4xl mb-4">💻</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Computadoras</h3>
          <p className="text-gray-600 text-sm">
            Procesadores, memoria RAM, unidades de control y todas las operaciones 
            de la CPU están basadas en circuitos lógicos.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-4xl mb-4">📱</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Dispositivos Móviles</h3>
          <p className="text-gray-600 text-sm">
            Teléfonos inteligentes, tablets y wearables usan circuitos lógicos 
            para procesar información y controlar funciones.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-4xl mb-4">🚗</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Automóviles</h3>
          <p className="text-gray-600 text-sm">
            Sistemas de frenado ABS, control de motor, airbags y sistemas 
            de navegación dependen de circuitos lógicos.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-4xl mb-4">🏠</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Hogar Inteligente</h3>
          <p className="text-gray-600 text-sm">
            Termostatos, sistemas de seguridad, iluminación automática 
            y electrodomésticos inteligentes.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-4xl mb-4">🏥</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Medicina</h3>
          <p className="text-gray-600 text-sm">
            Equipos médicos, monitores de signos vitales, marcapasos 
            y sistemas de diagnóstico por imagen.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Aeroespacial</h3>
          <p className="text-gray-600 text-sm">
            Sistemas de navegación, control de vuelo, comunicaciones 
            y sistemas de seguridad en aviones y naves espaciales.
          </p>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-purple-900 mb-4">El Futuro de los Circuitos Lógicos</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-purple-800 mb-2">Inteligencia Artificial</h4>
            <p className="text-purple-700 text-sm">
              Los circuitos lógicos son la base de las redes neuronales y los algoritmos 
              de machine learning que están revolucionando la tecnología.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-purple-800 mb-2">Computación Cuántica</h4>
            <p className="text-purple-700 text-sm">
              Los principios de la lógica digital se están adaptando para crear 
              computadoras cuánticas que prometen capacidades sin precedentes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'introduction':
        return renderIntroduction()
      case 'gates':
        return renderGates()
      case 'operations':
        return renderOperations()
      case 'circuits':
        return renderCircuits()
      case 'applications':
        return renderApplications()
      default:
        return renderIntroduction()
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Módulo de Teoría
        </h1>
        <p className="text-gray-600">
          Aprende los fundamentos de los circuitos lógicos digitales
        </p>
      </div>

      {/* Navigation */}
      <div className="mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeSection === section.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200'
              }`}
            >
              <span className="mr-2">{section.icon}</span>
              {section.title}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-96">
        {renderContent()}
      </div>

      {/* Footer */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Objetivos de Aprendizaje
        </h3>
        <ul className="text-blue-800 space-y-1">
          <li>• Comprender el funcionamiento de las compuertas lógicas básicas</li>
          <li>• Aplicar las leyes del álgebra booleana en el diseño de circuitos</li>
          <li>• Identificar las aplicaciones de los circuitos lógicos en la vida real</li>
          <li>• Desarrollar habilidades para diseñar circuitos lógicos complejos</li>
          <li>• Prepararse para el uso del simulador de circuitos</li>
        </ul>
      </div>
    </div>
  )
}

export default TheoryModule
