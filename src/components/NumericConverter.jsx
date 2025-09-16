import { useState, useEffect } from 'react'
import StepByStepConverter from './convertidor/StepByStepConverter'
import TheoryExplainer from './convertidor/TheoryExplainer'
import InteractiveLab from './convertidor/InteractiveLab'
import QuizSystem from './convertidor/QuizSystem'

function NumericConverter() {
  const [activeTab, setActiveTab] = useState('converter')
  const [inputValue, setInputValue] = useState('')
  const [fromBase, setFromBase] = useState(10)
  const [results, setResults] = useState({})
  const [userActivity, setUserActivity] = useState(null)
  const [recommendations, setRecommendations] = useState([])

  const bases = [
    { value: 2, label: 'Binario', prefix: '0b', color: 'bg-blue-100 text-blue-800' },
    { value: 8, label: 'Octal', prefix: '0o', color: 'bg-green-100 text-green-800' },
    { value: 10, label: 'Decimal', prefix: '', color: 'bg-purple-100 text-purple-800' },
    { value: 16, label: 'Hexadecimal', prefix: '0x', color: 'bg-orange-100 text-orange-800' }
  ]

  const tabs = [
    { id: 'theory', name: 'Teoría', icon: '📚', description: 'Conceptos y fundamentos' },
    { id: 'converter', name: 'Convertidor', icon: '🔄', description: 'Conversión rápida entre sistemas' },
    { id: 'stepbystep', name: 'Paso a Paso', icon: '📝', description: 'Aprende el proceso detallado' },
    { id: 'lab', name: 'Laboratorio', icon: '🧪', description: 'Experimenta libremente' },
    { id: 'quiz', name: 'Evaluación', icon: '🎯', description: 'Pon a prueba tus conocimientos' }
  ]

  const convertNumber = () => {
    if (!inputValue.trim()) {
      setResults({})
      return
    }

    try {
      const decimalValue = parseInt(inputValue, fromBase)
      if (isNaN(decimalValue)) {
        setResults({ error: 'Valor inválido para la base seleccionada' })
        return
      }

      const newResults = {}
      bases.forEach(base => {
        if (base.value === 10) {
          newResults[base.value] = decimalValue.toString()
        } else if (base.value === 16) {
          newResults[base.value] = decimalValue.toString(16).toUpperCase()
        } else {
          newResults[base.value] = decimalValue.toString(base.value)
        }
      })

      setResults(newResults)
      
      // Registrar actividad para el progreso
      setUserActivity({
        type: 'conversion',
        fromBase: fromBase,
        toBase: 10, // Siempre convertimos a decimal primero
        timestamp: new Date(),
        success: true
      })
    } catch (error) {
      setResults({ error: 'Error en la conversión' })
      setUserActivity({
        type: 'conversion',
        fromBase: fromBase,
        toBase: 10,
        timestamp: new Date(),
        success: false
      })
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setInputValue(value)
    
    // Auto-convertir si hay un valor
    if (value.trim()) {
      setTimeout(convertNumber, 300)
    } else {
      setResults({})
    }
  }

  const handleStepComplete = (steps) => {
    // Registrar actividad cuando se completa una conversión paso a paso
    setUserActivity({
      type: 'step_by_step',
      steps: steps.length,
      timestamp: new Date(),
      success: true
    })
  }

  const handleRecommendation = (recs) => {
    setRecommendations(recs)
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Módulo 1: Sistemas Numéricos
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Explora, aprende y domina los sistemas numéricos binario, octal, decimal y hexadecimal 
          con herramientas interactivas diseñadas para tu aprendizaje universitario.
        </p>
      </div>

      {/* Navegación por pestañas */}
      <div className="mb-8">
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>
        
        {/* Descripción de la pestaña activa */}
        <div className="text-center">
          <p className="text-gray-600">
            {tabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>
      </div>

      {/* Recomendaciones destacadas */}
      {recommendations.length > 0 && recommendations[0]?.priority === 'high' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-2xl mr-3">{recommendations[0].icon}</span>
            <div>
              <div className="font-semibold text-red-800">{recommendations[0].title}</div>
              <div className="text-sm text-red-700">{recommendations[0].description}</div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido de las pestañas */}
      {activeTab === 'converter' && (
        <div className="space-y-8">
          {/* Convertidor principal */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Convertidor Rápido</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor de entrada
                </label>
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Ingresa un número"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base de entrada
                </label>
                <select
                  value={fromBase}
                  onChange={(e) => setFromBase(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {bases.map(base => (
                    <option key={base.value} value={base.value}>
                      {base.label} (Base {base.value})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <button
              onClick={convertNumber}
              className="btn-primary mt-4"
            >
              Convertir
            </button>
          </div>

          {/* Resultados */}
          {results.error ? (
            <div className="card bg-red-50 border-red-200">
              <p className="text-red-700">{results.error}</p>
            </div>
          ) : Object.keys(results).length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {bases.map(base => (
                <div key={base.value} className={`card text-center ${base.color}`}>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {base.label}
                  </h3>
                  <div className="text-2xl font-mono text-primary-600">
                    {base.prefix}{results[base.value]}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Base {base.value}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}

      {activeTab === 'stepbystep' && (
        <StepByStepConverter 
          inputValue={inputValue}
          fromBase={fromBase}
          onStepComplete={handleStepComplete}
        />
      )}

      {activeTab === 'theory' && (
        <TheoryExplainer />
      )}

      {activeTab === 'lab' && (
        <InteractiveLab />
      )}

      {activeTab === 'quiz' && (
        <QuizSystem />
      )}

      {activeTab === 'progress' && (
        <ProgressTracker 
          userActivity={userActivity}
          onRecommendation={handleRecommendation}
        />
      )}

      {/* Footer informativo */}
      <div className="mt-12 text-center">
        <div className="card bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Objetivos de Aprendizaje del Módulo 1
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-semibold">Precisión</div>
              <div className="text-gray-600">Conversiones 100% exactas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-semibold">Velocidad</div>
              <div className="text-gray-600">Respuesta &lt; 1 segundo</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🧠</div>
              <div className="font-semibold">Comprensión</div>
              <div className="text-gray-600">Dominio conceptual completo</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🚀</div>
              <div className="font-semibold">Aplicación</div>
              <div className="text-gray-600">Uso en sistemas digitales</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NumericConverter