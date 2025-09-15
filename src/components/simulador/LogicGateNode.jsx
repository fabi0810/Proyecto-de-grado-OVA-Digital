import { memo } from 'react'
import { Handle, Position } from 'reactflow'

const LogicGateNode = ({ data, isConnectable }) => {
  const { type, inputs = [], output, label, isActive = false } = data

  const getGateSymbol = (gateType) => {
    const symbols = {
      AND: '&',
      OR: '≥1',
      NOT: '1',
      NAND: '&',
      NOR: '≥1',
      XOR: '=1',
      XNOR: '=1'
    }
    return symbols[gateType] || '?'
  }

  const getGateColor = (gateType) => {
    const colors = {
      AND: 'bg-blue-100 border-blue-300 text-blue-800',
      OR: 'bg-green-100 border-green-300 text-green-800',
      NOT: 'bg-purple-100 border-purple-300 text-purple-800',
      NAND: 'bg-orange-100 border-orange-300 text-orange-800',
      NOR: 'bg-red-100 border-red-300 text-red-800',
      XOR: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      XNOR: 'bg-pink-100 border-pink-300 text-pink-800'
    }
    return colors[gateType] || 'bg-gray-100 border-gray-300 text-gray-800'
  }

  const getInputPositions = (inputCount) => {
    if (inputCount === 1) return [{ x: 0, y: 0.5 }]
    if (inputCount === 2) return [{ x: 0, y: 0.3 }, { x: 0, y: 0.7 }]
    if (inputCount === 3) return [{ x: 0, y: 0.2 }, { x: 0, y: 0.5 }, { x: 0, y: 0.8 }]
    return []
  }

  const inputPositions = getInputPositions(inputs.length)

  return (
    <div className={`relative min-w-[120px] min-h-[80px] border-2 rounded-lg p-3 transition-all duration-200 ${
      getGateColor(type)
    } ${isActive ? 'shadow-lg scale-105' : 'shadow-md'}`}>
      {/* Input handles */}
      {inputs.map((input, index) => (
        <Handle
          key={`input-${index}`}
          type="target"
          position={Position.Left}
          id={`input-${index}`}
          style={{
            left: -8,
            top: `${inputPositions[index]?.y * 100 || 50}%`,
            background: input.value ? '#10b981' : '#ef4444',
            border: '2px solid white',
            width: 12,
            height: 12
          }}
          isConnectable={isConnectable}
        />
      ))}

      {/* Gate content */}
      <div className="text-center">
        <div className="text-lg font-bold mb-1">
          {getGateSymbol(type)}
        </div>
        <div className="text-xs font-medium">
          {type}
        </div>
        {label && (
          <div className="text-xs text-gray-600 mt-1">
            {label}
          </div>
        )}
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{
          right: -8,
          top: '50%',
          background: output ? '#10b981' : '#ef4444',
          border: '2px solid white',
          width: 12,
          height: 12
        }}
        isConnectable={isConnectable}
      />

      {/* Input labels */}
      {inputs.map((input, index) => (
        <div
          key={`label-${index}`}
          className="absolute text-xs font-medium"
          style={{
            left: -30,
            top: `${inputPositions[index]?.y * 100 || 50}%`,
            transform: 'translateY(-50%)'
          }}
        >
          {input.label || `I${index + 1}`}
        </div>
      ))}

      {/* Output label */}
      <div
        className="absolute text-xs font-medium"
        style={{
          right: -30,
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      >
        {data.outputLabel || 'O'}
      </div>
    </div>
  )
}

export default memo(LogicGateNode)

