import { memo } from 'react'
import { Handle, Position } from 'reactflow'

const LogicGateNode = ({ data, isConnectable }) => {
  const { gateType, output = 0, inputValues = [], label, isActive = false } = data

  // Función para obtener el diseño SVG de cada compuerta
  const getGateDesign = (type) => {
    const designs = {
      AND: (
        <svg width="100" height="80" viewBox="0 0 100 80" className="drop-shadow-sm">
          {/* Forma rectangular con lado derecho curvo */}
          <path 
            d="M10 10 L70 10 Q90 10 90 40 Q90 70 70 70 L10 70 Z" 
            fill="white" 
            stroke="#3b82f6" 
            strokeWidth="2"
          />
          {/* Símbolo AND */}
          <text x="50" y="45" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1e40af">
            &
          </text>
        </svg>
      ),
      OR: (
        <svg width="100" height="80" viewBox="0 0 100 80" className="drop-shadow-sm">
          {/* Forma curva característica de OR */}
          <path 
            d="M10 10 Q30 10 40 40 Q30 70 10 70 Q50 60 90 40 Q50 20 10 10" 
            fill="white" 
            stroke="#10b981" 
            strokeWidth="2"
          />
          {/* Símbolo OR */}
          <text x="50" y="45" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#047857">
            ≥1
          </text>
        </svg>
      ),
      NOT: (
        <svg width="100" height="80" viewBox="0 0 100 80" className="drop-shadow-sm">
          {/* Triángulo */}
          <path 
            d="M10 10 L10 70 L70 40 Z" 
            fill="white" 
            stroke="#8b5cf6" 
            strokeWidth="2"
          />
          {/* Círculo de negación */}
          <circle cx="75" cy="40" r="8" fill="white" stroke="#8b5cf6" strokeWidth="2"/>
          {/* Símbolo NOT */}
          <text x="40" y="45" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#6d28d9">
            1
          </text>
        </svg>
      ),
      NAND: (
        <svg width="100" height="80" viewBox="0 0 100 80" className="drop-shadow-sm">
          {/* Forma rectangular con lado derecho curvo */}
          <path 
            d="M10 10 L70 10 Q85 10 85 40 Q85 70 70 70 L10 70 Z" 
            fill="white" 
            stroke="#f97316" 
            strokeWidth="2"
          />
          {/* Círculo de negación */}
          <circle cx="90" cy="40" r="8" fill="white" stroke="#f97316" strokeWidth="2"/>
          {/* Símbolo NAND */}
          <text x="50" y="45" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#ea580c">
            &
          </text>
        </svg>
      ),
      NOR: (
        <svg width="100" height="80" viewBox="0 0 100 80" className="drop-shadow-sm">
          {/* Forma curva característica de OR */}
          <path 
            d="M10 10 Q30 10 40 40 Q30 70 10 70 Q50 60 85 40 Q50 20 10 10" 
            fill="white" 
            stroke="#ef4444" 
            strokeWidth="2"
          />
          {/* Círculo de negación */}
          <circle cx="90" cy="40" r="8" fill="white" stroke="#ef4444" strokeWidth="2"/>
          {/* Símbolo NOR */}
          <text x="50" y="45" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#dc2626">
            ≥1
          </text>
        </svg>
      ),
      XOR: (
        <svg width="100" height="80" viewBox="0 0 100 80" className="drop-shadow-sm">
          {/* Línea curva adicional para XOR */}
          <path 
            d="M5 10 Q20 10 30 40 Q20 70 5 70" 
            fill="none" 
            stroke="#eab308" 
            strokeWidth="2"
          />
          {/* Forma curva principal */}
          <path 
            d="M10 10 Q30 10 40 40 Q30 70 10 70 Q50 60 90 40 Q50 20 10 10" 
            fill="white" 
            stroke="#eab308" 
            strokeWidth="2"
          />
          {/* Símbolo XOR */}
          <text x="50" y="45" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#ca8a04">
            =1
          </text>
        </svg>
      ),
      XNOR: (
        <svg width="100" height="80" viewBox="0 0 100 80" className="drop-shadow-sm">
          {/* Línea curva adicional para XNOR */}
          <path 
            d="M5 10 Q20 10 30 40 Q20 70 5 70" 
            fill="none" 
            stroke="#ec4899" 
            strokeWidth="2"
          />
          {/* Forma curva principal */}
          <path 
            d="M10 10 Q30 10 40 40 Q30 70 10 70 Q50 60 85 40 Q50 20 10 10" 
            fill="white" 
            stroke="#ec4899" 
            strokeWidth="2"
          />
          {/* Círculo de negación */}
          <circle cx="90" cy="40" r="8" fill="white" stroke="#ec4899" strokeWidth="2"/>
          {/* Símbolo XNOR */}
          <text x="50" y="45" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#be185d">
            =1
          </text>
        </svg>
      )
    }
    return designs[type] || designs.AND
  }

  // Obtener número de entradas según el tipo de compuerta
  const getInputCount = (type) => {
    return type === 'NOT' ? 1 : 2
  }

  const inputCount = getInputCount(gateType)
  
  return (
    <div className={`relative transition-all duration-200 ${
      isActive ? 'drop-shadow-lg scale-105' : 'drop-shadow-md'
    }`}>
      {/* Handles de entrada */}
      {Array.from({ length: inputCount }, (_, index) => (
        <Handle
          key={`input-${index}`}
          type="target"
          position={Position.Left}
          id={`input-${index}`}
          style={{
            left: -6,
            top: inputCount === 1 ? '50%' : `${30 + (index * 40)}%`,
            background: inputValues[index] ? '#10b981' : '#ef4444',
            border: '2px solid white',
            width: 12,
            height: 12,
            zIndex: 10
          }}
          isConnectable={isConnectable}
        />
      ))}

      {/* Diseño de la compuerta */}
      <div className="relative">
        {getGateDesign(gateType)}
      </div>

      {/* Handle de salida */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{
          right: -6,
          top: '50%',
          background: output ? '#10b981' : '#ef4444',
          border: '2px solid white',
          width: 12,
          height: 12,
          zIndex: 10
        }}
        isConnectable={isConnectable}
      />

      {/* Etiqueta de la compuerta */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-600 bg-white px-2 py-1 rounded shadow-sm">
        {label || gateType}
      </div>

      {/* Indicadores de estado */}
      {inputValues.map((value, index) => (
        <div
          key={`input-indicator-${index}`}
          className="absolute text-xs font-bold"
          style={{
            left: -25,
            top: inputCount === 1 ? '50%' : `${30 + (index * 40)}%`,
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
      ))}

      {/* Indicador de salida */}
      <div
        className="absolute text-xs font-bold"
        style={{
          right: -25,
          top: '50%',
          transform: 'translateY(-50%)',
          color: output ? '#10b981' : '#ef4444',
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
        {output}
      </div>
    </div>
  )
}

export default memo(LogicGateNode)

