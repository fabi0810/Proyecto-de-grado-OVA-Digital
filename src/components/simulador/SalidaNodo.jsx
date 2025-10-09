
import { memo } from 'react'
import { Handle, Position } from 'reactflow'

function SalidaNodo({ data, isConnectable }) {
  const label = data?.label ?? 'Salida'
  const value = data?.value === 1 ? 1 : 0

  return (
    <div className="bg-white border border-gray-300 rounded-md px-3 py-2 shadow-sm">
      <div className="text-xs text-gray-600 font-semibold mb-1">{label}</div>
      <div className="flex items-center space-x-2">
        <div className={`w-4 h-4 rounded-full ${value === 1 ? 'bg-red-500' : 'bg-gray-300'}`} />
        <div className="text-sm font-bold">{value}</div>
      </div>
      <Handle type="target" position={Position.Left} id="in" isConnectable={isConnectable} style={{ background: '#ef4444' }} />
    </div>
  )
}

export default memo(SalidaNodo)