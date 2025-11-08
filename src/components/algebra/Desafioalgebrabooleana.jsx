// Desafíos de Álgebra Booleana
import { useState, useEffect } from 'react'
import { BooleanEvaluator } from '../../utils/BooleanEvaluator'
import { karnaughMapper } from '../../utils/KarnaughMapper'
import { booleanSimplifier } from '../../utils/BooleanSimplifier'




class BooleanChallengeGenerator {
  constructor() {
    this.challenges = [
      // NIVEL FÁCIL (2-3 variables)
      {
        expression: "A·B + A·B'",
        difficulty: 'easy',
        variables: ['A', 'B'],
        laws: ['Factorización', 'Complemento'],
        hint: 'Factoriza A y aplica B + B\' = 1'
      },
      {
        expression: "(A + B)·(A + B')",
        difficulty: 'easy',
        variables: ['A', 'B'],
        laws: ['Distributiva', 'Complemento'],
        hint: 'Aplica distributiva y luego B + B\' = 1'
      },
      // NIVEL MEDIO (3-4 variables)
      {
        expression: "A·B·C + A·B·C' + A·B'·C + A·B'·C'",
        difficulty: 'medium',
        variables: ['A', 'B', 'C'],
        laws: ['Factorización múltiple', 'Complemento'],
        hint: 'Factoriza A, luego factoriza B y B\''
      },
      {
        expression: "(A + B)·(A + C)·(B + C)",
        difficulty: 'medium',
        variables: ['A', 'B', 'C'],
        laws: ['Distributiva', 'Consenso'],
        hint: 'El término (B+C) es consenso de los otros dos'
      },
      {
        expression: "A'·B'·C + A'·B·C + A·B'·C + A·B·C",
        difficulty: 'medium',
        variables: ['A', 'B', 'C'],
        laws: ['Factorización', 'Absorción'],
        hint: 'Factoriza C de todos los términos'
      },
      // NIVEL DIFÍCIL (4+ variables)
      {
        expression: "A·B·C·D + A·B·C·D' + A·B·C'·D + A·B'·C·D",
        difficulty: 'hard',
        variables: ['A', 'B', 'C', 'D'],
        laws: ['Factorización compleja', 'Absorción'],
        hint: 'Factoriza A·B primero, luego busca patrones'
      },
      {
        expression: "(A + B)·(C + D)·(A + C)·(B + D)",
        difficulty: 'hard',
        variables: ['A', 'B', 'C', 'D'],
        laws: ['Distributiva múltiple', 'Consenso'],
        hint: 'Expande primero dos términos, luego busca redundancias'
      },
      {
        expression: "A'·B'·C'·D + A'·B·C'·D + A·B'·C'·D + A·B·C'·D",
        difficulty: 'hard',
        variables: ['A', 'B', 'C', 'D'],
        laws: ['Factorización', 'Mapa de Karnaugh'],
        hint: 'Factoriza C\'·D, nota que A y B varían'
      },
      // NIVEL EXPERTO (expresiones complejas)
      {
        expression: "(A·B + C)·(A' + B')·(C' + D)",
        difficulty: 'expert',
        variables: ['A', 'B', 'C', 'D'],
        laws: ['De Morgan', 'Distributiva', 'Simplificación compleja'],
        hint: 'Aplica De Morgan a (A\'+B\') y expande cuidadosamente'
      },
      {
        expression: "A·B·C + A·B'·D + A'·B·C + A'·B'·D + B·C·D",
        difficulty: 'expert',
        variables: ['A', 'B', 'C', 'D'],
        laws: ['Consenso múltiple', 'Absorción', 'Factorización'],
        hint: 'Busca términos que se absorben mutuamente'
      }
    ]
  }

  generateChallenge() {
    const challenge = this.challenges[Math.floor(Math.random() * this.challenges.length)]
    const truthTable = this.generarTablaVerdad(challenge.expression, challenge.variables)
    const karnaughMap = this.generarMapaKarnaugh(challenge.expression, challenge.variables)
    const simplificationResult = booleanSimplifier.simplify(challenge.expression, {
      maxSteps: 50,
      showAllSteps: true,
      targetForm: 'SOP'
    })
    return {
      ...challenge,
      simplified: simplificationResult.simplifiedExpression, 
      truthTable,
      karnaughMap,
      simplificationSteps: simplificationResult.steps,
      id: `challenge-${Date.now()}-${Math.random()}`,
      source: 'system'
    }
  }

  generarTablaVerdad(expression, variables) {
    const rows = Math.pow(2, variables.length)
    const table = []

    for (let i = 0; i < rows; i++) {
      const values = {}
      variables.forEach((variable, index) => {
        values[variable] = (i >> (variables.length - 1 - index)) & 1
      })

      const result = BooleanEvaluator.evaluar(expression, values)

      table.push({
        ...values,
        result: result,
        index: i
      })
    }

    return table
  }

  generarMapaKarnaugh(expression, variables) {
    try {
      const map = karnaughMapper.generarMapa(expression, variables, {
        mode: 'minTerms',
        showGroups: false
      })
      return map.map
    } catch (error) {
      console.error('Error generando mapa K:', error)
      return { type: 'error', cells: [] }
    }
  }
}

function BooleanChallengeModule() {
  const generator = new BooleanChallengeGenerator()
  
  const [currentChallenge, setCurrentChallenge] = useState(null)
  const [activeSection, setActiveSection] = useState('simplification')
  const [userAnswers, setUserAnswers] = useState({
    simplification: '',
    truthTable: {},
    karnaughMap: {}
  })
  const [feedback, setFeedback] = useState({
    simplification: null,
    truthTable: {},
    karnaughMap: {}
  })
  const [attempts, setAttempts] = useState({
    simplification: 0,
    truthTable: 0,
    karnaughMap: 0
  })
  const [showHint, setShowHint] = useState(false)
  const [challengeComplete, setChallengeComplete] = useState(false)
  const [finalScore, setFinalScore] = useState(null)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [professorMode, setProfessorMode] = useState(false)
  const [customExpression, setCustomExpression] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium')

  const startNewChallenge = (difficulty = null) => {
    const challenge = generator.generateChallenge(difficulty)
    setCurrentChallenge(challenge)
    setUserAnswers({ simplification: '', truthTable: {}, karnaughMap: {} })
    setFeedback({ simplification: null, truthTable: {}, karnaughMap: {} })
    setAttempts({ simplification: 0, truthTable: 0, karnaughMap: 0 })
    setShowHint(false)
    setChallengeComplete(false)
    setFinalScore(null)
    setTimeElapsed(0)
    setTimerActive(true)
    setActiveSection('simplification')
  
  }
  const createCustomChallenge = () => {
    if (!customExpression.trim()) {
      alert('Por favor ingresa una expresión válida')
      return
    }

    try {
      const variables = BooleanEvaluator.extraerVariables(customExpression)
      
      if (variables.length < 2 || variables.length > 6) {
        alert('La expresión debe tener entre 2 y 6 variables')
        return
      }

      // Simplificar usando el motor real
      const simplificationResult = booleanSimplifier.simplify(customExpression, {
        maxSteps: 50,
        showAllSteps: false,
        targetForm: 'SOP'
      })

      const truthTable = generator.generarTablaVerdad(customExpression, variables)
      const karnaughMap = generator.generarMapaKarnaugh(customExpression, variables)

      const customChallenge = {
        expression: customExpression,
        simplified: simplificationResult.simplifiedExpression,
        variables: variables,
        difficulty: selectedDifficulty,
        laws: ['Personalizado'],
        hint: 'Ejercicio personalizado del profesor',
        truthTable,
        karnaughMap,
        simplificationSteps: simplificationResult.steps,
        id: `custom-${Date.now()}`,
        source: "custom"
      }

      setCurrentChallenge(customChallenge)
      setUserAnswers({ simplification: '', truthTable: {}, karnaughMap: {} })
      setFeedback({ simplification: null, truthTable: {}, karnaughMap: {} })
      setAttempts({ simplification: 0, truthTable: 0, karnaughMap: 0 })
      setShowHint(false)
      setChallengeComplete(false)
      setFinalScore(null)
      setTimeElapsed(0)
      setTimerActive(true)
      setActiveSection('simplification')
      setProfessorMode(false)
      setCustomExpression('')
    } catch (error) {
      alert(`Error al crear el desafío: ${error.message}`)
    }
  }
   
  useEffect(() => {
    let interval
    if (timerActive && !challengeComplete) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timerActive, challengeComplete])

  useEffect(() => {
    startNewChallenge()
  }, [])

  const validateSimplification = () => {
    validateSimplificationWithHints()
}

const validateSimplificationWithHints = () => {
  if (!currentChallenge) return

  const userInput = userAnswers.simplification.trim()
  
  if (!userInput) {
    setFeedback(prev => ({
      ...prev,
      simplification: {
        correct: false,
        message: 'Por favor ingresa una expresión',
        score: 0,
        hint: 'Debes ingresar una expresión simplificada'
      }
    }))
    setAttempts(prev => ({ ...prev, simplification: prev.simplification + 1 }))
    return
  }

  // Verificar equivalencia lógica
  const validation = BooleanEvaluator.sonEquivalentes(userInput, currentChallenge.simplified)

  // Si es correcto, dar puntaje completo
  if (validation.equivalent) {
    setFeedback(prev => ({
      ...prev,
      simplification: {
        correct: true,
        message: '¡Excelente! Tu simplificación es correcta y equivalente a la solución óptima.',
        score: 2,
        hint: null
      }
    }))
    setAttempts(prev => ({ ...prev, simplification: prev.simplification + 1 }))
    return
  }

  // SISTEMA SOLO: Si no es correcto, analizar qué tan cerca está
  if (currentChallenge.source !== 'custom') {
    const analysis = analyzeSimplificationProgress(
      userInput,
      currentChallenge.expression,
      currentChallenge.simplificationSteps,
      currentChallenge.variables
    )

    setFeedback(prev => ({
      ...prev,
      simplification: {
        correct: false,
        message: analysis.message,
        score: analysis.score,
        hint: analysis.hint,
        progress: analysis.progress,
        counterExample: validation.counterExample
      }
    }))
  } else {
    // MODO PROFESOR: No dar retroalimentación automática
    setFeedback(prev => ({
      ...prev,
      simplification: {
        correct: false,
        message: 'Respuesta registrada. El profesor revisará tu solución.',
        score: null, // Calificación manual
        hint: 'Consulta con el profesor si necesitas ayuda',
        counterExample: validation.counterExample
      }
    }))
  }

  setAttempts(prev => ({ ...prev, simplification: prev.simplification + 1 }))
}

// Función para analizar el progreso del estudiante
const analyzeSimplificationProgress = (userExpr, originalExpr, steps, variables) => {
  
  // Simplificar la expresión del usuario para ver hasta dónde llegó
  const userSimplification = booleanSimplifier.simplify(userExpr, {
    maxSteps: 50,
    showAllSteps: true,
    targetForm: 'SOP'
  })

  // Calcular complejidad de ambas expresiones
  const userComplexity = countComplexity(userExpr)
  const optimalComplexity = countComplexity(steps[steps.length - 1].to)
  const originalComplexity = countComplexity(originalExpr)

  // Calcular reducción lograda
  const maxReduction = originalComplexity - optimalComplexity
  const userReduction = originalComplexity - userComplexity
  const reductionPercentage = maxReduction > 0 ? (userReduction / maxReduction) * 100 : 0

  // Identificar en qué paso se quedó
  const userStepIndex = findClosestStep(userExpr, steps)
  const totalSteps = steps.length
  const progressPercentage = totalSteps > 0 ? ((userStepIndex + 1) / totalSteps) * 100 : 0

  // SISTEMA DE CALIFICACIÓN PROPORCIONAL
  let score = 0
  let message = ''
  let hint = ''
  let progress = 'none'

  if (reductionPercentage >= 90 && progressPercentage >= 80) {
    // Casi perfecto - falta un detalle menor
    score = 1.5
    progress = 'excellent'
    message = '¡Muy bien! Tu simplificación es casi óptima.'
    hint = `Estás muy cerca. Revisa si puedes aplicar ${getNextLaw(userStepIndex, steps)}.`
  } else if (reductionPercentage >= 70 || progressPercentage >= 60) {
    // Bien - falta un paso importante
    score = 1.0
    progress = 'good'
    message = 'Buen trabajo, pero aún se puede simplificar más.'
    hint = `Te falta aplicar: ${getMissingLaws(userStepIndex, steps).join(', ')}. Intenta factorizar o aplicar absorción.`
  } else if (reductionPercentage >= 40 || progressPercentage >= 30) {
    // Regular - faltan varios pasos
    score = 0.5
    progress = 'fair'
    message = 'Has simplificado parcialmente, pero faltan varios pasos.'
    hint = `Aún necesitas aplicar leyes como: ${getMissingLaws(userStepIndex, steps).slice(0, 2).join(' y ')}. Revisa la pista principal.`
  } else {
    // Insuficiente
    score = 0
    progress = 'poor'
    message = 'Tu expresión no está simplificada o es incorrecta.'
    hint = `Pista: ${currentChallenge.hint}. Intenta aplicar ${steps[0]?.law || 'las leyes básicas'}.`
  }

  return {
    score,
    message,
    hint,
    progress,
    reductionPercentage: Math.round(reductionPercentage),
    progressPercentage: Math.round(progressPercentage),
    userStepIndex,
    totalSteps
  }
}

// Función auxiliar: contar complejidad
const countComplexity = (expr) => {
  const operators = (expr.match(/[·+]/g) || []).length
  const negations = (expr.match(/'/g) || []).length
  const variables = (expr.match(/[A-Z]/g) || []).length
  return operators * 2 + negations + variables * 0.5
}

// Función auxiliar: encontrar el paso más cercano
const findClosestStep = (userExpr, steps) => {
  let closestIndex = -1
  let minDistance = Infinity

  for (let i = 0; i < steps.length; i++) {
    const stepExpr = steps[i].to
    const distance = expressionDistance(userExpr, stepExpr)
    
    if (distance < minDistance) {
      minDistance = distance
      closestIndex = i
    }
  }

  return closestIndex
}

// Función auxiliar: calcular "distancia" entre expresiones
const expressionDistance = (expr1, expr2) => {
  const norm1 = expr1.replace(/\s+/g, '').toUpperCase()
  const norm2 = expr2.replace(/\s+/g, '').toUpperCase()
  
  // Distancia de Levenshtein simplificada + diferencia de complejidad
  const lengthDiff = Math.abs(norm1.length - norm2.length)
  const complexityDiff = Math.abs(countComplexity(expr1) - countComplexity(expr2))
  
  return lengthDiff + complexityDiff * 2
}

// Función auxiliar: obtener la siguiente ley a aplicar
const getNextLaw = (currentStep, steps) => {
  if (currentStep >= 0 && currentStep < steps.length - 1) {
    return steps[currentStep + 1].law || 'simplificación adicional'
  }
  return 'verificación final'
}

const getMissingLaws = (currentStep, steps) => {
  const missing = []
  for (let i = currentStep + 1; i < steps.length; i++) {
    if (steps[i].law && !missing.includes(steps[i].law)) {
      missing.push(steps[i].law)
    }
  }
  return missing.length > 0 ? missing : ['Simplificación final']
}

  const finalizeChallenge = () => {
    if (!currentChallenge) return
  
  // Validar tabla de verdad
  const truthTableFeedback = {}
  let truthTableCorrect = 0
  currentChallenge.truthTable.forEach((row, index) => {
    const userValue = parseInt(userAnswers.truthTable[index])
    const correct =row.result === true || row.result === 1 ? 1 : 0
    const isCorrect = userValue === correct
    
    truthTableFeedback[index] = {
      correct: isCorrect,
      value: correct
    }
    
    if (isCorrect) truthTableCorrect++
  })
  
  // Validar mapa de Karnaugh
  const karnaughFeedback = {}
  let karnaughCorrect = 0
  let karnaughTotal = 0
  
  if (currentChallenge.karnaughMap && currentChallenge.karnaughMap.cells) {
    const processKarnaughCells = (cells) => {
      cells.forEach((row, rowIndex) => {
        if (Array.isArray(row)) {
          row.forEach((cell, colIndex) => {
            karnaughTotal++
            const cellValue = typeof cell === 'object' ? cell.value : cell
            const userValue = parseInt(userAnswers.karnaughMap[`${rowIndex}-${colIndex}`])
            const isCorrect = userValue === cellValue
            
            karnaughFeedback[`${rowIndex}-${colIndex}`] = {
              correct: isCorrect,
              value: cellValue
            }
            
            if (isCorrect) karnaughCorrect++
          })
        }
      })
    }
    
    processKarnaughCells(currentChallenge.karnaughMap.cells)
  }
  
  setFeedback(prev => ({
    ...prev,
    truthTable: truthTableFeedback,
    karnaughMap: karnaughFeedback
  }))
  
  // CALCULAR PUNTAJES
  const simplificationScore = feedback.simplification?.score ?? 0
  const truthTableTotal = currentChallenge.truthTable.length
  const truthTableScore = truthTableTotal > 0 ? (truthTableCorrect / truthTableTotal) * 1.5 : 0
  const karnaughScore = karnaughTotal > 0 ? (karnaughCorrect / karnaughTotal) * 1.5 : 0
  
  const totalScore = simplificationScore + truthTableScore + karnaughScore
  const grade = totalScore // Ya está sobre 5.0
  const badge = getBadge(grade)
  
  // ANÁLISIS DE ÁREAS DE MEJORA
  const weaknesses = []
  const strengths = []
  
  if (simplificationScore < 1.5) {
    weaknesses.push({
      area: 'Simplificación',
      details: feedback.simplification?.hint || 'Revisa las leyes de simplificación',
      priority: 'high'
    })
  } else {
    strengths.push('Simplificación')
  }
  
  if (truthTableScore < 1.2) {
    weaknesses.push({
      area: 'Tablas de Verdad',
      details: 'Practica evaluando expresiones booleanas sistemáticamente',
      priority: truthTableScore < 0.7 ? 'high' : 'medium'
    })
  } else {
    strengths.push('Tablas de Verdad')
  }
  
  if (karnaughScore < 1.2) {
    weaknesses.push({
      area: 'Mapas de Karnaugh',
      details: 'Repasa el código Gray y el llenado de mapas K',
      priority: karnaughScore < 0.7 ? 'high' : 'medium'
    })
  } else {
    strengths.push('Mapas de Karnaugh')
  }
  
  setFinalScore({
    simplification: simplificationScore,
    truthTable: truthTableScore,
    karnaugh: karnaughScore,
    total: totalScore,
    grade: grade.toFixed(2),
    badge,
    time: timeElapsed,
    truthTableCorrect,
    truthTableTotal,
    karnaughCorrect,
    karnaughTotal,
    weaknesses,
    strengths,
    recommendations: generateRecommendations(weaknesses, grade)
  })
  
  setChallengeComplete(true)
  setTimerActive(false)
}

// Nueva función para generar recomendaciones personalizadas
const generateRecommendations = (weaknesses, grade) => {
  const recommendations = []
  
  if (grade >= 4.5) {
    recommendations.push({
      type: 'success',
      message: '¡Excelente dominio! Estás listo para desafíos más complejos.',
      action: 'Intenta ejercicios de nivel "Experto"'
    })
  } else if (grade >= 3.5) {
    recommendations.push({
      type: 'good',
      message: 'Buen trabajo. Con un poco más de práctica llegarás al nivel experto.',
      action: 'Repasa los temas donde tuviste errores'
    })
  } else if (grade >= 2.5) {
    recommendations.push({
      type: 'improvement',
      message: 'Vas por buen camino, pero necesitas reforzar algunos conceptos.',
      action: 'Dedica tiempo a estudiar las áreas débiles identificadas'
    })
  } else {
    recommendations.push({
      type: 'study',
      message: 'Necesitas repasar los fundamentos del álgebra booleana.',
      action: 'Comienza con ejercicios de nivel "Fácil" y consulta el material teórico'
    })
  }
  
  // Agregar recomendaciones específicas por área
  weaknesses.forEach(weakness => {
    if (weakness.priority === 'high') {
      recommendations.push({
        type: 'specific',
        message: `${weakness.area}: ${weakness.details}`,
        action: `Practica más ejercicios de ${weakness.area.toLowerCase()}`
      })
    }
  })
  
  return recommendations
}

  const getSimplificationHints = (laws, attemptCount) => {
    if (attemptCount === 0) return `Intenta aplicar: ${laws[0]}`
    if (attemptCount === 1) return `Revisa la Ley de ${laws[0]}. ¿Puedes identificar el patrón?`
    return `Pista: ${currentChallenge.hint}`
  }

  const getBadge = (grade) => {
    if (grade >= 4.5) return { name: 'Experto Booleano', color: 'gold', icon: '🏆' }
    if (grade >= 4.0) return { name: 'Analista Digital', color: 'silver', icon: '🥈' }
    if (grade >= 3.0) return { name: 'Aprendiz Lógico', color: 'bronze', icon: '🥉' }
    return { name: 'Necesita Repaso', color: 'gray', icon: '📚' }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!currentChallenge) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600">Generando desafío...</p>
      </div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-emerald-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                🎯 Desafío de Álgebra Booleana
              </h1>
              <p className="text-gray-600">Resuelve las tres secciones para obtener tu calificación</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-500">⏱️ Tiempo:</span>
                  <span className="font-mono font-bold text-emerald-600">{formatTime(timeElapsed)}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-500">📊 Dificultad:</span>
                  <span className={`font-bold ${
                    currentChallenge.difficulty === 'easy' ? 'text-green-600' :
                    currentChallenge.difficulty === 'medium' ? 'text-yellow-600' :
                    currentChallenge.difficulty === 'hard' ? 'text-orange-600' :
                    'text-red-600'
                  }`}>
                    {currentChallenge.difficulty === 'easy' ? 'Fácil' :
                     currentChallenge.difficulty === 'medium' ? 'Medio' :
                     currentChallenge.difficulty === 'hard' ? 'Difícil' : 'Experto'}
                  </span>
                </div>
              </div>
              
              {/* Botón modo profesor */}
              <button
                onClick={() => setProfessorMode(!professorMode)}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-semibold"
              >
                👨‍🏫 {professorMode ? 'Cerrar' : 'Modo Profesor'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Panel modo profesor */}
        {professorMode && (
          <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-purple-900 mb-4">👨‍🏫 Crear Desafío Personalizado</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-800 mb-2">
                  Expresión Booleana
                </label>
                <input
                  type="text"
                  value={customExpression}
                  onChange={(e) => setCustomExpression(e.target.value)}
                  placeholder="Ej: A·B·C + A·B'·D + A'·B·C·D"
                  className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-lg"
                />
                <p className="mt-2 text-sm text-purple-600">
                  Operadores: · (AND), + (OR), ' (NOT) | Variables: A-Z | Ejemplo: (A+B)·(C'+D)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-800 mb-2">
                  Dificultad estimada
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="easy">Fácil (2-3 variables)</option>
                  <option value="medium">Medio (3-4 variables)</option>
                  <option value="hard">Difícil (4+ variables)</option>
                  <option value="expert">Experto (expresiones complejas)</option>
                </select>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={createCustomChallenge}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-semibold shadow-md"
                >
                  ✨ Crear Desafío
                </button>
                <button
                  onClick={() => {
                    setProfessorMode(false)
                    setCustomExpression('')
                  }}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Expresión del desafío */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl shadow-lg p-6 mb-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Expresión a Simplificar</h2>
            <div className="text-3xl font-bold font-mono bg-white bg-opacity-20 rounded-lg py-4 px-6 inline-block">
              {currentChallenge.expression}
            </div>
            <div className="mt-3 text-sm text-emerald-100">
              Variables: {currentChallenge.variables.join(', ')} • {currentChallenge.variables.length} variables
            </div>
          </div>
        </div>

        {/* Navegación de secciones */}
        <div className="bg-white rounded-lg shadow-md p-2 mb-6">
          <div className="flex space-x-2">
            {[
              { id: 'simplification', name: 'Simplificación', icon: '🧮', weight: '50%' },
              { id: 'truthTable', name: 'Tabla de Verdad', icon: '📊', weight: '25%' },
              { id: 'karnaugh', name: 'Mapa K', icon: '🗺️', weight: '25%' }
            ].map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="text-xl">{section.icon}</span>
                <div className="text-left">
                  <div className="font-semibold text-sm">{section.name}</div>
                  <div className="text-xs opacity-75">{section.weight}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sección: Simplificación */}
        {activeSection === 'simplification' && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">🧮 Simplificación (50%)</h3>
              <button
                onClick={() => setShowHint(!showHint)}
                className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium"
              >
                💡 {showHint ? 'Ocultar' : 'Ver'} Pista
              </button>
            </div>

            {showHint && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>Pista:</strong> {currentChallenge.hint}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ingresa la expresión simplificada:
                </label>
                <input
                  type="text"
                  value={userAnswers.simplification}
                  onChange={(e) => setUserAnswers(prev => ({ ...prev, simplification: e.target.value }))}
                  placeholder="Ej: A·B, A + C', etc."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-lg"
                  disabled={challengeComplete}
                />
              </div>

              {feedback.simplification && (
                <div className={`p-4 rounded-lg border-l-4 ${
                  feedback.simplification.correct
                    ? 'bg-green-50 border-green-500'
                    : 'bg-red-50 border-red-500'
                }`}>
                  <p className={`text-sm font-medium whitespace-pre-line ${
                    feedback.simplification.correct ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {feedback.simplification.message}
                  </p>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <button
                  onClick={validateSimplification}
                  disabled={challengeComplete}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Verificar Simplificación
                </button>
                <div className="text-sm text-gray-500">Intentos: {attempts.simplification}</div>
              </div>

              <div className="bg-emerald-50 p-4 rounded-lg">
                <h4 className="font-semibold text-emerald-900 mb-2">Leyes que puedes aplicar:</h4>
                <div className="flex flex-wrap gap-2">
                  {currentChallenge.laws.map((law, index) => (
                    <span key={index} className="px-3 py-1 bg-emerald-200 text-emerald-800 rounded-full text-sm">
                      {law}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sección: Tabla de Verdad */}
        {activeSection === 'truthTable' && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Tabla de Verdad (25%)</h3>
            <p className="text-sm text-gray-600 mb-4">
              Completa los valores de salida (columna "Resultado") para cada combinación de entradas:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border-2 border-gray-300">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-100 to-teal-100">
                    {currentChallenge.variables.map(variable => (
                      <th key={variable} className="border-2 border-gray-300 px-4 py-3 text-center font-semibold">
                        {variable}
                      </th>
                    ))}
                    <th className="border-2 border-gray-300 px-4 py-3 text-center font-semibold bg-teal-200">
                      Resultado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentChallenge.truthTable.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50">
                      {currentChallenge.variables.map(variable => (
                        <td key={variable} className="border-2 border-gray-300 px-4 py-3 text-center font-mono bg-gray-50">
                          {row[variable] ? 1 : 0}
                        </td>
                      ))}
                      <td className="border-2 border-gray-300 px-4 py-3 text-center">
                        <input
                          type="text"
                          maxLength="1"
                          value={userAnswers.truthTable[rowIndex] || ''}
                          onChange={(e) => {
                            const value = e.target.value
                            if (value === '' || value === '0' || value === '1') {
                              setUserAnswers(prev => ({
                                ...prev,
                                truthTable: { ...prev.truthTable, [rowIndex]: value }
                              }))
                            }
                          }}
                          className={`w-16 px-2 py-2 border-2 rounded text-center font-mono font-bold text-lg ${
                            challengeComplete && feedback.truthTable[rowIndex]
                              ? feedback.truthTable[rowIndex].correct
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-red-500 bg-red-50 text-red-700'
                              : 'border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                          }`}
                          placeholder="?"
                          disabled={challengeComplete}
                        />
                        {challengeComplete && feedback.truthTable[rowIndex] && !feedback.truthTable[rowIndex].correct && (
                          <div className="text-xs text-red-600 mt-1">
                            Correcto: {feedback.truthTable[rowIndex].value}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-4 bg-teal-50 rounded-lg">
              <p className="text-sm text-teal-800">
                <strong>💡 Tip:</strong> Evalúa la expresión "{currentChallenge.expression}" para cada combinación de entradas.
              </p>
            </div>
          </div>
        )}

        {/* Sección: Mapa de Karnaugh */}
        {activeSection === 'karnaugh' && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🗺️ Mapa de Karnaugh (25%)</h3>
            <p className="text-sm text-gray-600 mb-4">
              Completa las celdas del mapa con los valores correctos (0 o 1):
            </p>
            <div className="flex justify-center mb-6">
              {currentChallenge.karnaughMap.type === '2var' && (
                <table className="border-collapse border-2 border-gray-400">
                  <thead>
                    <tr>
                      <th className="border-2 border-gray-400 px-4 py-2 bg-gray-100"></th>
                      {currentChallenge.karnaughMap.cols.map((col, colIndex) => (
                        <th key={colIndex} className="border-2 border-gray-400 px-6 py-2 bg-gray-100 font-semibold">
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentChallenge.karnaughMap.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="border-2 border-gray-400 px-4 py-2 bg-gray-100 font-semibold text-center">
                          {row.label}
                        </td>
                        {currentChallenge.karnaughMap.cells[rowIndex].map((cell, colIndex) => (
                          <td key={colIndex} className="border-2 border-gray-400 p-2">
                            <input
                              type="text"
                              maxLength="1"
                              value={userAnswers.karnaughMap[`${rowIndex}-${colIndex}`] || ''}
                              onChange={(e) => {
                                const value = e.target.value
                                if (value === '' || value === '0' || value === '1') {
                                  setUserAnswers(prev => ({
                                    ...prev,
                                    karnaughMap: { ...prev.karnaughMap, [`${rowIndex}-${colIndex}`]: value }
                                  }))
                                }
                              }}
                              className={`w-16 h-16 text-center font-mono font-bold text-2xl border-2 rounded ${
                                challengeComplete && feedback.karnaughMap[`${rowIndex}-${colIndex}`]
                                  ? feedback.karnaughMap[`${rowIndex}-${colIndex}`].correct
                                    ? 'border-green-500 bg-green-50 text-green-700'
                                    : 'border-red-500 bg-red-50 text-red-700'
                                  : 'border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                              }`}
                              placeholder="?"
                              disabled={challengeComplete}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {currentChallenge.karnaughMap.type === '3var' && (
                <table className="border-collapse border-2 border-gray-400">
                  <thead>
                    <tr>
                      <th className="border-2 border-gray-400 px-4 py-2 bg-gray-100"></th>
                      {currentChallenge.karnaughMap.cols.map((col, colIndex) => (
                        <th key={colIndex} className="border-2 border-gray-400 px-4 py-2 bg-gray-100 font-semibold text-sm">
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentChallenge.karnaughMap.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="border-2 border-gray-400 px-4 py-2 bg-gray-100 font-semibold text-center">
                          {row.label}
                        </td>
                        {currentChallenge.karnaughMap.cells[rowIndex].map((cell, colIndex) => (
                          <td key={colIndex} className="border-2 border-gray-400 p-1">
                            <input
                              type="text"
                              maxLength="1"
                              value={userAnswers.karnaughMap[`${rowIndex}-${colIndex}`] || ''}
                              onChange={(e) => {
                                const value = e.target.value
                                if (value === '' || value === '0' || value === '1') {
                                  setUserAnswers(prev => ({
                                    ...prev,
                                    karnaughMap: { ...prev.karnaughMap, [`${rowIndex}-${colIndex}`]: value }
                                  }))
                                }
                              }}
                              className={`w-12 h-12 text-center font-mono font-bold text-xl border-2 rounded ${
                                challengeComplete && feedback.karnaughMap[`${rowIndex}-${colIndex}`]
                                  ? feedback.karnaughMap[`${rowIndex}-${colIndex}`].correct
                                    ? 'border-green-500 bg-green-50 text-green-700'
                                    : 'border-red-500 bg-red-50 text-red-700'
                                  : 'border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                              }`}
                              placeholder="?"
                              disabled={challengeComplete}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {currentChallenge.karnaughMap.type === '4var' && (
                <table className="border-collapse border-2 border-gray-400">
                  <thead>
                    <tr>
                      <th className="border-2 border-gray-400 px-4 py-2 bg-gray-100"></th>
                      {currentChallenge.karnaughMap.cols.map((col, colIndex) => (
                        <th key={colIndex} className="border-2 border-gray-400 px-3 py-2 bg-gray-100 font-semibold text-xs">
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentChallenge.karnaughMap.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="border-2 border-gray-400 px-3 py-2 bg-gray-100 font-semibold text-center text-xs">
                          {row.label}
                        </td>
                        {currentChallenge.karnaughMap.cells[rowIndex].map((cell, colIndex) => (
                          <td key={colIndex} className="border-2 border-gray-400 p-1">
                            <input
                              type="text"
                              maxLength="1"
                              value={userAnswers.karnaughMap[`${rowIndex}-${colIndex}`] || ''}
                              onChange={(e) => {
                                const value = e.target.value
                                if (value === '' || value === '0' || value === '1') {
                                  setUserAnswers(prev => ({
                                    ...prev,
                                    karnaughMap: { ...prev.karnaughMap, [`${rowIndex}-${colIndex}`]: value }
                                  }))
                                }
                              }}
                              className={`w-10 h-10 text-center font-mono font-bold text-lg border-2 rounded ${
                                challengeComplete && feedback.karnaughMap[`${rowIndex}-${colIndex}`]
                                  ? feedback.karnaughMap[`${rowIndex}-${colIndex}`].correct
                                    ? 'border-green-500 bg-green-50 text-green-700'
                                    : 'border-red-500 bg-red-50 text-red-700'
                                  : 'border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                              }`}
                              placeholder="?"
                              disabled={challengeComplete}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg">
              <h4 className="font-semibold text-emerald-900 mb-2">Reglas del Mapa de Karnaugh:</h4>
              <ul className="space-y-1 text-sm text-emerald-800">
                <li>• Los valores se colocan según el código Gray (solo cambia un bit entre celdas adyacentes)</li>
                <li>• Cada celda representa una combinación única de las variables</li>
                <li>• El orden de filas/columnas sigue: 00, 01, 11, 10</li>
                <li>• Evalúa la expresión para cada combinación y coloca 1 o 0</li>
              </ul>
            </div>
          </div>
        )}

        {/* Botón de finalización */}
        {!challengeComplete && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">¿Terminaste las tres secciones?</h4>
                <p className="text-sm text-gray-600">Haz clic en finalizar para ver tu calificación</p>
              </div>
              <button
                onClick={finalizeChallenge}
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all font-bold text-lg shadow-lg"
              >
                🎯 Finalizar Desafío
              </button>
            </div>
          </div>
        )}

        {/* Resultados finales */}

{challengeComplete && finalScore && (
  <div className="bg-white rounded-xl shadow-2xl p-8 mb-6 border-4 border-yellow-400">
    <div className="text-center mb-6">
      <div className="text-6xl mb-4">{finalScore.badge.icon}</div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Desafío Completado!</h2>
      <div className={`text-xl font-semibold mb-4 ${
        finalScore.badge.color === 'gold' ? 'text-yellow-600' :
        finalScore.badge.color === 'silver' ? 'text-gray-600' :
        finalScore.badge.color === 'bronze' ? 'text-orange-600' :
        'text-gray-500'
      }`}>
        {finalScore.badge.name}
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-6 mb-6">
      {/* Columna 1: Calificaciones por sección */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-4">Calificación por Sección</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">🧮 Simplificación (2.0 pts)</span>
              <span className="font-bold text-lg">{finalScore.simplification.toFixed(1)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${(finalScore.simplification/2)*100}%` }}></div>
            </div>
            {feedback.simplification?.progress && (
              <div className="text-xs text-gray-600 mt-1">
                Progreso: {feedback.simplification.progress === 'excellent' ? '🌟 Excelente' :
                          feedback.simplification.progress === 'good' ? '👍 Bueno' :
                          feedback.simplification.progress === 'fair' ? '📝 Regular' : '📚 Necesita estudio'}
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">📊 Tabla de Verdad (1.5 pts)</span>
              <span className="font-bold text-lg">{finalScore.truthTable.toFixed(1)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-teal-600 h-2 rounded-full" style={{ width: `${(finalScore.truthTable/1.5)*100}%` }}></div>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {finalScore.truthTableCorrect} de {finalScore.truthTableTotal} correctas
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">🗺️ Mapa de Karnaugh (1.5 pts)</span>
              <span className="font-bold text-lg">{finalScore.karnaugh.toFixed(1)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: `${(finalScore.karnaugh/1.5)*100}%` }}></div>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {finalScore.karnaughCorrect} de {finalScore.karnaughTotal} correctas
            </div>
          </div>
        </div>
      </div>

      {/* Columna 2: Resumen general */}
      <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-4">Resumen General</h3>
        <div className="space-y-4">
          <div className="text-center p-4 bg-white rounded-lg shadow">
            <div className="text-4xl font-bold text-emerald-600 mb-1">{finalScore.grade}</div>
            <div className="text-sm text-gray-600">Nota Final (sobre 5.0)</div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">⏱️ Tiempo:</span>
            <span className="font-semibold">{formatTime(finalScore.time)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">📈 Puntaje:</span>
            <span className="font-semibold">{finalScore.total.toFixed(1)} / 5.0</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">📊 Dificultad:</span>
            <span className="font-semibold capitalize">{currentChallenge.difficulty === 'easy' ? 'Fácil' :
                     currentChallenge.difficulty === 'medium' ? 'Medio' :
                     currentChallenge.difficulty === 'hard' ? 'Difícil' : 'Experto'}</span>
          </div>
        </div>
      </div>
    </div>

    {/* Fortalezas y Debilidades */}
    {(finalScore.strengths?.length > 0 || finalScore.weaknesses?.length > 0) && (
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {finalScore.strengths?.length > 0 && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2 flex items-center">
              <span className="text-xl mr-2">✅</span> Fortalezas
            </h4>
            <ul className="space-y-1 text-sm text-green-800">
              {finalScore.strengths.map((strength, idx) => (
                <li key={idx}>• {strength}</li>
              ))}
            </ul>
          </div>
        )}

        {finalScore.weaknesses?.length > 0 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-900 mb-2 flex items-center">
              <span className="text-xl mr-2">⚠️</span> Áreas de Mejora
            </h4>
            <ul className="space-y-2 text-sm text-red-800">
              {finalScore.weaknesses.map((weakness, idx) => (
                <li key={idx} className={weakness.priority === 'high' ? 'font-semibold' : ''}>
                  • {weakness.area}: {weakness.details}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )}

    {/* Respuesta correcta de simplificación (solo si falló) */}
    {!feedback.simplification?.correct && currentChallenge.source !== 'custom' && (
      <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
        <h4 className="font-semibold text-blue-900 mb-2">📘 Respuesta Correcta de Simplificación:</h4>
        <p className="text-blue-800 font-mono text-lg mb-2">{currentChallenge.simplified}</p>
        {feedback.simplification?.hint && (
          <p className="text-sm text-blue-700 mt-2">
            <strong>Pista:</strong> {feedback.simplification.hint}
          </p>
        )}
      </div>
    )}

    {/* Recomendaciones personalizadas */}
    {finalScore.recommendations?.length > 0 && (
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-6">
        <h4 className="font-semibold text-yellow-900 mb-3">💡 Recomendaciones Personalizadas:</h4>
        <div className="space-y-3">
          {finalScore.recommendations.map((rec, idx) => (
            <div key={idx} className={`text-sm p-3 rounded ${
              rec.type === 'success' ? 'bg-green-100 text-green-800' :
              rec.type === 'good' ? 'bg-blue-100 text-blue-800' :
              rec.type === 'improvement' ? 'bg-orange-100 text-orange-800' :
              rec.type === 'study' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              <p className="font-medium mb-1">{rec.message}</p>
              <p className="text-xs opacity-90">→ {rec.action}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Botones de acción */}
    <div className="flex flex-wrap justify-center gap-4">
      <button
        onClick={() => startNewChallenge()}
        className="px-8 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg hover:from-teal-700 hover:to-emerald-700 transition-all font-semibold shadow-lg"
      >
        🔄 Nuevo Desafío Aleatorio
      </button>
      <button
        onClick={() => startNewChallenge(currentChallenge.difficulty)}
        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg"
      >
        🎲 Mismo Nivel
      </button>
      {!currentChallenge.source === 'custom' && (
        <button
          onClick={() => setProfessorMode(true)}
          className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-semibold shadow-lg"
        >
          👨‍🏫 Ejercicio Personalizado
        </button>
      )}
    </div>
  </div>
)}
      </div>
    </div>
  )
}

export default BooleanChallengeModule