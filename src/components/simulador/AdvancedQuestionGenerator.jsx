import { useState, useEffect } from 'react'
import { circuitQuestionGenerator } from '../../utils/circuitQuestionGenerator'

const AdvancedQuestionGenerator = () => {
  const [quizMode, setQuizMode] = useState('practice')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)
  const [questions, setQuestions] = useState([])
  const [generatingQuestions, setGeneratingQuestions] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState('all')
  const [userStats, setUserStats] = useState(null)

  const topics = [
    { id: 'all', label: 'Todos los Temas', icon: '🎯' },
    { id: 'gates', label: 'Compuertas Lógicas', icon: '⚡' },
    { id: 'algebra', label: 'Álgebra Booleana', icon: '🧮' },
    { id: 'design', label: 'Diseño de Circuitos', icon: '🔧' },
    { id: 'applications', label: 'Aplicaciones', icon: '💡' }
  ]

  // Cargar estadísticas del usuario al inicializar
  useEffect(() => {
    const stats = circuitQuestionGenerator.getDetailedCircuitStats()
    setUserStats(stats)
  }, [])

  // 🎲 GENERAR PREGUNTAS INTELIGENTES
  const generateAdaptiveQuestions = async (mode, count = 5) => {
    setGeneratingQuestions(true)
    
    // Simular delay para mejor UX
    setTimeout(() => {
      try {
        console.log('🧠 Generando preguntas adaptativas para circuitos...')
        
        // Usar el generador inteligente
        const adaptiveQuestions = circuitQuestionGenerator.generateAdaptiveQuiz(mode, count)
        
        console.log(`✅ Preguntas generadas: ${adaptiveQuestions.length}`)
        
        setQuestions(adaptiveQuestions)
        setGeneratingQuestions(false)
        
      } catch (error) {
        console.error('Error generando preguntas:', error)
        
        // Fallback a preguntas básicas
        const fallbackQuestions = generateBasicFallbackQuestions(count)
        setQuestions(fallbackQuestions)
        setGeneratingQuestions(false)
      }
    }, 1500)
  }

  // 🔄 PREGUNTAS DE RESPALDO
  const generateBasicFallbackQuestions = (count) => {
    const basicQuestions = []
    
    for (let i = 0; i < count; i++) {
      const gates = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR']
      const gate = gates[i % gates.length]
      const input1 = Math.floor(Math.random() * 2)
      const input2 = Math.floor(Math.random() * 2)
      const output = calculateGateOutput(gate, [input1, input2])
      
      const question = {
        id: `fallback-${Date.now()}-${i}`,
        type: 'gates',
        difficulty: 'easy',
        question: `¿Cuál es la salida de una compuerta ${gate} con entradas ${input1} y ${input2}?`,
        options: [
          output.toString(),
          (1 - output).toString(),
          'Indefinido',
          'Error'
        ],
        correct: 0,
        explanation: `Una compuerta ${gate} con entradas ${input1} y ${input2} produce ${output}`,
        hint: `Recuerda la tabla de verdad de ${gate}`,
        generated: true,
        fallback: true
      }
      
      basicQuestions.push(question)
    }
    
    return basicQuestions
  }

  // 🔧 FUNCIÓN AUXILIAR PARA CÁLCULOS
  const calculateGateOutput = (gate, inputs) => {
    switch (gate) {
      case 'AND': return inputs.every(x => x === 1) ? 1 : 0
      case 'OR': return inputs.some(x => x === 1) ? 1 : 0
      case 'NOT': return inputs[0] === 1 ? 0 : 1
      case 'NAND': return inputs.every(x => x === 1) ? 0 : 1
      case 'NOR': return inputs.some(x => x === 1) ? 0 : 1
      case 'XOR': return inputs.filter(x => x === 1).length % 2 === 1 ? 1 : 0
      default: return 0
    }
  }

  // 🎮 FUNCIONES DE CONTROL DEL QUIZ
  const startQuiz = (mode) => {
    setQuizMode(mode)
    setCurrentQuestion(0)
    setUserAnswers({})
    setShowResults(false)
    setQuizCompleted(false)
    setScore(0)
    setQuizStarted(true)
    
    if (mode === 'exam') {
      setTimeLeft(600) // 10 minutos
    }
    
    const count = mode === 'practice' ? 5 : 8
    generateAdaptiveQuestions(mode, count)
  }

  const handleAnswerSelect = (questionId, answerIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      finishQuiz()
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const finishQuiz = () => {
    let correctAnswers = 0
    questions.forEach(question => {
      if (userAnswers[question.id] === question.correct) {
        correctAnswers++
      }
    })
    
    setScore(correctAnswers)
    setQuizCompleted(true)
    setShowResults(true)
    setQuizStarted(false)
    
    // 📊 ACTUALIZAR ESTADÍSTICAS DEL USUARIO
    const results = {
      type: 'quiz',
      mode: quizMode,
      questions,
      userAnswers,
      score: correctAnswers,
      total: questions.length,
      scorePercentage: Math.round((correctAnswers / questions.length) * 100),
      timestamp: new Date().toISOString()
    }
    
    try {
      circuitQuestionGenerator.updateUserProfile(results)
      console.log('📊 Estadísticas actualizadas')
    } catch (error) {
      console.error('Error actualizando estadísticas:', error)
    }
  }

  const resetQuiz = () => {
    setQuestions([])
    setCurrentQuestion(0)
    setUserAnswers({})
    setShowResults(false)
    setQuizCompleted(false)
    setScore(0)
    setTimeLeft(0)
    setQuizStarted(false)
    
    // Recargar estadísticas
    const stats = circuitQuestionGenerator.getDetailedCircuitStats()
    setUserStats(stats)
  }

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreMessage = (score, total) => {
    const percentage = (score / total) * 100
    if (percentage >= 90) return '🎉 ¡Excelente! Dominas perfectamente los circuitos lógicos.'
    if (percentage >= 80) return '👍 ¡Muy bien! Tienes un buen dominio del tema.'
    if (percentage >= 60) return '📚 Bien, pero puedes mejorar. Revisa los conceptos básicos.'
    return '💪 Necesitas estudiar más. Te recomendamos repasar la teoría.'
  }

  // ⏱️ TIMER PARA EXAMEN
  useEffect(() => {
    if (quizMode === 'exam' && timeLeft > 0 && quizStarted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && quizStarted && quizMode === 'exam') {
      finishQuiz()
    }
  }, [timeLeft, quizStarted, quizMode])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // 🔄 PANTALLA DE GENERACIÓN
  if (generatingQuestions) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">⚡</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Generando Quiz Inteligente</h3>
        <p className="text-sm text-gray-500 text-center max-w-md">
          Analizando tu progreso y creando preguntas personalizadas sobre circuitos lógicos...
        </p>
        <div className="mt-4 flex space-x-1">
          {[0,1,2,3].map(i => (
            <div 
              key={i}
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    )
  }

  // 🏠 PANTALLA PRINCIPAL
  if (!quizStarted && !showResults) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ⚡ Quiz Inteligente de Circuitos Lógicos
          </h2>
          <p className="text-gray-600">
            Preguntas adaptativas generadas según tu progreso y nivel de conocimiento
          </p>
        </div>

        {/* Estadísticas del Usuario */}
        {userStats && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">📊 Tu Progreso</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {userStats.profile.circuitStats.totalQuizzes}
                </div>
                <div className="text-sm text-blue-700">Quizzes Completados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {userStats.profile.circuitStats.averageScore}%
                </div>
                <div className="text-sm text-green-700">Promedio General</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {userStats.strengths.length}
                </div>
                <div className="text-sm text-purple-700">Áreas Fuertes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {userStats.recommendations.length}
                </div>
                <div className="text-sm text-orange-700">Recomendaciones</div>
              </div>
            </div>

            {/* Áreas de mejora */}
            {userStats.recommendations.length > 0 && (
              <div className="mt-4 bg-white/50 rounded-lg p-3">
                <h4 className="font-semibold text-blue-800 mb-2">💡 Recomendaciones:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  {userStats.recommendations.slice(0, 3).map((rec, index) => (
                    <li key={index}>• {rec.message}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-white border-2 border-blue-200 hover:border-blue-400 transition-colors rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-xl font-semibold mb-3">Modo Práctica</h3>
            <p className="text-gray-600 mb-4">
              5 preguntas adaptativas con explicaciones detalladas y sin presión de tiempo.
            </p>
            <div className="text-sm text-gray-500 mb-4 space-y-1">
              <div>✓ Sin límite de tiempo</div>
              <div>✓ Feedback inmediato</div>
              <div>✓ Preguntas personalizadas</div>
              <div>✓ Explicaciones detalladas</div>
            </div>
            <button
              onClick={() => startQuiz('practice')}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              🚀 Comenzar Práctica
            </button>
          </div>

          <div className="bg-white border-2 border-red-200 hover:border-red-400 transition-colors rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-3">Modo Examen</h3>
            <p className="text-gray-600 mb-4">
              8 preguntas con dificultad progresiva. Ponte a prueba con tiempo límite.
            </p>
            <div className="text-sm text-gray-500 mb-4 space-y-1">
              <div>⏱️ Tiempo límite: 10 minutos</div>
              <div>📈 Dificultad progresiva</div>
              <div>🎯 Evaluación completa</div>
              <div>📊 Análisis detallado</div>
            </div>
            <button
              onClick={() => startQuiz('exam')}
              className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              ⚡ Comenzar Examen
            </button>
          </div>
        </div>

        {/* Tecnología */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-green-900 mb-3 text-center">
            🧬 Sistema de Inteligencia Adaptativa
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-3 rounded border text-center">
              <div className="text-2xl mb-2">🧠</div>
              <div className="font-semibold text-green-800">Análisis Inteligente</div>
              <div className="text-green-600">Adapta las preguntas a tu nivel</div>
            </div>
            <div className="bg-white p-3 rounded border text-center">
              <div className="text-2xl mb-2">🎲</div>
              <div className="font-semibold text-blue-800">Generación Dinámica</div>
              <div className="text-blue-600">Preguntas únicas cada vez</div>
            </div>
            <div className="bg-white p-3 rounded border text-center">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold text-purple-800">Seguimiento Progreso</div>
              <div className="text-purple-600">Estadísticas personalizadas</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 📊 PANTALLA DE RESULTADOS
  if (showResults) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            📊 Resultados del {quizMode === 'practice' ? 'Quiz de Práctica' : 'Examen'}
          </h2>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 text-center">
          <div className={`text-6xl font-bold mb-2 ${getScoreColor(score, questions.length)}`}>
            {score}/{questions.length}
          </div>
          <div className="text-2xl text-gray-600 mb-4">
            {Math.round((score / questions.length) * 100)}% de aciertos
          </div>
          <div className="text-gray-700 mb-6 text-lg max-w-2xl mx-auto">
            {getScoreMessage(score, questions.length)}
          </div>
          <button
            onClick={resetQuiz}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
          >
            🔄 Nuevo {quizMode === 'practice' ? 'Quiz' : 'Examen'}
          </button>
        </div>

        {/* Análisis detallado */}
        <div className="space-y-4">
          {questions.map((question, index) => {
            const userAnswer = userAnswers[question.id]
            const isCorrect = userAnswer === question.correct
            
            return (
              <div key={question.id} className={`bg-white rounded-lg border-2 p-6 ${
                isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-semibold flex-1 text-lg">
                    <span className="text-gray-500">#{index + 1}</span> {question.question}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      question.type === 'gates' ? 'bg-blue-100 text-blue-800' :
                      question.type === 'algebra' ? 'bg-purple-100 text-purple-800' :
                      question.type === 'design' ? 'bg-green-100 text-green-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {question.type === 'gates' ? '⚡ Compuertas' :
                       question.type === 'algebra' ? '🧮 Álgebra' :
                       question.type === 'design' ? '🔧 Diseño' : '💡 Aplicaciones'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                    }`}>
                      {isCorrect ? '✅ Correcta' : '❌ Incorrecta'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className={`p-3 rounded-lg border ${
                      optionIndex === question.correct ? 'bg-green-100 border-green-300 font-semibold' :
                      optionIndex === userAnswer && !isCorrect ? 'bg-red-100 border-red-300' :
                      'bg-gray-50 border-gray-200'
                    }`}>
                      <span className="font-bold mr-3">
                        {String.fromCharCode(65 + optionIndex)}. 
                      </span>
                      <span>{option}</span>
                      {optionIndex === question.correct && (
                        <span className="ml-2 text-green-600 font-semibold">← Respuesta correcta</span>
                      )}
                      {optionIndex === userAnswer && !isCorrect && (
                        <span className="ml-2 text-red-600 font-semibold">← Tu respuesta</span>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
                  <div className="font-semibold text-blue-800 mb-2">💡 Explicación:</div>
                  <div className="text-blue-700">{question.explanation}</div>
                </div>
                
                {question.hint && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="font-semibold text-yellow-800 mb-2">🔍 Pista:</div>
                    <div className="text-yellow-700">{question.hint}</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // 🎮 PANTALLA DE QUIZ ACTIVO
  const currentQ = questions[currentQuestion]
  const userAnswer = userAnswers[currentQ?.id]

  return (
    <div className="space-y-6">
      {/* Header del Quiz */}
      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
        <div>
          <h2 className="text-xl font-semibold">
            {quizMode === 'practice' ? '🎓 Quiz de Práctica' : '🎯 Examen de Circuitos'}
          </h2>
          <p className="text-sm text-gray-600">
            Tema: {currentQ?.type || 'General'} • {currentQ?.generated ? '🎲 Adaptativa' : '📝 Estática'}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {quizMode === 'exam' && (
            <div className="text-lg font-mono text-red-600 bg-red-50 px-3 py-1 rounded border">
              ⏱️ {formatTime(timeLeft)}
            </div>
          )}
          <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded">
            {currentQuestion + 1} de {questions.length}
          </div>
        </div>
      </div>

      {/* Pregunta Actual */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className={`text-sm px-3 py-1 rounded-full font-medium ${
              currentQ?.type === 'gates' ? 'bg-blue-100 text-blue-800' :
              currentQ?.type === 'algebra' ? 'bg-purple-100 text-purple-800' :
              currentQ?.type === 'design' ? 'bg-green-100 text-green-800' :
              'bg-orange-100 text-orange-800'
            }`}>
              {currentQ?.type === 'gates' ? '⚡ Compuertas' :
               currentQ?.type === 'algebra' ? '🧮 Álgebra' :
               currentQ?.type === 'design' ? '🔧 Diseño' : '💡 Aplicaciones'}
            </span>
            <span className={`text-sm px-3 py-1 rounded-full font-medium ${
              currentQ?.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              currentQ?.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {currentQ?.difficulty === 'easy' ? '😊 Fácil' :
               currentQ?.difficulty === 'medium' ? '🤔 Medio' : '🔥 Difícil'}
            </span>
          </div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            {currentQ?.question}
          </h3>
        </div>

        {/* Opciones */}
        <div className="space-y-3 mb-6">
          {currentQ?.options.map((option, index) => (
            <label key={index} className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
              userAnswer === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}>
              <input
                type="radio"
                name={`question-${currentQ.id}`}
                value={index}
                checked={userAnswer === index}
                onChange={() => handleAnswerSelect(currentQ.id, index)}
                className="mr-4 w-4 h-4"
              />
              <span className="font-bold mr-3 text-lg">{String.fromCharCode(65 + index)}.</span>
              <span className="text-lg">{option}</span>
            </label>
          ))}
        </div>

        {/* Pista */}
        {currentQ?.hint && quizMode === 'practice' && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
            <div className="text-sm text-yellow-800">
              <strong>💡 Pista:</strong> {currentQ.hint}
            </div>
          </div>
        )}

        {/* Controles de navegación */}
        <div className="flex justify-between">
          <button
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Anterior
          </button>
          
          <button
            onClick={nextQuestion}
            disabled={userAnswer === undefined}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {currentQuestion === questions.length - 1 ? 'Finalizar Quiz' : 'Siguiente →'}
          </button>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500 ease-out"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        >
          <div className="h-full bg-white/20 animate-pulse"></div>
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-500">
        Progreso: {currentQuestion + 1}/{questions.length} preguntas completadas
        {currentQ?.generated && !currentQ?.fallback && (
          <span className="ml-2 text-blue-600">• Pregunta personalizada 🎲</span>
        )}
      </div>
    </div>
  )
}

export default AdvancedQuestionGenerator