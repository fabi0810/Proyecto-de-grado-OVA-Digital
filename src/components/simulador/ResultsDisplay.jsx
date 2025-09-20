const ResultsDisplay = ({ results }) => {
  if (!results || results.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resultados de Simulación</h3>
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-4">⚡</div>
          <p className="text-gray-500">Agrega compuertas al circuito para ver los resultados</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Resultados de Simulación
      </h3>
      
      <div className="space-y-3">
        {results.map((result, index) => (
          <div 
            key={result.id} 
            className="p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-800">
                {result.label || result.type}
              </h4>
              <span className="text-xs text-gray-500">
                #{index + 1}
              </span>
            </div>
            
            <div className="space-y-2">
              {/* Entradas */}
              <div>
                <span className="text-sm text-gray-600">Entradas: </span>
                <div className="inline-flex space-x-1">
                  {result.inputs.map((input, i) => (
                    <span
                      key={i}
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        input === 1 
                          ? 'bg-green-100 text-green-800' 
                          : input === 0 
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {input !== undefined ? input : '-'}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Salida */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Salida:</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    result.output === 1 
                      ? 'bg-green-500 text-white' 
                      : result.output === 0 
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-400 text-white'
                  }`}
                >
                  {result.output !== undefined ? result.output : '-'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Resumen</h4>
        <div className="text-sm text-blue-800">
          <div>Total de compuertas: {results.length}</div>
          <div>
            Salidas activas: {results.filter(r => r.output === 1).length}
          </div>
          <div>
            Salidas inactivas: {results.filter(r => r.output === 0).length}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultsDisplay