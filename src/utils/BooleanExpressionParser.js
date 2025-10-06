/**
 * Parser de Expresiones Booleanas Avanzado
 * Soporta múltiples notaciones y genera tablas de verdad automáticamente
 * 
 * Notaciones soportadas:
 * - Matemática: A·B + C', A + B·C
 * - Programación: A && B || !C, A || B && C
 * - Lógica formal: A ∧ B ∨ ¬C, A ∨ B ∧ C
 * - ASCII: A AND B OR NOT C, A OR B AND C
 */

export class BooleanExpressionParser {
  constructor() {
    this.operators = {
      // Operadores matemáticos
      '·': { precedence: 3, associativity: 'left', type: 'AND' },
      '+': { precedence: 2, associativity: 'left', type: 'OR' },
      "'": { precedence: 4, associativity: 'right', type: 'NOT' },
      
      // Operadores de programación
      '&&': { precedence: 3, associativity: 'left', type: 'AND' },
      '||': { precedence: 2, associativity: 'left', type: 'OR' },
      '!': { precedence: 4, associativity: 'right', type: 'NOT' },
      
      // Operadores lógicos formales
      '∧': { precedence: 3, associativity: 'left', type: 'AND' },
      '∨': { precedence: 2, associativity: 'left', type: 'OR' },
      '¬': { precedence: 4, associativity: 'right', type: 'NOT' },
      
      // Operadores ASCII
      'AND': { precedence: 3, associativity: 'left', type: 'AND' },
      'OR': { precedence: 2, associativity: 'left', type: 'OR' },
      'NOT': { precedence: 4, associativity: 'right', type: 'NOT' }
    }
    
    this.variables = new Set()
    this.errors = []
  }

  /**
   * Parsea una expresión booleana y la convierte a notación canónica
   */
  parse(expression) {
    this.errors = []
    this.variables.clear()
    
    try {
      // Normalizar la expresión
      const normalized = this.normalizeExpression(expression)
      
      // Convertir a tokens
      const tokens = this.tokenize(normalized)
      
      // Validar sintaxis
      this.validateSyntax(tokens)
      
      if (this.errors.length > 0) {
        return { success: false, errors: this.errors }
      }
      
      // Convertir a notación postfija (RPN)
      const postfix = this.infixToPostfix(tokens)
      
      // Generar árbol de sintaxis
      const ast = this.buildAST(postfix)
      
      return {
        success: true,
        ast,
        variables: Array.from(this.variables).sort(),
        originalExpression: expression,
        normalizedExpression: normalized,
        postfixNotation: postfix.map(t => t.value).join(' ')
      }
      
    } catch (error) {
      this.errors.push(`Error de parsing: ${error.message}`)
      return { success: false, errors: this.errors }
    }
  }

  /**
   * Normaliza la expresión para procesamiento uniforme
   */
  normalizeExpression(expression) {
    return expression
      .replace(/\s+/g, ' ') // Normalizar espacios
      .replace(/AND/gi, 'AND') // Normalizar AND
      .replace(/OR/gi, 'OR') // Normalizar OR
      .replace(/NOT/gi, 'NOT') // Normalizar NOT
      .trim()
  }

  /**
   * Tokeniza la expresión en componentes
   */
  tokenize(expression) {
    const tokens = []
    let i = 0
    
    while (i < expression.length) {
      const char = expression[i]
      
      // Saltar espacios
      if (char === ' ') {
        i++
        continue
      }
      
      // Paréntesis
      if (char === '(' || char === ')') {
        tokens.push({ type: 'parenthesis', value: char })
        i++
        continue
      }
      
      // Variables (letras mayúsculas/minúsculas)
      if (/[a-zA-Z]/.test(char)) {
        let variable = char
        i++
        
        // Capturar variables multi-carácter (como AND, OR, NOT)
        while (i < expression.length && /[a-zA-Z]/.test(expression[i])) {
          variable += expression[i]
          i++
        }
        
        // Verificar si es un operador de palabra
        if (['AND', 'OR', 'NOT'].includes(variable.toUpperCase())) {
          tokens.push({ type: 'operator', value: variable.toUpperCase() })
        } else {
          tokens.push({ type: 'variable', value: variable.toUpperCase() })
          this.variables.add(variable.toUpperCase())
        }
        continue
      }
      
      // Operadores de símbolo
      if (this.operators[char]) {
        tokens.push({ type: 'operator', value: char })
        i++
        continue
      }
      
      // Operadores de dos caracteres
      if (i + 1 < expression.length) {
        const twoChar = expression.substring(i, i + 2)
        if (this.operators[twoChar]) {
          tokens.push({ type: 'operator', value: twoChar })
          i += 2
          continue
        }
      }
      
      // Carácter no reconocido
      this.errors.push(`Carácter no reconocido: '${char}' en posición ${i}`)
      i++
    }
    
    return tokens
  }

  /**
   * Valida la sintaxis de los tokens
   */
  validateSyntax(tokens) {
    let parenCount = 0
    let expectingOperand = true
    
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      const prevToken = i > 0 ? tokens[i - 1] : null
      
      if (token.type === 'parenthesis') {
        if (token.value === '(') {
          parenCount++
          if (!expectingOperand) {
            this.errors.push(`Operador esperado antes de '(' en posición ${i}`)
          }
        } else {
          parenCount--
          if (parenCount < 0) {
            this.errors.push(`Paréntesis de cierre sin apertura en posición ${i}`)
          }
          expectingOperand = false
        }
      } else if (token.type === 'variable') {
        if (!expectingOperand) {
          this.errors.push(`Operador esperado antes de variable '${token.value}' en posición ${i}`)
        }
        expectingOperand = false
      } else if (token.type === 'operator') {
        const op = this.operators[token.value]
        
        if (op.type === 'NOT') {
          if (!expectingOperand) {
            this.errors.push(`Operador NOT debe preceder a un operando en posición ${i}`)
          }
          // NOT no cambia el estado de expectingOperand
        } else {
          if (expectingOperand) {
            this.errors.push(`Operando esperado antes de operador '${token.value}' en posición ${i}`)
          }
          expectingOperand = true
        }
      }
    }
    
    if (parenCount !== 0) {
      this.errors.push('Paréntesis no balanceados')
    }
    
    if (expectingOperand) {
      this.errors.push('Expresión incompleta: operando esperado al final')
    }
  }

  /**
   * Convierte notación infija a postfija (RPN)
   */
  infixToPostfix(tokens) {
    const output = []
    const stack = []
    
    for (const token of tokens) {
      if (token.type === 'variable') {
        output.push(token)
      } else if (token.type === 'operator') {
        const op = this.operators[token.value]
        
        if (op.type === 'NOT') {
          stack.push(token)
        } else {
          while (stack.length > 0 && 
                 stack[stack.length - 1].type === 'operator' &&
                 this.operators[stack[stack.length - 1].value].precedence >= op.precedence) {
            output.push(stack.pop())
          }
          stack.push(token)
        }
      } else if (token.value === '(') {
        stack.push(token)
      } else if (token.value === ')') {
        while (stack.length > 0 && stack[stack.length - 1].value !== '(') {
          output.push(stack.pop())
        }
        if (stack.length > 0) {
          stack.pop() // Remover '('
        }
      }
    }
    
    while (stack.length > 0) {
      output.push(stack.pop())
    }
    
    return output
  }

  /**
   * Construye el Árbol de Sintaxis Abstracta (AST)
   */
  buildAST(postfixTokens) {
    const stack = []
    
    for (const token of postfixTokens) {
      if (token.type === 'variable') {
        stack.push({
          type: 'variable',
          value: token.value,
          children: []
        })
      } else if (token.type === 'operator') {
        const op = this.operators[token.value]
        
        if (op.type === 'NOT') {
          if (stack.length === 0) {
            throw new Error('Operador NOT sin operando')
          }
          const operand = stack.pop()
          stack.push({
            type: 'operation',
            operator: token.value,
            operationType: op.type,
            children: [operand]
          })
        } else {
          if (stack.length < 2) {
            throw new Error(`Operador ${token.value} necesita dos operandos`)
          }
          const right = stack.pop()
          const left = stack.pop()
          stack.push({
            type: 'operation',
            operator: token.value,
            operationType: op.type,
            children: [left, right]
          })
        }
      }
    }
    
    if (stack.length !== 1) {
      throw new Error('Expresión mal formada')
    }
    
    return stack[0]
  }

  /**
   * Evalúa el AST con valores específicos de variables
   */
  evaluateAST(ast, variableValues) {
    if (ast.type === 'variable') {
      const value = variableValues[ast.value]
      if (value === undefined) {
        throw new Error(`Variable '${ast.value}' no tiene valor asignado`)
      }
      return Boolean(value)
    }
    
    if (ast.type === 'operation') {
      const op = ast.operationType
      
      if (op === 'NOT') {
        return !this.evaluateAST(ast.children[0], variableValues)
      } else if (op === 'AND') {
        return this.evaluateAST(ast.children[0], variableValues) && 
               this.evaluateAST(ast.children[1], variableValues)
      } else if (op === 'OR') {
        return this.evaluateAST(ast.children[0], variableValues) || 
               this.evaluateAST(ast.children[1], variableValues)
      }
    }
    
    throw new Error('Tipo de nodo AST no reconocido')
  }

  /**
   * Genera todas las combinaciones de valores para las variables
   */
  generateVariableCombinations(variables) {
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
   * Genera la tabla de verdad completa
   */
  generateTruthTable(ast, variables) {
    const combinations = this.generateVariableCombinations(variables)
    const table = []
    
    for (const combination of combinations) {
      try {
        const result = this.evaluateAST(ast, combination)
        table.push({
          ...combination,
          result: result
        })
      } catch (error) {
        console.error('Error evaluando combinación:', combination, error)
        table.push({
          ...combination,
          result: false,
          error: error.message
        })
      }
    }
    
    return table
  }

  /**
   * Convierte expresión a diferentes notaciones
   */
  convertToNotation(ast, targetNotation) {
    const notationMap = {
      'mathematical': { AND: '·', OR: '+', NOT: "'" },
      'programming': { AND: '&&', OR: '||', NOT: '!' },
      'formal': { AND: '∧', OR: '∨', NOT: '¬' },
      'ascii': { AND: 'AND', OR: 'OR', NOT: 'NOT' }
    }
    
    const operators = notationMap[targetNotation] || notationMap['mathematical']
    
    return this.astToString(ast, operators)
  }

  /**
   * Convierte AST a string con notación específica
   */
  astToString(ast, operators) {
    if (ast.type === 'variable') {
      return ast.value
    }
    
    if (ast.type === 'operation') {
      const op = operators[ast.operationType] || ast.operator
      
      if (ast.operationType === 'NOT') {
        return `${op}${this.astToString(ast.children[0], operators)}`
      } else {
        const left = this.astToString(ast.children[0], operators)
        const right = this.astToString(ast.children[1], operators)
        
        // Agregar paréntesis si es necesario
        const needsParens = ast.children[0].type === 'operation' && 
                          ast.children[0].operationType !== ast.operationType
        
        const leftStr = needsParens ? `(${left})` : left
        return `${leftStr} ${op} ${right}`
      }
    }
    
    return ''
  }

  /**
   * Valida si una expresión es sintácticamente correcta
   */
  isValidExpression(expression) {
    const result = this.parse(expression)
    return result.success
  }

  /**
   * Obtiene sugerencias para expresiones mal formadas
   */
  getSuggestions(expression) {
    const suggestions = []
    
    // Detectar errores comunes
    if (expression.includes('  ')) {
      suggestions.push('Elimina espacios dobles')
    }
    
    if (expression.includes('AND AND') || expression.includes('OR OR')) {
      suggestions.push('Elimina operadores duplicados')
    }
    
    if (expression.includes('()')) {
      suggestions.push('Elimina paréntesis vacíos')
    }
    
    if (!/[a-zA-Z]/.test(expression)) {
      suggestions.push('Agrega al menos una variable')
    }
    
    return suggestions
  }
}

// Exportar instancia singleton
export const booleanParser = new BooleanExpressionParser()
export default booleanParser
