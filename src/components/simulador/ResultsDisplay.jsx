import { useState, useEffect } from 'react'

const ResultsDisplay = ({ simulationResults, inputs, circuitStats }) => {
  const [animationKey, setAnimationKey] = useState(0)

  // Reiniciar animación cuando cambian los resultados
  useEffect(() => {
    setAnimationKey(prev => prev + 1)
  }, [simulationResults])

  const getOutputNodes = () => {
    // Encontrar nodos que son salidas (no tienen conexiones de salida)
    const outputNodes = []
    Object.keys(simulationResults).forEach(nodeId => {
      if (!nodeId.startsWith('A') && !nodeId.startsWith('B')) {
        outputNodes.push({
          id: nodeId,
          value: simulationResults.get ? simulationResults.get(nodeId) : simulationResults[nodeId]
        })
      }
    })
    return outputNodes
  }

  const outputNodes = getOutputNodes()

  return (
    <div className="space-y-4">
      {/* Resultados de Simulación */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Resultados de Simulación
        </h3>
        
        {Object.keys(inputs).length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Agrega entradas para ver los resultados
          </p>
        ) : (
          <div className="space-y-4">
            {/* Entradas */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Entradas:</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(inputs).map(([name, value]) => (
                  <div key={name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">{name}:</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      value ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Salidas */}
            {outputNodes.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Salidas:</h4>
                <div className="space-y-2">
                  {outputNodes.map(node => (
                    <div key={node.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium">{node.id}:</span>
                      <div 
                        key={`${node.id}-${animationKey}`}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                          node.value ? 'bg-green-500 text-white animate-pulse' : 'bg-red-500 text-white'
                        }`}
                      >
                        {node.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Estado del Circuito */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Estado del Circuito:</h4>
              <div className="text-sm text-gray-600">
                {circuitStats.gateCount > 0 ? (
                  <div className="space-y-1">
                    <div>✅ Circuito activo</div>
                    <div>🔗 {circuitStats.connectionCount} conexiones</div>
                    <div>⚡ Simulación en tiempo real</div>
                  </div>
                ) : (
                  <div>⚠️ Agrega compuertas para simular</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Información de Simulación */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Información de Simulación
        </h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Compuertas:</span>
            <span className="font-mono">{circuitStats.gateCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Conexiones:</span>
            <span className="font-mono">{circuitStats.connectionCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Entradas:</span>
            <span className="font-mono">{circuitStats.inputCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Salidas:</span>
            <span className="font-mono">{circuitStats.outputCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Complejidad:</span>
            <span className="font-mono">{circuitStats.complexity}</span>
          </div>
        </div>

        {/* Indicador de Estado */}
        <div className="mt-4 p-2 rounded-lg bg-green-50 border border-green-200">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm text-green-800">Simulación activa</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultsDisplay