// src/utils/BooleanExpressionParser.js

class BooleanExpressionParser {
  constructor() {
    // Mapeo de símbolos de múltiples notaciones a un formato estándar
    this.operatorMappings = {
      // AND operators
      '·': 'AND',
      '*': 'AND',
      'x': 'AND',
      '∧': 'AND',
      '&&': 'AND',
      'AND': 'AND',
      'and': 'AND',
      
      // OR operators
      '+': 'OR',
      '∨': 'OR',
      '||': 'OR',
      'OR': 'OR',
      'or': 'OR',
      
      // NOT operators
      "'": 'NOT',
      '!': 'NOT',
      '¬': 'NOT',
      '~': 'NOT',
      'NOT': 'NOT',
      'not': 'NOT',
      
      // XOR operators
      '⊕': 'XOR',
      '^': 'XOR',
      'XOR': 'XOR',
      'xor': 'XOR'
    }
    
    this.precedence = {
      'NOT': 3,
      'AND': 2,
      'OR': 1,
      'XOR': 1
    }
  }

  // Normalizar expresión para facilitar el parsing
  normalizeExpression(expression) {
    let normalized = expression.trim()
    
    // Reemplazar múltiples espacios por uno solo
    normalized = normalized.replace(/\s+/g, ' ')
    
    // Convertir operadores de texto a sus equivalentes
    const textOperators = [
      { pattern: /\bAND\b/gi, replacement: '·' },
      { pattern: /\bOR\b/gi, replacement: '+' },
      { pattern: /\bNOT\b/gi, replacement: "'" },
      { pattern: /\bXOR\b/gi, replacement: '⊕' },
      { pattern: /&&/g, replacement: '·' },
      { pattern: /&/g, replacement: '·' },
      { pattern: /\|\|/g, replacement: '+' },
      { pattern: /\|/g, replacement: '+' },
      { pattern: /[*x]/g, replacement: '·' },
      { pattern: /[!¬~]/g, replacement: "'" },
      { pattern: /\)\s*\(/g, replacement: ')·(' },
      // Caso 2: letra ) → letra·)
      { pattern: /([A-Za-z0-9])\s*\(/g, replacement: '$1·(' },
      // Caso 3: ) letra → )·letra
      { pattern: /\)\s*([A-Za-z0-9])/g, replacement: ')·$1' },
      // Caso 4: letra espacio letra → letra·letra
      { pattern: /([A-Za-z0-9])\s+([A-Za-z0-9])/g, replacement: '$1·$2' }
    
    ]
    
    textOperators.forEach(({ pattern, replacement }) => {
      normalized = normalized.replace(pattern, replacement)
    })
    
    // Agregar multiplicación implícita: AB -> A·B
    normalized = normalized.replace(/([A-Z])(\s*)([A-Z])/g, '$1·$3')
    normalized = normalized.replace(/([A-Z])(\s*)(\()/g, '$1·$3')
    normalized = normalized.replace(/(\))(\s*)([A-Z])/g, '$1·$3')
    normalized = normalized.replace(/(\))(\s*)(\()/g, '$1·$3')
    
    // Normalizar NOT pegado a variable y paréntesis: A ' -> A' y ' (A) -> (A)'
    normalized = normalized.replace(/([A-Z])\s*'/g, "$1'")
    // Prefijo NOT antes de paréntesis: '(A+B) o ! (A+B) -> (A+B)'
    normalized = normalized.replace(/'\s*\(/g, "'(")
    
    return normalized
  }

  // Tokenizar la expresión
  tokenize(expression) {
    const normalized = this.normalizeExpression(expression)
    const tokens = []
    let i = 0
    
    while (i < normalized.length) {
      const char = normalized[i]
      
      // Espacios en blanco
      if (/\s/.test(char)) {
        i++
        continue
      }
      
      // Variables (A-Z)
      if (/[A-Z]/i.test(char)) {
        let variable = char
        i++
        
        // Verificar si tiene complemento
        while (i < normalized.length && normalized[i] === "'") {
          variable += "'"
          i++
        }
        
        tokens.push({ type: 'VARIABLE', value: variable })
        continue
      }
      
      // Números (para constantes 0 y 1)
      if (/[01]/.test(char)) {
        tokens.push({ type: 'CONSTANT', value: parseInt(char) })
        i++
        continue
      }
      
      // Operadores
      if (char === '·' || char === '*' || char === 'x' || char === '&') {
        tokens.push({ type: 'OPERATOR', value: 'AND' })
        i++
        continue
      }
      
      if (char === '+' || char === '|') {
        tokens.push({ type: 'OPERATOR', value: 'OR' })
        i++
        continue
      }
      
      if (char === '⊕' || char === '^') {
        tokens.push({ type: 'OPERATOR', value: 'XOR' })
        i++
        continue
      }
      
      // Paréntesis
      if (char === '(') {
        tokens.push({ type: 'LPAREN', value: '(' })
        i++
        continue
      }
      
      if (char === ')') {
        tokens.push({ type: 'RPAREN', value: ')' })
        i++
        continue
      }
      
      // NOT (como prefijo)
      if (char === "'" || char === '!' || char === '¬' || char === '~') {
        tokens.push({ type: 'OPERATOR', value: 'NOT' })
        i++
        continue
      }
      
      // Carácter no reconocido
      throw new Error(`Carácter no reconocido: '${char}' en posición ${i}`)
    }
    
    return tokens
  }

  // Extraer variables únicas de la expresión
  extractVariables(tokens) {
    const variables = new Set()
    
    tokens.forEach(token => {
      if (token.type === 'VARIABLE') {
        // Remover complementos para obtener la variable base
        const baseVariable = token.value.replace(/'/g, '')
        variables.add(baseVariable)
      }
    })
    
    return Array.from(variables).sort()
  }

  // Convertir de infijo a postfijo (Shunting Yard Algorithm)
  infixToPostfix(tokens) {
    const output = []
    const operatorStack = []
    
    tokens.forEach((token, index) => {
      if (token.type === 'VARIABLE' || token.type === 'CONSTANT') {
        output.push(token)
      } else if (token.type === 'OPERATOR') {
        while (
          operatorStack.length > 0 &&
          operatorStack[operatorStack.length - 1].type === 'OPERATOR' &&
          this.precedence[operatorStack[operatorStack.length - 1].value] >= this.precedence[token.value]
        ) {
          output.push(operatorStack.pop())
        }
        operatorStack.push(token)
      } else if (token.type === 'LPAREN') {
        operatorStack.push(token)
      } else if (token.type === 'RPAREN') {
        while (
          operatorStack.length > 0 &&
          operatorStack[operatorStack.length - 1].type !== 'LPAREN'
        ) {
          output.push(operatorStack.pop())
        }
        
        if (operatorStack.length === 0) {
          throw new Error('Paréntesis no balanceados')
        }
        
        operatorStack.pop() // Remover '('
      }
    })
    
    while (operatorStack.length > 0) {
      const token = operatorStack.pop()
      if (token.type === 'LPAREN' || token.type === 'RPAREN') {
        throw new Error('Paréntesis no balanceados')
      }
      output.push(token)
    }
    
    return output
  }

  // Construir AST desde postfijo
  buildAST(postfixTokens) {
    const stack = []
    
    postfixTokens.forEach(token => {
      if (token.type === 'VARIABLE' || token.type === 'CONSTANT') {
        stack.push({
          type: token.type,
          value: token.value
        })
      } else if (token.type === 'OPERATOR') {
        if (token.value === 'NOT') {
          if (stack.length < 1) {
            throw new Error('Expresión inválida: operador NOT sin operando')
          }
          const operand = stack.pop()
          stack.push({
            type: 'UNARY_OP',
            operator: 'NOT',
            operand: operand
          })
        } else {
          if (stack.length < 2) {
            throw new Error(`Expresión inválida: operador ${token.value} necesita dos operandos`)
          }
          const right = stack.pop()
          const left = stack.pop()
          stack.push({
            type: 'BINARY_OP',
            operator: token.value,
            left: left,
            right: right
          })
        }
      }
    })
    
    if (stack.length !== 1) {
      throw new Error('Expresión inválida: múltiples árboles de expresión')
    }
    
    return stack[0]
  }

  // Evaluar AST con valores de variables
  evaluateAST(ast, values) {
    if (ast.type === 'CONSTANT') {
      return ast.value === 1
    }
    
    if (ast.type === 'VARIABLE') {
      const baseVariable = ast.value.replace(/'/g, '')
      const isComplemented = ast.value.includes("'")
      const value = values[baseVariable]
      
      if (value === undefined) {
        throw new Error(`Variable '${baseVariable}' no tiene valor asignado`)
      }
      
      return isComplemented ? !value : value
    }
    
    if (ast.type === 'UNARY_OP') {
      const operandValue = this.evaluateAST(ast.operand, values)
      
      if (ast.operator === 'NOT') {
        return !operandValue
      }
    }
    
    if (ast.type === 'BINARY_OP') {
      const leftValue = this.evaluateAST(ast.left, values)
      const rightValue = this.evaluateAST(ast.right, values)
      
      switch (ast.operator) {
        case 'AND':
          return leftValue && rightValue
        case 'OR':
          return leftValue || rightValue
        case 'XOR':
          return leftValue !== rightValue
        default:
          throw new Error(`Operador desconocido: ${ast.operator}`)
      }
    }
    
    throw new Error('Nodo AST inválido')
  }

  // Generar tabla de verdad
  generateTruthTable(ast, variables) {
    const numRows = Math.pow(2, variables.length)
    const table = []
    
    for (let i = 0; i < numRows; i++) {
      const values = {}
      const row = {}
      
      // Generar combinación de valores
      variables.forEach((variable, index) => {
        const bitPosition = variables.length - 1 - index
        const value = (i & (1 << bitPosition)) !== 0
        values[variable] = value
        row[variable] = value
      })
      
      // Evaluar resultado
      try {
        row.result = this.evaluateAST(ast, values)
        
        // Generar mintérmino y maxtérmino
        if (row.result) {
          const minTerms = variables.map((v, idx) => 
            row[v] ? v : `${v}'`
          )
          row.minTerm = minTerms.join('·')
        } else {
          const maxTerms = variables.map((v, idx) => 
            row[v] ? `${v}'` : v
          )
          row.maxTerm = `(${maxTerms.join('+')})`
        }
        
        table.push(row)
      } catch (error) {
        console.error('Error evaluando fila:', error)
        row.result = false
        row.error = error.message
        table.push(row)
      }
    }
    
    return table
  }

  // Función principal de parsing
  parse(expression) {
    if (!expression || expression.trim() === '') {
      return {
        success: false,
        errors: ['La expresión está vacía']
      }
    }
    
    try {
      const tokens = this.tokenize(expression)
      const variables = this.extractVariables(tokens)
      const postfix = this.infixToPostfix(tokens)
      const ast = this.buildAST(postfix)
      const normalized = this.normalizeExpression(expression)
      
      // Convertir postfix a string
      const postfixNotation = postfix.map(t => 
        t.type === 'OPERATOR' ? t.value : t.value
      ).join(' ')
      
      return {
        success: true,
        tokens: tokens,
        variables: variables,
        postfix: postfix,
        postfixNotation: postfixNotation,
        ast: ast,
        normalizedExpression: normalized,
        originalExpression: expression
      }
    } catch (error) {
      return {
        success: false,
        errors: [error.message],
        originalExpression: expression
      }
    }
  }

  // Obtener sugerencias de corrección
  getSuggestions(expression) {
    const suggestions = []
    
    // Verificar paréntesis balanceados
    const openCount = (expression.match(/\(/g) || []).length
    const closeCount = (expression.match(/\)/g) || []).length
    
    if (openCount !== closeCount) {
      suggestions.push(`Verifica los paréntesis: ${openCount} abiertos, ${closeCount} cerrados`)
    }
    
    // Verificar operadores consecutivos
    if (/[+·*][+·*]/.test(expression)) {
      suggestions.push('Evita operadores consecutivos (ej: ++, ··)')
    }
    
    // Verificar variables seguidas de operadores
    if (/[A-Z]\s*[+·*]\s*[+·*]/.test(expression)) {
      suggestions.push('Verifica la sintaxis de los operadores')
    }
    
    // Sugerir multiplicación implícita
    if (/[A-Z]\s+[A-Z]/.test(expression)) {
      suggestions.push('¿Querías multiplicar? Usa el operador · o * entre variables')
    }
    
    return suggestions
  }
}

export const booleanParser = new BooleanExpressionParser()