import { memo } from 'react'
import { Handle, Position } from 'reactflow'

/**
 * Componente de Nodo de Constante mejorado con mejor visualización
 * Representa valores constantes 0 o 1 con diseño educativo
 */
function ConstanteNodo({ data }) {
  const value = data?.value === 1 ? 1 : 0
  const label = data?.label ?? (value === 1 ? 'Const 1' : 'Const 0')

  return (
    <div className="relative">
      {/* Handle de salida */}
      <Handle 
        type="source" 
        position={Position.Right} 
        id="out" 
        style={{ 
          background: value === 1 ? '#10b981' : '#ef4444',
          border: '2px solid white',
          width: 12,
          height: 12,
          zIndex: 10
        }} 
      />

      {/* Cuerpo principal del nodo constante */}
      <div className={`relative min-w-[90px] border-2 rounded-lg px-3 py-3 shadow-md transition-all duration-200 ${
        value === 1 
          ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-400' 
          : 'bg-gradient-to-br from-red-50 to-red-100 border-red-400'
      }`}>
        {/* Icono de batería/fuente */}
        <div className="absolute top-1 left-1">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <rect x="2" y="5" width="10" height="6" rx="1" 
              fill={value === 1 ? '#10b981' : '#ef4444'} 
              stroke="white" 
              strokeWidth="1"/>
            <rect x="12" y="6.5" width="2" height="3" 
              fill={value === 1 ? '#10b981' : '#ef4444'}/>
            {value === 1 && (
              <>
                <line x1="5" y1="8" x2="9" y2="8" stroke="white" strokeWidth="1"/>
                <line x1="7" y1="6" x2="7" y2="10" stroke="white" strokeWidth="1"/>
              </>
            )}
            {value === 0 && (
              <line x1="5" y1="8" x2="9" y2="8" stroke="white" strokeWidth="1"/>
            )}
          </svg>
        </div>

        {/* Etiqueta superior */}
        <div className="text-[10px] text-gray-600 font-semibold mb-1 text-center">
          {label}
        </div>
        
        {/* Valor principal */}
        <div className="flex items-center justify-center space-x-2">
          {/* Indicador visual del valor */}
          <div className={`w-6 h-6 rounded flex items-center justify-center font-bold text-white text-sm shadow-sm ${
            value === 1 ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {value}
          </div>
          
          {/* LED indicador */}
          <div className={`w-2 h-2 rounded-full ${
            value === 1 
              ? 'bg-green-500 shadow-lg shadow-green-500/50 animate-pulse' 
              : 'bg-red-500 shadow-lg shadow-red-500/50'
          }`}></div>
        </div>

        {/* Símbolo de constante */}
        <div className="absolute bottom-1 right-1 text-[10px] text-gray-500 font-mono">
          K
        </div>
      </div>

      {/* Etiqueta inferior */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-600 bg-white px-2 py-1 rounded shadow-sm border border-gray-200 whitespace-nowrap">
        Constante
      </div>

      {/* Indicador de valor en el handle */}
      <div
        className="absolute text-xs font-bold"
        style={{
          right: -30,
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

export default memo(ConstanteNodo)