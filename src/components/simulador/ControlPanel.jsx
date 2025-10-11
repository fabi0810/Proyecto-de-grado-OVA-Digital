// src/components/simulador/ControlPanel.jsx
import { useRef } from 'react'
import { exportCircuit, importCircuit, getFileInfo } from '../../utils/circuitFileHandler'

const ControlPanel = ({ 
  inputs, 
  onInputChange, 
  onRemoveInput, 
  onClearCircuit, 
  onSaveCircuit,
  onLoadCircuit 
}) => {
  const fileInputRef = useRef(null)

  const handleExport = () => {
    const name = prompt('Nombre del circuito para exportar:', 'mi-circuito')
    if (name && name.trim()) {
      if (onSaveCircuit) {
        onSaveCircuit(name.trim(), true) // true = exportar
      }
    }
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const fileInfo = getFileInfo(file)
      console.log('📁 Archivo seleccionado:', fileInfo)

      // Mostrar loader o algo similar
      const result = await importCircuit(file)
      
      if (result.success && onLoadCircuit) {
        onLoadCircuit(result.data)
        alert(`✅ ${result.message}`)
      }
    } catch (error) {
      console.error('❌ Error al importar:', error)
      
      let errorMessage = '❌ Error al importar el circuito\n\n'
      
      switch (error.error) {
        case 'INVALID_EXTENSION':
          errorMessage += `${error.message}\n\nArchivos compatibles:\n• .circuit.json\n• .json`
          break
        case 'FILE_TOO_LARGE':
          errorMessage += error.message
          break
        case 'INVALID_FORMAT':
          errorMessage += `${error.message}\n\nDetalles:\n${
            Array.isArray(error.details) 
              ? error.details.map(d => `• ${d}`).join('\n') 
              : error.details
          }`
          break
        case 'PARSE_ERROR':
          errorMessage += `El archivo no es un JSON válido.\n\nDetalles: ${error.details}`
          break
        default:
          errorMessage += error.message || 'Error desconocido'
      }
      
      alert(errorMessage)
    } finally {
      // Limpiar el input para permitir seleccionar el mismo archivo de nuevo
      event.target.value = ''
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        {/* Sección de Entradas */}
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
                  <span className="text-sm font-bold text-gray-800 mr-2">{name}:</span>
                  
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
        
        {/* Botones de acción */}
        <div className="flex flex-col gap-2">
          <button 
            onClick={onClearCircuit}
            className="px-4 py-2 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition-colors font-semibold shadow-sm hover:shadow-md whitespace-nowrap"
            title="Limpiar todo el circuito (mantiene las entradas)"
          >
            🗑️ Limpiar
          </button>
          
          {/* Botón de Exportar */}
          {onSaveCircuit && (
            <button 
              onClick={handleExport}
              className="px-4 py-2 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors font-semibold shadow-sm hover:shadow-md whitespace-nowrap"
              title="Exportar circuito como archivo"
            >
              💾 Exportar
            </button>
          )}
          
          {/* Botón de Importar */}
          {onLoadCircuit && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.circuit"
                onChange={handleFileChange}
                className="hidden"
              />
              <button 
                onClick={handleImportClick}
                className="px-4 py-2 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition-colors font-semibold shadow-sm hover:shadow-md whitespace-nowrap"
                title="Importar circuito desde archivo"
              >
                📂 Importar
              </button>
            </>
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