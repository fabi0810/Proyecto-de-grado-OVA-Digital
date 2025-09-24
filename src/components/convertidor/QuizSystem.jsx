import { useState, useEffect } from 'react'

const QuizSystem = () => {
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

  const questionBank = {
    conversion: {
      easy: [
        {
          question: '¿Cuál es el equivalente binario de {number} decimal?',
          generator: (num) => ({
            options: [
              num.toString(2),
              (num + 1).toString(2),
              (num - 1).toString(2),
              (num + 2).toString(2)
            ],
            correct: 0,
            explanation: `${num} en binario se calcula dividiendo repetidamente por 2: ${num.toString(2)}₂`,
            hint: `Divide ${num} repetidamente por 2 y toma los residuos`
          })
        },
        {
          question: 'Convierte {number} decimal a octal',
          generator: (num) => ({
            options: [
              num.toString(8),
              (num + 1).toString(8),
              (num - 1).toString(8),
              (num * 2).toString(8)
            ],
            correct: 0,
            explanation: `${num} en octal = ${num.toString(8)}₈`,
            hint: `Divide ${num} repetidamente por 8`
          })
        },
        {
          question: '¿Cuál es el valor decimal de {binary} binario?',
          generator: (num) => {
            const binary = num.toString(2)
            return {
              options: [
                num.toString(),
                (num + 1).toString(),
                (num - 1).toString(),
                (num * 2).toString()
              ],
              correct: 0,
              explanation: `${binary}₂ = ${num}₁₀`,
              hint: `Suma las potencias de 2 correspondientes a los 1s`
            }
          }
        }
      ],
      medium: [
        {
          question: 'Convierte {hex} hexadecimal a decimal',
          generator: (num) => {
            const hex = num.toString(16).toUpperCase()
            return {
              options: [
                num.toString(),
                (num + 5).toString(),
                (num - 3).toString(),
                (num + 10).toString()
              ],
              correct: 0,
              explanation: `${hex}₁₆ = ${num}₁₀`,
              hint: `Multiplica cada dígito por su potencia de 16`
            }
          }
        },
        {
          question: '¿Cuál es la suma de {num1} binario + {num2} binario?',
          generator: (num1, num2) => {
            const sum = num1 + num2
            return {
              options: [
                sum.toString(2),
                (sum + 1).toString(2),
                (sum - 1).toString(2),
                (sum + 2).toString(2)
              ],
              correct: 0,
              explanation: `${num1.toString(2)}₂ + ${num2.toString(2)}₂ = ${sum.toString(2)}₂`,
              hint: `Suma como en decimal, pero llevas cuando sumas 1+1`
            }
          }
        }
      ],
      hard: [
        {
          question: 'Convierte {decimal} decimal a base {base}',
          generator: (decimal, base) => {
            const result = decimal.toString(base).toUpperCase()
            const wrong1 = (decimal + 1).toString(base).toUpperCase()
            const wrong2 = (decimal - 1).toString(base).toUpperCase()
            const wrong3 = (Math.floor(decimal * 1.1)).toString(base).toUpperCase()
            
            return {
              options: [result, wrong1, wrong2, wrong3],
              correct: 0,
              explanation: `${decimal}₁₀ en base ${base} = ${result}`,
              hint: `Divide repetidamente por ${base} y toma los residuos`
            }
          }
        }
      ]
    },
    theory: {
      easy: [
        {
          question: '¿Cuántos dígitos usa el sistema {system}?',
          generator: (system, base) => ({
            options: [base.toString(), (base-1).toString(), (base+1).toString(), (base*2).toString()],
            correct: 0,
            explanation: `El sistema ${system} usa ${base} dígitos (0 hasta ${base-1})`,
            hint: `El nombre del sistema indica la base`
          })
        },
        {
          question: '¿Cuál es el dígito más grande en base {base}?',
          generator: (base) => ({
            options: [(base-1).toString(), base.toString(), (base+1).toString(), (base-2).toString()],
            correct: 0,
            explanation: `En base ${base}, el dígito más grande es ${base-1}`,
            hint: `El dígito más grande es siempre la base menos 1`
          })
        }
      ],
      medium: [
        {
          question: '¿Por qué se usa el sistema binario en computación?',
          generator: () => ({
            options: [
              'Se puede implementar con dispositivos de dos estados (ON/OFF)',
              'Es más fácil de entender que decimal',
              'Ocupa menos espacio en memoria',
              'Es más rápido para calcular'
            ],
            correct: 0,
            explanation: 'Los circuitos digitales representan fácilmente dos estados con voltajes',
            hint: 'Piensa en cómo funcionan los interruptores electrónicos'
          })
        }
      ]
    },
    application: {
      medium: [
        {
          question: 'En programación, un byte puede representar valores de 0 a:',
          generator: () => ({
            options: ['255', '256', '127', '128'],
            correct: 0,
            explanation: 'Un byte (8 bits) puede representar 2⁸ = 256 valores (0-255)',
            hint: 'Calcula 2 elevado al número de bits'
          })
        },
        {
          question: 'Si tienes {bits} bits, ¿cuántos valores diferentes puedes representar?',
          generator: (bits) => {
            const values = Math.pow(2, bits)
            return {
              options: [
                values.toString(),
                (values * 2).toString(),
                (values / 2).toString(),
                (values - 1).toString()
              ],
              correct: 0,
              explanation: `Con ${bits} bits puedes representar 2^${bits} = ${values} valores`,
              hint: `Calcula 2 elevado a ${bits}`
            }
          }
        }
      ]
    }
  }

  const generateSmartQuestions = (mode, count = 5) => {
    setGeneratingQuestions(true)
    
    // Simular tiempo de "generación" para mejor UX
    setTimeout(() => {
      const questions = []
      const usedQuestions = new Set()
      
      const difficulties = mode === 'practice' 
        ? ['easy', 'easy', 'medium', 'medium', 'hard']
        : ['easy', 'easy', 'medium', 'medium', 'medium', 'hard', 'hard', 'hard']
      
      const categories = Object.keys(questionBank)
      
      // ✅ CAMBIO: Usar while loop para garantizar el número exacto
      let attempts = 0
      const maxAttempts = count * 5 // Evitar bucle infinito
      
      while (questions.length < count && attempts < maxAttempts) {
        const questionIndex = questions.length // Usar el índice actual como posición
        const category = categories[Math.floor(Math.random() * categories.length)]
        const difficulty = difficulties[questionIndex % difficulties.length] || 'medium'
        
        const availableQuestions = questionBank[category][difficulty] || questionBank[category]['easy'] || []
        
        if (availableQuestions.length === 0) {
          attempts++
          continue // Intentar con otra categoría
        }
        
        const questionTemplate = availableQuestions[Math.floor(Math.random() * availableQuestions.length)]
        const questionKey = `${category}-${difficulty}-${questionTemplate.question}-${Math.floor(attempts/10)}` // Permitir repeticiones después de varios intentos
        
        // ✅ CAMBIO: Ser menos estricto con preguntas repetidas después de muchos intentos
        if (usedQuestions.has(questionKey) && attempts < maxAttempts * 0.8) {
          attempts++
          continue
        }
        
        usedQuestions.add(questionKey)
        const generatedQuestion = createQuestionFromTemplate(questionTemplate, category, difficulty, questions.length + 1)
        
        if (generatedQuestion) {
          questions.push(generatedQuestion)
        }
        
        attempts++
      }
      
      // ✅ CAMBIO: Si aún faltan preguntas, llenar con preguntas básicas garantizadas
      while (questions.length < count) {
        const missingIndex = questions.length
        const fallbackQuestion = createFallbackQuestion(missingIndex + 1)
        questions.push(fallbackQuestion)
      }
      
      // ✅ VERIFICACIÓN FINAL: Asegurar que tenemos exactamente el número solicitado
      console.log(`✅ Quiz generado: ${questions.length} preguntas (solicitadas: ${count})`)
      
      setQuestions(questions.slice(0, count)) // Por seguridad, cortar exactamente al número solicitado
      setGeneratingQuestions(false)
    }, 1500)
  }
  

  // 🏭 FACTORÍA DE PREGUNTAS DINÁMICAS
  const createQuestionFromTemplate = (template, category, difficulty, id) => {
    let questionData
    
    // Generar números aleatorios para las preguntas
    if (template.question.includes('{number}')) {
      const num = Math.floor(Math.random() * 50) + 10 // 10-59
      questionData = template.generator(num)
      questionData.question = template.question.replace('{number}', num)
    }
    else if (template.question.includes('{binary}')) {
      const num = Math.floor(Math.random() * 31) + 1 // 1-31
      questionData = template.generator(num)
      questionData.question = template.question.replace('{binary}', num.toString(2))
    }
    else if (template.question.includes('{hex}')) {
      const num = Math.floor(Math.random() * 255) + 16 // 16-270
      questionData = template.generator(num)
      questionData.question = template.question.replace('{hex}', num.toString(16).toUpperCase())
    }
    else if (template.question.includes('{num1}') && template.question.includes('{num2}')) {
      const num1 = Math.floor(Math.random() * 15) + 1
      const num2 = Math.floor(Math.random() * 15) + 1
      questionData = template.generator(num1, num2)
      questionData.question = template.question
        .replace('{num1}', num1.toString(2))
        .replace('{num2}', num2.toString(2))
    }
    else if (template.question.includes('{base}')) {
      const bases = [3, 5, 6, 7, 9]
      const base = bases[Math.floor(Math.random() * bases.length)]
      const decimal = Math.floor(Math.random() * 50) + 10
      questionData = template.generator(decimal, base)
      questionData.question = template.question
        .replace('{decimal}', decimal)
        .replace('{base}', base)
    }
    else if (template.question.includes('{system}')) {
      const systems = [
        { name: 'octal', base: 8 },
        { name: 'binario', base: 2 },
        { name: 'hexadecimal', base: 16 }
      ]
      const system = systems[Math.floor(Math.random() * systems.length)]
      questionData = template.generator(system.name, system.base)
      questionData.question = template.question.replace('{system}', system.name)
    }
    else if (template.question.includes('{bits}')) {
      const bits = [4, 6, 8, 10, 12][Math.floor(Math.random() * 5)]
      questionData = template.generator(bits)
      questionData.question = template.question.replace('{bits}', bits)
    }
    else {
      questionData = template.generator()
      questionData.question = template.question
    }
    
    // Mezclar opciones
    const correctAnswer = questionData.options[0]
    const shuffledOptions = [...questionData.options].sort(() => Math.random() - 0.5)
    const newCorrectIndex = shuffledOptions.indexOf(correctAnswer)
    
    return {
      id: Date.now() + id + Math.random(),
      type: category,
      difficulty: difficulty,
      question: questionData.question,
      options: shuffledOptions,
      correct: newCorrectIndex,
      explanation: questionData.explanation,
      hint: questionData.hint,
      generated: true,
      timestamp: new Date().toISOString()
    }
  }
  const createFallbackQuestion = (id) => {
    const fallbackQuestions = [
      {
        question: `Convierte ${Math.floor(Math.random() * 30) + 10} decimal a binario`,
        type: 'conversion',
        difficulty: 'easy'
      },
      {
        question: `¿Cuántos dígitos usa el sistema octal?`,
        type: 'theory', 
        difficulty: 'easy'
      },
      {
        question: `¿Cuál es el valor decimal de ${Math.floor(Math.random() * 15 + 1).toString(2)} binario?`,
        type: 'conversion',
        difficulty: 'medium'
      }
    ]
    
    const template = fallbackQuestions[id % fallbackQuestions.length]
    const num = Math.floor(Math.random() * 30) + 10
    
    if (template.type === 'conversion' && template.question.includes('decimal a binario')) {
      return {
        id: Date.now() + id + Math.random(),
        type: 'conversion',
        difficulty: 'easy',
        question: `Convierte ${num} decimal a binario`,
        options: [
          num.toString(2),
          (num + 1).toString(2), 
          (num - 1).toString(2),
          (num + 2).toString(2)
        ].sort(() => Math.random() - 0.5),
        correct: [
          num.toString(2),
          (num + 1).toString(2),
          (num - 1).toString(2), 
          (num + 2).toString(2)
        ].sort(() => Math.random() - 0.5).indexOf(num.toString(2)),
        explanation: `${num} en binario es ${num.toString(2)}`,
        hint: `Divide ${num} repetidamente por 2`,
        generated: true
      }
    }
    
    if (template.type === 'theory') {
      return {
        id: Date.now() + id + Math.random(),
        type: 'theory',
        difficulty: 'easy', 
        question: '¿Cuántos dígitos usa el sistema octal?',
        options: ['8', '7', '9', '6'].sort(() => Math.random() - 0.5),
        correct: ['8', '7', '9', '6'].sort(() => Math.random() - 0.5).indexOf('8'),
        explanation: 'El sistema octal usa 8 dígitos: 0, 1, 2, 3, 4, 5, 6, 7',
        hint: 'El nombre "octal" viene de "octo" = 8',
        generated: true
      }
    }
    
    // Pregunta binario a decimal
    const binaryNum = Math.floor(Math.random() * 15) + 1
    const binaryStr = binaryNum.toString(2)
    
    return {
      id: Date.now() + id + Math.random(),
      type: 'conversion',
      difficulty: 'medium',
      question: `¿Cuál es el valor decimal de ${binaryStr} binario?`,
      options: [
        binaryNum.toString(),
        (binaryNum + 1).toString(),
        (binaryNum - 1).toString(),
        (binaryNum + 2).toString()
      ].sort(() => Math.random() - 0.5),
      correct: [
        binaryNum.toString(),
        (binaryNum + 1).toString(), 
        (binaryNum - 1).toString(),
        (binaryNum + 2).toString()
      ].sort(() => Math.random() - 0.5).indexOf(binaryNum.toString()),
      explanation: `${binaryStr} binario = ${binaryNum} decimal`,
      hint: 'Suma las potencias de 2 donde hay 1s',
      generated: true
    }
  }

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
    
    // Generar preguntas inteligentemente
    const count = mode === 'practice' ? 5 : 8
    generateSmartQuestions(mode, count)
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
    } else if (timeLeft === 0 && quizStarted && quizMode === 'exam') {
      finishQuiz()
    }
  }, [timeLeft, quizStarted, quizMode])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Pantalla de generación
  if (generatingQuestions) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🧠</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Generando Quiz </h3>
        <p className="text-sm text-gray-500 text-center max-w-md">
          Creando preguntas ...
        </p>
        <div className="mt-4 flex space-x-1">
          {[0,1,2,3].map(i => (
            <div 
              key={i}
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
      </div>
    )
  }

  if (!quizStarted && !showResults) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🎯 Sistema de Quiz
          </h2>
          <p className="text-gray-600">
            Quiz para practicar y evaluar tus conocimientos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="card text-center border-2 border-blue-200 hover:border-blue-400 transition-colors">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-3">Modo Práctica</h3>
            <p className="text-gray-600 mb-4">
             Pon en practica tus conocimientos.
            </p>
            <div className="text-sm text-gray-500 mb-4">
              ✓ Sin tiempo límite<br/>
              ✓ Preguntas sobre el tema<br/>
              ✓ Preguntas adaptativas
            </div>
            <button
              onClick={() => startQuiz('practice')}
              className="btn-primary w-full"
            >
            🚀 Comenzar Práctica
            </button>
          </div>    
          <div className="card text-center border-2 border-red-200 hover:border-red-400 transition-colors">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-3">Modo Examen</h3>
            <p className="text-gray-600 mb-4">
              8 preguntas con dificultad progresiva.Tiempo límite de 10 minutos.
            </p>
            <div className="text-sm text-gray-500 mb-4">
              ✓ Tiempo límite: 10 min<br/>
              ✓ Dificultad progresiva<br/>
              ✓ Evaluación completa<br/>
            </div>
            <button
              onClick={() => startQuiz('exam')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors w-full"
            >
              ⚡ Comenzar Examen
            </button>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3 text-center">
            🧬 Quiz con preguntas dinamicas y adaptadas a tu nivel.
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-3 rounded border text-center">
              <div className="text-2xl mb-2">🎲</div>
              <div className="font-semibold text-blue-800">Preguntas dinamicas</div>
              <div className="text-blue-600">Preguntas aleatorias</div>
            </div>
            <div className="bg-white p-3 rounded border text-center">
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-semibold text-purple-800">Dificultad Adaptativa</div>
              <div className="text-purple-600">Se ajusta automáticamente a tu nivel</div>
            </div>
            <div className="bg-white p-3 rounded border text-center">
              <div className="text-2xl mb-2">♾️</div>
              <div className="font-semibold text-green-800">Modo Examen para practicar para el parcial</div>
              <div className="text-green-600">Miles de combinaciones posibles</div>
            </div>
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
            📊 Resultados del {quizMode === 'practice' ? 'Ejercicio' : 'Examen'}
          </h2>
        </div>

        <div className="card text-center bg-gradient-to-r from-blue-50 to-purple-50">
          <div className={`text-6xl font-bold mb-2 ${getScoreColor(score, questions.length)}`}>
            {score}/{questions.length}
          </div>
          <div className="text-2xl text-gray-600 mb-4">
            {Math.round((score / questions.length) * 100)}% de aciertos
          </div>
          <div className="text-gray-700 mb-6 text-lg">
            {getScoreMessage(score, questions.length)}
          </div>
          <button
            onClick={resetQuiz}
            className="btn-primary text-lg px-8 py-3"
          >
            🔄 Nuevo {quizMode === 'practice' ? 'Ejercicio' : 'Examen'}
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
                  <h4 className="font-semibold flex-1">
                    <span className="text-gray-500">#{index + 1}</span> {question.question}
                  </h4>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}>
                    {isCorrect ? '✅ Correcta' : '❌ Incorrecta'}
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className={`p-3 rounded-lg border ${
                      optionIndex === question.correct ? 'bg-green-100 border-green-300' :
                      optionIndex === userAnswer && !isCorrect ? 'bg-red-100 border-red-300' :
                      'bg-gray-50 border-gray-200'
                    }`}>
                      <span className={`font-bold mr-3 ${
                        optionIndex === question.correct ? 'text-green-700' :
                        optionIndex === userAnswer && !isCorrect ? 'text-red-700' :
                        'text-gray-600'
                      }`}>
                        {String.fromCharCode(65 + optionIndex)}. 
                      </span>
                      <span className={optionIndex === question.correct ? 'text-green-700 font-semibold' : ''}>
                        {option}
                      </span>
                      {optionIndex === question.correct && (
                        <span className="ml-2 text-green-600 font-semibold">← Respuesta correcta</span>
                      )}
                      {optionIndex === userAnswer && !isCorrect && (
                        <span className="ml-2 text-red-600 font-semibold">← Tu respuesta</span>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="font-semibold text-blue-800 mb-2">💡 Explicación:</div>
                  <div className="text-blue-700">{question.explanation}</div>
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
      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
        <div>
          <h2 className="text-xl font-semibold">
            {quizMode === 'practice' ? '📚 Ejercicio de Práctica' : '🎯 Examen'}
          </h2>
          <p className="text-sm text-gray-600">
            Pregunta generada dinámicamente • {currentQ?.generated ? '🎲 Única' : '📝 Estática'}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {quizMode === 'exam' && (
            <div className="text-lg font-mono text-red-600 bg-red-50 px-3 py-1 rounded">
              ⏱️ {formatTime(timeLeft)}
            </div>
          )}
          <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded">
            {currentQuestion + 1} de {questions.length}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className={`text-sm px-3 py-1 rounded-full ${
              currentQ?.type === 'conversion' ? 'bg-blue-100 text-blue-800' :
              currentQ?.type === 'theory' ? 'bg-purple-100 text-purple-800' :
              'bg-orange-100 text-orange-800'
            }`}>
              {currentQ?.type === 'conversion' ? '🔄 Conversión' :
               currentQ?.type === 'theory' ? '📚 Teoría' :
               '💡 Aplicación'}
            </span>
            <span className={`text-sm px-3 py-1 rounded-full ${
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

        <div className="space-y-3 mb-6">
          {currentQ?.options.map((option, index) => (
            <label key={index} className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
              userAnswer === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
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

        {currentQ?.hint && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
            <div className="text-sm text-yellow-800">
              <strong>💡 Pista:</strong> {currentQ.hint}
            </div>
          </div>
        )}

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

      {/* Barra de progreso mejorada */}
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
      </div>
    </div>
  )
}

export default QuizSystem