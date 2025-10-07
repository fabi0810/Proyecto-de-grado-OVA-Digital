// src/utils/AlgebraQuestionGenerator.js
// 🧠 SISTEMA INTELIGENTE PARA ÁLGEBRA DE BOOLE Y SIMPLIFICACIÓN

export class AlgebraQuestionGenerator {
    constructor() {
      this.userProfile = this.loadUserProfile()
      this.questionHistory = this.loadQuestionHistory()
      this.challengeHistory = this.loadChallengeHistory()
      this.performanceAnalyzer = new AlgebraPerformanceAnalyzer()
    }
  
    // 🎯 GENERADOR ADAPTATIVO DE PREGUNTAS
    generateAdaptiveQuiz(mode, count = 5) {
      const userLevel = this.determineAlgebraLevel()
      const weakAreas = this.identifyWeakAlgebraAreas()
      const preferredTypes = this.getPreferredAlgebraTypes()
  
      console.log('🎯 Generando quiz de álgebra booleana adaptativo:', {
        userLevel,
        weakAreas,
        preferredTypes,
        mode
      })
  
      return this.createPersonalizedAlgebraQuestions(mode, count, {
        level: userLevel,
        focusAreas: weakAreas,
        questionTypes: preferredTypes
      })
    }
  
    // 🔍 ANÁLISIS DE NIVEL DEL USUARIO
    determineAlgebraLevel() {
      const stats = this.userProfile.algebraStats
      
      if (stats.totalQuizzes < 3) return 'beginner'
      if (stats.averageScore > 85 && stats.challengesCompleted > 5) return 'expert'
      if (stats.averageScore > 75) return 'advanced'
      if (stats.averageScore > 60) return 'intermediate'
      return 'beginner'
    }
  
    identifyWeakAlgebraAreas() {
      const performance = this.userProfile.algebraPerformance
      const weakAreas = []
  
      Object.entries(performance).forEach(([area, score]) => {
        if (score < 65) weakAreas.push(area)
      })
  
      return weakAreas.length > 0 ? weakAreas : ['laws']
    }
  
    getPreferredAlgebraTypes() {
      return ['laws', 'simplification', 'canonical', 'karnaugh']
    }
  
    // 🏭 CREADOR DE PREGUNTAS PERSONALIZADAS
    createPersonalizedAlgebraQuestions(mode, count, profile) {
      const questions = []
      const difficultyDistribution = this.getAlgebraDifficultyDistribution(mode, profile.level)
      const usedTemplates = new Set()
      
      for (let i = 0; i < count; i++) {
        const difficulty = difficultyDistribution[i % difficultyDistribution.length]
        const questionType = this.selectAlgebraQuestionType(profile.focusAreas)
        
        let attempts = 0
        let question = null
        
        while (!question && attempts < 10) {
          question = this.generateSpecificAlgebraQuestion(questionType, difficulty, i, usedTemplates)
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
  
    // 📊 DISTRIBUCIÓN INTELIGENTE DE DIFICULTAD
    getAlgebraDifficultyDistribution(mode, userLevel) {
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
  
    selectAlgebraQuestionType(focusAreas) {
      const types = ['laws', 'simplification', 'canonical', 'karnaugh']
      
      if (focusAreas.length === 0) {
        return types[Math.floor(Math.random() * types.length)]
      }
  
      return Math.random() < 0.7 
        ? focusAreas[Math.floor(Math.random() * focusAreas.length)]
        : types[Math.floor(Math.random() * types.length)]
    }
  
    // 🎭 GENERADORES ESPECÍFICOS DE PREGUNTAS
    generateSpecificAlgebraQuestion(type, difficulty, id, usedTemplates) {
      const generators = {
        laws: this.generateLawsQuestion.bind(this),
        simplification: this.generateSimplificationQuestion.bind(this),
        canonical: this.generateCanonicalQuestion.bind(this),
        karnaugh: this.generateKarnaughQuestion.bind(this)
      }
  
      const generator = generators[type] || generators.laws
      return generator(difficulty, id, usedTemplates)
    }
  
    // ⚖️ GENERADOR DE PREGUNTAS SOBRE LEYES BOOLEANAS
    generateLawsQuestion(difficulty, id, usedTemplates) {
      const templates = {
        easy: [
          {
            id: 'law-identification',
            generator: () => {
              const laws = [
                { name: 'Identidad', example: 'A + 0 = A', alt: 'A · 1 = A' },
                { name: 'Anulación', example: 'A + 1 = 1', alt: 'A · 0 = 0' },
                { name: 'Idempotencia', example: 'A + A = A', alt: 'A · A = A' },
                { name: 'Complemento', example: 'A + A\' = 1', alt: 'A · A\' = 0' },
                { name: 'Doble Negación', example: '(A\')\'  = A', alt: 'NOT(NOT A) = A' }
              ]
              const law = laws[Math.floor(Math.random() * laws.length)]
              const useAlt = Math.random() > 0.5
              const example = useAlt ? law.alt : law.example
              
              const wrongLaws = laws.filter(l => l.name !== law.name).map(l => l.name).slice(0, 3)
              const shuffled = this.shuffleArray([law.name, ...wrongLaws])
              
              return {
                question: `La expresión "${example}" corresponde a la ley de:`,
                options: shuffled.options,
                correct: shuffled.correct,
                explanation: `Esta expresión es un ejemplo de la Ley de ${law.name}. ${this.getLawExplanation(law.name)}`,
                hint: 'Piensa en el efecto que tiene el operador sobre la variable',
                templateId: 'law-identification'
              }
            }
          },
          {
            id: 'demorgan-basic',
            generator: () => {
              const cases = [
                { original: '(A + B)\'', result: 'A\' · B\'', law: 'Primera Ley de De Morgan' },
                { original: '(A · B)\'', result: 'A\' + B\'', law: 'Segunda Ley de De Morgan' },
                { original: '(A + B + C)\'', result: 'A\' · B\' · C\'', law: 'Primera Ley (tres variables)' },
                { original: '(A · B · C)\'', result: 'A\' + B\' + C\'', law: 'Segunda Ley (tres variables)' }
              ]
              const deMorgan = cases[Math.floor(Math.random() * cases.length)]
              
              const wrongOptions = [
                'A + B',
                'A · B',
                '(A\' · B)\'',
                'A\' + B'
              ].filter(opt => opt !== deMorgan.result).slice(0, 3)
              
              const shuffled = this.shuffleArray([deMorgan.result, ...wrongOptions])
              
              return {
                question: `Aplicando las Leyes de De Morgan, ¿a qué es equivalente ${deMorgan.original}?`,
                options: shuffled.options,
                correct: shuffled.correct,
                explanation: `Por ${deMorgan.law}: ${deMorgan.original} = ${deMorgan.result}. La negación transforma + en · y viceversa, negando cada término.`,
                hint: 'De Morgan: niega el operador y cada término',
                templateId: 'demorgan-basic'
              }
            }
          }
        ],
        medium: [
          {
            id: 'law-application',
            generator: () => {
              const problems = [
                { expr: 'A + A · B', simplified: 'A', law: 'Absorción (A + AB = A)' },
                { expr: 'A · (A + B)', simplified: 'A', law: 'Absorción (A(A + B) = A)' },
                { expr: '(A + B) · (A + C)', simplified: 'A + (B · C)', law: 'Distributiva' },
                { expr: 'A · B + A · B\'', simplified: 'A', law: 'Consenso y Complemento' }
              ]
              const problem = problems[Math.floor(Math.random() * problems.length)]
              
              const shuffled = this.shuffleArray([
                problem.simplified,
                'B',
                'A · B',
                'A + B'
              ])
              
              return {
                question: `Simplifica la expresión: ${problem.expr}`,
                options: shuffled.options,
                correct: shuffled.correct,
                explanation: `Usando ${problem.law}, la expresión ${problem.expr} se simplifica a ${problem.simplified}.`,
                hint: 'Busca patrones de absorción o factorización',
                templateId: 'law-application'
              }
            }
          },
          {
            id: 'consensus-theorem',
            generator: () => {
              const variants = [
                { expr: 'A · B + A\' · C + B · C', result: 'A · B + A\' · C', eliminated: 'B · C' },
                { expr: '(A + B) · (A\' + C) · (B + C)', result: '(A + B) · (A\' + C)', eliminated: '(B + C)' }
              ]
              const variant = variants[Math.floor(Math.random() * variants.length)]
              
              const shuffled = this.shuffleArray([
                variant.result,
                variant.expr,
                'A + B + C',
                'A · B · C'
              ])
              
              return {
                question: `Aplicando el Teorema del Consenso, simplifica: ${variant.expr}`,
                options: shuffled.options,
                correct: shuffled.correct,
                explanation: `Por el Teorema del Consenso, el término ${variant.eliminated} es redundante y puede eliminarse, dejando: ${variant.result}`,
                hint: 'El consenso permite eliminar términos redundantes',
                templateId: 'consensus-theorem'
              }
            }
          }
        ],
        hard: [
          {
            id: 'complex-demorgan',
            generator: () => {
              const complex = [
                { expr: '((A · B) + (C · D))\'', result: '(A\' + B\') · (C\' + D\')', steps: 'Aplica De Morgan dos veces' },
                { expr: '(A + (B · C))\'', result: 'A\' · (B\' + C\')', steps: 'De Morgan externo e interno' }
              ]
              const problem = complex[Math.floor(Math.random() * complex.length)]
              
              const shuffled = this.shuffleArray([
                problem.result,
                'A · B · C · D',
                'A\' · B\' · C\' · D\'',
                '(A + B) · (C + D)'
              ])
              
              return {
                question: `Aplica las Leyes de De Morgan para simplificar: ${problem.expr}`,
                options: shuffled.options,
                correct: shuffled.correct,
                explanation: `${problem.steps}: ${problem.expr} = ${problem.result}`,
                hint: 'Aplica De Morgan desde afuera hacia adentro',
                templateId: 'complex-demorgan'
              }
            }
          },
          {
            id: 'multiple-laws',
            generator: () => {
              const problems = [
                { 
                  expr: 'A · (A\' + B)', 
                  result: 'A · B',
                  steps: 'Distributiva: A·A\' + A·B = 0 + A·B = A·B'
                },
                {
                  expr: '(A + B) · (A + B\')',
                  result: 'A',
                  steps: 'Distributiva: A + (B·B\') = A + 0 = A'
                }
              ]
              const problem = problems[Math.floor(Math.random() * problems.length)]
              
              const shuffled = this.shuffleArray([
                problem.result,
                'A + B',
                '0',
                '1'
              ])
              
              return {
                question: `Simplifica completamente usando múltiples leyes: ${problem.expr}`,
                options: shuffled.options,
                correct: shuffled.correct,
                explanation: `${problem.steps}`,
                hint: 'Usa distributiva, complemento e identidad',
                templateId: 'multiple-laws'
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
        generated: true,
        timestamp: new Date().toISOString()
      }
    }
  
    // 🔄 GENERADOR DE PREGUNTAS DE SIMPLIFICACIÓN
    generateSimplificationQuestion(difficulty, id, usedTemplates) {
      const templates = {
        easy: [
          {
            id: 'simple-reduction',
            generator: () => {
              const expressions = [
                { original: 'A + A', simplified: 'A', law: 'Idempotencia' },
                { original: 'A · A', simplified: 'A', law: 'Idempotencia' },
                { original: 'A + 0', simplified: 'A', law: 'Identidad' },
                { original: 'A · 1', simplified: 'A', law: 'Identidad' },
                { original: 'A + 1', simplified: '1', law: 'Anulación' },
                { original: 'A · 0', simplified: '0', law: 'Anulación' }
              ]
              const expr = expressions[Math.floor(Math.random() * expressions.length)]
              
              const shuffled = this.shuffleArray([
                expr.simplified,
                'A\'',
                expr.original,
                'No se puede simplificar'
              ])
              
              return {
                question: `¿Cuál es la forma simplificada de: ${expr.original}?`,
                options: shuffled.options,
                correct: shuffled.correct,
                explanation: `Por la ley de ${expr.law}: ${expr.original} = ${expr.simplified}`,
                hint: `Recuerda la ley de ${expr.law}`,
                templateId: 'simple-reduction'
              }
            }
          },
          {
            id: 'complement-simplification',
            generator: () => {
              const cases = [
                { expr: 'A + A\'', result: '1', reason: 'Una variable OR su complemento siempre es 1' },
                { expr: 'A · A\'', result: '0', reason: 'Una variable AND su complemento siempre es 0' },
                { expr: 'A + A\' · B', result: 'A + B', reason: 'Absorción generalizada' }
              ]
              const problem = cases[Math.floor(Math.random() * cases.length)]
              
              const shuffled = this.shuffleArray([
                problem.result,
                'A',
                'A\'',
                'B'
              ])
              
              return {
                question: `Simplifica: ${problem.expr}`,
                options: shuffled.options,
                correct: shuffled.correct,
                explanation: `${problem.reason}: ${problem.expr} = ${problem.result}`,
                hint: 'Piensa en la ley de complemento',
                templateId: 'complement-simplification'
              }
            }
          }
        ],
        medium: [
          {
            id: 'factorization',
            generator: () => {
              const problems = [
                { expr: 'A · B + A · C', result: 'A · (B + C)', law: 'Distributiva (factorización)' },
                { expr: '(A + B) · (A + C)', result: 'A + (B · C)', law: 'Distributiva dual' },
                { expr: 'A · B\' + A · B', result: 'A', law: 'Factorización y complemento' }
              ]
              const problem = problems[Math.floor(Math.random() * problems.length)]
              
              const shuffled = this.shuffleArray([
                problem.result,
                'A + B',
                'A · B',
                problem.expr
              ])
              
              return {
                question: `Factoriza y simplifica: ${problem.expr}`,
                options: shuffled.options,
                correct: shuffled.correct,
                explanation: `Usando ${problem.law}: ${problem.expr} = ${problem.result}`,
                hint: 'Busca factores comunes',
                templateId: 'factorization'
              }
            }
          },
          {
            id: 'absorption-advanced',
            generator: () => {
              const cases = [
                { expr: 'A · B + A · B · C', result: 'A · B', absorbed: 'A · B · C' },
                { expr: '(A + B) · (A + B + C)', result: 'A + B', absorbed: '(A + B + C)' },
                { expr: 'A + A · B · C', result: 'A', absorbed: 'A · B · C' }
              ]
              const problem = cases[Math.floor(Math.random() * cases.length)]
              
              const shuffled = this.shuffleArray([
                problem.result,
                'A · B · C',
                'A + B + C',
                problem.expr
              ])
              
              return {
                question: `Simplifica por absorción: ${problem.expr}`,
                options: shuffled.options,
                correct: shuffled.correct,
                explanation: `El término ${problem.absorbed} es absorbido por ${problem.result}, ya que está "contenido" en él.`,
                hint: 'Un término más simple absorbe al más complejo',
                templateId: 'absorption-advanced'
              }
            }
          }
        ],
        hard: [
          {
            id: 'multi-step-simplification',
            generator: () => {
              const complex = [
                {
                  expr: '(A + B) · (A\' + B) · (A + B\')',
                  result: 'A · B',
                  steps: 'Multiplica (A+B)(A\'+B) = B, luego B(A+B\') = AB'
                },
                {
                  expr: 'A · B + A\' · C + B · C',
                  result: 'A · B + A\' · C',
                  steps: 'Consenso: BC es redundante'
                }
              ]
              const problem = complex[Math.floor(Math.random() * complex.length)]
              
              const shuffled = this.shuffleArray([
                problem.result,
                'A + B + C',
                '1',
                '0'
              ])
              
              return {
                question: `Simplifica completamente: ${problem.expr}`,
                options: shuffled.options,
                correct: shuffled.correct,
                explanation: `${problem.steps}. Resultado final: ${problem.result}`,
                hint: 'Aplica varias leyes secuencialmente',
                templateId: 'multi-step-simplification'
              }
            }
          },
          {
            id: 'xor-simplification',
            generator: () => {
              const xorCases = [
                { expr: 'A ⊕ 0', result: 'A', reason: 'XOR con 0 no cambia el valor' },
                { expr: 'A ⊕ 1', result: 'A\'', reason: 'XOR con 1 invierte el valor' },
                { expr: 'A ⊕ A', result: '0', reason: 'XOR consigo mismo siempre es 0' },
                { expr: '(A ⊕ B) ⊕ B', result: 'A', reason: 'B se cancela' }
              ]
              const problem = xorCases[Math.floor(Math.random() * xorCases.length)]
              
              const shuffled = this.shuffleArray([
                problem.result,
                'A',
                'B',
                '1'
              ])
              
              return {
                question: `Simplifica la expresión XOR: ${problem.expr}`,
                options: shuffled.options,
                correct: shuffled.correct,
                explanation: `${problem.reason}: ${problem.expr} = ${problem.result}`,
                hint: 'Recuerda las propiedades especiales de XOR',
                templateId: 'xor-simplification'
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
        generated: true,
        timestamp: new Date().toISOString()
      }
    }
  
    // 📐 GENERADOR DE PREGUNTAS DE FORMAS CANÓNICAS
    generateCanonicalQuestion(difficulty, id, usedTemplates) {
      const templates = {
        easy: [
          {
            id: 'form-identification',
            generator: () => {
              const forms = [
                { expr: 'A·B + A·B\' + A\'·B', type: 'SOP (Suma de Productos)', reason: 'productos sumados' },
                { expr: '(A+B)·(A+B\')·(A\'+B)', type: 'POS (Producto de Sumas)', reason: 'sumas multiplicadas' },
                { expr: 'm₀ + m₁ + m₃', type: 'SOP canónica (minitérminos)', reason: 'suma de minitérminos' },
                { expr: 'M₀·M₁·M₃', type: 'POS canónica (maxitérminos)', reason: 'producto de maxitérminos' }
              ]
              const form = forms[Math.floor(Math.random() * forms.length)]
              
              const allTypes = forms.map(f => f.type)
              const wrongTypes = allTypes.filter(t => t !== form.type).slice(0, 3)
              const shuffled = this.shuffleArray([form.type, ...wrongTypes])
              
              return {
                question: `¿Qué forma canónica representa: ${form.expr}?`,
                options: shuffled.options,
                correct: shuffled.correct,
                explanation: `Esta expresión es ${form.type} porque tiene ${form.reason}.`,
                hint: 'SOP suma productos, POS multiplica sumas',
                templateId: 'form-identification'
              }
            }
          },
          {
            id: 'minterm-concept',
            generator: () => {
              const concepts = [
                { question: '¿Cuántos minitérminos tiene una función de 3 variables?', answer: '8', explanation: '2³ = 8 combinaciones posibles' },
                { question: '¿Cuántos maxitérminos tiene una función de 2 variables?', answer: '4', explanation: '2² = 4 combinaciones posibles' },
                { question: 'En una función de 4 variables, ¿cuántos minitérminos hay?', answer: '16', explanation: '2⁴ = 16 combinaciones' }
              ]
              const concept = concepts[Math.floor(Math.random() * concepts.length)]
              
              const shuffled = this.shuffleArray([
                concept.answer,
                '2',
                '6',
                '32'
              ])
              
              return {
                question: concept.question,
                options: shuffled.options,
                correct: shuffled.correct,
                explanation: concept.explanation,
                hint: 'Usa 2ⁿ donde n es el número de variables',
                templateId: 'minterm-concept'
              }
            }
          }
        ],
        medium: [
          {
            id: 'notation-conversion',
            generator: () => {
              const conversions = [
                { 
                  from: 'F(A,B,C) = Σ(1,3,5,7)',
                  to: 'SOP: A\'·B·C + A\'·B·C\' + ... (suma de minitérminos)',
                  form: 'notación Σ a expresión SOP'
                },
                {
                  from: 'F(A,B) = Π(0,2)',
                  to: 'POS: (A+B)·(A\'+B) (producto de maxitérminos)',
                  form: 'notación Π a expresión POS'
                }
              ]
              const conv = conversions[Math.floor(Math.random() * conversions.length)]
              
              const shuffled = this.shuffleArray([
                conv.to,
                'No se puede convertir',
                'A + B + C',
                'A · B · C'
              ])
              
              return {
                question: `Convierte ${conv.from} a ${conv.form}:`,
                options: shuffled.options,
                correct: shuffled.correct,
                explanation: `En ${conv.form}, cada número representa una combinación específica de variables.`,
                hint: 'Σ para SOP (minitérminos), Π para POS (maxitérminos)',
                templateId: 'notation-conversion'
              }
            }
          },
          {
            id: 'duality-principle',
            generator: () => {
              const duals = [
                { original: 'A + B', dual: 'A · B', operation: 'intercambiar + por ·' },
                { original: 'A · (B + C)', dual: 'A + (B · C)', operation: 'intercambiar operadores' },
                { original: '(A + 0) · 1', dual: '(A · 1) + 0', operation: 'intercambiar todo' }
              ]
              const dualPair = duals[Math.floor(Math.random() * duals.length)]
              
              const shuffled = this.shuffleArray([
                dualPair.dual,
                'A\'',
                dualPair.original,
                'A + B + C'
              ])
              
              return {
                question: `¿Cuál es la expresión dual de: ${dualPair.original}?`,
                options: shuffled.options,
                correct: shuffled.correct,
                explanation: `El dual se obtiene al ${dualPair.operation}: ${dualPair.original} → ${dualPair.dual}`,
                hint: 'Intercambia + por · y 0 por 1',
                templateId: 'duality-principle'
              }
            }
          }
        ],
        hard: [
          {
            id: 'sop-pos-conversion',
            generator: () => {
              const problems = [
                {
                  sop: 'F = Σ(0,2,5,7)',
                  pos: 'F = Π(1,3,4,6)',
                  vars: '3 variables',
                  explanation: 'Los maxitérminos son el complemento de los minitérminos'
                },
                {
                  sop: 'F = m₁ + m₂',
                  pos: 'F = M₀ · M₃',
                  vars: '2 variables (0-3)',
                  explanation: 'Maxitérminos faltantes son 0 y 3'
                }
              ]
              const problem = problems[Math.floor(Math.random() * problems.length)]
              
              const shuffled = this.shuffleArray([
                problem.pos,
                'Π(0,2,5,7)',
                'Σ(1,3,4,6)',
                'No tiene forma POS'
              ])
              
              return {
                question: `Si ${problem.sop} (${problem.vars}), ¿cuál es su forma POS equivalente?`,
                options: shuffled.options,
                correct: shuffled.correct,
                explanation: `${problem.explanation}. SOP: ${problem.sop} → POS: ${problem.pos}`,
                hint: 'POS usa los índices NO presentes en SOP',
                templateId: 'sop-pos-conversion'
              }
            }
          },
          {
            id: 'canonical-to-standard',
            generator: () => {
              const conversions = [
                {
                  canonical: 'A·B·C\' + A·B\'·C + A\'·B·C',
                  standard: 'A·C + B·C',
                  method: 'Factorización y simplificación'
                },
                {
                  canonical: '(A+B+C)·(A+B\'+C)·(A\'+B+C)',
                  standard: '(A+C)·(B+C)',
                  method: 'Consenso y absorción'
                }
              ]
              const conv = conversions[Math.floor(Math.random() * conversions.length)]
              
              const shuffled = this.shuffleArray([
                conv.standard,
                'A + B + C',
                'A · B · C',
                conv.canonical
              ])
              
              return {
                question: `Convierte de forma canónica a estándar: ${conv.canonical}`,
                options: shuffled.options,
                correct: shuffled.correct,
                explanation: `Usando ${conv.method}, simplificamos a: ${conv.standard}`,
                hint: 'Busca términos que se puedan factorizar o absorber',
                templateId: 'canonical-to-standard'
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
        generated: true,
        timestamp: new Date().toISOString()
      }
    }
  
    // 🗺️ GENERADOR DE PREGUNTAS DE MAPAS DE KARNAUGH
    generateKarnaughQuestion(difficulty, id, usedTemplates) {
      const templates = {
        easy: [
          {
            id: 'kmap-basics',
            generator: () => {
              const questions = [
                { q: '¿Cuántas celdas tiene un Mapa K de 2 variables?', a: '4', exp: '2² = 4 celdas' },
                { q: '¿Cuántas celdas tiene un Mapa K de 3 variables?', a: '8', exp: '2³ = 8 celdas' },
                { q: '¿Cuántas celdas tiene un Mapa K de 4 variables?', a: '16', exp: '2⁴ = 16 celdas' }
              ]
              const question = questions[Math.floor(Math.random() * questions.length)]
              
              const shuffled = this.shuffleArray([
                question.a,
                '2',
                '6',
                '32'
              ])
              
              return {
                question: question.q,
                options: shuffled.options,
                correct: shuffled.correct,
                explanation: question.exp,
                hint: 'Usa 2ⁿ para n variables',
                templateId: 'kmap-basics'
              }
            }
          },
          {
            id: 'grouping-rules',
            generator: () => {
              const rules = [
                { rule: 'Los grupos deben ser de tamaño potencia de 2', sizes: '1, 2, 4, 8, 16', why: 'Para simplificación efectiva' },
                { rule: 'Los grupos deben ser rectangulares', shape: 'filas × columnas', why: 'No diagonales ni formas irregulares' },
                { rule: 'Los grupos pueden envolver los bordes', wraps: 'arriba-abajo, izquierda-derecha', why: 'El mapa es toroidal (cíclico)' },
                { rule: 'Buscar el menor número de grupos más grandes', goal: 'Máxima simplificación', why: 'Menos términos en la expresión final' }
              ]
              const rule = rules[Math.floor(Math.random() * rules.length)]
              
              const wrongRules = [
                'Grupos de cualquier tamaño',
                'Solo grupos cuadrados',
                'No se pueden envolver bordes',
                'Muchos grupos pequeños'
              ]
              const shuffled = this.shuffleArray([rule.rule, ...wrongRules.slice(0, 3)])
              
              return {
                question: `¿Cuál es una regla CORRECTA para agrupar en Mapas de Karnaugh?`,
                options: shuffled.options,
                correct: shuffled.correct,
                explanation: `${rule.rule} porque ${rule.why}.`,
                hint: 'Los grupos siguen reglas específicas de tamaño y forma',
                templateId: 'grouping-rules'
              }
            }
          }
        ],
        medium: [
          {
            id: 'gray-code-order',
            generator: () => {
              const sequences = [
                { question: 'En un Mapa K de 2 variables (AB), ¿cuál es el orden correcto?', correct: '00, 01, 11, 10', wrong: ['00, 01, 10, 11', '00, 10, 01, 11'] },
                { question: 'En un Mapa K de 3 variables (ABC), columnas correctas:', correct: '00, 01, 11, 10', wrong: ['00, 01, 10, 11', '00, 10, 11, 01'] },
                { question: '¿Por qué se usa Código Gray en Mapas K?', correct: 'Solo cambia 1 bit entre celdas adyacentes', wrong: ['Es más fácil de recordar', 'Usa menos espacio', 'Es alfabético'] }
              ]
              const seq = sequences[Math.floor(Math.random() * sequences.length)]
              
              const allOptions = [seq.correct, ...seq.wrong]
              const shuffled = this.shuffleArray(allOptions)
              
              return {
                question: seq.question,
                options: shuffled.options,
                correct: shuffled.correct,
                explanation: `El Código Gray asegura que solo un bit cambie entre celdas adyacentes, facilitando la agrupación.`,
                hint: 'Gray Code: solo 1 bit cambia entre vecinos',
                templateId: 'gray-code-order'
              }
            }
          },
          {
            id: 'group-to-term',
            generator: () => {
              const groups = [
                { 
                  desc: 'Un grupo de 4 celdas en una fila con A=1',
                  term: 'A',
                  explanation: 'B y C varían (se eliminan), solo A=1 es constante'
                },
                {
                  desc: 'Un grupo de 2 celdas con A=0, B=1, C varía',
                  term: 'A\'·B',
                  explanation: 'A=0 (A\'), B=1, C varía (se elimina)'
                },
                {
                  desc: 'Grupo de 8 celdas (todo el mapa)',
                  term: '1',
                  explanation: 'Todas las variables varían, función siempre verdadera'
                }
              ]
              const group = groups[Math.floor(Math.random() * groups.length)]
              
              const shuffled = this.shuffleArray([
                group.term,
                'A·B·C',
                'A+B+C',
                '0'
              ])
              
              return {
                question: `En un Mapa K de 3 variables: ${group.desc}. ¿Qué término representa?`,
                options: shuffled.options,
                correct: shuffled.correct,
                explanation: group.explanation,
                hint: 'Las variables que varían se eliminan del término',
                templateId: 'group-to-term'
              }
            }
          }
        ],
        hard: [
          {
            id: 'overlapping-groups',
            generator: () => {
              const scenarios = [
                {
                  situation: '¿Pueden dos grupos compartir celdas en común?',
                  answer: 'Sí, para lograr mejor simplificación',
                  explanation: 'Compartir celdas permite menos términos en total'
                },
                {
                  situation: '¿Toda celda con 1 debe estar en al menos un grupo?',
                  answer: 'Sí, todas deben cubrirse',
                  explanation: 'Cada minitérmino debe estar representado'
                },
                {
                  situation: '¿Es mejor un grupo de 8 o dos de 4 que no se solapan?',
                  answer: 'Un grupo de 8 (menos términos)',
                  explanation: 'Grupos más grandes = expresión más simple'
                }
              ]
              const scenario = scenarios[Math.floor(Math.random() * scenarios.length)]
              
              const wrongAnswers = [
                'No, nunca deben solaparse',
                'No importa',
                'Depende del circuito'
              ]
              const shuffled = this.shuffleArray([scenario.answer, ...wrongAnswers.slice(0, 3)])
              
              return {
                question: scenario.situation,
                options: shuffled.options,
                correct: shuffled.correct,
                explanation: scenario.explanation,
                hint: 'Busca la máxima simplificación posible',
                templateId: 'overlapping-groups'
              }
            }
          },
          {
            id: 'dont-care-conditions',
            generator: () => {
              const dontCares = [
                {
                  question: '¿Qué representan las condiciones "don\'t care" (X) en un Mapa K?',
                  answer: 'Combinaciones que nunca ocurren o no importan',
                  explanation: 'Podemos tratarlas como 0 o 1 según convenga'
                },
                {
                  question: '¿Cómo usar condiciones X para simplificar?',
                  answer: 'Incluirlas en grupos si ayudan a hacer grupos más grandes',
                  explanation: 'Tratar X como 1 si agranda grupos, como 0 si no'
                },
                {
                  question: '¿Son obligatorias las X en la expresión final?',
                  answer: 'No, solo se usan si ayudan a simplificar',
                  explanation: 'X son opcionales, usarlas es una ventaja'
                }
              ]
              const dc = dontCares[Math.floor(Math.random() * dontCares.length)]
              
              const wrongAnswers = [
                'Siempre son 0',
                'Siempre son 1',
                'Son errores en la tabla'
              ]
              const shuffled = this.shuffleArray([dc.answer, ...wrongAnswers.slice(0, 3)])
              
              return {
                question: dc.question,
                options: shuffled.options,
                correct: shuffled.correct,
                explanation: dc.explanation,
                hint: 'Don\'t care = flexibilidad para simplificar',
                templateId: 'dont-care-conditions'
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
        generated: true,
        timestamp: new Date().toISOString()
      }
    }
  
    // 🔧 FUNCIONES AUXILIARES
    getLawExplanation(lawName) {
      const explanations = {
        'Identidad': 'El elemento neutro no cambia el valor',
        'Anulación': 'El elemento absorbente domina la operación',
        'Idempotencia': 'Una variable operada consigo misma da ella misma',
        'Complemento': 'Una variable con su complemento produce 0 o 1',
        'Doble Negación': 'Negar dos veces devuelve el valor original',
        'Conmutativa': 'El orden de los operandos no importa',
        'Asociativa': 'La agrupación de operandos no importa',
        'Distributiva': 'Multiplicar suma = sumar productos',
        'Absorción': 'Un término más simple absorbe al más complejo',
        'De Morgan': 'La negación transforma operadores'
      }
      return explanations[lawName] || ''
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
        algebraStats: { 
          totalQuizzes: 0, 
          averageScore: 0,
          challengesCompleted: 0,
          challengeSuccessRate: 0
        },
        algebraPerformance: { 
          laws: 50, 
          simplification: 50, 
          canonical: 50, 
          karnaugh: 50 
        },
        preferences: { 
          difficulty: 'medium', 
          favoriteLaws: ['De Morgan', 'Distributiva'],
          challengeTypes: ['basic']
        }
      }
  
      try {
        return JSON.parse(localStorage.getItem('algebraUserProfile') || JSON.stringify(defaultProfile))
      } catch {
        return defaultProfile
      }
    }
  
    updateUserProfile(results) {
      if (results.type === 'quiz') {
        this.userProfile.algebraStats.totalQuizzes++
        const newAverage = (this.userProfile.algebraStats.averageScore + results.scorePercentage) / 2
        this.userProfile.algebraStats.averageScore = Math.round(newAverage)
  
        results.questions.forEach(q => {
          const isCorrect = results.userAnswers[q.id] === q.correct
          const currentPerf = this.userProfile.algebraPerformance[q.type] || 50
          
          this.userProfile.algebraPerformance[q.type] = isCorrect 
            ? Math.min(100, currentPerf + 3)
            : Math.max(0, currentPerf - 2)
        })
      }
  
      localStorage.setItem('algebraUserProfile', JSON.stringify(this.userProfile))
    }
  
    loadQuestionHistory() {
      try {
        return JSON.parse(localStorage.getItem('algebraQuestionHistory') || '[]')
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
      
      localStorage.setItem('algebraQuestionHistory', JSON.stringify(this.questionHistory))
    }
  
    loadChallengeHistory() {
      try {
        return JSON.parse(localStorage.getItem('algebraChallengeHistory') || '[]')
      } catch {
        return []
      }
    }
  
    // 📈 ESTADÍSTICAS Y ANÁLISIS
    getDetailedAlgebraStats() {
      return {
        profile: this.userProfile,
        strengths: this.getAlgebraStrengths(),
        weaknesses: this.getAlgebraWeaknesses(),
        recommendations: this.getAlgebraRecommendations(),
        progressTrend: this.calculateAlgebraProgress()
      }
    }
  
    getAlgebraStrengths() {
      return Object.entries(this.userProfile.algebraPerformance)
        .filter(([_, score]) => score > 75)
        .map(([area, score]) => ({
          area,
          score,
          description: this.getAreaDescription(area)
        }))
    }
  
    getAlgebraWeaknesses() {
      return Object.entries(this.userProfile.algebraPerformance)
        .filter(([_, score]) => score < 60)
        .map(([area, score]) => ({
          area,
          score,
          description: this.getAreaDescription(area)
        }))
    }
  
    getAreaDescription(area) {
      const descriptions = {
        laws: 'Leyes del Álgebra de Boole',
        simplification: 'Simplificación de expresiones',
        canonical: 'Formas canónicas (SOP/POS)',
        karnaugh: 'Mapas de Karnaugh'
      }
      return descriptions[area] || area
    }
  
    getAlgebraRecommendations() {
      const weaknesses = this.getAlgebraWeaknesses()
      
      return weaknesses.map(weakness => {
        const recommendations = {
          laws: 'Repasa las leyes fundamentales: identidad, complemento, De Morgan',
          simplification: 'Practica con ejercicios de simplificación paso a paso',
          canonical: 'Estudia la conversión entre SOP, POS y notación Σ/Π',
          karnaugh: 'Practica agrupamiento en Mapas K de 3 y 4 variables'
        }
        
        return {
          area: weakness.area,
          message: recommendations[weakness.area],
          priority: weakness.score < 40 ? 'high' : 'medium'
        }
      })
    }
  
    calculateAlgebraProgress() {
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
  
  // 📊 ANALIZADOR DE RENDIMIENTO
  class AlgebraPerformanceAnalyzer {
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
  export const algebraQuestionGenerator = new AlgebraQuestionGenerator()
  export default algebraQuestionGenerator