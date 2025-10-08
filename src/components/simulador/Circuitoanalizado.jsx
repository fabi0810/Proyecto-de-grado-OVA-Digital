const CircuitAnalyzer = ({ circuitStats, nodes, edges }) => {
  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 'Básico': return 'text-green-600 bg-green-100'
      case 'Intermedio': return 'text-yellow-600 bg-yellow-100'
      case 'Avanzado': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getComplexityIcon = (complexity) => {
    switch (complexity) {
      case 'Básico': return '🟢'
      case 'Intermedio': return '🟡'
      case 'Avanzado': return '🔴'
      default: return '⚪'
    }
  }

  const gateTypes = nodes
    .filter(node => node.type === 'logicGate')
    .reduce((acc, node) => {
      const type = node.data.gateType
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {})

  const inputNodes = nodes.filter(node => node.type === 'input')
  const outputNodes = nodes.filter(node => 
    edges.some(edge => edge.source === node.id) && 
    !edges.some(edge => edge.target === node.id)
  )

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Análisis del Circuito
      </h3>
      
      {/* Estadísticas principales */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {circuitStats.gateCount}
          </div>
          <div className="text-sm text-blue-800">Compuertas</div>
        </div>
        
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {circuitStats.connectionCount}
          </div>
          <div className="text-sm text-green-800">Conexiones</div>
        </div>
        
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {circuitStats.inputCount}
          </div>
          <div className="text-sm text-purple-800">Entradas</div>
        </div>
        
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {circuitStats.outputCount}
          </div>
          <div className="text-sm text-orange-800">Salidas</div>
        </div>
      </div>

      {/* Complejidad */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Complejidad del Circuito</h4>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getComplexityColor(circuitStats.complexity)}`}>
          <span className="mr-2">{getComplexityIcon(circuitStats.complexity)}</span>
          {circuitStats.complexity}
        </div>
      </div>

      {/* Tipos de compuertas */}
      {Object.keys(gateTypes).length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Distribución de Compuertas</h4>
          <div className="space-y-2">
            {Object.entries(gateTypes).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{type}:</span>
                <span className="text-sm font-semibold text-gray-800">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      

      {/* Recomendaciones */}
      <div className="mt-6 p-3 bg-yellow-50 rounded-lg">
        <h4 className="text-sm font-semibold text-yellow-800 mb-2">💡 Recomendaciones</h4>
        <div className="text-xs text-yellow-700 space-y-1">
          {circuitStats.gateCount === 0 && (
            <div>• Agrega compuertas para comenzar a diseñar tu circuito</div>
          )}
          {circuitStats.connectionCount === 0 && circuitStats.gateCount > 0 && (
            <div>• Conecta las compuertas para crear la lógica del circuito</div>
          )}
          {circuitStats.complexity === 'Avanzado' && (
            <div>• Considera dividir el circuito en módulos más pequeños</div>
          )}
          {circuitStats.inputCount < 2 && (
            <div>• Agrega más entradas para crear circuitos más interesantes</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CircuitAnalyzer