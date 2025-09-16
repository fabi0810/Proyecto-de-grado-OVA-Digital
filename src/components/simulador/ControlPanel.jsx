import { useState } from 'react'

const ControlPanel = ({ 
  inputs, 
  onInputChange, 
  onAddInput, 
  onRemoveInput, 
  onClearCircuit,
  onSaveCircuit,
  onLoadCircuit,
  circuitStats
}) => {
  const [newInputName, setNewInputName] = useState('')
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [circuitName, setCircuitName] = useState('')

  const handleAddInput = () => {
    if (newInputName.trim() && !inputs[newInputName.trim()]) {
      onAddInput(newInputName.trim())
      setNewInputName('')
    }
  }

  const handleSaveCircuit = () => {
    if (circuitName.trim()) {
      onSaveCircuit(circuitName.trim())
      setShowSaveDialog(false)
      setCircuitName('')
    }
  }

  const getInputColor = (value) => {
    return value ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'
  }

  return (
    <div className="space-y-4">
      {/* Controles de Entrada */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Controles de Entrada
        </h3>
        
        <div className="space-y-3">
          {/* Entradas existentes */}
          <div className="space-y-2">
            {Object.entries(inputs).map(([name, value]) => (
              <div key={name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <label className="text-sm font-medium text-gray-700">
                  {name}:
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onInputChange(name, !value)}
                    className={`w-12 h-8 rounded-full border-2 font-bold text-sm transition-all duration-200 ${getInputColor(value)} hover:scale-105`}
                    title={`Cambiar ${name} a ${value ? '0' : '1'}`}
                  >
                    {value ? '1' : '0'}
                  </button>
                  <button
                    onClick={() => onRemoveInput(name)}
                    className="text-red-500 hover:text-red-700 text-sm p-1 hover:bg-red-100 rounded"
                    title="Eliminar entrada"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Agregar nueva entrada */}
          <div className="flex space-x-2 pt-2 border-t">
            <input
              type="text"
              value={newInputName}
              onChange={(e) => setNewInputName(e.target.value)}
              placeholder="Nombre de entrada (ej: L1, L2)"
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAddInput()}
            />
            <button
              onClick={handleAddInput}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              +
            </button>
          </div>
          
          {/* Instrucciones */}
          <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
            💡 <strong>Instrucciones:</strong> Haz clic en los botones 0/1 para cambiar los valores. 
            Los cambios se reflejan inmediatamente en el circuito.
          </div>
        </div>
      </div>

      {/* Estadísticas del Circuito */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Estadísticas del Circuito
        </h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center p-2 bg-blue-50 rounded">
            <div className="text-lg font-bold text-blue-600">
              {circuitStats.gateCount}
            </div>
            <div className="text-blue-800">Compuertas</div>
          </div>
          
          <div className="text-center p-2 bg-green-50 rounded">
            <div className="text-lg font-bold text-green-600">
              {circuitStats.connectionCount}
            </div>
            <div className="text-green-800">Conexiones</div>
          </div>
          
          <div className="text-center p-2 bg-purple-50 rounded">
            <div className="text-lg font-bold text-purple-600">
              {circuitStats.inputCount}
            </div>
            <div className="text-purple-800">Entradas</div>
          </div>
          
          <div className="text-center p-2 bg-orange-50 rounded">
            <div className="text-lg font-bold text-orange-600">
              {circuitStats.outputCount}
            </div>
            <div className="text-orange-800">Salidas</div>
          </div>
        </div>
      </div>

      {/* Controles del Circuito */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Controles del Circuito
        </h3>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onClearCircuit}
              className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
            >
              🗑️ Limpiar
            </button>
            
            <button
              onClick={() => setShowSaveDialog(true)}
              className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
            >
              💾 Guardar
            </button>
          </div>
          
          <button
            onClick={onLoadCircuit}
            className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            📁 Cargar Circuito
          </button>
        </div>
      </div>

      {/* Modal de Guardar */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Guardar Circuito
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del circuito:
                </label>
                <input
                  type="text"
                  value={circuitName}
                  onChange={(e) => setCircuitName(e.target.value)}
                  placeholder="Mi circuito lógico"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveCircuit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Guardar
                </button>
                <button
                  onClick={() => {
                    setShowSaveDialog(false)
                    setCircuitName('')
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ControlPanel