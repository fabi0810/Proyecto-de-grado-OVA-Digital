import { useState } from 'react'

const TheoryExplainer = () => {
  const [activeSystem, setActiveSystem] = useState('binary')
  const [showVisualization, setShowVisualization] = useState(false)

  const systems = {
    binary: {
      name: 'Sistema Binario',
      base: 2,
      digits: '0, 1',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: '🔢',
      description: 'El sistema binario es la base de toda la computación digital moderna.',
      applications: [
        'Circuitos digitales y lógica booleana',
        'Almacenamiento de datos en computadoras',
        'Comunicaciones digitales',
        'Criptografía y seguridad'
      ],
      examples: [
        { decimal: 0, binary: '0', explanation: 'Cero en cualquier base' },
        { decimal: 1, binary: '1', explanation: 'Uno en cualquier base' },
        { decimal: 2, binary: '10', explanation: '2¹ = 2' },
        { decimal: 3, binary: '11', explanation: '2¹ + 2⁰ = 2 + 1 = 3' },
        { decimal: 4, binary: '100', explanation: '2² = 4' },
        { decimal: 8, binary: '1000', explanation: '2³ = 8' }
      ],
      visualization: {
        title: 'Representación Visual del Sistema Binario',
        description: 'Cada posición representa una potencia de 2',
        positions: [
          { position: 3, power: '2³', value: 8, example: '1' },
          { position: 2, power: '2²', value: 4, example: '0' },
          { position: 1, power: '2¹', value: 2, example: '1' },
          { position: 0, power: '2⁰', value: 1, example: '1' }
        ],
        result: '1011₂ = 8 + 0 + 2 + 1 = 11₁₀'
      }
    },
    octal: {
      name: 'Sistema Octal',
      base: 8,
      digits: '0, 1, 2, 3, 4, 5, 6, 7',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: '🟢',
      description: 'El sistema octal es útil para representar números binarios de forma compacta.',
      applications: [
        'Representación compacta de números binarios',
        'Permisos en sistemas Unix/Linux',
        'Programación de microcontroladores',
        'Análisis de memoria en sistemas embebidos'
      ],
      examples: [
        { decimal: 0, octal: '0', explanation: 'Cero en cualquier base' },
        { decimal: 7, octal: '7', explanation: 'Máximo dígito en octal' },
        { decimal: 8, octal: '10', explanation: '8¹ = 8' },
        { decimal: 15, octal: '17', explanation: '8¹ + 7 = 8 + 7 = 15' },
        { decimal: 64, octal: '100', explanation: '8² = 64' }
      ],
      visualization: {
        title: 'Representación Visual del Sistema Octal',
        description: 'Cada posición representa una potencia de 8',
        positions: [
          { position: 2, power: '8²', value: 64, example: '1' },
          { position: 1, power: '8¹', value: 8, example: '2' },
          { position: 0, power: '8⁰', value: 1, example: '3' }
        ],
        result: '123₈ = 64 + 16 + 3 = 83₁₀'
      }
    },
    decimal: {
      name: 'Sistema Decimal',
      base: 10,
      digits: '0, 1, 2, 3, 4, 5, 6, 7, 8, 9',
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: '🔟',
      description: 'Nuestro sistema numérico cotidiano, basado en 10 dígitos.',
      applications: [
        'Matemáticas cotidianas',
        'Mediciones científicas',
        'Finanzas y contabilidad',
        'Educación básica'
      ],
      examples: [
        { decimal: 0, value: '0', explanation: 'Cero' },
        { decimal: 9, value: '9', explanation: 'Máximo dígito decimal' },
        { decimal: 10, value: '10', explanation: '10¹ = 10' },
        { decimal: 99, value: '99', explanation: '9×10¹ + 9×10⁰ = 90 + 9 = 99' },
        { decimal: 100, value: '100', explanation: '10² = 100' }
      ],
      visualization: {
        title: 'Representación Visual del Sistema Decimal',
        description: 'Cada posición representa una potencia de 10',
        positions: [
          { position: 2, power: '10²', value: 100, example: '3' },
          { position: 1, power: '10¹', value: 10, example: '4' },
          { position: 0, power: '10⁰', value: 1, example: '5' }
        ],
        result: '345₁₀ = 300 + 40 + 5 = 345₁₀'
      }
    },
    hexadecimal: {
      name: 'Sistema Hexadecimal',
      base: 16,
      digits: '0, 1, 2, 3, 4, 5, 6, 7, 8, 9, A, B, C, D, E, F',
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      icon: '🔶',
      description: 'Muy utilizado en programación y representación de colores.',
      applications: [
        'Direcciones de memoria en programación',
        'Códigos de color (HTML, CSS)',
        'Representación de datos binarios',
        'Protocolos de red y comunicación'
      ],
      examples: [
        { decimal: 0, hex: '0', explanation: 'Cero' },
        { decimal: 9, hex: '9', explanation: 'Nueve' },
        { decimal: 10, hex: 'A', explanation: 'Diez en hexadecimal' },
        { decimal: 15, hex: 'F', explanation: 'Quince en hexadecimal' },
        { decimal: 16, hex: '10', explanation: '16¹ = 16' },
        { decimal: 255, hex: 'FF', explanation: '15×16¹ + 15×16⁰ = 240 + 15 = 255' }
      ],
      visualization: {
        title: 'Representación Visual del Sistema Hexadecimal',
        description: 'Cada posición representa una potencia de 16',
        positions: [
          { position: 1, power: '16¹', value: 16, example: 'A' },
          { position: 0, power: '16⁰', value: 1, example: 'F' }
        ],
        result: 'AF₁₆ = 10×16 + 15×1 = 160 + 15 = 175₁₀'
      }
    }
  }

  const currentSystem = systems[activeSystem]

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Teoría de Sistemas Numéricos
        </h2>
        <p className="text-gray-600">
          Explora cada sistema numérico con ejemplos interactivos y visualizaciones
        </p>
      </div>

      {/* Selector de sistemas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Object.entries(systems).map(([key, system]) => (
          <button
            key={key}
            onClick={() => setActiveSystem(key)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              activeSystem === key
                ? `${system.color} border-current shadow-lg scale-105`
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-2">{system.icon}</div>
            <div className="font-semibold text-sm">{system.name}</div>
            <div className="text-xs text-gray-500">Base {system.base}</div>
          </button>
        ))}
      </div>

      {/* Contenido del sistema seleccionado */}
      <div className="card">
        <div className="flex items-center mb-6">
          <div className="text-3xl mr-4">{currentSystem.icon}</div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{currentSystem.name}</h3>
            <p className="text-gray-600">Base {currentSystem.base} - Dígitos: {currentSystem.digits}</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 mb-4">{currentSystem.description}</p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Aplicaciones Principales:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              {currentSystem.applications.map((app, index) => (
                <li key={index}>{app}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Ejemplos */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Ejemplos de Conversión:</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Decimal</th>
                  <th className="text-left py-2">{currentSystem.name}</th>
                  <th className="text-left py-2">Explicación</th>
                </tr>
              </thead>
              <tbody>
                {currentSystem.examples.map((example, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2 font-mono">{example.decimal}</td>
                    <td className="py-2 font-mono">
                      {activeSystem === 'binary' && `0b${example.binary}`}
                      {activeSystem === 'octal' && `0o${example.octal}`}
                      {activeSystem === 'decimal' && example.value}
                      {activeSystem === 'hexadecimal' && `0x${example.hex}`}
                    </td>
                    <td className="py-2 text-gray-600">{example.explanation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visualización interactiva */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Visualización Interactiva</h4>
            <button
              onClick={() => setShowVisualization(!showVisualization)}
              className="btn-primary text-sm"
            >
              {showVisualization ? 'Ocultar' : 'Mostrar'} Visualización
            </button>
          </div>

          {showVisualization && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-semibold mb-2">{currentSystem.visualization.title}</h5>
              <p className="text-sm text-gray-600 mb-4">{currentSystem.visualization.description}</p>
              
              <div className="space-y-3">
                {currentSystem.visualization.positions.map((pos, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-white rounded border">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm font-bold">
                      {pos.example}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-mono">{pos.power} = {pos.value}</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Posición {pos.position}
                    </div>
                  </div>
                ))}
                
                <div className="mt-4 p-3 bg-primary-100 rounded border-l-4 border-primary-500">
                  <div className="font-mono text-sm font-semibold">
                    {currentSystem.visualization.result}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comparación entre sistemas */}
      <div className="card">
        <h4 className="font-semibold mb-4">Comparación de Sistemas</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Decimal</th>
                <th className="text-left py-2">Binario</th>
                <th className="text-left py-2">Octal</th>
                <th className="text-left py-2">Hexadecimal</th>
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 31, 32, 63, 64, 127, 128, 255].map(num => (
                <tr key={num} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 font-mono">{num}</td>
                  <td className="py-2 font-mono">0b{num.toString(2)}</td>
                  <td className="py-2 font-mono">0o{num.toString(8)}</td>
                  <td className="py-2 font-mono">0x{num.toString(16).toUpperCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TheoryExplainer