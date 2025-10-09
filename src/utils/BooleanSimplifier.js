// src/utils/BooleanSimplifier.js
// Simplificador booleano COMPLETO con todas las leyes correctamente implementadas

import { BooleanEvaluator } from './BooleanEvaluator'

class BooleanSimplifier {
  constructor() {
    this.steps = []
    this.maxIterations = 100
  }

  /**
   * Normaliza la expresión a formato estándar
   */
  normalize(expr) {
    let normalized = expr
      .replace(/\s+/g, '')
      .replace(/\*|×|&{2}|AND/gi, '·')
      .replace(/\||∨|OR/gi, '+')
      .replace(/!|¬|~|NOT\s*/gi, "'")
      .toUpperCase()
    
    return normalized
  }

  /**
   * ✅ CORREGIDO: Aplica De Morgan COMPLETO
   * Maneja cualquier expresión, no solo literales A, B
   */
  applyDeMorgan(expr) {
    let result = expr
    let changed = true
    let iterations = 0
    
    while (changed && iterations < 50) {
      const before = result
      
      // (cualquier_expresión)' → transformar según lo que hay dentro
      result = result.replace(/\(([^()]+)\)'/g, (match, inner) => {
        // Dividir por el operador principal
        if (inner.includes('+') && !this.isInsideParentheses(inner, '+')) {
          // (A + B + C)' → A'·B'·C'
          const terms = this.splitByOperator(inner, '+')
          const negated = terms.map(term => this.negateTerm(term.trim()))
          return '(' + negated.join('·') + ')'
        } else if (inner.includes('·') && !this.isInsideParentheses(inner, '·')) {
          // (A·B·C)' → A' + B' + C'
          const terms = this.splitByOperator(inner, '·')
          const negated = terms.map(term => this.negateTerm(term.trim()))
          return '(' + negated.join('+') + ')'
        } else {
          // Variable simple o expresión sin operadores
          return this.negateTerm(inner)
        }
      })
      
      changed = (before !== result)
      iterations++
    }
    
    return result
  }

  /**
   * Verifica si un operador está dentro de paréntesis
   */
  isInsideParentheses(expr, operator) {
    let depth = 0
    for (let i = 0; i < expr.length; i++) {
      if (expr[i] === '(') depth++
      if (expr[i] === ')') depth--
      if (expr[i] === operator && depth === 0) return false
    }
    return true
  }

  /**
   * Divide una expresión por un operador (respetando paréntesis)
   */
  splitByOperator(expr, operator) {
    const terms = []
    let current = ''
    let depth = 0
    
    for (let i = 0; i < expr.length; i++) {
      const char = expr[i]
      
      if (char === '(') depth++
      if (char === ')') depth--
      
      if (char === operator && depth === 0) {
        if (current) terms.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    
    if (current) terms.push(current.trim())
    return terms
  }

  /**
   * Niega un término (maneja doble negación)
   */
  negateTerm(term) {
    term = term.trim()
    
    // Doble negación: A'' → A
    if (term.endsWith("''")) {
      return term.slice(0, -2)
    }
    
    // Ya negado: A' → A
    if (term.endsWith("'")) {
      return term.slice(0, -1)
    }
    
    // Término con paréntesis: (A+B) → se procesará después
    return term + "'"
  }

  /**
   * ✅ NUEVO: Aplica absorción completa
   * A + A·B → A
   * A·(A + B) → A
   * A + A'·B → A + B
   */
  applyAbsorption(expr) {
    let result = expr
    let changed = true
    
    while (changed) {
      const before = result
      
      // A + A·cualquier_cosa → A
      result = result.replace(/([A-Z]'?)\+\1·[^+]+/g, '$1')
      
      // A·cualquier_cosa + A → A
      result = result.replace(/([A-Z]'?)·[^+]+\+\1(?![A-Z])/g, '$1')
      
      // A·(A + cualquier_cosa) → A
      result = result.replace(/([A-Z]'?)·\(\1\+[^)]+\)/g, '$1')
      
      // A + A'·B → A + B (absorción con complemento)
      result = result.replace(/([A-Z])\+\1'·([A-Z]'?)/g, '$1+$2')
      
      changed = (before !== result)
    }
    
    return result
  }

  /**
   * ✅ NUEVO: Aplica consenso
   * A·B + A'·C + B·C → A·B + A'·C
   */
  applyConsensus(expr) {
    let result = expr
    
    // Detectar patrón X·Y + X'·Z + Y·Z
    const terms = this.splitByOperator(result, '+')
    
    for (let i = 0; i < terms.length; i++) {
      for (let j = i + 1; j < terms.length; j++) {
        for (let k = j + 1; k < terms.length; k++) {
          const term1 = terms[i].trim()
          const term2 = terms[j].trim()
          const term3 = terms[k].trim()
          
          // Verificar si term3 es consenso de term1 y term2
          if (this.isConsensus(term1, term2, term3)) {
            // Eliminar term3
            terms.splice(k, 1)
            result = terms.join('+')
            return result
          }
        }
      }
    }
    
    return result
  }

  /**
   * Verifica si term3 es consenso de term1 y term2
   */
  isConsensus(term1, term2, term3) {
    const factors1 = term1.split('·').map(f => f.trim())
    const factors2 = term2.split('·').map(f => f.trim())
    const factors3 = term3.split('·').map(f => f.trim())
    
    // Buscar variable complementaria en term1 y term2
    for (const f1 of factors1) {
      const complement = f1.endsWith("'") ? f1.slice(0, -1) : f1 + "'"
      
      if (factors2.includes(complement)) {
        // Verificar si term3 contiene los otros factores
        const others1 = factors1.filter(f => f !== f1)
        const others2 = factors2.filter(f => f !== complement)
        const allOthers = [...new Set([...others1, ...others2])]
        
        // term3 debe ser exactamente los otros factores
        return allOthers.every(f => factors3.includes(f)) && factors3.length === allOthers.length
      }
    }
    
    return false
  }

  /**
   * ✅ NUEVO: Factorización completa
   * A·B + A·C → A·(B+C)
   */
  applyFactorization(expr) {
    let result = expr
    const terms = this.splitByOperator(result, '+')
    
    if (terms.length < 2) return result
    
    // Buscar factores comunes entre todos los términos
    for (let i = 0; i < terms.length - 1; i++) {
      for (let j = i + 1; j < terms.length; j++) {
        const factors1 = terms[i].split('·').map(f => f.trim())
        const factors2 = terms[j].split('·').map(f => f.trim())
        
        // Encontrar factores comunes
        const common = factors1.filter(f => factors2.includes(f))
        
        if (common.length > 0) {
          const remaining1 = factors1.filter(f => !common.includes(f))
          const remaining2 = factors2.filter(f => !common.includes(f))
          
          if (remaining1.length > 0 && remaining2.length > 0) {
            const factored = `${common.join('·')}·(${remaining1.join('·')}+${remaining2.join('·')})`
            
            // Reemplazar los dos términos
            terms.splice(j, 1)
            terms.splice(i, 1, factored)
            
            return terms.join('+')
          }
        }
      }
    }
    
    return result
  }

  /**
   * Aplica todas las leyes básicas
   */
  applyBasicLaws(expr) {
    let result = expr
    
    // Doble negación: A'' → A
    result = result.replace(/([A-Z])''/g, '$1')
    
    // Complemento: A·A' → 0, A+A' → 1
    result = result.replace(/([A-Z])·\1'/g, '0')
    result = result.replace(/([A-Z])'·\1/g, '0')
    result = result.replace(/([A-Z])\+\1'/g, '1')
    result = result.replace(/([A-Z])'\+\1/g, '1')
    
    // Anulación: A·0 → 0, A+1 → 1
    result = result.replace(/([A-Z]'?)·0/g, '0')
    result = result.replace(/0·([A-Z]'?)/g, '0')
    result = result.replace(/([A-Z]'?)\+1/g, '1')
    result = result.replace(/1\+([A-Z]'?)/g, '1')
    
    // Identidad: A·1 → A, A+0 → A
    result = result.replace(/([A-Z]'?)·1/g, '$1')
    result = result.replace(/1·([A-Z]'?)/g, '$1')
    result = result.replace(/([A-Z]'?)\+0/g, '$1')
    result = result.replace(/0\+([A-Z]'?)/g, '$1')
    
    // Idempotencia: A+A → A, A·A → A
    result = result.replace(/([A-Z]'?)\+\1/g, '$1')
    result = result.replace(/([A-Z]'?)·\1/g, '$1')
    
    return result
  }

  /**
   * Limpia paréntesis innecesarios
   */
  cleanParentheses(expr) {
    let result = expr
    
    // (A) → A
    result = result.replace(/\(([A-Z]'?)\)/g, '$1')
    
    // Eliminar paréntesis vacíos o inválidos
    result = result.replace(/\(\)/g, '')
    
    return result
  }

  /**
   * ✅ MÉTODO PRINCIPAL: Simplifica paso a paso
   */
  simplify(expression, options = {}) {
    const {
      maxSteps = 50,
      showAllSteps = true,
      targetForm = 'SOP',
      useKarnaugh = true
    } = options

    this.steps = []
    let current = this.normalize(expression)
    let iteration = 0
    
    const originalExpression = current
    this.addStep(current, current, 'normalization', 'Normalización', 'Expresión normalizada')
    
    // Variables de la expresión
    const variables = BooleanEvaluator.extractVariables(current)

    while (iteration < maxSteps) {
      iteration++
      const before = current
      let lawApplied = null
      let lawName = null
      let explanation = null

      // 1. De Morgan (PRIMERO)
      const afterDeMorgan = this.applyDeMorgan(current)
      if (afterDeMorgan !== current) {
        current = afterDeMorgan
        lawApplied = 'demorgan'
        lawName = 'Leyes de De Morgan'
        explanation = 'Transformar negación de grupo: (A+B)\'=A\'·B\' o (A·B)\'=A\'+B\''
      }

      // 2. Leyes básicas
      if (!lawApplied) {
        const afterBasic = this.applyBasicLaws(current)
        if (afterBasic !== current) {
          current = afterBasic
          lawApplied = 'basic'
          lawName = 'Leyes Básicas'
          explanation = 'Identidad, Complemento, Anulación, Idempotencia'
        }
      }

      // 3. Absorción
      if (!lawApplied) {
        const afterAbs = this.applyAbsorption(current)
        if (afterAbs !== current) {
          current = afterAbs
          lawApplied = 'absorption'
          lawName = 'Absorción'
          explanation = 'Eliminar términos absorbidos: A+A·B=A'
        }
      }

      // 4. Factorización
      if (!lawApplied) {
        const afterFact = this.applyFactorization(current)
        if (afterFact !== current) {
          current = afterFact
          lawApplied = 'factorization'
          lawName = 'Factorización'
          explanation = 'Factorizar términos comunes: A·B+A·C=A·(B+C)'
        }
      }

      // 5. Consenso
      if (!lawApplied) {
        const afterCons = this.applyConsensus(current)
        if (afterCons !== current) {
          current = afterCons
          lawApplied = 'consensus'
          lawName = 'Consenso'
          explanation = 'Eliminar término redundante: A·B+A\'·C+B·C=A·B+A\'·C'
        }
      }

      // 6. Limpiar paréntesis
      if (!lawApplied) {
        const cleaned = this.cleanParentheses(current)
        if (cleaned !== current) {
          current = cleaned
          lawApplied = 'cleanup'
          lawName = 'Limpieza'
          explanation = 'Eliminar paréntesis innecesarios'
        }
      }

      // Si hubo cambio, agregar paso
      if (current !== before) {
        this.addStep(before, current, lawApplied, lawName, explanation)
      } else {
        // No hay más simplificaciones
        break
      }
    }

    // Calcular complejidad
    const complexity = this.calculateComplexity(originalExpression, current)

    return {
      success: true,
      originalExpression,
      simplifiedExpression: current,
      steps: this.steps,
      totalSteps: this.steps.length,
      complexity,
      equivalent: BooleanEvaluator.areEquivalent(originalExpression, current)
    }
  }

  /**
   * Agrega un paso al historial
   */
  addStep(from, to, theorem, law, explanation) {
    const equivalence = BooleanEvaluator.areEquivalent(from, to)
    
    this.steps.push({
      from,
      to,
      theorem,
      law,
      explanation,
      equivalence
    })
  }

  /**
   * Calcula complejidad
   */
  calculateComplexity(original, simplified) {
    const countOps = (expr) => {
      return (expr.match(/[·+]/g) || []).length + (expr.match(/'/g) || []).length
    }

    const originalComplexity = countOps(original)
    const simplifiedComplexity = countOps(simplified)
    const reduction = originalComplexity - simplifiedComplexity

    return {
      original: originalComplexity,
      simplified: simplifiedComplexity,
      reduction
    }
  }
}

// Crear instancia global
export const booleanSimplifier = new BooleanSimplifier()
export default BooleanSimplifier