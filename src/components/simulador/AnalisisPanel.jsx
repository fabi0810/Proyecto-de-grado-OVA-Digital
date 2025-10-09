import { useMemo, useState } from 'react'
import { generateTruthTable, expressionFromCircuit, expressionsWithSimplification } from '../../utils/booleanTools'

function AnalisisPanel({ nodes, edges }) {
  const [showSimplified, setShowSimplified] = useState(false)

  const truth = useMemo(() => generateTruthTable(nodes, edges, 6), [nodes, edges])
  const expr = useMemo(() => expressionFromCircuit(nodes, edges, 6), [nodes, edges])
  const simplified = useMemo(() => showSimplified ? expressionsWithSimplification(nodes, edges, 6) : null, [nodes, edges, showSimplified])

  if (truth?.error === 'Ciclo detectado' || expr?.error === 'Ciclo detectado') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-700 font-semibold mb-2">Ciclo detectado</div>
        <div className="text-red-700 text-sm">No es posible analizar un circuito con lazos combinacionales.</div>
      </div>
    )
  }

  if (truth?.warning && !truth.rows?.length) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="text-yellow-800 font-semibold mb-2">Advertencia</div>
        <div className="text-yellow-800 text-sm">{truth.warning}</div>
        <div className="text-yellow-800 text-sm mt-2">Sugerencia: reduzca el número de entradas o analice por secciones.</div>
      </div>
    )
  }

  const inputNames = truth?.inputNames || []
  const outputs = truth?.outputs || []
  const rows = truth?.rows || []
  const expressions = expr?.expressions || {}

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Tabla de verdad</h3>
          <button
            onClick={() => setShowSimplified(s => !s)}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            {showSimplified ? 'Ocultar simplificación' : 'Simplificar'}
          </button>
        </div>

        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                {inputNames.map((n) => (
                  <th key={n} className="px-2 py-1 text-left text-gray-600 font-semibold">{n}</th>
                ))}
                {outputs.map((o) => (
                  <th key={o} className="px-2 py-1 text-left text-gray-600 font-semibold">{o}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={idx} className="border-t">
                  {inputNames.map((n) => (
                    <td key={n} className="px-2 py-1">{r.inputs[n]}</td>
                  ))}
                  {outputs.map((o) => (
                    <td key={o} className="px-2 py-1 font-semibold">{r.outputs[o]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Expresiones (SOP)</h3>
        <div className="space-y-2">
          {outputs.map((o) => (
            <div key={o} className="text-sm">
              <div className="font-semibold">{o}:</div>
              <div className="text-gray-800 break-words">{expressions[o] || '—'}</div>
              {showSimplified && simplified?.results?.[o]?.simplified && (
                <div className="text-green-700 mt-1">
                  <span className="font-semibold">Minimizada:</span> {simplified.results[o].simplified}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AnalisisPanel

