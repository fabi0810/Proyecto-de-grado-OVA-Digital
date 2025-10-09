// utils/evaluateCircuitGraph.js
// Motor de evaluación de circuitos combinacionales con detección de ciclos y orden topológico.
// Requisitos cubiertos:
// - Construye mapas de nodos y aristas, topological sort, detecta ciclos (hasCycle)
// - Evalúa compuertas con orden determinista de entradas (por targetHandle si existe)
// - Permite inputOverrides para forzar combinaciones de entradas
// - Robusto ante nodos sin entradas o con múltiples edges

function getNodeId(node) {
    return typeof node?.id === 'string' ? node.id : String(node?.id ?? '');
  }
  
  function buildGraph(nodes = [], edges = []) {
    const idToNode = new Map();
    const inEdges = new Map();
    const outEdges = new Map();
  
    for (const n of nodes) {
      const id = getNodeId(n);
      idToNode.set(id, n);
      inEdges.set(id, []);
      outEdges.set(id, []);
    }
  
    for (const e of edges) {
      const src = e?.source;
      const tgt = e?.target;
      if (!idToNode.has(src) || !idToNode.has(tgt)) continue;
      outEdges.get(src).push(e);
      inEdges.get(tgt).push(e);
    }
  
    return { idToNode, inEdges, outEdges };
  }
  
  function detectCycleKahn(idToNode, inEdges, outEdges) {
    const inDegree = new Map();
    for (const id of idToNode.keys()) {
      inDegree.set(id, (inEdges.get(id) || []).length);
    }
  
    const queue = [];
    for (const [id, deg] of inDegree) {
      if (deg === 0) queue.push(id);
    }
  
    const topoOrder = [];
    while (queue.length) {
      const id = queue.shift();
      topoOrder.push(id);
      for (const e of outEdges.get(id) || []) {
        const t = e.target;
        const deg = inDegree.get(t) ?? 0;
        inDegree.set(t, deg - 1);
        if (deg - 1 === 0) queue.push(t);
      }
    }
  
    const hasCycle = topoOrder.length !== idToNode.size;
    return { hasCycle, topoOrder };
  }
  
  function readNodeType(node) {
    // Compatibilidad con tipos existentes: 'logicGate', 'input'
    // Nuevos: 'constant', 'output'
    return node?.type || 'logicGate';
  }
  
  function readGateType(node) {
    return node?.data?.gateType || node?.data?.label || node?.data?.type || '';
  }
  
  function evaluateGate(gateType, inputValues) {
    if (!Array.isArray(inputValues)) return 0;
    if (inputValues.length === 0) return 0;
    if (inputValues.some(v => v === undefined || v === null)) return undefined;
  
    switch (gateType) {
      case 'AND': return inputValues.every(v => v === 1) ? 1 : 0;
      case 'OR': return inputValues.some(v => v === 1) ? 1 : 0;
      case 'NOT': return inputValues[0] === 1 ? 0 : 1;
      case 'NAND': return inputValues.every(v => v === 1) ? 0 : 1;
      case 'NOR': return inputValues.some(v => v === 1) ? 0 : 1;
      case 'XOR': return inputValues.filter(v => v === 1).length % 2 === 1 ? 1 : 0;
      case 'XNOR': return inputValues.filter(v => v === 1).length % 2 === 0 ? 1 : 0;
      default: return 0;
    }
  }
  
  function sortInEdgesDeterministically(inEdgesForNode) {
    // Orden determinista por targetHandle (si existe) y luego por source/sourceHandle
    return [...(inEdgesForNode || [])].sort((a, b) => {
      const ah = a?.targetHandle ?? '';
      const bh = b?.targetHandle ?? '';
      if (ah < bh) return -1;
      if (ah > bh) return 1;
      const as = (a?.source ?? '') + ':' + (a?.sourceHandle ?? '');
      const bs = (b?.source ?? '') + ':' + (b?.sourceHandle ?? '');
      if (as < bs) return -1;
      if (as > bs) return 1;
      return 0;
    });
  }
  
  export function evaluateCircuitGraph(nodes = [], edges = [], options = {}) {
    // options: { inputOverrides?: Record<inputNodeId, 0|1> }
    const { idToNode, inEdges, outEdges } = buildGraph(nodes, edges);
    const { hasCycle, topoOrder } = detectCycleKahn(idToNode, inEdges, outEdges);
  
    if (hasCycle) {
      return {
        hasCycle: true,
        values: {},
        outputs: {},
        error: 'Ciclo detectado',
      };
    }
  
    const values = {}; // nodeId -> 0|1|undefined
    const inputOverrides = options?.inputOverrides || {};
  
    // Paso 1: inicializar valores de nodos de entrada/constante
    for (const id of topoOrder) {
      const node = idToNode.get(id);
      const type = readNodeType(node);
  
      if (type === 'input') {
        const overridden = inputOverrides[id];
        if (overridden === 0 || overridden === 1) {
          values[id] = overridden;
        } else {
          // Leer desde node.data.value si existe
          const val = node?.data?.value ?? 0;
          values[id] = val === 1 ? 1 : 0;
        }
      } else if (type === 'constant') {
        const val = node?.data?.value ?? 0;
        values[id] = val === 1 ? 1 : 0;
      }
    }
  
    // Paso 2: evaluar por orden topológico
    for (const id of topoOrder) {
      const node = idToNode.get(id);
      const type = readNodeType(node);
  
      if (type === 'logicGate') {
        const ins = sortInEdgesDeterministically(inEdges.get(id));
        const inputValues = ins.map(e => values[e.source]);
        const gateType = readGateType(node);
        const out = evaluateGate(gateType, inputValues);
        values[id] = out;
      } else if (type === 'output') {
        // La salida toma el valor de su (única) entrada si existe
        const ins = sortInEdgesDeterministically(inEdges.get(id));
        if (!ins.length) {
          values[id] = 0;
        } else {
          const v = values[ins[0].source];
          values[id] = v === 1 ? 1 : 0;
        }
      } else {
        // 'input' y 'constant' ya asignados
      }
    }
  
    // Paso 3: recolectar salidas (todos los nodos type === 'output')
    const outputs = {};
    for (const id of topoOrder) {
      const node = idToNode.get(id);
      if (readNodeType(node) === 'output') {
        const label = node?.data?.label || id;
        outputs[label] = values[id] ?? 0;
      }
    }
  
    return {
      hasCycle: false,
      values,
      outputs,
      error: null,
    };
  }