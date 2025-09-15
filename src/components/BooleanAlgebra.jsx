import { useState } from 'react'

function BooleanAlgebra() {
  const [expression, setExpression] = useState('')
  const [variables, setVariables] = useState([])
  const [truthTable, setTruthTable] = useState([])
  const [simplifiedExpression, setSimplifiedExpression] = useState('')

  const operators = ['AND', 'OR', 'NOT', '(', ')']
  const commonExpressions = [
    'A AND B',
    'A OR B',
    'NOT A',
    '(A AND B) OR (NOT A AND C)',
    'A AND (B OR C)',
    '(A OR B) AND (NOT A OR C)'
  ]

  const extractVariables = (expr) => {
    const vars = new Set()
    const regex = /[A-Z]/g
    let match
    while ((match = regex.exec(expr)) !== null) {
      vars.add(match[0])
    }
    return Array.from(vars).sort()
  }

  const evaluateExpression = (expr, values) => {
    // Reemplazar variables con valores
    let evalExpr = expr
    Object.entries(values).forEach(([varName, value]) => {
      const regex = new RegExp(`\\b${varName}\\b`, 'g')
      evalExpr = evalExpr.replace(regex, value ? 'true' : 'false')
    })

    // Reemplazar operadores con operadores de JavaScript
    evalExpr = evalExpr
      .replace(/\bAND\b/g, '&&')
      .replace(/\bOR\b/g, '||')
      .replace(/\bNOT\b/g, '!')

    try {
      return eval(evalExpr)
    } catch (error) {
      return false
    }
  }

  const generateTruthTable = () => {
    if (!expression.trim()) return

    const vars = extractVariables(expression)
    setVariables(vars)

    if (vars.length === 0) return

    const rows = Math.pow(2, vars.length)
    const table = []

    for (let i = 0; i < rows; i++) {
      const row = {}
      vars.forEach((varName, index) => {
        row[varName] = (i & (1 << (vars.length - 1 - index))) !== 0
      })
      row.result = evaluateExpression(expression, row)
      table.push(row)
    }

    setTruthTable(table)
  }

  const simplifyExpression = () => {
    if (!expression.trim()) return

    // Simplificaciones básicas
    let simplified = expression
      .replace(/\bA AND A\b/g, 'A')
      .replace(/\bA OR A\b/g, 'A')
      .replace(/\bA AND 1\b/g, 'A')
      .replace(/\bA OR 0\b/g, 'A')
      .replace(/\bA AND 0\b/g, '0')
      .replace(/\bA OR 1\b/g, '1')
      .replace(/\bNOT NOT A\b/g, 'A')

    setSimplifiedExpression(simplified)
  }

  const loadExample = (example) => {
    setExpression(example)
    setTruthTable([])
    setSimplifiedExpression('')
  }

  const clearAll = () => {
    setExpression('')
    setVariables([])
    setTruthTable([])
    setSimplifiedExpression('')
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Laboratorio de Álgebra de Boole
        </h1>
        <p className="text-gray-600">
          Practica y resuelve expresiones booleanas con tablas de verdad y simplificación.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Panel de Entrada */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Expresión Booleana
            </h3>
            <textarea
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="Ingresa una expresión booleana (ej: A AND B OR NOT C)"
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            
            <div className="mt-4 space-y-2">
              <button
                onClick={generateTruthTable}
                className="btn-primary w-full"
              >
                Generar Tabla de Verdad
              </button>
              
              <button
                onClick={simplifyExpression}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Simplificar Expresión
              </button>
              
              <button
                onClick={clearAll}
                className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Limpiar Todo
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Operadores Disponibles
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {operators.map(op => (
                <div key={op} className="px-3 py-2 bg-gray-100 rounded text-center font-mono text-sm">
                  {op}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Usa AND, OR, NOT para operadores lógicos
            </p>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ejemplos Predefinidos
            </h3>
            <div className="space-y-2">
              {commonExpressions.map((example, index) => (
                <button
                  key={index}
                  onClick={() => loadExample(example)}
                  className="w-full text-left px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors duration-200"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="space-y-6">
          {simplifiedExpression && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Expresión Simplificada
              </h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="font-mono text-green-800 text-lg">
                  {simplifiedExpression}
                </p>
              </div>
            </div>
          )}

          {truthTable.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tabla de Verdad
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      {variables.map(varName => (
                        <th key={varName} className="border border-gray-300 px-3 py-2 text-center font-medium">
                          {varName}
                        </th>
                      ))}
                      <th className="border border-gray-300 px-3 py-2 text-center font-medium bg-blue-100">
                        Resultado
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {truthTable.map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {variables.map(varName => (
                          <td key={varName} className="border border-gray-300 px-3 py-2 text-center">
                            <span className={`inline-block w-6 h-6 rounded-full text-sm font-bold flex items-center justify-center ${
                              row[varName]
                                ? 'bg-green-500 text-white'
                                : 'bg-red-500 text-white'
                            }`}>
                              {row[varName] ? '1' : '0'}
                            </span>
                          </td>
                        ))}
                        <td className="border border-gray-300 px-3 py-2 text-center">
                          <span className={`inline-block w-6 h-6 rounded-full text-sm font-bold flex items-center justify-center ${
                            row.result
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                          }`}>
                            {row.result ? '1' : '0'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Información Educativa */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Leyes del Álgebra de Boole
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-2">Leyes de Identidad</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>A AND 1 = A</li>
              <li>A OR 0 = A</li>
              <li>A AND 0 = 0</li>
              <li>A OR 1 = 1</li>
            </ul>
          </div>
          
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-2">Leyes de Idempotencia</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>A AND A = A</li>
              <li>A OR A = A</li>
            </ul>
          </div>
          
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-2">Leyes de Complemento</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>A AND NOT A = 0</li>
              <li>A OR NOT A = 1</li>
              <li>NOT NOT A = A</li>
            </ul>
          </div>
          
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-2">Leyes Distributivas</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>A AND (B OR C) = (A AND B) OR (A AND C)</li>
              <li>A OR (B AND C) = (A OR B) AND (A OR C)</li>
            </ul>
          </div>
          
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-2">Leyes de De Morgan</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>NOT (A AND B) = NOT A OR NOT B</li>
              <li>NOT (A OR B) = NOT A AND NOT B</li>
            </ul>
          </div>
          
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-2">Leyes Conmutativas</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>A AND B = B AND A</li>
              <li>A OR B = B OR A</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BooleanAlgebra
