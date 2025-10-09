// utils/booleanTools.js
// Herramientas booleanas: generación de tabla de verdad, expresión SOP y simplificación (Quine-McCluskey)

import { evaluateCircuitGraph } from './evaluateCircuitGraph'

// Lee nombres de entradas (orden estable A, B, C...) desde nodos type 'input' y 'constant'
function getInputNodesOrdered(nodes = []) {
  const inputNodes = nodes.filter(n => n?.type === 'input' || n?.type === 'constant');
  // Orden por label si existe, si no por id
  return [...inputNodes].sort((a, b) => {
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
    for (let i = 0; i < inputCount; i++) {
      // bit alto => 1
      const bit = (mask >> (inputCount - 1 - i)) & 1;
      const nodeId = inputs[i].id;
      inputOverrides[nodeId] = bit ? 1 : 0;
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

    // Construir fila
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

// SOP a partir de minterms
export function sopFromMinterms(minterms = [], inputNames = []) {
  if (!minterms.length) return '0';
  if (minterms.length === (1 << inputNames.length)) return '1';

  const terms = minterms.map(idx => {
    const literals = [];
    for (let i = 0; i < inputNames.length; i++) {
      const bit = (idx >> (inputNames.length - 1 - i)) & 1;
      const name = inputNames[i];
      literals.push(bit ? name : `${name}'`);
    }
    return literals.join('·');
  });

  return terms.join(' + ');
}

// Construye SOP no minimizada por salida desde la tabla de verdad
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

// Implementación básica de Quine-McCluskey para simplificación SOP
// Devuelve una expresión SOP minimizada en notación con ' para negación y · para AND
export function quineMcCluskey(minterms = [], dontCares = [], numVars = 0) {
  if (minterms.length === 0) return [];
  // Agrupar por número de 1s
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
    const mergedFlags = new Set();
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
          // Es un prime implicant
          if (!primeImplicants.some(pi => sameBits(pi.bits, t.bits))) {
            primeImplicants.push({ bits: t.bits });
          }
        }
      }
    }

    if (!anyMerged) break;
    currentGroups = nextGroups;
  }

  // Tabla de cobertura para minterms (sin dont cares)
  const chart = new Map(); // minterm -> implicantes que lo cubren
  for (const m of minterms) {
    chart.set(m, []);
    for (const pi of primeImplicants) {
      if (covers(pi.bits, m, numVars)) {
        chart.get(m).push(pi);
      }
    }
  }

  // Selección de implicantes esenciales
  const selected = [];
  const covered = new Set();
  for (const [m, pis] of chart) {
    if (pis.length === 1) {
      const essential = pis[0];
      if (!selected.includes(essential)) selected.push(essential);
      covered.add(m);
    }
  }

  // Cubrir minterms restantes con heurística greedy
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

function countOnes(n) {
  let c = 0;
  while (n) {
    c += n & 1;
    n >>= 1;
  }
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
      res.push(-1); // -1 => "don't care" para esa posición
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
    for (let idx = 0; idx < rows.length; idx++) {
      if ((rows[idx].outputs[outName] ?? 0) === 1) minterms.push(idx);
    }
    results[outName] = {
      sop: sopFromMinterms(minterms, inputNames),
      minterms,
      simplified: simplifySOP(minterms, inputNames),
    };
  }

  return { inputNames, outputs, results };
}