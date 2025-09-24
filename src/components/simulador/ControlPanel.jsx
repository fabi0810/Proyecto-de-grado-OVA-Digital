import { useState } from 'react'

const ControlPanel = ({ 
  inputs, 
  onInputChange, 
  onRemoveInput, 
  onClearCircuit, 
  onSaveCircuit 
}) => {
  const [newInputName, setNewInputName] = useState('')

  const handleAddInput = () => {
    if (newInputName.trim() && !inputs[newInputName.trim()]) {
      onInputChange(newInputName.trim(), 0)
      setNewInputName('')
    }
  }

  const handleSave = () => {
    const circuitName = prompt('Nombre del circuito:')
    if (circuitName && circuitName.trim()) {
      onSaveCircuit(circuitName.trim())
    }
  } 

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Panel de Control
      </h3>
      
      {/* Agregar nueva entrada */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Agregar Entrada
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newInputName}
            onChange={(e) => setNewInputName(e.target.value)}
            placeholder="Ej: C, D, E..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleAddInput()}
          />
          <button
            onClick={handleAddInput}
            className="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Valores de Entrada
        </h4>
        <div className="space-y-2">
          {Object.entries(inputs).map(([name, value]) => (
            <div key={name} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <span className="text-sm font-medium text-gray-700">{name}:</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onInputChange(name, 0)}
                  className={`w-8 h-8 rounded-full border-2 font-bold text-sm transition-all duration-200 ${
                    value === 0 
                      ? 'bg-red-500 border-yellow-600 text-white shadow-md' 
                      : 'bg-gray-200 border-gray-400 text-blue-600 hover:bg-yellow-100'
                  }`}
                >
                  0
                </button>
                <button
                  onClick={() => onInputChange(name, 1)}
                  className={`w-8 h-8 rounded-full border-2 font-bold text-sm transition-all duration-200 ${
                    value === 1 
                      ? 'bg-green-500 border-green-600 text-white shadow-md' 
                      : 'bg-gray-200 border-gray-400 text-gray-600 hover:bg-green-100'
                  }`}
                >
                  1
                </button>
                <button
                  onClick={() => onRemoveInput(name)}
                  className="w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors"
                  title="Eliminar entrada"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instrucciones */}
      <div className="mb-4 text-xs text-gray-500 bg-blue-50 p-2 rounded">
        💡 <strong>Instrucciones:</strong> Haz clic en los botones 0/1 para cambiar los valores de entrada. 
        Los cambios se reflejan inmediatamente en el circuito.
      </div>

      {/* Botones de acción */}
      <div className="space-y-2">
        <button
          onClick={handleSave}
          className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
        >
          💾 Guardar Circuito
        </button>
        <button
          onClick={onClearCircuit}
          className="w-full px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
        >
          🗑️ Limpiar Circuito
        </button>
      </div>

      {/* Botón de actualizar */}
      <div className="mt-4">
        <button
          onClick={() => window.location.reload()}
          className="w-full px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
        >
          🔄 Actualizar Simulación
        </button>
      </div>
    </div>
  )
}

export default ControlPanel