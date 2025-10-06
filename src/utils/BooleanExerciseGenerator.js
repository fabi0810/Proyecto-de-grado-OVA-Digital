/**
 * Generador de Ejercicios de Álgebra Booleana con ChatGPT API
 * Crea ejercicios únicos y contextualizados para estudiantes de ingeniería
 */

export class BooleanExerciseGenerator {
  constructor() {
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY
    this.baseUrl = 'https://api.openai.com/v1/chat/completions'
    this.exerciseCache = new Map()
    this.userProfile = this.loadUserProfile()
  }

  /**
   * Genera un ejercicio personalizado usando ChatGPT
   */
  async generateCustomExercise(options = {}) {
    const {
      difficulty = 'medium',
      topic = 'simplification',
      context = 'engineering',
      variables = 3,
      timeLimit = null
    } = options

    try {
      const prompt = this.createExercisePrompt(difficulty, topic, context, variables)
      const response = await this.callChatGPTAPI(prompt)
      
      if (response.success) {
        const exercise = this.parseExerciseResponse(response.content, options)
        this.cacheExercise(exercise)
        return exercise
      } else {
        throw new Error(response.error)
      }
    } catch (error) {
      console.error('Error generando ejercicio con ChatGPT:', error)
      return this.generateFallbackExercise(options)
    }
  }

  /**
   * Crea el prompt para ChatGPT
   */
  createExercisePrompt(difficulty, topic, context, variables) {
    const difficultyDescriptions = {
      'easy': 'básico con 2-3 variables, expresiones simples',
      'medium': 'intermedio con 3-4 variables, expresiones moderadamente complejas',
      'hard': 'avanzado con 4-5 variables, expresiones complejas',
      'expert': 'experto con 5+ variables, expresiones muy complejas'
    }

    const topicDescriptions = {
      'simplification': 'simplificación de expresiones booleanas usando teoremas',
      'truth-table': 'generación y análisis de tablas de verdad',
      'karnaugh': 'mapas de Karnaugh para simplificación',
      'conversion': 'conversión entre diferentes formas de expresiones',
      'verification': 'verificación de equivalencia lógica',
      'application': 'aplicación práctica en sistemas digitales'
    }

    const contextDescriptions = {
      'engineering': 'ingeniería de sistemas y computación',
      'electronics': 'electrónica digital y circuitos',
      'programming': 'programación y lógica computacional',
      'mathematics': 'matemáticas discretas y álgebra'
    }

    return `
Eres un experto en álgebra booleana y sistemas digitales. Genera un ejercicio educativo para estudiantes de 6º semestre de ingeniería.

REQUISITOS:
- Dificultad: ${difficultyDescriptions[difficulty]}
- Tema: ${topicDescriptions[topic]}
- Contexto: ${contextDescriptions[context]}
- Variables: ${variables} variables (A, B, C, etc.)
- Nivel: Estudiantes de ingeniería de sistemas

FORMATO DE RESPUESTA (JSON):
{
  "question": "Pregunta clara y específica",
  "context": "Contexto del problema en ingeniería",
  "expression": "Expresión booleana de ejemplo (si aplica)",
  "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
  "correctAnswer": "Respuesta correcta",
  "explanation": "Explicación detallada del proceso",
  "hint": "Pista para guiar al estudiante",
  "difficulty": "${difficulty}",
  "topic": "${topic}",
  "variables": ${variables},
  "timeLimit": ${timeLimit || 'null'},
  "learningObjectives": ["Objetivo 1", "Objetivo 2"],
  "prerequisites": ["Concepto 1", "Concepto 2"]
}

EJEMPLOS DE PREGUNTAS:

1. SIMPLIFICACIÓN:
"Simplifica la expresión A·B + A·B' + A'·B usando los teoremas del álgebra de Boole. ¿Cuál es la forma más simple?"

2. TABLA DE VERDAD:
"Dada la expresión (A + B)·(A' + C), genera su tabla de verdad y determina para qué combinaciones de A, B, C el resultado es verdadero."

3. MAPA DE KARNAUGH:
"Usando un mapa de Karnaugh, simplifica la función F(A,B,C) = Σ(0,2,4,6) y encuentra la expresión mínima."

4. APLICACIÓN:
"Diseña un circuito lógico que detecte cuando exactamente 2 de 3 sensores están activos. Expresa la función booleana y simplifícala."

Genera un ejercicio único y desafiante que:
- Sea relevante para ingeniería de sistemas
- Incluya contexto práctico
- Tenga múltiples pasos de solución
- Permita verificación de la respuesta
- Fomente el pensamiento crítico

Responde SOLO con el JSON, sin texto adicional.
    `.trim()
  }

  /**
   * Llama a la API de ChatGPT
   */
  async callChatGPTAPI(prompt) {
    if (!this.apiKey) {
      throw new Error('API key de OpenAI no configurada')
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'Eres un experto en álgebra booleana y sistemas digitales. Genera ejercicios educativos de alta calidad para estudiantes de ingeniería.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        throw new Error(`Error de API: ${response.status}`)
      }

      const data = await response.json()
      const content = data.choices[0].message.content

      return {
        success: true,
        content: content
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Parsea la respuesta de ChatGPT
   */
  parseExerciseResponse(content, options) {
    try {
      // Limpiar la respuesta y extraer JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No se encontró JSON válido en la respuesta')
      }

      const exerciseData = JSON.parse(jsonMatch[0])
      
      // Validar estructura requerida
      const requiredFields = ['question', 'correctAnswer', 'explanation']
      for (const field of requiredFields) {
        if (!exerciseData[field]) {
          throw new Error(`Campo requerido faltante: ${field}`)
        }
      }

      // Agregar metadatos
      exerciseData.id = this.generateExerciseId()
      exerciseData.timestamp = new Date().toISOString()
      exerciseData.source = 'chatgpt'
      exerciseData.userProfile = this.userProfile

      return exerciseData
    } catch (error) {
      console.error('Error parseando respuesta de ChatGPT:', error)
      throw new Error('Error procesando respuesta del ejercicio')
    }
  }

  /**
   * Genera ejercicio de respaldo si ChatGPT falla
   */
  generateFallbackExercise(options) {
    const fallbackExercises = {
      simplification: {
        question: "Simplifica la expresión A·B + A·B' usando los teoremas del álgebra de Boole",
        expression: "A·B + A·B'",
        correctAnswer: "A",
        explanation: "A·B + A·B' = A·(B + B') = A·1 = A (Ley distributiva y complemento)",
        hint: "Factoriza A y aplica la ley de complemento",
        difficulty: options.difficulty || 'medium',
        topic: 'simplification'
      },
      truthTable: {
        question: "Genera la tabla de verdad para la expresión A·B + A'·C",
        expression: "A·B + A'·C",
        correctAnswer: "Tabla de verdad con 8 filas",
        explanation: "Evalúa la expresión para todas las combinaciones de A, B, C",
        hint: "Considera cada combinación de valores 0 y 1",
        difficulty: options.difficulty || 'medium',
        topic: 'truth-table'
      },
      karnaugh: {
        question: "Usa un mapa de Karnaugh para simplificar F(A,B,C) = Σ(0,2,4,6)",
        expression: "F(A,B,C) = Σ(0,2,4,6)",
        correctAnswer: "A'·C' + A·C'",
        explanation: "Agrupa los mintérminos en el mapa K para obtener la expresión mínima",
        hint: "Busca grupos de 1s en el mapa",
        difficulty: options.difficulty || 'medium',
        topic: 'karnaugh'
      }
    }

    const topic = options.topic || 'simplification'
    const exercise = fallbackExercises[topic] || fallbackExercises.simplification
    
    return {
      ...exercise,
      id: this.generateExerciseId(),
      timestamp: new Date().toISOString(),
      source: 'fallback',
      options: this.generateOptions(exercise.correctAnswer, topic),
      variables: options.variables || 3
    }
  }

  /**
   * Genera opciones de respuesta
   */
  generateOptions(correctAnswer, topic) {
    const options = [correctAnswer]
    
    if (topic === 'simplification') {
      options.push(
        correctAnswer + "'",
        "1",
        "0",
        "A + B"
      )
    } else if (topic === 'truth-table') {
      options.push(
        "Tabla con 4 filas",
        "Tabla con 16 filas",
        "Solo filas con resultado 1",
        "Tabla vacía"
      )
    } else if (topic === 'karnaugh') {
      options.push(
        "A' + C'",
        "A·C",
        "A + C",
        "A'·C"
      )
    }
    
    return options.slice(0, 4)
  }

  /**
   * Genera ID único para ejercicio
   */
  generateExerciseId() {
    return `ex_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Cachea un ejercicio
   */
  cacheExercise(exercise) {
    this.exerciseCache.set(exercise.id, exercise)
    
    // Limitar cache a 100 ejercicios
    if (this.exerciseCache.size > 100) {
      const firstKey = this.exerciseCache.keys().next().value
      this.exerciseCache.delete(firstKey)
    }
  }

  /**
   * Obtiene ejercicio del cache
   */
  getCachedExercise(id) {
    return this.exerciseCache.get(id)
  }

  /**
   * Genera serie de ejercicios adaptativos
   */
  async generateAdaptiveSeries(count = 5, userLevel = 'medium') {
    const exercises = []
    const topics = ['simplification', 'truth-table', 'karnaugh', 'application']
    
    for (let i = 0; i < count; i++) {
      const topic = topics[i % topics.length]
      const difficulty = this.getAdaptiveDifficulty(userLevel, i, count)
      
      try {
        const exercise = await this.generateCustomExercise({
          difficulty,
          topic,
          context: 'engineering',
          variables: 3 + Math.floor(i / 2)
        })
        exercises.push(exercise)
      } catch (error) {
        console.error(`Error generando ejercicio ${i + 1}:`, error)
        // Usar ejercicio de respaldo
        exercises.push(this.generateFallbackExercise({
          difficulty,
          topic,
          variables: 3 + Math.floor(i / 2)
        }))
      }
    }
    
    return exercises
  }

  /**
   * Determina dificultad adaptativa
   */
  getAdaptiveDifficulty(userLevel, currentIndex, totalCount) {
    const progress = currentIndex / totalCount
    
    if (userLevel === 'beginner') {
      return progress < 0.5 ? 'easy' : 'medium'
    } else if (userLevel === 'intermediate') {
      return progress < 0.3 ? 'easy' : progress < 0.7 ? 'medium' : 'hard'
    } else if (userLevel === 'advanced') {
      return progress < 0.2 ? 'medium' : progress < 0.6 ? 'hard' : 'expert'
    }
    
    return 'medium'
  }

  /**
   * Carga perfil del usuario
   */
  loadUserProfile() {
    try {
      const profile = localStorage.getItem('booleanAlgebraProfile')
      return profile ? JSON.parse(profile) : {
        level: 'medium',
        strengths: [],
        weaknesses: [],
        preferences: {}
      }
    } catch (error) {
      return {
        level: 'medium',
        strengths: [],
        weaknesses: [],
        preferences: {}
      }
    }
  }

  /**
   * Actualiza perfil del usuario
   */
  updateUserProfile(exerciseResult) {
    this.userProfile = this.loadUserProfile()
    
    // Actualizar nivel basado en rendimiento
    if (exerciseResult.score >= 80) {
      this.userProfile.strengths.push(exerciseResult.topic)
    } else if (exerciseResult.score < 60) {
      this.userProfile.weaknesses.push(exerciseResult.topic)
    }
    
    // Guardar perfil actualizado
    localStorage.setItem('booleanAlgebraProfile', JSON.stringify(this.userProfile))
  }

  /**
   * Obtiene estadísticas de ejercicios
   */
  getExerciseStats() {
    return {
      totalGenerated: this.exerciseCache.size,
      topics: this.getTopicDistribution(),
      difficulties: this.getDifficultyDistribution(),
      averageComplexity: this.getAverageComplexity()
    }
  }

  /**
   * Distribución de temas
   */
  getTopicDistribution() {
    const topics = {}
    for (const exercise of this.exerciseCache.values()) {
      topics[exercise.topic] = (topics[exercise.topic] || 0) + 1
    }
    return topics
  }

  /**
   * Distribución de dificultades
   */
  getDifficultyDistribution() {
    const difficulties = {}
    for (const exercise of this.exerciseCache.values()) {
      difficulties[exercise.difficulty] = (difficulties[exercise.difficulty] || 0) + 1
    }
    return difficulties
  }

  /**
   * Complejidad promedio
   */
  getAverageComplexity() {
    const exercises = Array.from(this.exerciseCache.values())
    if (exercises.length === 0) return 0
    
    const complexitySum = exercises.reduce((sum, exercise) => {
      return sum + (exercise.variables || 3)
    }, 0)
    
    return Math.round(complexitySum / exercises.length)
  }
}

// Exportar instancia singleton
export const booleanExerciseGenerator = new BooleanExerciseGenerator()
export default booleanExerciseGenerator
