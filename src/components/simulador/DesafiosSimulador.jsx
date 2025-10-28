import { useState, useEffect } from 'react'

const ChallengeSystem = ({ onStartChallenge }) => {
  const [challenges, setChallenges] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [generatingChallenges, setGeneratingChallenges] = useState(false)
  const [showCustomModal, setShowCustomModal] = useState(false)
  const [customChallenge, setCustomChallenge] = useState({
    title: '',
    description: '',
    expression: '',
    gates: [],
    inputs: [],
    points: 50,
    timeLimit: 600
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

  const availableGates = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR']

  // 🎯 PLANTILLAS MEJORADAS DE RETOS
  const challengeTemplates = {
    basic: [
      {
        title: "Función {function} con {inputs} entradas",
        functions: ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR'],
        inputCounts: [2, 3, 4],
        difficulties: {
          easy: { maxGates: 2, points: 15, timeLimit: 300 },
          medium: { maxGates: 3, points: 25, timeLimit: 450 },
          hard: { maxGates: 4, points: 40, timeLimit: 600 },
          expert: { maxGates: 2, points: 60, timeLimit: 400 }
        },
        generator: function(func, difficulty) {
          const config = this.difficulties[difficulty]
          const numInputs = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4
          const inputs = Array.from({length: numInputs}, (_, i) => String.fromCharCode(65 + i))
          
          return {
            title: `${func} con ${numInputs} entradas - ${difficultyLabels[difficulty]}`,
            description: difficulty === 'expert' ? 
              `Implementa ${func} de ${numInputs} entradas usando el mínimo de compuertas` :
              `Crea un circuito ${func} con ${numInputs} entradas: ${inputs.join(', ')}`,
            requirements: {
              gates: difficulty === 'expert' ? availableGates : [func, 'AND', 'OR', 'NOT'],
              inputs: inputs,
              minConnections: numInputs - 1,
              maxGates: config.maxGates
            },
            hint: difficulty === 'expert' ? 
              'Busca optimizar usando propiedades algebraicas' :
              `La compuerta ${func} ${getFunctionHint(func)}`,
            points: config.points,
            timeLimit: config.timeLimit,
            difficulty: difficulty
          }
        }
      },
      {
        title: "Expresión compleja: {expression}",
        expressions: [
          'A·B + A·C',
          'A·B + B·C + A·C',
          '(A+B)·(A+C)',
          'A·B·C + A\'·B·C',
          '(A⊕B)·C',
          'A·B + A\'·C + B·C\''
        ],
        difficulties: {
          easy: { maxGates: 4, points: 20, timeLimit: 400 },
          medium: { maxGates: 6, points: 35, timeLimit: 600 },
          hard: { maxGates: 5, points: 50, timeLimit: 800 },
          expert: { maxGates: 3, points: 75, timeLimit: 900 }
        },
        generator: function(expr, difficulty) {
          const config = this.difficulties[difficulty]
          
          return {
            title: `${difficultyLabels[difficulty]}: ${expr}`,  
            description: difficulty === 'expert' ?
              `Implementa la expresión minimizada de: ${expr}` :
              `Construye el circuito para: ${expr}`,
            requirements: {
              gates: difficulty === 'hard' ? ['NAND', 'NOR'] : availableGates,
              inputs: extractInputsFromExpression(expr),
              minConnections: 2,
              maxGates: config.maxGates
            },
            expression: expr,
            hint: difficulty === 'expert' ? 
              'Simplifica algebraicamente antes de implementar' :
              `Analiza la expresión paso a paso`,
            points: config.points,
            timeLimit: config.timeLimit,
            difficulty: difficulty
          }
        }
      }
    ],
    
    arithmetic: [
      {
        title: "Sumador {type}",
        types: ['Half-Adder', 'Full-Adder', '2-bit', '3-bit'],
        difficulties: {
          easy: { maxGates: 4, points: 25, timeLimit: 500 },
          medium: { maxGates: 8, points: 40, timeLimit: 700 },
          hard: { maxGates: 12, points: 60, timeLimit: 900 },
          expert: { maxGates: 10, points: 85, timeLimit: 1200 }
        },
        generator: function(type, difficulty) {
          const config = this.difficulties[difficulty]
          
          const specs = {
            'Half-Adder': { inputs: ['A', 'B'], outputs: ['S', 'C'] },
            'Full-Adder': { inputs: ['A', 'B', 'Cin'], outputs: ['S', 'Cout'] },
            '2-bit': { inputs: ['A0', 'A1', 'B0', 'B1'], outputs: ['S0', 'S1', 'C'] },
            '3-bit': { inputs: ['A0', 'A1', 'A2', 'B0', 'B1', 'B2'], outputs: ['S0', 'S1', 'S2', 'C'] }
          }
          
          const spec = specs[type] || specs['Half-Adder']
          
          return {
            title: `${type} - ${difficultyLabels[difficulty]}`,
            description: `Diseña un ${type} completo`,
            requirements: {
              gates: ['XOR', 'AND', 'OR'],
              inputs: spec.inputs,
              minConnections: spec.inputs.length,
              maxGates: config.maxGates
            },
            outputs: spec.outputs,
            hint: type === 'Half-Adder' ? 
              'S = A⊕B, C = A·B' :
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
        title: "Multiplexor {size}:1",
        sizes: ['2:1', '4:1', '8:1'],
        difficulties: {
          easy: { maxGates: 6, points: 30, timeLimit: 700 },
          medium: { maxGates: 12, points: 50, timeLimit: 1000 },
          hard: { maxGates: 16, points: 70, timeLimit: 1300 },
          expert: { maxGates: 14, points: 95, timeLimit: 1600 }
        },
        generator: function(size, difficulty) {
          const config = this.difficulties[difficulty]
          const numInputs = parseInt(size.split(':')[0])
          
          return {
            title: `MUX ${size} - ${difficultyLabels[difficulty]}`,
            description: `Implementa un multiplexor que seleccione 1 de ${numInputs} entradas`,
            requirements: {
              gates: ['AND', 'OR', 'NOT'],
              inputs: generateMuxInputs(numInputs),
              minConnections: numInputs * 2,
              maxGates: config.maxGates
            },
            hint: `Usa ${Math.ceil(Math.log2(numInputs))} señales de selección`,
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
        difficulties: {
          easy: { maxGates: 5, points: 40, timeLimit: 800 },
          medium: { maxGates: 4, points: 55, timeLimit: 1000 },
          hard: { maxGates: 3, points: 75, timeLimit: 1200 },
          expert: { maxGates: 2, points: 100, timeLimit: 900 }
        },
        generator: function(gateType, difficulty) {
          const config = this.difficulties[difficulty]
          const targetFunctions = {
            easy: ['OR', 'AND'],
            medium: ['XOR', 'NOT'],
            hard: ['XNOR', 'MUX'],
            expert: ['Full-Adder', 'Majority']
          }
          
          const func = targetFunctions[difficulty][Math.floor(Math.random() * targetFunctions[difficulty].length)]
          
          return {
            title: `${func} solo con ${gateType} - ${difficultyLabels[difficulty]}`,
            description: `Implementa ${func} usando únicamente compuertas ${gateType}`,
            requirements: {
              gates: [gateType],
              inputs: ['A', 'B', 'C'].slice(0, func === 'NOT' ? 1 : 2),
              minConnections: 2,
              maxGates: config.maxGates,
              optimization: true
            },
            challenge: `Solo ${gateType} permitidas`,
            hint: `${gateType} es universalmente completa`,
            points: config.points,
            timeLimit: config.timeLimit,
            difficulty: difficulty
          }
        }
      }
    ],

    sequential: [
      {
        title: "Latch {type}",
        types: ['SR', 'D', 'JK'],
        difficulties: {
          easy: { maxGates: 6, points: 50, timeLimit: 1000 },
          medium: { maxGates: 8, points: 70, timeLimit: 1300 },
          hard: { maxGates: 10, points: 90, timeLimit: 1600 },
          expert: { maxGates: 12, points: 120, timeLimit: 2000 }
        },
        generator: function(type, difficulty) {
          const config = this.difficulties[difficulty]
          
          return {
            title: `Latch ${type} - ${difficultyLabels[difficulty]}`,
            description: `Construye un Latch ${type} con compuertas básicas`,
            requirements: {
              gates: ['NAND', 'NOR', 'AND', 'OR', 'NOT'],
              inputs: getFlipFlopInputs(type),
              minConnections: 4,
              maxGates: config.maxGates,
              sequential: true
            },
            challenge: 'Circuito con memoria',
            hint: `Latch ${type}: ${getFlipFlopHint(type)}`,
            points: config.points,
            timeLimit: config.timeLimit,
            difficulty: difficulty
          }
        }
      }
    ]
  }

  // 🆕 FUNCIÓN PARA AGREGAR DESAFÍO PERSONALIZADO
  const handleAddCustomChallenge = () => {
    if (!customChallenge.title || !customChallenge.expression) {
      alert('⚠️ Por favor completa al menos el título y la expresión booleana')
      return
    }

    const newChallenge = {
      id: `custom-${Date.now()}`,
      title: customChallenge.title,
      description: customChallenge.description || 'Desafío personalizado del profesor',
      expression: customChallenge.expression,
      requirements: {
        gates: customChallenge.gates.length > 0 ? customChallenge.gates : availableGates,
        inputs: customChallenge.inputs.length > 0 ? customChallenge.inputs : extractInputsFromExpression(customChallenge.expression),
        minConnections: 1,
        maxGates: 20
      },
      points: customChallenge.points,
      timeLimit: customChallenge.timeLimit,
      difficulty: 'medium',
      category: 'custom',
      custom: true,
      generated: false
    }

    setChallenges(prev => [newChallenge, ...prev])
    setShowCustomModal(false)
    
    // Resetear formulario
    setCustomChallenge({
      title: '',
      description: '',
      expression: '',
      gates: [],
      inputs: [],
      points: 50,
      timeLimit: 600
    })

    alert('✅ Desafío personalizado agregado exitosamente')
  }

  const generateVariedChallenges = (category, count = 6) => {
    setGeneratingChallenges(true)
    
    setTimeout(() => {
      const challenges = []
      const usedChallenges = new Set()
      
      const categoriesToUse = category === 'all' 
        ? Object.keys(challengeTemplates)
        : [category]
      
      let attempts = 0
      const maxAttempts = count * 15

      while (challenges.length < count && attempts < maxAttempts) {
        const randomCategory = categoriesToUse[Math.floor(Math.random() * categoriesToUse.length)]
        const templates = challengeTemplates[randomCategory] || []
        
        if (templates.length === 0) {
          attempts++
          continue
        }

        const template = templates[Math.floor(Math.random() * templates.length)]
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

      while (challenges.length < count) {
        const fallback = generateFallbackChallenge(challenges.length)
        challenges.push(fallback)
      }

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

      const selectedOptions = {}
      optionKeys.forEach(key => {
        const options = template[key]
        selectedOptions[key] = options[Math.floor(Math.random() * options.length)]
      })

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
        title: "XOR optimizado",
        description: "Implementa XOR usando mínimas compuertas",
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
        gates: availableGates,
        inputs: ['A', 'B', 'C'].slice(0, difficulty === 'easy' ? 2 : 3),
        minConnections: 1,
        maxGates: difficulty === 'easy' ? 2 : difficulty === 'medium' ? 4 : 6
      },
      hint: `Circuito de nivel ${difficultyLabels[difficulty]}`,
      generated: true,
      fallback: true
    }
  }

  // Funciones auxiliares
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

  const extractInputsFromExpression = (expr) => {
    const matches = expr.match(/[A-Z]/g)
    if (matches) {
      return [...new Set(matches)].sort()
    }
    return ['A', 'B']
  }

  const generateMuxInputs = (size) => {
    const inputs = []
    for (let i = 0; i < size; i++) {
      inputs.push(`D${i}`)
    }
    const selectBits = Math.ceil(Math.log2(size))
    for (let i = 0; i < selectBits; i++) {
      inputs.push(`S${i}`)
    }
    return inputs
  }

  const getFlipFlopInputs = (type) => {
    const inputs = {
      'SR': ['S', 'R'],
      'JK': ['J', 'K'], 
      'D': ['D'],
      'T': ['T']
    }
    return inputs[type] || ['D']
  }

  const getFlipFlopHint = (type) => {
    const hints = {
      'SR': 'Set-Reset con retroalimentación',
      'JK': 'Sin estado prohibido',
      'D': 'Data latch transparente',
      'T': 'Toggle cambia estado'
    }
    return hints[type] || 'circuito con memoria'
  }

  useEffect(() => {
    generateVariedChallenges(selectedCategory)
  }, [])

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
      sequential: '🔄',
      custom: '✏️'
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
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          🎯 Sistema de Retos y Desafíos
        </h2>
        <p className="text-gray-600">
          Genera desafíos automáticos o crea uno personalizado
        </p>
      </div>

      {/* 🆕 CONTROLES MEJORADOS CON BOTÓN PERSONALIZADO */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Categoría */}
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

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={() => generateVariedChallenges(selectedCategory)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              🎲 Generar Automáticos
            </button>
            
            <button
              onClick={() => setShowCustomModal(true)}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              ✏️ Crear Personalizado
            </button>
          </div>
        </div>
      </div>

      {/* 🆕 MODAL PARA DESAFÍO PERSONALIZADO */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                ✏️ Crear Desafío Personalizado
              </h3>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del Desafío *
                </label>
                <input
                  type="text"
                  value={customChallenge.title}
                  onChange={(e) => setCustomChallenge(prev => ({...prev, title: e.target.value}))}
                  placeholder="Ej: Implementar compuerta XOR"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={customChallenge.description}
                  onChange={(e) => setCustomChallenge(prev => ({...prev, description: e.target.value}))}
                  placeholder="Describe qué debe hacer el estudiante..."
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Expresión Booleana */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expresión Booleana *
                </label>
                <input
                  type="text"
                  value={customChallenge.expression}
                  onChange={(e) => setCustomChallenge(prev => ({...prev, expression: e.target.value}))}
                  placeholder="Ej: A·B + A'·C o (A+B)·C"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Usa: · (AND), + (OR), ' (NOT), ⊕ (XOR)
                </p>
              </div>

              {/* Compuertas Permitidas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compuertas Permitidas (opcional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableGates.map(gate => (
                    <button
                      key={gate}
                      onClick={() => {
                        setCustomChallenge(prev => ({
                          ...prev,
                          gates: prev.gates.includes(gate) 
                            ? prev.gates.filter(g => g !== gate)
                            : [...prev.gates, gate]
                        }))
                      }}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        customChallenge.gates.includes(gate)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {gate}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Si no seleccionas ninguna, se permitirán todas
                </p>
              </div>

              {/* Puntos y Tiempo */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Puntos
                  </label>
                  <input
                    type="number"
                    value={customChallenge.points}
                    onChange={(e) => setCustomChallenge(prev => ({...prev, points: parseInt(e.target.value) || 50}))}
                    min="10"
                    max="200"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiempo Límite (segundos)
                  </label>
                  <input
                    type="number"
                    value={customChallenge.timeLimit}
                    onChange={(e) => setCustomChallenge(prev => ({...prev, timeLimit: parseInt(e.target.value) || 600}))}
                    min="60"
                    max="3600"
                    step="60"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddCustomChallenge}
                  className="flex-1 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
                >
                  ✅ Agregar Desafío
                </button>
                <button
                  onClick={() => setShowCustomModal(false)}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Retos */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getCategoryIcon(challenge.category)}</span>
                {!challenge.custom && (
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
                    {difficultyLabels[challenge.difficulty]}
                  </span>
                )}
                {challenge.custom && (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                    Personalizado
                  </span>
                )}
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {challenge.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-4">
              {challenge.description}
            </p>

            {/* Expresión booleana si existe */}
            {challenge.expression && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-2 mb-3">
                <div className="text-xs font-semibold text-blue-800 mb-1">📐 Expresión:</div>
                <div className="text-sm font-mono text-blue-900">{challenge.expression}</div>
              </div>
            )}

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

      {/* Info del sistema */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3 text-center">
          🎓 Modos de Evaluación
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white p-4 rounded border">
            <div className="text-2xl mb-2 text-center">🎲</div>
            <div className="font-semibold text-blue-800 text-center">Desafíos Automáticos</div>
            <div className="text-blue-600 text-center">Generados con variedad de dificultades</div>
          </div>
          <div className="bg-white p-4 rounded border">
            <div className="text-2xl mb-2 text-center">✏️</div>
            <div className="font-semibold text-green-800 text-center">Desafíos Personalizados</div>
            <div className="text-green-600 text-center">Creados por el profesor</div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-yellow-50 rounded-md border border-yellow-200">
          <p className="text-sm text-yellow-800 text-center">
            <strong>📋 Nota:</strong> Todos los desafíos requieren calificación manual del profesor
          </p>
        </div>
      </div>
    </div>
  )
}

export default ChallengeSystem