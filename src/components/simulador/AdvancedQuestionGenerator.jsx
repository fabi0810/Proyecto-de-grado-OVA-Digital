import { useState, useMemo } from 'react'

const AdvancedQuestionGenerator = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium')
  const [selectedTopic, setSelectedTopic] = useState('all')
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)

  const difficulties = [
    { id: 'easy', label: 'Fácil', color: 'green' },
    { id: 'medium', label: 'Medio', color: 'yellow' },
    { id: 'hard', label: 'Difícil', color: 'red' },
    { id: 'expert', label: 'Experto', color: 'purple' }
  ]

  const topics = [
    { id: 'all', label: 'Todos los Temas' },
    { id: 'gates', label: 'Compuertas Lógicas' },
    { id: 'algebra', label: 'Álgebra Booleana' },
    { id: 'circuits', label: 'Diseño de Circuitos' },
    { id: 'optimization', label: 'Optimización' },
    { id: 'applications', label: 'Aplicaciones' }
  ]

  const questionTemplates = {
    easy: [
      {
        id: 'gate_truth_table',
        topic: 'gates',
        question: '¿Cuál es la salida de una compuerta AND cuando ambas entradas son 1?',
        options: ['0', '1', 'Indefinido', 'Depende del contexto'],
        correct: 1,
        explanation: 'La compuerta AND produce 1 solo cuando todas sus entradas son 1.'
      },
      {
        id: 'gate_symbol',
        topic: 'gates',
        question: '¿Cuál es el símbolo lógico de la compuerta OR?',
        options: ['&', '≥1', '=1', '1'],
        correct: 1,
        explanation: 'El símbolo ≥1 indica que la salida es 1 cuando al menos una entrada es 1.'
      },
      {
        id: 'not_gate',
        topic: 'gates',
        question: '¿Qué hace la compuerta NOT?',
        options: ['Suma las entradas', 'Invierte la entrada', 'Multiplica las entradas', 'No hace nada'],
        correct: 1,
        explanation: 'La compuerta NOT invierte el valor de su entrada: 0 se convierte en 1 y viceversa.'
      }
    ],
    medium: [
      {
        id: 'boolean_expression',
        topic: 'algebra',
        question: 'Simplifica la expresión: A AND (A OR B)',
        options: ['A', 'A OR B', 'A AND B', 'B'],
        correct: 0,
        explanation: 'A AND (A OR B) = A por la ley de absorción en álgebra booleana.'
      },
      {
        id: 'circuit_design',
        topic: 'circuits',
        question: '¿Cuántas compuertas NAND necesitas para implementar una compuerta AND?',
        options: ['1', '2', '3', '4'],
        correct: 1,
        explanation: 'Se necesita una compuerta NAND seguida de una compuerta NOT (que también se puede hacer con NAND).'
      },
      {
        id: 'xor_property',
        topic: 'gates',
        question: '¿Cuál es la propiedad principal de la compuerta XOR?',
        options: ['Siempre produce 1', 'Produce 1 cuando las entradas son diferentes', 'Siempre produce 0', 'Produce 0 cuando las entradas son iguales'],
        correct: 1,
        explanation: 'XOR produce 1 cuando las entradas son diferentes y 0 cuando son iguales.'
      }
    ],
    hard: [
      {
        id: 'demorgan_law',
        topic: 'algebra',
        question: 'Aplica la ley de De Morgan a: NOT (A AND B)',
        options: ['NOT A AND NOT B', 'NOT A OR NOT B', 'A OR B', 'A AND B'],
        correct: 1,
        explanation: 'NOT (A AND B) = NOT A OR NOT B según la primera ley de De Morgan.'
      },
      {
        id: 'circuit_optimization',
        topic: 'optimization',
        question: '¿Cuál es el número mínimo de compuertas NAND necesarias para implementar cualquier función lógica?',
        options: ['1', '2', '3', 'No hay mínimo'],
        correct: 1,
        explanation: 'Las compuertas NAND son universalmente completas, pero se necesita al menos 2 para implementar funciones complejas.'
      },
      {
        id: 'karnaugh_map',
        topic: 'circuits',
        question: '¿Para qué se usan los mapas de Karnaugh?',
        options: ['Para dibujar circuitos', 'Para simplificar expresiones booleanas', 'Para probar circuitos', 'Para medir voltajes'],
        correct: 1,
        explanation: 'Los mapas de Karnaugh son una herramienta visual para simplificar expresiones booleanas.'
      }
    ],
    expert: [
      {
        id: 'sequential_circuit',
        topic: 'circuits',
        question: '¿Qué caracteriza a un circuito secuencial?',
        options: ['Solo usa compuertas AND', 'Tiene memoria', 'Solo usa compuertas OR', 'No tiene entradas'],
        correct: 1,
        explanation: 'Los circuitos secuenciales tienen memoria y su salida depende del estado anterior.'
      },
      {
        id: 'hazard_analysis',
        topic: 'optimization',
        question: '¿Qué son los "hazards" en circuitos digitales?',
        options: ['Errores de diseño', 'Pulsos espurios temporales', 'Compuertas defectuosas', 'Conexiones incorrectas'],
        correct: 1,
        explanation: 'Los hazards son pulsos espurios temporales que pueden ocurrir durante las transiciones.'
      },
      {
        id: 'fsm_design',
        topic: 'circuits',
        question: '¿Qué representa un diagrama de estados en una máquina de estados finitos?',
        options: ['Las compuertas del circuito', 'Los estados posibles y sus transiciones', 'Las entradas del sistema', 'Las salidas del sistema'],
        correct: 1,
        explanation: 'Un diagrama de estados muestra los estados posibles del sistema y las transiciones entre ellos.'
      }
    ]
  }

  const generateQuestion = () => {
    const availableQuestions = questionTemplates[selectedDifficulty].filter(q => 
      selectedTopic === 'all' || q.topic === selectedTopic
    )
    
    if (availableQuestions.length === 0) {
      alert('No hay preguntas disponibles para la combinación seleccionada.')
      return
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length)
    const question = availableQuestions[randomIndex]
    
    setCurrentQuestion(question)
    setUserAnswer('')
    setShowResult(false)
  }

  const checkAnswer = () => {
    if (!currentQuestion || userAnswer === '') {
      alert('Por favor selecciona una respuesta.')
      return
    }

    const isCorrect = parseInt(userAnswer) === currentQuestion.correct
    setShowResult(true)
    setTotalQuestions(prev => prev + 1)
    
    if (isCorrect) {
      setScore(prev => prev + 1)
    }
  }

  const resetQuiz = () => {
    setScore(0)
    setTotalQuestions(0)
    setCurrentQuestion(null)
    setUserAnswer('')
    setShowResult(false)
  }

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      hard: 'bg-red-100 text-red-800 border-red-200',
      expert: 'bg-purple-100 text-purple-800 border-purple-200'
    }
    return colors[difficulty] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getScoreColor = () => {
    if (totalQuestions === 0) return 'text-gray-600'
    const percentage = (score / totalQuestions) * 100
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Generador de Preguntas Avanzadas
        </h1>
        <p className="text-gray-600">
          Pon a prueba tus conocimientos con preguntas de diferentes niveles de dificultad
        </p>
      </div>

      {/* Configuración */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuración</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Dificultad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nivel de Dificultad
            </label>
            <div className="grid grid-cols-2 gap-2">
              {difficulties.map(difficulty => (
                <button
                  key={difficulty.id}
                  onClick={() => setSelectedDifficulty(difficulty.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedDifficulty === difficulty.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {difficulty.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tema */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tema
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {topics.map(topic => (
                <option key={topic.id} value={topic.id}>
                  {topic.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex space-x-3">
          <button
            onClick={generateQuestion}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            🎲 Generar Pregunta
          </button>
          <button
            onClick={resetQuiz}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            🔄 Reiniciar Quiz
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Estadísticas</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-gray-600">Correctas</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-600">{totalQuestions}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${getScoreColor()}`}>
              {totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">Precisión</div>
          </div>
        </div>
      </div>

      {/* Pregunta Actual */}
      {currentQuestion && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Pregunta</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(selectedDifficulty)}`}>
              {difficulties.find(d => d.id === selectedDifficulty)?.label}
            </span>
          </div>

          <div className="mb-6">
            <p className="text-lg text-gray-800 mb-4">{currentQuestion.question}</p>
            
            <div className="space-y-2">
              {currentQuestion.options.map((option, index) => (
                <label key={index} className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="answer"
                    value={index}
                    checked={userAnswer === index.toString()}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-gray-800">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={checkAnswer}
              disabled={userAnswer === ''}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              ✅ Verificar Respuesta
            </button>
            <button
              onClick={generateQuestion}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              🎲 Nueva Pregunta
            </button>
          </div>

          {/* Resultado */}
          {showResult && (
            <div className={`mt-6 p-4 rounded-md ${
              parseInt(userAnswer) === currentQuestion.correct
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">
                  {parseInt(userAnswer) === currentQuestion.correct ? '✅' : '❌'}
                </span>
                <span className={`font-semibold ${
                  parseInt(userAnswer) === currentQuestion.correct ? 'text-green-800' : 'text-red-800'
                }`}>
                  {parseInt(userAnswer) === currentQuestion.correct ? '¡Correcto!' : 'Incorrecto'}
                </span>
              </div>
              <p className="text-gray-700">{currentQuestion.explanation}</p>
            </div>
          )}
        </div>
      )}

      {/* Instrucciones */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          💡 Instrucciones
        </h3>
        <ul className="text-blue-800 space-y-1 text-sm">
          <li>• Selecciona el nivel de dificultad y tema que desees</li>
          <li>• Haz clic en "Generar Pregunta" para obtener una pregunta aleatoria</li>
          <li>• Selecciona tu respuesta y haz clic en "Verificar"</li>
          <li>• Revisa la explicación para aprender de tus errores</li>
          <li>• Usa "Nueva Pregunta" para continuar practicando</li>
        </ul>
      </div>
    </div>
  )
}

export default AdvancedQuestionGenerator
