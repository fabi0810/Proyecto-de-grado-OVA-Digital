import { useState } from 'react'

const BooleanTheoryExplainer = () => {
  const [activeSection, setActiveSection] = useState('intro')
  const [showVisualization, setShowVisualization] = useState({})
  const [interactiveExample, setInteractiveExample] = useState({})

  const sections = {
    intro: {
      name: 'Introducción al Álgebra de Boole',
      icon: '🔢',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      description: 'El álgebra de Boole es el fundamento matemático de los sistemas digitales y la lógica computacional.',
      content: {
        definition: 'Sistema algebraico que opera con valores binarios (0 y 1) y tres operaciones fundamentales: AND, OR y NOT.',
        purpose: [
          'Diseño y análisis de circuitos digitales',
          'Simplificación de expresiones lógicas',
          'Optimización de hardware',
          'Base de la programación y computación'
        ],
        binaryValues: {
          title: 'Variables y Valores Binarios',
          explanation: 'En álgebra booleana, las variables solo pueden tomar dos valores:',
          values: [
            { value: '0', meaning: 'Falso, Apagado, Bajo', voltage: '0V' },
            { value: '1', meaning: 'Verdadero, Encendido, Alto', voltage: '5V' }
          ]
        },
        operators: [
          {
            name: 'AND (Conjunción)',
            symbol: '·',
            alternatives: 'x, *, &, AB',
            description: 'El resultado es 1 solo si TODAS las entradas son 1',
            truth: [
              { a: 0, b: 0, result: 0 },
              { a: 0, b: 1, result: 0 },
              { a: 1, b: 0, result: 0 },
              { a: 1, b: 1, result: 1 }
            ],
            gate: '∧'
          },
          {
            name: 'OR (Disyunción)',
            symbol: '+',
            alternatives: '|, ∨',
            description: 'El resultado es 1 si AL MENOS una entrada es 1',
            truth: [
              { a: 0, b: 0, result: 0 },
              { a: 0, b: 1, result: 1 },
              { a: 1, b: 0, result: 1 },
              { a: 1, b: 1, result: 1 }
            ],
            gate: '∨'
          },
          {
            name: 'NOT (Negación)',
            symbol: '¬',
            alternatives: "', !, ~",
            description: 'Invierte el valor de la entrada',
            truth: [
              { a: 0, result: 1 },
              { a: 1, result: 0 }
            ],
            gate: '¬'
          }
        ]
      }
    },
    laws: {
      name: 'Leyes y Propiedades Fundamentales',
      icon: '⚖️',
      color: 'bg-green-100 text-green-800 border-green-200',
      description: 'Leyes matemáticas que permiten manipular y simplificar expresiones booleanas.',
      content: {
        laws: [
          {
            category: 'Leyes de Identidad',
            rules: [
              { expression: 'A + 0 = A', name: 'Identidad OR', explanation: 'OR con 0 no cambia el valor' },
              { expression: 'A · 1 = A', name: 'Identidad AND', explanation: 'AND con 1 no cambia el valor' }
            ]
          },
          {
            category: 'Leyes de Nulidad',
            rules: [
              { expression: 'A + 1 = 1', name: 'Nulidad OR', explanation: 'OR con 1 siempre es 1' },
              { expression: 'A · 0 = 0', name: 'Nulidad AND', explanation: 'AND con 0 siempre es 0' }
            ]
          },
          {
            category: 'Leyes de Idempotencia',
            rules: [
              { expression: 'A + A = A', name: 'Idempotencia OR', explanation: 'OR de A consigo mismo es A' },
              { expression: 'A · A = A', name: 'Idempotencia AND', explanation: 'AND de A consigo mismo es A' }
            ]
          },
          {
            category: 'Leyes del Complemento',
            rules: [
              { expression: "A + A' = 1", name: 'Complemento OR', explanation: 'A o su negación siempre es verdadero' },
              { expression: "A · A' = 0", name: 'Complemento AND', explanation: 'A y su negación siempre es falso' },
              { expression: "(A')' = A", name: 'Doble Negación', explanation: 'Negar dos veces devuelve el original' }
            ]
          },
          {
            category: 'Leyes Conmutativas',
            rules: [
              { expression: 'A + B = B + A', name: 'Conmutativa OR', explanation: 'El orden no altera el resultado' },
              { expression: 'A · B = B · A', name: 'Conmutativa AND', explanation: 'El orden no altera el resultado' }
            ]
          },
          {
            category: 'Leyes Asociativas',
            rules: [
              { expression: '(A + B) + C = A + (B + C)', name: 'Asociativa OR', explanation: 'Los paréntesis no afectan' },
              { expression: '(A · B) · C = A · (B · C)', name: 'Asociativa AND', explanation: 'Los paréntesis no afectan' }
            ]
          },
          {
            category: 'Leyes Distributivas',
            rules: [
              { expression: 'A · (B + C) = (A · B) + (A · C)', name: 'Distributiva AND sobre OR', explanation: 'Similar a la multiplicación en álgebra' },
              { expression: 'A + (B · C) = (A + B) · (A + C)', name: 'Distributiva OR sobre AND', explanation: 'Única del álgebra booleana' }
            ]
          },
          {
            category: 'Leyes de Absorción',
            rules: [
              { expression: 'A + (A · B) = A', name: 'Absorción 1', explanation: 'A absorbe el término que lo contiene' },
              { expression: 'A · (A + B) = A', name: 'Absorción 2', explanation: 'A absorbe el término que lo contiene' }
            ]
          },
          {
            category: 'Teoremas de De Morgan',
            rules: [
              { expression: "(A + B)' = A' · B'", name: 'De Morgan 1', explanation: 'La negación del OR es el AND de las negaciones' },
              { expression: "(A · B)' = A' + B'", name: 'De Morgan 2', explanation: 'La negación del AND es el OR de las negaciones' }
            ],
            highlight: true
          }
        ]
      }
    },
    canonical: {
      name: 'Formas Canónicas',
      icon: '📋',
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      description: 'Representaciones estándar de funciones booleanas derivadas de tablas de verdad.',
      content: {
        intro: 'Las formas canónicas son expresiones estándar que representan todas las combinaciones de una función booleana.',
        forms: [
          {
            name: 'Suma de Productos (SOP)',
            abbr: 'Sum of Products',
            symbol: 'Σ (minterms)',
            description: 'Suma (OR) de productos (AND) de variables',
            structure: 'F = ABC + AB\'C + A\'BC',
            when: 'Se toman las filas donde la salida es 1',
            example: {
              truthTable: [
                { a: 0, b: 0, c: 0, f: 0 },
                { a: 0, b: 0, c: 1, f: 1 },
                { a: 0, b: 1, c: 0, f: 0 },
                { a: 0, b: 1, c: 1, f: 1 },
                { a: 1, b: 0, c: 0, f: 0 },
                { a: 1, b: 0, c: 1, f: 0 },
                { a: 1, b: 1, c: 0, f: 1 },
                { a: 1, b: 1, c: 1, f: 1 }
              ],
              minterms: [1, 3, 6, 7],
              expression: "F = A'B'C + A'BC + ABC' + ABC",
              simplified: "F = A'C + AB"
            }
          },
          {
            name: 'Producto de Sumas (POS)',
            abbr: 'Product of Sums',
            symbol: 'Π (maxterms)',
            description: 'Producto (AND) de sumas (OR) de variables',
            structure: '(A+B+C)(A+B\'+C)(A\'+B+C)',
            when: 'Se toman las filas donde la salida es 0',
            example: {
              truthTable: [
                { a: 0, b: 0, c: 0, f: 0 },
                { a: 0, b: 0, c: 1, f: 1 },
                { a: 0, b: 1, c: 0, f: 0 },
                { a: 0, b: 1, c: 1, f: 1 },
                { a: 1, b: 0, c: 0, f: 0 },
                { a: 1, b: 0, c: 1, f: 0 },
                { a: 1, b: 1, c: 0, f: 1 },
                { a: 1, b: 1, c: 1, f: 1 }
              ],
              maxterms: [0, 2, 4, 5],
              expression: "F = (A+B+C)(A+B'+C)(A'+B+C)(A'+B+C')",
              simplified: "F = (B+C)(A+C)"
            }
          }
        ],
        comparison: {
          title: 'Comparación SOP vs POS',
          differences: [
            { aspect: 'Estructura', sop: 'Suma de productos', pos: 'Producto de sumas' },
            { aspect: 'Se basa en', sop: 'Salidas = 1 (minterms)', pos: 'Salidas = 0 (maxterms)' },
            { aspect: 'Operación principal', sop: 'OR (+)', pos: 'AND (·)' },
            { aspect: 'Términos', sop: 'Productos AND', pos: 'Sumas OR' },
            { aspect: 'Uso común', sop: 'Más frecuente', pos: 'Menos frecuente' }
          ]
        }
      }
    },
    simplification: {
      name: 'Simplificación de Expresiones',
      icon: '🧮',
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      description: 'Técnicas para reducir expresiones booleanas a su forma más simple.',
      content: {
        intro: 'La simplificación reduce el número de términos y variables, optimizando circuitos digitales.',
        benefits: [
          'Menor cantidad de compuertas lógicas',
          'Reducción de costos en hardware',
          'Mayor velocidad de procesamiento',
          'Menor consumo de energía'
        ],
        examples: [
          {
            title: 'Ejemplo 1: Aplicación de Identidad',
            original: "F = A · 1 + B · 0",
            steps: [
              { step: 1, expression: "F = A · 1 + B · 0", law: 'Expresión original' },
              { step: 2, expression: "F = A + 0", law: 'Identidad AND (A·1=A) y Nulidad AND (B·0=0)' },
              { step: 3, expression: "F = A", law: 'Identidad OR (A+0=A)' }
            ],
            result: 'F = A'
          },
          {
            title: 'Ejemplo 2: Teorema de De Morgan',
            original: "(A + B)'",
            steps: [
              { step: 1, expression: "(A + B)'", law: 'Expresión original' },
              { step: 2, expression: "A' · B'", law: 'De Morgan: (A+B)\' = A\'·B\'' }
            ],
            result: "F = A' · B'"
          },
          {
            title: 'Ejemplo 3: Absorción',
            original: "F = A + A · B",
            steps: [
              { step: 1, expression: "F = A + A · B", law: 'Expresión original' },
              { step: 2, expression: "F = A · (1 + B)", law: 'Factor común A' },
              { step: 3, expression: "F = A · 1", law: 'Nulidad OR (1+B=1)' },
              { step: 4, expression: "F = A", law: 'Identidad AND (A·1=A)' }
            ],
            result: 'F = A'
          },
          {
            title: 'Ejemplo 4: Simplificación Compleja',
            original: "F = AB + AB' + A'B",
            steps: [
              { step: 1, expression: "F = AB + AB' + A'B", law: 'Expresión original' },
              { step: 2, expression: "F = A(B + B') + A'B", law: 'Factor común A' },
              { step: 3, expression: "F = A · 1 + A'B", law: "Complemento (B+B'=1)" },
              { step: 4, expression: "F = A + A'B", law: 'Identidad (A·1=A)' },
              { step: 5, expression: "F = (A + A')(A + B)", law: 'Distributiva' },
              { step: 6, expression: "F = 1 · (A + B)", law: "Complemento (A+A'=1)" },
              { step: 7, expression: "F = A + B", law: 'Identidad' }
            ],
            result: 'F = A + B'
          }
        ]
      }
    },
    karnaugh: {
      name: 'Mapas de Karnaugh',
      icon: '🗺️',
      color: 'bg-red-100 text-red-800 border-red-200',
      description: 'Método visual para simplificar expresiones booleanas mediante agrupamiento.',
      content: {
        intro: 'Los mapas de Karnaugh (K-maps) son una herramienta gráfica que facilita la simplificación sin aplicar leyes algebraicas paso a paso.',
        advantages: [
          'Visualización clara de la función',
          'Identificación rápida de simplificaciones',
          'Menor probabilidad de error que el método algebraico',
          'Útil para 2-5 variables'
        ],
        grayCode: {
          title: 'Código Gray',
          explanation: 'Las filas y columnas se ordenan usando código Gray, donde solo cambia un bit entre valores adyacentes.',
          examples: [
            { decimal: 0, binary: '00', gray: '00' },
            { decimal: 1, binary: '01', gray: '01' },
            { decimal: 2, binary: '10', gray: '11' },
            { decimal: 3, binary: '11', gray: '10' }
          ]
        },
        sizes: [
          {
            variables: 2,
            name: 'Mapa 2x2',
            rows: 2,
            cols: 2,
            cells: 4,
            layout: [
              [{ vars: "A'B'", index: 0 }, { vars: "A'B", index: 1 }],
              [{ vars: "AB'", index: 2 }, { vars: "AB", index: 3 }]
            ]
          },
          {
            variables: 3,
            name: 'Mapa 2x4',
            rows: 2,
            cols: 4,
            cells: 8,
            layout: [
              [{ vars: "A'B'C'", index: 0 }, { vars: "A'B'C", index: 1 }, { vars: "A'BC", index: 3 }, { vars: "A'BC'", index: 2 }],
              [{ vars: "AB'C'", index: 4 }, { vars: "AB'C", index: 5 }, { vars: "ABC", index: 7 }, { vars: "ABC'", index: 6 }]
            ]
          },
          {
            variables: 4,
            name: 'Mapa 4x4',
            rows: 4,
            cols: 4,
            cells: 16
          }
        ],
        grouping: {
          title: 'Reglas de Agrupamiento',
          rules: [
            'Los grupos deben contener 1, 2, 4, 8... celdas (potencias de 2)',
            'Los grupos deben ser rectangulares o cuadrados',
            'Se busca formar los grupos más grandes posibles',
            'Los grupos pueden sobreponerse',
            'Los grupos pueden "envolver" los bordes del mapa',
            'Cada grupo genera un término en la expresión simplificada'
          ]
        },
        exampleMap: {
          title: 'Ejemplo: Mapa de 3 variables',
          function: "F(A,B,C) = Σ(1,3,5,7)",
          map: [
            [0, 1, 1, 0],
            [0, 1, 1, 0]
          ],
          groups: [
            { cells: [1, 3, 5, 7], term: 'C', explanation: 'Grupo vertical derecho: C = 1' }
          ],
          result: 'F = C'
        }
      }
    },
    summary: {
      name: 'Resumen y Práctica',
      icon: '📚',
      color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      description: 'Consolidación de conceptos y guía rápida de referencia.',
      content: {
        quickRef: {
          title: 'Tabla de Referencia Rápida',
          laws: [
            { name: 'Identidad', and: 'A · 1 = A', or: 'A + 0 = A' },
            { name: 'Nulidad', and: 'A · 0 = 0', or: 'A + 1 = 1' },
            { name: 'Idempotencia', and: 'A · A = A', or: 'A + A = A' },
            { name: 'Complemento', and: "A · A' = 0", or: "A + A' = 1" },
            { name: 'De Morgan', and: "(A·B)' = A'+B'", or: "(A+B)' = A'·B'" },
            { name: 'Absorción', and: 'A·(A+B) = A', or: 'A+A·B = A' }
          ]
        },
        workflow: {
          title: 'Flujo de Trabajo para Simplificación',
          steps: [
            { step: 1, action: 'Obtener la tabla de verdad', icon: '📊' },
            { step: 2, action: 'Escribir en forma canónica (SOP o POS)', icon: '📝' },
            { step: 3, action: 'Elegir método: Algebraico o K-map', icon: '🔀' },
            { step: 4, action: 'Aplicar simplificación', icon: '🧮' },
            { step: 5, action: 'Verificar resultado', icon: '✅' }
          ]
        },
        tips: [
          'Busca primero aplicar De Morgan y absorción',
          'En K-maps, agrupa siempre de mayor a menor',
          'Verifica que cada minterm esté en al menos un grupo',
          'La expresión simplificada debe tener menos términos',
          'Practica con ejemplos variados para dominar las técnicas'
        ]
      }
    }
  }

  const currentSection = sections[activeSection]

  const toggleVisualization = (key) => {
    setShowVisualization(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleExample = (key, values) => {
    setInteractiveExample(prev => ({ ...prev, [key]: values }))
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Teoría de Álgebra Booleana
        </h2>
        <p className="text-gray-600">
          Explora los fundamentos matemáticos de los sistemas digitales
        </p>
      </div>

      {/* Selector de secciones */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {Object.entries(sections).map(([key, section]) => (
          <button
            key={key}
            onClick={() => setActiveSection(key)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              activeSection === key
                ? `${section.color} border-current shadow-lg scale-105`
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-2">{section.icon}</div>
            <div className="font-semibold text-sm">{section.name}</div>
          </button>
        ))}
      </div>

      {/* Contenido de la sección */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <div className="text-3xl mr-4">{currentSection.icon}</div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{currentSection.name}</h3>
            <p className="text-gray-600">{currentSection.description}</p>
          </div>
        </div>

        {/* Introducción */}
        {activeSection === 'intro' && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Definición</h4>
              <p className="text-gray-700">{currentSection.content.definition}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Propósito y Aplicaciones</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {currentSection.content.purpose.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">{currentSection.content.binaryValues.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{currentSection.content.binaryValues.explanation}</p>
              <div className="grid md:grid-cols-2 gap-4">
                {currentSection.content.binaryValues.values.map((val, i) => (
                  <div key={i} className="bg-white p-3 rounded border">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{val.value}</div>
                    <div className="text-sm text-gray-700">{val.meaning}</div>
                    <div className="text-xs text-gray-500 mt-1">Nivel: {val.voltage}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Operadores Básicos</h4>
              <div className="space-y-4">
                {currentSection.content.operators.map((op, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h5 className="font-semibold text-lg">{op.name}</h5>
                        <div className="text-sm text-gray-500">
                          Símbolo: <span className="font-mono font-bold">{op.symbol}</span>
                          {' | '}Alternativas: <span className="font-mono">{op.alternatives}</span>
                        </div>
                      </div>
                      <div className="text-3xl text-blue-600">{op.gate}</div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{op.description}</p>
                    <div className="bg-gray-50 rounded p-3">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            {op.truth[0].b !== undefined && <th className="text-left py-1">A</th>}
                            {op.truth[0].b !== undefined && <th className="text-left py-1">B</th>}
                            {op.truth[0].b === undefined && <th className="text-left py-1">A</th>}
                            <th className="text-left py-1 font-bold">Salida</th>
                          </tr>
                        </thead>
                        <tbody>
                          {op.truth.map((row, j) => (
                            <tr key={j} className="border-b border-gray-200">
                              <td className="py-1 font-mono">{row.a}</td>
                              {row.b !== undefined && <td className="py-1 font-mono">{row.b}</td>}
                              <td className="py-1 font-mono font-bold text-blue-600">{row.result}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Leyes y Propiedades */}
        {activeSection === 'laws' && (
          <div className="space-y-6">
            {currentSection.content.laws.map((lawGroup, i) => (
              <div key={i} className={`border-l-4 ${lawGroup.highlight ? 'border-red-500 bg-red-50' : 'border-green-500 bg-gray-50'} p-4 rounded`}>
                <h4 className="font-semibold text-lg mb-3">{lawGroup.category}</h4>
                <div className="space-y-2">
                  {lawGroup.rules.map((rule, j) => (
                    <div key={j} className="bg-white p-3 rounded border">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-mono font-bold text-blue-700 mb-1">{rule.expression}</div>
                          <div className="text-sm font-semibold text-gray-700">{rule.name}</div>
                          <div className="text-xs text-gray-600">{rule.explanation}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Formas Canónicas */}
        {activeSection === 'canonical' && (
          <div className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-gray-700">{currentSection.content.intro}</p>
            </div>

            <div className="space-y-6">
              {currentSection.content.forms.map((form, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-lg">{form.name}</h4>
                      <div className="text-sm text-gray-500">{form.abbr} - {form.symbol}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{form.description}</p>
                  <div className="bg-gray-50 p-3 rounded mb-3">
                    <div className="font-mono text-sm">{form.structure}</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded mb-3">
                    <div className="text-sm font-semibold mb-1">¿Cuándo usar?</div>
                    <div className="text-sm text-gray-700">{form.when}</div>
                  </div>
                  
                  <button
                    onClick={() => toggleVisualization(`canonical-${i}`)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    {showVisualization[`canonical-${i}`] ? '▼ Ocultar' : '▶ Ver'} Ejemplo Completo
                  </button>

                  {showVisualization[`canonical-${i}`] && (
                    <div className="mt-4 space-y-3">
                      <div>
                        <div className="text-sm font-semibold mb-2">Tabla de Verdad</div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm border">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="border p-2">A</th>
                                <th className="border p-2">B</th>
                                <th className="border p-2">C</th>
                                <th className="border p-2 bg-blue-100">F</th>
                                <th className="border p-2">{i === 0 ? 'Minterm' : 'Maxterm'}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {form.example.truthTable.map((row, j) => (
                                <tr key={j} className={row.f === (i === 0 ? 1 : 0) ? 'bg-yellow-50' : ''}>
                                  <td className="border p-2 text-center font-mono">{row.a}</td>
                                  <td className="border p-2 text-center font-mono">{row.b}</td>
                                  <td className="border p-2 text-center font-mono">{row.c}</td>
                                  <td className="border p-2 text-center font-mono font-bold">{row.f}</td>
                                  <td className="border p-2 text-center text-xs">{j}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-500">
                        <div className="text-sm font-semibold mb-1">
                          {i === 0 ? 'Minterms' : 'Maxterms'} seleccionados: {i === 0 ? form.example.minterms.join(', ') : form.example.maxterms.join(', ')}
                        </div>
                      </div>

                      <div className="bg-purple-50 p-3 rounded">
                        <div className="text-sm font-semibold mb-1">Expresión Canónica</div>
                        <div className="font-mono text-sm">{form.example.expression}</div>
                      </div>

                      <div className="bg-green-50 p-3 rounded">
                        <div className="text-sm font-semibold mb-1">Expresión Simplificada</div>
                        <div className="font-mono text-sm font-bold">{form.example.simplified}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">{currentSection.content.comparison.title}</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="text-left p-2">Aspecto</th>
                      <th className="text-left p-2 bg-purple-100">SOP</th>
                      <th className="text-left p-2 bg-blue-100">POS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSection.content.comparison.differences.map((diff, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-2 font-semibold">{diff.aspect}</td>
                        <td className="p-2">{diff.sop}</td>
                        <td className="p-2">{diff.pos}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Simplificación */}
        {activeSection === 'simplification' && (
          <div className="space-y-6">
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-3">{currentSection.content.intro}</p>
              <h4 className="font-semibold mb-2">Beneficios</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                {currentSection.content.benefits.map((benefit, i) => (
                  <li key={i}>{benefit}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              {currentSection.content.examples.map((example, i) => (
                <div key={i} className="border-l-4 border-orange-500 bg-white p-4 rounded shadow-sm">
                  <h4 className="font-bold text-lg mb-2">{example.title}</h4>
                  <div className="bg-gray-100 p-3 rounded mb-3">
                    <div className="text-sm text-gray-600 mb-1">Expresión Original:</div>
                    <div className="font-mono font-bold text-lg">{example.original}</div>
                  </div>

                  <button
                    onClick={() => toggleVisualization(`simplif-${i}`)}
                    className="text-sm text-orange-600 hover:text-orange-800 font-semibold mb-3"
                  >
                    {showVisualization[`simplif-${i}`] ? '▼ Ocultar' : '▶ Ver'} Pasos de Simplificación
                  </button>

                  {showVisualization[`simplif-${i}`] && (
                    <div className="space-y-2 mb-3">
                      {example.steps.map((step, j) => (
                        <div key={j} className="bg-blue-50 p-3 rounded border-l-2 border-blue-500">
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {step.step}
                            </div>
                            <div className="flex-1">
                              <div className="font-mono font-bold mb-1">{step.expression}</div>
                              <div className="text-xs text-gray-600">{step.law}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="bg-green-100 p-3 rounded border-l-4 border-green-500">
                    <div className="text-sm text-gray-700 mb-1">Resultado Final:</div>
                    <div className="font-mono font-bold text-lg text-green-800">{example.result}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mapas de Karnaugh */}
        {activeSection === 'karnaugh' && (
          <div className="space-y-6">
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-3">{currentSection.content.intro}</p>
              <h4 className="font-semibold mb-2">Ventajas</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                {currentSection.content.advantages.map((adv, i) => (
                  <li key={i}>{adv}</li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">{currentSection.content.grayCode.title}</h4>
              <p className="text-sm text-gray-700 mb-3">{currentSection.content.grayCode.explanation}</p>
              <div className="grid grid-cols-4 gap-2">
                {currentSection.content.grayCode.examples.map((ex, i) => (
                  <div key={i} className="bg-white p-2 rounded border text-center">
                    <div className="text-xs text-gray-500">Dec: {ex.decimal}</div>
                    <div className="font-mono text-sm">Bin: {ex.binary}</div>
                    <div className="font-mono text-sm font-bold text-blue-600">Gray: {ex.gray}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Tamaños de Mapas</h4>
              <div className="space-y-4">
                {currentSection.content.sizes.map((size, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h5 className="font-semibold">{size.name}</h5>
                        <div className="text-sm text-gray-500">
                          {size.variables} variables - {size.cells} celdas ({size.rows}×{size.cols})
                        </div>
                      </div>
                      {size.layout && (
                        <button
                          onClick={() => toggleVisualization(`kmap-${i}`)}
                          className="text-sm text-red-600 hover:text-red-800 font-semibold"
                        >
                          {showVisualization[`kmap-${i}`] ? '▼ Ocultar' : '▶ Ver'} Mapa
                        </button>
                      )}
                    </div>

                    {showVisualization[`kmap-${i}`] && size.layout && (
                      <div className="bg-gray-50 p-4 rounded">
                        <div className="inline-block">
                          {size.layout.map((row, ri) => (
                            <div key={ri} className="flex">
                              {row.map((cell, ci) => (
                                <div
                                  key={ci}
                                  className="w-24 h-16 border border-gray-400 flex flex-col items-center justify-center text-xs hover:bg-blue-100 transition-colors"
                                >
                                  <div className="font-mono font-bold text-gray-700">{cell.vars}</div>
                                  <div className="text-gray-500 text-xs">m{cell.index}</div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
              <h4 className="font-semibold mb-3">{currentSection.content.grouping.title}</h4>
              <ul className="space-y-2 text-sm">
                {currentSection.content.grouping.rules.map((rule, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-yellow-600 font-bold mr-2">{i + 1}.</span>
                    <span className="text-gray-700">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-2 border-red-500 rounded-lg p-4 bg-white">
              <h4 className="font-bold text-lg mb-3">{currentSection.content.exampleMap.title}</h4>
              <div className="bg-gray-50 p-3 rounded mb-3">
                <div className="font-mono text-sm">{currentSection.content.exampleMap.function}</div>
              </div>

              <div className="mb-4">
                <div className="inline-block">
                  <div className="flex mb-1">
                    <div className="w-16"></div>
                    <div className="w-16 text-center text-xs font-semibold">BC=00</div>
                    <div className="w-16 text-center text-xs font-semibold">BC=01</div>
                    <div className="w-16 text-center text-xs font-semibold">BC=11</div>
                    <div className="w-16 text-center text-xs font-semibold">BC=10</div>
                  </div>
                  {currentSection.content.exampleMap.map.map((row, ri) => (
                    <div key={ri} className="flex">
                      <div className="w-16 flex items-center justify-center text-xs font-semibold">
                        A={ri}
                      </div>
                      {row.map((cell, ci) => (
                        <div
                          key={ci}
                          className={`w-16 h-16 border-2 border-gray-400 flex items-center justify-center text-xl font-bold ${
                            cell === 1 ? 'bg-green-200 text-green-800' : 'bg-white text-gray-300'
                          }`}
                        >
                          {cell}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {currentSection.content.exampleMap.groups.map((group, i) => (
                  <div key={i} className="bg-green-50 p-3 rounded border-l-4 border-green-500">
                    <div className="text-sm">
                      <span className="font-semibold">Grupo {i + 1}:</span> Celdas [{group.cells.join(', ')}]
                    </div>
                    <div className="text-sm text-gray-600">{group.explanation}</div>
                    <div className="font-mono font-bold text-green-700 mt-1">Término: {group.term}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 bg-blue-100 p-3 rounded border-l-4 border-blue-500">
                <div className="text-sm font-semibold mb-1">Expresión Simplificada</div>
                <div className="font-mono font-bold text-lg">{currentSection.content.exampleMap.result}</div>
              </div>
            </div>
          </div>
        )}

        {/* Resumen */}
        {activeSection === 'summary' && (
          <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">{currentSection.content.quickRef.title}</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-indigo-200">
                    <tr>
                      <th className="text-left p-2">Ley</th>
                      <th className="text-left p-2">AND (·)</th>
                      <th className="text-left p-2">OR (+)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSection.content.quickRef.laws.map((law, i) => (
                      <tr key={i} className="border-b bg-white">
                        <td className="p-2 font-semibold">{law.name}</td>
                        <td className="p-2 font-mono text-xs">{law.and}</td>
                        <td className="p-2 font-mono text-xs">{law.or}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border-2 border-indigo-300">
              <h4 className="font-semibold mb-4">{currentSection.content.workflow.title}</h4>
              <div className="space-y-3">
                {currentSection.content.workflow.steps.map((step, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                      {step.step}
                    </div>
                    <div className="flex-1 flex items-center space-x-2">
                      <span className="text-2xl">{step.icon}</span>
                      <span className="text-gray-700">{step.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <h4 className="font-semibold mb-3">💡 Consejos Prácticos</h4>
              <ul className="space-y-2">
                {currentSection.content.tips.map((tip, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span className="text-gray-700 text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg text-center">
              <h4 className="text-xl font-bold mb-2">¡Estás listo para practicar!</h4>
              <p className="text-indigo-100 mb-4">
                Ahora que dominas la teoría, pasa a las secciones de práctica y ejercicios
              </p>
              <div className="flex justify-center space-x-4">
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <div className="text-2xl mb-1">📊</div>
                  <div className="text-sm">Tablas de Verdad</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <div className="text-2xl mb-1">🧮</div>
                  <div className="text-sm">Simplificación</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <div className="text-2xl mb-1">🗺️</div>
                  <div className="text-sm">Mapas K</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer informativo */}
      <div className="bg-gray-800 text-white rounded-lg p-6 mt-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold mb-2">📚 Recursos Adicionales</h4>
            <ul className="text-sm space-y-1 text-gray-300">
              <li>• Ejemplos interactivos en cada sección</li>
              <li>• Visualizaciones paso a paso</li>
              <li>• Tablas de referencia rápida</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">🎯 Objetivos de Aprendizaje</h4>
            <ul className="text-sm space-y-1 text-gray-300">
              <li>• Comprender el álgebra booleana</li>
              <li>• Aplicar leyes de simplificación</li>
              <li>• Usar mapas de Karnaugh</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">✅ Próximos Pasos</h4>
            <ul className="text-sm space-y-1 text-gray-300">
              <li>• Practicar con ejercicios</li>
              <li>• Resolver desafíos</li>
              <li>• Realizar evaluaciones</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BooleanTheoryExplainer