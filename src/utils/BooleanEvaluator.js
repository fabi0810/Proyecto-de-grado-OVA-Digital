
class BooleanEvaluator {
  /**
   * Normaliza una expresión booleana a formato estándar
   */
  static normalizeExpression(expr) {
    let normalized = expr
      .replace(/\s+/g, '')
      .replace(/\*|×|&{2}|AND/gi, '·')
      .replace(/\||∨|OR/gi, '+')
      .replace(/!|¬|~|NOT\s*/gi, "'")
      .replace(/'/g, "'")
      .toUpperCase()
    
    return normalized
  }
    

  /**
   * ✅ CORREGIDO: Aplica De Morgan ANTES de evaluar
   * (A+B)' = A'·B'
   * (A·B)' = A' + B'
   */
  static applyDeMorganForEval(expr) {
    let result = expr
    let changed = true
    
    while (changed && result.match(/\([^()]+\)'/)) {
      const before = result
      
      result = result.replace(/\(([^()]+)\)'/g, (match, inner) => {
        // Verificar si contiene operadores
        if (inner.includes('+')) {
          // (A + B)' → A'·B'
          const terms = inner.split('+').map(t => t.trim())
          const negated = terms.map(term => {
            // Si ya tiene ', aplicar doble negación
            if (term.endsWith("'")) {
              return term.slice(0, -1)
            }
            return term + "'"
          })
          return '(' + negated.join('·') + ')'
        } else if (inner.includes('·')) {
          // (A·B)' → A' + B'
          const terms = inner.split('·').map(t => t.trim())
          const negated = terms.map(term => {
            if (term.endsWith("'")) {
              return term.slice(0, -1)
            }
            return term + "'"
          })
          return '(' + negated.join('+') + ')'
        } else {
          // Variable simple con negación
          if (inner.endsWith("'")) {
            return inner.slice(0, -1) // Doble negación
          }
          return inner + "'"
        }
      })
      
      changed = (before !== result)
    }
    
    return result
  }

  /**
   * ✅ CORREGIDO: Evalúa una expresión booleana con valores específicos
   */
  static evaluate(expression, values) {
    try {
      let expr = this.normalizeExpression(expression)
      
      // PASO 1: Aplicar De Morgan primero
      expr = this.applyDeMorganForEval(expr)
      
      // PASO 2: Reemplazar variables por sus valores
      Object.keys(values).forEach(variable => {
        const regex = new RegExp(variable, 'g')
        expr = expr.replace(regex, values[variable].toString())
      })
      
      // PASO 3: Procesar complementos simples
      expr = expr.replace(/0'/g, '1')
      expr = expr.replace(/1'/g, '0')
      
      // PASO 4: Evaluar la expresión resultante
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
   * ✅ MEJORADO: Verifica si dos expresiones son lógicamente equivalentes
   */
  static areEquivalent(expr1, expr2) {
    try {
      // Obtener todas las variables de ambas expresiones
      const vars1 = this.extractVariables(expr1)
      const vars2 = this.extractVariables(expr2)
      const allVars = [...new Set([...vars1, ...vars2])].sort()
      
      if (allVars.length === 0) {
        // Expresiones constantes
        const result1 = this.evaluate(expr1, {})
        const result2 = this.evaluate(expr2, {})
        return {
          equivalent: result1 === result2,
          counterExample: null
        }
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
      
      return { equivalent: true, counterExample: null }
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
   * Genera un mapa de Karnaugh correcto usando código Gray
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

export { BooleanEvaluator }
export default BooleanEvaluator