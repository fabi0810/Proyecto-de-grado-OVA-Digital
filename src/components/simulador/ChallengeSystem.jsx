import { useState, useEffect } from 'react'

const ChallengeSystem = ({ onStartChallenge }) => {
  const [challenges, setChallenges] = useState([])
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [generatingChallenges, setGeneratingChallenges] = useState(false)
  const [userStats, setUserStats] = useState({
    completed: 0,
    totalAttempts: 0,
    successRate: 0,
    favoriteCategory: 'basic'
  })

  const difficulties = [
    { id: 'easy', label: 'Principiante', color: 'green', description: '2-3 compuertas básicas' },
    { id: 'medium', label: 'Intermedio', color: 'yellow', description: '4-5 compuertas mixtas' },
    { id: 'hard', label: 'Avanzado', color: 'red', description: '6+ compuertas complejas' },
    { id: 'expert', label: 'Experto', color: 'purple', description: 'Circuitos optimizados' }
  ]

  const categories = [
    { id: 'all', label: 'Todos los Tipos' },
    { id: 'basic', label: 'Compuertas Básicas' },
    { id: 'arithmetic', label: 'Circuitos Aritméticos' },
    { id: 'logic', label: 'Funciones Lógicas' },
    { id: 'optimization', label: 'Optimización' },
    { id: 'sequential', label: 'Circuitos Secuenciales' }
  ]

  // 🎯 PLANTILLAS DINÁMICAS DE RETOS
  const challengeTemplates = {
    easy: {
      basic: [
        {
          titleTemplate: "Implementa una función {function} básica",
          functions: ['AND', 'OR', 'NOT', 'NAND', 'NOR'],
          generator: (func) => ({
            title: `Circuito ${func} Básico`,
            description: `Crea un circuito que implemente la función ${func} con dos entradas A y B`,
            requirements: {
              gates: [func],
              inputs: ['A', 'B'],
              minConnections: 1,
              maxGates: 2
            },
            truthTable: generateTruthTable(func, ['A', 'B']),
            hint: `La compuerta ${func} ${getFunctionHint(func)}`,
            points: 10,
            timeLimit: 300
          })
        },
        {
          titleTemplate: "Diseña un inversor para {signal}",
          signals: ['señal digital', 'entrada lógica', 'bit de control'],
          generator: (signal) => ({
            title: `Inversor de ${signal}`,
            description: `Construye un circuito que invierta la ${signal} de entrada`,
            requirements: {
              gates: ['NOT'],
              inputs: ['INPUT'],
              minConnections: 1,
              maxGates: 1
            },
            truthTable: [
              { INPUT: 0, OUTPUT: 1 },
              { INPUT: 1, OUTPUT: 0 }
            ],
            hint: 'Usa una compuerta NOT para invertir la señal',
            points: 5,
            timeLimit: 180
          })
        }
      ],
      arithmetic: [
        {
          titleTemplate: "Sumador de {bits} bit(s)",
          bits: [1],
          generator: (bits) => ({
            title: `Sumador de ${bits} Bit`,
            description: `Implementa un sumador que sume dos bits A y B`,
            requirements: {
              gates: ['XOR', 'AND'],
              inputs: ['A', 'B'],
              minConnections: 2,
              maxGates: 3
            },
            outputs: ['SUMA', 'CARRY'],
            hint: 'La suma es A XOR B, el acarreo es A AND B',
            points: 15,
            timeLimit: 420
          })
        }
      ]
    },
    medium: {
      basic: [
        {
          titleTemplate: "Función {expression} compleja",
          expressions: [
            'A AND (B OR C)',
            '(A OR B) AND (C OR D)',
            'NOT (A AND B) OR C',
            'A XOR B XOR C'
          ],
          generator: (expr) => ({
            title: `Implementar: ${expr}`,
            description: `Diseña un circuito que implemente la expresión lógica: ${expr}`,
            requirements: {
              gates: extractGatesFromExpression(expr),
              inputs: extractInputsFromExpression(expr),
              minConnections: 3,
              maxGates: 5
            },
            expression: expr,
            hint: `Descompón la expresión: ${expr}`,
            points: 25,
            timeLimit: 600
          })
        }
      ],
      arithmetic: [
        {
          titleTemplate: "Sumador completo de {bits} bits",
          bits: [2, 3],
          generator: (bits) => ({
            title: `Sumador Completo ${bits} Bits`,
            description: `Construye un sumador que maneje ${bits} bits con acarreo de entrada`,
            requirements: {
              gates: ['XOR', 'AND', 'OR'],
              inputs: ['A', 'B', 'CIN'],
              minConnections: 4,
              maxGates: 6
            },
            outputs: ['SUMA', 'COUT'],
            hint: 'Combina sumadores básicos con manejo de acarreo',
            points: 30,
            timeLimit: 900
          })
        }
      ],
      logic: [
        {
          titleTemplate: "Decodificador {type}",
          types: ['2 a 4', '1 a 2'],
          generator: (type) => ({
            title: `Decodificador ${type}`,
            description: `Diseña un decodificador que convierta ${type.split(' a ')[0]} entradas en ${type.split(' a ')[1]} salidas`,
            requirements: {
              gates: ['AND', 'NOT'],
              inputs: type === '2 a 4' ? ['A', 'B'] : ['A'],
              minConnections: type === '2 a 4' ? 6 : 2,
              maxGates: type === '2 a 4' ? 8 : 3
            },
            hint: `Cada salida corresponde a una combinación única de entradas`,
            points: 35,
            timeLimit: 720
          })
        }
      ]
    },
    hard: {
      optimization: [
        {
          titleTemplate: "Optimiza {function} usando solo {gateType}",
          functions: ['XOR', 'OR', 'AND'],
          gateTypes: ['NAND', 'NOR'],
          generator: (func, gateType) => ({
            title: `${func} Optimizado con ${gateType}`,
            description: `Implementa la función ${func} usando únicamente compuertas ${gateType}`,
            requirements: {
              gates: [gateType],
              inputs: ['A', 'B'],
              minConnections: 3,
              maxGates: func === 'XOR' ? 4 : 3,
              optimization: true
            },
            challenge: `Solo puedes usar compuertas ${gateType}`,
            hint: `Las compuertas ${gateType} son universalmente completas`,
            points: 50,
            timeLimit: 1200
          })
        }
      ],
      logic: [
        {
          titleTemplate: "Multiplexor {inputs} a 1",
          inputs: [4, 8],
          generator: (inputs) => ({
            title: `Multiplexor ${inputs}:1`,
            description: `Diseña un multiplexor que seleccione 1 de ${inputs} entradas`,
            requirements: {
              gates: ['AND', 'OR', 'NOT'],
              inputs: generateMuxInputs(inputs),
              minConnections: inputs * 2,
              maxGates: inputs + Math.log2(inputs) + 1
            },
            hint: `Usa señales de selección para elegir la entrada activa`,
            points: 45,
            timeLimit: 1500
          })
        }
      ]
    },
    expert: {
      sequential: [
        {
          titleTemplate: "Flip-Flop {type}",
          types: ['SR', 'JK', 'D'],
          generator: (type) => ({
            title: `Flip-Flop ${type}`,
            description: `Implementa un flip-flop ${type} usando compuertas básicas`,
            requirements: {
              gates: ['NAND', 'NOR'],
              inputs: getFlipFlopInputs(type),
              minConnections: 6,
              maxGates: 8,
              sequential: true
            },
            challenge: 'Circuito con memoria - mantiene estado',
            hint: `Los flip-flops ${type} ${getFlipFlopHint(type)}`,
            points: 75,
            timeLimit: 1800
          })
        }
      ],
      optimization: [
        {
          titleTemplate: "Karnaugh: Optimiza {variables} variables",
          variables: [3, 4],
          generator: (vars) => ({
            title: `Optimización K-Map ${vars} Variables`,
            description: `Optimiza una función de ${vars} variables usando mapas de Karnaugh`,
            requirements: {
              gates: ['AND', 'OR', 'NOT'],
              inputs: Array.from({length: vars}, (_, i) => String.fromCharCode(65 + i)),
              optimization: true,
              maxGates: Math.pow(2, vars - 1)
            },
            truthTable: generateRandomTruthTable(vars),
            challenge: 'Mínimo número de compuertas posible',
            hint: 'Agrupa los 1s adyacentes en el mapa de Karnaugh',
            points: 100,
            timeLimit: 2400
          })
        }
      ]
    }
  }

  // 🎲 GENERADOR INTELIGENTE DE RETOS
  const generateDynamicChallenges = (difficulty, category, count = 6) => {
    setGeneratingChallenges(true)
    
    setTimeout(() => {
      const challenges = []
      const usedChallenges = new Set()
      
      // Determinar categorías a usar
      const categoriesToUse = category === 'all' 
        ? Object.keys(challengeTemplates[difficulty] || challengeTemplates.easy)
        : [category]
      
      let attempts = 0
      const maxAttempts = count * 10

      while (challenges.length < count && attempts < maxAttempts) {
        const randomCategory = categoriesToUse[Math.floor(Math.random() * categoriesToUse.length)]
        const templates = challengeTemplates[difficulty]?.[randomCategory] || challengeTemplates.easy.basic
        
        if (templates.length === 0) {
          attempts++
          continue
        }

        const template = templates[Math.floor(Math.random() * templates.length)]
        const challenge = generateChallengeFromTemplate(template, difficulty, randomCategory, challenges.length)
        
        if (challenge) {
          const challengeKey = `${challenge.title}-${challenge.description.substring(0, 50)}`
          
          if (!usedChallenges.has(challengeKey) || attempts > maxAttempts * 0.8) {
            challenges.push(challenge)
            usedChallenges.add(challengeKey)
          }
        }
        
        attempts++
      }

      // Rellenar con retos básicos si faltan
      while (challenges.length < count) {
        const fallback = generateFallbackChallenge(challenges.length, difficulty)
        challenges.push(fallback)
      }

      setChallenges(challenges)
      setGeneratingChallenges(false)
    }, 1500)
  }

  // 🏭 GENERADOR DE RETOS ESPECÍFICOS
  const generateChallengeFromTemplate = (template, difficulty, category, id) => {
    const templateKeys = Object.keys(template).filter(key => Array.isArray(template[key]))
    
    if (templateKeys.length === 0) {
      return template.generator()
    }

    // Seleccionar valores aleatorios para las variables del template
    const variables = {}
    templateKeys.forEach(key => {
      const array = template[key]
      variables[key.slice(0, -1)] = array[Math.floor(Math.random() * array.length)] // Remover 's' final
    })

    const generatedChallenge = template.generator(Object.values(variables)[0], Object.values(variables)[1])
    
    return {
      id: `challenge-${Date.now()}-${id}`,
      difficulty,
      category,
      ...generatedChallenge,
      generated: true,
      timestamp: new Date().toISOString()
    }
  }

  const generateFallbackChallenge = (id, difficulty) => {
    const basicChallenges = [
      {
        title: "Compuerta AND Básica",
        description: "Implementa un circuito con compuerta AND",
        requirements: { gates: ['AND'], inputs: ['A', 'B'], minConnections: 1, maxGates: 1 },
        points: 10
      },
      {
        title: "Función OR Simple", 
        description: "Crea un circuito OR con dos entradas",
        requirements: { gates: ['OR'], inputs: ['A', 'B'], minConnections: 1, maxGates: 1 },
        points: 10
      },
      {
        title: "Inversor NOT",
        description: "Diseña un circuito inversor",
        requirements: { gates: ['NOT'], inputs: ['A'], minConnections: 1, maxGates: 1 },
        points: 5
      }
    ]

    const base = basicChallenges[id % basicChallenges.length]
    return {
      id: `fallback-${Date.now()}-${id}`,
      difficulty: 'easy',
      category: 'basic',
      ...base,
      generated: true,
      fallback: true
    }
  }

  // 🔧 FUNCIONES AUXILIARES
  const generateTruthTable = (func, inputs) => {
    const combinations = Math.pow(2, inputs.length)
    const table = []
    
    for (let i = 0; i < combinations; i++) {
      const row = {}
      inputs.forEach((input, index) => {
        row[input] = (i >> (inputs.length - 1 - index)) & 1
      })
      
      // Calcular output basado en la función
      row.OUTPUT = calculateFunctionOutput(func, Object.values(row))
      table.push(row)
    }
    
    return table
  }

  const calculateFunctionOutput = (func, inputs) => {
    switch (func) {
      case 'AND': return inputs.every(x => x === 1) ? 1 : 0
      case 'OR': return inputs.some(x => x === 1) ? 1 : 0
      case 'NOT': return inputs[0] === 1 ? 0 : 1
      case 'NAND': return inputs.every(x => x === 1) ? 0 : 1
      case 'NOR': return inputs.some(x => x === 1) ? 0 : 1
      case 'XOR': return inputs.filter(x => x === 1).length % 2 === 1 ? 1 : 0
      default: return 0
    }
  }

  const getFunctionHint = (func) => {
    const hints = {
      'AND': 'produce 1 solo cuando todas las entradas son 1',
      'OR': 'produce 1 cuando al menos una entrada es 1',
      'NOT': 'invierte la entrada',
      'NAND': 'es lo contrario de AND',
      'NOR': 'es lo contrario de OR',
      'XOR': 'produce 1 cuando las entradas son diferentes'
    }
    return hints[func] || 'revisa su tabla de verdad'
  }

  const extractGatesFromExpression = (expr) => {
    const gates = []
    if (expr.includes('AND')) gates.push('AND')
    if (expr.includes('OR')) gates.push('OR')
    if (expr.includes('NOT')) gates.push('NOT')
    if (expr.includes('XOR')) gates.push('XOR')
    return gates.length > 0 ? gates : ['AND', 'OR']
  }

  const extractInputsFromExpression = (expr) => {
    const inputs = []
    const matches = expr.match(/[A-Z]/g)
    if (matches) {
      return [...new Set(matches)].sort()
    }
    return ['A', 'B']
  }

  // Cargar retos al inicializar
  useEffect(() => {
    generateDynamicChallenges(selectedDifficulty, selectedCategory)
  }, [])

  // Regenerar cuando cambien los filtros
  useEffect(() => {
    generateDynamicChallenges(selectedDifficulty, selectedCategory)
  }, [selectedDifficulty, selectedCategory])

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'bg-green-50 text-green-800 border-green-200',
      medium: 'bg-yellow-50 text-yellow-800 border-yellow-200', 
      hard: 'bg-red-50 text-red-800 border-red-200',
      expert: 'bg-purple-50 text-purple-800 border-purple-200'
    }
    return colors[difficulty] || colors.easy
  }

  const getCategoryIcon = (category) => {
    const icons = {
      basic: '🔌',
      arithmetic: '➕',
      logic: '🧠',
      optimization: '⚡',
      sequential: '🔄'
    }
    return icons[category] || '⚙️'
  }

  if (generatingChallenges) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">⚙️</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Generando Retos Dinámicos</h3>
        <p className="text-sm text-gray-500 text-center max-w-md">
          Creando desafíos únicos adaptados a tu nivel...
        </p>
        <div className="mt-4 flex space-x-1">
          {[0,1,2,3,4].map(i => (
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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          🎯 Sistema de Retos Dinámicos
        </h2>
        <p className="text-gray-600">
          Desafíos generados algorítmicamente - ¡Siempre diferentes!
        </p>
      </div>

      {/* Controles */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid md:grid-cols-2 gap-6 mb-4">
          {/* Dificultad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nivel de Dificultad
            </label>
            <div className="grid grid-cols-2 gap-2">
              {difficulties.map(difficulty => (
                <button
                  key={difficulty.id}
                  onClick={() => setSelectedDifficulty(difficulty.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedDifficulty === difficulty.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title={difficulty.description}
                >
                  {difficulty.label}
                </button>
              ))}
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={() => generateDynamicChallenges(selectedDifficulty, selectedCategory)}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          🎲 Generar Nuevos Retos
        </button>
      </div>

      {/* Lista de Retos */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getCategoryIcon(challenge.category)}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
                  {difficulties.find(d => d.id === challenge.difficulty)?.label}
                </span>
              </div>
              {challenge.generated && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  🎲 Dinámico
                </span>
              )}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {challenge.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-4">
              {challenge.description}
            </p>

            {/* Requisitos */}
            <div className="bg-gray-50 rounded-md p-3 mb-4">
              <div className="text-xs font-semibold text-gray-700 mb-2">Requisitos:</div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>• Compuertas: {challenge.requirements?.gates?.join(', ')}</div>
                <div>• Entradas: {challenge.requirements?.inputs?.join(', ')}</div>
                {challenge.requirements?.maxGates && (
                  <div>• Max. compuertas: {challenge.requirements.maxGates}</div>
                )}
              </div>
            </div>

            {/* Puntos y tiempo */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {challenge.points && (
                  <span className="text-sm font-semibold text-yellow-600">
                    🏆 {challenge.points} pts
                  </span>
                )}
                {challenge.timeLimit && (
                  <span className="text-sm text-gray-500">
                    ⏱️ {Math.floor(challenge.timeLimit / 60)}min
                  </span>
                )}
              </div>
            </div>

            {/* Pista */}
            {challenge.hint && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2 mb-4">
                <div className="text-xs font-semibold text-yellow-800 mb-1">💡 Pista:</div>
                <div className="text-xs text-yellow-700">{challenge.hint}</div>
              </div>
            )}

            <button
              onClick={() => onStartChallenge(challenge)}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              🚀 Comenzar Reto
            </button>
          </div>
        ))}
      </div>

      {/* Tecnología */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3 text-center">
          🧬 Sistema de Generación Inteligente
        </h3>
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white p-3 rounded border text-center">
            <div className="text-2xl mb-2">🎲</div>
            <div className="font-semibold text-blue-800">Retos Dinámicos</div>
            <div className="text-blue-600">Miles de combinaciones únicas</div>
          </div>
          <div className="bg-white p-3 rounded border text-center">
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-semibold text-purple-800">Dificultad Adaptativa</div>
            <div className="text-purple-600">Se ajusta a tu progreso</div>
          </div>
          <div className="bg-white p-3 rounded border text-center">
            <div className="text-2xl mb-2">⚡</div>
            <div className="font-semibold text-green-800">Optimización</div>
            <div className="text-green-600">Desafíos de minimización</div>
          </div>
          <div className="bg-white p-3 rounded border text-center">
            <div className="text-2xl mb-2">🔄</div>
            <div className="font-semibold text-red-800">Siempre Nuevo</div>
            <div className="text-red-600">Nunca el mismo reto dos veces</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChallengeSystem