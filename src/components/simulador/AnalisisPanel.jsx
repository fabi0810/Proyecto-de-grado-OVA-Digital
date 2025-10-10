// src/components/simulador/AnalisisPanel.jsx
import { useMemo } from 'react'
import { 
  generateTruthTable, 
  expressionsComplete,
  expressionsWithSimplification 
} from '../../utils/booleanTools'

function AnalisisPanel({ nodes, edges }) {
  const truth = useMemo(() => generateTruthTable(nodes, edges, 6), [nodes, edges])
  const expr = useMemo(() => expressionsComplete(nodes, edges, 6), [nodes, edges])
  const simplified = useMemo(() => expressionsWithSimplification(nodes, edges, 6), [nodes, edges])

  // Manejo de errores
  if (truth?.error === 'Ciclo detectado' || expr?.error === 'Ciclo detectado') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-700 font-semibold mb-2">⚠️ Ciclo detectado</div>
        <div className="text-red-700 text-sm">No es posible analizar un circuito con lazos combinacionales.</div>
      </div>
    )
  }

  if (truth?.warning && !truth.rows?.length) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="text-yellow-800 font-semibold mb-2">⚠️ Advertencia</div>
        <div className="text-yellow-800 text-sm">{truth.warning}</div>
      </div>
    )
  }

  const inputNames = truth?.inputNames || []
  const outputs = truth?.outputs || []
  const rows = truth?.rows || []
  const expressions = expr?.expressions || {}

  if (inputNames.length === 0 || outputs.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="text-blue-800 font-semibold mb-2">ℹ️ Información</div>
        <div className="text-blue-700 text-sm">
          Agrega entradas y al menos un nodo de salida (LED) para generar el análisis.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
         

      {/* 2. EXPRESIONES SOP */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <span>➕ Expresiones SOP (Suma de Productos)</span>
        </h3>
        <div className="space-y-3">
          {outputs.map((o) => (
            <div key={o} className="bg-purple-50 p-3 rounded-lg border border-purple-200">
              <div className="font-semibold text-sm text-gray-700 mb-1">{o}:</div>
              <div className="text-gray-800 break-words font-mono text-sm bg-white p-2 rounded border">
                {expressions[o]?.sop || '0'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. EXPRESIONES POS */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <span>✖️ Expresiones POS (Producto de Sumas)</span>
        </h3>
        <div className="space-y-3">
          {outputs.map((o) => (
            <div key={o} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="font-semibold text-sm text-gray-700 mb-1">{o}:</div>
              <div className="text-gray-800 break-words font-mono text-sm bg-white p-2 rounded border">
                {expressions[o]?.pos || '1'}
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
      </div>

      {/* 4. EXPRESIONES SIMPLIFICADAS (Quine-McCluskey) */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3 flex items-center text-green-800">
          <span>✨ Expresiones Simplificadas (Quine-McCluskey)</span>
        </h3>
        <div className="space-y-3">
          {outputs.map((o) => {
            const result = simplified?.results?.[o]
            const isSimplified = result?.simplified && result.simplified !== result.sop
            
            return (
              <div key={o} className="bg-white p-3 rounded-lg border border-green-200">
                <div className="font-semibold text-sm text-gray-700 mb-2">{o}:</div>
                
                <div className="mb-2">
                  <span className="text-xs text-gray-500 uppercase">SOP Original:</span>
                  <div className="text-gray-700 break-words font-mono text-sm bg-gray-50 p-2 rounded mt-1">
                    {result?.sop || expressions[o]?.sop || '0'}
                  </div>
                </div>
                
                <div>
                  <span className="text-xs text-green-700 uppercase font-semibold">SOP Simplificada:</span>
                  <div className={`break-words font-mono text-sm p-2 rounded mt-1 ${
                    isSimplified 
                      ? 'bg-green-100 text-green-800 font-semibold border border-green-300' 
                      : 'bg-gray-50 text-gray-700'
                  }`}>
                    {result?.simplified || result?.sop || expressions[o]?.sop || '0'}
                  </div>
                  {isSimplified && (
                    <div className="text-xs text-green-600 mt-1 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      ✓ Expresión optimizada
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="mt-3 text-xs text-green-700 bg-green-100 p-2 rounded">
          <strong>Nota:</strong> Las expresiones se simplifican automáticamente usando el algoritmo de Quine-McCluskey,
          que encuentra la forma mínima de suma de productos.
        </div>
      </div>

      {/* 5. LEYENDA */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">📖 Notación:</h4>
        <div className="text-xs text-blue-800 space-y-1">
          <div>• <code className="bg-white px-1 rounded">A·B</code> = AND (producto lógico)</div>
          <div>• <code className="bg-white px-1 rounded">A + B</code> = OR (suma lógica)</div>
          <div>• <code className="bg-white px-1 rounded">A'</code> = NOT (complemento)</div>
          <div>• <code className="bg-white px-1 rounded">SOP</code> = Suma de Productos: A·B + A'·C</div>
          <div>• <code className="bg-white px-1 rounded">POS</code> = Producto de Sumas: (A+B)·(A'+C)</div>
        </div>
      </div>
    </div>
  )
}

export default AnalisisPanel