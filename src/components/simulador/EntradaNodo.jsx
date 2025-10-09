import { memo } from 'react'
import { Handle, Position } from 'reactflow'

/**
 * Componente de Nodo de Entrada mejorado con mejor visualización
 * Mantiene la funcionalidad existente pero con diseño más claro y educativo
 */
const InputNode = ({ data, isConnectable }) => {
  const { label, value = 0, onValueChange } = data

  // Función para cambiar el valor del nodo al hacer clic
  const handleClick = () => {
    console.log('InputNode clicked:', { label, currentValue: value, newValue: value === 1 ? 0 : 1 })
    if (onValueChange) {
      onValueChange(label, value === 1 ? 0 : 1)
    } else {
      console.error('onValueChange function not provided')
    }
  }

  return (
    <div className="relative">
      {/* Handle de salida - Conexión a otras compuertas */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{
          right: -6,
          top: '50%',
          background: value ? '#10b981' : '#ef4444',
          border: '2px solid white',
          width: 12,
          height: 12,
          zIndex: 10
        }}
        isConnectable={isConnectable}
      />

      {/* Cuerpo principal del nodo de entrada */}
      <div 
        className={`relative min-w-[100px] min-h-[70px] border-2 rounded-lg p-3 cursor-pointer transition-all duration-200 hover:scale-105 shadow-md ${
          value 
            ? 'bg-gradient-to-br from-green-100 to-green-200 border-green-400' 
            : 'bg-gradient-to-br from-red-100 to-red-200 border-red-400'
        }`}
        onClick={handleClick}
      >
        {/* Icono de entrada (interruptor) */}
        <div className="absolute top-2 left-2">
          <svg width="20" height="20" viewBox="0 0 20 20" className="opacity-60">
            <rect x="2" y="6" width="16" height="8" rx="4" 
              fill={value ? '#10b981' : '#ef4444'} 
              stroke="white" 
              strokeWidth="1"/>
            <circle cx={value ? 14 : 6} cy="10" r="3" fill="white"/>
          </svg>
        </div>

        {/* Contenido central del nodo */}
        <div className="text-center mt-2">
          {/* Valor actual (0 o 1) */}
          <div className={`text-2xl font-bold mb-1 ${
            value ? 'text-green-800' : 'text-red-800'
          }`}>
            {value ? '1' : '0'}
          </div>
          
          {/* Etiqueta de la entrada */}
          <div className={`text-sm font-semibold ${
            value ? 'text-green-700' : 'text-red-700'
          }`}>
            {label}
          </div>
        </div>

        {/* Indicador LED de estado */}
        <div className={`absolute top-2 right-2 w-3 h-3 rounded-full animate-pulse ${
          value ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-red-500 shadow-lg shadow-red-500/50'
        }`}></div>

        {/* Indicador de "clic para cambiar" */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-[10px] text-gray-600 opacity-60">
          Click
        </div>
      </div>

      {/* Etiqueta inferior - Tipo de componente */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-600 bg-white px-2 py-1 rounded shadow-sm border border-gray-200">
        Entrada
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

export default memo(InputNode)