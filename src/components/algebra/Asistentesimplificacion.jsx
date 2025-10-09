import { useState, useEffect } from 'react'
import { booleanSimplifier } from '../../utils/BooleanSimplifier'

function SimplificationWizard({ expression, parsedExpression, simplificationResult, onSimplification, onExpressionChange }) {
  const [simplificationOptions, setSimplificationOptions] = useState(() => {
    // ✅ ELIMINADO: localStorage - usar estado en memoria
    return {
      showAllSteps: true,
      targetForm: 'SOP',
      useKarnaugh: true,
      maxSteps: 50
    }
  })
  const [currentStep, setCurrentStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [showStepByStep, setShowStepByStep] = useState(false)
  const [autoPlay, setAutoPlay] = useState(false)

  useEffect(() => {
    if (simplificationResult && simplificationResult.success) {
      setCurrentStep(0)
      setShowStepByStep(false)
      setAutoPlay(false)
    }
  }, [simplificationResult])

  // ✅ ELIMINADO: useEffect con localStorage

  // Auto-reproducción de pasos
  useEffect(() => {
    if (!autoPlay || !simplificationResult || !simplificationResult.success) return

    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= simplificationResult.steps.length - 1) {
          setAutoPlay(false)
          return prev
        }
        return prev + 1
      })
    }, 1500)

    return () => clearInterval(timer)
  }, [autoPlay, simplificationResult])

  const handleSimplification = () => {
    if (!parsedExpression || !parsedExpression.success) return
    
    setIsRunning(true)
    onSimplification(simplificationOptions)
    setTimeout(() => setIsRunning(false), 1000)
  }

  const handleStepNavigation = (direction) => {
    if (!simplificationResult || !simplificationResult.success) return
    
    if (direction === 'next') {
      setCurrentStep(Math.min(simplificationResult.steps.length - 1, currentStep + 1))
    } else if (direction === 'prev') {
      setCurrentStep(Math.max(0, currentStep - 1))
    } else if (direction === 'first') {
      setCurrentStep(0)
    } else if (direction === 'last') {
      setCurrentStep(simplificationResult.steps.length - 1)
    }
  }

  const getTheoremColor = (theorem) => {
    const colors = {
      'normalization': 'bg-gray-100 text-gray-800 border-gray-300',
      'identity_and': 'bg-blue-100 text-blue-800 border-blue-300',
      'identity_or': 'bg-blue-100 text-blue-800 border-blue-300',
      'null_and': 'bg-red-100 text-red-800 border-red-300',
      'null_or': 'bg-red-100 text-red-800 border-red-300',
      'idempotent_and': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'idempotent_or': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'complement_and': 'bg-orange-100 text-orange-800 border-orange-300',
      'complement_or': 'bg-orange-100 text-orange-800 border-orange-300',
      'absorption': 'bg-green-100 text-green-800 border-green-300',
      'demorgan': 'bg-purple-100 text-purple-800 border-purple-300',
      'distributive': 'bg-indigo-100 text-indigo-800 border-indigo-300',
      'consensus': 'bg-pink-100 text-pink-800 border-pink-300',
      'double_negation': 'bg-teal-100 text-teal-800 border-teal-300'
    }
    
    return colors[theorem] || 'bg-gray-100 text-gray-800 border-gray-300'
  }

  const getTheoremIcon = (theorem) => {
    const icons = {
      'normalization': '📝',
      'identity_and': '🔷',
      'identity_or': '🔶',
      'null_and': '⛔',
      'null_or': '⛔',
      'idempotent_and': '♻️',
      'idempotent_or': '♻️',
      'complement_and': '🔀',
      'complement_or': '🔀',
      'absorption': '🧲',
      'demorgan': '🔄',
      'distributive': '📊',
      'consensus': '🤝',
      'double_negation': '↩️'
    }
    
    return icons[theorem] || '📐'
  }

  if (!parsedExpression || !parsedExpression.success) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Asistente de Simplificación</h2>
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">🧮</div>
          <p className="text-lg mb-2">Ingresa una expresión booleana válida para comenzar la simplificación</p>
          <p className="text-sm">Usa operadores: · (AND), + (OR), ' (NOT)</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Panel de Control */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Asistente de Simplificación</h2>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Expresión Original */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expresión Original
            </label>
            <div className="p-4 bg-gray-50 rounded-lg font-mono text-lg border-2 border-gray-300">
              {expression}
            </div>
          </div>

          {/* Expresión Simplificada */}
          {simplificationResult && simplificationResult.success && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expresión Simplificada
              </label>
              <div className="p-4 bg-green-50 rounded-lg font-mono text-lg text-green-800 border-2 border-green-300">
                {simplificationResult.simplifiedExpression}
              </div>
            </div>
          )}
        </div>

        {/* Opciones de Simplificación */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
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

          <div className="flex items-end">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={simplificationOptions.showAllSteps}
                onChange={(e) => setSimplificationOptions({
                  ...simplificationOptions,
                  showAllSteps: e.target.checked
                })}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">Mostrar todos los pasos</span>
            </label>
          </div>

          <div className="flex items-end">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={simplificationOptions.useKarnaugh}
                onChange={(e) => setSimplificationOptions({
                  ...simplificationOptions,
                  useKarnaugh: e.target.checked
                })}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">Usar Karnaugh</span>
            </label>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSimplification}
            disabled={isRunning}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <span>🧮</span>
            <span>{isRunning ? 'Simplificando...' : 'Simplificar Automáticamente'}</span>
          </button>

          {simplificationResult && simplificationResult.success && (
            <button
              onClick={() => setShowStepByStep(!showStepByStep)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <span>👁️</span>
              <span>{showStepByStep ? 'Ocultar' : 'Ver'} Paso a Paso</span>
            </button>
          )}

          <button
            onClick={() => {
              onExpressionChange('')
              setShowStepByStep(false)
              setCurrentStep(0)
            }}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <span>🗑️</span>
            <span>Limpiar</span>
          </button>
        </div>

        {/* Estadísticas de Simplificación */}
        {simplificationResult && simplificationResult.success && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">
                {simplificationResult.totalSteps}
              </div>
              <div className="text-sm text-blue-700">Pasos Realizados</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">
                {simplificationResult.complexity?.original || 0}
              </div>
              <div className="text-sm text-purple-700">Complejidad Original</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">
                {simplificationResult.complexity?.simplified || 0}
              </div>
              <div className="text-sm text-green-700">Complejidad Final</div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">
                {simplificationResult.complexity?.reduction >= 0 ? '-' : '+'}{Math.abs(simplificationResult.complexity?.reduction || 0)}
              </div>
              <div className="text-sm text-orange-700">Reducción</div>
            </div>
          </div>
        )}
      </div>

      {/* Proceso de Simplificación Paso a Paso */}
      {showStepByStep && simplificationResult && simplificationResult.success && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Proceso de Simplificación Paso a Paso</h3>
            
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                autoPlay 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              <span>{autoPlay ? '⏸️' : '▶️'}</span>
              <span>{autoPlay ? 'Pausar' : 'Auto-reproducir'}</span>
            </button>
          </div>
          
          {/* Controles de Navegación */}
          <div className="mb-6 flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleStepNavigation('first')}
                disabled={currentStep === 0}
                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Primer paso"
              >
                ⏮️
              </button>
              
              <button
                onClick={() => handleStepNavigation('prev')}
                disabled={currentStep === 0}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Anterior
              </button>
              
              <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium">
                Paso {currentStep + 1} de {simplificationResult.steps.length}
              </span>
              
              <button
                onClick={() => handleStepNavigation('next')}
                disabled={currentStep === simplificationResult.steps.length - 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente →
              </button>
              
              <button
                onClick={() => handleStepNavigation('last')}
                disabled={currentStep === simplificationResult.steps.length - 1}
                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Último paso"
              >
                ⏭️
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Progreso:</span>
              <div className="w-48 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / simplificationResult.steps.length) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {Math.round(((currentStep + 1) / simplificationResult.steps.length) * 100)}%
              </span>
            </div>
          </div>

          {/* Paso Actual - Tarjeta Principal */}
          {simplificationResult.steps[currentStep] && (
            <div className="mb-6">
              <div className={`p-6 rounded-lg border-2 ${
                currentStep === 0 
                  ? 'bg-gray-50 border-gray-300' 
                  : currentStep === simplificationResult.steps.length - 1
                  ? 'bg-green-50 border-green-300'
                  : 'bg-blue-50 border-blue-300'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">
                      {getTheoremIcon(simplificationResult.steps[currentStep].theorem)}
                    </span>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">
                        {simplificationResult.steps[currentStep].law || simplificationResult.steps[currentStep].theorem || 'Paso de Simplificación'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {simplificationResult.steps[currentStep].explanation}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTheoremColor(simplificationResult.steps[currentStep].theorem)}`}>
                    {simplificationResult.steps[currentStep].theorem || 'normalización'}
                  </span>
                </div>
                
                {/* Transformación Visual */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      🔹 Antes:
                    </label>
                    <div className="p-4 bg-white rounded-lg border-2 border-gray-300 font-mono text-lg">
                      {simplificationResult.steps[currentStep].from}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ✅ Después:
                    </label>
                    <div className="p-4 bg-white rounded-lg border-2 border-green-400 font-mono text-lg text-green-800 font-bold">
                      {simplificationResult.steps[currentStep].to}
                    </div>
                  </div>
                </div>
                {/* Equivalencia */}
                {simplificationResult.steps[currentStep].equivalence && (
                  <div className="mt-4 p-4 rounded-lg border bg-white">
                    {simplificationResult.steps[currentStep].equivalence.equivalent ? (
                      <div className="text-green-700 text-sm font-medium flex items-center space-x-2">
                        <span>✔️</span>
                        <span>Expresiones equivalentes verificadas</span>
                      </div>
                    ) : (
                      <div className="text-red-700 text-sm">
                        <div className="font-medium flex items-center space-x-2 mb-2">
                          <span>✖️</span>
                          <span>No equivalente</span>
                        </div>
                        {simplificationResult.steps[currentStep].equivalence.counterExample && (
                          <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                            <strong>Contraejemplo:</strong> {Object.entries(simplificationResult.steps[currentStep].equivalence.counterExample).map(([k,v])=>`${k}=${v?1:0}`).join(', ')}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timeline de Todos los Pasos */}
          <div className="space-y-2">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <span>📋</span>
              <span>Historial de Pasos</span>
            </h4>
            
            <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
              {simplificationResult.steps.map((step, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    index === currentStep
                      ? 'bg-blue-100 border-blue-400 shadow-md scale-105'
                      : index < currentStep
                      ? 'bg-green-50 border-green-200 hover:bg-green-100'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => setCurrentStep(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === currentStep
                          ? 'bg-blue-600 text-white'
                          : index < currentStep
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            {step.law || step.theorem || 'Normalización'}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getTheoremColor(step.theorem)}`}>
                            {step.theorem}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 font-mono">
                          {step.from} → {step.to}
                        </div>
                        {step.equivalence && (
                          <div className={`mt-1 text-xs font-medium ${step.equivalence.equivalent ? 'text-green-700' : 'text-red-700'}`}>
                            {step.equivalence.equivalent ? '✔️ Equivalente' : '✖️ No equivalente'}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {index === currentStep && (
                      <span className="text-blue-600 font-bold ml-2">👁️</span>
                    )}
                    {index < currentStep && (
                      <span className="text-green-600 ml-2">✓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error en Simplificación */}
      {simplificationResult && !simplificationResult.success && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <span className="text-3xl">❌</span>
            <div>
              <h4 className="font-bold text-red-800 mb-2">Error en la Simplificación</h4>
              <p className="text-red-700">{simplificationResult.error}</p>
              {simplificationResult.errors && (
                <ul className="mt-2 space-y-1 text-sm text-red-600">
                  {simplificationResult.errors.map((err, idx) => (
                    <li key={idx}>• {err}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SimplificationWizard