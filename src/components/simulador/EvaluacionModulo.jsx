import { useState, useEffect } from 'react'
import { circuitQuestionGenerator } from '../../utils/CircuitQuestionGenerator'

const EvaluacionModulo= () => {
  const [examState, setExamState] = useState('intro') 
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [questions, setQuestions] = useState([])
  const [timeLeft, setTimeLeft] = useState(600) 
  const [score, setScore] = useState(0)
  const [generatingExam, setGeneratingExam] = useState(false)

  //  TIEMPO DEL EXAME
  useEffect(() => {
    if (examState === 'active' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            finishExam()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [examState, timeLeft])

  //  SE GENERA EL  EXAMEN
  const generateExam = () => {
    setGeneratingExam(true)

    setTimeout(() => {
      try {
        console.log('📝 Generando examen de evaluación...')
        
        const examQuestions = circuitQuestionGenerator.generateAdaptiveQuiz('exam', 10)
        
        console.log(`✅ Examen generado: ${examQuestions.length} preguntas`)
        
        setQuestions(examQuestions)
        setGeneratingExam(false)
        setExamState('active')
        setTimeLeft(600) 
        
      } catch (error) {
        console.error('Error generando examen:', error)
        
        // Fallback: generar preguntas básicas
        const fallbackQuestions = generateFallbackExam(10)
        setQuestions(fallbackQuestions)
        setGeneratingExam(false)
        setExamState('active')
      }
    }, 1500)
  }

  const generateFallbackExam = (count) => {
    const questions = []
    const topics = ['gates', 'algebra', 'design', 'applications']
    
    for (let i = 0; i < count; i++) {
      const topic = topics[i % topics.length]
      const gates = ['AND', 'OR', 'NAND', 'NOR', 'XOR', 'XNOR']
      const gate = gates[i % gates.length]
      const input1 = Math.floor(Math.random() * 2)
      const input2 = Math.floor(Math.random() * 2)
      const output = calculateGateOutput(gate, [input1, input2])
      
      questions.push({
        id: `fallback-${Date.now()}-${i}`,
        type: topic,
        difficulty: i < 4 ? 'easy' : i < 7 ? 'medium' : 'hard',
        question: `¿Cuál es la salida de una compuerta ${gate} con entradas A=${input1} y B=${input2}?`,
        options: ['0', '1', 'X (indefinido)', 'Depende del circuito'],
        correct: output,
        explanation: `Una compuerta ${gate} con entradas ${input1} y ${input2} produce ${output}`,
        hint: `Recuerda la tabla de verdad de ${gate}`,
        generated: true,
        fallback: true
      })
    }
    
    return questions
  }

  const calculateGateOutput = (gate, inputs) => {
    switch (gate) {
      case 'AND': return inputs.every(x => x === 1) ? 1 : 0
      case 'OR': return inputs.some(x => x === 1) ? 1 : 0
      case 'NAND': return inputs.every(x => x === 1) ? 0 : 1
      case 'NOR': return inputs.some(x => x === 1) ? 0 : 1
      case 'XOR': return inputs.filter(x => x === 1).length % 2 === 1 ? 1 : 0
      case 'XNOR': return inputs.filter(x => x === 1).length % 2 === 0 ? 1 : 0
      default: return 0
    }
  }

  //  FUNCIONES DE CONTROL
  const handleAnswerSelect = (questionId, answerIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const finishExam = () => {
    const answeredCount = Object.keys(userAnswers).length
    if (answeredCount < questions.length) {
      alert(`⚠️ Debes responder todas las preguntas antes de finalizar. Te faltan ${questions.length - answeredCount} pregunta(s).`)
      return 
    }
    let correctAnswers = 0
    questions.forEach(question => {
      if (userAnswers[question.id] === question.correct) {
        correctAnswers++
      }
    })
    
    setScore(correctAnswers)
    setExamState('results')
    
    // Actualizar estadísticas
    const results = {
      type: 'quiz',
      mode: 'exam',
      questions,
      userAnswers,
      score: correctAnswers,
      total: questions.length,
      scorePercentage: Math.round((correctAnswers / questions.length) * 100),
      timestamp: new Date().toISOString()
    }
    
    try {
      circuitQuestionGenerator.updateUserProfile(results)
    } catch (error) {
      console.error('Error actualizando estadísticas:', error)
    }
  }

  const resetExam = () => {
    setExamState('intro')
    setCurrentQuestion(0)
    setUserAnswers({})
    setQuestions([])
    setScore(0)
    setTimeLeft(1800)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreMessage = (score, total) => {
    const percentage = (score / total) * 100
    if (percentage >= 90) return '¡Excelente! Has dominado los conceptos del módulo.'
    if (percentage >= 70) return '¡Muy bien! Tienes un buen entendimiento de los temas.'
    if (percentage >= 50) return 'Aprobado, pero te recomendamos repasar algunos conceptos.'
    return 'Necesitas repasar la teoría. Revisa el módulo completo antes de intentar nuevamente.'
  }

  // 🔄 PANTALLA DE CARGA
  if (generatingExam) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">📝</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Generando Examen</h3>
        <p className="text-sm text-gray-500 text-center max-w-md">
          Creando preguntas basadas en los conceptos del módulo...
        </p>
      </div>
    )
  }

  if (examState === 'intro') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            📝 Evaluación del Módulo
          </h1>
          <p className="text-lg text-gray-600">
            Circuitos Lógicos Digitales
          </p>
        </div>

        <div className="bg-white border-2 border-blue-200 rounded-lg p-8 shadow-lg mb-6">
          <div className="flex items-start space-x-4 mb-6">
            <div className="text-4xl">📚</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Sobre este Examen</h2>
              <p className="text-gray-700 mb-4">
                En este examen podrás <strong>repasar lo visto en el módulo</strong> a través de preguntas 
                relacionadas con los conceptos explicados en la teoría y practicados en el simulador.
              </p>
              <p className="text-gray-700">
                Recuerda que tendrás un <strong>tiempo límite</strong> para responder. Una vez finalices, 
                recibirás retroalimentación detallada con tus resultados.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-3">📋 Características del Examen</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span><strong>10 preguntas</strong> sobre los temas del módulo</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span><strong>10 minutos</strong> de tiempo límite</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span><strong>Dificultad progresiva</strong> segun los temas del módulo</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span><strong>Retroalimentación sobre el examen</strong> al finalizar</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>Navegación <strong>libre entre preguntas pero no tienes que contestarlas todas</strong></span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span><strong>Explicaciones detalladas</strong> de cada respuesta</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Recomendaciones</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Asegúrate de tener una conexión estable a internet</li>
              <li>• Busca un lugar tranquilo sin distracciones</li>
              <li>• Lee cuidadosamente cada pregunta antes de responder</li>
              <li>• Administra bien tu tiempo: tienes 3 minutos por pregunta aproximadamente</li>
              <li>• Puedes revisar y cambiar tus respuestas antes de finalizar</li>
            </ul>
          </div>

          <button
            onClick={generateExam}
            className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold text-lg shadow-md"
          >
            🚀 Comenzar Examen
          </button>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">📖 Temas Evaluados</h3>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-blue-600">⚡</span>
              <span className="text-gray-700">Compuertas lógicas básicas (AND, OR, NOT, etc.)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-purple-600">🧮</span>
              <span className="text-gray-700">Álgebra booleana y simplificación</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-600">🔧</span>
              <span className="text-gray-700">Diseño de circuitos combinacionales</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-orange-600">💡</span>
              <span className="text-gray-700">Aplicaciones prácticas</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  //  PANTALLA DE EXAMEN ACTIVO
  if (examState === 'active') {
    const currentQ = questions[currentQuestion]
    const userAnswer = userAnswers[currentQ?.id]
    const answeredCount = Object.keys(userAnswers).length
    const progress = ((currentQuestion + 1) / questions.length) * 100

    return (
      <div className="max-w-5xl mx-auto p-6">
        {/* Header con temporizador */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4 mb-6 shadow-md sticky top-4 z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-gray-600">Pregunta</span>
                <span className="ml-2 font-bold text-lg text-gray-900">
                  {currentQuestion + 1} / {questions.length}
                </span>
              </div>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="text-sm">
                <span className="text-gray-600">Respondidas:</span>
                <span className="ml-2 font-bold text-green-600">{answeredCount}/{questions.length}</span>
              </div>
            </div>

            <div className={`flex items-center space-x-3 px-4 py-2 rounded-lg ${
              timeLeft < 300 ? 'bg-red-100 text-red-800 border-2 border-red-300' : 'bg-blue-100 text-blue-800'
            }`}>
              <span className="text-2xl">{timeLeft < 300 ? '⏰' : '⏱️'}</span>
              <span className="font-mono text-xl font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Pregunta */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-8 mb-6 shadow-md">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  currentQ?.type === 'gates' ? 'bg-blue-100 text-blue-800' :
                  currentQ?.type === 'algebra' ? 'bg-purple-100 text-purple-800' :
                  currentQ?.type === 'design' ? 'bg-green-100 text-green-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {currentQ?.type === 'gates' ? '⚡ Compuertas' :
                   currentQ?.type === 'algebra' ? '🧮 Álgebra' :
                   currentQ?.type === 'design' ? '🔧 Diseño' : '💡 Aplicaciones'}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  currentQ?.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  currentQ?.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {currentQ?.difficulty === 'easy' ? 'Básica' :
                   currentQ?.difficulty === 'medium' ? 'Intermedia' : 'Avanzada'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {currentQ?.question}
              </h2>
            </div>
            {userAnswer !== undefined && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                ✓ Respondida
              </span>
            )}
          </div>

          {/* Opciones */}
          <div className="space-y-3">
            {currentQ?.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQ.id, index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  userAnswer === index
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                    userAnswer === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {userAnswer === index && (
                      <span className="text-white text-sm">✓</span>
                    )}
                  </div>
                  <span className="font-bold mr-3 text-lg">{String.fromCharCode(65 + index)}.</span>
                  <span className="font-medium text-gray-900">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navegación */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            ← Anterior
          </button>

          <div className="flex flex-wrap gap-2 justify-center">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-lg font-medium transition-all ${
                  index === currentQuestion
                    ? 'bg-blue-600 text-white shadow-md'
                    : userAnswers[questions[index].id] !== undefined
                    ? 'bg-green-100 text-green-800 border-2 border-green-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={currentQuestion === questions.length - 1 ? finishExam : nextQuestion}
            disabled={userAnswer === undefined && currentQuestion === questions.length - 1}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {currentQuestion === questions.length - 1 ? '✓ Finalizar' : 'Siguiente →'}
          </button>
        </div>

        {/* Advertencia */}
        {answeredCount < questions.length && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ Tienes <strong>{questions.length - answeredCount}</strong> pregunta(s) sin responder. 
              Puedes navegar usando los números arriba.
            </p>
          </div>
        )}
      </div>
    )
  }

  // 📊 PANTALLA DE RESULTADOS
  if (examState === 'results') {
    const percentage = (score / questions.length) * 100

    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            📊 Resultados del Examen
          </h1>
        </div>

        {/* Resumen */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-lg p-8 mb-6 shadow-lg">
          <div className="text-center">
            <div className="text-7xl mb-4">
              {percentage >= 90 ? '🏆' : percentage >= 70 ? '🎉' : percentage >= 50 ? '👍' : '📚'}
            </div>
            <div className={`text-5xl font-bold mb-2 ${getScoreColor(score, questions.length)}`}>
              {score}/{questions.length}
            </div>
            <div className="text-2xl text-gray-600 mb-4">
              {percentage.toFixed(1)}% de aciertos
            </div>
            <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
              {getScoreMessage(score, questions.length)}
            </p>
            
            <button
              onClick={resetExam}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg shadow-md"
            >
              🔄 Realizar Nuevo Examen
            </button>
          </div>
        </div>

        {/* Análisis detallado */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📝 Revisión Detallada</h3>
          
          <div className="space-y-4">
            {questions.map((question, index) => {
              const userAnswer = userAnswers[question.id]
              const isCorrect = userAnswer === question.correct
              
              return (
                <div 
                  key={question.id}
                  className={`border-2 rounded-lg p-6 ${
                    isCorrect 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">
                          {isCorrect ? '✅' : '❌'}
                        </span>
                        <span className="font-bold text-gray-900">
                          Pregunta {index + 1}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          question.type === 'gates' ? 'bg-blue-100 text-blue-800' :
                          question.type === 'algebra' ? 'bg-purple-100 text-purple-800' :
                          question.type === 'design' ? 'bg-green-100 text-green-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {question.type === 'gates' ? 'Compuertas' :
                           question.type === 'algebra' ? 'Álgebra' :
                           question.type === 'design' ? 'Diseño' : 'Aplicaciones'}
                        </span>
                      </div>
                      <p className="text-gray-700 font-medium mb-3">{question.question}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-3 rounded-lg border ${
                          optionIndex === question.correct
                            ? 'bg-green-100 border-green-300 font-semibold'
                            : optionIndex === userAnswer && !isCorrect
                            ? 'bg-red-100 border-red-300'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <span className="font-bold mr-3">
                          {String.fromCharCode(65 + optionIndex)}.
                        </span>
                        <span>{option}</span>
                        {optionIndex === question.correct && (
                          <span className="ml-2 text-green-600 font-semibold">← Correcta</span>
                        )}
                        {optionIndex === userAnswer && !isCorrect && (
                          <span className="ml-2 text-red-600 font-semibold">← Tu respuesta</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="font-semibold text-blue-800 mb-2">💡 Explicación:</div>
                    <div className="text-blue-700">{question.explanation}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={resetExam}
            className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            ← Volver al Inicio
          </button>
        </div>
      </div>
    )
  }

  return null
}

export default EvaluacionModulo