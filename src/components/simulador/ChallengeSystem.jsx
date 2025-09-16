import { useState } from 'react'

const ChallengeSystem = () => {
  const [selectedChallenge, setSelectedChallenge] = useState(null)
  const [completedChallenges, setCompletedChallenges] = useState(new Set())

  const challenges = [
    {
      id: 'and_basic',
      title: 'Compuerta AND Básica',
      description: 'Construye un circuito con una compuerta AND que tenga dos entradas A y B',
      difficulty: 'Fácil',
      requirements: {
        gates: ['AND'],
        inputs: ['A', 'B'],
        expectedOutput: 'A AND B'
      },
      hints: [
        'Arrastra una compuerta AND desde la paleta',
        'Conecta las entradas A y B a la compuerta',
        'La salida será 1 solo cuando ambas entradas sean 1'
      ]
    },
    {
      id: 'or_basic',
      title: 'Compuerta OR Básica', 
      description: 'Construye un circuito con una compuerta OR que tenga dos entradas A y B',
      difficulty: 'Fácil',
      requirements: {
        gates: ['OR'],
        inputs: ['A', 'B'],
        expectedOutput: 'A OR B'
      },
      hints: [
        'Arrastra una compuerta OR desde la paleta',
        'Conecta las entradas A y B a la compuerta',
        'La salida será 1 cuando al menos una entrada sea 1'
      ]
    },
    {
      id: 'not_basic',
      title: 'Compuerta NOT Básica',
      description: 'Construye un circuito con una compuerta NOT que tenga una entrada A',
      difficulty: 'Fácil',
      requirements: {
        gates: ['NOT'],
        inputs: ['A'],
        expectedOutput: 'NOT A'
      },
      hints: [
        'Arrastra una compuerta NOT desde la paleta',
        'Conecta la entrada A a la compuerta',
        'La salida será el inverso de la entrada'
      ]
    },
    {
      id: 'xor_basic',
      title: 'Compuerta XOR Básica',
      description: 'Construye un circuito con una compuerta XOR que tenga dos entradas A y B',
      difficulty: 'Medio',
      requirements: {
        gates: ['XOR'],
        inputs: ['A', 'B'],
        expectedOutput: 'A XOR B'
      },
      hints: [
        'Arrastra una compuerta XOR desde la paleta',
        'Conecta las entradas A y B a la compuerta',
        'La salida será 1 cuando las entradas sean diferentes'
      ]
    },
    {
      id: 'complex_logic',
      title: 'Lógica Compleja',
      description: 'Combina múltiples compuertas para crear un circuito más complejo',
      difficulty: 'Avanzado',
      requirements: {
        gates: ['AND', 'OR', 'NOT'],
        inputs: ['A', 'B', 'C'],
        expectedOutput: 'A AND (B OR NOT C)'
      },
      hints: [
        'Necesitarás al menos 3 compuertas',
        'Usa una compuerta NOT para invertir C',
        'Usa una compuerta OR para B OR NOT C',
        'Usa una compuerta AND para el resultado final'
      ]
    },
    {
      id: 'nand_nor',
      title: 'Compuertas NAND y NOR',
      description: 'Construye un circuito usando compuertas NAND y NOR',
      difficulty: 'Avanzado',
      requirements: {
        gates: ['NAND', 'NOR'],
        inputs: ['A', 'B'],
        expectedOutput: 'NAND(A, B) AND NOR(A, B)'
      },
      hints: [
        'Las compuertas NAND y NOR son inversas de AND y OR',
        'NAND: salida 0 solo cuando ambas entradas son 1',
        'NOR: salida 1 solo cuando ambas entradas son 0'
      ]
    }
  ]

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-800 border-green-200'
      case 'Medio': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Avanzado': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'Fácil': return '🟢'
      case 'Medio': return '🟡'
      case 'Avanzado': return '🔴'
      default: return '⚪'
    }
  }

  const handleStartChallenge = (challenge) => {
    setSelectedChallenge(challenge)
  }

  const handleCompleteChallenge = (challengeId) => {
    setCompletedChallenges(prev => new Set([...prev, challengeId]))
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Desafíos de Circuitos</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Completa estos desafíos para dominar el diseño de circuitos lógicos. 
          Cada desafío te enseñará conceptos específicos y te ayudará a desarrollar tus habilidades.
        </p>
      </div>

      {/* Estadísticas de progreso */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tu Progreso</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {completedChallenges.size}
            </div>
            <div className="text-sm text-gray-600">Completados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {challenges.length - completedChallenges.size}
            </div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round((completedChallenges.size / challenges.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Progreso</div>
          </div>
        </div>
        
        {/* Barra de progreso */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(completedChallenges.size / challenges.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Lista de desafíos */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map(challenge => (
          <div 
            key={challenge.id} 
            className={`bg-white rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-lg ${
              completedChallenges.has(challenge.id) 
                ? 'border-green-300 bg-green-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getDifficultyIcon(challenge.difficulty)}</span>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{challenge.description}</p>
            
            {/* Requisitos */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">Requisitos:</h4>
              <div className="space-y-1 text-xs text-gray-600">
                <div>• Compuertas: {challenge.requirements.gates.join(', ')}</div>
                <div>• Entradas: {challenge.requirements.inputs.join(', ')}</div>
                <div>• Salida: {challenge.requirements.expectedOutput}</div>
              </div>
            </div>

            {/* Estado del desafío */}
            <div className="mb-4">
              {completedChallenges.has(challenge.id) ? (
                <div className="flex items-center text-green-600 text-sm">
                  <span className="mr-2">✅</span>
                  <span className="font-semibold">Completado</span>
                </div>
              ) : (
                <div className="flex items-center text-gray-500 text-sm">
                  <span className="mr-2">⏳</span>
                  <span>Pendiente</span>
                </div>
              )}
            </div>

            {/* Botón de acción */}
            <button 
              onClick={() => handleStartChallenge(challenge)}
              className={`w-full px-4 py-2 rounded text-sm font-medium transition-colors ${
                completedChallenges.has(challenge.id)
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {completedChallenges.has(challenge.id) ? 'Ver Detalles' : 'Iniciar Desafío'}
            </button>
          </div>
        ))}
      </div>

      {/* Modal de desafío seleccionado */}
      {selectedChallenge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedChallenge.title}
                </h3>
                <button
                  onClick={() => setSelectedChallenge(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Descripción:</h4>
                  <p className="text-gray-600">{selectedChallenge.description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Requisitos:</h4>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-sm space-y-1">
                      <div><strong>Compuertas:</strong> {selectedChallenge.requirements.gates.join(', ')}</div>
                      <div><strong>Entradas:</strong> {selectedChallenge.requirements.inputs.join(', ')}</div>
                      <div><strong>Salida esperada:</strong> {selectedChallenge.requirements.expectedOutput}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Pistas:</h4>
                  <div className="space-y-2">
                    {selectedChallenge.hints.map((hint, index) => (
                      <div key={index} className="flex items-start text-sm text-gray-600">
                        <span className="mr-2 text-blue-500">💡</span>
                        <span>{hint}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setSelectedChallenge(null)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Ir al Simulador
                  </button>
                  <button
                    onClick={() => setSelectedChallenge(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChallengeSystem