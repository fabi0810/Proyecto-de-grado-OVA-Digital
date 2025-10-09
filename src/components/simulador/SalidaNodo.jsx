import { memo } from 'react'
import { Handle, Position } from 'reactflow'

/**
 * Componente de Nodo de Salida mejorado que simula un LED
 * Visualización más realista y educativa del comportamiento de una salida digital
 */
function SalidaNodo({ data, isConnectable }) {
  const label = data?.label ?? 'Salida'
  const value = data?.value === 1 ? 1 : 0

  return (
    <div className="relative">
      {/* Handle de entrada - Recibe señal de otras compuertas */}
      <Handle 
        type="target" 
        position={Position.Left} 
        id="in" 
        isConnectable={isConnectable} 
        style={{ 
          background: value === 1 ? '#10b981' : '#ef4444',
          border: '2px solid white',
          width: 12,
          height: 12,
          zIndex: 10
        }} 
      />

      {/* Cuerpo principal del nodo de salida */}
      <div className="bg-white border-2 border-gray-300 rounded-lg px-4 py-3 shadow-md min-w-[100px]">
        {/* Etiqueta superior */}
        <div className="text-xs text-gray-600 font-semibold mb-2 text-center">{label}</div>
        
        {/* Contenedor del LED con brillo */}
        <div className="flex flex-col items-center space-y-2">
          {/* LED visual con efecto de brillo cuando está encendido */}
          <div className="relative">
            {/* Brillo exterior (solo cuando está encendido) */}
            {value === 1 && (
              <div className="absolute inset-0 rounded-full bg-red-400 blur-xl opacity-60 animate-pulse"></div>
            )}
            
            {/* LED principal */}
            <div className={`relative w-8 h-8 rounded-full border-2 transition-all duration-300 ${
              value === 1 
                ? 'bg-red-500 border-red-600 shadow-lg shadow-red-500/50' 
                : 'bg-gray-300 border-gray-400'
            }`}>
              {/* Reflejo del LED */}
              <div className={`absolute top-1 left-1 w-2 h-2 rounded-full ${
                value === 1 ? 'bg-red-200' : 'bg-gray-100'
              }`}></div>
              
              {/* Punto central brillante cuando está encendido */}
              {value === 1 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-white opacity-80 animate-pulse"></div>
                </div>
              )}
            </div>
          </div>
          
          {/* Indicador numérico del valor */}
          <div className="flex items-center space-x-2">
            <div className={`text-lg font-bold ${
              value === 1 ? 'text-red-600' : 'text-gray-500'
            }`}>
              {value}
            </div>
            
            {/* Etiqueta de estado */}
            <div className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
              value === 1 
                ? 'bg-red-100 text-red-700' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {value === 1 ? 'ON' : 'OFF'}
            </div>
          </div>
        </div>

        {/* Representación visual del enchufe/base del LED */}
        <div className="mt-2 flex justify-center">
          <svg width="40" height="12" viewBox="0 0 40 12">
            {/* Base del LED */}
            <rect x="8" y="0" width="24" height="8" fill="#d1d5db" stroke="#9ca3af" strokeWidth="1" rx="1"/>
            {/* Pines */}
            <line x1="12" y1="8" x2="12" y2="12" stroke="#6b7280" strokeWidth="2"/>
            <line x1="28" y1="8" x2="28" y2="12" stroke="#6b7280" strokeWidth="2"/>
          </svg>
        </div>
      </div>

      {/* Etiqueta inferior - Tipo de componente */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-600 bg-white px-2 py-1 rounded shadow-sm border border-gray-200">
        Salida LED
      </div>

      {/* Indicador de valor en el handle */}
      <div
        className="absolute text-xs font-bold"
        style={{
          left: -30,
          top: '50%',
          transform: 'translateY(-50%)',
          color: value ? '#10b981' : '#ef4444',
          background: 'white',
          borderRadius: '50%',
          width: 20,
          height: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid #e5e7eb',
          fontWeight: 'bold'
        }}
      >
        {value}
      </div>
    </div>
  )
}

export default memo(SalidaNodo)