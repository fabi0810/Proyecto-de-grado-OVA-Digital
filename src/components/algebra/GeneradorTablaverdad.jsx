import { useState, useEffect } from 'react'
import { booleanParser } from '../../utils/BooleanExpressionParser'

function TruthTableGenerator({ expression, parsedExpression, truthTable, onExpressionChange }) {
  const [showIntermediateColumns, setShowIntermediateColumns] = useState(false)
  const [highlightedRow, setHighlightedRow] = useState(null)
  const [exportFormat, setExportFormat] = useState('table')

  useEffect(() => {
    if (parsedExpression && parsedExpression.success) {
      const table = booleanParser.generateTruthTable(parsedExpression.ast, parsedExpression.variables)
      // La tabla se pasa como prop desde el componente padre
    }
  }, [parsedExpression])

  const exportTable = (format) => {
    if (!truthTable || truthTable.length === 0) return

    let content = ''
    
    if (format === 'csv') {
      // Exportar como CSV
      const headers = [...parsedExpression.variables, 'Resultado']
      content = headers.join(',') + '\n'
      
      truthTable.forEach(row => {
        const values = parsedExpression.variables.map(variable => 
          row[variable] ? '1' : '0'
        )
        values.push(row.result ? '1' : '0')
        content += values.join(',') + '\n'
      })
    } else if (format === 'latex') {
      // Exportar como LaTeX
      content = '\\begin{table}[h]\n'
      content += '\\centering\n'
      content += '\\begin{tabular}{|' + 'c|'.repeat(parsedExpression.variables.length + 1) + '}\n'
      content += '\\hline\n'
      
      // Headers
      const headers = [...parsedExpression.variables, 'F']
      content += headers.join(' & ') + ' \\\\\n'
      content += '\\hline\n'
      
      // Rows
      truthTable.forEach(row => {
        const values = parsedExpression.variables.map(variable => 
          row[variable] ? '1' : '0'
        )
        values.push(row.result ? '1' : '0')
        content += values.join(' & ') + ' \\\\\n'
      })
      
      content += '\\hline\n'
      content += '\\end{tabular}\n'
      content += '\\caption{Tabla de Verdad para ' + expression + '}\n'
      content += '\\end{table}'
    } else {
      // Exportar como texto plano
      const headers = [...parsedExpression.variables, 'Resultado']
      content = headers.join('\t') + '\n'
      
      truthTable.forEach(row => {
        const values = parsedExpression.variables.map(variable => 
          row[variable] ? '1' : '0'
        )
        values.push(row.result ? '1' : '0')
        content += values.join('\t') + '\n'
      })
    }

    // Descargar archivo
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tabla_verdad_${Date.now()}.${format === 'csv' ? 'csv' : format === 'latex' ? 'tex' : 'txt'}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const analyzeTable = () => {
    if (!truthTable || truthTable.length === 0) return null

    const analysis = {
      totalRows: truthTable.length,
      trueRows: truthTable.filter(row => row.result).length,
      falseRows: truthTable.filter(row => !row.result).length,
      isTautology: truthTable.every(row => row.result),
      isContradiction: truthTable.every(row => !row.result),
      isSatisfiable: truthTable.some(row => row.result)
    }

    return analysis
  }

  const analysis = analyzeTable()

  if (!parsedExpression || !parsedExpression.success) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tabla de Verdad</h2>
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-lg">Ingresa una expresión booleana válida para generar la tabla de verdad</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Tabla de Verdad</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowIntermediateColumns(!showIntermediateColumns)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showIntermediateColumns
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {showIntermediateColumns ? 'Ocultar' : 'Mostrar'} Columnas Intermedias
          </button>
          
          <div className="relative">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="table">Tabla</option>
              <option value="csv">CSV</option>
              <option value="latex">LaTeX</option>
              <option value="text">Texto</option>
            </select>
          </div>
          
          <button
            onClick={() => exportTable(exportFormat)}
            className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
          >
            Exportar
          </button>
        </div>
      </div>

      {/* Información de la Expresión */}
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
            <span className="font-medium text-gray-700">Combinaciones:</span>
            <span className="ml-2 text-gray-600">{truthTable.length}</span>
          </div>
        </div>
      </div>

      {/* Análisis de la Tabla */}
      {analysis && (
        <div className="mb-6 grid md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{analysis.totalRows}</div>
            <div className="text-sm text-blue-700">Total de Filas</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{analysis.trueRows}</div>
            <div className="text-sm text-green-700">Filas Verdaderas</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{analysis.falseRows}</div>
            <div className="text-sm text-red-700">Filas Falsas</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {analysis.isTautology ? 'T' : analysis.isContradiction ? 'C' : 'S'}
            </div>
            <div className="text-sm text-purple-700">
              {analysis.isTautology ? 'Tautología' : 
               analysis.isContradiction ? 'Contradicción' : 'Satisfacible'}
            </div>
          </div>
        </div>
      )}

      {/* Tabla de Verdad */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {parsedExpression.variables.map((variable, index) => (
                <th
                  key={variable}
                  className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700"
                >
                  {variable}
                </th>
              ))}
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700 bg-green-100">
                Resultado
              </th>
            </tr>
          </thead>
          <tbody>
            {truthTable.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`hover:bg-gray-50 transition-colors ${
                  highlightedRow === rowIndex ? 'bg-yellow-100' : ''
                } ${row.result ? 'bg-green-50' : 'bg-red-50'}`}
                onClick={() => setHighlightedRow(highlightedRow === rowIndex ? null : rowIndex)}
              >
                {parsedExpression.variables.map((variable) => (
                  <td
                    key={variable}
                    className="border border-gray-300 px-4 py-3 text-center font-mono"
                  >
                    {row[variable] ? '1' : '0'}
                  </td>
                ))}
                <td className="border border-gray-300 px-4 py-3 text-center font-mono font-bold">
                  {row.result ? '1' : '0'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Información Adicional */}
      {highlightedRow !== null && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">Fila Seleccionada</h4>
          <div className="text-sm text-yellow-700">
            <p><strong>Combinación:</strong> {parsedExpression.variables.map(variable => 
              `${variable}=${truthTable[highlightedRow][variable] ? '1' : '0'}`
            ).join(', ')}</p>
            <p><strong>Resultado:</strong> {truthTable[highlightedRow].result ? 'Verdadero (1)' : 'Falso (0)'}</p>
            <p><strong>Mintérmino:</strong> {truthTable[highlightedRow].minTerm || 'N/A'}</p>
            <p><strong>Maxtérmino:</strong> {truthTable[highlightedRow].maxTerm || 'N/A'}</p>
          </div>
        </div>
      )}

      {/* Estadísticas Adicionales */}
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-3">Distribución de Resultados</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Verdaderos:</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(analysis.trueRows / analysis.totalRows) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{analysis.trueRows}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Falsos:</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${(analysis.falseRows / analysis.totalRows) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{analysis.falseRows}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-3">Propiedades Lógicas</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Tautología:</span>
              <span className={`font-medium ${analysis.isTautology ? 'text-green-600' : 'text-gray-400'}`}>
                {analysis.isTautology ? 'Sí' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Contradicción:</span>
              <span className={`font-medium ${analysis.isContradiction ? 'text-red-600' : 'text-gray-400'}`}>
                {analysis.isContradiction ? 'Sí' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Satisfacible:</span>
              <span className={`font-medium ${analysis.isSatisfiable ? 'text-blue-600' : 'text-gray-400'}`}>
                {analysis.isSatisfiable ? 'Sí' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TruthTableGenerator
