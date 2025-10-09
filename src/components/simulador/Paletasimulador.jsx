import { useState } from 'react'

const GatePalette = ({ onGateSelect, selectedGate, onAddInput }) => {
  const gateTypes = [
    { id: 'AND', name: 'AND', color: 'bg-blue-100 hover:bg-blue-200' },
    { id: 'OR', name: 'OR', color: 'bg-green-100 hover:bg-green-200' },
    { id: 'NOT', name: 'NOT', color: 'bg-purple-100 hover:bg-purple-200' },
    { id: 'NAND', name: 'NAND', color: 'bg-orange-100 hover:bg-orange-200' },
    { id: 'NOR', name: 'NOR', color: 'bg-red-100 hover:bg-red-200' },
    { id: 'XOR', name: 'XOR', color: 'bg-yellow-100 hover:bg-yellow-200' },
    { id: 'XNOR', name: 'XNOR', color: 'bg-pink-100 hover:bg-pink-200' }
  ]

  const onDragStart = (event, payload) => {
    const data = typeof payload === 'string' ? payload : JSON.stringify(payload)
    event.dataTransfer.setData('application/reactflow', data)
  }

  const handleAddInput = () => {
    const inputName = prompt('Nombre de la entrada (ej: L1, L2, C):')
    if (inputName && inputName.trim()) {
      onAddInput(inputName.trim())
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Paleta de Compuertas
      </h3>
      
      {/* Botón para agregar entrada rápida */}
      <div className="mb-4">
        <button
          onClick={handleAddInput}
          className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
        >
          ➕ Agregar Entrada
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {gateTypes.map(gate => (
          <div
            key={gate.id}
            draggable
            onDragStart={(e) => onDragStart(e, { type: 'logicGate', id: gate.id, gateType: gate.id })}
            onClick={() => onGateSelect(gate)}
            className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedGate?.id === gate.id 
                ? 'border-blue-500 bg-blue-50' 
                : `border-gray-300 ${gate.color}`
            }`}
          >
            <div className="text-center">
              <div className="font-bold text-sm mb-1">{gate.name}</div>
              <div className="w-12 h-8 mx-auto bg-gray-100 rounded flex items-center justify-center text-xs">
                {gate.id === 'AND' && '&'}
                {gate.id === 'OR' && '≥1'}
                {gate.id === 'NOT' && '1'}
                {gate.id === 'NAND' && '&̄'}
                {gate.id === 'NOR' && '≥̄1'}
                {gate.id === 'XOR' && '=1'}
                {gate.id === 'XNOR' && '=̄1'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Extras: Constantes y Salidas */}
      <div className="mt-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Fuentes y Salidas</h4>
        <div className="grid grid-cols-2 gap-3">
          <div
            draggable
            onDragStart={(e) => onDragStart(e, { type: 'constant', id: 'CONST0', data: { value: 0, label: 'Const 0' } })}
            className="p-3 rounded-lg border-2 cursor-move bg-white border-gray-300 hover:shadow-sm"
          >
            <div className="text-center text-sm font-bold">Const 0</div>
          </div>
          <div
            draggable
            onDragStart={(e) => onDragStart(e, { type: 'constant', id: 'CONST1', data: { value: 1, label: 'Const 1' } })}
            className="p-3 rounded-lg border-2 cursor-move bg-white border-gray-300 hover:shadow-sm"
          >
            <div className="text-center text-sm font-bold">Const 1</div>
          </div>
          <div
            draggable
            onDragStart={(e) => onDragStart(e, { type: 'output', id: 'OUTPUT', data: { label: 'OUT' } })}
            className="p-3 rounded-lg border-2 cursor-move bg-white border-gray-300 hover:shadow-sm col-span-2"
          >
            <div className="text-center text-sm font-bold">Salida (Probe/LED)</div>
          </div>
        </div>
      </div>
      
      {selectedGate && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">{selectedGate.name}</h4>
          <p className="text-sm text-gray-600">
            {selectedGate.id === 'AND' && 'Salida 1 solo si todas las entradas son 1'}
            {selectedGate.id === 'OR' && 'Salida 1 si al menos una entrada es 1'}
            {selectedGate.id === 'NOT' && 'Invierte la entrada (0→1, 1→0)'}
            {selectedGate.id === 'NAND' && 'AND seguido de NOT'}
            {selectedGate.id === 'NOR' && 'OR seguido de NOT'}
            {selectedGate.id === 'XOR' && 'Salida 1 si las entradas son diferentes'}
            {selectedGate.id === 'XNOR' && 'XOR seguido de NOT'}
          </p>
        </div>
      )}
      
      {/* Instrucciones */}
      <div className="mt-4 text-xs text-gray-500 bg-blue-50 p-2 rounded">
        💡 <strong>Instrucciones:</strong> Arrastra las compuertas al canvas o haz clic para seleccionarlas.
      </div>
    </div>
  )
}

export default GatePalette