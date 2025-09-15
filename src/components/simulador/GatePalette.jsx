import { useState } from 'react'

const GatePalette = ({ onGateSelect, selectedGate, onDragStart }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  const gateTypes = [
    {
      id: 'AND',
      name: 'AND',
      symbol: '&',
      description: 'Salida 1 solo si todas las entradas son 1',
      inputs: 2,
      color: 'bg-blue-100 border-blue-300 text-blue-800',
      truthTable: [
        { inputs: [0, 0], output: 0 },
        { inputs: [0, 1], output: 0 },
        { inputs: [1, 0], output: 0 },
        { inputs: [1, 1], output: 1 }
      ]
    },
    {
      id: 'OR',
      name: 'OR',
      symbol: '≥1',
      description: 'Salida 1 si al menos una entrada es 1',
      inputs: 2,
      color: 'bg-green-100 border-green-300 text-green-800',
      truthTable: [
        { inputs: [0, 0], output: 0 },
        { inputs: [0, 1], output: 1 },
        { inputs: [1, 0], output: 1 },
        { inputs: [1, 1], output: 1 }
      ]
    },
    {
      id: 'NOT',
      name: 'NOT',
      symbol: '1',
      description: 'Invierte la entrada (0→1, 1→0)',
      inputs: 1,
      color: 'bg-purple-100 border-purple-300 text-purple-800',
      truthTable: [
        { inputs: [0], output: 1 },
        { inputs: [1], output: 0 }
      ]
    },
    {
      id: 'NAND',
      name: 'NAND',
      symbol: '&',
      description: 'AND seguido de NOT',
      inputs: 2,
      color: 'bg-orange-100 border-orange-300 text-orange-800',
      truthTable: [
        { inputs: [0, 0], output: 1 },
        { inputs: [0, 1], output: 1 },
        { inputs: [1, 0], output: 1 },
        { inputs: [1, 1], output: 0 }
      ]
    },
    {
      id: 'NOR',
      name: 'NOR',
      symbol: '≥1',
      description: 'OR seguido de NOT',
      inputs: 2,
      color: 'bg-red-100 border-red-300 text-red-800',
      truthTable: [
        { inputs: [0, 0], output: 1 },
        { inputs: [0, 1], output: 0 },
        { inputs: [1, 0], output: 0 },
        { inputs: [1, 1], output: 0 }
      ]
    },
    {
      id: 'XOR',
      name: 'XOR',
      symbol: '=1',
      description: 'Salida 1 si el número de entradas 1 es impar',
      inputs: 2,
      color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      truthTable: [
        { inputs: [0, 0], output: 0 },
        { inputs: [0, 1], output: 1 },
        { inputs: [1, 0], output: 1 },
        { inputs: [1, 1], output: 0 }
      ]
    },
    {
      id: 'XNOR',
      name: 'XNOR',
      symbol: '=1',
      description: 'XOR seguido de NOT',
      inputs: 2,
      color: 'bg-pink-100 border-pink-300 text-pink-800',
      truthTable: [
        { inputs: [0, 0], output: 1 },
        { inputs: [0, 1], output: 0 },
        { inputs: [1, 0], output: 0 },
        { inputs: [1, 1], output: 1 }
      ]
    }
  ]

  const handleGateClick = (gate) => {
    onGateSelect(gate)
  }

  const handleDragStart = (event, gate) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(gate))
    onDragStart && onDragStart(gate)
  }

  return (
    <div className="card">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-semibold text-gray-900">
          Paleta de Compuertas
        </h3>
        <span className="text-gray-500">
          {isExpanded ? '▼' : '▶'}
        </span>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-gray-600">
            Haz clic para seleccionar o arrastra para agregar al circuito
          </p>
          
          <div className="grid grid-cols-2 gap-2">
            {gateTypes.map(gate => (
              <div
                key={gate.id}
                draggable
                onDragStart={(e) => handleDragStart(e, gate)}
                onClick={() => handleGateClick(gate)}
                className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedGate?.id === gate.id
                    ? 'border-primary-500 bg-primary-50'
                    : `${gate.color} hover:scale-105`
                }`}
              >
                <div className="text-center">
                  <div className="text-lg font-bold mb-1">
                    {gate.symbol}
                  </div>
                  <div className="text-xs font-medium">
                    {gate.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {gate.inputs} entrada{gate.inputs > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedGate && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">
                {selectedGate.name} - Tabla de Verdad
              </h4>
              <div className="text-sm text-gray-600 mb-2">
                {selectedGate.description}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      {Array.from({ length: selectedGate.inputs }, (_, i) => (
                        <th key={i} className="text-left py-1 px-2">
                          I{i + 1}
                        </th>
                      ))}
                      <th className="text-left py-1 px-2">Salida</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedGate.truthTable.map((row, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        {row.inputs.map((input, i) => (
                          <td key={i} className="py-1 px-2 font-mono">
                            {input}
                          </td>
                        ))}
                        <td className="py-1 px-2 font-mono font-semibold">
                          {row.output}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default GatePalette