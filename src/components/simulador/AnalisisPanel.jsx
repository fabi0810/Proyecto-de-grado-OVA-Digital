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
  
  <div className="space-y-4">
    {outputs.map((o) => {
      const result = simplified?.results?.[o]
      const isSOPSimplified = result?.simplifiedSOP && result.simplifiedSOP !== result.sop
      const isPOSSimplified = result?.simplifiedPOS && result.simplifiedPOS !== result.pos
      
      return (
        <div key={o} className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
          <div className="font-semibold text-base text-gray-800 mb-3 flex items-center">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm mr-2">
              {o}
            </span>
            <span className="text-sm text-gray-600">Formas Mínimas</span>
          </div>
          
          {/* SOP Simplificada */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-purple-700 uppercase flex items-center">
                <span className="bg-purple-100 px-2 py-1 rounded mr-2">SOP</span>
                Suma de Productos
              </span>
              {isSOPSimplified && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                  ✓ Optimizada
                </span>
              )}
            </div>
            
            {/* SOP Original */}
            <div className="mb-2">
              <span className="text-xs text-gray-500 uppercase">Original:</span>
              <div className="text-gray-700 break-words font-mono text-sm bg-gray-50 p-2 rounded mt-1 border border-gray-200">
                {result?.sop || expressions[o]?.sop || '0'}
              </div>
            </div>
            
            {/* SOP Simplificada */}
            <div>
              <span className="text-xs text-purple-700 uppercase font-semibold">Simplificada:</span>
              <div className={`break-words font-mono text-sm p-2 rounded mt-1 ${
                isSOPSimplified 
                  ? 'bg-purple-100 text-purple-800 font-semibold border-2 border-purple-300' 
                  : 'bg-gray-50 text-gray-700 border border-gray-200'
              }`}>
                {result?.simplifiedSOP || result?.sop || expressions[o]?.sop || '0'}
              </div>
            </div>
          </div>
          
          {/* Separador */}
          <div className="border-t border-gray-200 my-3"></div>
          
          {/* POS Simplificada */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-blue-700 uppercase flex items-center">
                <span className="bg-blue-100 px-2 py-1 rounded mr-2">POS</span>
                Producto de Sumas
              </span>
              {isPOSSimplified && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                  ✓ Optimizada
                </span>
              )}
            </div>
            
            {/* POS Original */}
            <div className="mb-2">
              <span className="text-xs text-gray-500 uppercase">Original:</span>
              <div className="text-gray-700 break-words font-mono text-sm bg-gray-50 p-2 rounded mt-1 border border-gray-200">
                {result?.pos || expressions[o]?.pos || '1'}
              </div>
            </div>
            
            {/* POS Simplificada */}
            <div>
              <span className="text-xs text-blue-700 uppercase font-semibold">Simplificada:</span>
              <div className={`break-words font-mono text-sm p-2 rounded mt-1 ${
                isPOSSimplified 
                  ? 'bg-blue-100 text-blue-800 font-semibold border-2 border-blue-300' 
                  : 'bg-gray-50 text-gray-700 border border-gray-200'
              }`}>
                {result?.simplifiedPOS || result?.pos || expressions[o]?.pos || '1'}
              </div>
            </div>
          </div>
          
          {/* Comparación de complejidad */}
          {(isSOPSimplified || isPOSSimplified) && (
            <div className="mt-3 pt-3 border-t border-green-200">
              <div className="text-xs text-green-700 bg-green-50 p-2 rounded flex items-start">
                <svg className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
                <div>
                  <strong>Análisis:</strong>
                  {isSOPSimplified && isPOSSimplified ? (
                    <span> Ambas formas fueron optimizadas exitosamente.</span>
                  ) : isSOPSimplified ? (
                    <span> La forma SOP fue optimizada. La forma POS ya está en su mínima expresión.</span>
                  ) : (
                    <span> La forma POS fue optimizada. La forma SOP ya está en su mínima expresión.</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )
    })}
  </div>
  
  <div className="mt-4 text-xs text-green-700 bg-green-100 p-3 rounded">
    <strong>📌 Nota sobre simplificación:</strong> El algoritmo de Quine-McCluskey garantiza encontrar 
    la forma mínima tanto para SOP (Suma de Productos) como para POS (Producto de Sumas). 
    Ambas representaciones son lógicamente equivalentes pero pueden tener diferente complejidad de implementación.
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