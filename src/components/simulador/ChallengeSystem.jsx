import { useState, useEffect } from 'react'

const ChallengeSystem = ({ circuit, onChallengeComplete }) => {
  const [activeChallenge, setActiveChallenge] = useState(null)
  const [challengeProgress, setChallengeProgress] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [userSolution, setUserSolution] = useState(null)

  const challenges = [
    {
      id: 'basic_and',
      title: 'Compuerta AND Básica',
      difficulty: 'Fácil',
      description: 'Construye un circuito que implemente una compuerta AND de 2 entradas',
      requirements: {
        gates: ['AND'],
        minGates: 1,
        maxGates: 1,
        inputs: ['A', 'B'],
        expectedOutput: {
          'A=0,B=0': 0,
          'A=0,B=1': 0,
          'A=1,B=0': 0,
          'A=1,B=1': 1
        }
      },
      hints: [
        'Usa una compuerta AND de la paleta',
        'Conecta las entradas A y B a la compuerta',
        'La salida debe ser 1 solo cuando ambas entradas sean 1'
      ],
      learningObjectives: [
        'Comprensión de la lógica AND',
        'Uso básico del simulador',
        'Conexión de entradas y salidas'
      ]
    },
    {
      id: 'or_gate',
      title: 'Compuerta OR',
      difficulty: 'Fácil',
      description: 'Implementa una compuerta OR que active la salida cuando al menos una entrada sea 1',
      requirements: {
        gates: ['OR'],
        minGates: 1,
        maxGates: 1,
        inputs: ['A', 'B'],
        expectedOutput: {
          'A=0,B=0': 0,
          'A=0,B=1': 1,
          'A=1,B=0': 1,
          'A=1,B=1': 1
        }
      },
      hints: [
        'La compuerta OR produce salida 1 si cualquier entrada es 1',
        'Solo necesitas una compuerta OR',
        'Conecta ambas entradas a la compuerta'
      ],
      learningObjectives: [
        'Comprensión de la lógica OR',
        'Diferenciación entre AND y OR'
      ]
    },
    {
      id: 'not_gate',
      title: 'Compuerta NOT (Inversor)',
      difficulty: 'Fácil',
      description: 'Crea un inversor que cambie 0 por 1 y 1 por 0',
      requirements: {
        gates: ['NOT'],
        minGates: 1,
        maxGates: 1,
        inputs: ['A'],
        expectedOutput: {
          'A=0': 1,
          'A=1': 0
        }
      },
      hints: [
        'La compuerta NOT tiene solo una entrada',
        'Invierte el valor de la entrada',
        '0 se convierte en 1, 1 se convierte en 0'
      ],
      learningObjectives: [
        'Comprensión de la negación lógica',
        'Uso de compuertas de una entrada'
      ]
    },
    {
      id: 'xor_gate',
      title: 'Compuerta XOR',
      difficulty: 'Medio',
      description: 'Implementa una compuerta XOR que detecte cuando las entradas son diferentes',
      requirements: {
        gates: ['XOR'],
        minGates: 1,
        maxGates: 1,
        inputs: ['A', 'B'],
        expectedOutput: {
          'A=0,B=0': 0,
          'A=0,B=1': 1,
          'A=1,B=0': 1,
          'A=1,B=1': 0
        }
      },
      hints: [
        'XOR produce 1 cuando las entradas son diferentes',
        'XOR produce 0 cuando las entradas son iguales',
        'Útil para detectar diferencias'
      ],
      learningObjectives: [
        'Comprensión de la lógica XOR',
        'Aplicaciones de detección de diferencias'
      ]
    },
    {
      id: 'nand_gate',
      title: 'Compuerta NAND',
      difficulty: 'Medio',
      description: 'Construye una compuerta NAND (AND seguido de NOT)',
      requirements: {
        gates: ['NAND'],
        minGates: 1,
        maxGates: 1,
        inputs: ['A', 'B'],
        expectedOutput: {
          'A=0,B=0': 1,
          'A=0,B=1': 1,
          'A=1,B=0': 1,
          'A=1,B=1': 0
        }
      },
      hints: [
        'NAND es la negación de AND',
        'Produce 0 solo cuando ambas entradas son 1',
        'Es una compuerta universal'
      ],
      learningObjectives: [
        'Comprensión de compuertas universales',
        'Relación entre AND y NAND'
      ]
    },
    {
      id: 'half_adder',
      title: 'Sumador Medio (Half Adder)',
      difficulty: 'Avanzado',
      description: 'Construye un sumador de 1 bit que calcule A + B',
      requirements: {
        gates: ['AND', 'XOR'],
        minGates: 2,
        maxGates: 2,
        inputs: ['A', 'B'],
        expectedOutput: {
          'A=0,B=0': 0, // Suma = 0, Carry = 0
          'A=0,B=1': 1, // Suma = 1, Carry = 0
          'A=1,B=0': 1, // Suma = 1, Carry = 0
          'A=1,B=1': 0  // Suma = 0, Carry = 1
        },
        multipleOutputs: true
      },
      hints: [
        'Necesitas dos salidas: Suma y Carry',
        'Suma = A XOR B',
        'Carry = A AND B',
        'Usa una compuerta XOR y una AND'
      ],
      learningObjectives: [
        'Diseño de circuitos aritméticos',
        'Múltiples salidas',
        'Aplicación práctica de compuertas'
      ]
    },
    {
      id: 'majority_vote',
      title: 'Circuito de Votación Mayoritaria',
      difficulty: 'Avanzado',
      description: 'Crea un circuito que determine si la mayoría de 3 entradas es 1',
      requirements: {
        gates: ['AND', 'OR'],
        minGates: 4,
        maxGates: 6,
        inputs: ['A', 'B', 'C'],
        expectedOutput: {
          'A=0,B=0,C=0': 0,
          'A=0,B=0,C=1': 0,
          'A=0,B=1,C=0': 0,
          'A=0,B=1,C=1': 1,
          'A=1,B=0,C=0': 0,
          'A=1,B=0,C=1': 1,
          'A=1,B=1,C=0': 1,
          'A=1,B=1,C=1': 1
        }
      },
      hints: [
        'La mayoría significa 2 o más entradas en 1',
        'Considera todas las combinaciones de 2 entradas',
        'Usa compuertas AND para detectar pares',
        'Usa compuertas OR para combinar resultados'
      ],
      learningObjectives: [
        'Diseño de circuitos complejos',
        'Análisis de múltiples entradas',
        'Optimización de circuitos'
      ]
    }
  ]

  const startChallenge = (challenge) => {
    setActiveChallenge(challenge)
    setShowResults(false)
    setUserSolution(null)
  }

  const checkSolution = () => {
    if (!activeChallenge || !circuit) return

    const solution = {
      circuit: circuit,
      timestamp: new Date().toISOString(),
      challengeId: activeChallenge.id
    }

    setUserSolution(solution)
    setShowResults(true)

    // Verificar si la solución es correcta
    const isCorrect = validateSolution(activeChallenge, circuit)
    
    if (isCorrect) {
      setChallengeProgress(prev => ({
        ...prev,
        [activeChallenge.id]: {
          completed: true,
          timestamp: new Date().toISOString(),
          attempts: (prev[activeChallenge.id]?.attempts || 0) + 1
        }
      }))
      
      onChallengeComplete && onChallengeComplete({
        challenge: activeChallenge,
        solution: solution,
        correct: true
      })
    } else {
      setChallengeProgress(prev => ({
        ...prev,
        [activeChallenge.id]: {
          completed: false,
          timestamp: new Date().toISOString(),
          attempts: (prev[activeChallenge.id]?.attempts || 0) + 1
        }
      }))
    }
  }

  const validateSolution = (challenge, circuit) => {
    // Verificar número de compuertas
    const gateCount = circuit.filter(node => node.type !== 'input' && node.type !== 'output').length
    if (gateCount < challenge.requirements.minGates || gateCount > challenge.requirements.maxGates) {
      return false
    }

    // Verificar tipos de compuertas
    const usedGates = circuit
      .filter(node => node.data?.type)
      .map(node => node.data.type)
    
    const requiredGates = challenge.requirements.gates
    const hasRequiredGates = requiredGates.every(gate => usedGates.includes(gate))
    
    if (!hasRequiredGates) {
      return false
    }

    // Verificar salidas esperadas (simulación simplificada)
    // En una implementación completa, aquí se simularía el circuito
    // y se compararían las salidas con las esperadas
    
    return true
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-800'
      case 'Medio': return 'bg-yellow-100 text-yellow-800'
      case 'Avanzado': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCompletionStatus = (challengeId) => {
    const progress = challengeProgress[challengeId]
    if (!progress) return 'not-started'
    return progress.completed ? 'completed' : 'attempted'
  }

  if (activeChallenge) {
    return (
      <div className="space-y-6">
        {/* Header del reto activo */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {activeChallenge.title}
              </h3>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`px-2 py-1 rounded text-sm font-medium ${getDifficultyColor(activeChallenge.difficulty)}`}>
                  {activeChallenge.difficulty}
                </span>
                <span className="text-sm text-gray-600">
                  Intento {challengeProgress[activeChallenge.id]?.attempts || 0} + 1
                </span>
              </div>
            </div>
            <button
              onClick={() => setActiveChallenge(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <p className="text-gray-700 mb-4">{activeChallenge.description}</p>
          
          {/* Requisitos */}
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold text-blue-900 mb-2">Requisitos:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Compuertas permitidas: {activeChallenge.requirements.gates.join(', ')}</li>
              <li>• Número de compuertas: {activeChallenge.requirements.minGates} - {activeChallenge.requirements.maxGates}</li>
              <li>• Entradas: {activeChallenge.requirements.inputs.join(', ')}</li>
            </ul>
          </div>

          {/* Pistas */}
          <div className="bg-yellow-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold text-yellow-900 mb-2">Pistas:</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              {activeChallenge.hints.map((hint, index) => (
                <li key={index}>• {hint}</li>
              ))}
            </ul>
          </div>

          {/* Objetivos de aprendizaje */}
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold text-green-900 mb-2">Objetivos de Aprendizaje:</h4>
            <div className="flex flex-wrap gap-2">
              {activeChallenge.learningObjectives.map((objective, index) => (
                <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                  {objective}
                </span>
              ))}
            </div>
          </div>

          {/* Botón de verificación */}
          <div className="flex space-x-3">
            <button
              onClick={checkSolution}
              className="btn-primary"
            >
              Verificar Solución
            </button>
            <button
              onClick={() => setShowResults(!showResults)}
              className="btn-secondary"
            >
              {showResults ? 'Ocultar' : 'Mostrar'} Resultados
            </button>
          </div>
        </div>

        {/* Resultados */}
        {showResults && userSolution && (
          <div className="card">
            <h4 className="font-semibold text-gray-900 mb-4">Resultados de la Verificación</h4>
            
            {challengeProgress[activeChallenge.id]?.completed ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">🎉</div>
                  <div>
                    <div className="font-semibold text-green-800">¡Solución Correcta!</div>
                    <div className="text-sm text-green-700">
                      Has completado el reto exitosamente
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">❌</div>
                  <div>
                    <div className="font-semibold text-red-800">Solución Incorrecta</div>
                    <div className="text-sm text-red-700">
                      Revisa los requisitos y vuelve a intentar
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Retos de Construcción
        </h2>
        <p className="text-gray-600">
          Completa estos desafíos para dominar el diseño de circuitos lógicos
        </p>
      </div>

      {/* Lista de retos */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map(challenge => {
          const status = getCompletionStatus(challenge.id)
          
          return (
            <div
              key={challenge.id}
              className={`card cursor-pointer transition-all duration-200 hover:shadow-lg ${
                status === 'completed' ? 'bg-green-50 border-green-200' :
                status === 'attempted' ? 'bg-yellow-50 border-yellow-200' :
                'hover:scale-105'
              }`}
              onClick={() => startChallenge(challenge)}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                  {status === 'completed' && <span className="text-green-600">✓</span>}
                  {status === 'attempted' && <span className="text-yellow-600">⚠</span>}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
              
              <div className="text-xs text-gray-500">
                <div>Compuertas: {challenge.requirements.gates.join(', ')}</div>
                <div>Entradas: {challenge.requirements.inputs.join(', ')}</div>
                {challengeProgress[challenge.id] && (
                  <div>Intentos: {challengeProgress[challenge.id].attempts}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Estadísticas de progreso */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Progreso de Retos
        </h3>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">
              {Object.values(challengeProgress).filter(p => p.completed).length}
            </div>
            <div className="text-sm text-green-800">Completados</div>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded">
            <div className="text-2xl font-bold text-yellow-600">
              {Object.values(challengeProgress).filter(p => !p.completed && p.attempts > 0).length}
            </div>
            <div className="text-sm text-yellow-800">En Progreso</div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded">
            <div className="text-2xl font-bold text-gray-600">
              {challenges.length - Object.keys(challengeProgress).length}
            </div>
            <div className="text-sm text-gray-800">Pendientes</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChallengeSystem


