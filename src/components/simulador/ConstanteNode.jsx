// components/simulador/ConstanteNodo.jsx
import { memo } from 'react'
import { Handle, Position } from 'reactflow'

function ConstanteNodo({ data }) {
  const value = data?.value === 1 ? 1 : 0
  const label = data?.label ?? (value === 1 ? 'Const 1' : 'Const 0')

  return (
    <div className="bg-white border border-gray-300 rounded-md px-3 py-2 shadow-sm">
      <div className="text-xs text-gray-600 font-semibold mb-1">{label}</div>
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${value === 1 ? 'bg-green-500' : 'bg-gray-300'}`} />
        <div className="text-sm font-bold">{value}</div>
      </div>
      <Handle type="source" position={Position.Right} id="out" style={{ background: '#3b82f6' }} />
    </div>
  )
}

export default memo(ConstanteNodo)