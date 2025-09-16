import { memo } from 'react'
import { Handle, Position } from 'reactflow'

const InputNode = ({ data, isConnectable }) => {
  const { label, value = 0, onValueChange } = data

  const handleClick = () => {
    if (onValueChange) {
      onValueChange(label, !value)
    }
  }

  return (
    <div className="relative">
      {/* Handle de salida */}
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

      {/* Nodo de entrada */}
      <div 
        className={`relative min-w-[80px] min-h-[60px] border-2 rounded-lg p-3 cursor-pointer transition-all duration-200 hover:scale-105 ${
          value 
            ? 'bg-green-100 border-green-400 text-green-800' 
            : 'bg-red-100 border-red-400 text-red-800'
        }`}
        onClick={handleClick}
      >
        {/* Contenido del nodo */}
        <div className="text-center">
          <div className="text-lg font-bold mb-1">
            {value ? '1' : '0'}
          </div>
          <div className="text-xs font-medium">
            {label}
          </div>
        </div>

        {/* Indicador de estado */}
        <div className={`absolute top-1 right-1 w-3 h-3 rounded-full ${
          value ? 'bg-green-500' : 'bg-red-500'
        }`}></div>
      </div>

      {/* Etiqueta del nodo */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-600 bg-white px-2 py-1 rounded shadow-sm">
        Entrada
      </div>

      {/* Indicador de valor */}
      <div
        className="absolute text-xs font-bold"
        style={{
          right: -25,
          top: '50%',
          transform: 'translateY(-50%)',
          color: value ? '#10b981' : '#ef4444',
          background: 'white',
          borderRadius: '50%',
          width: 16,
          height: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #e5e7eb'
        }}
      >
        {value}
      </div>
    </div>
  )
}

export default memo(InputNode)
