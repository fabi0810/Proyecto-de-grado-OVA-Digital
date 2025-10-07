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
  create3VarMap(variables) {
    const [var1, var2, var3] = variables
    
    return {
      type: '3var',
      rows: [
        { label: `${var1}'${var2}'`, values: [0, 1, 3, 2] },
        { label: `${var1}'${var2}`, values: [4, 5, 7, 6] },
        { label: `${var1}${var2}`, values: [12, 13, 15, 14] },
        { label: `${var1}${var2}'`, values: [8, 9, 11, 10] }
      ],
      cols: [
        { label: `${var3}'`, value: 0 },
        { label: `${var3}`, value: 1 }
      ],
      cells: [
        [0, 1, 3, 2],
        [4, 5, 7, 6],
        [12, 13, 15, 14],
        [8, 9, 11, 10]
      ]
    }
  }

  /**
   * Crea mapa para 4 variables
   */
  create4VarMap(variables) {
    const [var1, var2, var3, var4] = variables
    
    return {
      type: '4var',
      rows: [
        { label: `${var1}'${var2}'`, values: [0, 1, 3, 2] },
        { label: `${var1}'${var2}`, values: [4, 5, 7, 6] },
        { label: `${var1}${var2}`, values: [12, 13, 15, 14] },
        { label: `${var1}${var2}'`, values: [8, 9, 11, 10] }
      ],
      cols: [
        { label: `${var3}'${var4}'`, value: 0 },
        { label: `${var3}'${var4}`, value: 1 },
        { label: `${var3}${var4}`, value: 3 },
        { label: `${var3}${var4}'`, value: 2 }
      ],
      cells: [
        [0, 1, 3, 2],
        [4, 5, 7, 6],
        [12, 13, 15, 14],
        [8, 9, 11, 10]
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
  findGroupsInSingleMap(map, variables, mode, steps = null) {
    const groups = []
    const targetValue = mode === 'minTerms' ? 1 : 0
    const rows = map.cells.length
    const cols = map.cells[0].length

    // Posibles tamaños de rectángulos (alto, ancho) como potencias de 2 y envolviendo
    const rects = []
    const possibleHeights = rows === 1 ? [1] : rows === 2 ? [2,1] : [4,2,1]
    const possibleWidths = cols === 1 ? [1] : cols === 2 ? [2,1] : [4,2,1]
    for (const h of possibleHeights) {
      for (const w of possibleWidths) {
        rects.push([h,w])
      }
    }
    // Ordenar por área descendente (grandes primero)
    rects.sort((a,b) => (b[0]*b[1]) - (a[0]*a[1]))

    const covered = Array.from({ length: rows }, () => Array(cols).fill(false))
    const allGroups = []

    for (const [h, w] of rects) {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const rectCells = this.collectRect(map, r, c, h, w)
          if (rectCells.length !== h*w) continue
          const allTarget = rectCells.every(({ cell }) => (cell.value === targetValue) || cell.dontCare)
          if (!allTarget) continue
          // Evitar duplicados: normalizar firma por índices
          const signature = rectCells
            .map(({ cell }) => cell.index)
            .sort((a,b) => a-b)
            .join(',')
          if (allGroups.some(g => g.signature === signature)) continue
          const expr = this.generateGroupExpression(rectCells, variables, mode)
          const candidate = {
            cells: rectCells,
            expression: expr,
            size: rectCells.length,
            type: rectCells.length === 1 ? 'single' : 'group',
            signature
          }
          allGroups.push(candidate)
          if (steps) {
            steps.push({ action: 'candidate', rect: { r, c, h, w }, expression: expr, cells: rectCells.map(({row,col})=>({row,col})) })
          }
        }
      }
    }

    // Selección greedy: cubrir todas las celdas objetivo con el menor número de grupos
    const targetPositions = []
    for (let r=0;r<rows;r++) {
      for (let c=0;c<cols;c++) {
        if (map.cells[r][c].value === targetValue) targetPositions.push(`${r},${c}`)
      }
    }

    const coveredSet = new Set()
    // Marcar esenciales: celdas cubiertas por un único grupo
    const coverage = new Map() // key: pos -> groups indices
    allGroups.forEach((g, gi) => {
      g.cells.forEach(({row,col}) => {
        const key = `${row},${col}`
        if (!coverage.has(key)) coverage.set(key, [])
        coverage.get(key).push(gi)
      })
    })

    const selected = []
    // Seleccionar esenciales primero
    for (const [pos, list] of coverage.entries()) {
      if (targetPositions.includes(pos) && list.length === 1) {
        const gi = list[0]
        if (!selected.includes(gi)) selected.push(gi)
        coveredSet.add(pos)
        if (steps) steps.push({ action: 'select_essential', group: gi })
      }
    }
    // Completar cobertura con grupos más grandes restantes
    const remaining = allGroups
      .map((g,gi)=>({g,gi}))
      .sort((a,b)=> b.g.size - a.g.size)
    for (const {g,gi} of remaining) {
      // si ya seleccionado, omitir
      if (selected.includes(gi)) continue
      const addsCoverage = g.cells.some(({row,col}) => !coveredSet.has(`${row},${col}`) && map.cells[row][col].value === targetValue)
      if (addsCoverage) {
        selected.push(gi)
        g.cells.forEach(({row,col}) => coveredSet.add(`${row},${col}`))
        if (steps) steps.push({ action: 'select_group', group: gi })
      }
    }

    // Construir resultado y marcar esenciales
    const resultGroups = selected.map(gi => allGroups[gi])
    const cellToCount = new Map()
    resultGroups.forEach(gr => {
      gr.cells.forEach(({row,col}) => {
        const key = `${row},${col}`
        cellToCount.set(key, (cellToCount.get(key)||0)+1)
      })
    })
    resultGroups.forEach(gr => {
      const essential = gr.cells.some(({row,col}) => (cellToCount.get(`${row},${col}`)||0) === 1)
      gr.essential = essential
    })

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

  collectRect(map, startRow, startCol, height, width) {
    const rows = map.cells.length
    const cols = map.cells[0].length
    const cells = []
    for (let dr = 0; dr < height; dr++) {
      for (let dc = 0; dc < width; dc++) {
        const r = (startRow + dr) % rows
        const c = (startCol + dc) % cols
        const cell = map.cells[r][c]
        if (!cell) return []
        cells.push({ row: r, col: c, cell })
      }
    }
    return cells
  }

  /**
   * Genera expresión para un grupo
   */
  generateGroupExpression(cells, variables, mode = 'minTerms') {
    if (!cells || cells.length === 0) return ''
    const indices = cells.map(({ cell }) => cell.index)
    // Obtener asignaciones por índice
    const assignments = indices.map(idx => this.assignmentFromIndex(idx, variables.length))
    // Determinar variables constantes a lo largo del grupo
    const literals = []
    for (let vi = 0; vi < variables.length; vi++) {
      const allTrue = assignments.every(a => a[vi] === 1)
      const allFalse = assignments.every(a => a[vi] === 0)
      if (allTrue || allFalse) {
        if (mode === 'minTerms') {
          literals.push(allTrue ? variables[vi] : variables[vi] + "'")
        } else {
          // POS: literal en suma, var false -> (var), var true -> (var')
          literals.push(allFalse ? variables[vi] : variables[vi] + "'")
        }
      }
    }
    if (literals.length === 0) return mode === 'minTerms' ? '1' : '0'
    if (mode === 'minTerms') {
      return literals.join('·')
    }
    // POS: devolver suma
    return literals.join('+')
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
