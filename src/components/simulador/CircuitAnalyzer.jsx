import { useState, useEffect } from 'react'

const CircuitAnalyzer = ({ circuit, inputs, onAnalysisComplete }) => {
  const [analysis, setAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  // Función para analizar el circuito
  const analyzeCircuit = () => {
    setIsAnalyzing(true)
    
    setTimeout(() => {
      const analysisResult = {
        // Análisis estructural
        structure: {
          totalGates: circuit.filter(node => node.type !== 'input' && node.type !== 'output').length,
          inputCount: Object.keys(inputs).length,
          outputCount: circuit.filter(node => node.type === 'output').length,
          connectionCount: circuit.reduce((count, node) => {
            return count + (node.data?.inputs?.length || 0)
          }, 0),
          maxDepth: calculateMaxDepth(circuit),
          gateTypes: getGateTypeDistribution(circuit)
        },
        
        // Análisis de eficiencia
        efficiency: {
          redundantGates: findRedundantGates(circuit),
          unusedInputs: findUnusedInputs(circuit, inputs),
          optimizationSuggestions: generateOptimizationSuggestions(circuit)
        },
        
        // Análisis de comportamiento
        behavior: {
          propagationDelay: calculatePropagationDelay(circuit),
          criticalPath: findCriticalPath(circuit),
          fanoutAnalysis: analyzeFanout(circuit)
        },
        
        // Análisis educativo
        educational: {
          complexity: assessComplexity(circuit),
          learningObjectives: identifyLearningObjectives(circuit),
          commonMistakes: identifyCommonMistakes(circuit)
        }
      }
      
      setAnalysis(analysisResult)
      setIsAnalyzing(false)
      onAnalysisComplete && onAnalysisComplete(analysisResult)
    }, 200)
  }

  // Calcular profundidad máxima del circuito
  const calculateMaxDepth = (circuit) => {
    const depths = new Map()
    
    const calculateDepth = (nodeId) => {
      if (depths.has(nodeId)) return depths.get(nodeId)
      
      const node = circuit.find(n => n.id === nodeId)
      if (!node || node.type === 'input') {
        depths.set(nodeId, 0)
        return 0
      }
      
      const inputDepths = (node.data?.inputs || []).map(input => {
        if (input.source) {
          return calculateDepth(input.source)
        }
        return 0
      })
      
      const maxInputDepth = Math.max(...inputDepths, 0)
      const depth = maxInputDepth + 1
      depths.set(nodeId, depth)
      return depth
    }
    
    circuit.forEach(node => calculateDepth(node.id))
    return Math.max(...depths.values(), 0)
  }

  // Distribución de tipos de compuertas
  const getGateTypeDistribution = (circuit) => {
    const distribution = {}
    circuit.forEach(node => {
      if (node.data?.type) {
        distribution[node.data.type] = (distribution[node.data.type] || 0) + 1
      }
    })
    return distribution
  }

  // Encontrar compuertas redundantes
  const findRedundantGates = (circuit) => {
    const redundancies = []
    
    // Buscar compuertas NOT dobles
    circuit.forEach(node => {
      if (node.data?.type === 'NOT') {
        const inputNode = circuit.find(n => n.id === node.data.inputs[0]?.source)
        if (inputNode?.data?.type === 'NOT') {
          redundancies.push({
            type: 'double_not',
            nodes: [inputNode.id, node.id],
            description: 'Doble negación innecesaria'
          })
        }
      }
    })
    
    return redundancies
  }

  // Encontrar entradas no utilizadas
  const findUnusedInputs = (circuit, inputs) => {
    const usedInputs = new Set()
    
    circuit.forEach(node => {
      if (node.data?.inputs) {
        node.data.inputs.forEach(input => {
          if (input.source) {
            const sourceNode = circuit.find(n => n.id === input.source)
            if (sourceNode?.type === 'input') {
              usedInputs.add(sourceNode.data?.name)
            }
          }
        })
      }
    })
    
    return Object.keys(inputs).filter(input => !usedInputs.has(input))
  }

  // Generar sugerencias de optimización
  const generateOptimizationSuggestions = (circuit) => {
    const suggestions = []
    
    // Sugerir simplificaciones
    if (circuit.length > 10) {
      suggestions.push({
        type: 'complexity',
        message: 'El circuito es complejo. Considera dividirlo en subcircuitos más simples.',
        priority: 'medium'
      })
    }
    
    // Sugerir uso de compuertas universales
    const gateTypes = getGateTypeDistribution(circuit)
    if (gateTypes.AND && gateTypes.OR && gateTypes.NOT) {
      suggestions.push({
        type: 'universal_gates',
        message: 'Puedes simplificar usando solo compuertas NAND o NOR (compuertas universales).',
        priority: 'low'
      })
    }
    
    return suggestions
  }

  // Calcular retardo de propagación
  const calculatePropagationDelay = (circuit) => {
    const delays = {
      AND: 1, OR: 1, NOT: 1, NAND: 1, NOR: 1, XOR: 2, XNOR: 2
    }
    
    let totalDelay = 0
    circuit.forEach(node => {
      if (node.data?.type && delays[node.data.type]) {
        totalDelay += delays[node.data.type]
      }
    })
    
    return totalDelay
  }

  // Encontrar ruta crítica
  const findCriticalPath = (circuit) => {
    // Implementación simplificada
    return circuit.filter(node => node.data?.type === 'XOR' || node.data?.type === 'XNOR')
  }

  // Analizar fanout
  const analyzeFanout = (circuit) => {
    const fanout = {}
    
    circuit.forEach(node => {
      const connections = circuit.filter(n => 
        n.data?.inputs?.some(input => input.source === node.id)
      ).length
      
      if (connections > 0) {
        fanout[node.id] = connections
      }
    })
    
    return fanout
  }

  // Evaluar complejidad
  const assessComplexity = (circuit) => {
    const gateCount = circuit.filter(node => node.type !== 'input' && node.type !== 'output').length
    const depth = calculateMaxDepth(circuit)
    
    if (gateCount <= 3 && depth <= 2) return 'básico'
    if (gateCount <= 8 && depth <= 4) return 'intermedio'
    return 'avanzado'
  }

  // Identificar objetivos de aprendizaje
  const identifyLearningObjectives = (circuit) => {
    const objectives = []
    const gateTypes = getGateTypeDistribution(circuit)
    
    if (gateTypes.AND) objectives.push('Comprensión de la lógica AND')
    if (gateTypes.OR) objectives.push('Comprensión de la lógica OR')
    if (gateTypes.NOT) objectives.push('Comprensión de la negación')
    if (gateTypes.XOR) objectives.push('Comprensión de la lógica XOR')
    if (circuit.length > 5) objectives.push('Diseño de circuitos complejos')
    
    return objectives
  }

  // Identificar errores comunes
  const identifyCommonMistakes = (circuit) => {
    const mistakes = []
    
    // Verificar conexiones sin salida
    circuit.forEach(node => {
      const hasOutput = circuit.some(n => 
        n.data?.inputs?.some(input => input.source === node.id)
      )
      if (!hasOutput && node.type !== 'output') {
        mistakes.push({
          type: 'unconnected_output',
          node: node.id,
          message: 'Compuerta sin conexión de salida'
        })
      }
    })
    
    return mistakes
  }

  // Auto-analizar cuando cambie el circuito
  useEffect(() => {
    if (circuit.length > 0) {
      analyzeCircuit()
    }
  }, [circuit])

  if (!analysis && !isAnalyzing) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Análisis del Circuito
        </h3>
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">🔍</div>
          <p>Construye un circuito para analizar su comportamiento</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Análisis del Circuito
        </h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700"
        >
          {showDetails ? 'Ocultar' : 'Mostrar'} Detalles
        </button>
      </div>

      {isAnalyzing ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analizando circuito...</p>
        </div>
      ) : analysis ? (
        <div className="space-y-4">
          {/* Resumen principal */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded">
              <div className="text-lg font-bold text-blue-600">
                {analysis.structure.totalGates}
              </div>
              <div className="text-xs text-blue-800">Compuertas</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded">
              <div className="text-lg font-bold text-green-600">
                {analysis.structure.maxDepth}
              </div>
              <div className="text-xs text-green-800">Niveles</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded">
              <div className="text-lg font-bold text-purple-600">
                {analysis.behavior.propagationDelay}
              </div>
              <div className="text-xs text-purple-800">Retardo</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded">
              <div className="text-lg font-bold text-orange-600">
                {analysis.educational.complexity}
              </div>
              <div className="text-xs text-orange-800">Complejidad</div>
            </div>
          </div>

          {/* Detalles expandibles */}
          {showDetails && (
            <div className="space-y-4">
              {/* Distribución de compuertas */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Distribución de Compuertas</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(analysis.structure.gateTypes).map(([type, count]) => (
                    <div key={type} className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-semibold text-gray-800">{type}</div>
                      <div className="text-sm text-gray-600">{count}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Objetivos de aprendizaje */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Objetivos de Aprendizaje</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.educational.learningObjectives.map((objective, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {objective}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sugerencias de optimización */}
              {analysis.efficiency.optimizationSuggestions.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Sugerencias de Optimización</h4>
                  <div className="space-y-2">
                    {analysis.efficiency.optimizationSuggestions.map((suggestion, index) => (
                      <div key={index} className={`p-2 rounded text-sm ${
                        suggestion.priority === 'high' ? 'bg-red-50 text-red-800' :
                        suggestion.priority === 'medium' ? 'bg-yellow-50 text-yellow-800' :
                        'bg-blue-50 text-blue-800'
                      }`}>
                        {suggestion.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Errores comunes */}
              {analysis.educational.commonMistakes.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Posibles Problemas</h4>
                  <div className="space-y-2">
                    {analysis.educational.commonMistakes.map((mistake, index) => (
                      <div key={index} className="p-2 bg-red-50 text-red-800 rounded text-sm">
                        {mistake.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}

export default CircuitAnalyzer


