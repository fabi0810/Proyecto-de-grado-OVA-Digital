// src/utils/BooleanEvaluator.js
// Evaluador robusto de expresiones booleanas con verificación de equivalencia

class BooleanEvaluator {
  /**
   * Normaliza una expresión booleana a formato estándar
   */
  static normalizeExpression(expr) {
    let normalized = expr
      .replace(/\s+/g, '') // Eliminar espacios
      .replace(/\*|×|&{2}|AND/gi, '·') // Normalizar AND
      .replace(/\||∨|\+|OR/gi, '+') // Normalizar OR
      .replace(/!|¬|~|NOT\s*/gi, "'") // Normalizar NOT
      .replace(/'/g, "'") // Normalizar apóstrofe
      .toUpperCase() // Mayúsculas para variables
    
    return normalized
  }

  /**
   * Evalúa una expresión booleana con valores específicos
   * @param {string} expression - Expresión booleana (ej: "A·B + C'")
   * @param {Object} values - Valores de variables (ej: {A: 1, B: 0, C: 1})
   * @returns {number} - Resultado (0 o 1)
   */
  static evaluate(expression, values) {
    try {
      let expr = this.normalizeExpression(expression)
      
      // Reemplazar variables por sus valores
      Object.keys(values).forEach(variable => {
        const regex = new RegExp(variable, 'g')
        expr = expr.replace(regex, values[variable].toString())
      })
      
      // Procesar complementos (NOT)
      // Manejar complementos sobre paréntesis primero: (...)' 
      while (expr.match(/\([^()]+\)'/)) {
        expr = expr.replace(/\(([^()]+)\)'/g, (match, inner) => {
          const innerResult = this.evaluateSimple(inner)
          return innerResult === 1 ? '0' : '1'
        })
      }
      
      // Manejar complementos simples: 0' o 1'
      expr = expr.replace(/0'/g, '1')
      expr = expr.replace(/1'/g, '0')
      
      // Evaluar la expresión resultante
      return this.evaluateSimple(expr)
    } catch (error) {
      console.error('Error evaluando expresión:', error)
      return 0
    }
  }

  /**
   * Evalúa una expresión simple sin complementos
   */
  static evaluateSimple(expr) {
    // Eliminar espacios
    expr = expr.replace(/\s+/g, '')
    
    // Evaluar paréntesis más internos primero
    while (expr.includes('(')) {
      expr = expr.replace(/\(([^()]+)\)/g, (match, inner) => {
        return this.evaluateSimple(inner).toString()
      })
    }
    
    // Evaluar AND (·) primero (mayor precedencia)
    while (expr.includes('·')) {
      expr = expr.replace(/([01])·([01])/g, (match, a, b) => {
        return (parseInt(a) && parseInt(b)) ? '1' : '0'
      })
    }
    
    // Evaluar OR (+)
    while (expr.includes('+')) {
      expr = expr.replace(/([01])\+([01])/g, (match, a, b) => {
        return (parseInt(a) || parseInt(b)) ? '1' : '0'
      })
    }
    
    return parseInt(expr)
  }

  /**
   * Extrae todas las variables únicas de una expresión
   */
  static extractVariables(expression) {
    const normalized = this.normalizeExpression(expression)
    const matches = normalized.match(/[A-Z]/g) || []
    return [...new Set(matches)].sort()
  }

  /**
   * Genera todas las combinaciones posibles de valores para las variables
   */
  static generateTruthTable(expression) {
    const variables = this.extractVariables(expression)
    const numCombinations = Math.pow(2, variables.length)
    const table = []
    
    for (let i = 0; i < numCombinations; i++) {
      const values = {}
      variables.forEach((variable, index) => {
        values[variable] = (i >> (variables.length - 1 - index)) & 1
      })
      
      const result = this.evaluate(expression, values)
      table.push({ ...values, result, index: i })
    }
    
    return { variables, table }
  }

  /**
   * Verifica si dos expresiones son lógicamente equivalentes
   */
  static areEquivalent(expr1, expr2) {
    try {
      // Obtener todas las variables de ambas expresiones
      const vars1 = this.extractVariables(expr1)
      const vars2 = this.extractVariables(expr2)
      const allVars = [...new Set([...vars1, ...vars2])].sort()
      
      if (allVars.length === 0) {
        // Expresiones constantes
        return this.evaluate(expr1, {}) === this.evaluate(expr2, {})
      }
      
      // Generar todas las combinaciones
      const numCombinations = Math.pow(2, allVars.length)
      
      for (let i = 0; i < numCombinations; i++) {
        const values = {}
        allVars.forEach((variable, index) => {
          values[variable] = (i >> (allVars.length - 1 - index)) & 1
        })
        
        const result1 = this.evaluate(expr1, values)
        const result2 = this.evaluate(expr2, values)
        
        if (result1 !== result2) {
          return {
            equivalent: false,
            counterExample: values
          }
        }
      }
      
      return { equivalent: true }
    } catch (error) {
      console.error('Error comparando expresiones:', error)
      return { equivalent: false, error: error.message }
    }
  }

  /**
   * Verifica si una simplificación es correcta
   */
  static validateSimplification(original, simplified) {
    const comparison = this.areEquivalent(original, simplified)
    
    if (!comparison.equivalent) {
      return {
        correct: false,
        message: 'Las expresiones no son equivalentes',
        counterExample: comparison.counterExample,
        details: {
          original: original,
          simplified: simplified,
          variables: this.extractVariables(original)
        }
      }
    }
    
    return {
      correct: true,
      message: 'Simplificación correcta - Las expresiones son equivalentes',
      details: {
        original: original,
        simplified: simplified,
        variables: this.extractVariables(original)
      }
    }
  }

  /**
   * Aplica las 12 leyes del álgebra booleana según la imagen
   */
  static applyBooleanLaws(expression) {
    let expr = this.normalizeExpression(expression)
    let changed = true
    let iterations = 0
    const maxIterations = 50
    
    while (changed && iterations < maxIterations) {
      const before = expr
      
      // Ley 1: A + 0 = A (Identidad OR)
      expr = expr.replace(/([A-Z])\+0/g, '$1')
      expr = expr.replace(/0\+([A-Z])/g, '$1')
      
      // Ley 2: A + 1 = 1 (Anulación OR)
      expr = expr.replace(/([A-Z])\+1/g, '1')
      expr = expr.replace(/1\+([A-Z])/g, '1')
      
      // Ley 3: A · 0 = 0 (Anulación AND)
      expr = expr.replace(/([A-Z])·0/g, '0')
      expr = expr.replace(/0·([A-Z])/g, '0')
      
      // Ley 4: A · 1 = A (Identidad AND)
      expr = expr.replace(/([A-Z])·1/g, '$1')
      expr = expr.replace(/1·([A-Z])/g, '$1')
      
      // Ley 5: A + A = A (Idempotencia OR)
      expr = expr.replace(/([A-Z])\+\1/g, '$1')
      
      // Ley 6: A · A = A (Idempotencia AND)
      expr = expr.replace(/([A-Z])·\1/g, '$1')
      
      // Ley 7: (A')' = A (Doble negación)
      expr = expr.replace(/\(([A-Z])'\)'/g, '$1')
      expr = expr.replace(/([A-Z])''/g, '$1')
      
      // Ley 8: A + A' = 1 (Complemento OR)
      expr = expr.replace(/([A-Z])\+\1'/g, '1')
      expr = expr.replace(/([A-Z])'\+\1/g, '1')
      
      // Ley 9: A · A' = 0 (Complemento AND)
      expr = expr.replace(/([A-Z])·\1'/g, '0')
      expr = expr.replace(/([A-Z])'·\1/g, '0')
      
      // Absorción: A + A·B = A
      expr = expr.replace(/([A-Z])\+\1·([A-Z])/g, '$1')
      expr = expr.replace(/([A-Z])·([A-Z])\+\1/g, '$1')
      
      // Absorción: A·(A + B) = A
      expr = expr.replace(/([A-Z])·\(\1\+([A-Z])\)/g, '$1')
      
      changed = (before !== expr)
      iterations++
    }
    
    return expr
  }

  /**
   * Genera un mapa de Karnaugh correcto
   */
  static generateKarnaughMap(expression, variables) {
    if (variables.length === 2) {
      const [A, B] = variables
      return {
        type: '2var',
        cells: [
          [
            this.evaluate(expression, { [A]: 0, [B]: 0 }),
            this.evaluate(expression, { [A]: 0, [B]: 1 })
          ],
          [
            this.evaluate(expression, { [A]: 1, [B]: 0 }),
            this.evaluate(expression, { [A]: 1, [B]: 1 })
          ]
        ],
        rows: ['0', '1'],
        cols: ['0', '1'],
        rowVar: A,
        colVar: B
      }
    } else if (variables.length === 3) {
      const [A, B, C] = variables
      // Código Gray: 00, 01, 11, 10
      return {
        type: '3var',
        cells: [
          [
            this.evaluate(expression, { [A]: 0, [B]: 0, [C]: 0 }),
            this.evaluate(expression, { [A]: 0, [B]: 0, [C]: 1 }),
            this.evaluate(expression, { [A]: 0, [B]: 1, [C]: 1 }),
            this.evaluate(expression, { [A]: 0, [B]: 1, [C]: 0 })
          ],
          [
            this.evaluate(expression, { [A]: 1, [B]: 0, [C]: 0 }),
            this.evaluate(expression, { [A]: 1, [B]: 0, [C]: 1 }),
            this.evaluate(expression, { [A]: 1, [B]: 1, [C]: 1 }),
            this.evaluate(expression, { [A]: 1, [B]: 1, [C]: 0 })
          ]
        ],
        rows: ['0', '1'],
        cols: ['00', '01', '11', '10'],
        rowVar: A,
        colVars: [B, C]
      }
    }
    
    return { type: 'unsupported', cells: [] }
  }
}

// Exportar también como named export para compatibilidad
export { BooleanEvaluator }
export default BooleanEvaluator