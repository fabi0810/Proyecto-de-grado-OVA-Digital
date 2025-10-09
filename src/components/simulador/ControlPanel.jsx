import { useState } from 'react'

/**
 * Panel de Control con controles de entrada reubicados en la parte superior
 * para mejor usabilidad y acceso rápido
 */
const ControlPanel = ({ 
  inputs, 
  onInputChange, 
  onRemoveInput, 
  onClearCircuit, 
  onSaveCircuit 
}) => {
  const [newInputName, setNewInputName] = useState('')

  // Función para agregar nueva entrada
  const handleAddInput = () => {
    if (newInputName.trim() && !inputs[newInputName.trim()]) {
      onInputChange(newInputName.trim(), 0)
      setNewInputName('')
    }
  }

  // Función para guardar el circuito
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
      
      {/* SECCIÓN 1: CONTROLES DE ENTRADA (Movidos a la parte superior) */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
        <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
          </svg>
          Valores de Entrada
        </h4>
        
        {/* Controles de entrada - Ahora en la parte superior */}
        <div className="space-y-2">
          {Object.entries(inputs).map(([name, value]) => (
            <div key={name} className="flex items-center justify-between p-3 bg-white rounded-md border border-blue-200 shadow-sm">
              <span className="text-sm font-bold text-gray-800 min-w-[30px]">{name}:</span>
              <div className="flex items-center space-x-2">
                {/* Botón 0 */}
                <button
                  onClick={() => onInputChange(name, 0)}
                  className={`w-10 h-10 rounded-full border-2 font-bold text-sm transition-all duration-200 ${
                    value === 0 
                      ? 'bg-red-500 border-red-600 text-white shadow-lg scale-110' 
                      : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-red-50 hover:border-red-300'
                  }`}
                  title="Cambiar a 0"
                >
                  0
                </button>
                {/* Botón 1 */}
                <button
                  onClick={() => onInputChange(name, 1)}
                  className={`w-10 h-10 rounded-full border-2 font-bold text-sm transition-all duration-200 ${
                    value === 1 
                      ? 'bg-green-500 border-green-600 text-white shadow-lg scale-110' 
                      : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-green-50 hover:border-green-300'
                  }`}
                  title="Cambiar a 1"
                >
                  1
                </button>
                {/* Botón eliminar */}
                <button
                  onClick={() => onRemoveInput(name)}
                  className="w-8 h-8 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition-colors shadow-sm"
                  title="Eliminar entrada"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
          
          {/* Mensaje si no hay entradas */}
          {Object.keys(inputs).length === 0 && (
            <div className="text-center py-3 text-sm text-gray-500 bg-white rounded-md border border-dashed border-gray-300">
              No hay entradas. Agrega una entrada para comenzar.
            </div>
          )}
        </div>

        {/* Instrucciones de uso */}
        <div className="mt-3 text-xs text-blue-700 bg-blue-100 p-2 rounded flex items-start">
          <svg className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
          </svg>
          <div>
            <strong>Tip:</strong> Haz clic en los botones 0/1 para cambiar los valores de entrada. 
            Los cambios se reflejan inmediatamente en el circuito.
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: AGREGAR NUEVA ENTRADA */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Agregar Nueva Entrada
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
            className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors font-semibold"
          >
            +
          </button>
        </div>
      </div>

      {/* SECCIÓN 3: BOTONES DE ACCIÓN */}
      <div className="space-y-2">
        <button
          onClick={handleSave}
          className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center font-medium"
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z"/>
          </svg>
          Guardar Circuito
        </button>
        
        <button
          onClick={onClearCircuit}
          className="w-full px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors flex items-center justify-center font-medium"
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          Limpiar Circuito
        </button>
        
        <button
          onClick={() => window.location.reload()}
          className="w-full px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center font-medium"
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
          </svg>
          Actualizar Simulación
        </button>
      </div>

      {/* SECCIÓN 4: ESTADÍSTICAS DEL CIRCUITO */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Resumen del Circuito</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-50 p-2 rounded text-center">
            <div className="font-bold text-lg text-blue-600">{Object.keys(inputs).length}</div>
            <div className="text-gray-600">Entradas</div>
          </div>
          <div className="bg-gray-50 p-2 rounded text-center">
            <div className="font-bold text-lg text-green-600">
              {Object.values(inputs).filter(v => v === 1).length}
            </div>
            <div className="text-gray-600">Activas</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ControlPanel