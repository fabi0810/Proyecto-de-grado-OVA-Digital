import { evaluateCircuitGraph } from './evaluateCircuitGraph'

/**
 * ✅ CORREGIDO: Evita duplicados por label
 * Agrupa nodos por su etiqueta única (A, B, C, etc.)
 */
/**
 * ✅ CORREGIDO: Evita duplicados por label
 * Agrupa nodos por su etiqueta única (A, B, C, etc.)
 */
function getInputNodesOrdered(nodes = []) {
  const inputNodes = nodes.filter(n => n?.type === 'input' || n?.type === 'constant');
  
  // ← NUEVO: Usar Map para mantener solo UNA entrada por label
  const uniqueInputs = new Map();
  
  inputNodes.forEach(node => {
    const label = (node?.data?.label ?? node?.id ?? '').toString();
    
    // Solo guardar la primera ocurrencia de cada label
    if (!uniqueInputs.has(label)) {
      uniqueInputs.set(label, node);
    }
  });
  
  // Retornar valores ordenados alfabéticamente
  return [...uniqueInputs.values()].sort((a, b) => {
    const la = (a?.data?.label ?? a?.id ?? '').toString();
    const lb = (b?.data?.label ?? b?.id ?? '').toString();
    return la.localeCompare(lb);
  });
}

function getOutputNodesOrdered(nodes = []) {
  const outNodes = nodes.filter(n => n?.type === 'output');
  return [...outNodes].sort((a, b) => {
    const la = (a?.data?.label ?? a?.id ?? '').toString();
    const lb = (b?.data?.label ?? b?.id ?? '').toString();
    return la.localeCompare(lb);
  });
}

export function generateTruthTable(nodes = [], edges = [], maxInputs = 6) {
  const inputs = getInputNodesOrdered(nodes);
  const inputCount = inputs.length;

  if (inputCount === 0) {
    return { warning: 'No hay entradas en el circuito.', inputNames: [], rows: [], outputs: [] };
  }

  const inputNames = inputs.map(n => (n?.data?.label ?? n?.id ?? '').toString());
  const outputs = getOutputNodesOrdered(nodes).map(n => (n?.data?.label ?? n?.id ?? '').toString());

  if (inputCount > maxInputs) {
    return {
      warning: `Demasiadas entradas (${inputCount}) para evaluación exhaustiva (límite ${maxInputs}).`,
      inputNames,
      rows: [],
      outputs,
    };
  }

  const total = 1 << inputCount;
  const rows = [];

  for (let mask = 0; mask < total; mask++) {
    const inputOverrides = {};
    
    // ← MEJORADO: Buscar TODOS los nodos con el mismo label
    for (let i = 0; i < inputCount; i++) {
      const bit = (mask >> (inputCount - 1 - i)) & 1;
      const currentLabel = inputNames[i];
      
      // Aplicar el mismo valor a TODOS los nodos con este label
      nodes.forEach(node => {
        if ((node.type === 'input' || node.type === 'constant') && 
            (node?.data?.label ?? node?.id ?? '').toString() === currentLabel) {
          inputOverrides[node.id] = bit ? 1 : 0;
        }
      });
    }

    const evalResult = evaluateCircuitGraph(nodes, edges, { inputOverrides });
    if (evalResult.hasCycle) {
      return {
        error: 'Ciclo detectado',
        inputNames,
        rows: [],
        outputs,
      };
    }

    const assignment = {};
    for (let i = 0; i < inputCount; i++) {
      assignment[inputNames[i]] = inputOverrides[inputs[i].id];
    }

    const outAssignment = {};
    for (const outName of outputs) {
      outAssignment[outName] = evalResult.outputs[outName] ?? 0;
    }

    rows.push({ inputs: assignment, outputs: outAssignment });
  }

  return { inputNames, outputs, rows };
}

// REEMPLAZAR esta función completa
export function sopFromMinterms(minterms = [], inputNames = []) {
  if (!minterms.length) return '0';
  if (minterms.length === (1 << inputNames.length)) return '1';

  const terms = minterms.map(idx => {
    const literals = [];
    const seen = new Set(); // ← NUEVO: Evitar duplicados
    
    for (let i = 0; i < inputNames.length; i++) {
      const bit = (idx >> (inputNames.length - 1 - i)) & 1;
      const name = inputNames[i];
      
      // ← NUEVO: Solo agregar si no se ha visto antes
      if (!seen.has(name)) {
        literals.push(bit ? name : `${name}'`);
        seen.add(name);
      }
    }
    
    // ← NUEVO: Eliminar duplicados en el término
    const uniqueLiterals = [...new Set(literals)];
    return uniqueLiterals.join('·');
  });

  // ← NUEVO: Eliminar términos duplicados
  const uniqueTerms = [...new Set(terms)];
  return uniqueTerms.join(' + ');
}

export function expressionFromCircuit(nodes = [], edges = [], maxInputs = 6) {
  const t = generateTruthTable(nodes, edges, maxInputs);
  if (t.error) return { error: t.error };
  if (t.warning && !t.rows.length) {
    return { warning: t.warning, expressions: {} };
  }

  const { rows, inputNames, outputs } = t;
  const expressions = {};
  for (const outName of outputs) {
    const minterms = [];
    for (let idx = 0; idx < rows.length; idx++) {
      if ((rows[idx].outputs[outName] ?? 0) === 1) {
        minterms.push(idx);
      }
    }
    expressions[outName] = sopFromMinterms(minterms, inputNames);
  }

  return { inputNames, outputs, expressions };
}
// Agregar al archivo src/utils/booleanTools.js

/**
 * Genera expresión POS (Producto de Sumas) desde maxterms
 */
/**
 * ✅ CORREGIDO: Genera expresión POS sin duplicados
 */
export function posFromMaxterms(maxterms = [], inputNames = []) {
  if (!maxterms.length) return '1';
  if (maxterms.length === (1 << inputNames.length)) return '0';

  const terms = maxterms.map(idx => {
    const literals = [];
    const seen = new Set(); // ← NUEVO: Evitar duplicados
    
    for (let i = 0; i < inputNames.length; i++) {
      const bit = (idx >> (inputNames.length - 1 - i)) & 1;
      const name = inputNames[i];
      
      // ← NUEVO: Solo agregar si no se ha visto antes
      if (!seen.has(name)) {
        // En POS: bit=0 → variable sin negar, bit=1 → variable negada
        literals.push(bit ? `${name}'` : name);
        seen.add(name);
      }
    }
    
    // ← NUEVO: Eliminar duplicados en el término
    const uniqueLiterals = [...new Set(literals)];
    return uniqueLiterals.length > 0 ? `(${uniqueLiterals.join(' + ')})` : '(1)';
  });

  // ← NUEVO: Eliminar términos duplicados
  const uniqueTerms = [...new Set(terms)];
  return uniqueTerms.join('·');
}
/**
 * Genera expresiones SOP y POS desde el circuito
 */
export function expressionsComplete(nodes = [], edges = [], maxInputs = 6) {
  const t = generateTruthTable(nodes, edges, maxInputs);
  if (t.error) return { error: t.error };
  if (t.warning && !t.rows.length) {
    return { warning: t.warning, expressions: {} };
  }

  const { rows, inputNames, outputs } = t;
  const expressions = {};
  
  for (const outName of outputs) {
    const minterms = [];
    const maxterms = [];
    
    for (let idx = 0; idx < rows.length; idx++) {
      if ((rows[idx].outputs[outName] ?? 0) === 1) {
        minterms.push(idx);
      } else {
        maxterms.push(idx);
      }
    }
    
    expressions[outName] = {
      sop: sopFromMinterms(minterms, inputNames),
      pos: posFromMaxterms(maxterms, inputNames),
      minterms,
      maxterms
    };
  }

  return { inputNames, outputs, expressions };
}

function countOnes(n) {
  let c = 0;
  while (n) { c += n & 1; n >>= 1; }
  return c;
}

function toBits(n, numVars) {
  const bits = new Array(numVars).fill(0);
  for (let i = 0; i < numVars; i++) {
    const bit = (n >> (numVars - 1 - i)) & 1;
    bits[i] = bit;
  }
  return bits;
}

function combineTerms(aBits, bBits) {
  let diffs = 0;
  const res = [];
  for (let i = 0; i < aBits.length; i++) {
    if (aBits[i] === bBits[i]) {
      res.push(aBits[i]);
    } else {
      diffs++;
      res.push(-1);
    }
    if (diffs > 1) return null;
  }
  return res;
}

function sameBits(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function covers(bits, minterm, numVars) {
  for (let i = 0; i < numVars; i++) {
    const bit = (minterm >> (numVars - 1 - i)) & 1;
    if (bits[i] === -1) continue;
    if (bits[i] !== bit) return false;
  }
  return true;
}

export function quineMcCluskey(minterms = [], dontCares = [], numVars = 0) {
  if (minterms.length === 0) return [];
  const all = [...minterms, ...dontCares];
  const groups = new Map();
  for (const m of all) {
    const ones = countOnes(m);
    if (!groups.has(ones)) groups.set(ones, []);
    groups.get(ones).push({ value: m, bits: toBits(m, numVars), used: false });
  }

  let primeImplicants = [];
  let currentGroups = groups;

  while (true) {
    const nextGroups = new Map();
    const keys = [...currentGroups.keys()].sort((a, b) => a - b);
    let anyMerged = false;

    for (let i = 0; i < keys.length - 1; i++) {
      const g1 = currentGroups.get(keys[i]) || [];
      const g2 = currentGroups.get(keys[i + 1]) || [];
      for (const a of g1) {
        for (const b of g2) {
          const combined = combineTerms(a.bits, b.bits);
          if (combined) {
            anyMerged = true;
            a.used = true;
            b.used = true;
            const key = combined.filter(x => x === 1).length;
            const termKey = combined.join('');
            if (!nextGroups.has(key)) nextGroups.set(key, []);
            if (!nextGroups.get(key).some(t => t.bits.join('') === termKey)) {
              nextGroups.get(key).push({ value: null, bits: combined, used: false });
            }
          }
        }
      }
    }

    for (const g of currentGroups.values()) {
      for (const t of g) {
        if (!t.used) {
          if (!primeImplicants.some(pi => sameBits(pi.bits, t.bits))) {
            primeImplicants.push({ bits: t.bits });
          }
        }
      }
    }

    if (!anyMerged) break;
    currentGroups = nextGroups;
  }

  const chart = new Map();
  for (const m of minterms) {
    chart.set(m, []);
    for (const pi of primeImplicants) {
      if (covers(pi.bits, m, numVars)) {
        chart.get(m).push(pi);
      }
    }
  }

  const selected = [];
  const covered = new Set();
  for (const [m, pis] of chart) {
    if (pis.length === 1) {
      const essential = pis[0];
      if (!selected.includes(essential)) selected.push(essential);
      covered.add(m);
    }
  }

  while (covered.size < minterms.length) {
    let bestPi = null;
    let bestCover = -1;
    for (const pi of primeImplicants) {
      const coversCount = minterms.filter(m => !covered.has(m) && covers(pi.bits, m, numVars)).length;
      if (coversCount > bestCover) {
        bestCover = coversCount;
        bestPi = pi;
      }
    }
    if (!bestPi) break;
    selected.push(bestPi);
    for (const m of minterms) {
      if (covers(bestPi.bits, m, numVars)) covered.add(m);
    }
  }

  return selected.map(pi => pi.bits);
}

export function formatQMToSOP(implicantsBits = [], inputNames = []) {
  if (!implicantsBits.length) return '0';
  const terms = implicantsBits.map(bits => {
    const literals = [];
    for (let i = 0; i < bits.length; i++) {
      const b = bits[i];
      if (b === -1) continue;
      literals.push(b === 1 ? inputNames[i] : `${inputNames[i]}'`);
    }
    if (literals.length === 0) return '1';
    return literals.join('·');
  });
  return terms.join(' + ');
}

export function simplifySOP(minterms = [], inputNames = []) {
  if (!minterms.length) return '0';
  const numVars = inputNames.length;
  const impl = quineMcCluskey(minterms, [], numVars);
  return formatQMToSOP(impl, inputNames);
}
/**
 * ✅ NUEVO: Simplifica expresión POS usando Quine-McCluskey
 * Minimiza maxterms para obtener POS mínima
 */
export function simplifyPOS(maxterms = [], inputNames = []) {
  if (!maxterms.length) return '1';
  if (maxterms.length === (1 << inputNames.length)) return '0';
  
  const numVars = inputNames.length;
  
  console.log('📘 Simplificando POS:', { maxterms, inputNames, numVars });
  
  // Usar Quine-McCluskey para minimizar maxterms
  const impl = quineMcCluskey(maxterms, [], numVars);
  
  console.log('📘 Implicantes obtenidos:', impl);
  
  // Convertir implicantes a formato POS
  const result = formatQMToPOS(impl, inputNames);
  
  console.log('📘 POS formateada:', result);
  
  return result;

}
/**
 * ✅ NUEVO: Simplificación algebraica adicional para POS
 * Aplica leyes de absorción y consenso
 */
function simplifyPOSAlgebraic(expr) {
  if (!expr || expr === '0' || expr === '1') return expr;
  
  let current = expr;
  let changed = true;
  let iterations = 0;
  const maxIterations = 5;
  
  while (changed && iterations < maxIterations) {
    changed = false;
    iterations++;
    const before = current;
    
    // Extraer términos
    const terms = [];
    let currentTerm = '';
    let depth = 0;
    
    for (let i = 0; i < current.length; i++) {
      const char = current[i];
      if (char === '(') depth++;
      if (char === ')') depth--;
      
      if (char === '·' && depth === 0) {
        if (currentTerm.trim()) terms.push(currentTerm.trim());
        currentTerm = '';
      } else {
        currentTerm += char;
      }
    }
    if (currentTerm.trim()) terms.push(currentTerm.trim());
    
    // Aplicar absorción: (A+B)·(A+B+C) → (A+B)
    const absorbed = [];
    const toRemove = new Set();
    
    for (let i = 0; i < terms.length; i++) {
      if (toRemove.has(i)) continue;
      
      const term1 = terms[i].replace(/[()]/g, '');
      const literals1 = term1.split('+').map(l => l.trim());
      
      for (let j = 0; j < terms.length; j++) {
        if (i === j || toRemove.has(j)) continue;
        
        const term2 = terms[j].replace(/[()]/g, '');
        const literals2 = term2.split('+').map(l => l.trim());
        
        // Si todos los literales de term1 están en term2, term2 es absorbido
        if (literals1.every(lit => literals2.includes(lit)) && literals1.length < literals2.length) {
          toRemove.add(j);
          changed = true;
        }
      }
      
      if (!toRemove.has(i)) {
        absorbed.push(terms[i]);
      }
    }
    
    if (changed) {
      current = absorbed.join('·');
    }
  }
  
  return current;
}

// Exportar
export { simplifyPOSAlgebraic };
/**
 * ✅ NUEVO: Convierte implicantes de Quine-McCluskey a formato POS
 * Formato: (A+B)·(A'+C)
 */
export function formatQMToPOS(implicantsBits = [], inputNames = []) {
  if (!implicantsBits.length) return '1';
  
  const terms = implicantsBits.map(bits => {
    const literals = [];
    
    for (let i = 0; i < bits.length; i++) {
      const b = bits[i];
      if (b === -1) continue; // Variable eliminada por simplificación
      
      // ✅ CORRECCIÓN CRÍTICA:
      // En POS de Quine-McCluskey para maxterms:
      // - bit=0 significa que el maxterm tiene 0 en esa posición
      //   → En la suma (OR), esa variable aparece SIN negar
      // - bit=1 significa que el maxterm tiene 1 en esa posición
      //   → En la suma (OR), esa variable aparece NEGADA
      
      if (b === 0) {
        literals.push(inputNames[i]);  // Variable sin negar
      } else {
        literals.push(`${inputNames[i]}'`);  // Variable negada
      }
    }
    
    if (literals.length === 0) return '(1)';
    
    // Ordenar literales alfabéticamente para consistencia
    literals.sort((a, b) => {
      // Ordenar por letra base, luego las negadas después
      const aBase = a.replace(/'/g, '');
      const bBase = b.replace(/'/g, '');
      if (aBase === bBase) {
        return a.includes("'") ? 1 : -1; // Sin negar primero
      }
      return aBase.localeCompare(bBase);
    });
    
    return `(${literals.join(' + ')})`;
  });
  
  // Ordenar términos y eliminar duplicados
  const uniqueTerms = [...new Set(terms)];
  
  // Ordenar términos por complejidad (menos literales primero)
  uniqueTerms.sort((a, b) => {
    const aLiterals = (a.match(/[A-Z]/g) || []).length;
    const bLiterals = (b.match(/[A-Z]/g) || []).length;
    if (aLiterals !== bLiterals) return aLiterals - bLiterals;
    return a.localeCompare(b);
  });
  
  return uniqueTerms.join('·');
}

export function expressionsWithSimplification(nodes = [], edges = [], maxInputs = 6) {
  const t = generateTruthTable(nodes, edges, maxInputs);
  if (t.error) return { error: t.error };
  if (t.warning && !t.rows.length) {
    return { warning: t.warning, results: {} };
  }

  const { rows, inputNames, outputs } = t;
  const results = {};
  
  for (const outName of outputs) {
    const minterms = [];
    const maxterms = [];
    
    for (let idx = 0; idx < rows.length; idx++) {
      if ((rows[idx].outputs[outName] ?? 0) === 1) {
        minterms.push(idx);
      } else {
        maxterms.push(idx);
      }
    }
    
    // Generar SOP y POS originales
    const sopOriginal = sopFromMinterms(minterms, inputNames);
    const posOriginal = posFromMaxterms(maxterms, inputNames);
    
    // Simplificar SOP
    let simplifiedSOP = simplifySOP(minterms, inputNames);
    simplifiedSOP = removeDuplicatesFromExpression(simplifiedSOP);
    
    // ✅ MEJORADO: Simplificar POS con post-procesamiento
    let simplifiedPOS = simplifyPOS(maxterms, inputNames);
    simplifiedPOS = removeDuplicatesFromExpression(simplifiedPOS);
    simplifiedPOS = simplifyPOSAlgebraic(simplifiedPOS); // ← NUEVO
    
    results[outName] = {
      sop: sopOriginal,
      pos: posOriginal,
      minterms,
      maxterms,
      simplifiedSOP: simplifiedSOP,
      simplifiedPOS: simplifiedPOS,
    };
  }

  return { inputNames, outputs, results };
}
/**
 * ✅ NUEVO: Elimina términos duplicados de una expresión
 * Entrada: "B + A + B" → Salida: "A + B"
 */
/**
 * ✅ MEJORADO: Elimina términos duplicados de una expresión SOP o POS
 * SOP: "B + A + B" → "A + B"
 * POS: "(A+B)·(B+A)·(A+B)" → "(A + B)"
 */
function removeDuplicatesFromExpression(expr) {
  if (!expr || expr === '0' || expr === '1') return expr;
  
  // Detectar si es POS (tiene paréntesis y ·) o SOP (solo + y ·)
  const isPOS = expr.includes('(') && expr.includes(')');
  
  if (isPOS) {
    // Procesar POS: (A+B)·(C+D)
    const terms = [];
    let currentTerm = '';
    let depth = 0;
    
    for (let i = 0; i < expr.length; i++) {
      const char = expr[i];
      
      if (char === '(') {
        depth++;
        currentTerm += char;
      } else if (char === ')') {
        depth--;
        currentTerm += char;
        if (depth === 0) {
          terms.push(currentTerm.trim());
          currentTerm = '';
        }
      } else if (char === '·' && depth === 0) {
        // Separador de términos en POS
        continue;
      } else {
        currentTerm += char;
      }
    }
    
    // Normalizar cada término POS
    const normalizedTerms = terms.map(term => {
      // Extraer contenido entre paréntesis
      const match = term.match(/\(([^)]+)\)/);
      if (!match) return term;
      
      const content = match[1];
      const literals = content.split('+').map(l => l.trim()).sort();
      
      // Eliminar duplicados dentro del término
      const uniqueLiterals = [...new Set(literals)];
      return `(${uniqueLiterals.join(' + ')})`;
    });
    
    // Eliminar términos duplicados
    const uniqueTerms = [...new Set(normalizedTerms)];
    
    // Ordenar términos
    uniqueTerms.sort();
    
    return uniqueTerms.join('·');
    
  } else {
    // Procesar SOP: A·B + C·D
    const terms = expr.split('+').map(t => t.trim());
    
    // Normalizar cada término (ordenar literales alfabéticamente)
    const normalizedTerms = terms.map(term => {
      if (term.includes('·')) {
        const factors = term.split('·').map(f => f.trim()).sort();
        return factors.join('·');
      }
      return term;
    });
    
    // Eliminar duplicados
    const uniqueTerms = [...new Set(normalizedTerms)];
    
    // Ordenar alfabéticamente
    uniqueTerms.sort();
    
    return uniqueTerms.join(' + ');
  }
}

// Exportar la función
export { removeDuplicatesFromExpression };


