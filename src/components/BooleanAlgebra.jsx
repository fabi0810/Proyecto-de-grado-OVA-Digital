import { useState, useEffect } from 'react'
import { booleanParser } from '../utils/BooleanExpressionParser'
import { booleanSimplifier } from '../utils/BooleanSimplifier'
import { karnaughMapper } from '../utils/KarnaughMapper'
import BooleanExpressionEditor from './algebra/BooleanExpressionEditor'
import TruthTableGenerator from './algebra/TruthTableGenerator'
import SimplificationWizard from './algebra/SimplificationWizard'
import KarnaughMapper from './algebra/KarnaughMapper'
import ExerciseEngine from './algebra/ExerciseEngine'
import ProgressTracker from './algebra/ProgressTracker'

function BooleanAlgebra() {
  const [activeTab, setActiveTab] = useState('editor')
  const [expression, setExpression] = useState('')
  const [parsedExpression, setParsedExpression] = useState(null)
  const [truthTable, setTruthTable] = useState([])
  const [simplificationResult, setSimplificationResult] = useState(null)
  const [karnaughMap, setKarnaughMap] = useState(null)
  const [userProgress, setUserProgress] = useState({})

  // Cargar progreso del usuario
  useEffect(() => {
    const savedProgress = localStorage.getItem('booleanAlgebraProgress')
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress))
    }
  }, [])

  // Guardar progreso del usuario
  const updateProgress = (newProgress) => {
    const updatedProgress = { ...userProgress, ...newProgress }
    setUserProgress(updatedProgress)
    localStorage.setItem('booleanAlgebraProgress', JSON.stringify(updatedProgress))
  }

  // Manejar cambio de expresión
  const handleExpressionChange = (newExpression) => {
    setExpression(newExpression)
    
    if (newExpression.trim()) {
      const parseResult = booleanParser.parse(newExpression)
      setParsedExpression(parseResult)
      
      if (parseResult.success) {
        // Generar tabla de verdad
        const table = booleanParser.generateTruthTable(parseResult.ast, parseResult.variables)
        setTruthTable(table)
        
        // Generar mapa de Karnaugh
        try {
          const map = karnaughMapper.generateMap(newExpression, parseResult.variables)
          setKarnaughMap(map)
        } catch (error) {
          console.error('Error generando mapa de Karnaugh:', error)
          setKarnaughMap(null)
        }
        
        // Actualizar progreso
        updateProgress({
          expressionsTried: (userProgress.expressionsTried || 0) + 1,
          lastExpression: newExpression
        })
      }
    } else {
      setParsedExpression(null)
      setTruthTable([])
      setKarnaughMap(null)
    }
  }

  // Manejar simplificación
  const handleSimplification = (options = {}) => {
    if (!parsedExpression || !parsedExpression.success) {
      return
    }

    const result = booleanSimplifier.simplify(expression, options)
    setSimplificationResult(result)
    
    if (result.success) {
      updateProgress({
        simplificationsAttempted: (userProgress.simplificationsAttempted || 0) + 1,
        lastSimplification: result.simplifiedExpression
      })
    }
  }

  // Manejar ejercicios
  const handleExerciseComplete = (exerciseResult) => {
    updateProgress({
      exercisesCompleted: (userProgress.exercisesCompleted || 0) + 1,
      totalScore: (userProgress.totalScore || 0) + exerciseResult.score,
      lastExercise: exerciseResult
    })
  }

  const tabs = [
    { id: 'editor', label: 'Editor de Expresiones', icon: '✏️' },
    { id: 'truth-table', label: 'Tabla de Verdad', icon: '📊' },
    { id: 'simplification', label: 'Simplificación', icon: '🧮' },
    { id: 'karnaugh', label: 'Mapa de Karnaugh', icon: '🗺️' },
    { id: 'exercises', label: 'Ejercicios', icon: '🎯' },
    { id: 'progress', label: 'Progreso', icon: '📈' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-green-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gradient-uts mb-2">
                Módulo 3: Álgebra Booleana
              </h1>
              <p className="text-gray-600">
                Tablas de Verdad, Simplificación y Mapas de Karnaugh
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Progreso General</div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min(100, ((userProgress.expressionsTried || 0) + (userProgress.exercisesCompleted || 0)) * 5)}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-700 bg-green-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Editor de Expresiones */}
        {activeTab === 'editor' && (
          <div className="space-y-6">
            <BooleanExpressionEditor
              expression={expression}
              onExpressionChange={handleExpressionChange}
              parsedExpression={parsedExpression}
            />
          </div>
        )}

        {/* Tabla de Verdad */}
        {activeTab === 'truth-table' && (
          <div className="space-y-6">
            <TruthTableGenerator
              expression={expression}
              parsedExpression={parsedExpression}
              truthTable={truthTable}
              onExpressionChange={handleExpressionChange}
            />
          </div>
        )}

        {/* Simplificación */}
        {activeTab === 'simplification' && (
          <div className="space-y-6">
            <SimplificationWizard
              expression={expression}
              parsedExpression={parsedExpression}
              simplificationResult={simplificationResult}
              onSimplification={handleSimplification}
              onExpressionChange={handleExpressionChange}
            />
          </div>
        )}

        {/* Mapa de Karnaugh */}
        {activeTab === 'karnaugh' && (
          <div className="space-y-6">
            <KarnaughMapper
              expression={expression}
              parsedExpression={parsedExpression}
              karnaughMap={karnaughMap}
              onExpressionChange={handleExpressionChange}
            />
          </div>
        )}

        {/* Ejercicios */}
        {activeTab === 'exercises' && (
          <div className="space-y-6">
            <ExerciseEngine
              onExerciseComplete={handleExerciseComplete}
              userProgress={userProgress}
            />
          </div>
        )}

        {/* Progreso */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            <ProgressTracker
              userProgress={userProgress}
              expressionsTried={userProgress.expressionsTried || 0}
              exercisesCompleted={userProgress.exercisesCompleted || 0}
              simplificationsAttempted={userProgress.simplificationsAttempted || 0}
            />
          </div>
        )}
      </div>

      {/* Footer con información del módulo */}
      <div className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">Objetivos del Módulo</h3>
              <ul className="space-y-2 text-sm">
                <li>• Dominar el álgebra de Boole</li>
                <li>• Generar tablas de verdad automáticamente</li>
                <li>• Simplificar expresiones con teoremas</li>
                <li>• Usar mapas de Karnaugh</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Teoremas Implementados</h3>
              <ul className="space-y-2 text-sm">
                <li>• Leyes de Identidad y Nulo</li>
                <li>• Teoremas de DeMorgan</li>
                <li>• Leyes de Absorción</li>
                <li>• Teorema de Consenso</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Herramientas Disponibles</h3>
              <ul className="space-y-2 text-sm">
                <li>• Editor con validación en tiempo real</li>
                <li>• Generador automático de tablas</li>
                <li>• Simplificador paso a paso</li>
                <li>• Mapas K interactivos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BooleanAlgebra