import { BooleanEvaluator } from './BooleanEvaluator'
import QuineMcCluskeyMinimizer from './QuineMcCluskey'

class BooleanSimplifier {
  constructor() {
    this.steps = []
    this.maxIterations = 100
  }

 
  normalize(expr) {
    let normalized = expr
    .replace(/\s+/g, '')

    // 2️⃣ Normalizar operadores comunes a tu formato
    .replace(/\*|×|&{2}|AND/gi, '·')  // multiplicación explícita
    .replace(/\||∨|OR/gi, '+')        // suma OR
    .replace(/!|¬|~|NOT\s*/gi, "'")   // negación

    // 3️⃣ Insertar multiplicación implícita:
    // Caso: variable seguida de variable (AB → A·B)
    .replace(/([A-Z0-9])([A-Z0-9])/gi, '$1·$2')

    // Caso: variable seguida de paréntesis (A(B+C) → A·(B+C))
    .replace(/([A-Z0-9])\(/gi, '$1·(')

    // Caso: paréntesis seguido de variable (()A → ()·A)
    .replace(/\)([A-Z0-9])/gi, ')·$1')

    // Caso: paréntesis seguido de paréntesis (()() → ()·())
    .replace(/\)\(/g, ')·(')

    // 4️⃣ Limpiar dobles puntos (por si algo quedó repetido)
    .replace(/··+/g, '·')

    // 5️⃣ Convertir todo a mayúsculas
    .toUpperCase();

  return normalized;
}
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



convertImplicantsToExpression(implicants, variables, form = 'SOP') {
if (!implicants || implicants.length === 0) {
  return form === 'SOP' ? '0' : '1'
}

console.log('🔄 Convirtiendo implicantes:', { implicants, variables, form, numVars: variables.length })

const terms = implicants.map((imp, idx) => {
  console.log(`  Implicante ${idx}: "${imp}"`)
  const literals = []
  
  for (let i = 0; i < imp.length; i++) {
    if (imp[i] === '1') {
      literals.push(form === 'SOP' ? variables[i] : variables[i] + "'")
    } else if (imp[i] === '0') {
      literals.push(form === 'SOP' ? variables[i] + "'" : variables[i])
    }
  }
  
  console.log(`    Literales: [${literals.join(', ')}]`)
  
  if (literals.length === 0) return '1'
  
  if (form === 'SOP') {
    return literals.join('·')
  } else {
    return '(' + literals.join('+') + ')'
  }
})

console.log('  Términos finales:', terms)

let result = form === 'SOP' ? terms.join('+') : terms.join('·')

// ✅ NUEVO: Post-optimizar el resultado
const postOpt = this.postOptimize(result)
if (postOpt !== result && this.isEquivalent(result, postOpt)) {
  console.log(`  📉 Post-optimizado: ${result} → ${postOpt}`)
  result = postOpt
}

return result
}
 
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
   * A·(B+C) → A·B + A·C
   * (A+B)·C → A·C + B·C
   */
/**
 * Maneja: (A+B)·C, C·(A+B), (A·B)+C, etc.
 */
/**
* ✅ CORREGIDO COMPLETAMENTE: Maneja TODOS los casos de distributiva
*/
applyDistributive(expr) {
let result = expr
let changed = true
let iterations = 0

while (changed && iterations < 20) {
  const before = result
  iterations++
  
  // Caso 1: (Suma)·Factor (con o sin paréntesis en el factor)
  result = result.replace(/\(([^)]+)\)·\(?([A-Z]'?)\)?/g, (match, sum, factor) => {
    if (sum.includes('+')) {
      const terms = this.splitByTopLevelOperator(sum, '+')
      return terms.map(t => `${t.trim()}·${factor}`).join('+')
    }
    return match
  })
  
  // Caso 2: Factor·(Suma) (con o sin paréntesis en el factor)
  result = result.replace(/\(?([A-Z]'?)\)?·\(([^)]+)\)/g, (match, factor, sum) => {
    if (sum.includes('+')) {
      const terms = this.splitByTopLevelOperator(sum, '+')
      return terms.map(t => `${factor}·${t.trim()}`).join('+')
    }
    return match
  })
  
  // Caso 3: (Suma1)·(Suma2) → expansión completa
  result = result.replace(/\(([^)]+)\)·\(([^)]+)\)/g, (match, sum1, sum2) => {
    if (sum1.includes('+') && sum2.includes('+')) {
      // Ambas son sumas: expandir producto cartesiano
      const terms1 = this.splitByTopLevelOperator(sum1, '+')
      const terms2 = this.splitByTopLevelOperator(sum2, '+')
      const products = []
      
      for (const t1 of terms1) {
        for (const t2 of terms2) {
          products.push(`${t1.trim()}·${t2.trim()}`)
        }
      }
      
      return products.join('+')
    } else if (sum1.includes('+')) {
      // Solo sum1 es suma: distribuir sobre sum2
      const terms = this.splitByTopLevelOperator(sum1, '+')
      return terms.map(t => `${t.trim()}·${sum2}`).join('+')
    } else if (sum2.includes('+')) {
      // Solo sum2 es suma: distribuir sum1 sobre ella
      const terms = this.splitByTopLevelOperator(sum2, '+')
      return terms.map(t => `${sum1}·${t.trim()}`).join('+')
    } else {
      // Ninguna es suma: solo combinar productos
      return `${sum1}·${sum2}`
    }
  })
  
  // Caso 4: (Producto)·(Producto) sin sumas → simplemente combinar
  result = result.replace(/\(([^)]+)\)·\(([^)]+)\)/g, (match, prod1, prod2) => {
    if (!prod1.includes('+') && !prod2.includes('+')) {
      return prod1 + '·' + prod2
    }
    return match
  })
  
  changed = (before !== result)
}

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


applyAbsorption(expr) {
  let result = expr
  let changed = true
  const maxIter = 15
  let iter = 0
  
  while (changed && iter < maxIter) {
    iter++
    const before = result
    
    const terms = this.splitByTopLevelOperator(result, '+').map(t => t.trim())
    const absorbed = new Set()
    
    // Para cada término, ver si puede absorber a otros
    for (let i = 0; i < terms.length; i++) {
      if (absorbed.has(i)) continue
      
      const termI = terms[i]
      const factorsI = termI.split('·').map(f => f.trim())
      
      for (let j = 0; j < terms.length; j++) {
        if (i === j || absorbed.has(j)) continue
        
        const termJ = terms[j]
        const factorsJ = termJ.split('·').map(f => f.trim())
        
        // Caso 1: termI es más simple y todos sus factores están en termJ
        // Ejemplo: A absorbe A·B·C
        if (factorsI.every(f => factorsJ.includes(f)) && factorsI.length < factorsJ.length) {
          absorbed.add(j)
          console.log(`  Absorción: ${termI} absorbe ${termJ}`)
        }
        
        // Caso 2: termJ es más simple y todos sus factores están en termI  
        // Ejemplo: B absorbe A·B·C
        if (factorsJ.every(f => factorsI.includes(f)) && factorsJ.length < factorsI.length) {
          absorbed.add(i)
          console.log(`  Absorción: ${termJ} absorbe ${termI}`)
          break
        }
      }
    }
    
    const remaining = terms.filter((_, idx) => !absorbed.has(idx))
    result = remaining.length > 0 ? remaining.join('+') : '0'
    
    changed = (before !== result)
  }
  
  return result
}



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

// ===== FRAGMENTOS PARA AGREGAR/REEMPLAZAR EN BooleanSimplifier.js =====

// 1️⃣ REEMPLAZAR el método postOptimize() existente con este mejorado:

postOptimize(expr) {
let result = expr
let changed = true
let iteration = 0
const maxIterations = 50

console.log('🔧 Iniciando post-optimización exhaustiva:', expr)

while (changed && iteration < maxIterations) {
  iteration++
  const before = result
  
  console.log(`  Iteración ${iteration}:`, result)
  
  // PASO 1: Leyes básicas (incluyendo A + A·B = A)
  result = this.applyBasicLaws(result)
  if (result !== before && this.isEquivalent(before, result)) {
    console.log('    ✓ Leyes básicas:', result)
    changed = true
    continue
  }
   // PASO 2: Combinar términos complementarios (A·X + A'·X → X)
   result = this.applyComplementaryCombination(result)
   if (result !== before && this.isEquivalent(before, result)) {
     console.log('    ✓ Combinación complementaria:', result)
     changed = true
     continue
   }
  
  // PASO 3: Absorción ultra-agresiva (A + B·C donde A implica B·C)
  result = this.applyUltraAbsorption(result)
  if (result !== before && this.isEquivalent(before, result)) {
    console.log('    ✓ Absorción ultra:', result)
    changed = true
    continue
  }
  
 
  
  // PASO 4: Eliminar consenso (A·B + A·C + B·C → A·B + A·C)
  result = this.eliminateConsensusTerms(result)
  if (result !== before && this.isEquivalent(before, result)) {
    console.log('    ✓ Consenso eliminado:', result)
    changed = true
    continue
  }
  result = this.applyLogicalCoverage(result)
  if (result !== before) {
    if (this.isEquivalent(before, result)) {
      console.log('    ✓ Cobertura lógica:', result)
      changed = true
      continue
    } else {
      result = before
    }
  }
  
  // PASO 6: Factorización inversa (si reduce complejidad)
  result = this.tryReverseFactorization(result)
  if (result !== before && this.isEquivalent(before, result)) {
    console.log('    ✓ Factorización inversa:', result)
    changed = true
    continue
  }
  
  // PASO 7: Simplificación por dominancia (A + A·B·C = A)
  result = this.applyDominanceSimplification(result)
  if (result !== before && this.isEquivalent(before, result)) {
    console.log('    ✓ Dominancia:', result)
    changed = true
    continue
  }
  
  changed = false
}

console.log('✅ Post-optimización completada:', result)
return result
}

applyUltraAbsorption(expr) {
const terms = this.splitByTopLevelOperator(expr, '+').map(t => t.trim())
if (terms.length < 2) return expr

const absorbed = new Set()

// Ordenar por número de factores (más simple primero)
const sorted = terms.map((t, idx) => ({
  term: t,
  idx,
  factors: t.split('·').map(f => f.trim()).filter(f => f !== '1')
})).sort((a, b) => a.factors.length - b.factors.length)

for (let i = 0; i < sorted.length; i++) {
  if (absorbed.has(sorted[i].idx)) continue
  
  const termI = sorted[i]
  
  for (let j = 0; j < sorted.length; j++) {
    if (i === j || absorbed.has(sorted[j].idx)) continue
    
    const termJ = sorted[j]
    
    // Caso 1: Absorción directa (A absorbe A·B·C)
    if (termI.factors.every(f => termJ.factors.includes(f)) && termI.factors.length < termJ.factors.length) {
      console.log(`    🧲 Ultra-absorción: "${termI.term}" absorbe "${termJ.term}"`)
      absorbed.add(sorted[j].idx)
      continue
    }
    
    // Caso 2: Absorción por implicación lógica
    // Ejemplo: A + B·C donde A=1 implica B·C=1
    // Verificar si termI hace redundante a termJ
    if (this.impliesLogically(termI.term, termJ.term)) {
      console.log(`    🧲 Implicación: "${termI.term}" hace redundante "${termJ.term}"`)
      absorbed.add(sorted[j].idx)
    }
  }
}

if (absorbed.size > 0) {
  const remaining = terms.filter((_, idx) => !absorbed.has(idx))
  return remaining.length > 0 ? remaining.join('+') : '0'
}

return expr
}
applyComplementaryCombination(expr) {
const terms = this.splitByTopLevelOperator(expr, '+').map(t => t.trim())
if (terms.length < 2) return expr

let result = expr
let madeChange = true

while (madeChange) {
  madeChange = false
  const currentTerms = this.splitByTopLevelOperator(result, '+').map(t => t.trim())
  const processed = new Set()
  const toAdd = []
  
  for (let i = 0; i < currentTerms.length; i++) {
    if (processed.has(i)) continue
    
    const factors1 = currentTerms[i].split('·').map(f => f.trim())
    
    for (let j = i + 1; j < currentTerms.length; j++) {
      if (processed.has(j)) continue
      
      const factors2 = currentTerms[j].split('·').map(f => f.trim())
      
      // Caso 1: Misma longitud, buscar UNA variable complementaria
      if (factors1.length === factors2.length) {
        let diffVar = null
        let diffCount = 0
        const common = []
        
        for (const f1 of factors1) {
          if (factors2.includes(f1)) {
            common.push(f1)
          } else {
            const base1 = f1.replace(/'/g, '')
            const complement1 = f1.endsWith("'") ? base1 : base1 + "'"
            
            if (factors2.includes(complement1)) {
              diffVar = base1
              diffCount++
            }
          }
        }
        
        // Solo UNA variable diferente: A·X + A'·X → X
        if (diffCount === 1 && common.length === factors1.length - 1) {
          const replacement = common.length > 0 ? common.join('·') : '1'
          console.log(`    🔀 Combinación: "${currentTerms[i]}" + "${currentTerms[j]}" → "${replacement}"`)
          
          processed.add(i)
          processed.add(j)
          
          if (!toAdd.includes(replacement) && !currentTerms.includes(replacement)) {
            toAdd.push(replacement)
            madeChange = true
          }
          break
        }
      }
      
      // Caso 2: Longitudes diferentes, buscar subsumption con complemento
      // Ejemplo: A + A'·B → A + B (si A subsume parte de A'·B)
      if (Math.abs(factors1.length - factors2.length) === 1) {
        const [shorter, longer] = factors1.length < factors2.length 
          ? [factors1, factors2] 
          : [factors2, factors1]
        
        // Verificar si el término más corto es complemento de algún factor del más largo
        for (const sf of shorter) {
          const base = sf.replace(/'/g, '')
          const complement = sf.endsWith("'") ? base : base + "'"
          
          if (longer.includes(complement)) {
            // Ejemplo: A + A'·B → A + B
            const remaining = longer.filter(f => f !== complement)
            if (remaining.length > 0) {
              const newTerm = remaining.join('·')
              console.log(`    🔀 Subsumption: "${currentTerms[i]}" + "${currentTerms[j]}" incluye "${newTerm}"`)
              
              const longerIdx = factors1.length < factors2.length ? j : i
              processed.add(longerIdx)
              
              if (!toAdd.includes(newTerm) && !currentTerms.includes(newTerm)) {
                toAdd.push(newTerm)
                madeChange = true
              }
            }
          }
        }
      }
    }
  }
  
  if (processed.size > 0) {
    const remaining = currentTerms.filter((_, idx) => !processed.has(idx))
    const newTerms = [...remaining, ...toAdd]
    result = newTerms.length > 0 ? newTerms.join('+') : '0'
  } else {
    break
  }
}

return result
}
tryReverseFactorization(expr) {
// Si tiene la forma X·(A+B), expandir a X·A + X·B y verificar si simplifica más
const factorPattern = /([A-Z]'?(?:·[A-Z]'?)*)·\(([^)]+)\)/g
let match
let bestResult = expr
let bestComplexity = this.countOperators(expr)

while ((match = factorPattern.exec(expr)) !== null) {
  const factor = match[1]
  const sum = match[2]
  
  // Expandir
  const terms = this.splitByTopLevelOperator(sum, '+')
  const expanded = terms.map(t => `${factor}·${t.trim()}`).join('+')
  
  const testExpr = expr.replace(match[0], expanded)
  
  // Simplificar la versión expandida
  const simplified = this.applyBasicLaws(testExpr)
  const testComplexity = this.countOperators(simplified)
  
  if (testComplexity < bestComplexity && this.isEquivalent(expr, simplified)) {
    bestResult = simplified
    bestComplexity = testComplexity
    console.log(`    🔄 Expansión beneficiosa: ${match[0]} → ${expanded} → ${simplified}`)
  }
}

return bestResult
}
applyDominanceSimplification(expr) {
const terms = this.splitByTopLevelOperator(expr, '+').map(t => t.trim())
if (terms.length < 2) return expr

const toRemove = new Set()

// Para cada término simple, verificar si domina términos compuestos
for (let i = 0; i < terms.length; i++) {
  if (toRemove.has(i)) continue
  
  const termI = terms[i]
  const factorsI = termI.split('·').map(f => f.trim())
  
  // Solo términos simples pueden dominar
  if (factorsI.length > 2) continue
  
  for (let j = 0; j < terms.length; j++) {
    if (i === j || toRemove.has(j)) continue
    
    const termJ = terms[j]
    const factorsJ = termJ.split('·').map(f => f.trim())
    
    // TermI domina termJ si:
    // 1. Todos los factores de I están en J, o
    // 2. I es una variable simple que aparece en J
    if (factorsI.length === 1) {
      // Variable simple: A domina A·B·C·D...
      if (factorsJ.includes(factorsI[0])) {
        console.log(`    ⚡ Dominancia: "${termI}" domina "${termJ}"`)
        toRemove.add(j)
      }
    } else if (factorsI.every(f => factorsJ.includes(f)) && factorsI.length < factorsJ.length) {
      console.log(`    ⚡ Dominancia parcial: "${termI}" domina "${termJ}"`)
      toRemove.add(j)
    }
  }
}

if (toRemove.size > 0) {
  const remaining = terms.filter((_, idx) => !toRemove.has(idx))
  return remaining.length > 0 ? remaining.join('+') : '0'
}

return expr
}
applyLogicalCoverage(expr) {
const terms = this.splitByTopLevelOperator(expr, '+').map(t => t.trim())
if (terms.length < 2) return expr

const toRemove = new Set()

// Para cada par de términos, verificar si uno cubre lógicamente al otro
for (let i = 0; i < terms.length; i++) {
  if (toRemove.has(i)) continue
  
  const factorsI = terms[i].split('·').map(f => f.trim())
  
  for (let j = 0; j < terms.length; j++) {
    if (i === j || toRemove.has(j)) continue
    
    const factorsJ = terms[j].split('·').map(f => f.trim())
    
    // CASO CRÍTICO: A + B·C donde B o C es A
    // Ejemplo: A + A·B → A (B es redundante)
    if (factorsI.length < factorsJ.length) {
      // I es más simple que J
      // Verificar si todos los factores de I están en J
      if (factorsI.every(f => factorsJ.includes(f))) {
        console.log(`    📦 Cobertura: "${terms[i]}" cubre "${terms[j]}"`)
        toRemove.add(j)
      }
    }
    
    // CASO ESPECIAL: A + B·C → Verificar si A=1 implica B·C=1
    // Esto requiere análisis más profundo
    if (factorsI.length === 1 && factorsJ.length > 1) {
      const varI = factorsI[0]
      
      // Si varI aparece en J, entonces I absorbe J
      if (factorsJ.includes(varI)) {
        console.log(`    📦 Cobertura simple: "${terms[i]}" absorbe "${terms[j]}" (contiene ${varI})`)
        toRemove.add(j)
      }
    }
  }
}

if (toRemove.size > 0) {
  const remaining = terms.filter((_, idx) => !toRemove.has(idx))
  return remaining.length > 0 ? remaining.join('+') : '0'
}

return expr
}

impliesLogically(term1, term2) {
// Verifica si term1=1 implica term2=1
// Esto es cierto si todos los factores de term1 están en term2
const factors1 = term1.split('·').map(f => f.trim())
const factors2 = term2.split('·').map(f => f.trim())

return factors1.every(f => factors2.includes(f)) && factors1.length <= factors2.length
}
// 2️⃣ AGREGAR este nuevo método para eliminar términos de consenso:

eliminateConsensusTerms(expr) {
const terms = this.splitByTopLevelOperator(expr, '+').map(t => t.trim())
if (terms.length < 3) return expr

const toRemove = new Set()

// Para cada término k, verificar si es consenso de otros dos términos i y j
for (let k = 0; k < terms.length; k++) {
  if (toRemove.has(k)) continue
  
  const factorsK = terms[k].split('·').map(f => f.trim()).sort()
  
  for (let i = 0; i < terms.length; i++) {
    if (i === k || toRemove.has(i)) continue
    
    const factorsI = terms[i].split('·').map(f => f.trim())
    
    for (let j = i + 1; j < terms.length; j++) {
      if (j === k || toRemove.has(j)) continue
      
      const factorsJ = terms[j].split('·').map(f => f.trim())
      
      // Buscar variable complementaria entre I y J
      for (const fi of factorsI) {
        const base = fi.replace(/'/g, '')
        const complement = fi.endsWith("'") ? base : base + "'"
        
        if (factorsJ.includes(complement)) {
          // I y J tienen variables complementarias
          const othersI = factorsI.filter(f => f !== fi)
          const othersJ = factorsJ.filter(f => f !== complement)
          
          // El consenso es la unión de los demás factores
          const consensus = [...new Set([...othersI, ...othersJ])].sort()
          
          // Si coincide con K, entonces K es redundante
          if (JSON.stringify(consensus) === JSON.stringify(factorsK)) {
            console.log(`    🔍 Consenso: "${terms[k]}" es redundante (consenso de "${terms[i]}" y "${terms[j]}")`)
            toRemove.add(k)
            break
          }
        }
      }
      if (toRemove.has(k)) break
    }
    if (toRemove.has(k)) break
  }
}

if (toRemove.size > 0) {
  const remaining = terms.filter((_, idx) => !toRemove.has(idx))
  return remaining.length > 0 ? remaining.join('+') : '0'
}

return expr
}




applyTautologySimplification(expr) {
const terms = this.splitByTopLevelOperator(expr, '+').map(t => t.trim())

// Para cada par de términos, verificar si cubren todos los casos de una variable
for (let i = 0; i < terms.length; i++) {
  for (let j = i + 1; j < terms.length; j++) {
    const term1 = terms[i]
    const term2 = terms[j]
    
    const factors1 = term1.split('·').map(f => f.trim())
    const factors2 = term2.split('·').map(f => f.trim())
    
    // Buscar factores comunes
    const common = factors1.filter(f => factors2.includes(f))
    
    if (common.length > 0) {
      // Buscar una variable que aparece negada en uno y positiva en otro
      const diff1 = factors1.filter(f => !common.includes(f))
      const diff2 = factors2.filter(f => !common.includes(f))
      
      // Si solo difieren en una variable y sus negaciones
      if (diff1.length === 1 && diff2.length === 1) {
        const var1 = diff1[0].replace(/'/g, '')
        const var2 = diff2[0].replace(/'/g, '')
        
        if (var1 === var2 && diff1[0] !== diff2[0]) {
          // Encontramos A·X + A'·X, podemos reducir a X
          const replacement = common.length > 0 ? common.join('·') : '1'
          
          // Reemplazar ambos términos
          const newTerms = terms.filter((_, idx) => idx !== i && idx !== j)
          if (!newTerms.includes(replacement)) {
            newTerms.push(replacement)
          }
          
          return newTerms.join('+')
        }
      }
    }
  }
}

return expr
}


applyAdvancedAbsorption(expr) {
let result = expr
const terms = this.splitByTopLevelOperator(result, '+').map(t => t.trim())

if (terms.length < 2) return expr

const absorbed = new Set()

// Ordenar por número de factores (más simple primero)
const sorted = terms.map((t, idx) => ({
  term: t,
  idx,
  count: t.split('·').length
})).sort((a, b) => a.count - b.count)

// Absorción directa: X absorbe X·Y
for (let i = 0; i < sorted.length; i++) {
  if (absorbed.has(sorted[i].idx)) continue
  
  const termI = sorted[i].term
  const factorsI = termI.split('·').map(f => f.trim())
  
  for (let j = 0; j < sorted.length; j++) {
    if (i === j || absorbed.has(sorted[j].idx)) continue
    
    const termJ = sorted[j].term
    const factorsJ = termJ.split('·').map(f => f.trim())
    
    // Si todos los factores de I están en J, J es redundante
    if (factorsI.every(f => factorsJ.includes(f)) && factorsI.length < factorsJ.length) {
      console.log(`    🧲 "${termI}" absorbe "${termJ}"`)
      absorbed.add(sorted[j].idx)
    }
  }
}

if (absorbed.size > 0) {
  const remaining = terms.filter((_, idx) => !absorbed.has(idx))
  result = remaining.length > 0 ? remaining.join('+') : '0'
}

return result
}

applyReverseConsensus(expr) {
const terms = this.splitByTopLevelOperator(expr, '+').map(t => t.trim())
const toRemove = new Set()

// Buscar términos que son "generalizaciones" de otros
for (let i = 0; i < terms.length; i++) {
  const termI = terms[i]
  const factorsI = termI.split('·').map(f => f.trim())
  
  // Contar cuántos otros términos contienen todos los factores de I
  let absorbs = 0
  
  for (let j = 0; j < terms.length; j++) {
    if (i === j) continue
    
    const termJ = terms[j]
    const factorsJ = termJ.split('·').map(f => f.trim())
    
    // Si I es subconjunto de J, I puede absorber J
    if (factorsI.every(f => factorsJ.includes(f)) && factorsI.length < factorsJ.length) {
      toRemove.add(j)
      absorbs++
    }
  }
}

if (toRemove.size > 0) {
  const remaining = terms.filter((_, idx) => !toRemove.has(idx))
  return remaining.join('+')
}

return expr
}

applySelectiveFactorization(expr) {
const originalComplexity = this.countOperators(expr)

// Intentar factorización
const factored = this.applyFactorization(expr)

if (factored === expr) return expr

// Simplificar el resultado factorado
const simplified = this.applyBasicLaws(factored)
const newComplexity = this.countOperators(simplified)

// Solo aceptar si reduce complejidad Y es equivalente
if (newComplexity < originalComplexity && this.isEquivalent(expr, simplified)) {
  return simplified
}

return expr
}


countOperators(expr) {
const ands = (expr.match(/·/g) || []).length
const ors = (expr.match(/\+/g) || []).length
const nots = (expr.match(/'/g) || []).length
const literals = (expr.match(/[A-Z]/g) || []).length

return ors + ands + (nots * 0.5) + (literals * 0.5)
}

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

 

  applyBasicLaws(expr) {
    let result = expr
    let changed = true
    let iterations = 0
    
    while (changed && iterations < 20) {
      const before = result
      iterations++
      
      // 1. Doble negación: A'' → A
      result = result.replace(/([A-Z])''/g, '$1')
      
      // 2. ✅ MEJORADO: Complemento en productos: A·A' = 0 (detectar en cualquier orden)
      const productTerms = result.split('+').map(term => {
        const factors = term.split('·').map(f => f.trim())
        
        // Buscar complementos en el producto (sin importar el orden)
        for (let i = 0; i < factors.length; i++) {
          const base1 = factors[i].replace(/'/g, '')
          const isNeg1 = factors[i].includes("'")
          
          for (let j = 0; j < factors.length; j++) {
            if (i === j) continue
            
            const base2 = factors[j].replace(/'/g, '')
            const isNeg2 = factors[j].includes("'")
            
            // Si es la misma variable con polaridades opuestas
            if (base1 === base2 && isNeg1 !== isNeg2) {
              console.log(`    ⚠️ Complemento detectado: ${factors[i]} · ${factors[j]} = 0 en término "${term}"`)
              return '0'
            }
          }
        }
        
        return term
      })
      
      result = productTerms.filter(t => t !== '0').join('+')
      if (result === '') result = '0'
      
      // 3. Idempotencia en productos: A·A = A, A·B·A = A·B
      result = result.split('+').map(term => {
        const factors = term.split('·').map(f => f.trim())
        const uniqueFactors = [...new Set(factors)]
        
        if (uniqueFactors.length !== factors.length) {
          console.log(`    🔁 Idempotencia: ${term} → ${uniqueFactors.join('·')}`)
        }
        
        return uniqueFactors.join('·')
      }).join('+')
      
      // 4. Anulación: A·0 = 0, eliminar términos con 0
      if (result.includes('·0') || result.includes('0·')) {
        result = result.split('+').filter(t => !t.includes('·0') && !t.includes('0·')).join('+')
        if (result === '') result = '0'
      }
      
      // 5. Dominancia: A+1 = 1
      if (result.includes('+1') || result.includes('1+') || result === '1') {
        result = '1'
      }
      
      // 6. Identidad: A·1 = A, A+0 = A
      result = result.replace(/([A-Z]'?(\·[A-Z]'?)*)·1/g, '$1')
      result = result.replace(/1·([A-Z]'?(\·[A-Z]'?)*)/g, '$1')
      result = result.split('+').filter(t => t !== '0').join('+')
      if (result === '') result = '0'
      
      // 7. Idempotencia en sumas: A+A = A
      const uniqueTerms = [...new Set(result.split('+'))]
      result = uniqueTerms.join('+')
      
      // 8. Complemento en sumas: A+A' = 1
      const sumTerms = result.split('+').map(t => t.trim())
      const bases = new Set()
      const negated = new Set()
      
      for (const term of sumTerms) {
        if (!term.includes('·')) {
          const base = term.replace(/'/g, '')
          if (term.includes("'")) {
            negated.add(base)
          } else {
            bases.add(base)
          }
        }
      }
      
      for (const base of bases) {
        if (negated.has(base)) {
          console.log(`    ✅ Complemento en suma: ${base}+${base}' = 1`)
          result = '1'
          break
        }
      }
      
      // 9. Absorción simple: A + A·B = A
      const allTermsList = result.split('+').map(t => t.trim())
      const toRemove = []
      
      for (let i = 0; i < allTermsList.length; i++) {
        const term = allTermsList[i]
        const factors = term.split('·').map(f => f.trim())
        
        if (factors.length === 1) {
          for (let j = 0; j < allTermsList.length; j++) {
            if (i === j) continue
            
            const otherTerm = allTermsList[j]
            const otherFactors = otherTerm.split('·').map(f => f.trim())
            
            if (otherFactors.includes(term) && otherFactors.length > 1) {
              console.log(`    🧲 Absorción: ${term} + ${otherTerm} = ${term}`)
              toRemove.push(j)
            }
          }
        }
      }
      
      if (toRemove.length > 0) {
        const filtered = allTermsList.filter((_, idx) => !toRemove.includes(idx))
        result = filtered.join('+')
      }
      
      // 10. Combinación de términos: A·B + A·B' = A
      const terms = result.split('+').map(t => t.trim())
      const combined = []
      const used = new Set()
      
      for (let i = 0; i < terms.length; i++) {
        if (used.has(i)) continue
        
        const factorsI = terms[i].split('·').map(f => f.trim())
        let foundPair = false
        
        for (let j = i + 1; j < terms.length; j++) {
          if (used.has(j)) continue
          
          const factorsJ = terms[j].split('·').map(f => f.trim())
          
          if (factorsI.length !== factorsJ.length) continue
          
          let diffVar = null
          const common = []
          
          for (const fi of factorsI) {
            if (factorsJ.includes(fi)) {
              common.push(fi)
            } else {
              const base = fi.replace(/'/g, '')
              const complement = fi.endsWith("'") ? base : base + "'"
              
              if (factorsJ.includes(complement) && diffVar === null) {
                diffVar = base
              }
            }
          }
          
          if (diffVar && common.length === factorsI.length - 1) {
            const newTerm = common.length > 0 ? common.join('·') : '1'
            console.log(`    🔀 Combinación: ${terms[i]} + ${terms[j]} = ${newTerm}`)
            combined.push(newTerm)
            used.add(i)
            used.add(j)
            foundPair = true
            break
          }
        }
        
        if (!foundPair && !used.has(i)) {
          combined.push(terms[i])
        }
      }
      
      if (used.size > 0) {
        result = combined.join('+')
      }
      
      changed = (before !== result)
    }
    
    if (result === '') result = '0'
    result = result.replace(/^\+/, '').replace(/\+$/, '')
    
    return result
  }
/**
* ✅ MEJORADO: Expande completamente con distributiva y simplifica
*/
expandAndSimplify(expr) {
let result = expr
let previousResult = ''
let iterations = 0
const maxIterations = 15

console.log('🔧 Expandiendo:', expr)

// Fase 1: Expansión completa
while (result !== previousResult && iterations < maxIterations) {
  previousResult = result
  iterations++
  
  // Aplicar distributiva agresivamente
  result = this.applyDistributive(result)
  
  // Aplicar leyes básicas después de cada expansión
  result = this.applyBasicLaws(result)
  
  // Limpiar paréntesis
  result = this.cleanParentheses(result)
  
  console.log(`  Iteración ${iterations}:`, result)
}

// Fase 2: Simplificación post-expansión
iterations = 0
while (result !== previousResult && iterations < 10) {
  previousResult = result
  iterations++
  
  result = this.applyAbsorption(result)
  result = this.applyBasicLaws(result)
  result = this.cleanParentheses(result)
}

console.log('✅ Expansión completada:', result)
return result
}

cleanParentheses(expr) {
  let result = expr
  let changed = true
  let iterations = 0
  
  while (changed && iterations < 10) {
    const before = result
    iterations++
    
    // (A) → A
    result = result.replace(/\(([A-Z]'?)\)/g, '$1')
    
    // ((A)) → (A)
    result = result.replace(/\(\(([^)]+)\)\)/g, '($1)')
    
    // () → vacío
    result = result.replace(/\(\)/g, '')
    
    // Paréntesis alrededor de toda la expresión si es innecesario
    if (result.startsWith('(') && result.endsWith(')')) {
      let depth = 0
      let canRemove = true
      for (let i = 0; i < result.length; i++) {
        if (result[i] === '(') depth++
        if (result[i] === ')') depth--
        if (depth === 0 && i < result.length - 1) {
          canRemove = false
          break
        }
      }
      if (canRemove) {
        result = result.slice(1, -1)
      }
    }
    
    changed = (before !== result)
  }
  
  return result
}

  

// ===== REEMPLAZAR COMPLETAMENTE el método simplify() en BooleanSimplifier.js =====

/**
* ✅ CORREGIDO: Simplifica expresiones booleanas (pequeñas y grandes)
*/
simplify(expression, options = {}) {
const {
  maxSteps = 50,
  showAllSteps = true,
  targetForm = 'SOP',
  useFormalMethod = true
} = options

console.log('🚀 Iniciando simplificación:', { expression, targetForm, useFormalMethod })

this.steps = []
let current = this.normalize(expression)
const originalExpression = current

const variables = BooleanEvaluator.extractVariables(expression)

this.addStep(current, current, 'normalization', 'Normalización', 'Expresión normalizada')

// ====================================================================
// ESTRATEGIA PRINCIPAL: MÉTODO ALGEBRAICO (funciona para todo)
// ====================================================================

console.log('🔄 Aplicando simplificación algebraica...')


// FASE 1: Ciclo principal de simplificación
let lastChange = -1
for (let iteration = 0; iteration < maxSteps; iteration++) {
  const before = current
  let applied = false

  // Paso 1: Leyes básicas (incluye A·A=A, A+A'=1, etc.)
  const afterBasic = this.applyBasicLaws(current)
  if (afterBasic !== current && this.isEquivalent(current, afterBasic)) {
    current = afterBasic
    this.addStep(before, current, 'basic', 'Leyes Básicas', 'Idempotencia, complemento, identidad')
    applied = true
    lastChange = iteration
    console.log(`  ${iteration + 1}. Básicas:`, current)
    continue
  }

  // Paso 2: Absorción mejorada
  const afterAbs = this.applyAbsorptionEnhanced(current)
  if (afterAbs !== current && this.isEquivalent(current, afterAbs)) {
    current = afterAbs
    this.addStep(before, current, 'absorption', 'Absorción', 'A+A·B=A')
    applied = true
    lastChange = iteration
    console.log(`  ${iteration + 1}. Absorción:`, current)
    continue
  }

  // Paso 3: Combinación complementaria
  const afterComb = this.applyComplementaryCombination(current)
  if (afterComb !== current && this.isEquivalent(current, afterComb)) {
    current = afterComb
    this.addStep(before, current, 'complementary', 'Combinación', 'A·X+A\'·X=X')
    applied = true
    lastChange = iteration
    console.log(`  ${iteration + 1}. Complementaria:`, current)
    continue
  }

  // Paso 4: Distributiva (si aún hay paréntesis)
  if (current.includes('(') && current.includes(')')) {
    const afterDist = this.applyDistributive(current)
    if (afterDist !== current) {
      const simplified = this.applyBasicLaws(afterDist)
      if (simplified !== current && this.isEquivalent(current, simplified)) {
        current = simplified
        this.addStep(before, current, 'distributive', 'Distributiva', 'Expansión y simplificación')
        applied = true
        lastChange = iteration
        console.log(`  ${iteration + 1}. Distributiva:`, current)
        continue
      }
    }
  }

  // Paso 5: Limpieza de paréntesis
  const cleaned = this.cleanParentheses(current)
  if (cleaned !== current) {
    current = cleaned
    applied = true
    console.log(`  ${iteration + 1}. Limpieza:`, current)
    continue
  }

  if (!applied) {
    console.log(`  ✓ Convergencia en iteración ${iteration + 1}`)
    break
  }
}

// FASE 2: Post-optimización exhaustiva
console.log('🔧 Post-optimización final...')
const postOpt = this.postOptimize(current)
if (postOpt !== current && this.isEquivalent(current, postOpt)) {
  this.addStep(current, postOpt, 'post_optimization', 'Post-Optimización', 'Eliminación de redundancias')
  current = postOpt
  console.log('  ✓ Post-optimizado:', current)
}

// ====================================================================
// MÉTODO FORMAL (solo si algebraico no mejoró lo suficiente)
// ====================================================================

const algebraicComplexity = this.countOperators(current)
const originalComplexity = this.countOperators(originalExpression)

// Solo intentar método formal si:
// 1. Usuario lo habilitó
// 2. Tenemos 2-4 variables
// 3. El método algebraico no redujo mucho la complejidad
if (useFormalMethod && 
    variables.length >= 2 && 
    variables.length <= 4 &&
    algebraicComplexity > variables.length) {
  
  console.log('🔬 Intentando método formal como respaldo...')
  
  const formalResult = this.simplifyByTruthTable(expression, variables, targetForm)
  
  if (formalResult && formalResult.expression) {
    let formalSimplified = formalResult.expression
    
    // Post-optimizar el resultado formal
    const formalPostOpt = this.postOptimize(formalSimplified)
    if (formalPostOpt !== formalSimplified && this.isEquivalent(formalSimplified, formalPostOpt)) {
      formalSimplified = formalPostOpt
    }
    
    const formalComplexity = this.countOperators(formalSimplified)
    
    // Solo usar resultado formal si es MEJOR que el algebraico
    if (formalComplexity < algebraicComplexity && 
        BooleanEvaluator.areEquivalent(originalExpression, formalSimplified).equivalent) {
      
      console.log('✅ Método formal dio mejor resultado:', formalSimplified)
      
      this.addStep(
        current,
        formalSimplified,
        'quine_mccluskey',
        'Minimización Formal',
        'Tabla de verdad + Quine-McCluskey'
      )
      
      current = formalSimplified
    } else {
      console.log('ℹ️ Método algebraico fue mejor o igual')
    }
  }
}

console.log('✅ Simplificación completada:', current)

return {
  success: true,
  originalExpression,
  simplifiedExpression: current,
  steps: this.steps,
  totalSteps: this.steps.length,
  complexity: this.calculateComplexity(originalExpression, current),
  equivalent: BooleanEvaluator.areEquivalent(originalExpression, current),
  method: this.steps.some(s => s.theorem === 'quine_mccluskey') ? 'formal' : 'algebraic'
}
}

  isEquivalent(expr1, expr2) {
    const result = BooleanEvaluator.areEquivalent(expr1, expr2)
    return result.equivalent
  }

 
  isSOP(expr) {
    // SOP: suma de productos (A·B + C·D)
    return expr.includes('+') && expr.includes('·')
  }


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
  convertToMinimalPOS(expr) {
    try {
      // Obtener la expresión en SOP mínima primero
      const sopMinimal = this.postOptimize(expr)
      
      // Aplicar De Morgan para convertir a POS
      // SOP: A + B·C → POS: (A+B)·(A+C) usando A+B·C = (A+B)·(A+C)
      
      // Método: negar, convertir con De Morgan, negar de nuevo
      const negated = this.negateTerm(sopMinimal)
      const demorgan = this.applyDeMorgan(negated)
      const posForm = this.negateTerm(demorgan)
      
      // Simplificar el resultado POS
      const simplified = this.simplifyPOSForm(posForm)
      
      return simplified
    } catch (error) {
      console.warn('Error en conversión POS:', error)
      return expr
    }
  }
  
  simplifyPOSForm(expr) {
    // Eliminar factores redundantes en POS
    // (A+B)·(A+C)·(B+C) → (A+B)·(A+C)
    
    const factors = this.splitByTopLevelOperator(expr, '·').map(f => f.trim())
    if (factors.length < 2) return expr
    
    const absorbed = new Set()
    
    for (let i = 0; i < factors.length; i++) {
      if (absorbed.has(i)) continue
      
      const factorI = factors[i].replace(/[()]/g, '')
      const termsI = factorI.split('+').map(t => t.trim()).sort()
      
      for (let j = 0; j < factors.length; j++) {
        if (i === j || absorbed.has(j)) continue
        
        const factorJ = factors[j].replace(/[()]/g, '')
        const termsJ = factorJ.split('+').map(t => t.trim()).sort()
        
        // Si todos los términos de I están en J, J es redundante
        if (termsI.every(t => termsJ.includes(t)) && termsI.length < termsJ.length) {
          console.log(`    POS: (${termsI.join('+')}) absorbe (${termsJ.join('+')})`)
          absorbed.add(j)
        }
      }
    }
    
    if (absorbed.size > 0) {
      const remaining = factors.filter((_, idx) => !absorbed.has(idx))
      return remaining.join('·')
    }
    
    return expr
  }
  


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
