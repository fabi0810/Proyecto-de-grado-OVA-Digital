import { useMemo } from 'react'
import { generateTruthTable, expressionFromCircuit, expressionsWithSimplification } from '../../utils/booleanTools'

/**
 * Panel de Análisis que muestra automáticamente:
 * - Tabla de verdad
 * - Expresiones booleanas (SOP)
 * - Expresiones simplificadas mediante Quine-McCluskey
 * 
 * NOTA: Este componente genera automáticamente el análisis sin necesidad de presionar botones
 */
function AnalisisPanel({ nodes, edges }) {
  // Generar tabla de verdad automáticamente
  const truth = useMemo(() => generateTruthTable(nodes, edges, 6), [nodes, edges])
  
  // Generar expresiones booleanas automáticamente
  const expr = useMemo(() => expressionFromCircuit(nodes, edges, 6), [nodes, edges])
  
  // Generar expresiones simplificadas automáticamente mediante Quine-McCluskey
  const simplified = useMemo(() => expressionsWithSimplification(nodes, edges, 6), [nodes, edges])

  // Manejar caso de ciclo detectado
  if (truth?.error === 'Ciclo detectado' || expr?.error === 'Ciclo detectado') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-700 font-semibold mb-2">Ciclo detectado</div>
        <div className="text-red-700 text-sm">No es posible analizar un circuito con lazos combinacionales.</div>
      </div>
    )
  }

  // Manejar caso de demasiadas entradas
  if (truth?.warning && !truth.rows?.length) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="text-yellow-800 font-semibold mb-2">Advertencia</div>
        <div className="text-yellow-800 text-sm">{truth.warning}</div>
        <div className="text-yellow-800 text-sm mt-2">Sugerencia: reduzca el número de entradas o analice por secciones.</div>
      </div>
    )
  }

  // Extraer datos de la tabla de verdad
  const inputNames = truth?.inputNames || []
  const outputs = truth?.outputs || []
  const rows = truth?.rows || []
  const expressions = expr?.expressions || {}

  return (
    <div className="space-y-6">
      {/* Sección: Tabla de verdad */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Tabla de verdad</h3>
          <span className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded">
            {rows.length} combinaciones
          </span>
        </div>

        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {/* Columnas de entradas */}
                {inputNames.map((n) => (
                  <th key={n} className="px-3 py-2 text-left text-gray-600 font-semibold border-b">{n}</th>
                ))}
                {/* Columnas de salidas */}
                {outputs.map((o) => (
                  <th key={o} className="px-3 py-2 text-left text-gray-600 font-semibold border-b bg-blue-50">{o}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {/* Valores de entrada */}
                  {inputNames.map((n) => (
                    <td key={n} className="px-3 py-2 text-center border-b">
                      <span className={`inline-block w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        r.inputs[n] === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {r.inputs[n]}
                      </span>
                    </td>
                  ))}
                  {/* Valores de salida */}
                  {outputs.map((o) => (
                    <td key={o} className="px-3 py-2 text-center border-b bg-blue-50">
                      <span className={`inline-block w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        r.outputs[o] === 1 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {r.outputs[o]}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sección: Expresiones booleanas (SOP - Suma de Productos) */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <span>Expresiones Booleanas (SOP)</span>
          <span className="ml-2 text-xs text-gray-500 bg-purple-50 px-2 py-1 rounded">
            Suma de Productos
          </span>
        </h3>
        <div className="space-y-3">
          {outputs.map((o) => (
            <div key={o} className="bg-gray-50 p-3 rounded-lg">
              <div className="font-semibold text-sm text-gray-700 mb-1">{o}:</div>
              <div className="text-gray-800 break-words font-mono text-sm bg-white p-2 rounded border">
                {expressions[o] || '0'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sección: Expresiones simplificadas (automático) */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3 flex items-center text-green-800">
          <span>✨ Expresiones Simplificadas</span>
          <span className="ml-2 text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
            Quine-McCluskey
          </span>
        </h3>
        <div className="space-y-3">
          {outputs.map((o) => {
            const result = simplified?.results?.[o]
            const isSimplified = result?.simplified && result.simplified !== result.sop
            
            return (
              <div key={o} className="bg-white p-3 rounded-lg border border-green-200">
                <div className="font-semibold text-sm text-gray-700 mb-2">{o}:</div>
                
                {/* Expresión original */}
                <div className="mb-2">
                  <span className="text-xs text-gray-500 uppercase">Original:</span>
                  <div className="text-gray-700 break-words font-mono text-sm bg-gray-50 p-2 rounded mt-1">
                    {result?.sop || expressions[o] || '0'}
                  </div>
                </div>
                
                {/* Expresión simplificada */}
                <div>
                  <span className="text-xs text-green-700 uppercase font-semibold">Simplificada:</span>
                  <div className={`break-words font-mono text-sm p-2 rounded mt-1 ${
                    isSimplified 
                      ? 'bg-green-100 text-green-800 font-semibold border border-green-300' 
                      : 'bg-gray-50 text-gray-700'
                  }`}>
                    {result?.simplified || result?.sop || expressions[o] || '0'}
                  </div>
                  {isSimplified && (
                    <div className="text-xs text-green-600 mt-1 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      Expresión optimizada
                    </div>
                  )}
                  {!isSimplified && result?.simplified && (
                    <div className="text-xs text-gray-500 mt-1">
                      Ya está en forma mínima
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Nota informativa */}
        <div className="mt-3 text-xs text-green-700 bg-green-100 p-2 rounded">
          <strong>Nota:</strong> Las expresiones se simplifican automáticamente usando el algoritmo de Quine-McCluskey.
          Este método encuentra la forma mínima de suma de productos (SOP) de la función booleana.
        </div>
      </div>

      {/* Leyenda de notación */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">📖 Notación utilizada:</h4>
        <div className="text-xs text-blue-800 space-y-1">
          <div>• <code className="bg-white px-1 rounded">A·B</code> = AND (producto lógico)</div>
          <div>• <code className="bg-white px-1 rounded">A + B</code> = OR (suma lógica)</div>
          <div>• <code className="bg-white px-1 rounded">A'</code> = NOT (complemento/negación)</div>
          <div>• <code className="bg-white px-1 rounded">SOP</code> = Suma de Productos (forma estándar)</div>
        </div>
      </div>
    </div>
  )
}

export default AnalisisPanel