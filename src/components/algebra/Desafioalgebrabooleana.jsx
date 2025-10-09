// ✅ DESAFÍOS CORREGIDOS - VERSIÓN COMPLETA
import { useState, useEffect } from 'react'
import { BooleanEvaluator } from '../../utils/BooleanEvaluator'

class BooleanChallengeGenerator {
  constructor() {
    this.challenges = [
      {
        expression: "A + A·B",
        simplified: "A",
        variables: ['A', 'B'],
        difficulty: 'easy',
        laws: ['Absorción'],
        hint: 'Aplica la ley de absorción: A + A·B = A'
      },
      {
        expression: "A·B' + C",
        simplified: "A·B' + C",
        variables: ['A', 'B', 'C'],
        difficulty: 'easy',
        laws: ['Ya está simplificada'],
        hint: 'Esta expresión ya está en su forma más simple'
      },
      {
        expression: "(A + B)·(A + C)",
        simplified: "A + B·C",
        variables: ['A', 'B', 'C'],
        difficulty: 'medium',
        laws: ['Distributiva', 'Absorción'],
        hint: 'Aplica distributiva: A + A·C + A·B + B·C = A(1+C+B) + B·C = A + B·C'
      },
      {
        expression: "A·B + A·B'",
        simplified: "A",
        variables: ['A', 'B'],
        difficulty: 'easy',
        laws: ['Factorización', 'Complemento'],
        hint: 'Factoriza A: A(B + B\') = A·1 = A'
      },
      {
        expression: "A'·B + A·B + A·B'",
        simplified: "A + B",
        variables: ['A', 'B'],
        difficulty: 'medium',
        laws: ['Factorización', 'Idempotencia'],
        hint: 'Simplifica A·B + A·B\' = A, luego A + A\'·B = A + B'
      },
      {
        expression: "A·B + A·C + B·C",
        simplified: "A·B + A·C",
        variables: ['A', 'B', 'C'],
        difficulty: 'hard',
        laws: ['Consenso'],
        hint: 'B·C es redundante (consenso de A·B y A·C)'
      },
      {
        expression: "A·B·C + A·B·C' + A·B'·C",
        simplified: "A·B + A·B'·C",
        variables: ['A', 'B', 'C'],
        difficulty: 'medium',
        laws: ['Factorización', 'Complemento'],
        hint: 'Factoriza A·B de los primeros dos términos: A·B(C+C\')=A·B'
      },
      {
        expression: "(A + B)·(A + B')",
        simplified: "A",
        variables: ['A', 'B'],
        difficulty: 'medium',
        laws: ['Distributiva', 'Complemento'],
        hint: 'Distribuye: A·A + A·B\' + B·A + B·B\' = A + 0 = A'
      },
      {
        expression: "A'·B'·C + A·B'·C + A·B·C",
        simplified: "B'·C + A·B·C",
        variables: ['A', 'B', 'C'],
        difficulty: 'medium',
        laws: ['Factorización'],
        hint: 'Factoriza B\'·C de los primeros dos términos'
      },
      {
        expression: "(A·B)' + (A' + B')'",
        simplified: "1",
        variables: ['A', 'B'],
        difficulty: 'hard',
        laws: ['De Morgan', 'Complemento'],
        hint: 'Aplica De Morgan: (A·B)\'=A\'+B\', (A\'+B\')\'=A·B, luego A\'+B\'+A·B=1'
      }
    ]
  }

  generateChallenge() {
    const challenge = this.challenges[Math.floor(Math.random() * this.challenges.length)]
    const truthTable = this.generateTruthTable(challenge.expression, challenge.variables)
    const karnaughMap = this.generateKarnaughMap(truthTable, challenge.variables)
    
    return {
      ...challenge,
      truthTable,
      karnaughMap,
      id: `challenge-${Date.now()}-${Math.random()}`
    }
  }

  generateTruthTable(expression, variables) {
    const rows = Math.pow(2, variables.length)
    const table = []

    for (let i = 0; i < rows; i++) {
      const values = {}
      variables.forEach((variable, index) => {
        values[variable] = (i >> (variables.length - 1 - index)) & 1
      })

      const result = BooleanEvaluator.evaluate(expression, values)

      table.push({
        ...values,
        result: result,
        index: i
      })
    }

    return table
  }

  generateKarnaughMap(truthTable, variables) {
    if (variables.length === 2) {
      return {
        type: '2var',
        cells: [
          [truthTable[0].result, truthTable[1].result],
          [truthTable[2].result, truthTable[3].result]
        ],
        rows: ['0', '1'],
        cols: ['0', '1']
      }
    } else if (variables.length === 3) {
      return {
        type: '3var',
        cells: [
          [truthTable[0].result, truthTable[1].result, truthTable[3].result, truthTable[2].result],
          [truthTable[4].result, truthTable[5].result, truthTable[7].result, truthTable[6].result]
        ],
        rows: ['0', '1'],
        cols: ['00', '01', '11', '10']
      }
    }
    return { type: 'unsupported', cells: [] }
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

  const startNewChallenge = () => {
    const challenge = generator.generateChallenge()
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
    if (!currentChallenge) return

    const userInput = userAnswers.simplification.trim()
    const correct = currentChallenge.simplified.trim()

    const validation = BooleanEvaluator.areEquivalent(userInput, correct)

    setAttempts(prev => ({ ...prev, simplification: prev.simplification + 1 }))

    if (validation.equivalent) {
      setFeedback(prev => ({
        ...prev,
        simplification: {
          correct: true,
          message: '¡Correcto! Excelente simplificación. Las expresiones son lógicamente equivalentes.'
        }
      }))
    } else {
      let message = getSimplificationHints(currentChallenge.laws, attempts.simplification)

      if (validation.counterExample) {
        const counterEx = Object.entries(validation.counterExample)
          .map(([k, v]) => `${k}=${v}`)
          .join(', ')
        message += `\n\nContraejemplo: Con ${counterEx}, tu expresión y la esperada dan resultados diferentes.`
      }

      setFeedback(prev => ({
        ...prev,
        simplification: { correct: false, message }
      }))
    }
  }

  const finalizeChallenge = () => {
    if (!currentChallenge) return
    
    const truthTableFeedback = {}
    currentChallenge.truthTable.forEach((row, index) => {
      const userValue = parseInt(userAnswers.truthTable[index])
      const correct = row.result
      truthTableFeedback[index] = {
        correct: userValue === correct,
        value: correct
      }
    })
    
    const karnaughFeedback = {}
    if (currentChallenge.karnaughMap.type === '2var') {
      currentChallenge.karnaughMap.cells.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const userValue = parseInt(userAnswers.karnaughMap[`${rowIndex}-${colIndex}`])
          karnaughFeedback[`${rowIndex}-${colIndex}`] = {
            correct: userValue === cell,
            value: cell
          }
        })
      })
    } else if (currentChallenge.karnaughMap.type === '3var') {
      currentChallenge.karnaughMap.cells.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const userValue = parseInt(userAnswers.karnaughMap[`${rowIndex}-${colIndex}`])
          karnaughFeedback[`${rowIndex}-${colIndex}`] = {
            correct: userValue === cell,
            value: cell
          }
        })
      })
    }
    
    setFeedback(prev => ({
      ...prev,
      truthTable: truthTableFeedback,
      karnaughMap: karnaughFeedback
    }))
    
    const simplificationScore = feedback.simplification?.correct ? 100 : 0
    const truthTableCorrect = Object.values(truthTableFeedback).filter(f => f.correct).length
    const truthTableTotal = currentChallenge.truthTable.length
    const truthTableScore = truthTableTotal > 0 ? (truthTableCorrect / truthTableTotal) * 100 : 0
    const karnaughCorrect = Object.values(karnaughFeedback).filter(f => f.correct).length
    const karnaughTotal = currentChallenge.karnaughMap.cells.flat().length
    const karnaughScore = karnaughTotal > 0 ? (karnaughCorrect / karnaughTotal) * 100 : 0
    const totalScore = (simplificationScore * 0.5) + (truthTableScore * 0.25) + (karnaughScore * 0.25)
    const grade = (totalScore / 100) * 5
    const badge = getBadge(grade)
    
    setFinalScore({
      simplification: simplificationScore,
      truthTable: truthTableScore,
      karnaugh: karnaughScore,
      total: totalScore,
      grade: grade.toFixed(2),
      badge,
      time: timeElapsed
    })
    
    setChallengeComplete(true)
    setTimerActive(false)
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
      <div className="bg-white shadow-lg border-b border-emerald-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                🎯 Desafío de Álgebra Booleana
              </h1>
              <p className="text-gray-600">Resuelve las tres secciones para obtener tu calificación</p>
            </div>
            <div className="text-right space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-500">⏱️ Tiempo:</span>
                <span className="font-mono font-bold text-emerald-600">{formatTime(timeElapsed)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl shadow-lg p-6 mb-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Expresión a Simplificar</h2>
            <div className="text-3xl font-bold font-mono bg-white bg-opacity-20 rounded-lg py-4 px-6 inline-block">
              {currentChallenge.expression}
            </div>
            <div className="mt-3 text-sm text-emerald-100">
              Variables: {currentChallenge.variables.join(', ')}
            </div>
          </div>
        </div>

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
                  placeholder="Ej: A, A·B, A + B"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-lg"
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
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all font-semibold shadow-md"
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
                          {row[variable]}
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
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentChallenge.karnaughMap.cells.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="border-2 border-gray-400 px-4 py-2 bg-gray-100 font-semibold text-center">
                          {currentChallenge.karnaughMap.rows[rowIndex]}
                        </td>
                        {row.map((cell, colIndex) => (
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
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentChallenge.karnaughMap.cells.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="border-2 border-gray-400 px-4 py-2 bg-gray-100 font-semibold text-center">
                          {currentChallenge.karnaughMap.rows[rowIndex]}
                        </td>
                        {row.map((cell, colIndex) => (
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
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg">
              <h4 className="font-semibold text-emerald-900 mb-2">Reglas del Mapa de Karnaugh:</h4>
              <ul className="space-y-1 text-sm text-emerald-800">
                <li>• Usa el código Gray para las etiquetas (solo cambia un bit entre celdas adyacentes)</li>
                <li>• Los grupos deben ser rectangulares y de tamaño potencia de 2 (1, 2, 4, 8...)</li>
                <li>• Busca agrupar los 1s para obtener la expresión simplificada</li>
              </ul>
            </div>
          </div>
        )}

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
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-4">Calificación por Sección</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">🧮 Simplificación (50%)</span>
                    <span className="font-bold text-lg">{finalScore.simplification.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-emerald-600 h-2 rounded-full transition-all" style={{ width: `${finalScore.simplification}%` }}></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">📊 Tabla de Verdad (25%)</span>
                    <span className="font-bold text-lg">{finalScore.truthTable.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-teal-600 h-2 rounded-full transition-all" style={{ width: `${finalScore.truthTable}%` }}></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">🗺️ Mapa de Karnaugh (25%)</span>
                    <span className="font-bold text-lg">{finalScore.karnaugh.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full transition-all" style={{ width: `${finalScore.karnaugh}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-4">Resumen General</h3>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-white rounded-lg shadow">
                    <div className="text-4xl font-bold text-emerald-600 mb-1">{finalScore.grade}</div>
                    <div className="text-sm text-gray-600">Nota Final (sobre 5.0)</div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">⏱️ Tiempo total:</span>
                    <span className="font-semibold">{formatTime(finalScore.time)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">📈 Puntaje total:</span>
                    <span className="font-semibold">{finalScore.total.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-6">
              <h4 className="font-semibold text-yellow-900 mb-2">💡 Recomendaciones:</h4>
              <ul className="space-y-1 text-sm text-yellow-800">
                {finalScore.simplification < 100 && (
                  <li>• Revisa las leyes de simplificación booleana (Absorción, De Morgan, Factorización)</li>
                )}
                {finalScore.truthTable < 100 && (
                  <li>• Practica evaluando expresiones para cada combinación de entradas</li>
                )}
                {finalScore.karnaugh < 100 && (
                  <li>• Estudia el código Gray y las reglas de agrupamiento en mapas de Karnaugh</li>
                )}
                {finalScore.grade >= 4.0 && (
                  <li>• ¡Excelente trabajo! Intenta desafíos más complejos</li>
                )}
              </ul>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={startNewChallenge}
                className="px-8 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg hover:from-teal-700 hover:to-emerald-700 transition-all font-semibold shadow-lg"
              >
                🔄 Nuevo Desafío
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all font-semibold shadow-lg"
              >
                🏠 Volver al Inicio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BooleanChallengeModule