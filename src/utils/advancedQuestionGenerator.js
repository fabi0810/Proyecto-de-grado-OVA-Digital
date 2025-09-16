// src/utils/advancedQuestionGenerator.js

// 🧠 SISTEMA INTELIGENTE SIN API - Completamente gratuito
export class AdvancedQuestionGenerator {
    constructor() {
      this.userProfile = this.loadUserProfile()
      this.questionHistory = this.loadQuestionHistory()
      this.performanceAnalyzer = new PerformanceAnalyzer()
    }
  
    // 🎯 GENERADOR CON INTELIGENCIA ADAPTATIVA
    generateAdaptiveQuiz(mode, count = 5) {
      const userLevel = this.determineUserLevel()
      const weakAreas = this.identifyWeakAreas()
      const preferredTypes = this.getPreferredQuestionTypes()
  
      console.log('🎯 Generando quiz adaptativo:', {
        userLevel,
        weakAreas,
        preferredTypes,
        mode
      })
  
      return this.createPersonalizedQuestions(mode, count, {
        level: userLevel,
        focusAreas: weakAreas,
        questionTypes: preferredTypes
      })
    }
  
    // 🔍 ANÁLISIS DE RENDIMIENTO DEL USUARIO
    determineUserLevel() {
      const stats = this.userProfile.stats
      
      if (stats.totalQuizzes < 3) return 'beginner'
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
  
      return weakAreas.length > 0 ? weakAreas : ['conversion'] // default
    }
  
    // 🎲 GENERADORES DE PREGUNTAS ESPECÍFICAS
    createPersonalizedQuestions(mode, count, profile) {
      const questions = []
      const difficultyDistribution = this.getDifficultyDistribution(mode, profile.level)
      
      for (let i = 0; i < count; i++) {
        const difficulty = difficultyDistribution[i % difficultyDistribution.length]
        const questionType = this.selectQuestionType(profile.focusAreas)
        
        const question = this.generateSpecificQuestion(questionType, difficulty, i)
        if (question) {
          questions.push(question)
        }
      }
  
      // Guardar en historial para futura adaptación
      this.updateQuestionHistory(questions)
      return questions
    }
  
    // 📊 DISTRIBUCIÓN DE DIFICULTAD INTELIGENTE
    getDifficultyDistribution(mode, userLevel) {
      const distributions = {
        beginner: {
          practice: ['easy', 'easy', 'easy', 'medium', 'medium'],
          exam: ['easy', 'easy', 'medium', 'medium', 'medium', 'hard', 'hard', 'hard']
        },
        intermediate: {
          practice: ['easy', 'medium', 'medium', 'medium', 'hard'],
          exam: ['easy', 'medium', 'medium', 'medium', 'hard', 'hard', 'hard', 'hard']
        },
        advanced: {
          practice: ['medium', 'medium', 'hard', 'hard', 'hard'],
          exam: ['medium', 'medium', 'hard', 'hard', 'hard', 'hard', 'expert', 'expert']
        }
      }
  
      return distributions[userLevel][mode] || distributions.intermediate[mode]
    }
  
    // 🎯 SELECTOR INTELIGENTE DE TIPOS DE PREGUNTA
    selectQuestionType(focusAreas) {
      if (focusAreas.length === 0) {
        return ['conversion', 'theory', 'application'][Math.floor(Math.random() * 3)]
      }
  
      // Priorizar áreas débiles con 70% de probabilidad
      return Math.random() < 0.7 
        ? focusAreas[Math.floor(Math.random() * focusAreas.length)]
        : ['conversion', 'theory', 'application'][Math.floor(Math.random() * 3)]
    }
  
    // 🏭 FÁBRICA DE PREGUNTAS AVANZADAS
    generateSpecificQuestion(type, difficulty, id) {
      const generators = {
        conversion: this.generateConversionQuestion,
        theory: this.generateTheoryQuestion,
        application: this.generateApplicationQuestion,
        arithmetic: this.generateArithmeticQuestion,
        bitwise: this.generateBitwiseQuestion
      }
  
      const generator = generators[type] || generators.conversion
      return generator.call(this, difficulty, id)
    }
  
    generateConversionQuestion(difficulty, id) {
      const templates = {
        easy: [
          {
            template: "Convierte {decimal} decimal a binario",
            range: [1, 31],
            generator: (num) => ({
              question: `Convierte ${num} decimal a binario`,
              options: this.shuffleWithCorrect([
                num.toString(2),
                (num + 1).toString(2),
                (num - 1).toString(2),
                (num + 2).toString(2)
              ]),
              explanation: `${num}₁₀ = ${num.toString(2)}₂. Método: dividir por 2 repetidamente`,
              hint: "Divide por 2 y toma los residuos de abajo hacia arriba"
            })
          },
          {
            template: "¿Cuánto vale {binary} binario en decimal?",
            range: [1, 31],
            generator: (num) => ({
              question: `¿Cuánto vale ${num.toString(2)} binario en decimal?`,
              options: this.shuffleWithCorrect([
                num.toString(),
                (num + 1).toString(),
                (num - 1).toString(),
                Math.floor(num / 2).toString()
              ]),
              explanation: `${num.toString(2)}₂ = ${num}₁₀. Suma las potencias de 2`,
              hint: "Multiplica cada bit por su potencia de 2 correspondiente"
            })
          }
        ],
        medium: [
          {
            template: "Convierte {hex} hexadecimal a decimal",
            range: [16, 255],
            generator: (num) => ({
              question: `Convierte ${num.toString(16).toUpperCase()} hexadecimal a decimal`,
              options: this.shuffleWithCorrect([
                num.toString(),
                (num + 10).toString(),
                (num - 5).toString(),
                (num + 16).toString()
              ]),
              explanation: `${num.toString(16).toUpperCase()}₁₆ = ${num}₁₀`,
              hint: "Multiplica cada dígito por su potencia de 16"
            })
          },
          {
            template: "Suma binaria: {bin1} + {bin2}",
            range: [1, 15],
            generator: (num1, num2 = Math.floor(Math.random() * 15) + 1) => {
              const sum = num1 + num2
              return {
                question: `¿Cuál es la suma binaria ${num1.toString(2)} + ${num2.toString(2)}?`,
                options: this.shuffleWithCorrect([
                  sum.toString(2),
                  (sum + 1).toString(2),
                  (sum - 1).toString(2),
                  (sum + 2).toString(2)
                ]),
                explanation: `${num1.toString(2)} + ${num2.toString(2)} = ${sum.toString(2)}`,
                hint: "Suma bit por bit, recuerda que 1+1=10 en binario"
              }
            }
          }
        ],
        hard: [
          {
            template: "Conversión múltiple: {decimal} decimal a todas las bases",
            range: [50, 200],
            generator: (num) => {
              const bases = {
                binary: num.toString(2),
                octal: num.toString(8),
                hex: num.toString(16).toUpperCase()
              }
              const correct = `Bin: ${bases.binary}, Oct: ${bases.octal}, Hex: ${bases.hex}`
              
              return {
                question: `Convierte ${num} decimal a binario, octal y hexadecimal`,
                options: this.shuffleWithCorrect([
                  correct,
                  `Bin: ${(num+1).toString(2)}, Oct: ${bases.octal}, Hex: ${bases.hex}`,
                  `Bin: ${bases.binary}, Oct: ${(num+1).toString(8)}, Hex: ${bases.hex}`,
                  `Bin: ${bases.binary}, Oct: ${bases.octal}, Hex: ${(num+1).toString(16).toUpperCase()}`
                ]),
                explanation: `${num}₁₀ = ${bases.binary}₂ = ${bases.octal}₈ = ${bases.hex}₁₆`,
                hint: "Convierte a cada base usando divisiones sucesivas"
              }
            }
          }
        ]
      }
  
      const difficultyTemplates = templates[difficulty] || templates.easy
      const template = difficultyTemplates[Math.floor(Math.random() * difficultyTemplates.length)]
      const num = Math.floor(Math.random() * (template.range[1] - template.range[0] + 1)) + template.range[0]
      
      const questionData = template.generator(num)
      
      return {
        id: Date.now() + id + Math.random(),
        type: 'conversion',
        difficulty,
        ...questionData,
        timestamp: new Date().toISOString()
      }
    }
  
    generateTheoryQuestion(difficulty, id) {
      const questions = {
        easy: [
          {
            question: "¿Cuál es la principal ventaja del sistema binario en computación?",
            options: [
              "Se implementa fácilmente con estados ON/OFF",
              "Es más rápido que el decimal",
              "Usa menos memoria",
              "Es más fácil de entender"
            ],
            correct: 0,
            explanation: "Los circuitos digitales manejan naturalmente dos estados eléctricos",
            hint: "Piensa en interruptores de luz: encendido/apagado"
          },
          {
            question: `En base ${Math.floor(Math.random() * 5) + 5}, ¿cuál es el dígito más grande?`,
            options: [],
            correct: 0,
            explanation: "",
            hint: "El dígito más grande es siempre la base menos 1"
          }
        ],
        medium: [
          {
            question: "¿Por qué se usa hexadecimal en programación?",
            options: [
              "Cada byte se representa con exactamente 2 dígitos hexadecimales",
              "Es más fácil de leer que binario",
              "Es el estándar internacional",
              "Ocupa menos espacio"
            ],
            correct: 0,
            explanation: "1 byte = 8 bits = 2 dígitos hexadecimales exactamente",
            hint: "Relaciona bytes con dígitos hexadecimales"
          }
        ],
        hard: [
          {
            question: "En arquitectura de computadores, ¿qué significa 'word size' de 64 bits?",
            options: [
              "El procesador maneja datos de 64 bits en una operación",
              "La memoria tiene 64 bits",
              "El disco duro es de 64 bits",
              "La velocidad es de 64 bits por segundo"
            ],
            correct: 0,
            explanation: "Word size determina cuántos bits procesa la CPU simultáneamente",
            hint: "Se refiere a la unidad básica de procesamiento de la CPU"
          }
        ]
      }
  
      const difficultyQuestions = questions[difficulty] || questions.easy
      const question = difficultyQuestions[Math.floor(Math.random() * difficultyQuestions.length)]
      
      // Para preguntas dinámicas con números
      if (question.question.includes("base")) {
        const base = Math.floor(Math.random() * 5) + 5
        question.question = question.question.replace(/base \d+/, `base ${base}`)
        question.options = [
          (base - 1).toString(),
          base.toString(),
          (base + 1).toString(),
          (base - 2).toString()
        ]
        question.explanation = `En base ${base}, el dígito más grande es ${base - 1}`
      }
  
      return {
        id: Date.now() + id + Math.random(),
        type: 'theory',
        difficulty,
        ...question,
        timestamp: new Date().toISOString()
      }
    }
  
    generateApplicationQuestion(difficulty, id) {
      const scenarios = {
        easy: [
          {
            context: "Desarrollo web",
            question: "En CSS, el color #FF0000 representa:",
            options: ["Rojo puro", "Verde puro", "Azul puro", "Blanco"],
            correct: 0,
            explanation: "FF en hex = 255 en decimal = máximo rojo, 00 = sin verde/azul",
            hint: "#RRGGBB format - FF es el máximo valor"
          }
        ],
        medium: [
          {
            context: "Redes de computadores",
            question: `Una subred /24 puede tener hasta cuántas direcciones host?`,
            options: ["254", "256", "253", "255"],
            correct: 0,
            explanation: "2^8 - 2 = 254 (se excluyen red y broadcast)",
            hint: "24 bits de red dejan 8 bits para host"
          }
        ],
        hard: [
          {
            context: "Sistemas embebidos",
            question: `Un microcontrolador de 8 bits puede direccionar directamente:`,
            options: ["256 ubicaciones", "128 ubicaciones", "512 ubicaciones", "64 ubicaciones"],
            correct: 0,
            explanation: "2^8 = 256 ubicaciones de memoria distintas (0-255)",
            hint: "Calcula 2 elevado al número de bits de dirección"
          }
        ]
      }
  
      const difficultyScenarios = scenarios[difficulty] || scenarios.easy
      const scenario = difficultyScenarios[Math.floor(Math.random() * difficultyScenarios.length)]
  
      return {
        id: Date.now() + id + Math.random(),
        type: 'application',
        difficulty,
        context: scenario.context,
        ...scenario,
        timestamp: new Date().toISOString()
      }
    }
  
    // 🔀 UTILIDADES DE MEZCLA
    shuffleWithCorrect(options) {
      const correct = options[0]
      const shuffled = [...options].sort(() => Math.random() - 0.5)
      return {
        options: shuffled,
        correct: shuffled.indexOf(correct)
      }
    }
  
    // 💾 PERSISTENCIA DE DATOS
    loadUserProfile() {
      const defaultProfile = {
        stats: { totalQuizzes: 0, averageScore: 0 },
        performance: { conversion: 50, theory: 50, application: 50 },
        preferences: { difficulty: 'medium', focusAreas: [] }
      }
  
      return JSON.parse(localStorage.getItem('userProfile') || JSON.stringify(defaultProfile))
    }
  
    updateUserProfile(quizResults) {
      this.userProfile.stats.totalQuizzes++
      this.userProfile.stats.averageScore = 
        (this.userProfile.stats.averageScore + quizResults.score) / this.userProfile.stats.totalQuizzes
  
      // Actualizar rendimiento por área
      quizResults.questions.forEach(q => {
        const isCorrect = quizResults.userAnswers[q.id] === q.correct
        const currentPerf = this.userProfile.performance[q.type] || 50
        
        // Ajuste gradual del rendimiento
        this.userProfile.performance[q.type] = isCorrect 
          ? Math.min(100, currentPerf + 5)
          : Math.max(0, currentPerf - 3)
      })
  
      localStorage.setItem('userProfile', JSON.stringify(this.userProfile))
    }
  
    loadQuestionHistory() {
      return JSON.parse(localStorage.getItem('questionHistory') || '[]')
    }
  
    updateQuestionHistory(questions) {
      this.questionHistory.push(...questions.map(q => q.id))
      // Mantener solo las últimas 100 preguntas
      if (this.questionHistory.length > 100) {
        this.questionHistory = this.questionHistory.slice(-100)
      }
      localStorage.setItem('questionHistory', JSON.stringify(this.questionHistory))
    }
  
    // 📈 ESTADÍSTICAS Y ANÁLISIS
    getDetailedStats() {
      return {
        profile: this.userProfile,
        strengths: this.getStrengths(),
        recommendations: this.getRecommendations(),
        progressTrend: this.calculateProgressTrend()
      }
    }
  
    getStrengths() {
      return Object.entries(this.userProfile.performance)
        .filter(([_, score]) => score > 75)
        .map(([area]) => area)
    }
  
    getRecommendations() {
      const weakAreas = Object.entries(this.userProfile.performance)
        .filter(([_, score]) => score < 60)
        .map(([area]) => area)
  
      return weakAreas.map(area => ({
        area,
        message: `Practica más ejercicios de ${area}`,
        priority: this.userProfile.performance[area] < 40 ? 'high' : 'medium'
      }))
    }
  }
  
  // 📊 ANALIZADOR DE RENDIMIENTO
  class PerformanceAnalyzer {
    analyzeQuizResults(questions, userAnswers) {
      const analysis = {
        totalQuestions: questions.length,
        correctAnswers: 0,
        byType: {},
        byDifficulty: {},
        timePerQuestion: [],
        weakTopics: []
      }
  
      questions.forEach(question => {
        const isCorrect = userAnswers[question.id] === question.correct
        
        if (isCorrect) analysis.correctAnswers++
  
        // Análisis por tipo
        if (!analysis.byType[question.type]) {
          analysis.byType[question.type] = { correct: 0, total: 0 }
        }
        analysis.byType[question.type].total++
        if (isCorrect) analysis.byType[question.type].correct++
  
        // Análisis por dificultad
        if (!analysis.byDifficulty[question.difficulty]) {
          analysis.byDifficulty[question.difficulty] = { correct: 0, total: 0 }
        }
        analysis.byDifficulty[question.difficulty].total++
        if (isCorrect) analysis.byDifficulty[question.difficulty].correct++
      })
  
      // Identificar temas débiles
      Object.entries(analysis.byType).forEach(([type, stats]) => {
        const percentage = (stats.correct / stats.total) * 100
        if (percentage < 60) {
          analysis.weakTopics.push({
            topic: type,
            percentage,
            recommendation: this.getTopicRecommendation(type, percentage)
          })
        }
      })
  
      return analysis
    }
  
    getTopicRecommendation(topic, percentage) {
      const recommendations = {
        conversion: percentage < 40 
          ? "Practica conversiones básicas paso a paso"
          : "Refuerza con ejercicios de conversión mixta",
        theory: percentage < 40
          ? "Revisa los conceptos fundamentales de sistemas numéricos"
          : "Estudia aplicaciones avanzadas de los sistemas",
        application: percentage < 40
          ? "Conecta la teoría con ejemplos prácticos"
          : "Practica problemas de aplicación compleja"
      }
  
      return recommendations[topic] || "Continúa practicando regularmente"
    }
  }
  
  // Exportar instancia singleton
  export const questionGenerator = new AdvancedQuestionGenerator()
  export default questionGenerator