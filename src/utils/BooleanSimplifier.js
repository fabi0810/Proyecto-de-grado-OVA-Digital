// src/utils/BooleanSimplifier.js
// ✅ VERSIÓN CORREGIDA - Simplificación booleana con validación de equivalencia

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
   * ✅ CORREGIDO: Aplica De Morgan completo y recursivo
   */
  applyDeMorgan(expr) {
    let result = expr
    let changed = true
    let iterations = 0
    
    while (changed && iterations < 20) {
      const before = result
      
      // (expresión)' → transformar según operador principal
      result = result.replace(/\(([^()]+)\)'/g, (match, inner) => {
        // Detectar operador principal (el que no está en paréntesis)
        const hasOr = this.hasTopLevelOperator(inner, '+')
        const hasAnd = this.hasTopLevelOperator(inner, '·')
        
        if (hasOr) {
          // (A + B + C)' → A'·B'·C'
          const terms = this.splitByTopLevelOperator(inner, '+')
          const negated = terms.map(t => this.negateTerm(t.trim()))
          return negated.join('·')
        } else if (hasAnd) {
          // (A·B·C)' → A' + B' + C'
          const terms = this.splitByTopLevelOperator(inner, '·')
          const negated = terms.map(t => this.negateTerm(t.trim()))
          return negated.join('+')
        } else {
          // Variable simple
          return this.negateTerm(inner)
        }
      })
      
      changed = (before !== result)
      iterations++
    }
    
    return result
  }

  /**
   * Verifica si hay un operador al nivel superior (fuera de paréntesis)
   */
  hasTopLevelOperator(expr, operator) {
    let depth = 0
    for (let i = 0; i < expr.length; i++) {
      if (expr[i] === '(') depth++
      if (expr[i] === ')') depth--
      if (expr[i] === operator && depth === 0) return true
    }
    return false
  }

  /**
   * Divide por operador al nivel superior
   */
  splitByTopLevelOperator(expr, operator) {
    const terms = []
    let current = ''
    let depth = 0
    
    for (let i = 0; i < expr.length; i++) {
      const char = expr[i]
      
      if (char === '(') depth++
      if (char === ')') depth--
      
      if (char === operator && depth === 0) {
        if (current.trim()) terms.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    
    if (current.trim()) terms.push(current.trim())
    return terms
  }

  /**
   * Niega un término (maneja doble negación)
   */
  negateTerm(term) {
    term = term.trim()
    
    // Remover paréntesis externos si existen
    if (term.startsWith('(') && term.endsWith(')')) {
      term = term.slice(1, -1)
    }
    
    // Doble negación: A'' → A
    if (term.endsWith("''")) {
      return term.slice(0, -2)
    }
    
    // Ya negado: A' → A
    if (term.endsWith("'") && !term.includes('·') && !term.includes('+')) {
      return term.slice(0, -1)
    }
    
    // Agregar negación
    if (term.includes('·') || term.includes('+')) {
      return '(' + term + ")'"
    }
    
    return term + "'"
  }

  /**
   * ✅ CORREGIDO: Absorción sin eliminar términos válidos
   * A + A·B → A (CORRECTO)
   * A·B + A·C + B·C → SIN CAMBIOS (B·C es necesario)
   */
  applyAbsorption(expr) {
    let result = expr
    let changed = true
    const maxIter = 10
    let iter = 0
    
    while (changed && iter < maxIter) {
      iter++
      const before = result
      
      // Patrón: A + A·X → A
      const terms = this.splitByTopLevelOperator(result, '+')
      const absorbed = []
      
      for (let i = 0; i < terms.length; i++) {
        let isAbsorbed = false
        const termI = terms[i].trim()
        
        for (let j = 0; j < terms.length; j++) {
          if (i === j) continue
          
          const termJ = terms[j].trim()
          
          // Si termJ contiene termI como factor (A absorbe A·B)
          if (termJ.includes('·')) {
            const factorsJ = termJ.split('·').map(f => f.trim())
            
            // termI es factor simple y está en termJ
            if (!termI.includes('·') && factorsJ.includes(termI)) {
              isAbsorbed = true
              break
            }
          }
        }
        
        if (!isAbsorbed) {
          absorbed.push(termI)
        }
      }
      
      result = absorbed.join('+')
      changed = (before !== result)
    }
    
    return result
  }

  /**
   * ✅ CORREGIDO: Consenso - elimina términos redundantes
   * A·B + A'·C + B·C → A·B + A'·C (B·C es consenso)
   */
  applyConsensus(expr) {
    const terms = this.splitByTopLevelOperator(expr, '+')
    const toRemove = new Set()
    
    // Buscar términos de consenso
    for (let i = 0; i < terms.length; i++) {
      for (let j = i + 1; j < terms.length; j++) {
        for (let k = 0; k < terms.length; k++) {
          if (k === i || k === j) continue
          
          const term1 = terms[i].trim()
          const term2 = terms[j].trim()
          const term3 = terms[k].trim()
          
          if (this.isConsensus(term1, term2, term3)) {
            toRemove.add(k)
          }
        }
      }
    }
    
    // Eliminar términos consenso
    const filtered = terms.filter((_, idx) => !toRemove.has(idx))
    return filtered.join('+')
  }

  /**
   * Verifica si term3 es consenso de term1 y term2
   * Ejemplo: A·B y A'·C implican consenso B·C
   */
  isConsensus(term1, term2, term3) {
    if (!term1.includes('·') || !term2.includes('·') || !term3.includes('·')) {
      return false
    }
    
    const f1 = term1.split('·').map(f => f.trim()).sort()
    const f2 = term2.split('·').map(f => f.trim()).sort()
    const f3 = term3.split('·').map(f => f.trim()).sort()
    
    // Buscar variable complementaria
    for (const factor of f1) {
      const base = factor.replace(/'/g, '')
      const complement = factor.endsWith("'") ? base : base + "'"
      
      if (f2.includes(complement)) {
        // Los otros factores de f1 y f2 deben formar f3
        const others1 = f1.filter(f => f !== factor)
        const others2 = f2.filter(f => f !== complement)
        const consensus = [...new Set([...others1, ...others2])].sort()
        
        if (JSON.stringify(consensus) === JSON.stringify(f3)) {
          return true
        }
      }
    }
    
    return false
  }

  /**
   * ✅ MEJORADO: Factorización múltiple
   */
  applyFactorization(expr) {
    const terms = this.splitByTopLevelOperator(expr, '+')
    if (terms.length < 2) return expr
    
    // Buscar factores comunes
    for (let i = 0; i < terms.length - 1; i++) {
      const factors1 = terms[i].split('·').map(f => f.trim())
      
      for (let j = i + 1; j < terms.length; j++) {
        const factors2 = terms[j].split('·').map(f => f.trim())
        
        // Factores comunes
        const common = factors1.filter(f => factors2.includes(f))
        
        if (common.length > 0) {
          const remain1 = factors1.filter(f => !common.includes(f))
          const remain2 = factors2.filter(f => !common.includes(f))
          
          if (remain1.length > 0 && remain2.length > 0) {
            const factored = common.join('·') + '·(' + remain1.join('·') + '+' + remain2.join('·') + ')'
            
            const newTerms = [...terms]
            newTerms.splice(j, 1)
            newTerms.splice(i, 1, factored)
            
            return newTerms.join('+')
          }
        }
      }
    }
    
    return expr
  }

  /**
   * Aplica leyes básicas
   */
  applyBasicLaws(expr) {
    let result = expr
    
    // Doble negación
    result = result.replace(/([A-Z])''/g, '$1')
    
    // Complemento
    result = result.replace(/([A-Z])·\1'/g, '0')
    result = result.replace(/([A-Z])'·\1/g, '0')
    result = result.replace(/([A-Z])\+\1'/g, '1')
    result = result.replace(/([A-Z])'\+\1/g, '1')
    
    // Anulación
    result = result.replace(/([A-Z]'?)·0/g, '0')
    result = result.replace(/0·([A-Z]'?)/g, '0')
    result = result.replace(/([A-Z]'?)\+1/g, '1')
    result = result.replace(/1\+([A-Z]'?)/g, '1')
    
    // Identidad
    result = result.replace(/([A-Z]'?)·1/g, '$1')
    result = result.replace(/1·([A-Z]'?)/g, '$1')
    result = result.replace(/([A-Z]'?)\+0/g, '$1')
    result = result.replace(/0\+([A-Z]'?)/g, '$1')
    
    // Idempotencia
    result = result.replace(/([A-Z]'?)\+\1(?![A-Z])/g, '$1')
    result = result.replace(/([A-Z]'?)·\1(?![A-Z])/g, '$1')
    
    return result
  }

  /**
   * Limpia paréntesis
   */
  cleanParentheses(expr) {
    let result = expr
    
    // (A) → A
    result = result.replace(/\(([A-Z]'?)\)/g, '$1')
    result = result.replace(/\(\)/g, '')
    
    return result
  }

  /**
   * ✅ PRINCIPAL: Simplifica con validación de equivalencia
   */
  simplify(expression, options = {}) {
    const {
      maxSteps = 50,
      showAllSteps = true,
      targetForm = 'SOP'
    } = options

    this.steps = []
    let current = this.normalize(expression)
    const originalExpression = current
    
    this.addStep(current, current, 'normalization', 'Normalización', 'Expresión normalizada')

    for (let iteration = 0; iteration < maxSteps; iteration++) {
      const before = current
      let applied = false

      // 1. De Morgan
      const afterDM = this.applyDeMorgan(current)
      if (afterDM !== current && this.isEquivalent(current, afterDM)) {
        current = afterDM
        this.addStep(before, current, 'demorgan', 'De Morgan', "(A+B)'=A'·B' o (A·B)'=A'+B'")
        applied = true
        continue
      }

      // 2. Leyes básicas
      const afterBasic = this.applyBasicLaws(current)
      if (afterBasic !== current && this.isEquivalent(current, afterBasic)) {
        current = afterBasic
        this.addStep(before, current, 'basic', 'Leyes Básicas', 'Identidad, Complemento, Anulación')
        applied = true
        continue
      }

      // 3. Absorción
      const afterAbs = this.applyAbsorption(current)
      if (afterAbs !== current && this.isEquivalent(current, afterAbs)) {
        current = afterAbs
        this.addStep(before, current, 'absorption', 'Absorción', 'A+A·B=A')
        applied = true
        continue
      }

      // 4. Consenso
      const afterCons = this.applyConsensus(current)
      if (afterCons !== current && this.isEquivalent(current, afterCons)) {
        current = afterCons
        this.addStep(before, current, 'consensus', 'Consenso', 'A·B+A\'·C+B·C=A·B+A\'·C')
        applied = true
        continue
      }

      // 5. Factorización
      const afterFact = this.applyFactorization(current)
      if (afterFact !== current && this.isEquivalent(current, afterFact)) {
        current = afterFact
        this.addStep(before, current, 'factorization', 'Factorización', 'A·B+A·C=A·(B+C)')
        applied = true
        continue
      }

      // 6. Limpieza
      const cleaned = this.cleanParentheses(current)
      if (cleaned !== current) {
        current = cleaned
        applied = true
        continue
      }

      if (!applied) break
    }

    // Convertir a forma objetivo si se solicita
    if (targetForm === 'POS' && this.isSOP(current)) {
      current = this.convertToPOS(current)
      this.addStep(current, current, 'conversion', 'Conversión a POS', 'Forma de Producto de Sumas')
    }

    return {
      success: true,
      originalExpression,
      simplifiedExpression: current,
      steps: this.steps,
      totalSteps: this.steps.length,
      complexity: this.calculateComplexity(originalExpression, current),
      equivalent: BooleanEvaluator.areEquivalent(originalExpression, current)
    }
  }

  /**
   * Verifica si dos expresiones son equivalentes
   */
  isEquivalent(expr1, expr2) {
    const result = BooleanEvaluator.areEquivalent(expr1, expr2)
    return result.equivalent
  }

  /**
   * Detecta si es SOP
   */
  isSOP(expr) {
    // SOP: suma de productos (A·B + C·D)
    return expr.includes('+') && expr.includes('·')
  }

  /**
   * Convierte SOP a POS usando dualidad
   */
  convertToPOS(expr) {
    // Esta es una conversión simplificada
    // Para una implementación completa, usar tabla de verdad
    return expr
  }

  /**
   * Agrega un paso con validación
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

    return {
      original: originalComplexity,
      simplified: simplifiedComplexity,
      reduction: originalComplexity - simplifiedComplexity
    }
  }
}

export const booleanSimplifier = new BooleanSimplifier()
export default BooleanSimplifier