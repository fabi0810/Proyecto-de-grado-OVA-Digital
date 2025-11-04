import { useState, useEffect } from 'react'
import { karnaughMapper } from '../../utils/KarnaughMapper'

function KarnaughMapper({ expression, parsedExpression, karnaughMap, onExpressionChange }) {
  const [mapMode, setMapMode] = useState('minTerms')
  const [selectedGroups, setSelectedGroups] = useState([])
  const [showGrouping, setShowGrouping] = useState(true)
  const [highlightedCell, setHighlightedCell] = useState(null)
  const [dontCares, setDontCares] = useState('')
  const [showSteps, setShowSteps] = useState(false)

  useEffect(() => {
    if (parsedExpression && parsedExpression.success) {
      try {
        const dc = dontCares
          .split(',')
          .map(s => s.trim())
          .filter(s => s !== '')
          .map(n => parseInt(n))
          .filter(n => !Number.isNaN(n))
        const map = karnaughMapper.generateMap(expression, parsedExpression.variables, {
          mode: mapMode,
          showGroups: showGrouping,
          dontCares: dc,
          enableSteps: showSteps
        })
        // El mapa se pasa como prop desde el componente padre
      } catch (error) {
        console.error('Error generando mapa de Karnaugh:', error)
      }
    }
  }, [expression, parsedExpression, mapMode, showGrouping, dontCares, showSteps])

  const handleCellClick = (row, col, cell) => {
    setHighlightedCell({ row, col, cell })
  }

  const toggleGroup = (groupIndex) => {
    setSelectedGroups(prev => 
      prev.includes(groupIndex) 
        ? prev.filter(i => i !== groupIndex)
        : [...prev, groupIndex]
    )
  }

  const render2VarMap = (map) => {
    return (
      <div className="overflow-x-auto">
        <table className="border-collapse border border-gray-400 mx-auto">
          <thead>
            <tr>
              <th className="border border-gray-400 px-4 py-2 bg-gray-100"></th>
              <th className="border border-gray-400 px-4 py-2 bg-gray-100">
                {map.cols[0].label}
              </th>
              <th className="border border-gray-400 px-4 py-2 bg-gray-100">
                {map.cols[1].label}
              </th>
            </tr>
          </thead>
          <tbody>
            {map.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="border border-gray-400 px-4 py-2 bg-gray-100 font-semibold">
                  {row.label}
                </td>
                {map.cells[rowIndex].map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className={`border border-gray-400 px-4 py-2 text-center cursor-pointer transition-colors ${
                      highlightedCell?.row === rowIndex && highlightedCell?.col === colIndex
                        ? 'bg-yellow-200'
                        : cell.value === 1
                        ? 'bg-green-100 hover:bg-green-200'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => handleCellClick(rowIndex, colIndex, cell)}
                  >
                    {cell.value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const render3VarMap = (map) => {
    return (
      <div className="overflow-x-auto">
        <table className="border-collapse border border-gray-400 mx-auto">
          <thead>
            <tr>
              <th className="border border-gray-400 px-4 py-2 bg-gray-100"></th>
              <th className="border border-gray-400 px-4 py-2 bg-gray-100">
                {map.cols[0].label}
              </th>
              <th className="border border-gray-400 px-4 py-2 bg-gray-100">
                {map.cols[1].label}
              </th>
            </tr>
          </thead>
          <tbody>
            {map.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="border border-gray-400 px-4 py-2 bg-gray-100 font-semibold">
                  {row.label}
                </td>
                {map.cells[rowIndex].map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className={`border border-gray-400 px-4 py-2 text-center cursor-pointer transition-colors ${
                      highlightedCell?.row === rowIndex && highlightedCell?.col === colIndex
                        ? 'bg-yellow-200'
                        : cell.value === 1
                        ? 'bg-green-100 hover:bg-green-200'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => handleCellClick(rowIndex, colIndex, cell)}
                  >
                    {cell.value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const render4VarMap = (map) => {
    return (
      <div className="overflow-x-auto">
        <table className="border-collapse border border-gray-400 mx-auto">
          <thead>
            <tr>
              <th className="border border-gray-400 px-4 py-2 bg-gray-100"></th>
              {map.cols.map((col, index) => (
                <th key={index} className="border border-gray-400 px-4 py-2 bg-gray-100">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {map.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="border border-gray-400 px-4 py-2 bg-gray-100 font-semibold">
                  {row.label}
                </td>
                {map.cells[rowIndex].map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className={`border border-gray-400 px-4 py-2 text-center cursor-pointer transition-colors ${
                      highlightedCell?.row === rowIndex && highlightedCell?.col === colIndex
                        ? 'bg-yellow-200'
                        : cell.value === 1
                        ? 'bg-green-100 hover:bg-green-200'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => handleCellClick(rowIndex, colIndex, cell)}
                  >
                    {cell.value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const renderMap = () => {
    if (!karnaughMap) return null

    switch (karnaughMap.map.type) {
      case '2var':
        return render2VarMap(karnaughMap.map)
      case '3var':
        return render3VarMap(karnaughMap.map)
      case '4var':
        return render4VarMap(karnaughMap.map)
      case '5var':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-3">Mapa para {karnaughMap.map.splitVariable}'</h4>
              {render4VarMap(karnaughMap.map.leftMap)}
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-3">Mapa para {karnaughMap.map.splitVariable}</h4>
              {render4VarMap(karnaughMap.map.rightMap)}
            </div>
          </div>
        )
      case '6var':
        return (
          <div className="grid grid-cols-2 gap-6">
            {karnaughMap.map.maps.map((submap, index) => (
              <div key={index}>
                <h4 className="text-lg font-semibold mb-3">{submap.label}</h4>
                {render4VarMap(submap.map)}
              </div>
            ))}
          </div>
        )
      default:
        return <div>Mapa no soportado</div>
    }
  }

  if (!parsedExpression || !parsedExpression.success) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Mapa de Karnaugh</h2>
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">🗺️</div>
          <p className="text-lg">Ingresa una expresión booleana válida para generar el mapa de Karnaugh</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Mapa de Karnaugh</h2>
        <div className="flex items-center space-x-4">
        </div>
      </div>

      {/* Información del Mapa */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Expresión:</span>
            <span className="ml-2 font-mono text-gray-600">{expression}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Variables:</span>
            <span className="ml-2 text-gray-600">{parsedExpression.variables.join(', ')}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Tipo:</span>
            <span className="ml-2 text-gray-600">{karnaughMap?.map.type || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Mapa de Karnaugh */}
      <div className="mb-6">
        {renderMap()}
      </div>

      {/* Información de la Celda Seleccionada */}
      {highlightedCell && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">Celda Seleccionada</h4>
          <div className="text-sm text-yellow-700">
            <p><strong>Posición:</strong> Fila {highlightedCell.row + 1}, Columna {highlightedCell.col + 1}</p>
            <p><strong>Valor:</strong> {highlightedCell.cell.value}</p>
            <p><strong>Mintérmino:</strong> {highlightedCell.cell.minTerm || 'N/A'}</p>
            <p><strong>Maxtérmino:</strong> {highlightedCell.cell.maxTerm || 'N/A'}</p>
          </div>
        </div>
      )}

      {/* Agrupaciones */}
      {karnaughMap && karnaughMap.groups && karnaughMap.groups.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Agrupaciones Encontradas</h3>
          <div className="space-y-3">
            {karnaughMap.groups.map((group, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedGroups.includes(index)
                    ? 'bg-blue-100 border-blue-300'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => toggleGroup(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-600">Grupo {index + 1}</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                      {group.size} celdas
                    </span>
                    {group.essential && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">Esencial</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {group.expression}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pasos de agrupamiento */}
      {showSteps && karnaughMap && karnaughMap.steps && karnaughMap.steps.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Proceso de Agrupamiento</h3>
          <div className="space-y-2 text-sm">
            {karnaughMap.steps.map((s, i) => (
              <div key={i} className="p-3 bg-gray-50 border border-gray-200 rounded">
                {s.action === 'candidate' && (
                  <div>
                    Candidato: rect({s.rect.h}x{s.rect.w}) en ({s.rect.r+1},{s.rect.c+1}) → {s.expression}
                  </div>
                )}
                {s.action === 'select_essential' && (
                  <div className="text-purple-700">Seleccionado esencial: grupo #{s.group+1}</div>
                )}
                {s.action === 'select_group' && (
                  <div className="text-blue-700">Seleccionado: grupo #{s.group+1}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Expresión Simplificada */}
      {karnaughMap && karnaughMap.simplifiedExpression && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">Expresión Simplificada</h4>
          <div className="font-mono text-lg text-green-700">
            {karnaughMap.simplifiedExpression}
          </div>
        </div>
      )}


      {/* Estadísticas del Mapa */}
      {karnaughMap && karnaughMap.complexity && (
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-gray-800">
              {karnaughMap.complexity.totalCells}
            </div>
            <div className="text-sm text-gray-600">Celdas Totales</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-gray-800">
              {karnaughMap.complexity.filledCells}
            </div>
            <div className="text-sm text-gray-600">Celdas Llenas</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-gray-800">
              {karnaughMap.complexity.groups}
            </div>
            <div className="text-sm text-gray-600">Grupos</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-gray-800">
              {karnaughMap.complexity.complexity}
            </div>
            <div className="text-sm text-gray-600">Complejidad</div>
          </div>
        </div>
      )}

      {/* Instrucciones de Uso */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Instrucciones de Uso</h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-blue-700">
          <div>
            <h4 className="font-medium mb-2">Agrupación de Celdas:</h4>
            <ul className="space-y-1">
              <li>• Agrupa celdas con valor 1 (mintérminos)</li>
              <li>• Los grupos deben ser rectangulares</li>
              <li>• El tamaño debe ser potencia de 2</li>
              <li>• Pueden envolver los bordes</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Reglas de Agrupación:</h4>
            <ul className="space-y-1">
              <li>• 1 celda = 4 variables</li>
              <li>• 2 celdas = 3 variables</li>
              <li>• 4 celdas = 2 variables</li>
              <li>• 8 celdas = 1 variable</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KarnaughMapper
