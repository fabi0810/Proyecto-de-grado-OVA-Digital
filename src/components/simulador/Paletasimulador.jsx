import { useState } from 'react'

const GatePalette = ({ onGateSelect, selectedGate, onAddInput }) => {
  // Definición de compuertas con sus iconos SVG
  const gateTypes = [
    { id: 'AND', name: 'AND', color: 'bg-blue-100 hover:bg-blue-200' },
    { id: 'OR', name: 'OR', color: 'bg-green-100 hover:bg-green-200' },
    { id: 'NOT', name: 'NOT', color: 'bg-purple-100 hover:bg-purple-200' },
    { id: 'NAND', name: 'NAND', color: 'bg-orange-100 hover:bg-orange-200' },
    { id: 'NOR', name: 'NOR', color: 'bg-red-100 hover:bg-red-200' },
    { id: 'XOR', name: 'XOR', color: 'bg-yellow-100 hover:bg-yellow-200' },
    { id: 'XNOR', name: 'XNOR', color: 'bg-pink-100 hover:bg-pink-200' }
  ]

  // Función para renderizar el icono SVG de cada compuerta
  const renderGateIcon = (gateType) => {
    const iconStyle = { width: '100%', height: '100%' }
    
    switch (gateType) {
      case 'AND':
        return (
          <svg viewBox="0 0 60 40" style={iconStyle}>
            <path 
              d="M5 5 L35 5 Q50 5 50 20 Q50 35 35 35 L5 35 Z" 
              fill="white" 
              stroke="#3b82f6" 
              strokeWidth="1.5"
            />
            <text x="30" y="23" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1e40af">&amp;</text>
          </svg>
        )
      
      case 'OR':
        return (
          <svg viewBox="0 0 60 40" style={iconStyle}>
            <path 
              d="M5 5 Q15 5 20 20 Q15 35 5 35 Q25 30 50 20 Q25 10 5 5" 
              fill="white" 
              stroke="#10b981" 
              strokeWidth="1.5"
            />
            <text x="28" y="23" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#047857">≥1</text>
          </svg>
        )
      
      case 'NOT':
        return (
          <svg viewBox="0 0 60 40" style={iconStyle}>
            <path 
              d="M10 5 L10 35 L40 20 Z" 
              fill="white" 
              stroke="#8b5cf6" 
              strokeWidth="1.5"
            />
            <circle cx="43" cy="20" r="4" fill="white" stroke="#8b5cf6" strokeWidth="1.5"/>
            <text x="22" y="23" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#6d28d9">1</text>
          </svg>
        )
      
      case 'NAND':
        return (
          <svg viewBox="0 0 60 40" style={iconStyle}>
            <path 
              d="M5 5 L35 5 Q47 5 47 20 Q47 35 35 35 L5 35 Z" 
              fill="white" 
              stroke="#f97316" 
              strokeWidth="1.5"
            />
            <circle cx="52" cy="20" r="4" fill="white" stroke="#f97316" strokeWidth="1.5"/>
            <text x="28" y="23" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#ea580c">&amp;</text>
          </svg>
        )
      
      case 'NOR':
        return (
          <svg viewBox="0 0 60 40" style={iconStyle}>
            <path 
              d="M5 5 Q15 5 20 20 Q15 35 5 35 Q25 30 47 20 Q25 10 5 5" 
              fill="white" 
              stroke="#ef4444" 
              strokeWidth="1.5"
            />
            <circle cx="52" cy="20" r="4" fill="white" stroke="#ef4444" strokeWidth="1.5"/>
            <text x="28" y="23" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#dc2626">≥1</text>
          </svg>
        )
      
      case 'XOR':
        return (
          <svg viewBox="0 0 60 40" style={iconStyle}>
            <path 
              d="M2 5 Q10 5 15 20 Q10 35 2 35" 
              fill="none" 
              stroke="#eab308" 
              strokeWidth="1.5"
            />
            <path 
              d="M5 5 Q15 5 20 20 Q15 35 5 35 Q25 30 50 20 Q25 10 5 5" 
              fill="white" 
              stroke="#eab308" 
              strokeWidth="1.5"
            />
            <text x="28" y="23" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#ca8a04">=1</text>
          </svg>
        )
      
      case 'XNOR':
        return (
          <svg viewBox="0 0 60 40" style={iconStyle}>
            <path 
              d="M2 5 Q10 5 15 20 Q10 35 2 35" 
              fill="none" 
              stroke="#ec4899" 
              strokeWidth="1.5"
            />
            <path 
              d="M5 5 Q15 5 20 20 Q15 35 5 35 Q25 30 47 20 Q25 10 5 5" 
              fill="white" 
              stroke="#ec4899" 
              strokeWidth="1.5"
            />
            <circle cx="52" cy="20" r="4" fill="white" stroke="#ec4899" strokeWidth="1.5"/>
            <text x="28" y="23" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#be185d">=1</text>
          </svg>
        )
      
      default:
        return null
    }
  }

  // Función para manejar el inicio del arrastre
  const onDragStart = (event, payload) => {
    const data = typeof payload === 'string' ? payload : JSON.stringify(payload)
    event.dataTransfer.setData('application/reactflow', data)
  }

  // Función para agregar entrada mediante diálogo
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
      
      {/* Grid de compuertas con iconos visuales */}
      <div className="grid grid-cols-2 gap-3">
        {gateTypes.map(gate => (
          <div
            key={gate.id}
            draggable
            onDragStart={(e) => onDragStart(e, { type: 'logicGate', id: gate.id, gateType: gate.id })}
            onClick={() => onGateSelect(gate)}
            className={`p-2 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedGate?.id === gate.id 
                ? 'border-blue-500 bg-blue-50' 
                : `border-gray-300 ${gate.color}`
            }`}
          >
            <div className="text-center">
              {/* Nombre de la compuerta */}
              <div className="font-bold text-xs mb-1">{gate.name}</div>
              {/* Icono SVG de la compuerta */}
              <div className="w-full h-12 flex items-center justify-center">
                {renderGateIcon(gate.id)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sección de componentes adicionales: Constantes y Salidas */}
      <div className="mt-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Fuentes y Salidas</h4>
        <div className="grid grid-cols-2 gap-3">
          {/* Constante 0 */}
          <div
            draggable
            onDragStart={(e) => onDragStart(e, { type: 'constant', id: 'CONST0', data: { value: 0, label: 'Const 0' } })}
            className="p-2 rounded-lg border-2 cursor-move bg-white border-gray-300 hover:shadow-sm"
          >
            <div className="text-center">
              <div className="text-xs font-bold mb-1">Const 0</div>
              <svg viewBox="0 0 40 30" className="w-full h-8">
                <rect x="5" y="5" width="30" height="20" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" rx="3"/>
                <text x="20" y="19" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">0</text>
              </svg>
            </div>
          </div>
          
          {/* Constante 1 */}
          <div
            draggable
            onDragStart={(e) => onDragStart(e, { type: 'constant', id: 'CONST1', data: { value: 1, label: 'Const 1' } })}
            className="p-2 rounded-lg border-2 cursor-move bg-white border-gray-300 hover:shadow-sm"
          >
            <div className="text-center">
              <div className="text-xs font-bold mb-1">Const 1</div>
              <svg viewBox="0 0 40 30" className="w-full h-8">
                <rect x="5" y="5" width="30" height="20" fill="#10b981" stroke="#065f46" strokeWidth="1.5" rx="3"/>
                <text x="20" y="19" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">1</text>
              </svg>
            </div>
          </div>
          
          {/* Salida/LED */}
          <div
            draggable
            onDragStart={(e) => onDragStart(e, { type: 'output', id: 'OUTPUT', data: { label: 'OUT' } })}
            className="p-2 rounded-lg border-2 cursor-move bg-white border-gray-300 hover:shadow-sm col-span-2"
          >
            <div className="text-center">
              <div className="text-xs font-bold mb-1">Salida (LED)</div>
              <svg viewBox="0 0 60 30" className="w-full h-8">
                <circle cx="30" cy="15" r="10" fill="#fbbf24" stroke="#92400e" strokeWidth="1.5"/>
                <circle cx="30" cy="15" r="6" fill="#fef3c7" stroke="#92400e" strokeWidth="1"/>
                <text x="30" y="18" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#92400e">OUT</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Panel de información de la compuerta seleccionada */}
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
      
      {/* Instrucciones de uso */}
      <div className="mt-4 text-xs text-gray-500 bg-blue-50 p-2 rounded">
        💡 <strong>Instrucciones:</strong> Arrastra las compuertas al canvas o haz clic para seleccionarlas.
      </div>
    </div>
  )
}

export default GatePalette