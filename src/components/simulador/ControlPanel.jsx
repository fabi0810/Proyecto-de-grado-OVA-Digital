// src/components/simulador/ControlPanel.jsx

const ControlPanel = ({ inputs, onInputChange, onRemoveInput, onClearCircuit, onSaveCircuit }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        {/* Sección de Entradas - flex-1 para que tome el espacio disponible */}
        <div className="flex-1 min-w-[200px]">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">⚡ Entradas del Circuito</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(inputs).length === 0 ? (
              <div className="text-sm text-gray-500 italic">
                No hay entradas. Agrega una desde la paleta.
              </div>
            ) : (
              Object.entries(inputs).map(([name, value]) => (
                <div 
                  key={name} 
                  className="flex items-center p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md border border-blue-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Nombre de la entrada */}
                  <span className="text-sm font-bold text-gray-800 mr-2">{name}:</span>
                  
                  {/* Botón para valor 0 */}
                  <button 
                    onClick={() => onInputChange(name, 0)}
                    className={`w-7 h-7 rounded-full border-2 font-bold text-xs transition-all ${
                      value === 0 
                        ? 'bg-red-500 border-red-600 text-white scale-110 shadow-md' 
                        : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    0
                  </button>
                  
                  {/* Botón para valor 1 */}
                  <button 
                    onClick={() => onInputChange(name, 1)}
                    className={`w-7 h-7 rounded-full border-2 font-bold text-xs transition-all ml-1 ${
                      value === 1 
                        ? 'bg-green-500 border-green-600 text-white scale-110 shadow-md' 
                        : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    1
                  </button>
                  
                  {/* Botón para eliminar entrada */}
                  <button 
                    onClick={() => onRemoveInput(name)}
                    className="w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 ml-1 flex items-center justify-center transition-colors"
                    title={`Eliminar entrada ${name}`}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Botones de acción - se mantienen a la derecha */}
        <div className="flex flex-col gap-2">
          <button 
            onClick={onClearCircuit}
            className="px-4 py-2 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition-colors font-semibold shadow-sm hover:shadow-md whitespace-nowrap"
            title="Limpiar todo el circuito (mantiene las entradas)"
          >
            🗑️ Limpiar Circuito
          </button>
          
          {onSaveCircuit && (
            <button 
              onClick={() => {
                const name = prompt('Nombre del circuito:')
                if (name && name.trim()) {
                  onSaveCircuit(name.trim())
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors font-semibold shadow-sm hover:shadow-md whitespace-nowrap"
              title="Guardar el circuito actual"
            >
              💾 Guardar
            </button>
          )}
        </div>
      </div>
      
      {/* Información adicional */}
      {Object.entries(inputs).length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Total de entradas: <strong>{Object.entries(inputs).length}</strong></span>
            <span className="text-gray-400">Haz clic en 0 o 1 para cambiar el valor</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ControlPanel