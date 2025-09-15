import { useState, useEffect } from 'react'

const QuizSystem = () => {
  const [quizMode, setQuizMode] = useState('practice') // 'practice', 'exam'
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)
  const [feedback, setFeedback] = useState('')

  const questionTypes = {
    conversion: {
      name: 'Conversión Directa',
      description: 'Convierte números entre diferentes bases'
    },
    theory: {
      name: 'Teoría',
      description: 'Preguntas sobre conceptos teóricos'
    },
    application: {
      name: 'Aplicación',
      description: 'Problemas prácticos de aplicación'
    }
  }

  const questionBank = [
    {
      id: 1,
      type: 'conversion',
      difficulty: 'easy',
      question: '¿Cuál es el equivalente binario de 13 decimal?',
      options: ['1101', '1011', '1110', '1001'],
      correct: 0,
      explanation: '13 ÷ 2 = 6 residuo 1, 6 ÷ 2 = 3 residuo 0, 3 ÷ 2 = 1 residuo 1, 1 ÷ 2 = 0 residuo 1. Leyendo los residuos de abajo hacia arriba: 1101₂',
      hint: 'Divide 13 repetidamente por 2 y toma los residuos'
    },
    {
      id: 2,
      type: 'conversion',
      difficulty: 'medium',
      question: 'Convierte 2A hexadecimal a decimal',
      options: ['42', '40', '44', '38'],
      correct: 0,
      explanation: '2A₁₆ = 2×16¹ + 10×16⁰ = 2×16 + 10×1 = 32 + 10 = 42₁₀',
      hint: 'A en hexadecimal es 10 en decimal'
    },
    {
      id: 3,
      type: 'theory',
      difficulty: 'easy',
      question: '¿Cuántos dígitos diferentes usa el sistema octal?',
      options: ['6', '7', '8', '9'],
      correct: 2,
      explanation: 'El sistema octal usa 8 dígitos: 0, 1, 2, 3, 4, 5, 6, 7',
      hint: 'El nombre "octal" viene de "octo" que significa 8'
    },
    {
      id: 4,
      type: 'conversion',
      difficulty: 'hard',
      question: '¿Cuál es el equivalente hexadecimal de 10110110 binario?',
      options: ['B6', 'A6', 'C6', 'D6'],
      correct: 0,
      explanation: 'Agrupando de 4 en 4: 1011 0110. 1011₂ = 11₁₀ = B₁₆, 0110₂ = 6₁₀ = 6₁₆. Resultado: B6₁₆',
      hint: 'Agrupa los bits de 4 en 4 desde la derecha'
    },
    {
      id: 5,
      type: 'application',
      difficulty: 'medium',
      question: 'En programación, ¿por qué se usa hexadecimal para representar colores?',
      options: [
        'Es más fácil de recordar',
        'Cada byte se representa con exactamente 2 dígitos hexadecimales',
        'Es más eficiente que binario',
        'Es el estándar internacional'
      ],
      correct: 1,
      explanation: 'Un byte (8 bits) se puede representar exactamente con 2 dígitos hexadecimales, facilitando la representación de valores RGB.',
      hint: 'Piensa en la relación entre bytes y dígitos hexadecimales'
    },
    {
      id: 6,
      type: 'conversion',
      difficulty: 'easy',
      question: 'Convierte 15 decimal a octal',
      options: ['17', '15', '13', '11'],
      correct: 0,
      explanation: '15 ÷ 8 = 1 residuo 7, 1 ÷ 8 = 0 residuo 1. Leyendo los residuos: 17₈',
      hint: 'Divide 15 repetidamente por 8'
    },
    {
      id: 7,
      type: 'theory',
      difficulty: 'medium',
      question: '¿Cuál es la ventaja principal del sistema binario en computación?',
      options: [
        'Es más fácil de entender',
        'Se puede implementar con dispositivos de dos estados (ON/OFF)',
        'Es más compacto que decimal',
        'Es más rápido para calcular'
      ],
      correct: 1,
      explanation: 'Los circuitos digitales pueden representar fácilmente dos estados (0 y 1) con voltajes alto y bajo.',
      hint: 'Piensa en cómo funcionan los circuitos electrónicos'
    },
    {
      id: 8,
      type: 'application',
      difficulty: 'hard',
      question: 'Si un sistema usa direcciones de memoria de 16 bits, ¿cuántas direcciones únicas puede tener?',
      options: ['32,768', '65,536', '131,072', '262,144'],
      correct: 1,
      explanation: 'Con 16 bits se pueden representar 2¹⁶ = 65,536 valores diferentes (de 0 a 65,535).',
      hint: 'Calcula 2 elevado a la potencia del número de bits'
    }
  ]

  const generateQuiz = (mode, count = 5) => {
    let selectedQuestions = []
    
    if (mode === 'practice') {
      // Mezclar todas las preguntas y tomar las primeras
      selectedQuestions = [...questionBank].sort(() => Math.random() - 0.5).slice(0, count)
    } else {
      // Examen: mezcla de dificultades
      const easy = questionBank.filter(q => q.difficulty === 'easy')
      const medium = questionBank.filter(q => q.difficulty === 'medium')
      const hard = questionBank.filter(q => q.difficulty === 'hard')
      
      selectedQuestions = [
        ...easy.sort(() => Math.random() - 0.5).slice(0, 2),
        ...medium.sort(() => Math.random() - 0.5).slice(0, 2),
        ...hard.sort(() => Math.random() - 0.5).slice(0, 1)
      ].sort(() => Math.random() - 0.5)
    }
    
    return selectedQuestions
  }

  const [questions, setQuestions] = useState([])

  const startQuiz = (mode) => {
    setQuizMode(mode)
    const newQuestions = generateQuiz(mode, mode === 'practice' ? 5 : 8)
    setQuestions(newQuestions)
    setCurrentQuestion(0)
    setUserAnswers({})
    setShowResults(false)
    setQuizCompleted(false)
    setScore(0)
    setQuizStarted(true)
    setFeedback('')
    
    if (mode === 'exam') {
      setTimeLeft(600) // 10 minutos
    }
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
      setFeedback('')
    } else {
      finishQuiz()
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
      setFeedback('')
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
    setFeedback('')
  }

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreMessage = (score, total) => {
    const percentage = (score / total) * 100
    if (percentage >= 90) return '¡Excelente! Dominas perfectamente los sistemas numéricos.'
    if (percentage >= 80) return '¡Muy bien! Tienes un buen dominio del tema.'
    if (percentage >= 60) return 'Bien, pero puedes mejorar. Revisa los conceptos básicos.'
    return 'Necesitas estudiar más. Te recomendamos repasar la teoría.'
  }

  // Timer para examen
  useEffect(() => {
    if (quizMode === 'exam' && timeLeft > 0 && quizStarted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && quizStarted) {
      finishQuiz()
    }
  }, [timeLeft, quizStarted, quizMode])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!quizStarted && !showResults) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Sistema de Evaluación
          </h2>
          <p className="text-gray-600">
            Pon a prueba tus conocimientos con preguntas interactivas
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="card text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-3">Modo Práctica</h3>
            <p className="text-gray-600 mb-4">
              5 preguntas aleatorias con feedback inmediato. Ideal para repasar conceptos.
            </p>
            <button
              onClick={() => startQuiz('practice')}
              className="btn-primary"
            >
              Comenzar Práctica
            </button>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-3">Modo Examen</h3>
            <p className="text-gray-600 mb-4">
              5 preguntas con tiempo límite de 10 minutos. Evalúa tu dominio completo.
            </p>
            <button
              onClick={() => startQuiz('exam')}
              className="btn-primary"
            >
              Comenzar Examen
            </button>
          </div>
        </div>

        <div className="card bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">Tipos de Preguntas</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            {Object.entries(questionTypes).map(([key, type]) => (
              <div key={key} className="bg-white p-3 rounded border">
                <div className="font-semibold text-blue-800">{type.name}</div>
                <div className="text-blue-600">{type.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Resultados del {quizMode === 'practice' ? 'Ejercicio' : 'Examen'}
          </h2>
        </div>

        <div className="card text-center">
          <div className={`text-4xl font-bold mb-2 ${getScoreColor(score, questions.length)}`}>
            {score}/{questions.length}
          </div>
          <div className="text-lg text-gray-600 mb-4">
            {Math.round((score / questions.length) * 100)}% de aciertos
          </div>
          <div className="text-gray-700 mb-6">
            {getScoreMessage(score, questions.length)}
          </div>
          <button
            onClick={resetQuiz}
            className="btn-primary"
          >
            Nuevo {quizMode === 'practice' ? 'Ejercicio' : 'Examen'}
          </button>
        </div>

        <div className="space-y-4">
          {questions.map((question, index) => {
            const userAnswer = userAnswers[question.id]
            const isCorrect = userAnswer === question.correct
            
            return (
              <div key={question.id} className={`card ${
                isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold">
                    Pregunta {index + 1}: {question.question}
                  </h4>
                  <div className={`px-2 py-1 rounded text-sm ${
                    isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}>
                    {isCorrect ? 'Correcta' : 'Incorrecta'}
                  </div>
                </div>
                
                <div className="space-y-2 mb-3">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className={`p-2 rounded ${
                      optionIndex === question.correct ? 'bg-green-100 border border-green-300' :
                      optionIndex === userAnswer && !isCorrect ? 'bg-red-100 border border-red-300' :
                      'bg-gray-50'
                    }`}>
                      <span className={`font-semibold ${
                        optionIndex === question.correct ? 'text-green-800' :
                        optionIndex === userAnswer && !isCorrect ? 'text-red-800' :
                        'text-gray-600'
                      }`}>
                        {String.fromCharCode(65 + optionIndex)}. 
                      </span>
                      {option}
                      {optionIndex === question.correct && (
                        <span className="ml-2 text-green-600">✓ Correcta</span>
                      )}
                      {optionIndex === userAnswer && !isCorrect && (
                        <span className="ml-2 text-red-600">✗ Tu respuesta</span>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="bg-blue-50 p-3 rounded">
                  <div className="font-semibold text-blue-800 mb-1">Explicación:</div>
                  <div className="text-blue-700 text-sm">{question.explanation}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const userAnswer = userAnswers[currentQ?.id]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {quizMode === 'practice' ? 'Ejercicio de Práctica' : 'Examen'}
        </h2>
        <div className="flex items-center space-x-4">
          {quizMode === 'exam' && (
            <div className="text-lg font-mono text-red-600">
              ⏱️ {formatTime(timeLeft)}
            </div>
          )}
          <div className="text-sm text-gray-600">
            Pregunta {currentQuestion + 1} de {questions.length}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">
              {questionTypes[currentQ?.type]?.name}
            </span>
            <span className={`text-sm px-2 py-1 rounded ${
              currentQ?.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              currentQ?.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {currentQ?.difficulty === 'easy' ? 'Fácil' :
               currentQ?.difficulty === 'medium' ? 'Medio' : 'Difícil'}
            </span>
          </div>
          <h3 className="text-lg font-semibold mb-4">{currentQ?.question}</h3>
        </div>

        <div className="space-y-3 mb-6">
          {currentQ?.options.map((option, index) => (
            <label key={index} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name={`question-${currentQ.id}`}
                value={index}
                checked={userAnswer === index}
                onChange={() => handleAnswerSelect(currentQ.id, index)}
                className="mr-3"
              />
              <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span>
              <span>{option}</span>
            </label>
          ))}
        </div>

        {currentQ?.hint && (
          <div className="bg-yellow-50 p-3 rounded-lg mb-4">
            <div className="text-sm text-yellow-800">
              <strong>Pista:</strong> {currentQ.hint}
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          
          <button
            onClick={nextQuestion}
            disabled={userAnswer === undefined}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestion === questions.length - 1 ? 'Finalizar' : 'Siguiente'}
          </button>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        ></div>
      </div>
    </div>
  )
}

export default QuizSystem

