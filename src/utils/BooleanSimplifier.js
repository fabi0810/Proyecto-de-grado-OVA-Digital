// src/utils/BooleanSimplifier.js

import { BooleanEvaluator } from './BooleanEvaluator'
import QuineMcCluskeyMinimizer from './QuineMcCluskey'

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
// Agregar después del método normalize() y antes de applyDeMorgan()

/**
 * ✅ NUEVO: Simplificación exacta usando Quine-McCluskey
 * Garantiza el mínimo lógico mediante tabla de verdad
 */
// REEMPLAZAR completamente el método simplifyByTruthTable:

/**
 * ✅ CORREGIDO: Simplificación exacta usando Quine-McCluskey
 * Garantiza el mínimo lógico mediante tabla de verdad
 */
simplifyByTruthTable(expression, variables, targetForm = 'SOP') {
  try {
    // 1. Generar tabla de verdad completa
    const truthTableData = BooleanEvaluator.generateTruthTable(expression)
    const { table } = truthTableData
    
    // 2. Extraer mintérminos (índices donde result = 1)
    const minterms = table
      .filter(row => row.result === true || row.result === 1)
      .map(row => row.index)
    
    // 3. Extraer maxtérminos (índices donde result = 0) 
    const maxterms = table
      .filter(row => row.result === false || row.result === 0)
      .map(row => row.index)
    
    console.log('📊 Tabla de verdad:', { minterms, maxterms, totalRows: table.length })
    
    // Si no hay mintérminos, la expresión es siempre 0
    if (minterms.length === 0) {
      return { expression: '0', form: targetForm, minterms, maxterms }
    }
    
    // Si todos son mintérminos, la expresión es siempre 1
    if (minterms.length === Math.pow(2, variables.length)) {
      return { expression: '1', form: targetForm, minterms, maxterms }
    }
    
    // 4. Aplicar Quine-McCluskey según la forma objetivo
    const qm = new QuineMcCluskeyMinimizer()
    let simplified
    
    if (targetForm === 'SOP') {
      // Minimizar mintérminos para SOP
      const primeImplicants = qm.minimize(minterms, [], variables.length)
      console.log('✅ Implicantes primos (SOP):', primeImplicants)
      simplified = this.convertImplicantsToExpression(primeImplicants, variables, 'SOP')
    } else {
      // Minimizar maxtérminos para POS
      const primeImplicants = qm.minimize(maxterms, [], variables.length)
      console.log('✅ Implicantes primos (POS):', primeImplicants)
      simplified = this.convertImplicantsToExpression(primeImplicants, variables, 'POS')
    }
    
    console.log('🎯 Expresión simplificada:', simplified)
    const isValid = BooleanEvaluator.areEquivalent(expression, simplified)
if (!isValid.equivalent) {
  console.warn('⚠️ La simplificación no es equivalente, usando algebraico como respaldo')
  console.warn('  Contraejemplo:', isValid.counterExample)
  return null // Esto forzará el uso del método algebraico
}

console.log('🎯 Expresión simplificada (validada):', simplified)
    return {
      expression: simplified,
      form: targetForm,
      minterms: minterms,
      maxterms: maxterms
    }
    
  } catch (error) {
    console.error('❌ Error en simplificación por tabla de verdad:', error)
    return null
  }
}

/**
 * ✅ NUEVO: Convierte implicantes primos a expresión legible
 */
// REEMPLAZAR completamente el método convertImplicantsToExpression:


/**
 * ✅ CORREGIDO: Convierte implicantes primos a expresión legible
 */
convertImplicantsToExpression(implicants, variables, form = 'SOP') {
  if (!implicants || implicants.length === 0) {
    return form === 'SOP' ? '0' : '1'
  }
  
  console.log('🔄 Convirtiendo implicantes:', { 
    implicants, 
    variables, 
    form,
    numVars: variables.length 
  })
  
  const terms = implicants.map((imp, idx) => {
    console.log(`  Implicante ${idx}: "${imp}"`)
    const literals = []
    
    // imp es un string binario con '-' para variables eliminadas
    // Ejemplo: "1-0" significa: var[0]=1, var[1]=eliminada, var[2]=0
    for (let i = 0; i < imp.length; i++) {
      if (imp[i] === '1') {
        // Para SOP: 1 = variable sin negar
        // Para POS: 1 = variable negada en la suma
        if (form === 'SOP') {
          literals.push(variables[i])
        } else {
          literals.push(variables[i] + "'")
        }
      } else if (imp[i] === '0') {
        // Para SOP: 0 = variable negada
        // Para POS: 0 = variable sin negar en la suma
        if (form === 'SOP') {
          literals.push(variables[i] + "'")
        } else {
          literals.push(variables[i])
        }
      }
      // Si es '-', la variable no aparece (fue eliminada por simplificación)
    }
    
    console.log(`    Literales: [${literals.join(', ')}]`)
    
    // Si no hay literales, es un término constante
    if (literals.length === 0) {
      return '1'
    }
    
    if (form === 'SOP') {
      // SOP: producto de literales (A·B·C')
      return literals.join('·')
    } else {
      // POS: suma de literales entre paréntesis (A+B+C')
      return '(' + literals.join('+') + ')'
    }
  })
  
  console.log('  Términos finales:', terms)
  
  if (form === 'SOP') {
    // SOP: suma de productos (A·B + C·D')
    return terms.join(' + ')
  } else {
    // POS: producto de sumas ((A+B)·(C+D'))
    return terms.join('·')
  }
}
  /**
   *  Aplica De Morgan completo y recursivo
   */
  applyDeMorgan(expr) {
    let result = expr
    let changed = true
    let iterations = 0
    
    while (changed && iterations < 20) {
      const before = result
      
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
  applyAbsorptionEnhanced(expr) {
    const terms = this.splitByTopLevelOperator(expr, '+')
    if (terms.length < 2) return expr
  
    const toKeep = []
    const absorbed = new Set()
  
    // Ordenar por longitud (más cortos primero)
    const sorted = terms.map((t, idx) => ({ term: t.trim(), idx }))
      .sort((a, b) => {
        const aFactors = a.term.split('·').length
        const bFactors = b.term.split('·').length
        return aFactors - bFactors
      })
  
    for (let i = 0; i < sorted.length; i++) {
      if (absorbed.has(i)) continue
      
      const termI = sorted[i].term
      const factorsI = termI.split('·').map(f => f.trim())
      let absorbedAny = false
  
      for (let j = i + 1; j < sorted.length; j++) {
        if (absorbed.has(j)) continue
        
        const termJ = sorted[j].term
        const factorsJ = termJ.split('·').map(f => f.trim())
  
        // Si todos los factores de I están en J, J es absorbido por I
        if (factorsI.every(f => factorsJ.includes(f))) {
          absorbed.add(j)
          absorbedAny = true
        }
      }
  
      if (!absorbed.has(i)) {
        toKeep.push(termI)
      }
    }
  
    return toKeep.length > 0 ? toKeep.join('+') : expr
  }
  
  /**
   * ✅ NUEVO: Ley distributiva
   * A·(B+C) → A·B + A·C
   * (A+B)·C → A·C + B·C
   */
  applyDistributive(expr) {
    let result = expr
  
    // Patrón: Factor·(Suma)
    result = result.replace(/([A-Z]'?)·\(([^)]+)\)/g, (match, factor, sum) => {
      if (sum.includes('+')) {
        const terms = sum.split('+').map(t => t.trim())
        return terms.map(t => `${factor}·${t}`).join('+')
      }
      return match
    })
  
    // Patrón: (Suma)·Factor
    result = result.replace(/\(([^)]+)\)·([A-Z]'?)/g, (match, sum, factor) => {
      if (sum.includes('+')) {
        const terms = sum.split('+').map(t => t.trim())
        return terms.map(t => `${t}·${factor}`).join('+')
      }
      return match
    })
  
    return result
  }
  applyFactorizationEnhanced(expr) {
    const terms = this.splitByTopLevelOperator(expr, '+')
    if (terms.length < 2) return expr
  
    // Buscar el máximo conjunto de factores comunes
    for (let numCommon = 10; numCommon >= 1; numCommon--) {
      const groups = new Map() // factores comunes -> términos
  
      for (let i = 0; i < terms.length; i++) {
        const factors = terms[i].split('·').map(f => f.trim()).sort()
        
        // Generar todas las combinaciones de numCommon factores
        if (factors.length >= numCommon) {
          const combinations = this.getCombinations(factors, numCommon)
          
          for (const combo of combinations) {
            const key = combo.join('·')
            if (!groups.has(key)) groups.set(key, [])
            groups.get(key).push({ term: terms[i], factors })
          }
        }
      }
  
      // Buscar grupos con al menos 2 términos
      for (const [common, group] of groups.entries()) {
        if (group.length >= 2) {
          const commonFactors = common.split('·')
          const remainders = group.map(({ term, factors }) => {
            const remaining = factors.filter(f => !commonFactors.includes(f))
            return remaining.length > 0 ? remaining.join('·') : '1'
          })
  
          const factored = `${common}·(${remainders.join('+')})`
          
          // Reemplazar términos originales con la versión factorizada
          const newTerms = terms.filter(t => !group.some(g => g.term === t))
          newTerms.push(factored)
          
          return newTerms.join('+')
        }
      }
    }
  
    return expr
  }
  
  /**
   * Genera combinaciones de k elementos
   */
  getCombinations(arr, k) {
    if (k === 1) return arr.map(el => [el])
    if (k === arr.length) return [arr]
    
    const combinations = []
    
    for (let i = 0; i <= arr.length - k; i++) {
      const head = arr[i]
      const tailCombs = this.getCombinations(arr.slice(i + 1), k - 1)
      tailCombs.forEach(tail => combinations.push([head, ...tail]))
    }
    
    return combinations
  }
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
 * ✅ MEJORADO: Consenso - elimina términos redundantes correctamente
 * A·B + A'·C + B·C → A·B + A'·C (B·C es consenso)
 */
applyConsensus(expr) {
  const terms = this.splitByTopLevelOperator(expr, '+').map(t => t.trim())
  const toRemove = new Set()
  
  console.log('🔍 Aplicando consenso a:', expr)
  console.log('  Términos:', terms)
  
  // Buscar términos de consenso
  for (let i = 0; i < terms.length; i++) {
    for (let j = i + 1; j < terms.length; j++) {
      for (let k = 0; k < terms.length; k++) {
        if (k === i || k === j) continue
        
        const term1 = terms[i]
        const term2 = terms[j]
        const term3 = terms[k]
        
        if (this.isConsensus(term1, term2, term3)) {
          console.log(`  ✅ Consenso encontrado: "${term1}" + "${term2}" implica "${term3}" (redundante)`)
          toRemove.add(k)
        }
      }
    }
  }
  
  // Eliminar términos consenso
  const filtered = terms.filter((_, idx) => !toRemove.has(idx))
  const result = filtered.join('+')
  
  console.log(`  Resultado: ${result}`)
  return result
}

  /**
   * Verifica si term3 es consenso de term1 y term2
   * Ejemplo: A·B y A'·C implican consenso B·C
   */
  /**
 * ✅ CORREGIDO: Verifica si term3 es consenso de term1 y term2
 * Ejemplo: A·B + A'·C implican consenso B·C
 * 
 * Teorema: Si tenemos X·Y + X'·Z, entonces Y·Z es redundante (consenso)
 */
isConsensus(term1, term2, term3) {
  // Todos deben ser productos (contener ·)
  if (!term1.includes('·') && !term2.includes('·') && !term3.includes('·')) {
    return false
  }
  
  const f1 = term1.split('·').map(f => f.trim())
  const f2 = term2.split('·').map(f => f.trim())
  const f3 = term3.split('·').map(f => f.trim())
  
  console.log(`    Verificando consenso: [${f1}] + [${f2}] → [${f3}]?`)
  
  // Buscar variable complementaria entre term1 y term2
  for (const factor1 of f1) {
    const base = factor1.replace(/'/g, '')
    const complement = factor1.endsWith("'") ? base : base + "'"
    
    if (f2.includes(complement)) {
      // Encontramos X y X' en term1 y term2
      console.log(`      Variable complementaria encontrada: ${factor1} vs ${complement}`)
      
      // Los factores restantes de term1 y term2 (sin X y X') deben formar term3
      const others1 = f1.filter(f => f !== factor1)
      const others2 = f2.filter(f => f !== complement)
      
      // El consenso es la unión de los factores restantes
      const consensusFactors = [...new Set([...others1, ...others2])].sort()
      const term3Sorted = [...f3].sort()
      
      console.log(`      Factores consenso esperados: [${consensusFactors}]`)
      console.log(`      Factores de term3: [${term3Sorted}]`)
      
      // Verificar si term3 coincide con el consenso
      if (JSON.stringify(consensusFactors) === JSON.stringify(term3Sorted)) {
        console.log(`      ✅ ¡Es consenso!`)
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
  /**
 * ✅ MEJORADO: Simplificación exhaustiva con múltiples pasadas
 */
// REEMPLAZAR el método simplify() completo con esta versión mejorada:

/**
 * ✅ MEJORADO: Simplifica con dos modos: algebraico + verificación formal
 */
simplify(expression, options = {}) {
  const {
    maxSteps = 50,
    showAllSteps = true,
    targetForm = 'SOP',
    useFormalMethod = true
  } = options

  // ✅ DEBUG: Activar logs detallados
  console.log('🚀 Iniciando simplificación:', { expression, targetForm, useFormalMethod })

  this.steps = []
  let current = this.normalize(expression)
  const originalExpression = current
  
  // Extraer variables
  const variables = BooleanEvaluator.extractVariables(expression)
  
  this.addStep(current, current, 'normalization', 'Normalización', 'Expresión normalizada')

  // ✅ NUEVO: Intentar primero método formal (Quine-McCluskey)
  if (useFormalMethod && variables.length >= 2 && variables.length <= 10) {
    const formalResult = this.simplifyByTruthTable(expression, variables, targetForm)
    
    if (formalResult && formalResult.expression) {
      const formalExpr = formalResult.expression
      
      // Verificar equivalencia
      const equiv = BooleanEvaluator.areEquivalent(originalExpression, formalExpr)
      
      if (equiv.equivalent) {
        this.addStep(
          current,
          formalExpr,
          'quine_mccluskey',
          'Minimización Formal (Quine-McCluskey)',
          `Simplificación exacta mediante tabla de verdad. Forma ${targetForm} mínima garantizada.`
        )
        
        return {
          success: true,
          originalExpression,
          simplifiedExpression: formalExpr,
          steps: this.steps,
          totalSteps: this.steps.length,
          complexity: this.calculateComplexity(originalExpression, formalExpr),
          equivalent: equiv,
          method: 'formal',
          minterms: formalResult.minterms,
          maxterms: formalResult.maxterms
        }
      }
    }
  }

  // Si el método formal falla o está deshabilitado, continuar con método algebraico
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

  // ✅ NUEVO: Verificación final con método formal
  if (useFormalMethod && variables.length >= 2 && variables.length <= 10) {
    const formalResult = this.simplifyByTruthTable(expression, variables, targetForm)
    
    if (formalResult && formalResult.expression) {
      const formalExpr = formalResult.expression
      
      // Comparar complejidad: si el método formal es mejor, usarlo
      const algebraicComplexity = this.calculateComplexity(originalExpression, current).simplified
      const formalComplexity = this.calculateComplexity(originalExpression, formalExpr).simplified
      
      if (formalComplexity < algebraicComplexity) {
        this.addStep(
          current,
          formalExpr,
          'formal_verification',
          'Optimización Final',
          'Se encontró una forma más simple usando minimización formal'
        )
        current = formalExpr
      }
    }
  }

  return {
    success: true,
    originalExpression,
    simplifiedExpression: current,
    steps: this.steps,
    totalSteps: this.steps.length,
    complexity: this.calculateComplexity(originalExpression, current),
    equivalent: BooleanEvaluator.areEquivalent(originalExpression, current),
    method: 'algebraic'
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
