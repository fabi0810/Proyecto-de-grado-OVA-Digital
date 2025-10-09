import { useState, useEffect } from 'react'

const ProgressTracker = ({ userActivity, onRecommendation }) => {
  const [progress, setProgress] = useState({
    conversionsCompleted: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    timeSpent: 0,
    systemsMastered: {
      binary: false,
      octal: false,
      decimal: false,
      hexadecimal: false
    },
    lastActivity: null,
    streak: 0,
    achievements: []
  })

  const [recommendations, setRecommendations] = useState([])
  const [showDetailedStats, setShowDetailedStats] = useState(false)

  const achievements = [
    {
      id: 'first_conversion',
      name: 'Primera Conversión',
      description: 'Completa tu primera conversión numérica',
      icon: '🎯',
      condition: (stats) => stats.conversionsCompleted >= 1,
      unlocked: false
    },
    {
      id: 'binary_master',
      name: 'Maestro Binario',
      description: 'Completa 10 conversiones binarias',
      icon: '🔢',
      condition: (stats) => stats.binaryConversions >= 10,
      unlocked: false
    },    
    {
      id: 'perfect_quiz',
      name: 'Quiz Perfecto',
      description: 'Obtén 100% en un quiz',
      icon: '🏆',
      condition: (stats) => stats.perfectQuizzes >= 1,
      unlocked: false
    },
    {
      id: 'speed_demon',
      name: 'Demonio de la Velocidad',
      description: 'Completa 5 conversiones en menos de 30 segundos',
      icon: '⚡',
      condition: (stats) => stats.fastConversions >= 5,
      unlocked: false
    },
    {
      id: 'persistent_learner',
      name: 'Estudiante Persistente',
      description: 'Estudia 7 días consecutivos',
      icon: '📚',
      condition: (stats) => stats.streak >= 7,
      unlocked: false
    },
    {
      id: 'hex_expert',
      name: 'Experto en Hexadecimal',
      description: 'Domina las conversiones hexadecimales',
      icon: '🔶',
      condition: (stats) => stats.hexConversions >= 20,
      unlocked: false
    }
  ]

  const generateRecommendations = (stats) => {
    const recs = []
    
    // Recomendaciones basadas en rendimiento
    if (stats.conversionsCompleted < 5) {
      recs.push({
        type: 'practice',
        priority: 'high',
        title: 'Más Práctica Necesaria',
        description: 'Completa al menos 5 conversiones para familiarizarte con los conceptos básicos.',
        action: 'Practicar conversiones básicas',
        icon: '📝'
      })
    }
    
    if (stats.correctAnswers / Math.max(stats.questionsAnswered, 1) < 0.7) {
      recs.push({
        type: 'theory',
        priority: 'high',
        title: 'Revisar Teoría',
        description: 'Tu tasa de aciertos sugiere que necesitas repasar los conceptos teóricos.',
        action: 'Estudiar teoría de sistemas numéricos',
        icon: '📖'
      })
    }
    
    if (stats.timeSpent < 300) { // Menos de 5 minutos
      recs.push({
        type: 'engagement',
        priority: 'medium',
        title: 'Más Tiempo de Estudio',
        description: 'Dedica más tiempo a practicar para mejorar tu comprensión.',
        action: 'Completar más ejercicios',
        icon: '⏰'
      })
    }
    
    // Recomendaciones basadas en sistemas dominados
    const systemsToPractice = Object.entries(stats.systemsMastered)
      .filter(([system, mastered]) => !mastered)
      .map(([system]) => system)
    
    if (systemsToPractice.length > 0) {
      recs.push({
        type: 'system_focus',
        priority: 'medium',
        title: 'Enfócate en Sistemas Específicos',
        description: `Practica más con: ${systemsToPractice.join(', ')}`,
        action: `Practicar ${systemsToPractice[0]}`,
        icon: '🎯'
      })
    }
    
    // Recomendaciones de logros
    const nextAchievement = achievements.find(achievement => 
      !achievement.unlocked && !achievement.condition(stats)
    )
    
    if (nextAchievement) {
      recs.push({
        type: 'achievement',
        priority: 'low',
        title: 'Próximo Logro',
        description: nextAchievement.description,
        action: 'Continuar practicando',
        icon: nextAchievement.icon
      })
    }
    
    return recs.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  const calculateSystemMastery = (stats) => {
    const mastery = {}
    const systems = ['binary', 'octal', 'decimal', 'hexadecimal']
    
    systems.forEach(system => {
      const conversions = stats[`${system}Conversions`] || 0
      const accuracy = stats[`${system}Accuracy`] || 0
      
      mastery[system] = conversions >= 5 && accuracy >= 0.8
    })
    
    return mastery
  }

  const updateProgress = (activity) => {
    setProgress(prev => {
      const newProgress = { ...prev }
      
      // Actualizar estadísticas básicas
      if (activity.type === 'conversion') {
        newProgress.conversionsCompleted++
        newProgress.lastActivity = new Date()
        
        // Actualizar conversiones por sistema
        const systemKey = `${activity.fromBase}_to_${activity.toBase}`
        newProgress[systemKey] = (newProgress[systemKey] || 0) + 1
      }
      
      if (activity.type === 'quiz_answer') {
        newProgress.questionsAnswered++
        if (activity.correct) {
          newProgress.correctAnswers++
        }
      }
      
      if (activity.type === 'time_spent') {
        newProgress.timeSpent += activity.duration
      }
      
      // Calcular dominio de sistemas
      newProgress.systemsMastered = calculateSystemMastery(newProgress)
      
      // Verificar logros
      achievements.forEach(achievement => {
        if (!achievement.unlocked && achievement.condition(newProgress)) {
          achievement.unlocked = true
          newProgress.achievements.push(achievement)
        }
      })
      
      return newProgress
    })
  }

  useEffect(() => {
    if (userActivity) {
      updateProgress(userActivity)
    }
  }, [userActivity])

  useEffect(() => {
    const newRecommendations = generateRecommendations(progress)
    setRecommendations(newRecommendations)
    onRecommendation && onRecommendation(newRecommendations)
  }, [progress])

  const getProgressPercentage = (category) => {
    switch (category) {
      case 'conversions':
        return Math.min((progress.conversionsCompleted / 20) * 100, 100)
      case 'accuracy':
        return progress.questionsAnswered > 0 
          ? (progress.correctAnswers / progress.questionsAnswered) * 100 
          : 0
      case 'systems':
        const mastered = Object.values(progress.systemsMastered).filter(Boolean).length
        return (mastered / 4) * 100
      default:
        return 0
    }
  }

  const getSystemIcon = (system) => {
    const icons = {
      binary: '🔢',
      octal: '🟢',
      decimal: '🔟',
      hexadecimal: '🔶'
    }
    return icons[system] || '❓'
  }

  const getSystemName = (system) => {
    const names = {
      binary: 'Binario',
      octal: 'Octal',
      decimal: 'Decimal',
      hexadecimal: 'Hexadecimal'
    }
    return names[system] || system
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Tu Progreso de Aprendizaje
        </h2>
        <p className="text-gray-600">
          Rastrea tu evolución y recibe recomendaciones personalizadas
        </p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">
            {progress.conversionsCompleted}
          </div>
          <div className="text-sm text-gray-600">Conversiones</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage('conversions')}%` }}
            ></div>
          </div>
        </div>

        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {progress.questionsAnswered > 0 
              ? Math.round((progress.correctAnswers / progress.questionsAnswered) * 100)
              : 0}%
          </div>
          <div className="text-sm text-gray-600">Precisión</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage('accuracy')}%` }}
            ></div>
          </div>
        </div>

        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {Object.values(progress.systemsMastered).filter(Boolean).length}/4
          </div>
          <div className="text-sm text-gray-600">Sistemas Dominados</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage('systems')}%` }}
            ></div>
          </div>
        </div>

        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {progress.achievements.length}
          </div>
          <div className="text-sm text-gray-600">Logros</div>
          <div className="text-xs text-gray-500 mt-1">
            {progress.streak} días seguidos
          </div>
        </div>
      </div>

      {/* Dominio de sistemas */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Dominio de Sistemas Numéricos</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(progress.systemsMastered).map(([system, mastered]) => (
            <div key={system} className={`p-4 rounded-lg border-2 ${
              mastered 
                ? 'bg-green-50 border-green-200' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="text-center">
                <div className="text-2xl mb-2">{getSystemIcon(system)}</div>
                <div className="font-semibold text-sm">{getSystemName(system)}</div>
                <div className={`text-xs mt-1 ${
                  mastered ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {mastered ? 'Dominado' : 'En progreso'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logros */}
      {progress.achievements.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Logros Desbloqueados</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {progress.achievements.map((achievement, index) => (
              <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">{achievement.icon}</div>
                  <div>
                    <div className="font-semibold text-yellow-800">{achievement.name}</div>
                    <div className="text-sm text-yellow-600">{achievement.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recomendaciones */}
      {recommendations.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Recomendaciones Personalizadas</h3>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                rec.priority === 'high' ? 'bg-red-50 border-red-400' :
                rec.priority === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                'bg-blue-50 border-blue-400'
              }`}>
                <div className="flex items-start">
                  <div className="text-xl mr-3">{rec.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">{rec.title}</div>
                    <div className="text-sm text-gray-600 mb-2">{rec.description}</div>
                    <div className="text-xs text-gray-500">
                      Acción sugerida: {rec.action}
                    </div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded ${
                    rec.priority === 'high' ? 'bg-red-200 text-red-800' :
                    rec.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-blue-200 text-blue-800'
                  }`}>
                    {rec.priority === 'high' ? 'Alta' :
                     rec.priority === 'medium' ? 'Media' : 'Baja'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estadísticas detalladas */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Estadísticas Detalladas</h3>
          <button
            onClick={() => setShowDetailedStats(!showDetailedStats)}
            className="text-sm text-primary-600 hover:text-primary-800"
          >
            {showDetailedStats ? 'Ocultar' : 'Mostrar'} detalles
          </button>
        </div>

        {showDetailedStats && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Actividad Reciente</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Conversiones completadas:</span>
                  <span className="font-mono">{progress.conversionsCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span>Preguntas respondidas:</span>
                  <span className="font-mono">{progress.questionsAnswered}</span>
                </div>
                <div className="flex justify-between">
                  <span>Respuestas correctas:</span>
                  <span className="font-mono">{progress.correctAnswers}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tiempo total:</span>
                  <span className="font-mono">{Math.round(progress.timeSpent / 60)} min</span>
                </div>
                <div className="flex justify-between">
                  <span>Última actividad:</span>
                  <span className="font-mono">
                    {progress.lastActivity 
                      ? progress.lastActivity.toLocaleTimeString()
                      : 'Nunca'
                    }
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Próximos Objetivos</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Conversiones para logro:</span>
                  <span className="font-mono">
                    {Math.max(0, 10 - progress.conversionsCompleted)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Días para racha:</span>
                  <span className="font-mono">
                    {Math.max(0, 7 - progress.streak)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Sistemas por dominar:</span>
                  <span className="font-mono">
                    {4 - Object.values(progress.systemsMastered).filter(Boolean).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProgressTracker

