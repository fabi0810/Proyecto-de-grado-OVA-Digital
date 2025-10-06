import { useState, useEffect } from 'react'
import { booleanParser } from '../../utils/BooleanExpressionParser'

function BooleanExpressionEditor({ expression, onExpressionChange, parsedExpression }) {
  const [inputValue, setInputValue] = useState(expression)
  const [showHelp, setShowHelp] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    setInputValue(expression)
  }, [expression])

  const handleInputChange = (value) => {
    setInputValue(value)
    onExpressionChange(value)
    
    // Generar sugerencias si hay errores
    if (value.trim() && parsedExpression && !parsedExpression.success) {
      const suggestions = booleanParser.getSuggestions(value)
      setSuggestions(suggestions)
    } else {
      setSuggestions([])
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (parsedExpression && parsedExpression.success) {
        // Expresión válida, procesar
        console.log('Expresión válida procesada')
      }
    }
  }

  const insertSymbol = (symbol) => {
    const textarea = document.getElementById('expression-input')
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newValue = inputValue.substring(0, start) + symbol + inputValue.substring(end)
    
    setInputValue(newValue)
    onExpressionChange(newValue)
    
    // Restaurar cursor
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + symbol.length, start + symbol.length)
    }, 0)
  }

  const clearExpression = () => {
    setInputValue('')
    onExpressionChange('')
    setSuggestions([])
  }

  const loadExample = (example) => {
    setInputValue(example)
    onExpressionChange(example)
  }

  const examples = [
    'A·B + C',
    'A + B·C\'',
    '(A + B)·(C + D)',
    'A·B\' + A\'·B',
    'A + A\'·B',
    'A·B + A·C + B·C'
  ]

  const symbols = [
    { symbol: '·', name: 'AND', description: 'Producto lógico' },
    { symbol: '+', name: 'OR', description: 'Suma lógica' },
    { symbol: "'", name: 'NOT', description: 'Complemento' },
    { symbol: '(', name: 'Abrir', description: 'Paréntesis' },
    { symbol: ')', name: 'Cerrar', description: 'Paréntesis' }
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Editor de Expresiones Booleanas</h2>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          <span>❓</span>
          <span>Ayuda</span>
        </button>
      </div>

      {/* Input Principal */}
      <div className="space-y-4">
        <div className="relative">
          <label htmlFor="expression-input" className="block text-sm font-medium text-gray-700 mb-2">
            Expresión Booleana
          </label>
          <div className="relative">
            <textarea
              id="expression-input"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ingresa una expresión booleana (ej: A·B + C')"
              className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none font-mono text-lg"
            />
            <button
              onClick={clearExpression}
              className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Símbolos Rápidos */}
        <div className="flex flex-wrap gap-2">
          {symbols.map((symbol) => (
            <button
              key={symbol.symbol}
              onClick={() => insertSymbol(symbol.symbol)}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
              title={`${symbol.name}: ${symbol.description}`}
            >
              {symbol.symbol}
            </button>
          ))}
        </div>

        {/* Estado de Validación */}
        {inputValue.trim() && (
          <div className="flex items-center space-x-3">
            {parsedExpression && parsedExpression.success ? (
              <div className="flex items-center space-x-2 text-green-600">
                <span className="text-xl">✅</span>
                <span className="font-medium">Expresión válida</span>
              </div>
            ) : parsedExpression && !parsedExpression.success ? (
              <div className="flex items-center space-x-2 text-red-600">
                <span className="text-xl">❌</span>
                <span className="font-medium">Expresión inválida</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-gray-500">
                <span className="text-xl">⏳</span>
                <span className="font-medium">Validando...</span>
              </div>
            )}
          </div>
        )}

        {/* Errores y Sugerencias */}
        {parsedExpression && !parsedExpression.success && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-800 mb-2">Errores encontrados:</h4>
            <ul className="space-y-1 text-sm text-red-700">
              {parsedExpression.errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
            {suggestions.length > 0 && (
              <div className="mt-3">
                <h5 className="font-medium text-red-800 mb-1">Sugerencias:</h5>
                <ul className="space-y-1 text-sm text-red-600">
                  {suggestions.map((suggestion, index) => (
                    <li key={index}>• {suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Información de la Expresión */}
        {parsedExpression && parsedExpression.success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-3">Información de la Expresión</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-green-700">Variables:</span>
                <span className="ml-2 text-green-600">
                  {parsedExpression.variables.join(', ')}
                </span>
              </div>
              <div>
                <span className="font-medium text-green-700">Notación Postfija:</span>
                <span className="ml-2 text-green-600 font-mono">
                  {parsedExpression.postfixNotation}
                </span>
              </div>
              <div>
                <span className="font-medium text-green-700">Expresión Normalizada:</span>
                <span className="ml-2 text-green-600 font-mono">
                  {parsedExpression.normalizedExpression}
                </span>
              </div>
              <div>
                <span className="font-medium text-green-700">Combinaciones:</span>
                <span className="ml-2 text-green-600">
                  {Math.pow(2, parsedExpression.variables.length)} filas en tabla de verdad
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Panel de Ayuda */}
      {showHelp && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Guía de Uso</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-700 mb-2">Notaciones Soportadas</h4>
              <ul className="space-y-1 text-sm text-blue-600">
                <li>• <strong>Matemática:</strong> A·B + C'</li>
                <li>• <strong>Programación:</strong> A && B || !C</li>
                <li>• <strong>Lógica Formal:</strong> A ∧ B ∨ ¬C</li>
                <li>• <strong>ASCII:</strong> A AND B OR NOT C</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-blue-700 mb-2">Ejemplos de Expresiones</h4>
              <ul className="space-y-1 text-sm text-blue-600">
                <li>• A·B + C (Suma de productos)</li>
                <li>• (A + B)·(C + D) (Producto de sumas)</li>
                <li>• A·B' + A'·B (XOR lógico)</li>
                <li>• A + A'·B (Absorción)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Ejemplos Rápidos */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Ejemplos Rápidos</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => loadExample(example)}
              className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-mono transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BooleanExpressionEditor
