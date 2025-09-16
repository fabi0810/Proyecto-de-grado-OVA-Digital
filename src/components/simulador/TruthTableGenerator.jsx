import { useState, useEffect, useCallback } from 'react'

const TruthTableGenerator = ({ nodes, edges, inputs }) => {
  const [truthTable, setTruthTable] = useState([])

  // Función para simular el circuito con valores específicos
  const simulateCircuitWithInputs = useCallback((inputValues) => {
    const nodeValues = new Map()
    
    // Inicializar valores de entrada
    Object.entries(inputValues).forEach(([name, value]) => {
      nodeValues.set(name, value)
    })
    
    // Función para calcular el valor de una compuerta
    const calculateGateValue = (gateType, inputValues) => {
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
          return inputValues.reduce((a, b) => a ^ b, 0)
        case 'XNOR':
          return inputValues.reduce((a, b) => a ^ b, 0) === 0 ? 1 : 0
        default:
          return 0
      }
    }
    
    // Procesar nodos en orden topológico
    const processedNodes = new Set()
    let changed = true
    
    while (changed) {
      changed = false
      
      nodes.forEach(node => {
        if (processedNodes.has(node.id)) return
        
        const inputEdges = edges.filter(edge => edge.target === node.id)
        const inputValues = inputEdges.map(edge => {
          const sourceNode = nodes.find(n => n.id === edge.source)
          return nodeValues.get(sourceNode?.id) || 0
        })
        
        if (inputValues.length === 0 || inputValues.some(val => val === undefined)) {
          return
        }
        
        const outputValue = calculateGateValue(node.data.gateType, inputValues)
        nodeValues.set(node.id, outputValue)
        
        processedNodes.add(node.id)
        changed = true
      })
    }
    
    return nodeValues
  }, [nodes, edges])

  const generateTable = useCallback(() => {
    const inputKeys = Object.keys(inputs)
    if (inputKeys.length === 0) {
      setTruthTable([])
      return
    }

    const combinations = Math.pow(2, inputKeys.length)
    const table = []

    for (let i = 0; i < combinations; i++) {
      const row = { inputs: {}, outputs: {} }
      
      // Generar combinación de entradas
      inputKeys.forEach((key, index) => {
        row.inputs[key] = (i >> (inputKeys.length - 1 - index)) & 1
      })

      // Simular circuito con esta combinación
      const simulationResults = simulateCircuitWithInputs(row.inputs)
      
      // Obtener salidas del circuito
      const outputNodes = nodes.filter(node => 
        edges.some(edge => edge.source === node.id) && 
        !edges.some(edge => edge.target === node.id)
      )
      
      outputNodes.forEach(node => {
        row.outputs[node.id] = simulationResults.get(node.id) || 0
      })
      
      // Si no hay salidas específicas, usar la primera compuerta como salida
      if (outputNodes.length === 0 && nodes.length > 0) {
        const firstGate = nodes.find(node => node.type === 'logicGate')
        if (firstGate) {
          row.outputs.result = simulationResults.get(firstGate.id) || 0
        }
      }

      table.push(row)
    }

    setTruthTable(table)
  }, [inputs, nodes, edges, simulateCircuitWithInputs])

  useEffect(() => {
    generateTable()
  }, [generateTable])

  if (Object.keys(inputs).length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tabla de Verdad</h3>
        <p className="text-gray-500 text-center py-8">Agrega entradas para generar la tabla</p>
      </div>
    )
  }

  const inputKeys = Object.keys(inputs)
  const outputKeys = truthTable.length > 0 ? Object.keys(truthTable[0].outputs) : []

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Tabla de Verdad</h3>
        <div className="text-sm text-gray-500">
          {Math.pow(2, inputKeys.length)} combinaciones
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              {/* Encabezados de entrada */}
              {inputKeys.map(key => (
                <th key={key} className="text-left py-2 px-3 font-semibold text-gray-700">
                  {key}
                </th>
              ))}
              {/* Separador visual */}
              {inputKeys.length > 0 && outputKeys.length > 0 && (
                <th className="text-center py-2 px-2 text-gray-400">|</th>
              )}
              {/* Encabezados de salida */}
              {outputKeys.map(key => (
                <th key={key} className="text-left py-2 px-3 font-semibold text-gray-700">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {truthTable.map((row, index) => (
              <tr key={index} className={`border-b border-gray-100 hover:bg-gray-50 ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
              }`}>
                {/* Valores de entrada */}
                {inputKeys.map(key => (
                  <td key={key} className="py-2 px-3 font-mono text-center">
                    <span className={`inline-block w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      row.inputs[key] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {row.inputs[key]}
                    </span>
                  </td>
                ))}
                {/* Separador visual */}
                {inputKeys.length > 0 && outputKeys.length > 0 && (
                  <td className="text-center py-2 px-2 text-gray-300">|</td>
                )}
                {/* Valores de salida */}
                {outputKeys.map(key => (
                  <td key={key} className="py-2 px-3 font-mono text-center">
                    <span className={`inline-block w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      row.outputs[key] ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {row.outputs[key]}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Resumen de la tabla */}
      {truthTable.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Total de combinaciones:</span>
              <span className="font-semibold">{truthTable.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Entradas:</span>
              <span className="font-semibold">{inputKeys.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Salidas:</span>
              <span className="font-semibold">{outputKeys.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TruthTableGenerator