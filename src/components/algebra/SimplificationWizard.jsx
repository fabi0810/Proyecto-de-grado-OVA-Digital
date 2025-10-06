import { useState, useEffect } from 'react'
import { booleanSimplifier } from '../../utils/BooleanSimplifier'

function SimplificationWizard({ expression, parsedExpression, simplificationResult, onSimplification, onExpressionChange }) {
  const [simplificationOptions, setSimplificationOptions] = useState({
    maxSteps: 50,
    showAllSteps: true,
    targetForm: 'SOP',
    useKarnaugh: false
  })
  const [currentStep, setCurrentStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [manualStep, setManualStep] = useState(false)

  useEffect(() => {
    if (simplificationResult && simplificationResult.success) {
      setCurrentStep(0)
    }
  }, [simplificationResult])

  const handleSimplification = () => {
    if (!parsedExpression || !parsedExpression.success) return
    
    setIsRunning(true)
    onSimplification(simplificationOptions)
    setTimeout(() => setIsRunning(false), 1000)
  }

  const handleManualStep = () => {
    if (!simplificationResult || !simplificationResult.success) return
    
    setManualStep(true)
    // Implementar lógica para paso manual
  }

  const getStepExplanation = (step) => {
    if (!step) return ''
    
    const explanations = {
      'normalization': 'La expresión se normaliza para facilitar el procesamiento',
      'identity': 'Se aplica la ley de identidad para simplificar términos',
      'null': 'Se eliminan términos nulos que no afectan el resultado',
      'idempotence': 'Se eliminan términos duplicados usando idempotencia',
      'absorption': 'Se absorben términos redundantes',
      'demorgan': 'Se aplica el teorema de DeMorgan',
      'distributive': 'Se distribuyen términos para simplificar',
      'consensus': 'Se aplica el teorema de consenso',
      'optimization': 'Se realizan optimizaciones finales'
    }
    
    return explanations[step.type] || 'Se aplica un teorema de simplificación'
  }

  const getTheoremColor = (theorem) => {
    const colors = {
      'identity': 'bg-blue-100 text-blue-800',
      'null': 'bg-red-100 text-red-800',
      'idempotence': 'bg-yellow-100 text-yellow-800',
      'absorption': 'bg-green-100 text-green-800',
      'demorgan': 'bg-purple-100 text-purple-800',
      'distributive': 'bg-indigo-100 text-indigo-800',
      'consensus': 'bg-pink-100 text-pink-800',
      'optimization': 'bg-gray-100 text-gray-800'
    }
    
    return colors[theorem] || 'bg-gray-100 text-gray-800'
  }

  if (!parsedExpression || !parsedExpression.success) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Asistente de Simplificación</h2>
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">🧮</div>
          <p className="text-lg">Ingresa una expresión booleana válida para comenzar la simplificación</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Panel de Control */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Asistente de Simplificación</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Expresión Original */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expresión Original
            </label>
            <div className="p-4 bg-gray-50 rounded-lg font-mono text-lg">
              {expression}
            </div>
          </div>

          {/* Expresión Simplificada */}
          {simplificationResult && simplificationResult.success && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expresión Simplificada
              </label>
              <div className="p-4 bg-green-50 rounded-lg font-mono text-lg text-green-800">
                {simplificationResult.simplifiedExpression}
              </div>
            </div>
          )}
        </div>

        {/* Opciones de Simplificación */}
        <div className="mt-6 grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Máximo de Pasos
            </label>
            <input
              type="number"
              value={simplificationOptions.maxSteps}
              onChange={(e) => setSimplificationOptions({
                ...simplificationOptions,
                maxSteps: parseInt(e.target.value)
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              min="1"
              max="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Forma Objetivo
            </label>
            <select
              value={simplificationOptions.targetForm}
              onChange={(e) => setSimplificationOptions({
                ...simplificationOptions,
                targetForm: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="SOP">SOP (Suma de Productos)</option>
              <option value="POS">POS (Producto de Sumas)</option>
            </select>
          </div>

          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={simplificationOptions.showAllSteps}
                onChange={(e) => setSimplificationOptions({
                  ...simplificationOptions,
                  showAllSteps: e.target.checked
                })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Mostrar todos los pasos</span>
            </label>
          </div>

          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={simplificationOptions.useKarnaugh}
                onChange={(e) => setSimplificationOptions({
                  ...simplificationOptions,
                  useKarnaugh: e.target.checked
                })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Usar Karnaugh</span>
            </label>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="mt-6 flex space-x-4">
          <button
            onClick={handleSimplification}
            disabled={isRunning}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRunning ? 'Simplificando...' : 'Simplificar Automáticamente'}
          </button>

          {simplificationResult && simplificationResult.success && (
            <button
              onClick={handleManualStep}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Paso Manual
            </button>
          )}

          <button
            onClick={() => onExpressionChange('')}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Proceso de Simplificación */}
      {simplificationResult && simplificationResult.success && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Proceso de Simplificación</h3>
          
          {/* Navegación de Pasos */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Anterior
              </button>
              
              <span className="text-sm text-gray-600">
                Paso {currentStep + 1} de {simplificationResult.steps.length}
              </span>
              
              <button
                onClick={() => setCurrentStep(Math.min(simplificationResult.steps.length - 1, currentStep + 1))}
                disabled={currentStep === simplificationResult.steps.length - 1}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente →
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max={simplificationResult.steps.length - 1}
                value={currentStep}
                onChange={(e) => setCurrentStep(parseInt(e.target.value))}
                className="w-32"
              />
              <span className="text-sm text-gray-600">Ir a paso</span>
            </div>
          </div>

          {/* Paso Actual */}
          {simplificationResult.steps[currentStep] && (
            <div className="mb-6 p-6 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-blue-800">
                  Paso {currentStep + 1}: {simplificationResult.steps[currentStep].explanation}
                </h4>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTheoremColor(simplificationResult.steps[currentStep].theorem)}`}>
                  {simplificationResult.steps[currentStep].theorem || 'Normalización'}
                </span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Antes:</label>
                  <div className="p-3 bg-white rounded border font-mono text-lg">
                    {simplificationResult.steps[currentStep].from}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Después:</label>
                  <div className="p-3 bg-white rounded border font-mono text-lg text-green-800">
                    {simplificationResult.steps[currentStep].to}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-sm text-blue-600">
                {getStepExplanation(simplificationResult.steps[currentStep])}
              </div>
            </div>
          )}

          {/* Lista de Todos los Pasos */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Todos los Pasos</h4>
            {simplificationResult.steps.map((step, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  index === currentStep
                    ? 'bg-blue-100 border-blue-300'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => setCurrentStep(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-600">Paso {index + 1}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTheoremColor(step.theorem)}`}>
                      {step.theorem || 'Normalización'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {step.from} → {step.to}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Estadísticas de Simplificación */}
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">
                {simplificationResult.steps.length}
              </div>
              <div className="text-sm text-gray-600">Pasos Realizados</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">
                {simplificationResult.complexity?.totalComplexity || 0}
              </div>
              <div className="text-sm text-gray-600">Complejidad Final</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">
                {simplificationResult.isSimplified ? 'Sí' : 'No'}
              </div>
              <div className="text-sm text-gray-600">Completamente Simplificado</div>
            </div>
          </div>
        </div>
      )}

      {/* Error en Simplificación */}
      {simplificationResult && !simplificationResult.success && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h4 className="font-medium text-red-800 mb-2">Error en la Simplificación</h4>
          <p className="text-red-700">{simplificationResult.error}</p>
        </div>
      )}
    </div>
  )
}

export default SimplificationWizard
