import { useState, useEffect } from 'react'

const Examen = () => {
  // Estados principales (mismo patrón que EvaluacionModulo)
  const [examState, setExamState] = useState('intro') // 'intro', 'active', 'results'
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [questions, setQuestions] = useState([])
  const [timeLeft, setTimeLeft] = useState(600) 
  const [score, setScore] = useState(0)
  const [generatingQuestions, setGeneratingQuestions] = useState(false)

  // Banco de preguntas 
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

  // TEMPORIZADOR 
  useEffect(() => {
    if (examState === 'active' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            finalizarExamen()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [examState, timeLeft])

  // GENERAR EXAMEN (adaptado del código original)
  const generarExamen = () => {
    setGeneratingQuestions(true)
    
    setTimeout(() => {
      const questions = []
      const usedQuestions = new Set()
      const count = 10 // Siempre 10 preguntas en modo examen
      const difficulties = ['easy', 'easy', 'medium', 'medium', 'medium', 'hard', 'hard', 'hard', 'hard', 'hard']
      const categories = Object.keys(questionBank)
      
      let attempts = 0
      const maxAttempts = count * 5
      
      while (questions.length < count && attempts < maxAttempts) {
        const questionIndex = questions.length
        const category = categories[Math.floor(Math.random() * categories.length)]
        const difficulty = difficulties[questionIndex % difficulties.length] || 'medium'
        
        const availableQuestions = questionBank[category][difficulty] || questionBank[category]['easy'] || []
        
        if (availableQuestions.length === 0) {
          attempts++
          continue
        }
        
        const questionTemplate = availableQuestions[Math.floor(Math.random() * availableQuestions.length)]
        const questionKey = `${category}-${difficulty}-${questionTemplate.question}-${Math.floor(attempts/10)}`
        
        if (usedQuestions.has(questionKey) && attempts < maxAttempts * 0.8) {
          attempts++
          continue
        }
        
        usedQuestions.add(questionKey)
  const generatedQuestion = crearPreguntaDesdeTemplate(questionTemplate, category, difficulty, questions.length + 1)
        
        if (generatedQuestion) {
          questions.push(generatedQuestion)
        }
        
        attempts++
      }
      
      // Rellenar con preguntas fallback si es necesario
      while (questions.length < count) {
        const missingIndex = questions.length
  const fallbackQuestion = crearPreguntaFallback(missingIndex + 1)
        questions.push(fallbackQuestion)
      }
      
  console.log(`Examen generado: ${questions.length} preguntas`)
      
      setQuestions(questions.slice(0, count))
      setGeneratingQuestions(false)
      setExamState('active')
      setTimeLeft(600) // Reiniciar tiempo
    }, 1500)
  }

  // CREAR PREGUNTA DESDE TEMPLATE (mantenido sin cambios)
  const crearPreguntaDesdeTemplate = (template, category, difficulty, id) => {
    let questionData
    
    if (template.question.includes('{number}')) {
      const num = Math.floor(Math.random() * 50) + 10
      questionData = template.generator(num)
      questionData.question = template.question.replace('{number}', num)
    }
    else if (template.question.includes('{binary}')) {
      const num = Math.floor(Math.random() * 31) + 1
      questionData = template.generator(num)
      questionData.question = template.question.replace('{binary}', num.toString(2))
    }
    else if (template.question.includes('{hex}')) {
      const num = Math.floor(Math.random() * 255) + 16
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

  const crearPreguntaFallback = (id) => {
    const num = Math.floor(Math.random() * 30) + 10
    
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

  // FUNCIONES DE CONTROL
  const manejarSeleccionRespuesta = (questionId, answerIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const siguientePregunta = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const anteriorPregunta = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const finalizarExamen = () => {
    const answeredCount = Object.keys(userAnswers).length
    if (answeredCount < questions.length) {
      alert(`Debes responder todas las preguntas antes de finalizar. Te faltan ${questions.length - answeredCount} pregunta(s).`)
      return // No permite finalizar
    }
    let correctAnswers = 0
    questions.forEach(question => {
      if (userAnswers[question.id] === question.correct) {
        correctAnswers++
      }
    })
    
    setScore(correctAnswers)
    setExamState('results')
  }

  const reiniciarExamen = () => {
    setExamState('intro')
    setCurrentQuestion(0)
    setUserAnswers({})
    setQuestions([])
    setScore(0)
    setTimeLeft(600)
  }

  const formatearTiempo = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const obtenerColorPuntaje = (score, total) => {
    const percentage = (score / total) * 100
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const obtenerMensajePuntaje = (score, total) => {
    const percentage = (score / total) * 100
    if (percentage >= 90) return '¡Excelente! Dominas perfectamente los sistemas numéricos.'
    if (percentage >= 80) return '¡Muy bien! Tienes un buen dominio del tema.'
    if (percentage >= 60) return 'Bien, pero puedes mejorar. Revisa los conceptos básicos.'
    return 'Necesitas estudiar más. Te recomendamos repasar la teoría.'
  }

  // 🔄 PANTALLA DE CARGA
  if (generatingQuestions) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl"></span>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Generando Examen</h3>
        <p className="text-sm text-gray-500 text-center max-w-md">
          Creando preguntas sobre sistemas numéricos...
        </p>
      </div>
    )
  }

  // 📝 PANTALLA DE INTRODUCCIÓN (diseño del Módulo 2)
  if (examState === 'intro') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Evaluación del Módulo</h1>
          <p className="text-lg text-gray-600">
            Sistemas Numéricos y Conversión de Bases
          </p>
        </div>

        <div className="bg-white border-2 border-blue-200 rounded-lg p-8 shadow-lg mb-6">
          <div className="flex items-start space-x-4 mb-6">
            <div className="text-4xl"></div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Sobre este Examen</h2>
              <p className="text-gray-700 mb-4">
                En este examen podrás <strong>repasar lo visto en el módulo</strong> a través de preguntas 
                sobre conversión de bases, sistemas numéricos y sus aplicaciones.
              </p>
              <p className="text-gray-700">
                Recuerda que tendrás un <strong>tiempo límite</strong> para responder. Una vez finalices, 
                recibirás retroalimentación detallada con tus resultados.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-3">Características del Examen</h3>
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
                <span><strong>Dificultad progresiva</strong> según los temas del módulo</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span><strong>Retroalimentación sobre el examen</strong> al finalizar</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>Navegación <strong>libre entre preguntas</strong></span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span><strong>Explicaciones detalladas</strong> de cada respuesta</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <h3 className="font-semibold text-yellow-900 mb-2">Recomendaciones</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Asegúrate de tener una conexión estable a internet</li>
              <li>• Busca un lugar tranquilo sin distracciones</li>
              <li>• Lee cuidadosamente cada pregunta antes de responder</li>
              <li>• Administra bien tu tiempo: tienes 1 minuto por pregunta aproximadamente</li>
              <li>• Puedes revisar y cambiar tus respuestas antes de finalizar</li>
            </ul>
          </div>

          <button
            onClick={generarExamen}
            className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold text-lg shadow-md"
          >
            Comenzar Examen
          </button>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-blue-600"></span>
              <span className="text-gray-700">Conversión entre bases (binario, octal, decimal, hexadecimal)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-purple-600"></span>
              <span className="text-gray-700">Teoría de sistemas numéricos</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-600"></span>
              <span className="text-gray-700">Aplicaciones prácticas en computación</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-orange-600"></span>
              <span className="text-gray-700">Operaciones aritméticas en diferentes bases</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 🎮 PANTALLA DE EXAMEN ACTIVO (diseño del Módulo 2)
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
              <span className="font-mono text-xl font-bold">{formatearTiempo(timeLeft)}</span>
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
                  currentQ?.type === 'conversion' ? 'bg-blue-100 text-blue-800' :
                  currentQ?.type === 'theory' ? 'bg-purple-100 text-purple-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {currentQ?.type === 'conversion' ? '🔄 Conversión' :
                   currentQ?.type === 'theory' ? '📚 Teoría' : '💡 Aplicación'}
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
                onClick={() => manejarSeleccionRespuesta(currentQ.id, index)}
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

          {/* Pista */}
          {currentQ?.hint && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="text-sm text-yellow-800">
                <strong>💡 Pista:</strong> {currentQ.hint}
              </div>
            </div>
          )}
        </div>

        {/* Navegación */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={anteriorPregunta}
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
            onClick={currentQuestion === questions.length - 1 ? finalizarExamen : siguientePregunta}
            disabled={userAnswer === undefined && currentQuestion === questions.length - 1}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {currentQuestion === questions.length - 1 ? 'Finalizar' : 'Siguiente'}
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

  // 📊 PANTALLA DE RESULTADOS (diseño del Módulo 2)
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
            <div className="text-7xl mb-4"></div>
            <div className={`text-5xl font-bold mb-2 ${obtenerColorPuntaje(score, questions.length)}`}>
              {score}/{questions.length}
            </div>
            <div className="text-2xl text-gray-600 mb-4">
              {percentage.toFixed(1)}% de aciertos
            </div>
            <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
              {obtenerMensajePuntaje(score, questions.length)}
            </p>
            
            <button
              onClick={reiniciarExamen}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg shadow-md"
            >
              Realizar Nuevo Examen
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
                          question.type === 'conversion' ? 'bg-blue-100 text-blue-800' :
                          question.type === 'theory' ? 'bg-purple-100 text-purple-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {question.type === 'conversion' ? 'Conversión' :
                           question.type === 'theory' ? 'Teoría' : 'Aplicación'}
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
                    <div className="font-semibold text-blue-800 mb-2">Explicación:</div>
                    <div className="text-blue-700">{question.explanation}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={reiniciarExamen}
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

export default Examen