import { useState, useEffect } from 'react'

const CircuitAnalyzer = ({ circuitStats, simulationResults }) => {
  const [analysis, setAnalysis] = useState({
    efficiency: 0,
    complexity: 'Básico',
    recommendations: [],
    warnings: []
  })

  useEffect(() => {
    const analyzeCircuit = () => {
      const { gateCount, connectionCount, inputCount, outputCount } = circuitStats
      
      // Calcular eficiencia
      const efficiency = gateCount > 0 ? Math.min((outputCount / gateCount) * 100, 100) : 0
      
      // Determinar complejidad
      let complexity = 'Básico'
      if (gateCount > 7) complexity = 'Avanzado'
      else if (gateCount > 3) complexity = 'Intermedio'
      
      // Generar recomendaciones
      const recommendations = []
      const warnings = []
      
      if (gateCount === 0) {
        warnings.push('No hay compuertas en el circuito')
      }
      
      if (connectionCount === 0 && gateCount > 0) {
        warnings.push('Las compuertas no están conectadas')
      }
      
      if (efficiency < 50 && gateCount > 2) {
        recommendations.push('Considera optimizar el circuito para mejor eficiencia')
      }
      
      if (gateCount > 10) {
        recommendations.push('El circuito es complejo, considera dividirlo en módulos')
      }
      
      if (inputCount === 0) {
        warnings.push('No hay entradas definidas')
      }
      
      if (outputCount === 0 && gateCount > 0) {
        warnings.push('No hay salidas definidas')
      }
      
      setAnalysis({
        efficiency,
        complexity,
        recommendations,
        warnings
      })
    }

    analyzeCircuit()
  }, [circuitStats])

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 'Básico': return 'text-green-600 bg-green-100'
      case 'Intermedio': return 'text-yellow-600 bg-yellow-100'
      case 'Avanzado': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 80) return 'text-green-600'
    if (efficiency >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-4">
      {/* Análisis Principal */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Análisis del Circuito
        </h3>
        
        <div className="space-y-4">
          {/* Métricas Principales */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded">
              <div className="text-lg font-bold text-blue-600">
                {circuitStats.gateCount}
              </div>
              <div className="text-sm text-blue-800">Compuertas</div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded">
              <div className="text-lg font-bold text-green-600">
                {circuitStats.connectionCount}
              </div>
              <div className="text-sm text-green-800">Conexiones</div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded">
              <div className="text-lg font-bold text-purple-600">
                {circuitStats.inputCount}
              </div>
              <div className="text-sm text-purple-800">Entradas</div>
            </div>
            
            <div className="text-center p-3 bg-orange-50 rounded">
              <div className="text-lg font-bold text-orange-600">
                {circuitStats.outputCount}
              </div>
              <div className="text-sm text-orange-800">Salidas</div>
            </div>
          </div>

          {/* Complejidad */}
          <div className="text-center">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getComplexityColor(analysis.complexity)}`}>
              Complejidad: {analysis.complexity}
            </span>
          </div>

          {/* Eficiencia */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Eficiencia del Circuito:</span>
              <span className={`font-semibold ${getEfficiencyColor(analysis.efficiency)}`}>
                {analysis.efficiency.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  analysis.efficiency >= 80 ? 'bg-green-500' :
                  analysis.efficiency >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${analysis.efficiency}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recomendaciones */}
      {analysis.recommendations.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recomendaciones
          </h3>
          <div className="space-y-2">
            {analysis.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start p-2 bg-blue-50 rounded-lg">
                <span className="text-blue-500 mr-2">💡</span>
                <span className="text-sm text-blue-800">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Advertencias */}
      {analysis.warnings.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Advertencias
          </h3>
          <div className="space-y-2">
            {analysis.warnings.map((warning, index) => (
              <div key={index} className="flex items-start p-2 bg-yellow-50 rounded-lg">
                <span className="text-yellow-500 mr-2">⚠️</span>
                <span className="text-sm text-yellow-800">{warning}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estadísticas Detalladas */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Estadísticas Detalladas
        </h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Densidad de Conexiones:</span>
            <span className="font-mono">
              {circuitStats.gateCount > 0 ? (circuitStats.connectionCount / circuitStats.gateCount).toFixed(2) : '0.00'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Relación Entrada/Salida:</span>
            <span className="font-mono">
              {circuitStats.outputCount > 0 ? (circuitStats.inputCount / circuitStats.outputCount).toFixed(2) : '∞'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Compuertas por Entrada:</span>
            <span className="font-mono">
              {circuitStats.inputCount > 0 ? (circuitStats.gateCount / circuitStats.inputCount).toFixed(2) : '0.00'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Estado de Simulación:</span>
            <span className="font-mono text-green-600">Activa</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CircuitAnalyzer