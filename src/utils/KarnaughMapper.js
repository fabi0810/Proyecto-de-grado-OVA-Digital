/**
 * Generador de Mapas de Karnaugh Interactivo
 * Soporta mapas de 2, 3, 4 y hasta 6 variables
 * Con agrupación automática y manual
 */

import { booleanParser } from './BooleanExpressionParser'

export class KarnaughMapper {
  constructor() {
    this.maxVariables = 6
    this.groupingRules = {
      minTerms: {
        name: 'Mintérminos (SOP)',
        description: 'Agrupar 1s para obtener suma de productos'
      },
      maxTerms: {
        name: 'Maxtérminos (POS)',
        description: 'Agrupar 0s para obtener producto de sumas'
      }
    }
  }

  /**
   * Genera un mapa de Karnaugh para una expresión booleana
   */
  generateMap(expression, variables, options = {}) {
    const {
      mode = 'minTerms', // minTerms o maxTerms
      showGroups = true,
      showExpression = true,
      dontCares = [],
      enableSteps = false
    } = options

    if (variables.length < 2 || variables.length > this.maxVariables) {
      throw new Error(`Número de variables debe estar entre 2 y ${this.maxVariables}`)
    }

    // Generar tabla de verdad
    const truthTable = this.generateTruthTable(expression, variables, dontCares)
    
    // Crear estructura del mapa
    const map = this.createMapStructure(variables)
    
    // Llenar el mapa con valores
    this.fillMap(map, truthTable, variables)
    
    // Encontrar grupos óptimos
    const steps = enableSteps ? [] : null
    const groups = this.findOptimalGroups(map, variables, mode, steps)
    
    // Generar expresión simplificada
    const simplifiedExpression = this.generateSimplifiedExpression(groups, variables, mode)
    
    return {
      map: map,
      groups: groups,
      simplifiedExpression: simplifiedExpression,
      variables: variables,
      mode: mode,
      truthTable: truthTable,
      complexity: this.calculateMapComplexity(map, groups),
      steps: steps || []
    }
  }

  /**
   * Genera tabla de verdad para la expresión
   */
  generateTruthTable(expression, variables, dontCares = []) {
    const parse = booleanParser.parse(expression)
    const combinations = this.generateAllCombinations(variables)
    const truthTable = []
    
    for (let idx = 0; idx < combinations.length; idx++) {
      const combination = combinations[idx]
      let result = false
      try {
        if (!parse.success) throw new Error('Expresión inválida')
        result = booleanParser.evaluateAST(parse.ast, combination)
      } catch (e) {
        result = false
      }
      const isDC = Array.isArray(dontCares) && dontCares.includes(idx)
      truthTable.push({
        ...combination,
        index: idx,
        result: result,
        dontCare: isDC,
        minTerm: this.getMinTerm(combination, variables),
        maxTerm: this.getMaxTerm(combination, variables)
      })
    }
    
    return truthTable
  }

  /**
   * Crea la estructura del mapa según el número de variables
   */
  createMapStructure(variables) {
    const numVars = variables.length
    
    if (numVars === 2) {
      return this.create2VarMap(variables)
    } else if (numVars === 3) {
      return this.create3VarMap(variables)
    } else if (numVars === 4) {
      return this.create4VarMap(variables)
    } else if (numVars === 5) {
      return this.create5VarMap(variables)
    } else if (numVars === 6) {
      return this.create6VarMap(variables)
    }
    
    throw new Error('Número de variables no soportado')
  }

  /**
   * Crea mapa para 2 variables
   */
  create2VarMap(variables) {
    const [var1, var2] = variables
    
    return {
      type: '2var',
      rows: [
        { label: `${var1}'`, values: [0, 1] },
        { label: `${var1}`, values: [2, 3] }
      ],
      cols: [
        { label: `${var2}'`, value: 0 },
        { label: `${var2}`, value: 1 }
      ],
      cells: [
        [0, 1], // var1' var2', var1' var2
        [2, 3]  // var1 var2', var1 var2
      ]
    }
  }

  /**
   * Crea mapa para 3 variables
   */
 /**
 * ✅ CORREGIDO: Mapa de 3 variables con código Gray correcto
 */
/**
 * ✅ CORREGIDO: Mapa de 3 variables con código Gray correcto
 */
create3VarMap(variables) {
  const [var1, var2, var3] = variables
  
  // Código Gray para columnas: 0, 1
  // Código Gray para filas: 00, 01, 11, 10
  return {
    type: '3var',
    rows: [
      { label: `${var1}'${var2}'`, values: [0, 1] },   // 00
      { label: `${var1}'${var2}`, values: [2, 3] },    // 01
      { label: `${var1}${var2}`, values: [6, 7] },     // 11
      { label: `${var1}${var2}'`, values: [4, 5] }     // 10
    ],
    cols: [
      { label: `${var3}'`, value: 0 },
      { label: `${var3}`, value: 1 }
    ],
    // Índices en código Gray
    cells: [
      [0, 1],   // 000, 001
      [2, 3],   // 010, 011
      [6, 7],   // 110, 111
      [4, 5]    // 100, 101
    ]
  }
}
  /**
   * Crea mapa para 4 variables
   */
 /**
 * ✅ CORREGIDO: Mapa de 4 variables con código Gray
 */
/**
 * ✅ CORREGIDO: Mapa de 4 variables con código Gray
 */
create4VarMap(variables) {
  const [var1, var2, var3, var4] = variables
  
  // Código Gray para filas: 00, 01, 11, 10
  // Código Gray para columnas: 00, 01, 11, 10
  return {
    type: '4var',
    rows: [
      { label: `${var1}'${var2}'`, values: [0, 1, 3, 2] },     // 00
      { label: `${var1}'${var2}`, values: [4, 5, 7, 6] },      // 01
      { label: `${var1}${var2}`, values: [12, 13, 15, 14] },   // 11
      { label: `${var1}${var2}'`, values: [8, 9, 11, 10] }     // 10
    ],
    cols: [
      { label: `${var3}'${var4}'`, value: 0 },   // 00
      { label: `${var3}'${var4}`, value: 1 },    // 01
      { label: `${var3}${var4}`, value: 3 },     // 11
      { label: `${var3}${var4}'`, value: 2 }     // 10
    ],
    // Índices en código Gray bidimensional
    cells: [
      [0, 1, 3, 2],       // 0000, 0001, 0011, 0010
      [4, 5, 7, 6],       // 0100, 0101, 0111, 0110
      [12, 13, 15, 14],   // 1100, 1101, 1111, 1110
      [8, 9, 11, 10]      // 1000, 1001, 1011, 1010
    ]
  }
}

  /**
   * Crea mapa para 5 variables
   */
  create5VarMap(variables) {
    // Mapa de 5 variables se divide en dos mapas de 4 variables
    const [var1, var2, var3, var4, var5] = variables
    
    return {
      type: '5var',
      leftMap: this.create4VarMap([var1, var2, var3, var4]),
      rightMap: this.create4VarMap([var1, var2, var3, var4]),
      splitVariable: var5,
      splitValue: 0 // var5' en el mapa izquierdo
    }
  }

  /**
   * Crea mapa para 6 variables
   */
  create6VarMap(variables) {
    // Mapa de 6 variables se divide en cuatro mapas de 4 variables
    const [var1, var2, var3, var4, var5, var6] = variables
    
    return {
      type: '6var',
      maps: [
        {
          label: `${var5}'${var6}'`,
          map: this.create4VarMap([var1, var2, var3, var4])
        },
        {
          label: `${var5}'${var6}`,
          map: this.create4VarMap([var1, var2, var3, var4])
        },
        {
          label: `${var5}${var6}`,
          map: this.create4VarMap([var1, var2, var3, var4])
        },
        {
          label: `${var5}${var6}'`,
          map: this.create4VarMap([var1, var2, var3, var4])
        }
      ]
    }
  }

  /**
   * Llena el mapa con valores de la tabla de verdad
   */
  fillMap(map, truthTable, variables) {
    const numVars = variables.length
    
    if (numVars <= 4) {
      this.fillSingleMap(map, truthTable, variables)
    } else if (numVars === 5) {
      this.fill5VarMap(map, truthTable, variables)
    } else if (numVars === 6) {
      this.fill6VarMap(map, truthTable, variables)
    }
  }

  /**
   * Llena un mapa simple (2-4 variables)
   */
  fillSingleMap(map, truthTable, variables) {
    for (let row = 0; row < map.cells.length; row++) {
      for (let col = 0; col < map.cells[row].length; col++) {
        const cellIndex = map.cells[row][col]
        const truthRow = truthTable[cellIndex]
        map.cells[row][col] = {
          index: cellIndex,
          value: truthRow ? (truthRow.result ? 1 : 0) : 0,
          dontCare: truthRow ? Boolean(truthRow.dontCare) : false,
          minTerm: truthRow ? truthRow.minTerm : null,
          maxTerm: truthRow ? truthRow.maxTerm : null
        }
      }
    }
  }

  /**
   * Llena mapa de 5 variables
   */
  fill5VarMap(map, truthTable, variables) {
    const [var1, var2, var3, var4, var5] = variables
    
    // Llenar mapa izquierdo (var5 = 0)
    const leftTruthTable = truthTable.filter(row => !row[var5])
    this.fillSingleMap(map.leftMap, leftTruthTable, [var1, var2, var3, var4])
    
    // Llenar mapa derecho (var5 = 1)
    const rightTruthTable = truthTable.filter(row => row[var5])
    this.fillSingleMap(map.rightMap, rightTruthTable, [var1, var2, var3, var4])
  }

  /**
   * Llena mapa de 6 variables
   */
  fill6VarMap(map, truthTable, variables) {
    const [var1, var2, var3, var4, var5, var6] = variables
    
    // Llenar cada submapa
    map.maps.forEach((submap, index) => {
      const var5Value = Math.floor(index / 2)
      const var6Value = index % 2
      
      const filteredTable = truthTable.filter(row => 
        row[var5] === var5Value && row[var6] === var6Value
      )
      
      this.fillSingleMap(submap.map, filteredTable, [var1, var2, var3, var4])
    })
  }

  /**
   * Encuentra grupos óptimos en el mapa
   */
  findOptimalGroups(map, variables, mode, steps = null) {
    const numVars = variables.length
    
    if (numVars <= 4) {
      return this.findGroupsInSingleMap(map, variables, mode, steps)
    } else if (numVars === 5) {
      return this.findGroupsIn5VarMap(map, variables, mode)
    } else if (numVars === 6) {
      return this.findGroupsIn6VarMap(map, variables, mode)
    }
    
    return []
  }

  /**
   * Encuentra grupos en mapa simple
   */
  /**
 * ✅ MEJORADO: Encuentra grupos en mapa simple usando algoritmo greedy
 */
findGroupsInSingleMap(map, variables, mode, steps = null) {
  const targetValue = mode === 'minTerms' ? 1 : 0
  const rows = map.cells.length
  const cols = map.cells[0].length

  console.log('🔍 Buscando grupos en mapa', { rows, cols, targetValue })

  // Generar todos los rectángulos posibles (potencias de 2)
  const possibleSizes = []
  
  // Alturas posibles
  const heights = []
  for (let h = rows; h >= 1; h = Math.floor(h / 2)) {
    heights.push(h)
  }
  
  // Anchos posibles
  const widths = []
  for (let w = cols; w >= 1; w = Math.floor(w / 2)) {
    widths.push(w)
  }
  
  // Combinar alturas y anchos
  for (const h of heights) {
    for (const w of widths) {
      possibleSizes.push({ h, w, area: h * w })
    }
  }
  
  // Ordenar por área descendente (grupos grandes primero)
  possibleSizes.sort((a, b) => b.area - a.area)
  
  console.log('  Tamaños posibles:', possibleSizes)

  // Encontrar todos los grupos candidatos
  const allCandidates = []
  
  for (const { h, w } of possibleSizes) {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const rectCells = this.collectRectWrapping(map, r, c, h, w)
        
        if (rectCells.length !== h * w) continue
        
        // Verificar que todas las celdas sean del valor objetivo o don't-care
        const allValid = rectCells.every(({ cell }) => 
          cell.value === targetValue || cell.dontCare
        )
        
        if (!allValid) continue
        
        // Debe contener al menos una celda objetivo (no solo don't-cares)
        const hasTarget = rectCells.some(({ cell }) => cell.value === targetValue)
        if (!hasTarget) continue
        
        // Crear firma única para evitar duplicados
        const signature = rectCells
          .map(({ cell }) => cell.index)
          .sort((a, b) => a - b)
          .join(',')
        
        // Evitar duplicados
        if (allCandidates.some(c => c.signature === signature)) continue
        
        // Generar expresión
        const expr = this.generateGroupExpression(rectCells, variables, mode)
        
        allCandidates.push({
          cells: rectCells,
          expression: expr,
          size: rectCells.length,
          signature,
          indices: rectCells.map(({ cell }) => cell.index)
        })
        
        if (steps) {
          steps.push({ 
            action: 'candidate', 
            rect: { r, c, h, w }, 
            expression: expr,
            indices: rectCells.map(({ cell }) => cell.index)
          })
        }
      }
    }
  }
  
  console.log('  Candidatos encontrados:', allCandidates.length)

  // Seleccionar cobertura mínima usando greedy
  const targetIndices = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (map.cells[r][c].value === targetValue) {
        targetIndices.push(map.cells[r][c].index)
      }
    }
  }
  
  console.log('  Índices objetivo a cubrir:', targetIndices)

  // Construir tabla de cobertura
  const coverage = new Map()
  targetIndices.forEach(idx => coverage.set(idx, []))
  
  allCandidates.forEach((candidate, ci) => {
    candidate.indices.forEach(idx => {
      if (coverage.has(idx)) {
        coverage.get(idx).push(ci)
      }
    })
  })

  // Seleccionar implicantes esenciales
  const selected = []
  const covered = new Set()
  
  // Paso 1: Implicantes esenciales (cubren índices únicos)
  coverage.forEach((candidateIndices, targetIdx) => {
    if (candidateIndices.length === 1) {
      const ci = candidateIndices[0]
      if (!selected.includes(ci)) {
        selected.push(ci)
        allCandidates[ci].indices.forEach(idx => covered.add(idx))
        console.log('  ✅ Esencial seleccionado:', ci, allCandidates[ci].expression)
        
        if (steps) {
          steps.push({ action: 'select_essential', group: ci })
        }
      }
    }
  })

  // Paso 2: Greedy - seleccionar grupos que cubren más índices no cubiertos
  const remaining = allCandidates
    .map((c, ci) => ({ candidate: c, index: ci }))
    .filter(({ index }) => !selected.includes(index))
    .sort((a, b) => b.candidate.size - a.candidate.size)
  
  for (const { candidate, index: ci } of remaining) {
    const newCoverage = candidate.indices.filter(idx => 
      targetIndices.includes(idx) && !covered.has(idx)
    )
    
    if (newCoverage.length > 0) {
      selected.push(ci)
      candidate.indices.forEach(idx => covered.add(idx))
      console.log('  ✅ Grupo adicional:', ci, candidate.expression)
      
      if (steps) {
        steps.push({ action: 'select_group', group: ci })
      }
    }
    
    // Si ya cubrimos todo, terminar
    if (covered.size >= targetIndices.length) break
  }

  // Construir resultado final
  const resultGroups = selected.map(ci => {
    const candidate = allCandidates[ci]
    
    // Marcar como esencial si cubre algún índice único
    const essential = candidate.indices.some(idx => {
      const coverers = coverage.get(idx)
      return coverers && coverers.length === 1
    })
    
    return {
      ...candidate,
      essential
    }
  })

  console.log('  ✅ Grupos finales:', resultGroups.length)
  
  return resultGroups
}

  /**
   * Encuentra un grupo de tamaño específico en una posición
   */
  findGroupAt(map, startRow, startCol, size, targetValue, variables) {
    // Deprecated by collectRect-based approach, keep for API compatibility
    const group = { cells: [], expression: '', size, type: size===1?'single':'group' }
    return null
  }

 /**
 * ✅ MEJORADO: Recolecta celdas de un rectángulo con wrap-around (envolvente)
 */
collectRectWrapping(map, startRow, startCol, height, width) {
  const rows = map.cells.length
  const cols = map.cells[0].length
  const cells = []
  
  for (let dr = 0; dr < height; dr++) {
    for (let dc = 0; dc < width; dc++) {
      const r = (startRow + dr) % rows
      const c = (startCol + dc) % cols
      const cell = map.cells[r][c]
      
      if (!cell || typeof cell.value === 'undefined') {
        console.warn('  ⚠️ Celda inválida en', r, c)
        return []
      }
      
      cells.push({ row: r, col: c, cell })
    }
  }
  
  return cells
}

  /**
   * Genera expresión para un grupo
   */
  /**
 * ✅ CORREGIDO: Genera expresión para un grupo
 */
generateGroupExpression(cells, variables, mode = 'minTerms') {
  if (!cells || cells.length === 0) return ''
  
  const indices = cells.map(({ cell }) => cell.index)
  console.log('🔢 Generando expresión para grupo:', indices)
  
  // Obtener asignaciones binarias por índice
  const assignments = indices.map(idx => this.assignmentFromIndex(idx, variables.length))
  console.log('  Asignaciones binarias:', assignments)
  
  // Determinar qué variables son constantes en todo el grupo
  const literals = []
  for (let vi = 0; vi < variables.length; vi++) {
    const values = assignments.map(a => a[vi])
    const allTrue = values.every(v => v === 1)
    const allFalse = values.every(v => v === 0)
    
    if (allTrue || allFalse) {
      if (mode === 'minTerms') {
        // SOP: variable=1 → variable, variable=0 → variable'
        literals.push(allTrue ? variables[vi] : variables[vi] + "'")
      } else {
        // POS: variable=0 → variable, variable=1 → variable'
        literals.push(allFalse ? variables[vi] : variables[vi] + "'")
      }
    }
  }
  
  console.log('  Literales generados:', literals)
  
  // Si no hay literales, es un término constante
  if (literals.length === 0) {
    return mode === 'minTerms' ? '1' : '0'
  }
  
  if (mode === 'minTerms') {
    // SOP: producto de literales (A·B·C')
    return literals.join('·')
  } else {
    // POS: suma de literales (A+B+C')
    return literals.join('+')
  }
}
  assignmentFromIndex(index, numVars) {
    const bits = []
    for (let i = numVars - 1; i >= 0; i--) {
      bits.push((index >> i) & 1)
    }
    return bits
  }

  /**
   * Verifica si una celda ha sido visitada
   */
  isCellVisited(visited, row, col) {
    return visited.has(`${row},${col}`)
  }

  /**
   * Marca celdas como visitadas
   */
  markCellsAsVisited(visited, cells) {
    cells.forEach(cell => {
      visited.add(`${cell.row},${cell.col}`)
    })
  }

  /**
   * Genera expresión simplificada a partir de grupos
   */
  generateSimplifiedExpression(groups, variables, mode) {
    if (groups.length === 0) {
      return mode === 'minTerms' ? '0' : '1'
    }
    
    const terms = groups.map(group => group.expression).filter(expr => expr)
    
    if (mode === 'minTerms') {
      return terms.join(' + ')
    } else {
      return "(" + terms.join(') · (') + ")"
    }
  }

  /**
   * Calcula complejidad del mapa
   */
  calculateMapComplexity(map, groups) {
    return {
      totalCells: this.countTotalCells(map),
      filledCells: this.countFilledCells(map),
      groups: groups.length,
      complexity: groups.length + this.countFilledCells(map)
    }
  }

  /**
   * Cuenta celdas totales
   */
  countTotalCells(map) {
    if (map.type === '2var') return 4
    if (map.type === '3var') return 8
    if (map.type === '4var') return 16
    if (map.type === '5var') return 32
    if (map.type === '6var') return 64
    return 0
  }

  /**
   * Cuenta celdas llenas
   */
  countFilledCells(map) {
    let count = 0
    
    if (map.cells) {
      for (const row of map.cells) {
        for (const cell of row) {
          if (cell.value === 1) count++
        }
      }
    }
    
    return count
  }

  /**
   * Genera todas las combinaciones de variables
   */
  generateAllCombinations(variables) {
    const combinations = []
    const numVars = variables.length
    const totalCombinations = Math.pow(2, numVars)
    
    for (let i = 0; i < totalCombinations; i++) {
      const combination = {}
      for (let j = 0; j < numVars; j++) {
        const bit = (i >> (numVars - 1 - j)) & 1
        combination[variables[j]] = Boolean(bit)
      }
      combinations.push(combination)
    }
    
    return combinations
  }

  /**
   * Evalúa una expresión con valores de variables
   */
  evaluateExpression(expression, variableValues) {
    const parse = booleanParser.parse(expression)
    if (!parse.success) return false
    try {
      return booleanParser.evaluateAST(parse.ast, variableValues)
    } catch (e) {
      return false
    }
  }

  /**
   * Obtiene mintérmino para una combinación
   */
  getMinTerm(combination, variables) {
    const terms = variables.map(variable => 
      combination[variable] ? variable : variable + "'"
    )
    return terms.join('·')
  }

  /**
   * Obtiene maxtérmino para una combinación
   */
  getMaxTerm(combination, variables) {
    const terms = variables.map(variable => 
      combination[variable] ? variable + "'" : variable
    )
    return "(" + terms.join('+') + ")"
  }

  /**
   * Valida un mapa de Karnaugh
   */
  validateMap(map) {
    const errors = []
    
    if (!map.cells) {
      errors.push('Mapa no tiene celdas definidas')
    }
    
    if (map.cells && map.cells.length === 0) {
      errors.push('Mapa está vacío')
    }
    
    return {
      valid: errors.length === 0,
      errors: errors
    }
  }

  /**
   * Exporta mapa como JSON
   */
  exportMap(map) {
    return {
      type: map.type,
      cells: map.cells,
      groups: map.groups || [],
      timestamp: new Date().toISOString()
    }
  }
}

// Exportar instancia singleton
export const karnaughMapper = new KarnaughMapper()
export default karnaughMapper
