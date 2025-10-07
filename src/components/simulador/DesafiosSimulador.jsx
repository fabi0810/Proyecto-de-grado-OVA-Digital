import { useState, useEffect } from 'react'

const ChallengeSystem = ({ onStartChallenge }) => {
  const [challenges, setChallenges] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [generatingChallenges, setGeneratingChallenges] = useState(false)
  const [userStats, setUserStats] = useState({
    completed: 0,
    totalAttempts: 0,
    successRate: 0,
    favoriteCategory: 'basic'
  })

  const categories = [
    { id: 'all', label: 'Todos los Tipos' },
    { id: 'basic', label: 'Compuertas Básicas' },
    { id: 'arithmetic', label: 'Circuitos Aritméticos' },
    { id: 'logic', label: 'Funciones Lógicas' },
    { id: 'optimization', label: 'Optimización' },
    { id: 'sequential', label: 'Circuitos Secuenciales' }
  ]

  const difficulties = ['easy', 'medium', 'hard', 'expert']
  const difficultyLabels = {
    easy: 'Principiante',
    medium: 'Intermedio', 
    hard: 'Avanzado',
    expert: 'Experto'
  }

  // 🎯 PLANTILLAS DINÁMICAS DE RETOS MEJORADAS
  const challengeTemplates = {
    basic: [
      {
        title: "Implementa una función {function} básica",
        functions: ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR'],
        difficulties: {
          easy: { maxGates: 2, points: 10, timeLimit: 300 },
          medium: { maxGates: 3, points: 20, timeLimit: 450 },
          hard: { maxGates: 2, points: 35, timeLimit: 600, restriction: 'solo NAND' },
          expert: { maxGates: 1, points: 50, timeLimit: 300, restriction: 'optimización extrema' }
        },
        generator: function(func, difficulty) {
          const config = this.difficulties[difficulty]
          return {
            title: `Circuito ${func} - ${difficultyLabels[difficulty]}`,
            description: difficulty === 'hard' ? 
              `Crea un circuito ${func} usando solo compuertas NAND` :
              difficulty === 'expert' ?
              `Optimiza al máximo: ${func} en el menor espacio posible` :
              `Implementa la función ${func} con dos entradas A y B`,
            requirements: {
              gates: difficulty === 'hard' ? ['NAND'] : 
                     difficulty === 'expert' ? [func] : 
                     [func],
              inputs: ['A', 'B'],
              minConnections: 1,
              maxGates: config.maxGates,
              restriction: config.restriction
            },
            truthTable: generateTruthTable(func, ['A', 'B']),
            hint: difficulty === 'hard' ? 
              `Las compuertas NAND son universalmente completas` :
              `La compuerta ${func} ${getFunctionHint(func)}`,
            points: config.points,
            timeLimit: config.timeLimit,
            difficulty: difficulty
          }
        }
      },
      {
        title: "Compuertas múltiples: {expression}",
        expressions: [
          'A AND B AND C',
          'A OR B OR C', 
          '(A AND B) OR C',
          '(A OR B) AND (C OR D)',
          'NOT (A AND B) OR C',
          'A XOR B XOR C'
        ],
        difficulties: {
          easy: { maxGates: 3, points: 15, timeLimit: 400 },
          medium: { maxGates: 5, points: 30, timeLimit: 600 },
          hard: { maxGates: 4, points: 45, timeLimit: 800 },
          expert: { maxGates: 3, points: 65, timeLimit: 900 }
        },
        generator: function(expr, difficulty)  {
          const config = this.difficulties[difficulty]
          return {
            title: `${difficultyLabels[difficulty]}: ${expr}`,
            description: `Implementa la expresión lógica: ${expr}`,
            requirements: {
              gates: extractGatesFromExpression(expr),
              inputs: extractInputsFromExpression(expr),
              minConnections: 2,
              maxGates: config.maxGates
            },
            expression: expr,
            truthTable: generateExpressionTruthTable(expr),
            hint: `Descompón paso a paso: ${expr}`,
            points: config.points,
            timeLimit: config.timeLimit,
            difficulty: difficulty
          }
        }
      }
    ],
    
    arithmetic: [
      {
        title: "Sumador de {bits} bit(s)",
        bits: [1, 2, 3, 4],
        difficulties: {
          easy: { maxGates: 3, points: 20, timeLimit: 500 },
          medium: { maxGates: 6, points: 35, timeLimit: 700 },
          hard: { maxGates: 8, points: 50, timeLimit: 900 },
          expert: { maxGates: 10, points: 75, timeLimit: 1200 }
        },
        generator: function(bits, difficulty) {
          const config = this.difficulties[difficulty]
          const complexBits = difficulty === 'easy' ? 1 : 
                             difficulty === 'medium' ? Math.min(bits, 2) :
                             difficulty === 'hard' ? Math.min(bits, 3) : bits
          
          return {
            title: `Sumador ${complexBits} Bit${complexBits > 1 ? 's' : ''} - ${difficultyLabels[difficulty]}`,
            description: `Construye un sumador completo de ${complexBits} bit${complexBits > 1 ? 's' : ''}`,
            requirements: {
              gates: ['XOR', 'AND', 'OR'],
              inputs: complexBits === 1 ? ['A', 'B'] : ['A', 'B', 'CIN'],
              minConnections: complexBits * 2,
              maxGates: config.maxGates
            },
            outputs: ['SUMA', 'CARRY'],
            hint: complexBits === 1 ? 
              'SUMA = A XOR B, CARRY = A AND B' :
              'Conecta sumadores básicos en cascada',
            points: config.points,
            timeLimit: config.timeLimit,
            difficulty: difficulty
          }
        }
      }
    ],

    logic: [
      {
        title: "Decodificador {inputs} a {outputs}",
        configs: [
          { inputs: 1, outputs: 2 },
          { inputs: 2, outputs: 4 }, 
          { inputs: 3, outputs: 8 }
        ],
        difficulties: {
          easy: { maxGates: 4, points: 25, timeLimit: 600 },
          medium: { maxGates: 8, points: 40, timeLimit: 900 },
          hard: { maxGates: 12, points: 60, timeLimit: 1200 },
          expert: { maxGates: 16, points: 85, timeLimit: 1500 }
        },
        generator: function(config, difficulty)  {
          const diffConfig = this.difficulties[difficulty]
          const actualInputs = Math.min(config.inputs, difficulty === 'easy' ? 2 : 3)
          const actualOutputs = Math.pow(2, actualInputs)
          
          return {
            title: `Decodificador ${actualInputs}:${actualOutputs} - ${difficultyLabels[difficulty]}`,
            description: `Diseña un decodificador ${actualInputs} a ${actualOutputs}`,
            requirements: {
              gates: ['AND', 'NOT'],
              inputs: Array.from({length: actualInputs}, (_, i) => String.fromCharCode(65 + i)),
              minConnections: actualOutputs,
              maxGates: diffConfig.maxGates
            },
            hint: `Cada salida corresponde a una combinación única`,
            points: diffConfig.points,
            timeLimit: diffConfig.timeLimit,
            difficulty: difficulty
          }
        }
      },
      {
        title: "Multiplexor {size}:1",
        sizes: [2, 4, 8],
        difficulties: {
          easy: { maxGates: 6, points: 30, timeLimit: 700 },
          medium: { maxGates: 12, points: 50, timeLimit: 1000 },
          hard: { maxGates: 16, points: 70, timeLimit: 1300 },
          expert: { maxGates: 20, points: 95, timeLimit: 1600 }
        },
        generator: function(size, difficulty)  {
          const config = this.difficulties[difficulty]
          const actualSize = difficulty === 'easy' ? 2 : 
                            difficulty === 'medium' ? Math.min(size, 4) : size
          
          return {
            title: `Multiplexor ${actualSize}:1 - ${difficultyLabels[difficulty]}`,
            description: `Implementa un MUX que seleccione 1 de ${actualSize} entradas`,
            requirements: {
              gates: ['AND', 'OR', 'NOT'],
              inputs: generateMuxInputs(actualSize),
              minConnections: actualSize * 2,
              maxGates: config.maxGates
            },
            hint: `Usa señales de selección para controlar las entradas`,
            points: config.points,
            timeLimit: config.timeLimit,
            difficulty: difficulty
          }
        }
      }
    ],

    optimization: [
      {
        title: "Optimización con {gateType}",
        gateTypes: ['NAND', 'NOR'],
        functions: ['XOR', 'OR', 'AND', 'NOT'],
        difficulties: {
          easy: { maxGates: 4, points: 40, timeLimit: 800 },
          medium: { maxGates: 3, points: 55, timeLimit: 1000 },
          hard: { maxGates: 2, points: 75, timeLimit: 1200 },
          expert: { maxGates: 1, points: 100, timeLimit: 900 }
        },
        generator: function(gateType, difficulty)  {
          const config = this.difficulties[difficulty]
          const functions = ['XOR', 'OR', 'AND', 'NOT']
          const func = functions[Math.floor(Math.random() * functions.length)]
          
          return {
            title: `${func} con ${gateType} - ${difficultyLabels[difficulty]}`,
            description: `Implementa ${func} usando únicamente compuertas ${gateType}`,
            requirements: {
              gates: [gateType],
              inputs: func === 'NOT' ? ['A'] : ['A', 'B'],
              minConnections: 2,
              maxGates: config.maxGates,
              optimization: true
            },
            challenge: `Solo compuertas ${gateType} permitidas`,
            hint: `${gateType} es universalmente completa - busca patrones`,
            points: config.points,
            timeLimit: config.timeLimit,
            difficulty: difficulty
          }
        }
      }
    ],

    sequential: [
      {
        title: "Flip-Flop {type}",
        types: ['SR', 'JK', 'D', 'T'],
        difficulties: {
          easy: { maxGates: 6, points: 50, timeLimit: 1000 },
          medium: { maxGates: 8, points: 70, timeLimit: 1300 },
          hard: { maxGates: 10, points: 90, timeLimit: 1600 },
          expert: { maxGates: 12, points: 120, timeLimit: 2000 }
        },
        generator: function(type, difficulty)  {
          const config = this.difficulties[difficulty]
          
          return {
            title: `Flip-Flop ${type} - ${difficultyLabels[difficulty]}`,
            description: `Construye un FF ${type} usando compuertas básicas`,
            requirements: {
              gates: ['NAND', 'NOR', 'AND', 'OR', 'NOT'],
              inputs: getFlipFlopInputs(type),
              minConnections: 4,
              maxGates: config.maxGates,
              sequential: true
            },
            challenge: 'Circuito con memoria - mantiene estado',
            hint: `FF ${type}: ${getFlipFlopHint(type)}`,
            points: config.points,
            timeLimit: config.timeLimit,
            difficulty: difficulty
          }
        }
      }
    ]
  }

  const generateVariedChallenges = (category, count = 6) => {
    setGeneratingChallenges(true)
    
    setTimeout(() => {
      const challenges = []
      const usedChallenges = new Set()
      
      // Determinar categorías a usar
      const categoriesToUse = category === 'all' 
        ? Object.keys(challengeTemplates)
        : [category]
      
      let attempts = 0
      const maxAttempts = count * 15

      while (challenges.length < count && attempts < maxAttempts) {
        // Selección aleatoria de categoría
        const randomCategory = categoriesToUse[Math.floor(Math.random() * categoriesToUse.length)]
        const templates = challengeTemplates[randomCategory] || []
        
        if (templates.length === 0) {
          attempts++
          continue
        }

        // Selección aleatoria de template
        const template = templates[Math.floor(Math.random() * templates.length)]
        
        // Selección aleatoria de dificultad (variada)
        const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)]
        
        const challenge = generateChallengeFromTemplate(template, randomDifficulty, randomCategory, challenges.length)
        
        if (challenge) {
          const challengeKey = `${challenge.title}-${challenge.description.substring(0, 30)}`
          
          if (!usedChallenges.has(challengeKey) || attempts > maxAttempts * 0.7) {
            challenges.push(challenge)
            usedChallenges.add(challengeKey)
          }
        }
        
        attempts++
      }

      // Rellenar con retos básicos si faltan
      while (challenges.length < count) {
        const fallback = generateFallbackChallenge(challenges.length)
        challenges.push(fallback)
      }

      // Ordenar por dificultad para mejor presentación
      challenges.sort((a, b) => {
        const diffOrder = { easy: 1, medium: 2, hard: 3, expert: 4 }
        return diffOrder[a.difficulty] - diffOrder[b.difficulty]
      })

      setChallenges(challenges)
      setGeneratingChallenges(false)
    }, 1200)
  }

  const generateChallengeFromTemplate = (template, difficulty, category, id) => {
    try {
      const optionKeys = Object.keys(template).filter(key => 
        Array.isArray(template[key]) && key !== 'difficulties'
      )
      
      if (optionKeys.length === 0) {
        return generateBasicChallenge(difficulty, category, id)
      }

      // Seleccionar valores aleatorios
      const selectedOptions = {}
      optionKeys.forEach(key => {
        const options = template[key]
        selectedOptions[key] = options[Math.floor(Math.random() * options.length)]
      })

      // Generar el reto usando el generador del template
      const baseChallenge = template.generator ? 
        template.generator(Object.values(selectedOptions)[0], difficulty) :
        generateBasicChallenge(difficulty, category, id)

      return {
        id: `challenge-${Date.now()}-${id}`,
        difficulty,
        category,
        ...baseChallenge,
        generated: true,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.warn('Error generando challenge:', error)
      return generateBasicChallenge(difficulty, category, id)
    }
  }

  const generateBasicChallenge = (difficulty, category, id) => {
    const basicChallenges = {
      easy: {
        title: "Compuerta AND Básica",
        description: "Implementa un circuito con compuerta AND",
        points: 10,
        timeLimit: 300
      },
      medium: {
        title: "Función OR con 3 entradas", 
        description: "Crea un circuito OR con tres entradas",
        points: 25,
        timeLimit: 500
      },
      hard: {
        title: "XOR optimizado con NAND",
        description: "Implementa XOR usando solo NAND",
        points: 45,
        timeLimit: 800
      },
      expert: {
        title: "Función compleja minimizada",
        description: "Optimiza al máximo una función booleana",
        points: 75,
        timeLimit: 1200
      }
    }

    const base = basicChallenges[difficulty] || basicChallenges.easy
    return {
      id: `fallback-${Date.now()}-${id}`,
      difficulty,
      category: category || 'basic',
      ...base,
      requirements: {
        gates: difficulty === 'hard' ? ['NAND'] : ['AND', 'OR', 'NOT'],
        inputs: ['A', 'B'],
        minConnections: 1,
        maxGates: difficulty === 'easy' ? 2 : difficulty === 'medium' ? 4 : 6
      },
      hint: `Circuito de nivel ${difficultyLabels[difficulty]}`,
      generated: true,
      fallback: true
    }
  }

  // 🔧 FUNCIONES AUXILIARES MEJORADAS
  const generateTruthTable = (func, inputs) => {
    const combinations = Math.pow(2, inputs.length)
    const table = []
    
    for (let i = 0; i < combinations; i++) {
      const row = {}
      inputs.forEach((input, index) => {
        row[input] = (i >> (inputs.length - 1 - index)) & 1
      })
      
      row.OUTPUT = calculateFunctionOutput(func, Object.values(row))
      table.push(row)
    }
    
    return table
  }

  const generateExpressionTruthTable = (expr) => {
    const inputs = extractInputsFromExpression(expr)
    const combinations = Math.pow(2, inputs.length)
    const table = []
    
    for (let i = 0; i < combinations; i++) {
      const row = {}
      inputs.forEach((input, index) => {
        row[input] = (i >> (inputs.length - 1 - index)) & 1
      })
      
      // Evaluar expresión (simplificado)
      row.OUTPUT = Math.floor(Math.random() * 2) // Placeholder
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
    const matches = expr.match(/[A-Z]/g)
    if (matches) {
      return [...new Set(matches)].sort()
    }
    return ['A', 'B']
  }

  const generateMuxInputs = (size) => {
    const inputs = []
    // Entradas de datos
    for (let i = 0; i < size; i++) {
      inputs.push(`D${i}`)
    }
    // Señales de selección
    const selectBits = Math.ceil(Math.log2(size))
    for (let i = 0; i < selectBits; i++) {
      inputs.push(`S${i}`)
    }
    return inputs
  }

  const getFlipFlopInputs = (type) => {
    const inputs = {
      'SR': ['S', 'R', 'CLK'],
      'JK': ['J', 'K', 'CLK'], 
      'D': ['D', 'CLK'],
      'T': ['T', 'CLK']
    }
    return inputs[type] || ['D', 'CLK']
  }

  const getFlipFlopHint = (type) => {
    const hints = {
      'SR': 'Set-Reset con prioridad',
      'JK': 'Master-Slave sin ambigüedad',
      'D': 'Data transparente con clock',
      'T': 'Toggle cambia estado'
    }
    return hints[type] || 'flip-flop con memoria'
  }

  // Cargar retos al inicializar
  useEffect(() => {
    generateVariedChallenges(selectedCategory)
  }, [])

  // Regenerar cuando cambie la categoría
  useEffect(() => {
    generateVariedChallenges(selectedCategory)
  }, [selectedCategory])

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
        <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Generando Retos Variados</h3>
        <p className="text-sm text-gray-500 text-center max-w-md">
          Creando desafíos de diferentes niveles...
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
          🎯 Retos de Dificultad Variada
        </h2>
        <p className="text-gray-600">
          Desafíos automáticos que combinan todos los niveles de dificultad
        </p>
      </div>

      {/* Controles Simplificados */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Solo categoría */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Retos
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

          <button
            onClick={() => generateVariedChallenges(selectedCategory)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            🎲 Generar Nuevos Retos
          </button>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-700">
            <strong>✨ Dificultad Automática:</strong> Cada generación incluye retos de todos los niveles (Principiante, Intermedio, Avanzado y Experto) mezclados aleatoriamente.
          </p>
        </div>
      </div>

      {/* Lista de Retos */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getCategoryIcon(challenge.category)}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
                  {difficultyLabels[challenge.difficulty]}
                </span>
              </div>
              {challenge.generated && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  🎲 Variado
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
                {challenge.requirements?.restriction && (
                  <div className="text-red-600">• Restricción: {challenge.requirements.restriction}</div>
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

            {/* Desafío especial */}
            {challenge.challenge && (
              <div className="bg-red-50 border border-red-200 rounded-md p-2 mb-4">
                <div className="text-xs font-semibold text-red-800 mb-1">🎯 Desafío:</div>
                <div className="text-xs text-red-700">{challenge.challenge}</div>
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

      {/* Estadísticas */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
        <h3 className="font-semibold text-green-900 mb-3 text-center">
          📊 Distribución de Dificultades
        </h3>
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          {difficulties.map(diff => {
            const count = challenges.filter(c => c.difficulty === diff).length
            const percentage = challenges.length > 0 ? Math.round((count / challenges.length) * 100) : 0
            return (
              <div key={diff} className="bg-white p-3 rounded border text-center">
                <div className="text-2xl mb-2">
                  {diff === 'easy' ? '🟢' : diff === 'medium' ? '🟡' : diff === 'hard' ? '🔴' : '🟣'}
                </div>
                <div className="font-semibold text-gray-800">{difficultyLabels[diff]}</div>
                <div className="text-gray-600">{count} retos ({percentage}%)</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Características del sistema */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3 text-center">
          🧬 Sistema Inteligente de Generación
        </h3>
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white p-3 rounded border text-center">
            <div className="text-2xl mb-2">🎲</div>
            <div className="font-semibold text-blue-800">Dificultad Variada</div>
            <div className="text-blue-600">Automáticamente mezclada</div>
          </div>
          <div className="bg-white p-3 rounded border text-center">
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-semibold text-purple-800">Siempre Único</div>
            <div className="text-purple-600">Nunca el mismo reto</div>
          </div>
          <div className="bg-white p-3 rounded border text-center">
            <div className="text-2xl mb-2">⚡</div>
            <div className="font-semibold text-green-800">Progresión Natural</div>
            <div className="text-green-600">De fácil a experto</div>
          </div>
          <div className="bg-white p-3 rounded border text-center">
            <div className="text-2xl mb-2">🔄</div>
            <div className="font-semibold text-red-800">Infinitos Retos</div>
            <div className="text-red-600">Generación ilimitada</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChallengeSystem