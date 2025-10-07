import { useState, useEffect } from 'react'

// ================================
// GENERADOR DE PREGUNTAS BOOLEANAS
// ================================
class BooleanQuestionGenerator {
  constructor() {
    this.userProfile = this.loadUserProfile()
    this.questionHistory = this.loadQuestionHistlory()
    this.performanceAnalyzer = new BooleanPerformanceAnalyzer()
  }

  generateAdaptiveExam(mode, count = 8) {
    const userLevel = this.determineUserLevel()
    const weakAreas = this.identifyWeakAreas()

    console.log('🎯 Generando examen adaptativo:', { userLevel, weakAreas, mode })

    return this.createPersonalizedQuestions(mode, count, {
      level: userLevel,
      focusAreas: weakAreas
    })
  }

  determineUserLevel() {
    const stats = this.userProfile.stats
    if (stats.totalExams < 2) return 'beginner'
    if (stats.averageScore > 85) return 'advanced'
    if (stats.averageScore > 70) return 'intermediate'
    return 'beginner'
  }

  identifyWeakAreas() {
    const performance = this.userProfile.performance
    const weakAreas = []

    Object.entries(performance).forEach(([area, score]) => {
      if (score < 70) weakAreas.push(area)
    })

    return weakAreas.length > 0 ? weakAreas : ['laws']
  }

  createPersonalizedQuestions(mode, count, profile) {
    const questions = []
    const difficultyDistribution = this.getDifficultyDistribution(mode, profile.level)
    const usedQuestions = new Set()

    for (let i = 0; i < count; i++) {
      const difficulty = difficultyDistribution[i % difficultyDistribution.length]
      const questionType = this.selectQuestionType(profile.focusAreas, i)
      
      let attempts = 0
      let question = null
      
      while (!question && attempts < 10) {
        question = this.generateSpecificQuestion(questionType, difficulty, i)
        const questionKey = `${question.question}-${question.options[0]}`
        
        if (!usedQuestions.has(questionKey)) {
          questions.push(question)
          usedQuestions.add(questionKey)
          break
        }
        attempts++
      }
    }

    this.updateQuestionHistory(questions)
    return questions
  }

  getDifficultyDistribution(mode, userLevel) {
    const distributions = {
      beginner: {
        practice: ['easy', 'easy', 'easy', 'medium', 'medium'],
        exam: ['easy', 'easy', 'easy', 'medium', 'medium', 'medium', 'hard', 'hard']
      },
      intermediate: {
        practice: ['easy', 'medium', 'medium', 'medium', 'hard'],
        exam: ['easy', 'medium', 'medium', 'medium', 'hard', 'hard', 'hard', 'hard']
      },
      advanced: {
        practice: ['medium', 'medium', 'hard', 'hard', 'hard'],
        exam: ['medium', 'medium', 'hard', 'hard', 'hard', 'hard', 'hard', 'hard']
      }
    }

    return distributions[userLevel][mode] || distributions.intermediate[mode]
  }

  selectQuestionType(focusAreas, index) {
    const types = ['laws', 'simplification', 'canonical', 'karnaugh', 'application']
    
    if (focusAreas.length === 0) {
      return types[index % types.length]
    }

    return Math.random() < 0.6 
      ? focusAreas[Math.floor(Math.random() * focusAreas.length)]
      : types[Math.floor(Math.random() * types.length)]
  }

  generateSpecificQuestion(type, difficulty, id) {
    const generators = {
      laws: this.generateLawsQuestion,
      simplification: this.generateSimplificationQuestion,
      canonical: this.generateCanonicalQuestion,
      karnaugh: this.generateKarnaughQuestion,
      application: this.generateApplicationQuestion
    }

    const generator = generators[type] || generators.laws
    return generator.call(this, difficulty, id)
  }

  // ==========================================
  // GENERADOR DE PREGUNTAS SOBRE LEYES
  // ==========================================
  generateLawsQuestion(difficulty, id) {
    const templates = {
      easy: [
        {
          generator: () => {
            const laws = [
              { expression: 'A · 1', result: 'A', law: 'Identidad' },
              { expression: 'A + 0', result: 'A', law: 'Identidad' },
              { expression: 'A · 0', result: '0', law: 'Anulación' },
              { expression: 'A + 1', result: '1', law: 'Anulación' },
              { expression: 'A + A', result: 'A', law: 'Idempotencia' },
              { expression: 'A · A', result: 'A', law: 'Idempotencia' }
            ]
            const law = laws[Math.floor(Math.random() * laws.length)]
            
            return {
              question: `¿A qué se simplifica "${law.expression}"?`,
              options: this.shuffleWithCorrect([law.result, 'B', 'NOT A', law.expression]),
              explanation: `Por la ley de ${law.law}: ${law.expression} = ${law.result}`,
              hint: `Aplica la ley de ${law.law}`
            }
          }
        },
        {
          generator: () => {
            const laws = [
              { name: 'Identidad AND', expression: 'A · 1 = A' },
              { name: 'Identidad OR', expression: 'A + 0 = A' },
              { name: 'Anulación AND', expression: 'A · 0 = 0' },
              { name: 'Anulación OR', expression: 'A + 1 = 1' }
            ]
            const law = laws[Math.floor(Math.random() * laws.length)]
            const wrongLaws = laws.filter(l => l.name !== law.name)
            
            return {
              question: `¿Cuál de estas expresiones representa la ley de ${law.name}?`,
              options: this.shuffleWithCorrect([
                law.expression,
                wrongLaws[0].expression,
                wrongLaws[1].expression,
                'A + A = 2A'
              ]),
              explanation: `La ley de ${law.name} se expresa como: ${law.expression}`,
              hint: 'Recuerda los elementos neutros de cada operación'
            }
          }
        }
      ],
      medium: [
        {
          generator: () => {
            const demorganLaws = [
              { original: '(A · B)\'', result: 'A\' + B\'', law: 'Segunda Ley de De Morgan' },
              { original: '(A + B)\'', result: 'A\' · B\'', law: 'Primera Ley de De Morgan' }
            ]
            const law = demorganLaws[Math.floor(Math.random() * demorganLaws.length)]
            
            return {
              question: `Según las leyes de De Morgan, "${law.original}" es equivalente a:`,
              options: this.shuffleWithCorrect([
                law.result,
                law.original,
                'A · B',
                'A + B'
              ]),
              explanation: `${law.law}: ${law.original} = ${law.result}`,
              hint: 'La negación convierte AND en OR y viceversa, negando cada término'
            }
          }
        },
        {
          generator: () => {
            const absorption = [
              { expression: 'A + A·B', result: 'A', explanation: 'A absorbe el término que lo contiene' },
              { expression: 'A·(A + B)', result: 'A', explanation: 'A absorbe el término que lo contiene' }
            ]
            const law = absorption[Math.floor(Math.random() * absorption.length)]
            
            return {
              question: `Simplifica usando la ley de Absorción: ${law.expression}`,
              options: this.shuffleWithCorrect([law.result, 'B', 'A + B', 'A · B']),
              explanation: `Por Absorción: ${law.expression} = ${law.result}. ${law.explanation}`,
              hint: 'El término más simple absorbe al más complejo'
            }
          }
        }
      ],
      hard: [
        {
          generator: () => {
            const problems = [
              { 
                original: 'A + A\'·B', 
                simplified: 'A + B',
                steps: 'Factoriza: (A + A\')·(A + B) = 1·(A + B) = A + B'
              },
              { 
                original: '(A·B) + (A·B\') + (A\'·B)',
                simplified: 'A + B',
                steps: 'Factoriza A de los primeros dos: A(B + B\') + A\'·B = A + A\'·B = A + B'
              }
            ]
            const problem = problems[Math.floor(Math.random() * problems.length)]
            
            return {
              question: `¿Cuál es la forma más simplificada de "${problem.original}"?`,
              options: this.shuffleWithCorrect([
                problem.simplified,
                'A · B',
                problem.original,
                'A\' + B\''
              ]),
              explanation: `${problem.steps}. Resultado: ${problem.simplified}`,
              hint: 'Usa factorización, complemento y absorción'
            }
          }
        }
      ]
    }

    const difficultyTemplates = templates[difficulty] || templates.easy
    const template = difficultyTemplates[Math.floor(Math.random() * difficultyTemplates.length)]
    const questionData = template.generator()

    return {
      id: `q-${Date.now()}-${id}-${Math.random()}`,
      type: 'laws',
      difficulty,
      ...questionData,
      timestamp: new Date().toISOString()
    }
  }

  // ==========================================
  // GENERADOR DE PREGUNTAS DE SIMPLIFICACIÓN
  // ==========================================
  generateSimplificationQuestion(difficulty, id) {
    const templates = {
      easy: [
        {
          generator: () => {
            const expressions = [
              { original: 'A · A\'', result: '0', law: 'Complemento' },
              { original: 'A + A\'', result: '1', law: 'Complemento' },
              { original: '(A\')\'', result: 'A', law: 'Doble negación' }
            ]
            const expr = expressions[Math.floor(Math.random() * expressions.length)]
            
            return {
              question: `Simplifica: ${expr.original}`,
              options: this.shuffleWithCorrect([expr.result, 'A', 'B', expr.original]),
              explanation: `Por la ley del ${expr.law}: ${expr.original} = ${expr.result}`,
              hint: `Aplica ${expr.law}`
            }
          }
        }
      ],
      medium: [
        {
          generator: () => {
            const problems = [
              { expr: 'A·B + A·B\'', result: 'A', hint: 'Factoriza A' },
              { expr: 'A + A·B', result: 'A', hint: 'Absorción' },
              { expr: '(A + B)·(A + B\')', result: 'A', hint: 'Distributiva + Complemento' }
            ]
            const problem = problems[Math.floor(Math.random() * problems.length)]
            
            return {
              question: `¿Cuál es la forma simplificada de "${problem.expr}"?`,
              options: this.shuffleWithCorrect([problem.result, 'B', 'A + B', 'A · B']),
              explanation: `${problem.expr} se simplifica a ${problem.result}`,
              hint: problem.hint
            }
          }
        }
      ],
      hard: [
        {
          generator: () => {
            const complex = [
              { 
                expr: 'A\'·B·C + A·B·C + A·B\'·C',
                result: 'B·C + A·B\'·C',
                explanation: 'Factoriza B·C de los primeros dos términos'
              },
              {
                expr: '(A + B)·(A\' + C)·(B + C)',
                result: '(A + B)·(A\' + C)',
                explanation: 'El término (B + C) es redundante por consenso'
              }
            ]
            const problem = complex[Math.floor(Math.random() * complex.length)]
            
            return {
              question: `Simplifica la expresión compleja: ${problem.expr}`,
              options: this.shuffleWithCorrect([
                problem.result,
                'A + B + C',
                problem.expr,
                'A · B · C'
              ]),
              explanation: problem.explanation,
              hint: 'Usa factorización y teorema de consenso'
            }
          }
        }
      ]
    }

    const difficultyTemplates = templates[difficulty] || templates.easy
    const template = difficultyTemplates[Math.floor(Math.random() * difficultyTemplates.length)]
    const questionData = template.generator()

    return {
      id: `q-${Date.now()}-${id}-${Math.random()}`,
      type: 'simplification',
      difficulty,
      ...questionData,
      timestamp: new Date().toISOString()
    }
  }

  // ==========================================
  // GENERADOR DE PREGUNTAS SOBRE FORMAS CANÓNICAS
  // ==========================================
  generateCanonicalQuestion(difficulty, id) {
    const templates = {
      easy: [
        {
          generator: () => {
            return {
              question: '¿Qué significa SOP (Sum of Products)?',
              options: this.shuffleWithCorrect([
                'Suma de productos (OR de términos AND)',
                'Producto de sumas (AND de términos OR)',
                'Suma de potencias',
                'Sistema de operaciones'
              ]),
              explanation: 'SOP = Suma de Productos = OR de minterms (términos AND)',
              hint: 'Piensa en la estructura: suma (+) de productos (·)'
            }
          }
        },
        {
          generator: () => {
            return {
              question: 'En una tabla de verdad, ¿cuándo usamos SOP (minterms)?',
              options: this.shuffleWithCorrect([
                'Cuando tomamos las filas donde la salida es 1',
                'Cuando tomamos las filas donde la salida es 0',
                'Cuando sumamos todas las filas',
                'Cuando multiplicamos todas las entradas'
              ]),
              explanation: 'SOP se forma con los minterms (filas con salida = 1)',
              hint: 'SOP representa los casos verdaderos'
            }
          }
        }
      ],
      medium: [
        {
          generator: () => {
            const table = [
              { a: 0, b: 0, f: 0 },
              { a: 0, b: 1, f: 1 },
              { a: 1, b: 0, f: 1 },
              { a: 1, b: 1, f: 0 }
            ]
            const minterms = [1, 2]
            const sop = 'A\'·B + A·B\''
            
            return {
              question: 'Dada una tabla con salida 1 en las filas 1 y 2, ¿cuál es la forma SOP?',
              options: this.shuffleWithCorrect([
                sop,
                'A·B + A\'·B\'',
                'A + B',
                '(A + B)·(A\' + B\')'
              ]),
              explanation: `Los minterms ${minterms.join(', ')} dan: ${sop}`,
              hint: 'Escribe los productos donde la salida es 1'
            }
          }
        }
      ],
      hard: [
        {
          generator: () => {
            return {
              question: '¿Cuál es la diferencia principal entre SOP y POS?',
              options: this.shuffleWithCorrect([
                'SOP usa filas con salida 1, POS usa filas con salida 0',
                'SOP es más rápida que POS',
                'POS solo funciona con 2 variables',
                'SOP y POS son equivalentes siempre'
              ]),
              explanation: 'SOP se basa en minterms (1s), POS en maxterms (0s)',
              hint: 'Piensa en qué filas de la tabla usa cada forma'
            }
          }
        }
      ]
    }

    const difficultyTemplates = templates[difficulty] || templates.easy
    const template = difficultyTemplates[Math.floor(Math.random() * difficultyTemplates.length)]
    const questionData = template.generator()

    return {
      id: `q-${Date.now()}-${id}-${Math.random()}`,
      type: 'canonical',
      difficulty,
      ...questionData,
      timestamp: new Date().toISOString()
    }
  }

  // ==========================================
  // GENERADOR DE PREGUNTAS SOBRE KARNAUGH
  // ==========================================
  generateKarnaughQuestion(difficulty, id) {
    const templates = {
      easy: [
        {
          generator: () => {
            return {
              question: '¿Qué característica tiene el código Gray usado en mapas de Karnaugh?',
              options: this.shuffleWithCorrect([
                'Solo cambia un bit entre valores adyacentes',
                'Usa orden binario normal',
                'Siempre empieza en 1',
                'No usa el número 2'
              ]),
              explanation: 'El código Gray cambia solo 1 bit entre celdas vecinas, permitiendo agrupar adyacentes',
              hint: 'Piensa en la secuencia: 00, 01, 11, 10'
            }
          }
        },
        {
          generator: () => {
            return {
              question: 'En un mapa de Karnaugh, los grupos deben tener tamaño:',
              options: this.shuffleWithCorrect([
                'Potencia de 2 (1, 2, 4, 8...)',
                'Cualquier tamaño',
                'Solo números pares',
                'Siempre 4 celdas'
              ]),
              explanation: 'Los grupos deben ser potencias de 2 para simplificación correcta',
              hint: '1, 2, 4, 8, 16... son potencias de 2'
            }
          }
        }
      ],
      medium: [
        {
          generator: () => {
            return {
              question: 'Si agrupas 4 celdas en un K-map de 3 variables, ¿cuántas variables eliminas?',
              options: this.shuffleWithCorrect([
                '2 variables',
                '1 variable',
                '3 variables',
                'Ninguna variable'
              ]),
              explanation: 'Grupo de 4 celdas = 2² → eliminas 2 variables, quedando 1',
              hint: '2^n celdas = n variables eliminadas'
            }
          }
        }
      ],
      hard: [
        {
          generator: () => {
            return {
              question: 'En un mapa de Karnaugh, ¿qué significa que los grupos puedan "envolver" los bordes?',
              options: this.shuffleWithCorrect([
                'Las celdas en los extremos son adyacentes (topología toroidal)',
                'Se pueden superponer grupos',
                'Los bordes no cuentan',
                'Solo aplica para mapas de 4 variables'
              ]),
              explanation: 'El mapa es topológicamente un toro: los bordes opuestos se conectan',
              hint: 'Imagina que el mapa se enrolla como un cilindro'
            }
          }
        }
      ]
    }

    const difficultyTemplates = templates[difficulty] || templates.easy
    const template = difficultyTemplates[Math.floor(Math.random() * difficultyTemplates.length)]
    const questionData = template.generator()

    return {
      id: `q-${Date.now()}-${id}-${Math.random()}`,
      type: 'karnaugh',
      difficulty,
      ...questionData,
      timestamp: new Date().toISOString()
    }
  }

  // ==========================================
  // GENERADOR DE PREGUNTAS DE APLICACIÓN
  // ==========================================
  generateApplicationQuestion(difficulty, id) {
    const templates = {
      easy: [
        {
          generator: () => {
            return {
              question: 'Un sistema de alarma se activa si hay movimiento Y la puerta está abierta. ¿Qué operación lógica es?',
              options: this.shuffleWithCorrect([
                'AND (ambas condiciones deben cumplirse)',
                'OR (cualquier condición activa)',
                'XOR (solo una condición)',
                'NOT (inversión)'
              ]),
              explanation: 'AND requiere que todas las condiciones sean verdaderas simultáneamente',
              hint: 'Ambas condiciones deben ser verdaderas'
            }
          }
        }
      ],
      medium: [
        {
          generator: () => {
            return {
              question: 'Para implementar XOR usando solo compuertas NAND, ¿cuántas necesitas mínimo?',
              options: this.shuffleWithCorrect([
                '4 compuertas NAND',
                '2 compuertas NAND',
                '3 compuertas NAND',
                '5 compuertas NAND'
              ]),
              explanation: 'XOR con NAND requiere 4 compuertas: NAND es universalmente completa',
              hint: 'NAND puede implementar cualquier función, pero XOR es compleja'
            }
          }
        }
      ],
      hard: [
        {
          generator: () => {
            return {
              question: 'Un sumador completo (Full Adder) implementa internamente:',
              options: this.shuffleWithCorrect([
                'Dos XOR, dos AND y un OR',
                'Solo compuertas AND',
                'Un multiplexor 4:1',
                'Tres compuertas NAND'
              ]),
              explanation: 'Full Adder: SUMA = A⊕B⊕Cin, CARRY = AB + ACin + BCin',
              hint: 'Necesita detectar igualdad (XOR) y condiciones de acarreo (AND/OR)'
            }
          }
        }
      ]
    }

    const difficultyTemplates = templates[difficulty] || templates.easy
    const template = difficultyTemplates[Math.floor(Math.random() * difficultyTemplates.length)]
    const questionData = template.generator()

    return {
      id: `q-${Date.now()}-${id}-${Math.random()}`,
      type: 'application',
      difficulty,
      ...questionData,
      timestamp: new Date().toISOString()
    }
  }

  // UTILIDADES
  shuffleWithCorrect(options) {
    const correct = options[0]
    const shuffled = [...options].sort(() => Math.random() - 0.5)
    return {
      options: shuffled,
      correct: shuffled.indexOf(correct)
    }
  }

  // PERSISTENCIA
  loadUserProfile() {
    const defaultProfile = {
      stats: { totalExams: 0, averageScore: 0 },
      performance: { laws: 50, simplification: 50, canonical: 50, karnaugh: 50, application: 50 },
      preferences: { difficulty: 'medium' }
    }
    return JSON.parse(localStorage.getItem('booleanUserProfile') || JSON.stringify(defaultProfile))
  }

  updateUserProfile(examResults) {
    this.userProfile.stats.totalExams++
    const newAvg = (this.userProfile.stats.averageScore + examResults.scorePercentage) / 2
    this.userProfile.stats.averageScore = Math.round(newAvg)

    examResults.questions.forEach(q => {
      const isCorrect = examResults.userAnswers[q.id] === q.correct
      const currentPerf = this.userProfile.performance[q.type] || 50
      
      this.userProfile.performance[q.type] = isCorrect 
        ? Math.min(100, currentPerf + 5)
        : Math.max(0, currentPerf - 3)
    })

    localStorage.setItem('booleanUserProfile', JSON.stringify(this.userProfile))
  }

  loadQuestionHistory() {
    return JSON.parse(localStorage.getItem('booleanQuestionHistory') || '[]')
  }

  updateQuestionHistory(questions) {
    this.questionHistory.push(...questions.map(q => ({ id: q.id, type: q.type })))
    if (this.questionHistory.length > 100) {
      this.questionHistory = this.questionHistory.slice(-100)
    }
    localStorage.setItem('booleanQuestionHistory', JSON.stringify(this.questionHistory))
  }
}

// ================================
// ANALIZADOR DE RENDIMIENTO
// ================================
class BooleanPerformanceAnalyzer {
  analyzeExamResults(questions, userAnswers) {
    const analysis = {
      totalQuestions: questions.length,
      correctAnswers: 0,
      byType: {},
      byDifficulty: {},
      strongAreas: [],
      improvementAreas: []
    }

    questions.forEach(question => {
      const isCorrect = userAnswers[question.id] === question.correct
      
      if (isCorrect) analysis.correctAnswers++

      if (!analysis.byType[question.type]) {
        analysis.byType[question.type] = { correct: 0, total: 0 }
      }
      analysis.byType[question.type].total++
      if (isCorrect) analysis.byType[question.type].correct++

      if (!analysis.byDifficulty[question.difficulty]) {
        analysis.byDifficulty[question.difficulty] = { correct: 0, total: 0 }
      }
      analysis.byDifficulty[question.difficulty].total++
      if (isCorrect) analysis.byDifficulty[question.difficulty].correct++
    })

    Object.entries(analysis.byType).forEach(([type, stats]) => {
      const percentage = (stats.correct / stats.total) * 100
      if (percentage >= 80) {
        analysis.strongAreas.push({ area: type, percentage })
      } else if (percentage < 60) {
        analysis.improvementAreas.push({ area: type, percentage })
      }
    })

    return analysis
  }
}

// ================================
// COMPONENTE PRINCIPAL DEL EXAMEN
// ================================
function BooleanExamModule({ onExamComplete, userProgress }) {
  const generator = new BooleanQuestionGenerator()
  
  const [examState, setExamState] = useState('start') // start, active, review, finished
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [results, setResults] = useState(null)
  const [showHint, setShowHint] = useState({})

  // Timer
  useEffect(() => {
    let interval
    if (timerActive) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timerActive])

  const startExam = (questionCount = 8) => {
    const newQuestions = generator.generateAdaptiveExam('exam', questionCount)
    setQuestions(newQuestions)
    setCurrentQuestionIndex(0)
    setUserAnswers({})
    setTimeElapsed(0)
    setTimerActive(true)
    setExamState('active')
    setShowHint({})
  }

  const handleAnswer = (questionId, answerIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const toggleHint = (questionId) => {
    setShowHint(prev => ({ ...prev, [questionId]: !prev[questionId] }))
  }

  const finishExam = () => {
    setTimerActive(false)
    
    const correctCount = questions.filter(q => userAnswers[q.id] === q.correct).length
    const scorePercentage = (correctCount / questions.length) * 100
    const grade = (scorePercentage / 100) * 5
    
    const analysis = generator.performanceAnalyzer.analyzeExamResults(questions, userAnswers)
    
    const examResults = {
      questions,
      userAnswers,
      correctCount,
      totalQuestions: questions.length,
      scorePercentage,
      grade: grade.toFixed(2),
      timeElapsed,
      analysis,
      timestamp: new Date().toISOString()
    }
    
    setResults(examResults)
    setExamState('review')
    
    generator.updateUserProfile(examResults)
    
    if (onExamComplete) {
      onExamComplete(examResults)
    }
  }

  const restartExam = () => {
    setExamState('start')
    setQuestions([])
    setUserAnswers({})
    setTimeElapsed(0)
    setResults(null)
    setShowHint({})
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getTypeLabel = (type) => {
    const labels = {
      laws: 'Leyes Booleanas',
      simplification: 'Simplificación',
      canonical: 'Formas Canónicas',
      karnaugh: 'Mapas de Karnaugh',
      application: 'Aplicaciones'
    }
    return labels[type] || type
  }

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    }
    return colors[difficulty] || colors.medium
  }

  // PANTALLA DE INICIO
  if (examState === 'start') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white">
              <h1 className="text-4xl font-bold mb-2">📝 Examen de Álgebra Booleana</h1>
              <p className="text-emerald-100">Evalúa tu comprensión sobre simplificación y análisis lógico</p>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-emerald-50 p-6 rounded-lg border-l-4 border-emerald-600">
                  <h3 className="font-semibold text-emerald-900 mb-3">📚 Temas Evaluados</h3>
                  <ul className="space-y-2 text-sm text-emerald-800">
                    <li>• Leyes y teoremas fundamentales</li>
                    <li>• Simplificación algebraica</li>
                    <li>• Formas canónicas (SOP/POS)</li>
                    <li>• Mapas de Karnaugh</li>
                    <li>• Aplicaciones prácticas</li>
                  </ul>
                </div>

                <div className="bg-teal-50 p-6 rounded-lg border-l-4 border-teal-600">
                  <h3 className="font-semibold text-teal-900 mb-3">⚙️ Características</h3>
                  <ul className="space-y-2 text-sm text-teal-800">
                    <li>• 8 preguntas adaptativas</li>
                    <li>• Dificultad progresiva</li>
                    <li>• Calificación sobre 5.0</li>
                    <li>• Retroalimentación detallada</li>
                    <li>• Análisis por áreas</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded">
                <h4 className="font-semibold text-yellow-900 mb-2">💡 Instrucciones</h4>
                <ul className="space-y-1 text-sm text-yellow-800">
                  <li>• Lee cada pregunta cuidadosamente</li>
                  <li>• Puedes usar pistas, pero afectan tu puntuación ligeramente</li>
                  <li>• Puedes navegar entre preguntas antes de finalizar</li>
                  <li>• El tiempo es referencial, no afecta la calificación</li>
                </ul>
              </div>

              <button
                onClick={() => startExam(8)}
                className="w-full px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all font-bold text-lg shadow-lg"
              >
                🚀 Comenzar Examen
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // PANTALLA DE EXAMEN ACTIVO
  if (examState === 'active' && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100
    const answered = Object.keys(userAnswers).length

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header con progreso */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-sm text-gray-500">Pregunta {currentQuestionIndex + 1} de {questions.length}</span>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(currentQuestion.difficulty)}`}>
                    {currentQuestion.difficulty === 'easy' ? 'Fácil' : currentQuestion.difficulty === 'medium' ? 'Media' : 'Difícil'}
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-800">
                    {getTypeLabel(currentQuestion.type)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">⏱️ {formatTime(timeElapsed)}</div>
                <div className="text-sm font-semibold text-emerald-600">
                  {answered}/{questions.length} respondidas
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Pregunta */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {currentQuestion.question}
            </h2>

            <div className="space-y-3 mb-6">
              {currentQuestion.options.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(currentQuestion.id, index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    userAnswers[currentQuestion.id] === index
                      ? 'border-emerald-600 bg-emerald-50'
                      : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      userAnswers[currentQuestion.id] === index
                        ? 'border-emerald-600 bg-emerald-600'
                        : 'border-gray-300'
                    }`}>
                      {userAnswers[currentQuestion.id] === index && (
                        <span className="text-white text-sm">✓</span>
                      )}
                    </div>
                    <span className="flex-1">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Pista */}
            <button
              onClick={() => toggleHint(currentQuestion.id)}
              className="text-sm text-yellow-600 hover:text-yellow-700 font-medium mb-4"
            >
              💡 {showHint[currentQuestion.id] ? 'Ocultar' : 'Ver'} pista
            </button>

            {showHint[currentQuestion.id] && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-6">
                <p className="text-sm text-yellow-800">{currentQuestion.hint}</p>
              </div>
            )}

            {/* Navegación */}
            <div className="flex justify-between items-center pt-6 border-t">
              <button
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  currentQuestionIndex === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                ← Anterior
              </button>

              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  onClick={finishExam}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all font-bold shadow-lg"
                >
                  ✓ Finalizar Examen
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all font-medium"
                >
                  Siguiente →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // PANTALLA DE REVISIÓN/RESULTADOS
  if (examState === 'review' && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Resultados generales */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white text-center">
              <h1 className="text-4xl font-bold mb-2">Examen Finalizado</h1>
              <div className="text-6xl font-bold my-4">{results.grade}</div>
              <p className="text-emerald-100 text-lg">de 5.0</p>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                <div className="bg-emerald-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-emerald-600">{results.correctCount}</div>
                  <div className="text-sm text-gray-600">Correctas</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-red-600">{results.totalQuestions - results.correctCount}</div>
                  <div className="text-sm text-gray-600">Incorrectas</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-600">{results.scorePercentage.toFixed(0)}%</div>
                  <div className="text-sm text-gray-600">Porcentaje</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-purple-600">{formatTime(results.timeElapsed)}</div>
                  <div className="text-sm text-gray-600">Tiempo</div>
                </div>
              </div>

              {/* Análisis por área */}
              {results.analysis && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Análisis por Área</h3>
                  <div className="space-y-3">
                    {Object.entries(results.analysis.byType).map(([type, stats]) => {
                      const percentage = (stats.correct / stats.total) * 100
                      return (
                        <div key={type} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{getTypeLabel(type)}</span>
                            <span className="text-sm">{stats.correct}/{stats.total} correctas ({percentage.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${percentage >= 70 ? 'bg-emerald-600' : 'bg-red-600'}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Revisión de preguntas */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Revisión Detallada</h3>
                <div className="space-y-4">
                  {results.questions.map((question, index) => {
                    const userAnswer = results.userAnswers[question.id]
                    const isCorrect = userAnswer === question.correct
                    
                    return (
                      <div key={question.id} className={`border-2 rounded-lg p-6 ${
                        isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                      }`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-semibold">Pregunta {index + 1}</span>
                              <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(question.difficulty)}`}>
                                {question.difficulty === 'easy' ? 'Fácil' : question.difficulty === 'medium' ? 'Media' : 'Difícil'}
                              </span>
                              <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700">
                                {getTypeLabel(question.type)}
                              </span>
                            </div>
                            <p className="text-gray-900 mb-3">{question.question}</p>
                          </div>
                          <div className={`text-2xl ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                            {isCorrect ? '✓' : '✗'}
                          </div>
                        </div>

                        <div className="space-y-2 mb-3">
                          {question.options.options.map((option, optIndex) => {
                            const isUserAnswer = userAnswer === optIndex
                            const isCorrectAnswer = question.correct === optIndex
                            
                            return (
                              <div key={optIndex} className={`p-3 rounded ${
                                isCorrectAnswer ? 'bg-green-100 border-2 border-green-500' :
                                isUserAnswer && !isCorrectAnswer ? 'bg-red-100 border-2 border-red-500' :
                                'bg-white border border-gray-200'
                              }`}>
                                <div className="flex items-center space-x-2">
                                  {isCorrectAnswer && <span className="text-green-600 font-bold">✓</span>}
                                  {isUserAnswer && !isCorrectAnswer && <span className="text-red-600 font-bold">✗</span>}
                                  <span>{option}</span>
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                          <p className="text-sm text-gray-700">
                            <strong>Explicación:</strong> {question.explanation}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Recomendaciones */}
              {results.analysis.improvementAreas.length > 0 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded mb-8">
                  <h4 className="font-semibold text-yellow-900 mb-3">💡 Áreas de Mejora</h4>
                  <ul className="space-y-2 text-sm text-yellow-800">
                    {results.analysis.improvementAreas.map((area, index) => (
                      <li key={index}>
                        • <strong>{getTypeLabel(area.area)}</strong>: {area.percentage.toFixed(0)}% correcto. 
                        Revisa este tema en la sección de teoría.
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={restartExam}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all font-semibold shadow-lg"
                >
                  🔄 Nuevo Examen
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all font-semibold shadow-lg"
                >
                  🏠 Volver al Módulo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default BooleanExamModule