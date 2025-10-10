// utils/evaluateCircuitGraph.js
// Evaluador de grafos de circuitos lógicos con detección de ciclos y actualización de salidas

/**
 * Evalúa el circuito completo y devuelve los valores de todos los nodos
 * @param {Array} nodes - Nodos del circuito
 * @param {Array} edges - Conexiones entre nodos
 * @param {Object} options - Opciones de evaluación
 * @returns {Object} { nodeValues: Map, outputs: Object, hasCycle: boolean }
 */
export function evaluateCircuitGraph(nodes = [], edges = [], options = {}) {
  const { inputOverrides = {} } = options;
  
  // Mapa de valores de nodos
  const nodeValues = new Map();
  
  // Inicializar valores de entrada y constantes
  nodes.forEach(node => {
    if (node.type === 'input') {
      // Usar override si existe, sino el valor del nodo
      const value = inputOverrides[node.id] !== undefined 
        ? inputOverrides[node.id] 
        : (node.data?.value ?? 0);
      nodeValues.set(node.id, value);
    } else if (node.type === 'constant') {
      const value = node.data?.value === 1 ? 1 : 0;
      nodeValues.set(node.id, value);
    }
  });

  // Crear mapa de adyacencia para detectar ciclos
  const adjList = new Map();
  const inDegree = new Map();
  
  nodes.forEach(node => {
    adjList.set(node.id, []);
    inDegree.set(node.id, 0);
  });

  edges.forEach(edge => {
    if (!adjList.has(edge.source)) adjList.set(edge.source, []);
    adjList.get(edge.source).push(edge);
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
  });

  // Ordenamiento topológico (Kahn's algorithm) para detectar ciclos
  const queue = [];
  nodes.forEach(node => {
    if (inDegree.get(node.id) === 0) {
      queue.push(node.id);
    }
  });

  const topoOrder = [];
  while (queue.length > 0) {
    const nodeId = queue.shift();
    topoOrder.push(nodeId);
    
    const outEdges = adjList.get(nodeId) || [];
    for (const edge of outEdges) {
      const targetId = edge.target;
      inDegree.set(targetId, inDegree.get(targetId) - 1);
      if (inDegree.get(targetId) === 0) {
        queue.push(targetId);
      }
    }
  }

  // Si el orden topológico no incluye todos los nodos, hay un ciclo
  if (topoOrder.length !== nodes.length) {
    return { 
      nodeValues, 
      outputs: {}, 
      hasCycle: true 
    };
  }

  // Evaluar nodos en orden topológico
  for (const nodeId of topoOrder) {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) continue;

    if (node.type === 'logicGate') {
      // Obtener conexiones de entrada
      const inputEdges = edges.filter(edge => edge.target === nodeId);
      const inputCount = node.data.gateType === 'NOT' ? 1 : 2;
      const inputValues = [];

      for (let i = 0; i < inputCount; i++) {
        const edge = inputEdges.find(e => e.targetHandle === `input-${i}`);
        if (edge) {
          const sourceValue = nodeValues.get(edge.source);
          inputValues[i] = sourceValue !== undefined ? sourceValue : undefined;
        } else {
          inputValues[i] = undefined;
        }
      }

      // Calcular salida de la compuerta
      const output = calculateGateValue(node.data.gateType, inputValues);
      nodeValues.set(nodeId, output);
    } else if (node.type === 'output') {
      // Obtener valor de entrada del nodo de salida
      const inputEdge = edges.find(edge => edge.target === nodeId);
      if (inputEdge) {
        const sourceValue = nodeValues.get(inputEdge.source);
        nodeValues.set(nodeId, sourceValue !== undefined ? sourceValue : 0);
      } else {
        nodeValues.set(nodeId, 0);
      }
    }
  }

  // Recopilar valores de salida
  const outputs = {};
  nodes.forEach(node => {
    if (node.type === 'output') {
      const label = node.data?.label || node.id;
      outputs[label] = nodeValues.get(node.id) ?? 0;
    }
  });

  return { 
    nodeValues, 
    outputs, 
    hasCycle: false 
  };
}

/**
 * Calcula el valor de salida de una compuerta lógica
 * @param {string} gateType - Tipo de compuerta (AND, OR, NOT, etc.)
 * @param {Array} inputValues - Valores de entrada
 * @returns {number} Valor de salida (0 o 1)
 */
function calculateGateValue(gateType, inputValues) {
  if (!inputValues || inputValues.length === 0) return undefined;
  if (inputValues.some(val => val === undefined || val === null)) return undefined;

  switch (gateType) {
    case 'AND':
      return inputValues.every(val => val === 1) ? 1 : 0;
    case 'OR':
      return inputValues.some(val => val === 1) ? 1 : 0;
    case 'NOT':
      return inputValues[0] === 1 ? 0 : 1;
    case 'NAND':
      return inputValues.every(val => val === 1) ? 0 : 1;
    case 'NOR':
      return inputValues.some(val => val === 1) ? 0 : 1;
    case 'XOR':
      return inputValues.filter(val => val === 1).length % 2 === 1 ? 1 : 0;
    case 'XNOR':
      return inputValues.filter(val => val === 1).length % 2 === 0 ? 1 : 0;
    default:
      return 0;
  }
}