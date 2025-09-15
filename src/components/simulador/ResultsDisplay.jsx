import { useState, useEffect } from 'react'

const ResultsDisplay = ({ 
  circuit, 
  inputs, 
  outputs, 
  simulationResults, 
  onExportResults 
}) => {
  const [activeTab, setActiveTab] = useState('outputs')
  const [animationSpeed, setAnimationSpeed] = useState(1000)

  const tabs = [
    { id: 'outputs', name: 'Salidas', icon: '💡' },
    { id: 'propagation', name: 'Propagación', icon: '⚡' },
    { id: 'metrics', name: 'Métricas', icon: '📊' },
    { id: 'export', name: 'Exportar', icon: '📤' }
  ]

  // Calcular métricas del circuito
  const calculateMetrics = () => {
    if (!circuit || circuit.length === 0) return null

    const gateCount = circuit.filter(node => node.type !== 'input' && node.type !== 'output').length
    const connectionCount = circuit.reduce((count, node) => {
      return count + (node.data?.inputs?.length || 0)
    }, 0)
    
    const inputCount = Object.keys(inputs).length
    const outputCount = circuit.filter(node => node.type === 'output').length

    // Calcular eficiencia
    const efficiency = connectionCount > 0 ? (gateCount / connectionCount) * 100 : 0

    // Calcular complejidad
    const complexity = gateCount <= 3 ? 'Básico' : 
                     gateCount <= 8 ? 'Intermedio' : 'Avanzado'

    return {
      gateCount,
      connectionCount,
      inputCount,
      outputCount,
      efficiency: Math.round(efficiency),
      complexity
    }
  }

  const metrics = calculateMetrics()

  // Simular propagación de señales
  const simulatePropagation = () => {
    if (!circuit || circuit.length === 0) return []

    const steps = []
    const nodeValues = { ...inputs }
    const processedNodes = new Set()

    // Función para calcular salida de compuerta
    const calculateGateOutput = (gateType, inputValues) => {
      switch (gateType) {
        case 'AND': return inputValues.every(val => val === 1)
        case 'OR': return inputValues.some(val => val === 1)
        case 'NOT': return inputValues[0] === 0 ? 1 : 0
        case 'NAND': return !inputValues.every(val => val === 1)
        case 'NOR': return !inputValues.some(val => val === 1)
        case 'XOR': return inputValues.filter(val => val === 1).length % 2 === 1
        case 'XNOR': return inputValues.filter(val => val === 1).length % 2 === 0
        default: return 0
      }
    }

    // Procesar nodos en orden
    const processNode = (nodeId, stepNumber) => {
      if (processedNodes.has(nodeId)) return nodeValues[nodeId]

      const node = circuit.find(n => n.id === nodeId)
      if (!node) return 0

      if (node.type === 'input') {
        return nodeValues[nodeId] || 0
      }

      const inputValues = (node.data?.inputs || []).map(input => {
        if (input.source) {
          return processNode(input.source, stepNumber)
        }
        return input.value || 0
      })

      const output = calculateGateOutput(node.data?.type, inputValues)
      nodeValues[nodeId] = output
      processedNodes.add(nodeId)

      // Registrar paso
      steps.push({
        step: stepNumber,
        nodeId,
        nodeType: node.data?.type || node.type,
        inputs: inputValues,
        output,
        timestamp: Date.now()
      })

      return output
    }

    // Procesar todos los nodos
    let stepNumber = 1
    circuit.forEach(node => {
      if (node.type !== 'input') {
        processNode(node.id, stepNumber++)
      }
    })

    return steps
  }

  const [propagationSteps, setPropagationSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const steps = simulatePropagation()
    setPropagationSteps(steps)
    setCurrentStep(0)
  }, [circuit, inputs])

  // Auto-avanzar propagación
  useEffect(() => {
    if (propagationSteps.length > 0 && currentStep < propagationSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1)
      }, animationSpeed)
      return () => clearTimeout(timer)
    }
  }, [currentStep, propagationSteps.length, animationSpeed])

  const exportResults = (format) => {
    const data = {
      circuit: circuit,
      inputs: inputs,
      outputs: outputs,
      metrics: metrics,
      timestamp: new Date().toISOString()
    }

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'circuito_resultados.json'
      a.click()
      URL.revokeObjectURL(url)
    } else if (format === 'csv') {
      const csvContent = [
        'Nodo,Tipo,Entradas,Salida',
        ...circuit.map(node => [
          node.id,
          node.data?.type || node.type,
          (node.data?.inputs || []).map(i => i.value || 0).join(';'),
          node.data?.output || 0
        ].join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'circuito_datos.csv'
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const renderOutputs = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Salidas del Circuito</h4>
      
      {circuit.filter(node => node.type === 'output').length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">🔌</div>
          <p>No hay nodos de salida en el circuito</p>
          <p className="text-sm">Agrega nodos de salida para ver los resultados</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {circuit.filter(node => node.type === 'output').map(node => (
            <div key={node.id} className="p-4 border rounded-lg">
              <div className="text-center">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  {node.data?.label || node.id}
                </div>
                <div className={`w-16 h-16 rounded-full border-4 mx-auto flex items-center justify-center text-2xl font-bold ${
                  node.data?.output 
                    ? 'bg-green-500 text-white border-green-600' 
                    : 'bg-red-500 text-white border-red-600'
                }`}>
                  {node.data?.output ? '1' : '0'}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {node.data?.output ? 'ALTO' : 'BAJO'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderPropagation = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-900">Propagación de Señales</h4>
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Velocidad:</label>
          <select
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(Number(e.target.value))}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value={500}>Rápida</option>
            <option value={1000}>Normal</option>
            <option value={2000}>Lenta</option>
          </select>
        </div>
      </div>

      {propagationSteps.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">⚡</div>
          <p>No hay pasos de propagación para mostrar</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 mb-4">
            <button
              onClick={() => setCurrentStep(0)}
              className="px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700"
            >
              Reiniciar
            </button>
            <div className="text-sm text-gray-600">
              Paso {currentStep + 1} de {propagationSteps.length}
            </div>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {propagationSteps.slice(0, currentStep + 1).map((step, index) => (
              <div
                key={index}
                className={`p-3 rounded border transition-all duration-300 ${
                  index === currentStep 
                    ? 'bg-primary-50 border-primary-300' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">
                    Paso {step.step}: {step.nodeType}
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-bold ${
                    step.output 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {step.output ? '1' : '0'}
                  </div>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Entradas: [{step.inputs.join(', ')}] → Salida: {step.output}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderMetrics = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Métricas del Circuito</h4>
      
      {!metrics ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">📊</div>
          <p>No hay métricas disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{metrics.gateCount}</div>
            <div className="text-sm text-blue-800">Compuertas</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{metrics.connectionCount}</div>
            <div className="text-sm text-green-800">Conexiones</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{metrics.efficiency}%</div>
            <div className="text-sm text-purple-800">Eficiencia</div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded">
            <div className="text-2xl font-bold text-orange-600">{metrics.complexity}</div>
            <div className="text-sm text-orange-800">Complejidad</div>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded">
            <div className="text-2xl font-bold text-red-600">{metrics.inputCount}</div>
            <div className="text-sm text-red-800">Entradas</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded">
            <div className="text-2xl font-bold text-yellow-600">{metrics.outputCount}</div>
            <div className="text-sm text-yellow-800">Salidas</div>
          </div>
        </div>
      )}
    </div>
  )

  const renderExport = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Exportar Resultados</h4>
      
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => exportResults('json')}
          className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
        >
          <div className="text-center">
            <div className="text-2xl mb-2">📄</div>
            <div className="font-medium text-gray-900">JSON</div>
            <div className="text-sm text-gray-600">Datos completos</div>
          </div>
        </button>
        
        <button
          onClick={() => exportResults('csv')}
          className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
        >
          <div className="text-center">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-medium text-gray-900">CSV</div>
            <div className="text-sm text-gray-600">Tabla de datos</div>
          </div>
        </button>
      </div>
    </div>
  )

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Resultados de Simulación
        </h3>
      </div>

      {/* Navegación por pestañas */}
      <div className="flex space-x-1 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* Contenido de las pestañas */}
      <div className="min-h-[200px]">
        {activeTab === 'outputs' && renderOutputs()}
        {activeTab === 'propagation' && renderPropagation()}
        {activeTab === 'metrics' && renderMetrics()}
        {activeTab === 'export' && renderExport()}
      </div>
    </div>
  )
}

export default ResultsDisplay


