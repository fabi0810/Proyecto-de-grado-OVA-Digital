import { useState, useEffect } from 'react'
import { AdvancedQuestionGenerator } from '../../utils/advancedQuestionGenerator'

function ExerciseEngine({ onExerciseComplete, userProgress }) {
  const [currentExercise, setCurrentExercise] = useState(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [exerciseHistory, setExerciseHistory] = useState([])
  const [exerciseMode, setExerciseMode] = useState('practice')
  const [difficulty, setDifficulty] = useState('medium')
  const [isLoading, setIsLoading] = useState(false)

  const questionGenerator = new AdvancedQuestionGenerator()

  useEffect(() => {
    generateNewExercise()
  }, [difficulty, exerciseMode])

  const generateNewExercise = () => {
    setIsLoading(true)
    
    try {
      const exercise = questionGenerator.generateAdaptiveQuiz(exerciseMode, 1)[0]
      setCurrentExercise(exercise)
      setUserAnswer('')
      setShowHint(false)
    } catch (error) {
      console.error('Error generando ejercicio:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerSubmit = () => {
    if (!currentExercise || !userAnswer.trim()) return

    const isCorrect = checkAnswer(userAnswer, currentExercise)
    const score = isCorrect ? 100 : 0
    
    const exerciseResult = {
      exercise: currentExercise,
      userAnswer: userAnswer,
      isCorrect: isCorrect,
      score: score,
      timestamp: new Date().toISOString()
    }

    setExerciseHistory(prev => [...prev, exerciseResult])
    onExerciseComplete(exerciseResult)
    
    // Generar nuevo ejercicio después de un breve delay
    setTimeout(() => {
      generateNewExercise()
    }, 2000)
  }

  const checkAnswer = (userAnswer, exercise) => {
    // Implementar lógica de verificación de respuestas
    // Esto es una implementación simplificada
    if (exercise.type === 'conversion') {
      return userAnswer.toLowerCase() === exercise.options[exercise.correct].toLowerCase()
    } else if (exercise.type === 'simplification') {
      // Verificar equivalencia lógica
      return verifyLogicalEquivalence(userAnswer, exercise.correctAnswer)
    }
    
    return false
  }

  const verifyLogicalEquivalence = (answer1, answer2) => {
    // Implementar verificación de equivalencia lógica
    // Esto es una implementación simplificada
    return answer1.toLowerCase().replace(/\s/g, '') === answer2.toLowerCase().replace(/\s/g, '')
  }

  const getExerciseTypeIcon = (type) => {
    const icons = {
      'conversion': '🔄',
      'simplification': '🧮',
      'truth-table': '📊',
      'karnaugh': '🗺️',
      'theory': '📚',
      'application': '⚡'
    }
    return icons[type] || '❓'
  }

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'easy': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'hard': 'bg-red-100 text-red-800',
      'expert': 'bg-purple-100 text-purple-800'
    }
    return colors[difficulty] || 'bg-gray-100 text-gray-800'
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Generando ejercicio...</p>
        </div>
      </div>
    )
  }

  if (!currentExercise) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">🎯</div>
          <p className="text-lg">No hay ejercicios disponibles</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Panel de Control */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Motor de Ejercicios</h2>
          <div className="flex items-center space-x-4">
            <select
              value={exerciseMode}
              onChange={(e) => setExerciseMode(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="practice">Práctica</option>
              <option value="exam">Examen</option>
              <option value="challenge">Desafío</option>
            </select>
            
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="easy">Fácil</option>
              <option value="medium">Medio</option>
              <option value="hard">Difícil</option>
              <option value="expert">Experto</option>
            </select>
          </div>
        </div>

        {/* Estadísticas del Usuario */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {userProgress.exercisesCompleted || 0}
            </div>
            <div className="text-sm text-blue-700">Ejercicios Completados</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {userProgress.totalScore || 0}
            </div>
            <div className="text-sm text-green-700">Puntuación Total</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((userProgress.totalScore || 0) / Math.max(1, userProgress.exercisesCompleted || 1))}
            </div>
            <div className="text-sm text-purple-700">Promedio</div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {exerciseHistory.length}
            </div>
            <div className="text-sm text-orange-700">En Esta Sesión</div>
          </div>
        </div>
      </div>

      {/* Ejercicio Actual */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getExerciseTypeIcon(currentExercise.type)}</span>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {currentExercise.type === 'conversion' ? 'Conversión Numérica' :
                 currentExercise.type === 'simplification' ? 'Simplificación Booleana' :
                 currentExercise.type === 'truth-table' ? 'Tabla de Verdad' :
                 currentExercise.type === 'karnaugh' ? 'Mapa de Karnaugh' :
                 currentExercise.type === 'theory' ? 'Teoría' :
                 'Aplicación'}
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentExercise.difficulty)}`}>
                {currentExercise.difficulty}
              </span>
            </div>
          </div>
          
          <button
            onClick={generateNewExercise}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Nuevo Ejercicio
          </button>
        </div>

        {/* Pregunta */}
        <div className="mb-6 p-6 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Pregunta:</h4>
          <p className="text-lg text-gray-700">{currentExercise.question}</p>
          
          {currentExercise.context && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-sm font-medium text-blue-800">Contexto:</span>
              <span className="ml-2 text-sm text-blue-700">{currentExercise.context}</span>
            </div>
          )}
        </div>

        {/* Opciones de Respuesta (si es de opción múltiple) */}
        {currentExercise.options && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Opciones:</h4>
            <div className="grid gap-3">
              {currentExercise.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setUserAnswer(option)}
                  className={`p-4 text-left rounded-lg border transition-colors ${
                    userAnswer === option
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Campo de Respuesta Libre */}
        {!currentExercise.options && (
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              Tu Respuesta:
            </label>
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Ingresa tu respuesta aquí..."
              className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
            />
          </div>
        )}

        {/* Pista */}
        {currentExercise.hint && (
          <div className="mb-6">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <span>💡</span>
              <span>{showHint ? 'Ocultar Pista' : 'Mostrar Pista'}</span>
            </button>
            
            {showHint && (
              <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700">{currentExercise.hint}</p>
              </div>
            )}
          </div>
        )}

        {/* Botones de Acción */}
        <div className="flex space-x-4">
          <button
            onClick={handleAnswerSubmit}
            disabled={!userAnswer.trim()}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Enviar Respuesta
          </button>
          
          <button
            onClick={() => setUserAnswer('')}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Historial de Ejercicios */}
      {exerciseHistory.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Historial de Ejercicios</h3>
          <div className="space-y-3">
            {exerciseHistory.slice(-5).reverse().map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.isCorrect
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {result.isCorrect ? '✅' : '❌'}
                    </span>
                    <div>
                      <p className="font-medium text-gray-800">
                        {result.exercise.question}
                      </p>
                      <p className="text-sm text-gray-600">
                        Tu respuesta: {result.userAnswer}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-800">
                      {result.score} pts
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ExerciseEngine
