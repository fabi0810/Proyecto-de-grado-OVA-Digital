import { useState, useEffect } from 'react'

const InteractiveLab = () => {
  const [labMode, setLabMode] = useState('free') 
  const [inputValue, setInputValue] = useState('')
  const [fromBase, setFromBase] = useState(10)
  const [toBase, setToBase] = useState(2)
  const [userResult, setUserResult] = useState('')
  const [correctResult, setCorrectResult] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [score, setScore] = useState(0)
  const [history, setHistory] = useState([])
  const [currentChallenge, setCurrentChallenge] = useState(null)

  const bases = [
    { value: 2, name: 'Binario', color: 'bg-blue-100 text-blue-800' },
    { value: 8, name: 'Octal', color: 'bg-green-100 text-green-800' },
    { value: 10, name: 'Decimal', color: 'bg-purple-100 text-purple-800' },
    { value: 16, name: 'Hexadecimal', color: 'bg-orange-100 text-orange-800' }
  ]

  const challenges = [
    {
      id: 1,
      title: 'Conversión Básica',
      description: 'Convierte 15 decimal a binario',
      input: '15',
      fromBase: 10,
      toBase: 2,
      expected: '1111',
      hint: 'Divide 15 repetidamente por 2 y toma los residuos'
    },
    {
      id: 2,
      title: 'Hexadecimal a Decimal',
      description: 'Convierte FF hexadecimal a decimal',
      input: 'FF',
      fromBase: 16,
      toBase: 10,
      expected: '255',
      hint: 'F = 15, entonces FF = 15×16¹ + 15×16⁰'
    },
    {
      id: 3,
      title: 'Binario a Octal',
      description: 'Convierte 101101 binario a octal',
      input: '101101',
      fromBase: 2,
      toBase: 8,
      expected: '55',
      hint: 'Agrupa los bits de 3 en 3 desde la derecha'
    },
    {
      id: 4,
      title: 'Octal a Hexadecimal',
      description: 'Convierte 377 octal a hexadecimal',
      input: '377',
      fromBase: 8,
      toBase: 16,
      expected: 'FF',
      hint: 'Primero convierte a decimal, luego a hexadecimal'
    }
  ]

  const convertNumber = (value, fromBase, toBase) => {
    try {
      if (!value.trim()) return ''
      
      // Validar entrada
      const validChars = {
        2: /^[01]+$/,
        8: /^[0-7]+$/,
        10: /^[0-9]+$/,
        16: /^[0-9A-Fa-f]+$/
      }
      
      if (!validChars[fromBase].test(value)) {
        throw new Error(`Valor inválido para base ${fromBase}`)
      }
      
      const decimalValue = parseInt(value, fromBase)
      if (isNaN(decimalValue)) {
        throw new Error('Error en la conversión')
      }
      
      // Convertir a base destino
      if (toBase === 10) {
        return decimalValue.toString()
      } else {
        return decimalValue.toString(toBase).toUpperCase()
      }
    } catch (error) {
      throw error
    }
  }

  const handleConversion = () => {
    try {
      const result = convertNumber(inputValue, fromBase, toBase)
      setCorrectResult(result)
      setShowResult(true)
      
      // Agregar a historial
      const newEntry = {
        id: Date.now(),
        input: inputValue,
        fromBase: fromBase,
        toBase: toBase,
        result: result,
        timestamp: new Date().toLocaleTimeString()
      }
      setHistory(prev => [newEntry, ...prev.slice(0, 9)]) 
      
    } catch (error) {
      setFeedback(`Error: ${error.message}`)
      setShowResult(false)
    }
  }

  const handleChallengeSubmit = () => {
    if (!currentChallenge) return
    
    setAttempts(prev => prev + 1)
    
    const normalizedUserResult = userResult.trim().toUpperCase()
    const normalizedExpected = currentChallenge.expected.toUpperCase()
    
    if (normalizedUserResult === normalizedExpected) {
      setFeedback('¡Correcto! 🎉')
      setScore(prev => prev + 1)
      setShowResult(true)
      
      // Generar nuevo desafío
      setTimeout(() => {
        generateNewChallenge()
        setUserResult('')
        setFeedback('')
        setShowResult(false)
      }, 2000)
    } else {
      setFeedback(`Incorrecto. Inténtalo de nuevo. Pista: ${currentChallenge.hint}`)
      setShowResult(false)
    }
  }

  const generateNewChallenge = () => {
    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)]
    setCurrentChallenge(randomChallenge)
    setInputValue(randomChallenge.input)
    setFromBase(randomChallenge.fromBase)
    setToBase(randomChallenge.toBase)
    setUserResult('')
    setFeedback('')
    setShowResult(false)
  }

  const startChallenge = () => {
    setLabMode('challenge')
    setScore(0)
    setAttempts(0)
    generateNewChallenge()
  }

  const resetLab = () => {
    setInputValue('')
    setUserResult('')
    setCorrectResult('')
    setShowResult(false)
    setFeedback('')
    setHistory([])
    setCurrentChallenge(null)
  }

  useEffect(() => {
    if (labMode === 'free' && inputValue && fromBase && toBase) {
      try {
        const result = convertNumber(inputValue, fromBase, toBase)
        setCorrectResult(result)
      } catch (error) {
        setCorrectResult('')
      }
    }
  }, [inputValue, fromBase, toBase, labMode])

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Laboratorio Interactivo
        </h2>
        <p className="text-gray-600">
          Experimenta con conversiones numéricas y pon a prueba tus conocimientos
        </p>
      </div>

      <div className="flex justify-center space-x-4 mb-8">
       
        <button
          onClick={() => setLabMode('guided')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            labMode === 'guided'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Guiado
        </button>
        <button
          onClick={startChallenge}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            labMode === 'challenge'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Desafío
        </button>
      </div>

      {/* Estadísticas del desafío */}
      {labMode === 'challenge' && (
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-blue-900">Desafío Activo</h3>
              <p className="text-sm text-blue-700">
                Puntuación: {score} | Intentos: {attempts}
              </p>
            </div>
            <button
              onClick={resetLab}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Reiniciar
            </button>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Panel de entrada */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">
            {labMode === 'challenge' ? 'Desafío Actual' : 'Configuración'}
          </h3>

          {labMode === 'challenge' && currentChallenge ? (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">
                {currentChallenge.title}
              </h4>
              <p className="text-yellow-700 mb-3">
                {currentChallenge.description}
              </p>
              <div className="text-sm text-yellow-600">
                <strong>Pista:</strong> {currentChallenge.hint}
              </div>
            </div>
          ) : null}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor de entrada
              </label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ingresa un número"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={labMode === 'challenge'}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desde (Base)
                </label>
                <select
                  value={fromBase}
                  onChange={(e) => setFromBase(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={labMode === 'challenge'}
                >
                  {bases.map(base => (
                    <option key={base.value} value={base.value}>
                      {base.name} ({base.value})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hacia (Base)
                </label>
                <select
                  value={toBase}
                  onChange={(e) => setToBase(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={labMode === 'challenge'}
                >
                  {bases.map(base => (
                    <option key={base.value} value={base.value}>
                      {base.name} ({base.value})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {labMode === 'challenge' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tu respuesta
                </label>
                <input
                  type="text"
                  value={userResult}
                  onChange={(e) => setUserResult(e.target.value)}
                  placeholder="Ingresa tu respuesta"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            ) : null}

            <div className="flex space-x-3">
              {labMode === 'challenge' ? (
                <button
                  onClick={handleChallengeSubmit}
                  className="btn-primary flex-1"
                  disabled={!userResult.trim()}
                >
                  Verificar Respuesta
                </button>
              ) : (
                <button
                  onClick={handleConversion}
                  className="btn-primary flex-1"
                  disabled={!inputValue.trim()}
                >
                  Convertir
                </button>
              )}
              <button
                onClick={resetLab}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>

        {/* Panel de resultados */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Resultados</h3>

          {feedback && (
            <div className={`p-3 rounded-md mb-4 ${
              feedback.includes('Correcto') || feedback.includes('🎉')
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {feedback}
            </div>
          )}

          {showResult && (
            <div className="space-y-4">
              <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                <h4 className="font-semibold text-primary-800 mb-2">Resultado:</h4>
                <div className="text-2xl font-mono text-primary-600">
                  {toBase === 16 ? `0x${correctResult}` :
                   toBase === 8 ? `0o${correctResult}` :
                   toBase === 2 ? `0b${correctResult}` : correctResult}
                </div>
                <div className="text-sm text-primary-600 mt-1">
                  Base {toBase}
                </div>
              </div>

              {labMode === 'free' && (
                <div className="text-sm text-gray-600">
                  <p><strong>Entrada:</strong> {inputValue} (Base {fromBase})</p>
                  <p><strong>Salida:</strong> {correctResult} (Base {toBase})</p>
                </div>
              )}
            </div>
          )}

          {/* Historial */}
          {history.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Historial Reciente</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {history.map(entry => (
                  <div key={entry.id} className="p-2 bg-gray-50 rounded text-sm">
                    <div className="flex justify-between">
                      <span className="font-mono">
                        {entry.input} ({entry.fromBase}) → {entry.result} ({entry.toBase})
                      </span>
                      <span className="text-gray-500">{entry.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Guía de validación */}
      <div className="card bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">Guía de Validación</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          {bases.map(base => (
            <div key={base.value} className={`p-3 rounded ${base.color}`}>
              <div className="font-semibold">{base.name}</div>
              <div className="text-xs mt-1">
                Dígitos válidos: {base.value === 2 ? '0, 1' :
                                base.value === 8 ? '0-7' :
                                base.value === 10 ? '0-9' : '0-9, A-F'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InteractiveLab