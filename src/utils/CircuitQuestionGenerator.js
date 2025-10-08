//  SISTEMA INTELIGENTE GENERADR  PARA CIRCUITOS LÓGICOS

export class CircuitQuestionGenerator {
  constructor() {
    this.userProfile = this.loadUserProfile()
    this.questionHistory = this.loadQuestionHistory()
    this.challengeHistory = this.loadChallengeHistory()
    this.performanceAnalyzer = new CircuitPerformanceAnalyzer()
  }

  //  GENERADOR ADAPTATIVO DE PREGUNTAS
  generateAdaptiveQuiz(mode, count = 5) {
    const userLevel = this.determineCircuitLevel()
    const weakAreas = this.identifyWeakCircuitAreas()
    const preferredTypes = this.getPreferredCircuitTypes()

    console.log('🎯 Generando quiz de circuitos adaptativo:', {
      userLevel,
      weakAreas,
      preferredTypes,
      mode
    })

    return this.createPersonalizedCircuitQuestions(mode, count, {
      level: userLevel,
      focusAreas: weakAreas,
      questionTypes: preferredTypes
    })
  }

  //  ANÁLISIS DE NIVEL DEL USUARIO
  determineCircuitLevel() {
    const stats = this.userProfile.circuitStats
    
    if (stats.totalQuizzes < 3) return 'beginner'
    if (stats.averageScore > 85 && stats.challengesCompleted > 5) return 'expert'
    if (stats.averageScore > 75) return 'advanced'
    if (stats.averageScore > 60) return 'intermediate'
    return 'beginner'
  }

  identifyWeakCircuitAreas() {
    const performance = this.userProfile.circuitPerformance
    const weakAreas = []

    Object.entries(performance).forEach(([area, score]) => {
      if (score < 65) weakAreas.push(area)
    })

    return weakAreas.length > 0 ? weakAreas : ['gates']
  }

  getPreferredCircuitTypes() {
    return ['gates', 'algebra', 'design', 'applications']
  }

  //  CREADOR DE PREGUNTAS PERSONALIZADAS
  createPersonalizedCircuitQuestions(mode, count, profile) {
    const questions = []
    const difficultyDistribution = this.getCircuitDifficultyDistribution(mode, profile.level)
    const usedTemplates = new Set()
    
    for (let i = 0; i < count; i++) {
      const difficulty = difficultyDistribution[i % difficultyDistribution.length]
      const questionType = this.selectCircuitQuestionType(profile.focusAreas)
      
      let attempts = 0
      let question = null
      
      while (!question && attempts < 10) {
        question = this.generateSpecificCircuitQuestion(questionType, difficulty, i, usedTemplates)
        attempts++
      }
      
      if (question) {
        questions.push(question)
        usedTemplates.add(`${questionType}-${difficulty}-${question.templateId || i}`)
      }
    }

    this.updateQuestionHistory(questions)
    return questions
  }

  //  DISTRIBUCIÓN INTELIGENTE DE DIFICULTAD
  getCircuitDifficultyDistribution(mode, userLevel) {
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
      },
      expert: {
        practice: ['hard', 'hard', 'hard', 'hard', 'hard'],
        exam: ['hard', 'hard', 'hard', 'hard', 'hard', 'hard', 'hard', 'hard']
      }
    }

    return distributions[userLevel]?.[mode] || distributions.intermediate[mode]
  }

  selectCircuitQuestionType(focusAreas) {
    const types = ['gates', 'algebra', 'design', 'applications']
    
    if (focusAreas.length === 0) {
      return types[Math.floor(Math.random() * types.length)]
    }

    return Math.random() < 0.7 
      ? focusAreas[Math.floor(Math.random() * focusAreas.length)]
      : types[Math.floor(Math.random() * types.length)]
  }

  //  GENERADORES ESPECÍFICOS DE PREGUNTAS
  generateSpecificCircuitQuestion(type, difficulty, id, usedTemplates) {
    const generators = {
      gates: this.generateGateQuestion.bind(this),
      algebra: this.generateAlgebraQuestion.bind(this),
      design: this.generateDesignQuestion.bind(this),
      applications: this.generateApplicationQuestion.bind(this)
    }

    const generator = generators[type] || generators.gates
    return generator(difficulty, id, usedTemplates)
  }

  //  GENERADOR DE PREGUNTAS SOBRE COMPUERTAS
  generateGateQuestion(difficulty, id, usedTemplates) {
    const templates = {
      easy: [
        {
          id: 'gate-output',
          generator: () => {
            const gates = ['AND', 'OR', 'NAND', 'NOR', 'XOR', 'XNOR']
            const gate = gates[Math.floor(Math.random() * gates.length)]
            const input1 = Math.floor(Math.random() * 2)
            const input2 = Math.floor(Math.random() * 2)
            const output = this.calculateGateOutput(gate, [input1, input2])
            
            const shuffled = this.shuffleArray([
              output.toString(),
              (1 - output).toString(),
              'X (indefinido)',
              'Depende del circuito'
            ])
            
            return {
              question: `¿Cuál es la salida de una compuerta ${gate} cuando A=${input1} y B=${input2}?`,
              options: shuffled.options,
              correct: shuffled.correct,
              explanation: `Una compuerta ${gate} con entradas ${input1} y ${input2} produce ${output}. ${this.getGateExplanation(gate)}`,
              hint: `${gate} ${this.getGateHint(gate)}`,
              templateId: 'gate-output'
            }
          }
        },
        {
          id: 'gate-identification',
          generator: () => {
            const scenarios = [
              { gate: 'AND', description: 'produce 1 solo cuando todas las entradas son 1' },
              { gate: 'OR', description: 'produce 1 cuando al menos una entrada es 1' },
              { gate: 'XOR', description: 'produce 1 cuando las entradas son diferentes' },
              { gate: 'NAND', description: 'produce 0 solo cuando todas las entradas son 1' }
            ]
            const scenario = scenarios[Math.floor(Math.random() * scenarios.length)]
            const wrongOptions = scenarios.filter(s => s.gate !== scenario.gate).map(s => s.gate).slice(0, 3)
            
            const shuffled = this.shuffleArray([scenario.gate, ...wrongOptions])
            
            return {
              question: `¿Qué compuerta lógica ${scenario.description}?`,
              options: shuffled.options,
              correct: shuffled.correct,
              explanation: `La compuerta ${scenario.gate} ${scenario.description}`,
              hint: 'Piensa en la definición de cada compuerta',
              templateId: 'gate-identification'
            }
          }
        }
      ],
      medium: [
        {
          id: 'gate-combination',
          generator: () => {
            const combinations = [
              { gates: ['AND', 'NOT'], result: 'NAND' },
              { gates: ['OR', 'NOT'], result: 'NOR' },
              { gates: ['XOR', 'NOT'], result: 'XNOR' }
            ]
            const combo = combinations[Math.floor(Math.random() * combinations.length)]
            
            const shuffled = this.shuffleArray([combo.result, 'BUFFER', 'XOR', 'AND'])
            
            return {
              question: `Si conectas ${combo.gates[0]} seguida de ${combo.gates[1]}, obtienes la función de una compuerta:`,
              options: shuffled.options,
              correct: shuffled.correct,
              explanation: `${combo.gates[0]} seguida de ${combo.gates[1]} implementa ${combo.result}. Esto es porque inviertes la salida de ${combo.gates[0]}.`,
              hint: `${combo.gates[1]} invierte el resultado de ${combo.gates[0]}`,
              templateId: 'gate-combination'
            }
          }
        },
        {
          id: 'truth-table-analysis',
          generator: () => {
            const gates = ['XOR', 'XNOR', 'NAND', 'NOR']
            const gate = gates[Math.floor(Math.random() * gates.length)]
            const testCase = Math.floor(Math.random() * 4)
            const inputs = [[0, 0], [0, 1], [1, 0], [1, 1]][testCase]
            const output = this.calculateGateOutput(gate, inputs)
            
            const wrongGates = gates.filter(g => g !== gate).slice(0, 3)
            const shuffled = this.shuffleArray([gate, ...wrongGates])
            
            return {
              question: `Según la tabla de verdad, una compuerta que produce ${output} cuando A=${inputs[0]} y B=${inputs[1]}, y ${1-output} cuando las entradas son iguales, es:`,
              options: shuffled.options,
              correct: shuffled.correct,
              explanation: `Analizando la tabla de verdad completa, esta compuerta es ${gate}`,
              hint: 'Analiza qué sucede cuando las entradas son iguales vs diferentes',
              templateId: 'truth-table-analysis'
            }
          }
        }
      ],
      hard: [
        {
          id: 'universal-gates',
          generator: () => {
            const implementations = [
              { func: 'OR', universal: 'NAND', count: 3 },
              { func: 'AND', universal: 'NOR', count: 3 },
              { func: 'XOR', universal: 'NAND', count: 4 },
              { func: 'NOT', universal: 'NAND', count: 1 }
            ]
            const impl = implementations[Math.floor(Math.random() * implementations.length)]
            
            const shuffled = this.shuffleArray([
              `${impl.count} compuertas`,
              `${impl.count + 1} compuertas`,
              `${impl.count - 1} compuertas`,
              `${impl.count + 2} compuertas`
            ])
            
            return {
              question: `¿Cuántas compuertas ${impl.universal} necesitas para implementar la función ${impl.func}?`,
              options: shuffled.options,
              correct: shuffled.correct,
              explanation: `Para implementar ${impl.func} con ${impl.universal} necesitas exactamente ${impl.count} compuertas. Las compuertas ${impl.universal} son universalmente completas.`,
              hint: `${impl.universal} puede implementar cualquier función lógica`,
              templateId: 'universal-gates'
            }
          }
        },
        {
          id: 'circuit-optimization',
          generator: () => {
            const problems = [
              { original: 'NOT(NOT A)', simplified: 'A', law: 'Doble negación' },
              { original: 'A AND (NOT A)', simplified: '0', law: 'Complemento' },
              { original: 'A OR (NOT A)', simplified: '1', law: 'Complemento' },
              { original: '(A AND B) OR (A AND (NOT B))', simplified: 'A', law: 'Factorización booleana' }
            ]
            const problem = problems[Math.floor(Math.random() * problems.length)]
            
            const shuffled = this.shuffleArray([problem.simplified, 'B', 'NOT B', problem.original])
            
            return {
              question: `¿A qué se puede simplificar la expresión "${problem.original}"?`,
              options: shuffled.options,
              correct: shuffled.correct,
              explanation: `Usando la ley de ${problem.law}, "${problem.original}" se simplifica a "${problem.simplified}"`,
              hint: `Aplica las leyes del álgebra booleana`,
              templateId: 'circuit-optimization'
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
      type: 'gates',
      difficulty,
      ...questionData,
      generated: true,
      timestamp: new Date().toISOString()
    }
  }

  //  GENERADOR DE PREGUNTAS DE ÁLGEBRA BOOLEANA
  generateAlgebraQuestion(difficulty, id, usedTemplates) {
    const templates = {
      easy: [
        {
          id: 'demorgan-basic',
          generator: () => {
            const laws = [
              { original: 'NOT(A AND B)', equivalent: 'NOT A OR NOT B', law: "Primera ley de De Morgan" },
              { original: 'NOT(A OR B)', equivalent: 'NOT A AND NOT B', law: "Segunda ley de De Morgan" }
            ]
            const law = laws[Math.floor(Math.random() * laws.length)]
            
            const shuffled = this.shuffleArray([law.equivalent, law.original, 'A AND B', 'A OR B'])
            
            return {
              question: `Según las leyes de De Morgan, "${law.original}" es equivalente a:`,
              options: shuffled.options,
              correct: shuffled.correct,
              explanation: `${law.law}: ${law.original} = ${law.equivalent}`,
              hint: 'La negación convierte AND en OR y viceversa',
              templateId: 'demorgan-basic'
            }
          }
        },
        {
          id: 'boolean-identity',
          generator: () => {
            const identities = [
              { expression: 'A AND 1', result: 'A', law: 'Identidad' },
              { expression: 'A OR 0', result: 'A', law: 'Identidad' },
              { expression: 'A AND 0', result: '0', law: 'Anulación' },
              { expression: 'A OR 1', result: '1', law: 'Anulación' }
            ]
            const identity = identities[Math.floor(Math.random() * identities.length)]
            
            const shuffled = this.shuffleArray([identity.result, 'NOT A', 'B', identity.expression])
            
            return {
              question: `¿A qué se simplifica "${identity.expression}"?`,
              options: shuffled.options,
              correct: shuffled.correct,
              explanation: `Por la ley de ${identity.law}, "${identity.expression}" = ${identity.result}`,
              hint: 'Piensa en los elementos neutros',
              templateId: 'boolean-identity'
            }
          }
        }
      ],
      medium: [
        {
          id: 'boolean-simplification',
          generator: () => {
            const expressions = [
              { original: 'A AND (A OR B)', simplified: 'A', law: 'Absorción' },
              { original: 'A OR (A AND B)', simplified: 'A', law: 'Absorción' },
              { original: 'A XOR 0', simplified: 'A', law: 'Identidad XOR' },
              { original: 'A XOR A', simplified: '0', law: 'Auto-anulación XOR' }
            ]
            const expr = expressions[Math.floor(Math.random() * expressions.length)]
            
            const shuffled = this.shuffleArray([expr.simplified, 'B', 'NOT A', expr.original])
            
            return {
              question: `Simplifica la expresión: ${expr.original}`,
              options: shuffled.options,
              correct: shuffled.correct,
              explanation: `Usando la ley de ${expr.law}: ${expr.original} = ${expr.simplified}`,
              hint: 'Busca patrones de absorción o identidad',
              templateId: 'boolean-simplification'
            }
          }
        }
      ],
      hard: [
        {
          id: 'complex-simplification',
          generator: () => {
            const problems = [
              {
                original: '(A AND B) OR (NOT A AND B)',
                simplified: 'B',
                steps: 'Factoriza B: B AND (A OR NOT A) = B AND 1 = B'
              },
              {
                original: '(A XOR B) XOR B',
                simplified: 'A',
                steps: 'B se cancela: cualquier valor XOR consigo mismo = 0'
              }
            ]
            const problem = problems[Math.floor(Math.random() * problems.length)]
            
            const shuffled = this.shuffleArray([problem.simplified, 'A AND B', 'A OR B', problem.original])
            
            return {
              question: `Simplifica completamente: ${problem.original}`,
              options: shuffled.options,
              correct: shuffled.correct,
              explanation: `${problem.steps}. Resultado: ${problem.simplified}`,
              hint: 'Usa leyes de De Morgan, distributiva y complemento',
              templateId: 'complex-simplification'
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
      type: 'algebra',
      difficulty,
      ...questionData,
      generated: true,
      timestamp: new Date().toISOString()
    }
  }

  //  GENERADOR DE PREGUNTAS DE DISEÑO
  generateDesignQuestion(difficulty, id, usedTemplates) {
    const templates = {
      easy: [
        {
          id: 'component-identification',
          generator: () => {
            const components = [
              { name: 'Sumador de medio bit (Half Adder)', function: 'suma dos bits' },
              { name: 'Multiplexor 2:1', function: 'selecciona entre dos entradas' },
              { name: 'Decodificador 2 a 4', function: 'activa una de 4 salidas' }
            ]
            const component = components[Math.floor(Math.random() * components.length)]
            
            const shuffled = this.shuffleArray([
              `Circuito que ${component.function}`,
              'Almacenar datos temporalmente',
              'Invertir todas las señales',
              'Generar señales de reloj'
            ])
            
            return {
              question: `Un ${component.name} tiene como función principal:`,
              options: shuffled.options,
              correct: shuffled.correct,
              explanation: `El ${component.name} ${component.function}`,
              hint: 'Piensa en la operación que realiza el componente',
              templateId: 'component-identification'
            }
          }
        }
      ],
      medium: [
        {
          id: 'circuit-function',
          generator: () => {
            const circuits = [
              { description: 'Un circuito con 2 XOR y 2 AND conectados para sumar 3 bits', name: 'Sumador completo (Full Adder)' },
              { description: 'Un circuito que compara dos bits y produce 1 cuando son iguales', name: 'Comparador de igualdad' }
            ]
            const circuit = circuits[Math.floor(Math.random() * circuits.length)]
            
            const shuffled = this.shuffleArray([
              circuit.name,
              'Registro de desplazamiento',
              'Contador binario',
              'Flip-flop D'
            ])
            
            return {
              question: `${circuit.description}. ¿Qué circuito es?`,
              options: shuffled.options,
              correct: shuffled.correct,
              explanation: `Este diseño corresponde a un ${circuit.name}`,
              hint: 'Analiza las compuertas mencionadas y su función',
              templateId: 'circuit-function'
            }
          }
        }
      ],
      hard: [
        {
          id: 'optimization-problem',
          generator: () => {
            const problems = [
              { original: 'Implementar XOR con 6 compuertas básicas', optimized: 'Usar 4 NAND', reason: 'NAND es universal y más eficiente' },
              { original: 'Sumador de 4 bits con 16 compuertas', optimized: 'Usar carry lookahead con 12 compuertas', reason: 'Reduce propagación de acarreo' }
            ]
            const problem = problems[Math.floor(Math.random() * problems.length)]
            
            const shuffled = this.shuffleArray([
              problem.optimized,
              'Agregar más compuertas para claridad',
              'Usar solo AND y OR',
              'Duplicar el circuito'
            ])
            
            return {
              question: `Para optimizar: "${problem.original}", ¿cuál es la mejor estrategia?`,
              options: shuffled.options,
              correct: shuffled.correct,
              explanation: `${problem.optimized} porque ${problem.reason}`,
              hint: 'Busca reducir número de compuertas y niveles lógicos',
              templateId: 'optimization-problem'
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
      type: 'design',
      difficulty,
      ...questionData,
      generated: true,
      timestamp: new Date().toISOString()
    }
  }

  //  GENERADOR DE PREGUNTAS DE APLICACIONES
  generateApplicationQuestion(difficulty, id, usedTemplates) {
    const templates = {
      easy: [
        {
          id: 'real-world-application',
          generator: () => {
            const applications = [
              { scenario: 'Un sistema de alarma que se activa cuando hay movimiento O la puerta está abierta', gate: 'OR', explanation: 'Cualquier condición puede activar la alarma' },
              { scenario: 'Un auto que arranca solo si la llave está insertada Y el cinturón está abrochado', gate: 'AND', explanation: 'Ambas condiciones deben cumplirse' },
              { scenario: 'Una luz que cambia de estado cada vez que presionas el interruptor', gate: 'XOR con memoria (Flip-flop)', explanation: 'Toggle switch usando lógica XOR' }
            ]
            const app = applications[Math.floor(Math.random() * applications.length)]
            
            const shuffled = this.shuffleArray([app.gate, 'NAND', 'Contador', 'Registro'])
            
            return {
              question: `${app.scenario}. ¿Qué compuerta o circuito usarías?`,
              options: shuffled.options,
              correct: shuffled.correct,
              explanation: `${app.gate}: ${app.explanation}`,
              hint: 'Analiza las condiciones lógicas del problema',
              templateId: 'real-world-application'
            }
          }
        }
      ],
      medium: [
        {
          id: 'system-design',
          generator: () => {
            const systems = [
              { name: 'Semáforo inteligente', component: 'Máquina de estados finitos', why: 'Necesita recordar el estado actual y transicionar' },
              { name: 'Calculadora binaria simple', component: 'ALU (Unidad Aritmético-Lógica)', why: 'Realiza operaciones aritméticas y lógicas' }
            ]
            const system = systems[Math.floor(Math.random() * systems.length)]
            
            const shuffled = this.shuffleArray([system.component, 'Buffer simple', 'Inversor', 'Compuerta OR'])
            
            return {
              question: `Para implementar un ${system.name}, el componente digital clave es:`,
              options: shuffled.options,
              correct: shuffled.correct,
              explanation: `${system.component} porque ${system.why}`,
              hint: 'Piensa en qué operación fundamental necesita el sistema',
              templateId: 'system-design'
            }
          }
        }
      ],
      hard: [
        {
          id: 'architecture-decision',
          generator: () => {
            const decisions = [
              { context: 'Diseñar una memoria caché de alta velocidad', choice: 'Usar flip-flops D (más rápidos pero más caros)', tradeoff: 'Velocidad vs Densidad' },
              { context: 'Sistema de seguridad crítico', choice: 'Circuitos redundantes con votación mayoritaria', tradeoff: 'Fiabilidad vs Costo' }
            ]
            const decision = decisions[Math.floor(Math.random() * decisions.length)]
            
            const shuffled = this.shuffleArray([
              decision.choice,
              'No importa la arquitectura',
              'Usar componentes analógicos',
              'Duplicar sin validación'
            ])
            
            return {
              question: `Para ${decision.context}, ¿qué arquitectura es más apropiada?`,
              options: shuffled.options,
              correct: shuffled.correct,
              explanation: `${decision.choice} por el balance ${decision.tradeoff}`,
              hint: 'Considera los requisitos de rendimiento y recursos',
              templateId: 'architecture-decision'
            }
          }
        }
      ]
    }


    const difficultyTemplates = templates[difficulty] || templates.easy
    const template = difficultyTemplates[Math.floor(Math.random() * difficultyTemplates.length)]
    const questionData = template.generator()

    return {
      id: `q-${Date.now()}-${id}`,
      type: 'applications',
      difficulty,
      ...questionData,
      generated: true,
      timestamp: new Date().toISOString()
    }
  }

  //  FUNCIONES AUXILIARES
  calculateGateOutput(gate, inputs) {
    switch (gate) {
      case 'AND': return inputs.every(x => x === 1) ? 1 : 0
      case 'OR': return inputs.some(x => x === 1) ? 1 : 0
      case 'NOT': return inputs[0] === 1 ? 0 : 1
      case 'NAND': return inputs.every(x => x === 1) ? 0 : 1
      case 'NOR': return inputs.some(x => x === 1) ? 0 : 1
      case 'XOR': return inputs.filter(x => x === 1).length % 2 === 1 ? 1 : 0
      case 'XNOR': return inputs.filter(x => x === 1).length % 2 === 0 ? 1 : 0
      default: return 0
    }
  }

  getGateExplanation(gate) {
    const explanations = {
      'AND': 'Produce 1 solo cuando todas las entradas son 1',
      'OR': 'Produce 1 cuando al menos una entrada es 1',
      'NOT': 'Invierte la entrada (0→1, 1→0)',
      'NAND': 'Es lo contrario de AND (NOT-AND)',
      'NOR': 'Es lo contrario de OR (NOT-OR)',
      'XOR': 'Produce 1 cuando las entradas son diferentes',
      'XNOR': 'Produce 1 cuando las entradas son iguales'
    }
    return explanations[gate] || ''
  }

  getGateHint(gate) {
    const hints = {
      'AND': 'requiere que TODAS las entradas sean 1',
      'OR': 'necesita que AL MENOS UNA entrada sea 1',
      'NOT': 'cambia 0 por 1 y viceversa',
      'NAND': 'es AND seguido de NOT',
      'NOR': 'es OR seguido de NOT',
      'XOR': 'es 1 cuando las entradas difieren',
      'XNOR': 'es 1 cuando las entradas coinciden'
    }
    return hints[gate] || ''
  }
  shuffleArray(array) {
    // array[0] siempre es la respuesta correcta
    const correctAnswer = array[0]
    const shuffled = [...array].sort(() => Math.random() - 0.5)
    
    return {
      options: shuffled,
      correct: shuffled.indexOf(correctAnswer)
    }
  }

  // 💾 PERSISTENCIA DE DATOS
  loadUserProfile() {
    const defaultProfile = {
      circuitStats: { 
        totalQuizzes: 0, 
        averageScore: 0,
        challengesCompleted: 0,
        challengeSuccessRate: 0
      },
      circuitPerformance: { 
        gates: 50, 
        algebra: 50, 
        design: 50, 
        applications: 50 
      },
      preferences: { 
        difficulty: 'medium', 
        favoriteGates: ['AND', 'OR'],
        challengeTypes: ['basic']
      }
    }

    try {
      return JSON.parse(localStorage.getItem('circuitUserProfile') || JSON.stringify(defaultProfile))
    } catch {
      return defaultProfile
    }
  }

  updateUserProfile(results) {
    if (results.type === 'quiz') {
      this.userProfile.circuitStats.totalQuizzes++
      const newAverage = (this.userProfile.circuitStats.averageScore + results.scorePercentage) / 2
      this.userProfile.circuitStats.averageScore = Math.round(newAverage)

      results.questions.forEach(q => {
        const isCorrect = results.userAnswers[q.id] === q.correct
        const currentPerf = this.userProfile.circuitPerformance[q.type] || 50
        
        this.userProfile.circuitPerformance[q.type] = isCorrect 
          ? Math.min(100, currentPerf + 3)
          : Math.max(0, currentPerf - 2)
      })
    }

    localStorage.setItem('circuitUserProfile', JSON.stringify(this.userProfile))
  }

  loadQuestionHistory() {
    try {
      return JSON.parse(localStorage.getItem('circuitQuestionHistory') || '[]')
    } catch {
      return []
    }
  }

  updateQuestionHistory(questions) {
    this.questionHistory.push(...questions.map(q => ({
      id: q.id,
      type: q.type,
      difficulty: q.difficulty,
      timestamp: q.timestamp
    })))
    
    if (this.questionHistory.length > 100) {
      this.questionHistory = this.questionHistory.slice(-100)
    }
    
    localStorage.setItem('circuitQuestionHistory', JSON.stringify(this.questionHistory))
  }

  loadChallengeHistory() {
    try {
      return JSON.parse(localStorage.getItem('circuitChallengeHistory') || '[]')
    } catch {
      return []
    }
  }

  //  ESTADÍSTICAS Y ANÁLISIS
  getDetailedCircuitStats() {
    return {
      profile: this.userProfile,
      strengths: this.getCircuitStrengths(),
      weaknesses: this.getCircuitWeaknesses(),
      recommendations: this.getCircuitRecommendations(),
      progressTrend: this.calculateCircuitProgress()
    }
  }

  getCircuitStrengths() {
    return Object.entries(this.userProfile.circuitPerformance)
      .filter(([_, score]) => score > 75)
      .map(([area, score]) => ({
        area,
        score,
        description: this.getAreaDescription(area)
      }))
  }

  getCircuitWeaknesses() {
    return Object.entries(this.userProfile.circuitPerformance)
      .filter(([_, score]) => score < 60)
      .map(([area, score]) => ({
        area,
        score,
        description: this.getAreaDescription(area)
      }))
  }

  getAreaDescription(area) {
    const descriptions = {
      gates: 'Conocimiento de compuertas lógicas básicas',
      algebra: 'Álgebra booleana y simplificación',
      design: 'Diseño de circuitos complejos',
      applications: 'Aplicaciones prácticas de circuitos'
    }
    return descriptions[area] || area
  }

  getCircuitRecommendations() {
    const weaknesses = this.getCircuitWeaknesses()
    
    return weaknesses.map(weakness => {
      const recommendations = {
        gates: 'Practica con las tablas de verdad de cada compuerta',
        algebra: 'Estudia las leyes de De Morgan y simplificación',
        design: 'Intenta diseñar sumadores y decodificadores',
        applications: 'Conecta los circuitos con ejemplos del mundo real'
      }
      
      return {
        area: weakness.area,
        message: recommendations[weakness.area],
        priority: weakness.score < 40 ? 'high' : 'medium'
      }
    })
  }

  calculateCircuitProgress() {
    const history = this.questionHistory.slice(-20)
    if (history.length < 5) return 'insufficient_data'
    
    const recent = history.slice(-10)
    const previous = history.slice(-20, -10)
    
    const recentCorrect = recent.filter(q => q.correct).length
    const previousCorrect = previous.filter(q => q.correct).length
    
    const recentAvg = (recentCorrect / recent.length) * 100
    const previousAvg = (previousCorrect / previous.length) * 100
    
    if (recentAvg > previousAvg + 10) return 'improving'
    if (recentAvg < previousAvg - 10) return 'declining'
    return 'stable'
  }
}

//  ANALIZADOR DE RENDIMIENTO
class CircuitPerformanceAnalyzer {
  analyzeQuizResults(questions, userAnswers) {
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
        analysis.strongAreas.push({
          area: type,
          percentage,
          message: `Excelente dominio en ${type}`
        })
      } else if (percentage < 60) {
        analysis.improvementAreas.push({
          area: type,
          percentage,
          message: `Necesitas reforzar ${type}`
        })
      }
    })

    return analysis
  }
}

// Exportar instancia singleton
export const circuitQuestionGenerator = new CircuitQuestionGenerator()
export default circuitQuestionGenerator