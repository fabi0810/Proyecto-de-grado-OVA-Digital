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
      .replace(/\*|×|&{2}|AND/gi, '·')  
      .replace(/\||∨|OR/gi, '+')
      .replace(/!|¬|~|′|NOT\s*/gi, "'")
      .replace(/([A-Z0-9])\(/gi, '$1·(')
      .replace(/\)([A-Z0-9])/gi, ')·$1')
      .replace(/\)\(/g, ')·(')
      .replace(/··+/g, '·')
      .replace(/\s+/g, '')

    // 2️⃣ Normalizar operadores comunes a tu formato
    .replace(/\*|×|&{2}|AND/gi, '·')  // multiplicación explícita
    .replace(/\||∨|OR/gi, '+')        // suma OR
    .replace(/!|¬|~|NOT\s*/gi, "'")   // negación

    // 3️⃣ Insertar multiplicación implícita:
    // Caso: variable seguida de variable (AB → A·B)
    .replace(/([A-Z0-9])([A-Z0-9])/gi, '$1·$2')

    .replace(/([A-Z0-9])\(/gi, '$1·(')

    .replace(/\)([A-Z0-9])/gi, ')·$1')

    .replace(/\)\(/g, ')·(')

    .replace(/··+/g, '·')
      .toUpperCase();
    
    normalized = normalized.replace(/([A-Z])'+/g, (match, base) => {
      const primes = match.length - 1;
      return primes % 2 === 1 ? base + "'" : base;
    });
    console.log('🔧 Normalizado:', expr, '→', normalized);
    return normalized;
  }

  // ============================================================================
  // Detección de Complementos
  // ============================================================================
  areComplementary(literal1, literal2) {
    const base1 = literal1.replace(/'/g, '');
    const base2 = literal2.replace(/'/g, '');
    
    if (base1 !== base2) return false;
    
    const neg1 = (literal1.match(/'/g) || []).length % 2 === 1;
    const neg2 = (literal2.match(/'/g) || []).length % 2 === 1;
    
    return neg1 !== neg2;
  }

  getBaseLiteral(literal) {
    return literal.replace(/'/g, '');
  }

  isNegated(literal) {
    return (literal.match(/'/g) || []).length % 2 === 1;
  }

  // ============================================================================
  // Ley Distributiva
  // ============================================================================
  aplicarDistributiva(expr) {
    let result = expr;
    let changed = true;
    let iterations = 0;
    const maxIterations = 30;
    console.log('📐 Iniciando expansión distributiva completa:', expr);
    while (changed && iterations < maxIterations) {
      iterations++;
      const before = result;
      // CASO 1: (suma1)·(suma2) → Producto cartesiano COMPLETO
      result = result.replace(/\(([^)]+)\)·\(([^)]+)\)/g, (match, sum1, sum2) => {
        const terms1 = this.splitByTopLevelOperator(sum1, '+').map(t => t.trim()).filter(t => t);
        const terms2 = this.splitByTopLevelOperator(sum2, '+').map(t => t.trim()).filter(t => t);
        
        const products = [];
        
        for (const t1 of terms1) {
          for (const t2 of terms2) {
            const factors1 = t1.split('·').map(f => f.trim()).filter(f => f);
            const factors2 = t2.split('·').map(f => f.trim()).filter(f => f);
            
            // Combinar factores
            const combined = [...factors1, ...factors2];
            
            // Verificar si hay complementos (A·A' = 0)
            const hasComplement = this.hasComplementaryFactors(combined);
            
            if (!hasComplement) {
              // Eliminar duplicados manteniendo orden
              const unique = [];
              const seen = new Set();
              
              for (const f of combined) {
                const base = this.getBaseLiteral(f);
                if (!seen.has(base)) {
                  seen.add(base);
                  unique.push(f);
                } else {
                  // Ya existe: verificar si es el mismo literal
                  const existing = unique.find(u => this.getBaseLiteral(u) === base);
                  if (existing !== f) {
                    // Es complemento: este producto es 0
                    products.push('0');
                    continue;
                  }
                }
              }
              
              products.push(unique.join('·') || '1');
            } else {
              products.push('0');
            }
          }
        }
        
        const filtered = products.filter(p => p !== '0');
        const expanded = filtered.length > 0 ? filtered.join('+') : '0';
        
        console.log(`  📐 Producto: (${sum1})·(${sum2}) → ${expanded}`);
        return expanded;
      });
      // CASO 2: literal·(suma) → distribuir
      result = result.replace(/([A-Z]'?)·\(([^)]+)\)/g, (match, literal, sum) => {
        const terms = this.splitByTopLevelOperator(sum, '+').map(t => t.trim()).filter(t => t);
        
        const distributed = terms.map(t => {
          const factors = t.split('·').map(f => f.trim()).filter(f => f);
          
          // Verificar complementos con el literal
          const hasComplement = factors.some(f => this.areComplementary(f, literal));
          
          if (hasComplement) return '0';
          
          // Agregar literal si no está duplicado
          const base = this.getBaseLiteral(literal);
          const exists = factors.some(f => this.getBaseLiteral(f) === base);
          
          if (exists) {
            // Verificar si es el mismo literal
            const existing = factors.find(f => this.getBaseLiteral(f) === base);
            if (existing === literal) {
              return factors.join('·');
            } else {
              return '0'; // Complemento
            }
          }
          
          return [literal, ...factors].join('·');
        });
        
        const filtered = distributed.filter(d => d !== '0');
        return filtered.length > 0 ? filtered.join('+') : '0';
      });
      // CASO 3: (suma)·literal → distribuir
      result = result.replace(/\(([^)]+)\)·([A-Z]'?)/g, (match, sum, literal) => {
        const terms = this.splitByTopLevelOperator(sum, '+').map(t => t.trim()).filter(t => t);
        
        const distributed = terms.map(t => {
          const factors = t.split('·').map(f => f.trim()).filter(f => f);
          
          const hasComplement = factors.some(f => this.areComplementary(f, literal));
          
          if (hasComplement) return '0';
          
          const base = this.getBaseLiteral(literal);
          const exists = factors.some(f => this.getBaseLiteral(f) === base);
          
          if (exists) {
            const existing = factors.find(f => this.getBaseLiteral(f) === base);
            if (existing === literal) {
              return factors.join('·');
            } else {
              return '0';
            }
          }
          
          return [...factors, literal].join('·');
        });
        
        const filtered = distributed.filter(d => d !== '0');
        return filtered.length > 0 ? filtered.join('+') : '0';
      });
      // Limpiar términos 0
      result = result.split('+').map(t => t.trim()).filter(t => t && t !== '0').join('+');
      if (result === '') result = '0';
      changed = (before !== result);
      
      if (changed) {
        console.log(`  Iteración ${iterations}:`, result);
      }
    }
    console.log('✅ Expansión distributiva completada:', result);
    return result;
  }

  // ============================================================================
  // Verificación de Complementos en Factores
  // ============================================================================
  hasComplementaryFactors(factors) {
    const bases = new Map();
    
    for (const factor of factors) {
      const base = this.getBaseLiteral(factor);
      const isNeg = this.isNegated(factor);
      
      if (!bases.has(base)) {
        bases.set(base, { pos: false, neg: false });
      }
      
      if (isNeg) {
        bases.get(base).neg = true;
      } else {
        bases.get(base).pos = true;
      }
      
      // Si ya tiene ambos, hay complemento
      if (bases.get(base).pos && bases.get(base).neg) {
        return true;
      }
    }
    
    return false;
  }

simplificarPorTablaVerdad(expression, variables, targetForm = 'SOP') {
  try {
    // 1. Generar tabla de verdad completa
    const truthTableData = BooleanEvaluator.generarTablaVerdad(expression)
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
      const primeImplicants = qm.minimizar(minterms, [], variables.length)
      console.log('✅ Implicantes primos (SOP):', primeImplicants)
      simplified = this.convertirImplicantesAExpresion(primeImplicants, variables, 'SOP')
    } else {
      // Minimizar maxtérminos para POS
      const primeImplicants = qm.minimizar(maxterms, [], variables.length)
      console.log('✅ Implicantes primos (POS):', primeImplicants)
      simplified = this.convertirImplicantesAExpresion(primeImplicants, variables, 'POS')
    }
    
    console.log('🎯 Expresión simplificada:', simplified)
    const isValid = BooleanEvaluator.sonEquivalentes(expression, simplified)
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



convertirImplicantesAExpresion(implicants, variables, form = 'SOP') {
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
const postOpt = this.optimizarPosterior(result)
if (postOpt !== result && this.esEquivalente(result, postOpt)) {
  console.log(`  📉 Post-optimizado SOP: ${result} → ${postOpt}`)

  result = postOpt
}
 else {
// Para POS, usar simplificación específica
const posOpt = this.simplificarPOSAlgebraico(result)
if (posOpt !== result && this.esEquivalente(result, posOpt)) {
  console.log(`  📉 Post-optimizado POS: ${result} → ${posOpt}`)
  result = posOpt
}
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

  
  aplicarAbsorcionMejorada(expr) {
    const terms = this.splitByTopLevelOperator(expr, '+').map(t => t.trim()).filter(t => t)
    if (terms.length < 2) return expr
  
    const toKeep = []
    const absorbed = new Set()
  
    // Ordenar por complejidad (términos más simples primero)
    const sorted = terms.map((t, idx) => ({
      term: t,
      idx,
      factors: t.split('·').map(f => f.trim()).filter(f => f),
      complexity: t.split('·').length
    })).sort((a, b) => a.complexity - b.complexity)
  
    for (let i = 0; i < sorted.length; i++) {
      if (absorbed.has(i)) continue
      
      const termI = sorted[i]
      
      for (let j = 0; j < sorted.length; j++) {
        if (i === j || absorbed.has(j)) continue
        
        const termJ = sorted[j]
        
        // Si todos los factores de I están en J, entonces I absorbe J
        // Ejemplo: A absorbe A·B·C
        if (termI.factors.every(f => termJ.factors.includes(f)) && 
            termI.factors.length < termJ.factors.length) {
          console.log(`    🧲 Absorción: "${termI.term}" absorbe "${termJ.term}"`)
          absorbed.add(j)
        }
      }
    }
  
    // Mantener solo los no absorbidos
    for (let i = 0; i < sorted.length; i++) {
      if (!absorbed.has(i)) {
        toKeep.push(sorted[i].term)
      }
    }
  
    return toKeep.length > 0 ? toKeep.join('+') : '0'
  }

  aplicarFactorizacion(expr) {
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


optimizarPosterior(expr) {
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
  if (result !== before && this.esEquivalente(before, result)) {
    console.log('    ✓ Leyes básicas:', result)
    changed = true
    continue
  }
   // PASO 2: Combinar términos complementarios (A·X + A'·X → X)
   result = this.applyComplementaryCombination(result)
   if (result !== before && this.esEquivalente(before, result)) {
     console.log('    ✓ Combinación complementaria:', result)
     changed = true
     continue
   }
  
  // PASO 3: Absorción ultra-agresiva (A + B·C donde A implica B·C)
  result = this.applyUltraAbsorption(result)
  if (result !== before && this.esEquivalente(before, result)) {
    console.log('    ✓ Absorción ultra:', result)
    changed = true
    continue
  }
  
 
  
  // PASO 4: Eliminar consenso (A·B + A·C + B·C → A·B + A·C)
  result = this.eliminateConsensusTerms(result)
  if (result !== before && this.esEquivalente(before, result)) {
    console.log('    ✓ Consenso eliminado:', result)
    changed = true
    continue
  }
  result = this.applyLogicalCoverage(result)
  if (result !== before) {
    if (this.esEquivalente(before, result)) {
      console.log('    ✓ Cobertura lógica:', result)
      changed = true
      continue
    } else {
      result = before
    }
  }
  
  // PASO 6: Factorización inversa (si reduce complejidad)
  result = this.tryReverseFactorization(result)
  if (result !== before && this.esEquivalente(before, result)) {
    console.log('    ✓ Factorización inversa:', result)
    changed = true
    continue
  }
  
  // PASO 7: Simplificación por dominancia (A + A·B·C = A)
  result = this.applyDominanceSimplification(result)
  if (result !== before && this.esEquivalente(before, result)) {
    console.log('    ✓ Dominancia:', result)
    changed = true
    continue
  }
  
  changed = false
}

console.log('✅ Post-optimización completada:', result)
return result
}


/**
 * ✅ NUEVO: Detecta si es forma POS
 */
esFormaPOS(expr) {
  // POS: (A+B)·(C+D)·...
  if (!expr.includes('(') || !expr.includes('·')) return false;

  const factors = this.splitByTopLevelOperator(expr, '·');
  
  return factors.every(factor => {
    // Cada factor debe ser (suma)
    const match = factor.match(/^\(([^)]+)\)$/);
    if (!match) return false;
    
    const inner = match[1];
    return inner.includes('+');
  });
}

/**
 * ✅ NUEVO: Detecta si es forma SOP
 */
esFormaSOP(expr) {
  // SOP: A·B + C·D + ...
  if (expr.includes('(') && expr.includes(')')) {
    return false;
  }

  const terms = this.splitByTopLevelOperator(expr, '+');
  
  return terms.every(term => {
    const factors = term.split('·').map(f => f.trim());
    return factors.every(f => /^[A-Z]'?$/.test(f));
  }); }
simplificarPOSAlgebraico(expr) {
  let result = expr
  let changed = true
  let iteration = 0
  const maxIterations = 30
  
  console.log('🔧 Simplificación algebraica POS:', expr)
  
  while (changed && iteration < maxIterations) {
    iteration++
    const before = result
    result = this.aplicarLeyesBasicasPOS(result)
    result = this.aplicarAbsorcionPOS(result)
    result = this.aplicarCombinacionComplementariaPOS(result)
    result = this.limpiarParentesis(result)
    changed = (before !== result)
    
    if (changed) {
      console.log(`  Iteración ${iteration}:`, result)
    }
  }
  
  return result
}

/**
 * ✅ Leyes básicas adaptadas para POS
 */
aplicarLeyesBasicasPOS(expr) {
  let result = expr
  
  // Identidad: (A+0) = A, (A·1) = A
  result = result.replace(/\(([A-Z]'?)\+0\)/g, '$1')
  result = result.replace(/\(0\+([A-Z]'?)\)/g, '$1')
  
  // Anulación: (A·0) = 0, (A+1) = 1
  if (result.includes('·0')) result = '0'
  result = result.replace(/\([^)]*\+1[^)]*\)/g, '1')
  
  // Idempotencia: (A+A) = A
  result = result.replace(/\(([A-Z]'?)\+\1\)/g, '$1')
  
  // Complemento: (A+A') = 1
  const factors = result.split('·').map(f => f.trim())
  const newFactors = factors.filter(factor => {
    const terms = factor.replace(/[()]/g, '').split('+').map(t => t.trim())
    
    for (let i = 0; i < terms.length; i++) {
      const base = terms[i].replace(/'/g, '')
      const complement = terms[i].endsWith("'") ? base : base + "'"
      
      if (terms.includes(complement)) {
        console.log(`  🔀 Complemento en POS: ${factor} = 1 (eliminado)`)
        return false
      }
    }
    return true
  })
  
  if (newFactors.length === 0) return '1'
  if (newFactors.length < factors.length) {
    result = newFactors.join('·')
  }
  
  return result
}

/**
 * ✅ Absorción en POS: (A+B)·(A+B+C) = (A+B)
 */
aplicarAbsorcionPOS(expr) {
  const factors = expr.split('·').map(f => f.trim())
  if (factors.length < 2) return expr
  
  const absorbed = new Set()
  
  for (let i = 0; i < factors.length; i++) {
    if (absorbed.has(i)) continue
    
    const termsI = factors[i].replace(/[()]/g, '').split('+').map(t => t.trim()).sort()
    
    for (let j = 0; j < factors.length; j++) {
      if (i === j || absorbed.has(j)) continue
      
      const termsJ = factors[j].replace(/[()]/g, '').split('+').map(t => t.trim()).sort()
      
      // Si todos los términos de I están en J, entonces J es absorbido
      if (termsI.every(t => termsJ.includes(t)) && termsI.length < termsJ.length) {
        console.log(`  🧲 Absorción POS: (${termsI.join('+')}) absorbe (${termsJ.join('+')})`)
        absorbed.add(j)
      }
    }
  }
  
  if (absorbed.size > 0) {
    const remaining = factors.filter((_, idx) => !absorbed.has(idx))
    return remaining.length > 0 ? remaining.join('·') : '1'
  }
  
  return expr
}

/**
 * ✅ Combinación complementaria en POS: (A+B)·(A'+B) = B
 */
aplicarCombinacionComplementariaPOS(expr) {
  const factors = expr.split('·').map(f => f.trim())
  if (factors.length < 2) return expr
  
  const processed = new Set()
  const toAdd = []
  
  for (let i = 0; i < factors.length; i++) {
    if (processed.has(i)) continue
    
    const termsI = factors[i].replace(/[()]/g, '').split('+').map(t => t.trim())
    
    for (let j = i + 1; j < factors.length; j++) {
      if (processed.has(j)) continue
      
      const termsJ = factors[j].replace(/[()]/g, '').split('+').map(t => t.trim())
      
      // Buscar una variable complementaria
      if (termsI.length === termsJ.length) {
        let diffVar = null
        const common = []
        
        for (const ti of termsI) {
          if (termsJ.includes(ti)) {
            common.push(ti)
          } else {
            const base = ti.replace(/'/g, '')
            const complement = ti.endsWith("'") ? base : base + "'"
            
            if (termsJ.includes(complement) && diffVar === null) {
              diffVar = base
            }
          }
        }
        
        // Si solo difieren en una variable: (A+B)·(A'+B) = B
        if (diffVar && common.length === termsI.length - 1) {
          const result = common.length > 0 ? `(${common.join('+')})` : '1'
          console.log(`  🔀 Combinación POS: ${factors[i]}·${factors[j]} = ${result}`)
          
          processed.add(i)
          processed.add(j)
          toAdd.push(result)
          break
        }
      }
    }
  }
  
  if (processed.size > 0) {
    const remaining = factors.filter((_, idx) => !processed.has(idx))
    const newFactors = [...remaining, ...toAdd]
    return newFactors.length > 0 ? newFactors.join('·') : '1'
  }
  
  return expr
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
  let result = expr
  let madeChange = true
  let iterations = 0

  while (madeChange && iterations < 15) {
    iterations++
    madeChange = false
    const currentTerms = this.splitByTopLevelOperator(result, '+').map(t => t.trim())
    const processed = new Set()
    const toAdd = []
    
    for (let i = 0; i < currentTerms.length; i++) {
      if (processed.has(i)) continue
      
      const factors1 = currentTerms[i].split('·').map(f => f.trim()).filter(f => f)
      
      for (let j = i + 1; j < currentTerms.length; j++) {
        if (processed.has(j)) continue
        
        const factors2 = currentTerms[j].split('·').map(f => f.trim()).filter(f => f)
        
        // Caso 1: Misma longitud → buscar UNA variable complementaria
        if (factors1.length === factors2.length) {
          let diffVars = []
          const common = []
          
          for (const f1 of factors1) {
            if (factors2.includes(f1)) {
              common.push(f1)
            } else {
              const base1 = f1.replace(/'/g, '')
              const complement1 = f1.endsWith("'") ? base1 : base1 + "'"
              
              if (factors2.includes(complement1)) {
                diffVars.push(base1)
              }
            }
          }
          
          // Exactamente UNA variable diferente: A·X + A'·X → X
          if (diffVars.length === 1 && common.length === factors1.length - 1) {
            const replacement = common.length > 0 ? common.join('·') : '1'
            console.log(`    🔀 Combinación: "${currentTerms[i]}" + "${currentTerms[j]}" → "${replacement}"`)
            
            processed.add(i)
            processed.add(j)
            
            if (!toAdd.includes(replacement)) {
              toAdd.push(replacement)
              madeChange = true
            }
            break
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
let bestComplexity = this.contarOperadores(expr)

while ((match = factorPattern.exec(expr)) !== null) {
  const factor = match[1]
  const sum = match[2]
  
  // Expandir
  const terms = this.splitByTopLevelOperator(sum, '+')
  const expanded = terms.map(t => `${factor}·${t.trim()}`).join('+')
  
  const testExpr = expr.replace(match[0], expanded)
  
  // Simplificar la versión expandida
  const simplified = this.applyBasicLaws(testExpr)
  const testComplexity = this.contarOperadores(simplified)
  
  if (testComplexity < bestComplexity && this.esEquivalente(expr, simplified)) {
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



contarOperadores(expr) {
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

  // ============================================================================
  // Leyes Básicas
  // ============================================================================
  aplicarLeyesBasicas(expr) {
    let result = expr;
    let changed = true;
    let iterations = 0;
    const maxIterations = 30;
    console.log('⚖️ Aplicando leyes básicas (estricto):', expr);
    while (changed && iterations < maxIterations) {
      iterations++;
      const before = result;
      // 1. Doble negación: A'' → A
      result = result.replace(/([A-Z])(''+)/g, (match, base, primes) => {
        const count = primes.length;
        return count % 2 === 0 ? base : base + "'";
      });
      // 2. Eliminar productos con complementos: A·A' = 0
      const productTerms = result.split('+').map(term => {
        const factors = term.split('·').map(f => f.trim()).filter(f => f);
        
        if (this.hasComplementaryFactors(factors)) {
          console.log(`    ❌ Complemento en producto: ${term} = 0`);
          return '0';
        }
        
        return term;
      }).filter(t => t !== '0');
      result = productTerms.length > 0 ? productTerms.join('+') : '0';
      // 3. Idempotencia en productos: A·A·B → A·B
      result = result.split('+').map(term => {
        const factors = term.split('·').map(f => f.trim()).filter(f => f);
        const uniqueFactors = [];
        const seen = new Map();
        
        for (const factor of factors) {
          const base = this.getBaseLiteral(factor);
          
          if (!seen.has(base)) {
            seen.set(base, factor);
            uniqueFactors.push(factor);
          } else {
            // Verificar si es el mismo literal
            if (seen.get(base) !== factor) {
              // Es complemento: producto = 0
              return '0';
            }
            // Es duplicado: ya está en uniqueFactors
          }
        }
        
        return uniqueFactors.join('·') || '1';
      }).filter(t => t !== '0').join('+');
      if (result === '') result = '0';
      // 4. Complemento en sumas: A + A' = 1
      const sumTerms = result.split('+').map(t => t.trim()).filter(t => t);
      const simpleLiterals = new Map();
      
      for (const term of sumTerms) {
        // Solo para literales simples (sin ·)
        if (!term.includes('·') && term !== '0' && term !== '1') {
          const base = this.getBaseLiteral(term);
          const isNeg = this.isNegated(term);
          
          if (!simpleLiterals.has(base)) {
            simpleLiterals.set(base, { pos: false, neg: false });
          }
          
          if (isNeg) {
            simpleLiterals.get(base).neg = true;
          } else {
            simpleLiterals.get(base).pos = true;
          }
        }
      }
      
      for (const [base, flags] of simpleLiterals.entries()) {
        if (flags.pos && flags.neg) {
          console.log(`    ✅ Complemento en suma: ${base} + ${base}' = 1`);
          result = '1';
          break;
        }
      }
      if (result === '1') break;
      // 5. Dominancia: A + 1 = 1
      if (sumTerms.includes('1')) {
        result = '1';
        break;
      }
      // 6. Identidad: A·1 = A, A+0 = A
      result = result.replace(/([A-Z]'?(?:·[A-Z]'?)*)·1/g, '$1');
      result = result.replace(/1·([A-Z]'?(?:·[A-Z]'?)*)/g, '$1');
      result = result.split('+').filter(t => t !== '0' && t !== '').join('+');
      
      if (result === '') result = '0';
      // 7. Idempotencia en sumas: A + A = A
      const uniqueTerms = [...new Set(result.split('+').map(t => t.trim()).filter(t => t))];
      result = uniqueTerms.join('+');
      changed = (before !== result);
    }
    console.log('✅ Leyes básicas aplicadas:', result);
    return result;
  }

  // ============================================================================
  // Combinación Complementaria
  // ============================================================================
  aplicarCombinacionComplementaria(expr) {
    let result = expr;
    let madeChange = true;
    let iterations = 0;
    console.log('🔀 Aplicando combinación complementaria:', expr);
    while (madeChange && iterations < 20) {
      iterations++;
      madeChange = false;
      
      const currentTerms = this.splitByTopLevelOperator(result, '+').map(t => t.trim()).filter(t => t);
      const processed = new Set();
      const toAdd = [];
      
      for (let i = 0; i < currentTerms.length; i++) {
        if (processed.has(i)) continue;
        
        const factors1 = currentTerms[i].split('·').map(f => f.trim()).filter(f => f);
        
        for (let j = i + 1; j < currentTerms.length; j++) {
          if (processed.has(j)) continue;
          
          const factors2 = currentTerms[j].split('·').map(f => f.trim()).filter(f => f);
          
          // Deben tener la misma longitud
          if (factors1.length !== factors2.length) continue;
          
          // Buscar exactamente UNA diferencia complementaria
          let diffBase = null;
          const common = [];
          let diffCount = 0;
          
          const bases1 = factors1.map(f => ({ lit: f, base: this.getBaseLiteral(f), neg: this.isNegated(f) }));
          const bases2 = factors2.map(f => ({ lit: f, base: this.getBaseLiteral(f), neg: this.isNegated(f) }));
          
          for (const b1 of bases1) {
            const match = bases2.find(b2 => b2.base === b1.base);
            
            if (!match) {
              // No está en factors2
              break;
            }
            
            if (b1.lit === match.lit) {
              // Mismo literal
              common.push(b1.lit);
            } else if (b1.neg !== match.neg) {
              // Complementarios
              diffBase = b1.base;
              diffCount++;
            }
          }
          
          // Solo una diferencia: A·X + A'·X → X
          if (diffCount === 1 && common.length === factors1.length - 1) {
            const replacement = common.length > 0 ? common.join('·') : '1';
            
            console.log(`    🔀 ${currentTerms[i]} + ${currentTerms[j]} = ${replacement}`);
            
            processed.add(i);
            processed.add(j);
            
            if (!toAdd.includes(replacement)) {
              toAdd.push(replacement);
              madeChange = true;
            }
            break;
          }
        }
      }
      
      if (processed.size > 0) {
        const remaining = currentTerms.filter((_, idx) => !processed.has(idx));
        const newTerms = [...remaining, ...toAdd];
        result = newTerms.length > 0 ? newTerms.join('+') : '0';
      } else {
        break;
      }
    }
    console.log('✅ Combinación complementaria completada:', result);
    return result;
  }

  // ============================================================================
  // Absorción
  // ============================================================================
  aplicarAbsorcion(expr) {
    const terms = this.splitByTopLevelOperator(expr, '+').map(t => t.trim()).filter(t => t);
    if (terms.length < 2) return expr;
    console.log('🧲 Aplicando absorción:', expr);
    const absorbed = new Set();
    
    // Ordenar por número de factores (más simple primero)
    const sorted = terms.map((t, idx) => ({
      term: t,
      idx,
      factors: t.split('·').map(f => f.trim()).filter(f => f),
      complexity: t.split('·').length
    })).sort((a, b) => a.complexity - b.complexity);
    for (let i = 0; i < sorted.length; i++) {
      if (absorbed.has(sorted[i].idx)) continue;
      
      const termI = sorted[i];
      
      for (let j = 0; j < sorted.length; j++) {
        if (i === j || absorbed.has(sorted[j].idx)) continue;
        
        const termJ = sorted[j];
        
        // I absorbe J si todos los factores de I están en J
        if (termI.complexity < termJ.complexity) {
          const allInJ = termI.factors.every(fI => 
            termJ.factors.some(fJ => fJ === fI)
          );
          
          if (allInJ) {
            console.log(`    🧲 ${termI.term} absorbe ${termJ.term}`);
            absorbed.add(sorted[j].idx);
          }
        }
      }
    }
    if (absorbed.size > 0) {
      const remaining = terms.filter((_, idx) => !absorbed.has(idx));
      const result = remaining.length > 0 ? remaining.join('+') : '0';
      console.log('✅ Absorción completada:', result);
      return result;
    }
    return expr;
  }

 applyBasicLaws(expr) {
  let result = expr
  let changed = true
  let iterations = 0
  
  while (changed && iterations < 25) {
    const before = result
    iterations++
    
    // 1. Doble negación: A'' → A
    result = result.replace(/([A-Z])''/g, '$1')
    
    // 2. ✅ MEJORADO: Complemento en productos: A·A' = 0
    const productTerms = result.split('+').map(term => {
      const factors = term.split('·').map(f => f.trim()).filter(f => f)
      const bases = new Map() // base → {pos: count, neg: count}
      
      for (const factor of factors) {
        const base = factor.replace(/'/g, '')
        const isNegated = factor.includes("'")
        
        if (!bases.has(base)) {
          bases.set(base, { pos: 0, neg: 0 })
        }
        
        if (isNegated) {
          bases.get(base).neg++
        } else {
          bases.get(base).pos++
        }
      }
      
      // Si hay complementos (A y A' en el mismo producto), el término es 0
      for (const [base, counts] of bases.entries()) {
        if (counts.pos > 0 && counts.neg > 0) {
          console.log(`    ⚠️ Complemento: ${base}·${base}' = 0 en "${term}"`)
          return '0'
        }
      }
      
      return term
    })
    
    result = productTerms.filter(t => t !== '0').join('+')
    if (result === '' || result === '0') result = '0'
    
    // 3. Idempotencia en productos: A·A·B → A·B
    result = result.split('+').map(term => {
      const factors = term.split('·').map(f => f.trim()).filter(f => f)
      const unique = [...new Set(factors)]
      return unique.join('·')
    }).join('+')
    
    // 4. Anulación: A·0 = 0
    if (result.includes('·0') || result.includes('0·')) {
      result = result.split('+')
        .filter(t => !t.includes('·0') && !t.includes('0·') && t !== '0')
        .join('+')
      if (result === '') result = '0'
    }
    
    // 5. Dominancia: A+1 = 1
    if (result === '1' || result.includes('+1') || result.includes('1+')) {
      result = '1'
      break
    }
    
    // 6. Identidad: A·1 = A, A+0 = A
    result = result.replace(/([A-Z]'?(?:·[A-Z]'?)*)·1/g, '$1')
    result = result.replace(/1·([A-Z]'?(?:·[A-Z]'?)*)/g, '$1')
    result = result.split('+').filter(t => t !== '0' && t !== '').join('+')
    if (result === '') result = '0'
    
    // 7. Idempotencia en sumas: A+A = A
    const uniqueTerms = [...new Set(result.split('+').map(t => t.trim()).filter(t => t))]
    result = uniqueTerms.join('+')
    
    // 8. ✅ MEJORADO: Complemento en sumas: A+A' = 1
    const sumTerms = result.split('+').map(t => t.trim()).filter(t => t)
    const sumBases = new Map()
    
    for (const term of sumTerms) {
      // Solo para términos simples (una variable)
      if (!term.includes('·') && !term.includes('+')) {
        const base = term.replace(/'/g, '')
        const isNeg = term.includes("'")
        
        if (!sumBases.has(base)) {
          sumBases.set(base, { pos: false, neg: false })
        }
        
        if (isNeg) {
          sumBases.get(base).neg = true
        } else {
          sumBases.get(base).pos = true
        }
      }
    }
    
    for (const [base, flags] of sumBases.entries()) {
      if (flags.pos && flags.neg) {
        console.log(`    ✅ Complemento en suma: ${base}+${base}' = 1`)
        result = '1'
        break
      }
    }
    
    if (result === '1') break
    
    // 9. ✅ MEJORADO: Absorción directa: A + A·B = A
    const allTerms = result.split('+').map(t => t.trim()).filter(t => t)
    const toRemove = new Set()
    
    for (let i = 0; i < allTerms.length; i++) {
      const termI = allTerms[i]
      const factorsI = termI.split('·').map(f => f.trim())
      
      for (let j = 0; j < allTerms.length; j++) {
        if (i === j) continue
        
        const termJ = allTerms[j]
        const factorsJ = termJ.split('·').map(f => f.trim())
        
        // Si I es subconjunto de J (más simple), I absorbe J
        if (factorsI.length < factorsJ.length &&
            factorsI.every(f => factorsJ.includes(f))) {
          console.log(`    🧲 Absorción: ${termI} + ${termJ} = ${termI}`)
          toRemove.add(j)
        }
      }
    }
    
    if (toRemove.size > 0) {
      const remaining = allTerms.filter((_, idx) => !toRemove.has(idx))
      result = remaining.join('+')
    }
    
    // 10. ✅ MEJORADO: Combinación complementaria: A·B + A·B' = A
    const terms = result.split('+').map(t => t.trim()).filter(t => t)
    const combined = []
    const used = new Set()
    
    for (let i = 0; i < terms.length; i++) {
      if (used.has(i)) continue
      
      const factorsI = terms[i].split('·').map(f => f.trim())
      let foundPair = false
      
      for (let j = i + 1; j < terms.length; j++) {
        if (used.has(j)) continue
        
        const factorsJ = terms[j].split('·').map(f => f.trim())
        
        // Deben tener la misma longitud
        if (factorsI.length !== factorsJ.length) continue
        
        // Buscar exactamente UNA diferencia complementaria
        let diffVar = null
        let diffCount = 0
        const common = []
        
        for (const fi of factorsI) {
          if (factorsJ.includes(fi)) {
            common.push(fi)
          } else {
            const base = fi.replace(/'/g, '')
            const complement = fi.endsWith("'") ? base : base + "'"
            
            if (factorsJ.includes(complement)) {
              diffVar = base
              diffCount++
            }
          }
        }
        
        // Solo una diferencia: A·X + A'·X → X
        if (diffCount === 1 && common.length === factorsI.length - 1) {
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
      result = combined.length > 0 ? combined.join('+') : '0'
    }
    
    changed = (before !== result)
  }
  
  if (result === '') result = '0'
  result = result.replace(/^\++|\++$/g, '')
  
  return result
}

limpiarParentesis(expr) {
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

convertirSOPaPOSFormal(sopExpr, variables) {
  try {
    console.log('🔄 Convirtiendo SOP a POS formal:', sopExpr);
    
    // Generar tabla de verdad
    const truthTableData = BooleanEvaluator.generarTablaVerdad(sopExpr);
    const { table } = truthTableData;
    
    // Extraer maxterms (donde result = 0)
    const maxterms = table
      .filter(row => row.result === false || row.result === 0)
      .map(row => row.index);
    
    console.log('📊 Maxterms:', maxterms);
    
    if (maxterms.length === 0) return '1';
    if (maxterms.length === Math.pow(2, variables.length)) return '0';
    
    // Aplicar Quine-McCluskey
    const qm = new QuineMcCluskeyMinimizer();
    const primeImplicants = qm.minimizar(maxterms, [], variables.length);
    
    console.log('✅ Implicantes primos (POS):', primeImplicants);
    
    const posExpr = this.convertirImplicantesAExpresion(primeImplicants, variables, 'POS');
    
    console.log('✅ POS generada:', posExpr);
    
    return posExpr;
    
  } catch (error) {
    console.error('❌ Error convirtiendo SOP a POS:', error);
    return null;
  }
}


convertirPOSaSOPFormal(posExpr, variables) {
  try {
    console.log('🔄 Convirtiendo POS a SOP formal:', posExpr);
    
    // Generar tabla de verdad
    const truthTableData = BooleanEvaluator.generarTablaVerdad(posExpr);
    const { table } = truthTableData;
    
    // Extraer minterms (donde result = 1)
    const minterms = table
      .filter(row => row.result === true || row.result === 1)
      .map(row => row.index);
    
    console.log('📊 Minterms:', minterms);
    
    if (minterms.length === 0) return '0';
    if (minterms.length === Math.pow(2, variables.length)) return '1';
    
    // Aplicar Quine-McCluskey
    const qm = new QuineMcCluskeyMinimizer();
    const primeImplicants = qm.minimizar(minterms, [], variables.length);
    
    console.log('✅ Implicantes primos (SOP):', primeImplicants);
    
    const sopExpr = this.convertirImplicantesAExpresion(primeImplicants, variables, 'SOP');
    
    console.log('✅ SOP generada:', sopExpr);
    
    return sopExpr;
    
  } catch (error) {
    console.error('❌ Error convirtiendo POS a SOP:', error);
    return null;
  }
}  


  // ============================================================================
  // Simplificación Principal
  // ============================================================================
  simplify(expression, options = {}) {
    const {
      maxSteps = 100,
      showAllSteps = true,
      targetForm = 'SOP',
      useFormalMethod = true
    } = options;
    console.log('🚀 Iniciando simplificación:', { expression, targetForm });
    this.steps = [];
    let current = this.normalize(expression);
    const originalExpression = current;
    const variables = BooleanEvaluator.extraerVariables(expression);
    this.addStepWithValidation(current, current, 'normalization', 'Normalización', 'Expresión normalizada', originalExpression);
    // FASE 1: Expansión completa (si hay paréntesis)
    if (current.includes('(') && current.includes(')')) {
      console.log('📐 FASE 1: Expansión completa');
      
      const expanded = this.aplicarDistributiva(current);
      
      if (expanded !== current && this.esEquivalente(originalExpression, expanded)) {
        this.addStepWithValidation(current, expanded, 'distributive', 'Expansión Distributiva', 'Expandir todos los productos', originalExpression);
        current = expanded;
      }
    }
    // FASE 2: Aplicar leyes básicas (eliminar productos imposibles)
    console.log('⚖️ FASE 2: Leyes básicas');
    
    const afterBasic = this.aplicarLeyesBasicas(current);
    
    if (afterBasic !== current && this.esEquivalente(originalExpression, afterBasic)) {
      this.addStepWithValidation(current, afterBasic, 'basic', 'Leyes Básicas', 'Eliminar complementos y simplificar', originalExpression);
      current = afterBasic;
    }
    // FASE 3: Combinación complementaria (A·X + A'·X = X)
    console.log('🔀 FASE 3: Combinación complementaria');
    
    let previousComb = '';
    let combIterations = 0;
    
    while (current !== previousComb && combIterations < 15) {
      previousComb = current;
      combIterations++;
      
      const afterComb = this.aplicarCombinacionComplementaria(current);
      
      if (afterComb !== current && this.esEquivalente(originalExpression, afterComb)) {
        this.addStepWithValidation(current, afterComb, 'complementary', 'Combinación Complementaria', `A·X + A'·X = X (iteración ${combIterations})`, originalExpression);
        current = afterComb;
        
        // Aplicar leyes básicas después de cada combinación
        const afterBasic2 = this.aplicarLeyesBasicas(current);
        if (afterBasic2 !== current && this.esEquivalente(originalExpression, afterBasic2)) {
          current = afterBasic2;
        }
      } else {
        break;
      }
    }
    // FASE 4: Absorción (A + A·B = A)
    console.log('🧲 FASE 4: Absorción');
    
    let previousAbs = '';
    let absIterations = 0;
    
    while (current !== previousAbs && absIterations < 10) {
      previousAbs = current;
      absIterations++;
      
      const afterAbs = this.aplicarAbsorcion(current);
      
      if (afterAbs !== current && this.esEquivalente(originalExpression, afterAbs)) {
        this.addStepWithValidation(current, afterAbs, 'absorption', 'Absorción', `A + A·B = A (iteración ${absIterations})`, originalExpression);
        current = afterAbs;
      } else {
        break;
      }
    }
    // FASE 5: Método formal (si es necesario y posible)
    if (useFormalMethod && variables.length >= 2 && variables.length <= 5) {
      console.log('🔬 FASE 5: Método formal (Quine-McCluskey)');
      
      const formalResult = this.simplificarPorTablaVerdad(originalExpression, variables, targetForm);
      
      if (formalResult && formalResult.expression) {
        const formalExpr = formalResult.expression;
        const currentComplexity = this.contarOperadores(current);
        const formalComplexity = this.contarOperadores(formalExpr);
        
        // Usar resultado formal si es mejor
        if (formalComplexity <= currentComplexity && 
            this.esEquivalente(originalExpression, formalExpr)) {
          
          console.log('✅ Método formal dio mejor o igual resultado');
          this.addStepWithValidation(current, formalExpr, 'quine_mccluskey', 'Quine-McCluskey', 'Minimización formal por tabla de verdad', originalExpression);
          current = formalExpr;
        }
      }
    }
    // FASE 6: Conversión a forma objetivo (si es necesario)
      if (targetForm === 'POS' && !this.esFormaPOS(current)) {
      console.log('🔄 FASE 6: Conversión a POS');
      
      const posResult = this.convertirSOPaPOSFormal(current, variables);
      
      if (posResult && this.esEquivalente(originalExpression, posResult)) {
        this.addStepWithValidation(current, posResult, 'pos_conversion', 'Conversión a POS', 'Usando tabla de verdad', originalExpression);
        current = posResult;
      }
    } else if (targetForm === 'SOP' && !this.esFormaSOP(current)) {
      console.log('🔄 FASE 6: Conversión a SOP');
      
      const sopResult = this.convertirPOSaSOPFormal(current, variables);
      
      if (sopResult && this.esEquivalente(originalExpression, sopResult)) {
        this.addStepWithValidation(current, sopResult, 'sop_conversion', 'Conversión a SOP', 'Usando tabla de verdad', originalExpression);
        current = sopResult;
      }
    }
    // Validación final
    const finalEquivalence = BooleanEvaluator.sonEquivalentes(originalExpression, current);
    
    if (!finalEquivalence.equivalent) {
      console.error('❌ ERROR: La expresión final NO es equivalente a la original');
      console.error('   Original:', originalExpression);
      console.error('   Final:', current);
      console.error('   Contraejemplo:', finalEquivalence.counterExample);
      
      // Revertir a la original
      current = originalExpression;
    }
    console.log('✅ Simplificación completada:', current);
    return {
      success: finalEquivalence.equivalent,
      originalExpression,
      simplifiedExpression: current,
      steps: this.steps,
      totalSteps: this.steps.length,
      complexity: this.calculateComplexity(originalExpression, current),
      equivalent: finalEquivalence,
      method: this.steps.some(s => s.theorem === 'quine_mccluskey') ? 'formal' : 'algebraic',
      targetForm: targetForm
    };
  }

  esEquivalente(expr1, expr2) {
    const result = BooleanEvaluator.sonEquivalentes(expr1, expr2)
    return result.equivalent
  }

 

  /**
   * Agrega un paso con validación
   */
  addStep(from, to, theorem, law, explanation) {
    const equivalence = BooleanEvaluator.sonEquivalentes(from, to)
    
    this.steps.push({
      from,
      to,
      theorem,
      law,
      explanation,
      equivalence
    })
  }

  // ============================================================================
  // Agregar Paso con Validación
  // ============================================================================
  addStepWithValidation(from, to, theorem, law, explanation, original) {
    // Validar que el paso mantiene equivalencia con la expresión original
    const equivalence = BooleanEvaluator.sonEquivalentes(original, to);
    
    if (!equivalence.equivalent) {
      console.warn(`⚠️ PASO NO VÁLIDO: ${law}`);
      console.warn(`   De: ${from}`);
      console.warn(`   A: ${to}`);
      console.warn(`   Contraejemplo:`, equivalence.counterExample);
      return false; // No agregar el paso
    }
    
    this.steps.push({
      from,
      to,
      theorem,
      law,
      explanation,
      equivalence
    });
    
    return true;
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
