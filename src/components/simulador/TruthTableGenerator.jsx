import { useMemo } from 'react'

const TruthTableGenerator = ({ inputs, results, circuitStats }) => {
  // Generar todas las combinaciones posibles de entradas
  const generateTruthTable = useMemo(() => {
    const inputNames = Object.keys(inputs)
    if (inputNames.length === 0) return []

    // Generar todas las combinaciones binarias
    const combinations = []
    const totalCombinations = Math.pow(2, inputNames.length)
    
    for (let i = 0; i < totalCombinations; i++) {
      const combination = {}
      inputNames.forEach((name, index) => {
        combination[name] = (i >> (inputNames.length - 1 - index)) & 1
      })
      combinations.push(combination)
    }

    return combinations
  }, [inputs])

  if (Object.keys(inputs).length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tabla de Verdad</h3>
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-4">📊</div>
          <p className="text-gray-500">Agrega entradas para generar la tabla de verdad</p>
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tabla de Verdad</h3>
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-4">⚡</div>
          <p className="text-gray-500">Agrega compuertas para generar la tabla de verdad</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tabla de Verdad</h3>
      
      {/* Información de la tabla */}
      <div className="mb-4 text-sm text-gray-600">
        <div>Entradas: {Object.keys(inputs).join(', ')}</div>
        <div>Combinaciones: {generateTruthTable.length}</div>
        <div>Compuertas: {results.length}</div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              {/* Columnas de entrada */}
              {Object.keys(inputs).map(name => (
                <th key={name} className="px-3 py-2 text-left font-semibold text-gray-700 border-b">
                  {name}
                </th>
              ))}
              {/* Columnas de salida */}
              {results.map(result => (
                <th key={result.id} className="px-3 py-2 text-center font-semibold text-gray-700 border-b">
                  {result.label || result.type}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {generateTruthTable.map((combination, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {/* Valores de entrada */}
                {Object.keys(inputs).map(name => (
                  <td key={name} className="px-3 py-2 text-center border-b">
                    <span className={`inline-block w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      combination[name] === 1 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {combination[name]}
                    </span>
                  </td>
                ))}
                {/* Valores de salida (simulados) */}
                {results.map(result => {
                  // Simular el resultado basado en las entradas
                  const simulatedOutput = simulateGateOutput(result.type, combination, inputs)
                  return (
                    <td key={result.id} className="px-3 py-2 text-center border-b">
                      <span className={`inline-block w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        simulatedOutput === 1 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {simulatedOutput}
                      </span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Leyenda */}
      <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-100 rounded-full mr-1"></div>
          <span>Entrada 1</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-100 rounded-full mr-1"></div>
          <span>Entrada 0</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded-full mr-1"></div>
          <span>Salida 1</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded-full mr-1"></div>
          <span>Salida 0</span>
        </div>
      </div>
    </div>
  )
}

// Función para simular la salida de una compuerta basada en las entradas
const simulateGateOutput = (gateType, combination, inputs) => {
  const inputValues = Object.keys(inputs).map(name => combination[name])
  
  switch (gateType) {
    case 'AND':
      return inputValues.every(val => val === 1) ? 1 : 0
    case 'OR':
      return inputValues.some(val => val === 1) ? 1 : 0
    case 'NOT':
      return inputValues[0] === 1 ? 0 : 1
    case 'NAND':
      return inputValues.every(val => val === 1) ? 0 : 1
    case 'NOR':
      return inputValues.some(val => val === 1) ? 0 : 1
    case 'XOR':
      return inputValues.filter(val => val === 1).length % 2 === 1 ? 1 : 0
    case 'XNOR':
      return inputValues.filter(val => val === 1).length % 2 === 0 ? 1 : 0
    default:
      return 0
  }
}

export default TruthTableGenerator