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
  const [conversionType, setConversionType] = useState('all')

  const bases = [
    { value: 2, name: 'Binario', color: 'bg-blue-100 text-blue-800' },
    { value: 8, name: 'Octal', color: 'bg-green-100 text-green-800' },
    { value: 10, name: 'Decimal', color: 'bg-purple-100 text-purple-800' },
    { value: 16, name: 'Hexadecimal', color: 'bg-orange-100 text-orange-800' }
  ]

  const conversionTypes = [
    { id: 'all', label: 'Todos los Tipos' },
    { id: 'binary', label: 'Conversiones Binarias' },
    { id: 'decimal', label: 'Desde/Hacia Decimal' },
    { id: 'hex', label: 'Conversiones Hexadecimales' },
    { id: 'octal', label: 'Conversiones Octales' },
    { id: 'mixed', label: 'Conversiones Mixtas' }
  ]

  const conversionTemplates = {
    binary: [
      { from: 10, to: 2, range: [1, 255], name: 'Decimal → Binario' },
      { from: 2, to: 10, bits: [4, 6, 8], name: 'Binario → Decimal' },
      { from: 2, to: 16, bits: [4, 8, 12], name: 'Binario → Hexadecimal' },
      { from: 16, to: 2, range: [1, 255], name: 'Hexadecimal → Binario' }
    ],
    decimal: [
      { from: 10, to: 2, range: [1, 1023], name: 'Decimal → Binario' },
      { from: 10, to: 8, range: [1, 511], name: 'Decimal → Octal' },
      { from: 10, to: 16, range: [1, 255], name: 'Decimal → Hexadecimal' },
      { from: 2, to: 10, bits: [4, 6, 8, 10], name: 'Binario → Decimal' },
      { from: 8, to: 10, range: [1, 777], name: 'Octal → Decimal' },
      { from: 16, to: 10, range: [1, 255], name: 'Hexadecimal → Decimal' }
    ],
    hex: [
      { from: 16, to: 2, range: [1, 255], name: 'Hex → Binario' },
      { from: 16, to: 8, range: [1, 255], name: 'Hex → Octal' },
      { from: 16, to: 10, range: [1, 4095], name: 'Hex → Decimal' },
      { from: 2, to: 16, bits: [4, 8, 12], name: 'Binario → Hex' },
      { from: 8, to: 16, range: [1, 377], name: 'Octal → Hex' },
      { from: 10, to: 16, range: [1, 4095], name: 'Decimal → Hex' }
    ],
    octal: [
      { from: 8, to: 2, range: [1, 377], name: 'Octal → Binario' },
      { from: 8, to: 10, range: [1, 777], name: 'Octal → Decimal' },
      { from: 8, to: 16, range: [1, 377], name: 'Octal → Hexadecimal' },
      { from: 2, to: 8, bits: [6, 9, 12], name: 'Binario → Octal' },
      { from: 10, to: 8, range: [1, 511], name: 'Decimal → Octal' },
      { from: 16, to: 8, range: [1, 255], name: 'Hex → Octal' }
    ],
    mixed: [
      { from: 2, to: 8, bits: [6, 9, 12], name: 'Binario → Octal (Agrupación)' },
      { from: 8, to: 16, range: [1, 377], name: 'Octal → Hex (Via Decimal)' },
      { from: 16, to: 8, range: [10, 255], name: 'Hex → Octal (Conversión Directa)' },
      { from: 2, to: 16, bits: [8, 12, 16], name: 'Binario → Hex (Agrupación 4 bits)' }
    ]
  }
//me genera los retos variados 
  const generateVariedChallenge = (type) => {
    const templates = type === 'all' 
      ? Object.values(conversionTemplates).flat()
      : conversionTemplates[type] || conversionTemplates.decimal

    const template = templates[Math.floor(Math.random() * templates.length)]
    
    let inputVal, expectedResult, hint

    if (template.range) {
      const [min, max] = template.range
      const num = Math.floor(Math.random() * (max - min + 1)) + min
      inputVal = template.from === 10 ? num.toString() : 
                 template.from === 16 ? num.toString(16).toUpperCase() :
                 template.from === 8 ? num.toString(8) :
                 num.toString(template.from)
    } else if (template.bits) {
      const bits = template.bits[Math.floor(Math.random() * template.bits.length)]
      const maxNum = Math.pow(2, bits) - 1
      const num = Math.floor(Math.random() * maxNum) + 1
      inputVal = num.toString(template.from)
    } else {
      const num = Math.floor(Math.random() * 100) + 1
      inputVal = num.toString(template.from)
    }

    try {
      expectedResult = convertNumber(inputVal, template.from, template.to)
    } catch (error) {
    }

    hint = generateConversionHint(template.from, template.to, inputVal)

    return {
      id: Date.now(),
      title: template.name,
      description: `Convierte ${inputVal} (base ${template.from}) a base ${template.to}`,
      input: inputVal,
      fromBase: template.from,
      toBase: template.to,
      expected: expectedResult,
      hint: hint,
      difficulty: getDifficultyLevel(template.from, template.to, inputVal),
      points: calculatePoints(template.from, template.to, inputVal),
      category: type
    }
  }

  const generateConversionHint = (fromBase, toBase, value) => {
    const hints = {
      '10-2': `Divide ${value} repetidamente por 2 y toma los residuos`,
      '10-8': `Divide ${value} repetidamente por 8 y toma los residuos`, 
      '10-16': `Divide ${value} por 16: ${Math.floor(value/16)} resto ${value%16}`,
      
      '2-10': `Multiplica cada bit por la potencia correspondiente de 2`,
      '8-10': `Multiplica cada dígito por la potencia correspondiente de 8`,
      '16-10': `A=10, B=11, C=12, D=13, E=14, F=15. Usa potencias de 16`,
    
      '2-16': `Agrupa los bits de 4 en 4 desde la derecha`,
      '16-2': `Cada dígito hex = 4 bits. ${value[0]} = ${parseInt(value[0] || '0', 16).toString(2).padStart(4, '0')}`,
        
      '2-8': `Agrupa los bits de 3 en 3 desde la derecha`,
      '8-2': `Cada dígito octal = 3 bits. ${value[0]} = ${parseInt(value[0] || '0', 8).toString(2).padStart(3, '0')}`,
      
      '8-16': `Convierte primero a decimal: ${parseInt(value, 8)}, luego a hex`,
      '16-8': `Convierte primero a decimal: ${parseInt(value, 16)}, luego a octal`
    }
    
    const key = `${fromBase}-${toBase}`
    return hints[key] || `Convierte de base ${fromBase} a base ${toBase}`
  }

  const getDifficultyLevel = (fromBase, toBase, value) => {
    const length = value.toString().length
    const complexity = Math.abs(fromBase - toBase)
    
    if (length <= 2 && complexity <= 6) return 'Fácil'
    if (length <= 4 && complexity <= 8) return 'Intermedio'  
    if (length <= 6 && complexity <= 14) return 'Difícil'
    return 'Experto'
  }

  const calculatePoints = (fromBase, toBase, value) => {
    const basePoints = {
      'Fácil': 10,
      'Intermedio': 20,
      'Difícil': 35,
      'Experto': 50
    }
    
    const difficulty = getDifficultyLevel(fromBase, toBase, value)
    let points = basePoints[difficulty]
    
    // Bonificaciones
    if ([2, 8].includes(fromBase) && toBase === 16) points += 5 // Conversión directa
    if (fromBase === 16 && [2, 8].includes(toBase)) points += 5
    if (value.length > 4) points += 10 // Números largos
    
    return points
  }

  const convertNumber = (value, fromBase, toBase) => {
    try {
      if (!value.trim()) return ''
      
      // Validar  que entrada se recibe
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
      
      // Convertimos  a base destino
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
        difficulty: getDifficultyLevel(fromBase, toBase, inputValue),
        points: calculatePoints(fromBase, toBase, inputValue),
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
      const earnedPoints = currentChallenge.points || 10
      setFeedback(`¡Correcto sigue asi aprobaras matematicas discretas ! 🎉 +${earnedPoints} puntos`)
      setScore(prev => prev + earnedPoints)
      setShowResult(true)
      
      // Agregar al hisotria
      const historyEntry = {
        id: Date.now(),
        input: currentChallenge.input,
        fromBase: currentChallenge.fromBase,
        toBase: currentChallenge.toBase,
        result: currentChallenge.expected,
        difficulty: currentChallenge.difficulty,
        points: earnedPoints,
        timestamp: new Date().toLocaleTimeString(),
        correct: true
      }
      setHistory(prev => [historyEntry, ...prev.slice(0, 9)])
      
      //generamos un nuevo desafio
      setTimeout(() => {
        generateNewChallenge()
        setUserResult('')
        setFeedback('')
        setShowResult(false)
      }, 2000)
    } else {
      setFeedback(`❌ Incorrecto. Pista: ${currentChallenge.hint}`)
      setShowResult(false)
    }
  }

  const generateNewChallenge = () => {
    const challenge = generateVariedChallenge(conversionType)
    setCurrentChallenge(challenge)
    setInputValue(challenge.input)
    setFromBase(challenge.fromBase)
    setToBase(challenge.toBase)
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
    setCurrentChallenge(null)
  }

  const clearHistory = () => {
    setHistory([])
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

  // Regenerar desafío cuando cambie el tipo de conversión
  useEffect(() => {
    if (labMode === 'challenge') {
      generateNewChallenge()
    }
  }, [conversionType])

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Fácil': 'bg-green-100 text-green-800',
      'Intermedio': 'bg-yellow-100 text-yellow-800',
      'Difícil': 'bg-orange-100 text-orange-800', 
      'Experto': 'bg-red-100 text-red-800'
    }
    return colors[difficulty] || 'bg-gray-100 text-gray-800'
  }

  const getConversionTypeIcon = (type) => {
    const icons = {
      all: '🎯',
      binary: '💻',
      decimal: '🔢',
      hex: '🔶',
      octal: '🎱',
      mixed: '🔄'
    }
    return icons[type] || '⚙️'
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          🧮 Laboratorio de Conversiones Variadas
        </h2>
        <p className="text-gray-600">
          Practica conversiones numéricas con diferentes tipos y niveles de dificultad
        </p>
      </div>

      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={startChallenge}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            labMode === 'challenge'
              ? 'bg-primary-600 text-red'
              : 'bg-blud-200 text-blue-700 hover:bg-blue-300'
          }`}
        >
          🎯 Reto Variado
        </button>
      </div>

      {/* Control de tipo de conversión para retos */}
      {labMode === 'challenge' && (
        <div className="card bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">🎲 Tipo de Reto</h3>
              <select
                value={conversionType}
                onChange={(e) => setConversionType(e.target.value)}
                className="px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {conversionTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-700">
                <strong>Puntuación:</strong> {score} | <strong>Intentos:</strong> {attempts}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                Los puntos varían según la dificultad del reto
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas del desafío */}
      {labMode === 'challenge' && currentChallenge && (
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                {getConversionTypeIcon(currentChallenge.category)} Reto Activo
              </h3>
              <p className="text-sm text-blue-700">
                Dificultad: <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(currentChallenge.difficulty)}`}>
                  {currentChallenge.difficulty}
                </span> | Puntos: {currentChallenge.points}
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
                <strong>💡 Pista:</strong> {currentChallenge.hint}
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
                  ✅ Verificar Respuesta
                </button>
              ) : (
                <button
                  onClick={handleConversion}
                  className="btn-primary flex-1"
                  disabled={!inputValue.trim()}
                >
                  🔄 Convertir
                </button>
              )}
              <button
                onClick={resetLab}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                🧹 Limpiar
              </button>
              {labMode === 'challenge' && (
                <button
                  onClick={generateNewChallenge}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  title="Nuevo reto"
                >
                  🎲
                </button>
              )}
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
                  Base {toBase} ({bases.find(b => b.value === toBase)?.name})
                </div>
              </div>

              {labMode === 'free' && (
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Entrada:</strong> {inputValue} (Base {fromBase})</p>
                  <p><strong>Salida:</strong> {correctResult} (Base {toBase})</p>
                  <p><strong>Dificultad:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${getDifficultyColor(getDifficultyLevel(fromBase, toBase, inputValue))}`}>
                      {getDifficultyLevel(fromBase, toBase, inputValue)}
                    </span>
                  </p>
                  <p><strong>Puntos potenciales:</strong> {calculatePoints(fromBase, toBase, inputValue)}</p>
                </div>
              )}
            </div>
          )}

          {/* Historial mejorado */}
          {history.length > 0 && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold">📊 Historial Reciente</h4>
                <button
                  onClick={clearHistory}
                  className="text-xs text-gray-500 hover:text-red-600"
                >
                  Limpiar historial
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {history.map(entry => (
                  <div key={entry.id} className={`p-3 rounded text-sm ${
                    entry.correct ? 'bg-green-50 border-l-4 border-green-400' : 'bg-gray-50 border-l-4 border-gray-300'
                  }`}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-mono text-sm">
                        {entry.input} ({entry.fromBase}) → {entry.result} ({entry.toBase})
                      </span>
                      <div className="flex items-center space-x-2">
                        {entry.correct && <span className="text-green-600 text-xs">✓</span>}
                        <span className="text-gray-500 text-xs">{entry.timestamp}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(entry.difficulty)}`}>
                        {entry.difficulty}
                      </span>
                      {entry.points && (
                        <span className="text-xs text-yellow-600 font-semibold">
                          🏆 {entry.points} pts
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Estadísticas del historial */}
          {history.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <h5 className="text-sm font-semibold text-blue-800 mb-2">📈 Estadísticas</h5>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-blue-700">Total conversiones: {history.length}</div>
                  <div className="text-blue-700">Correctas: {history.filter(h => h.correct).length}</div>
                </div>
                <div>
                  <div className="text-blue-700">Puntos totales: {history.reduce((sum, h) => sum + (h.points || 0), 0)}</div>
                  <div className="text-blue-700">Precisión: {history.length > 0 ? Math.round((history.filter(h => h.correct).length / history.length) * 100) : 0}%</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Guía de validación expandida */}
      <div className="card bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">📋 Guía de Conversión</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
          {bases.map(base => (
            <div key={base.value} className={`p-3 rounded ${base.color}`}>
              <div className="font-semibold">{base.name} (Base {base.value})</div>
              <div className="text-xs mt-1">
                Dígitos: {base.value === 2 ? '0, 1' :
                         base.value === 8 ? '0-7' :
                         base.value === 10 ? '0-9' : '0-9, A-F'}
              </div>
              <div className="text-xs mt-1 opacity-75">
                Ejemplo: {base.value === 2 ? '1101' :
                         base.value === 8 ? '755' :
                         base.value === 10 ? '123' : 'A1F'}
              </div>
            </div>
          ))}
        </div>

        {/* Tips de conversión */}
        <div className="bg-white p-4 rounded-md border">
          <h4 className="font-semibold text-gray-800 mb-3">💡 Tips de Conversión Rápida</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <div className="font-semibold mb-1">🔹 Binario ↔ Hexadecimal:</div>
              <div>4 bits = 1 dígito hex</div>
              <div>1010₂ = A₁₆, 1111₂ = F₁₆</div>
            </div>
            <div>
              <div className="font-semibold mb-1">🔸 Binario ↔ Octal:</div>
              <div>3 bits = 1 dígito octal</div>
              <div>101₂ = 5₈, 111₂ = 7₈</div>
            </div>
            <div>
              <div className="font-semibold mb-1">🔹 Potencias comunes:</div>
              <div>2⁴=16, 2⁸=256, 2¹⁰=1024</div>
              <div>8¹=8, 8²=64, 16¹=16, 16²=256</div>
            </div>
            <div>
              <div className="font-semibold mb-1">🔸 Valores hex:</div>
              <div>A=10, B=11, C=12</div>
              <div>D=13, E=14, F=15</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sistema de tipos de conversión */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <h3 className="font-semibold text-purple-900 mb-3 text-center">
          🎯 Sistema de Conversiones Inteligente
        </h3>
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-3 text-sm">
          {conversionTypes.map(type => (
            <div key={type.id} className="bg-white p-3 rounded border text-center">
              <div className="text-2xl mb-2">{getConversionTypeIcon(type.id)}</div>
              <div className="font-semibold text-purple-800">{type.label.split(' ')[0]}</div>
              <div className="text-purple-600 text-xs">{type.label.split(' ').slice(1).join(' ')}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center text-sm text-purple-700">
          <strong>🚀 Innovación:</strong> Retos generados dinámicamente con dificultad automática y puntuación variable
        </div>
      </div>
    </div>
  )
}

export default InteractiveLab