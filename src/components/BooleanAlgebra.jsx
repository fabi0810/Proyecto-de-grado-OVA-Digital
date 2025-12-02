import { useState, useEffect } from 'react'
import { booleanParser } from '../utils/BooleanExpressionParser'
import { booleanSimplifier } from '../utils/BooleanSimplifier'
import { karnaughMapper } from '../utils/KarnaughMapper'
import BooleanExpressionEditor from './algebra/Editorexpresiones'
import TruthTableGenerator from './algebra/GeneradorTablaverdad'
import SimplificationWizard from './algebra/Asistentesimplificacion'
import KarnaughMapper from './algebra/MapaKarnaugh'
import BooleanTheoryExplainer from './algebra/Teoriaalebraboolean'
import BooleanChallengeModule from './algebra/Desafioalgebrabooleana'
import BooleanExamModule from './algebra/Examenalgebrabooleana'


function BooleanAlgebra() {
  const [activeTab, setActiveTab] = useState('editor')
  const [expression, setExpression] = useState('')
  const [parsedExpression, setParsedExpression] = useState(null)
  const [truthTable, setTruthTable] = useState([])
  const [simplificationResult, setSimplificationResult] = useState(null)
  const [karnaughMap, setKarnaughMap] = useState(null)
  const [userProgress, setUserProgress] = useState({})

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
          const map = karnaughMapper.generarMapa(newExpression, parseResult.variables)
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
    { id: 'teoria', label: 'Teoria', icon: '🗺️' },
    { id: 'editor', label: 'Editor de Expresiones', icon: '✏️' },
    { id: 'truth-table', label: 'Tabla de Verdad', icon: '📊' },
    { id: 'simplification', label: 'Simplificación', icon: '🧮' },
    { id: 'karnaugh', label: 'Mapa de Karnaugh', icon: '🗺️' },
    { id: 'challenge', label: 'Desafío', icon: '🎯' },
    { id: 'exercises', label: 'Examen', icon: '🎯' }
  ]

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Módulo 3: Álgebra Booleana
        </h1>
        <p className="text-gray-600">
          Tablas de Verdad, Simplificación y Mapas de Karnaugh
        </p>
        
       
      </div>
  
      {/* Tabs */}
      <div className="mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
  
      {/* Main Content */}
      <div className="min-h-96">
        {/* Teoría */}
        {activeTab === 'teoria' && (
          <div className="space-y-6">
            <BooleanTheoryExplainer />
          </div>
        )}
  
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
  
        {/* Desafío */}
        {activeTab === 'challenge' && (
          <div className="space-y-6">
            <BooleanChallengeModule />
          </div>
        )}
  
        {/* Examen */}
        {activeTab === 'exercises' && (
          <div className="space-y-6">
            <BooleanExamModule />
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
  
      {/* Footer */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Objetivos del Módulo</h3>
            <ul className="text-blue-800 space-y-2 text-sm">
              <li>• Dominar el álgebra de Boole</li>
              <li>• Generar tablas de verdad automáticamente</li>
              <li>• Simplificar expresiones con teoremas</li>
              <li>• Usar mapas de Karnaugh</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Teoremas Implementados</h3>
            <ul className="text-blue-800 space-y-2 text-sm">
              <li>• Leyes de Identidad y Nulo</li>
              <li>• Teoremas de DeMorgan</li>
              <li>• Leyes de Absorción</li>
              <li>• Teorema de Consenso</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Herramientas Disponibles</h3>
            <ul className="text-blue-800 space-y-2 text-sm">
              <li>• Editor con validación en tiempo real</li>
              <li>• Generador automático de tablas</li>
              <li>• Simplificador paso a paso</li>
              <li>• Mapas K interactivos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BooleanAlgebra