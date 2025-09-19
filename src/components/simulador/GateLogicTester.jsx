import { useState } from 'react'

const GateLogicTester = () => {
  const [testResults, setTestResults] = useState([])

  const testGateLogic = () => {
    const results = []
    
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

    // Probar compuerta AND
    const andTests = [
      { inputs: [0, 0], expected: 0 },
      { inputs: [0, 1], expected: 0 },
      { inputs: [1, 0], expected: 0 },
      { inputs: [1, 1], expected: 1 }
    ]
    
    andTests.forEach(test => {
      const result = calculateGateValue('AND', test.inputs)
      results.push({
        gate: 'AND',
        inputs: test.inputs,
        expected: test.expected,
        actual: result,
        correct: result === test.expected
      })
    })

    // Probar compuerta OR
    const orTests = [
      { inputs: [0, 0], expected: 0 },
      { inputs: [0, 1], expected: 1 },
      { inputs: [1, 0], expected: 1 },
      { inputs: [1, 1], expected: 1 }
    ]
    
    orTests.forEach(test => {
      const result = calculateGateValue('OR', test.inputs)
      results.push({
        gate: 'OR',
        inputs: test.inputs,
        expected: test.expected,
        actual: result,
        correct: result === test.expected
      })
    })

    // Probar compuerta NOT
    const notTests = [
      { inputs: [0], expected: 1 },
      { inputs: [1], expected: 0 }
    ]
    
    notTests.forEach(test => {
      const result = calculateGateValue('NOT', test.inputs)
      results.push({
        gate: 'NOT',
        inputs: test.inputs,
        expected: test.expected,
        actual: result,
        correct: result === test.expected
      })
    })

    setTestResults(results)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Prueba de Lógica de Compuertas
      </h3>
      
      <button
        onClick={testGateLogic}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4"
      >
        Probar Lógica de Compuertas
      </button>
      
      {testResults.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">Resultados:</h4>
          {testResults.map((result, index) => (
            <div 
              key={index} 
              className={`p-2 rounded text-sm ${
                result.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>
                  {result.gate}({result.inputs.join(', ')}) = {result.actual}
                </span>
                <span>
                  {result.correct ? '✅' : '❌'} Esperado: {result.expected}
                </span>
              </div>
            </div>
          ))}
          
          <div className="mt-4 p-3 bg-gray-50 rounded">
            <div className="text-sm">
              <strong>Correctos:</strong> {testResults.filter(r => r.correct).length} / {testResults.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GateLogicTester


