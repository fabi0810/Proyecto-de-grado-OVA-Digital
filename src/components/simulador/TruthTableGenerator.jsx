import { useState, useEffect } from 'react'

const TruthTableGenerator = ({ circuit, inputs, onTableGenerated }) => {
  const [truthTable, setTruthTable] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showTable, setShowTable] = useState(false)

  // Función para calcular la salida de una compuerta
  const calculateGateOutput = (gateType, inputValues) => {
    switch (gateType) {
      case 'AND':
        return inputValues.every(val => val === 1)
      case 'OR':
        return inputValues.some(val => val === 1)
      case 'NOT':
        return inputValues[0] === 0 ? 1 : 0
      case 'NAND':
        return !inputValues.every(val => val === 1)
      case 'NOR':
        return !inputValues.some(val => val === 1)
      case 'XOR':
        return inputValues.filter(val => val === 1).length % 2 === 1
      case 'XNOR':
        return inputValues.filter(val => val === 1).length % 2 === 0
      default:
        return 0
    }
  }

  // Función para simular el circuito completo
  const simulateCircuit = (inputCombination) => {
    const nodeValues = { ...inputCombination }
    const processedNodes = new Set()

    // Función recursiva para procesar nodos
    const processNode = (nodeId) => {
      if (processedNodes.has(nodeId)) return nodeValues[nodeId]

      const node = circuit.find(n => n.id === nodeId)
      if (!node) return 0

      // Si es un nodo de entrada, retornar su valor
      if (node.type === 'input') {
        return nodeValues[nodeId] || 0
      }

      // Obtener valores de las entradas
      const inputValues = node.data.inputs.map(input => {
        if (input.source) {
          return processNode(input.source)
        }
        return input.value || 0
      })

      // Calcular salida de la compuerta
      const output = calculateGateOutput(node.data.type, inputValues)
      nodeValues[nodeId] = output
      processedNodes.add(nodeId)

      return output
    }

    // Procesar todos los nodos
    circuit.forEach(node => {
      if (node.type !== 'input') {
        processNode(node.id)
      }
    })

    return nodeValues
  }

  // Generar tabla de verdad
  const generateTruthTable = () => {
    setIsGenerating(true)
    
    setTimeout(() => {
      const inputNames = Object.keys(inputs)
      const inputCount = inputNames.length
      const combinations = Math.pow(2, inputCount)
      const table = []

      // Generar todas las combinaciones posibles
      for (let i = 0; i < combinations; i++) {
        const inputCombination = {}
        
        // Convertir número a binario y asignar valores
        inputNames.forEach((name, index) => {
          inputCombination[name] = (i >> (inputCount - 1 - index)) & 1
        })

        // Simular circuito
        const outputs = simulateCircuit(inputCombination)
        
        // Crear fila de la tabla
        const row = {
          inputs: inputNames.map(name => inputCombination[name]),
          outputs: outputs,
          inputCombination
        }
        
        table.push(row)
      }

      setTruthTable(table)
      setIsGenerating(false)
      setShowTable(true)
      onTableGenerated && onTableGenerated(table)
    }, 100)
  }

  // Auto-generar tabla cuando cambie el circuito
  useEffect(() => {
    if (circuit.length > 0 && Object.keys(inputs).length > 0) {
      generateTruthTable()
    }
  }, [circuit, inputs])

  const exportTable = () => {
    if (truthTable.length === 0) return

    const inputNames = Object.keys(inputs)
    const csvContent = [
      [...inputNames, 'Salida'].join(','),
      ...truthTable.map(row => [
        ...row.inputs,
        Object.values(row.outputs).pop() || 0
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tabla_verdad.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (circuit.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Tabla de Verdad
        </h3>
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">📊</div>
          <p>Construye un circuito para generar la tabla de verdad</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Tabla de Verdad
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowTable(!showTable)}
            className="px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700"
          >
            {showTable ? 'Ocultar' : 'Mostrar'}
          </button>
          {truthTable.length > 0 && (
            <button
              onClick={exportTable}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              📥 Exportar
            </button>
          )}
        </div>
      </div>

      {isGenerating ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generando tabla de verdad...</p>
        </div>
      ) : showTable && truthTable.length > 0 ? (
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            {truthTable.length} combinaciones posibles
          </div>
          
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-50">
                <tr className="border-b">
                  {Object.keys(inputs).map(name => (
                    <th key={name} className="text-left py-2 px-3 font-semibold">
                      {name}
                    </th>
                  ))}
                  <th className="text-left py-2 px-3 font-semibold text-primary-600">
                    Salida
                  </th>
                </tr>
              </thead>
              <tbody>
                {truthTable.map((row, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    {row.inputs.map((value, i) => (
                      <td key={i} className="py-2 px-3 font-mono">
                        <span className={`inline-block w-6 h-6 rounded-full text-center leading-6 text-xs font-bold ${
                          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {value}
                        </span>
                      </td>
                    ))}
                    <td className="py-2 px-3 font-mono">
                      <span className={`inline-block w-6 h-6 rounded-full text-center leading-6 text-xs font-bold ${
                        Object.values(row.outputs).pop() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {Object.values(row.outputs).pop() || 0}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Resumen estadístico */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-lg font-bold text-primary-600">
                {truthTable.filter(row => Object.values(row.outputs).pop()).length}
              </div>
              <div className="text-xs text-gray-600">Casos Verdaderos</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-600">
                {truthTable.filter(row => !Object.values(row.outputs).pop()).length}
              </div>
              <div className="text-xs text-gray-600">Casos Falsos</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {Math.round((truthTable.filter(row => Object.values(row.outputs).pop()).length / truthTable.length) * 100)}%
              </div>
              <div className="text-xs text-gray-600">% Verdaderos</div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default TruthTableGenerator