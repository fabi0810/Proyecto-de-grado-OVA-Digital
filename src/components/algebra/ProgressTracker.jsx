import { useState, useEffect } from 'react'

function ProgressTracker({ userProgress, expressionsTried, exercisesCompleted, simplificationsAttempted }) {
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [showDetails, setShowDetails] = useState(false)

  const progressData = {
    expressionsTried: expressionsTried || 0,
    exercisesCompleted: exercisesCompleted || 0,
    simplificationsAttempted: simplificationsAttempted || 0,
    totalScore: userProgress.totalScore || 0,
    averageScore: userProgress.totalScore ? Math.round(userProgress.totalScore / Math.max(1, exercisesCompleted)) : 0,
    lastActivity: userProgress.lastActivity || new Date().toISOString(),
    strengths: userProgress.strengths || [],
    weaknesses: userProgress.weaknesses || []
  }

  const getProgressPercentage = (current, target) => {
    return Math.min(100, (current / target) * 100)
  }

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    if (percentage >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getProgressBarColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 60) return 'bg-yellow-500'
    if (percentage >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const achievements = [
    {
      id: 'first_expression',
      name: 'Primera Expresión',
      description: 'Completa tu primera expresión booleana',
      icon: '🎯',
      unlocked: progressData.expressionsTried >= 1,
      progress: Math.min(100, (progressData.expressionsTried / 1) * 100)
    },
    {
      id: 'simplification_master',
      name: 'Maestro de Simplificación',
      description: 'Simplifica 10 expresiones correctamente',
      icon: '🧮',
      unlocked: progressData.simplificationsAttempted >= 10,
      progress: Math.min(100, (progressData.simplificationsAttempted / 10) * 100)
    },
    {
      id: 'exercise_champion',
      name: 'Campeón de Ejercicios',
      description: 'Completa 25 ejercicios',
      icon: '🏆',
      unlocked: progressData.exercisesCompleted >= 25,
      progress: Math.min(100, (progressData.exercisesCompleted / 25) * 100)
    },
    {
      id: 'perfect_score',
      name: 'Puntuación Perfecta',
      description: 'Obtén 100 puntos en un ejercicio',
      icon: '⭐',
      unlocked: progressData.averageScore >= 100,
      progress: Math.min(100, (progressData.averageScore / 100) * 100)
    }
  ]

  const recommendations = [
    {
      type: 'practice',
      title: 'Practica Más Expresiones',
      description: 'Intenta con diferentes tipos de expresiones booleanas',
      priority: progressData.expressionsTried < 5 ? 'high' : 'medium',
      action: 'Generar nueva expresión'
    },
    {
      type: 'simplification',
      title: 'Domina la Simplificación',
      description: 'Practica con teoremas de DeMorgan y absorción',
      priority: progressData.simplificationsAttempted < 3 ? 'high' : 'low',
      action: 'Intentar simplificación'
    },
    {
      type: 'exercises',
      title: 'Completa Más Ejercicios',
      description: 'Resuelve ejercicios para mejorar tu comprensión',
      priority: progressData.exercisesCompleted < 10 ? 'high' : 'low',
      action: 'Ir a ejercicios'
    }
  ].filter(rec => rec.priority !== 'low')

  return (
    <div className="space-y-6">
      {/* Resumen General */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Progreso del Estudiante</h2>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="week">Esta Semana</option>
              <option value="month">Este Mes</option>
              <option value="all">Todo el Tiempo</option>
            </select>
            
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
            >
              {showDetails ? 'Ocultar' : 'Mostrar'} Detalles
            </button>
          </div>
        </div>

        {/* Métricas Principales */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">📝</span>
              <span className="text-3xl font-bold text-blue-600">
                {progressData.expressionsTried}
              </span>
            </div>
            <div className="text-sm text-blue-700">Expresiones Intentadas</div>
            <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage(progressData.expressionsTried, 20)}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🎯</span>
              <span className="text-3xl font-bold text-green-600">
                {progressData.exercisesCompleted}
              </span>
            </div>
            <div className="text-sm text-green-700">Ejercicios Completados</div>
            <div className="mt-2 w-full bg-green-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage(progressData.exercisesCompleted, 50)}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🧮</span>
              <span className="text-3xl font-bold text-purple-600">
                {progressData.simplificationsAttempted}
              </span>
            </div>
            <div className="text-sm text-purple-700">Simplificaciones</div>
            <div className="mt-2 w-full bg-purple-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage(progressData.simplificationsAttempted, 20)}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-orange-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">⭐</span>
              <span className="text-3xl font-bold text-orange-600">
                {progressData.averageScore}
              </span>
            </div>
            <div className="text-sm text-orange-700">Puntuación Promedio</div>
            <div className="mt-2 w-full bg-orange-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage(progressData.averageScore, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Progreso General */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-semibold text-gray-800">Progreso General</span>
            <span className="text-lg font-bold text-gray-800">
              {Math.round((progressData.expressionsTried + progressData.exercisesCompleted + progressData.simplificationsAttempted) / 3)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.round((progressData.expressionsTried + progressData.exercisesCompleted + progressData.simplificationsAttempted) / 3)}%` 
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Logros */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Logros</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                achievement.unlocked
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">{achievement.icon}</span>
                <div className="flex-1">
                  <h4 className={`font-semibold ${
                    achievement.unlocked ? 'text-green-800' : 'text-gray-600'
                  }`}>
                    {achievement.name}
                  </h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
                {achievement.unlocked && (
                  <span className="text-green-600 text-xl">✅</span>
                )}
              </div>
              
              {!achievement.unlocked && (
                <div className="mt-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progreso</span>
                    <span>{Math.round(achievement.progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recomendaciones */}
      {recommendations.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recomendaciones</h3>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  rec.priority === 'high' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800">{rec.title}</h4>
                    <p className="text-sm text-gray-600">{rec.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    rec.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {rec.priority === 'high' ? 'Alta Prioridad' : 'Media Prioridad'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detalles Adicionales */}
      {showDetails && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Detalles del Progreso</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Fortalezas</h4>
              <div className="space-y-2">
                {progressData.strengths.length > 0 ? (
                  progressData.strengths.map((strength, index) => (
                    <div key={index} className="flex items-center space-x-2 text-green-700">
                      <span>✅</span>
                      <span>{strength}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Aún no se han identificado fortalezas específicas</p>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Áreas de Mejora</h4>
              <div className="space-y-2">
                {progressData.weaknesses.length > 0 ? (
                  progressData.weaknesses.map((weakness, index) => (
                    <div key={index} className="flex items-center space-x-2 text-red-700">
                      <span>⚠️</span>
                      <span>{weakness}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No se han identificado áreas de mejora</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Última Actividad:</span>
                <span className="ml-2 text-gray-600">
                  {new Date(progressData.lastActivity).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Puntuación Total:</span>
                <span className="ml-2 text-gray-600">{progressData.totalScore}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Nivel Estimado:</span>
                <span className="ml-2 text-gray-600">
                  {progressData.averageScore >= 80 ? 'Avanzado' :
                   progressData.averageScore >= 60 ? 'Intermedio' :
                   progressData.averageScore >= 40 ? 'Principiante' : 'Novato'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProgressTracker
