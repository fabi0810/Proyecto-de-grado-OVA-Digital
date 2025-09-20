import { useState, useCallback, useEffect } from 'react'
import ReactFlow, { 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  ReactFlowProvider,
  Handle,
  Position
} from 'reactflow'
import 'reactflow/dist/style.css'

// Importar componentes separados
import LogicGateNode from './simulador/LogicGateNode'
import InputNode from './simulador/InputNode'
import GatePalette from './simulador/GatePalette'
import ControlPanel from './simulador/ControlPanel'
import TruthTableGenerator from './simulador/TruthTableGenerator'
import ChallengeSystem from './simulador/ChallengeSystem'
import CircuitAnalyzer from './simulador/CircuitAnalyzer'
import ResultsDisplay from './simulador/ResultsDisplay'
import TheoryModule from './simulador/TheoryModule'
import AdvancedQuestionGenerator from './simulador/AdvancedQuestionGenerator'

// ============= COMPONENTE PRINCIPAL =============
function CircuitSimulator() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [reactFlowInstance, setReactFlowInstance] = useState(null)
  const [selectedGate, setSelectedGate] = useState(null)
  const [inputs, setInputs] = useState({ A: 0, B: 0 })
  const [circuitStats, setCircuitStats] = useState({
    gateCount: 0,
    connectionCount: 0,
    inputCount: 0,
    outputCount: 0,
    complexity: 'Básico'
  })
  const [activeTab, setActiveTab] = useState('design')
  const [simulationResults, setSimulationResults] = useState({})
  const [currentChallenge, setCurrentChallenge] = useState(null)
  const [showFinishButton, setShowFinishButton] = useState(false)

  const nodeTypes = {
    logicGate: LogicGateNode,
    input: InputNode,
  }

  const tabs = [
    { id: 'theory', label: 'Teoría', icon: '📚' },
    { id: 'design', label: 'Diseño', icon: '🎨' },
    { id: 'simulate', label: 'Simular', icon: '⚡' },
    { id: 'analyze', label: 'Analizar', icon: '🔍' },
    { id: 'challenges', label: 'Retos', icon: '🎯' },
    { id: 'questions', label: 'Preguntas', icon: '❓' }
  ]

  // Función para calcular el valor de una compuerta
  const calculateGateValue = (gateType, inputValues) => {
    if (!inputValues || inputValues.length === 0) return undefined
    if (inputValues.some(val => val === undefined || val === null)) return undefined

    switch (gateType) {
      case 'AND':
        return inputValues.every(val => val === 1) ? 1 : 0
      case 'OR':
        return inputValues.some(val => val === 1) ? 1 : 0
      case 'NOT':
        return inputValues[0] === 1 ? 0 : 1
      case 'NAND':
        return inputValues.every(val => val === 1) ? 0 : 1
      case 'NOR':
        return inputValues.some(val => val === 1) ? 0 : 1
      case 'XOR':
        return inputValues.filter(val => val === 1).length % 2 === 1 ? 1 : 0
      case 'XNOR':
        return inputValues.filter(val => val === 1).length % 2 === 0 ? 1 : 0
      default:
        return 0
    }
  }

  // Función para simular el circuito
  const simulateCircuit = useCallback(() => {
    console.log('=== SIMULANDO CIRCUITO ===')
    console.log('Nodos:', nodes.map(n => ({ id: n.id, type: n.type, data: n.data })))
    console.log('Conexiones:', edges)
    console.log('Entradas:', inputs)

    const nodeValues = new Map()
    
    // Inicializar valores de entrada
    nodes.forEach(node => {
      if (node.type === 'input') {
        nodeValues.set(node.id, node.data.value || 0)
        console.log(`Entrada ${node.id}: ${node.data.value}`)
      }
    })
    
    // Procesar compuertas en orden topológico
    let changed = true
    let iterations = 0
    const maxIterations = 10
    
    while (changed && iterations < maxIterations) {
      changed = false
      iterations++
      console.log(`Iteración ${iterations}`)
      
      nodes.forEach(node => {
        if (node.type === 'logicGate') {
          const inputEdges = edges.filter(edge => edge.target === node.id)
          const inputValues = []
          
          // Obtener valores de entrada según el índice del handle
          const inputCount = node.data.gateType === 'NOT' ? 1 : 2
          for (let i = 0; i < inputCount; i++) {
            const edge = inputEdges.find(e => e.targetHandle === `input-${i}`)
            if (edge) {
              const sourceValue = nodeValues.get(edge.source)
              inputValues[i] = sourceValue !== undefined ? sourceValue : undefined
              console.log(`  Conexión de ${edge.source} a ${node.id} (input-${i}): ${sourceValue}`)
            } else {
              inputValues[i] = undefined
              console.log(`  No hay conexión para input-${i} de ${node.id}`)
            }
          }
          
          // Calcular salida
          const output = calculateGateValue(node.data.gateType, inputValues)
          console.log(`Calculando ${node.data.gateType} con entradas:`, inputValues, '→', output)
          
          // Si el valor cambió, actualizar
          if (nodeValues.get(node.id) !== output) {
            nodeValues.set(node.id, output)
            changed = true
            console.log(`Nodo ${node.id} actualizado: salida = ${output}`)
          }
        }
      })
    }
    
    // Actualizar los nodos con los valores calculados
    setNodes(prevNodes => 
      prevNodes.map(node => {
        if (node.type === 'logicGate') {
          const inputEdges = edges.filter(edge => edge.target === node.id)
          const inputValues = []
          
          const inputCount = node.data.gateType === 'NOT' ? 1 : 2
          for (let i = 0; i < inputCount; i++) {
            const edge = inputEdges.find(e => e.targetHandle === `input-${i}`)
            if (edge) {
              const sourceValue = nodeValues.get(edge.source)
              inputValues[i] = sourceValue !== undefined ? sourceValue : undefined
            } else {
              inputValues[i] = undefined
            }
          }
          
          return {
            ...node,
            data: {
              ...node.data,
              inputValues,
              output: nodeValues.get(node.id)
            }
          }
        }
        return node
      })
    )
    
    setSimulationResults(nodeValues)
    console.log('=== RESULTADOS FINALES ===')
    console.log('Valores de nodos:', Array.from(nodeValues.entries()))
  }, [nodes, edges, setNodes])

  // Actualizar estadísticas
  useEffect(() => {
    const gateCount = nodes.filter(node => node.type === 'logicGate').length
    const connectionCount = edges.length
    const inputCount = Object.keys(inputs).length
    const outputCount = nodes.filter(node => 
      edges.some(edge => edge.source === node.id) && 
      !edges.some(edge => edge.target === node.id)
    ).length
  
    setCircuitStats({
      gateCount,
      connectionCount,
      inputCount,
      outputCount,
      complexity: gateCount <= 3 ? 'Básico' : gateCount <= 7 ? 'Intermedio' : 'Avanzado'
    })
  }, [nodes, edges, inputs])

  // Inicializar entradas por defecto
  useEffect(() => {
    if (nodes.filter(n => n.type === 'input').length === 0) {
      // Crear entradas por defecto
      const defaultInputs = { A: 0, B: 0 }
      setInputs(defaultInputs)
      
      // Crear nodos de entrada visuales
      const inputNodes = Object.entries(defaultInputs).map(([name, value], index) => ({
        id: `input-${name}`,
        type: 'input',
        position: { x: 50, y: 100 + index * 80 },
        data: { 
          label: name,
          value: value,
          onValueChange: (label, newValue) => {
            console.log('Direct onValueChange:', { label, newValue })
            setInputs(prev => ({ ...prev, [label]: newValue }))
            setNodes(prev => prev.map(node => 
              node.id === `input-${label}` 
                ? { ...node, data: { ...node.data, value: newValue } }
                : node
            ))
          }
        },
      }))
      
      setNodes(prev => [...prev, ...inputNodes])
    }
  }, [nodes, setInputs, setNodes])

  // Simular circuito cuando cambian las entradas o conexiones
  useEffect(() => {
    simulateCircuit()
  }, [simulateCircuit])

  // Manejar conexiones
  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds))
  }, [setEdges])

  // Manejar drop
  const onDrop = useCallback((event) => {
    event.preventDefault()
    
    const gateData = event.dataTransfer.getData('application/reactflow')
    if (!gateData || !reactFlowInstance) return

    let gateType
    try {
      const parsed = JSON.parse(gateData)
      gateType = parsed.id
    } catch {
      gateType = gateData
    }

    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    })

    const newNode = {
      id: `${gateType}-${Date.now()}`,
      type: 'logicGate',
      position,
      data: { 
        gateType,
        output: 0,
        inputValues: gateType === 'NOT' ? [0] : [0, 0],
        label: gateType
      },
    }

    setNodes((nds) => nds.concat(newNode))
  }, [reactFlowInstance, setNodes])

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  // Manejar entradas
  const handleAddInput = useCallback((inputName) => {
    console.log('Agregando entrada:', inputName)
    setInputs(prev => ({ ...prev, [inputName]: 0 }))
    
    // Crear nodo de entrada visual
    const inputNode = {
      id: `input-${inputName}`,
      type: 'input',
      position: { x: 50, y: 100 + Object.keys(inputs).length * 80 },
      data: { 
        label: inputName,
        value: 0,
        onValueChange: (label, newValue) => {
          console.log('AddInput onValueChange:', { label, newValue })
          setInputs(prev => ({ ...prev, [label]: newValue }))
          setNodes(prev => prev.map(node => 
            node.id === `input-${label}` 
              ? { ...node, data: { ...node.data, value: newValue } }
              : node
          ))
        }
      },
    }
    
    setNodes(prev => [...prev, inputNode])
  }, [inputs, setNodes])

  const handleInputChange = useCallback((inputName, value) => {
    console.log('handleInputChange called:', { inputName, value })
    setInputs(prev => ({ ...prev, [inputName]: value }))
    
    // Actualizar nodo de entrada visual
    setNodes(prev => prev.map(node => 
      node.id === `input-${inputName}` 
        ? { ...node, data: { ...node.data, value } }
        : node
    ))
  }, [setNodes])

  const handleRemoveInput = useCallback((inputName) => {
    setInputs(prev => {
      const newInputs = { ...prev }
      delete newInputs[inputName]
      return newInputs
    })
    
    // Remover nodo de entrada visual y sus conexiones
    setNodes(prev => prev.filter(node => node.id !== `input-${inputName}`))
    setEdges(prev => prev.filter(edge => edge.source !== `input-${inputName}`))
  }, [setNodes, setEdges])

  const handleClearCircuit = useCallback(() => {
    // Limpiar compuertas pero mantener entradas
    setNodes(prev => prev.filter(node => node.type === 'input'))
    setEdges([])
    setSimulationResults({})
  }, [setNodes, setEdges])

  const handleSaveCircuit = useCallback((circuitName) => {
    const circuitData = {
      name: circuitName,
      nodes,
      edges,
      inputs,
      timestamp: new Date().toISOString()
    }
    // En un entorno real usarías una API, aquí simulo con console
    console.log(`Guardando circuito "${circuitName}":`, circuitData)
    alert(`Circuito "${circuitName}" guardado exitosamente`)
  }, [nodes, edges, inputs])

  // Función para iniciar un desafío
  const handleStartChallenge = useCallback((challenge) => {
    setCurrentChallenge(challenge)
    setShowFinishButton(true)
    setActiveTab('design')
    // Limpiar el circuito actual
    setNodes(prev => prev.filter(node => node.type === 'input'))
    setEdges([])
    setSimulationResults({})
  }, [setNodes, setEdges])

  // Función para finalizar un desafío
  const handleFinishChallenge = useCallback(() => {
    if (!currentChallenge) return

    // Verificar si el circuito cumple con los requisitos del desafío
    const isCorrect = validateChallenge(currentChallenge, nodes, edges, inputs)
    
    if (isCorrect) {
      alert('¡Excelente! Has completado el desafío correctamente. 🎉')
      setCurrentChallenge(null)
      setShowFinishButton(false)
    } else {
      alert('El circuito no cumple con los requisitos del desafío. Revisa tu diseño e intenta de nuevo.')
    }
  }, [currentChallenge, nodes, edges, inputs])

  // Función para validar un desafío
  const validateChallenge = (challenge, nodes, edges, inputs) => {
    // Verificar que se usen las compuertas requeridas
    const usedGates = nodes
      .filter(node => node.type === 'logicGate')
      .map(node => node.data.gateType)
    
    const requiredGates = challenge.requirements.gates
    const hasRequiredGates = requiredGates.every(gate => usedGates.includes(gate))
    
    // Verificar que se usen las entradas requeridas
    const inputNames = Object.keys(inputs)
    const requiredInputs = challenge.requirements.inputs
    const hasRequiredInputs = requiredInputs.every(input => inputNames.includes(input))
    
    // Verificar que el circuito tenga al menos una salida
    const hasOutput = nodes.some(node => 
      edges.some(edge => edge.source === node.id) && 
      !edges.some(edge => edge.target === node.id)
    )
    
    return hasRequiredGates && hasRequiredInputs && hasOutput
  }

  // Obtener resultados de las compuertas
  const getResults = () => {
    return nodes
      .filter(node => node.type === 'logicGate')
      .map(node => ({
        id: node.id,
        type: node.data.gateType,
        label: node.data.label || node.data.gateType,
        output: node.data.output,
        inputs: node.data.inputValues || []
      }))
  }

  const results = getResults()

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Simulador de Circuitos Lógicos
        </h1>
        <p className="text-gray-600">
          Diseña, simula y analiza circuitos lógicos digitales
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-96">
        {activeTab === 'theory' && (
          <TheoryModule />
        )}

        {activeTab === 'design' && (
          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-4">
              {/* Paleta de Compuertas */}
              <GatePalette 
                onGateSelect={setSelectedGate}
                selectedGate={selectedGate}
                onAddInput={handleAddInput}
              />

              {/* Control Panel */}
              <ControlPanel
                inputs={inputs}
                onInputChange={handleInputChange}
                onRemoveInput={handleRemoveInput}
                onClearCircuit={handleClearCircuit}
                onSaveCircuit={handleSaveCircuit}
              />

              {/* Botón de finalizar desafío */}
              {showFinishButton && currentChallenge && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                    Desafío Activo: {currentChallenge.title}
                  </h3>
                  <p className="text-yellow-800 text-sm mb-3">
                    {currentChallenge.description}
                  </p>
                  <button
                    onClick={handleFinishChallenge}
                    className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors font-semibold"
                  >
                    ✅ Finalizar Desafío
                  </button>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-3">
              <div className="h-96 border border-gray-300 rounded-lg bg-gray-50">
                <ReactFlowProvider>
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onInit={setReactFlowInstance}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    nodeTypes={nodeTypes}
                    fitView
                    connectionLineType="smoothstep"
                    defaultEdgeOptions={{
                      style: { strokeWidth: 2, stroke: '#3b82f6' },
                      type: 'smoothstep'
                    }}
                  >
                    <Controls />
                    <MiniMap />
                    <Background variant="dots" gap={12} size={1} />
                  </ReactFlow>
                </ReactFlowProvider>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'simulate' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="h-96 border border-gray-300 rounded-lg bg-gray-50">
              <ReactFlowProvider>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  nodeTypes={nodeTypes}
                  fitView
                  connectionLineType="smoothstep"
                  defaultEdgeOptions={{
                    style: { strokeWidth: 2, stroke: '#3b82f6' },
                    type: 'smoothstep'
                  }}
                >
                  <Controls />
                  <MiniMap />
                  <Background variant="dots" gap={12} size={1} />
                </ReactFlow>
              </ReactFlowProvider>
            </div>
            <div>
              <ResultsDisplay results={results} />
            </div>
          </div>
        )}

        {activeTab === 'analyze' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <TruthTableGenerator 
                inputs={inputs}
                results={results}
                circuitStats={circuitStats}
              />
            </div>
            <div>
              <CircuitAnalyzer 
                circuitStats={circuitStats}
                nodes={nodes}
                edges={edges}
              />
            </div>
          </div>
        )}

        {activeTab === 'challenges' && (
          <ChallengeSystem onStartChallenge={handleStartChallenge} />
        )}

        {activeTab === 'questions' && (
          <AdvancedQuestionGenerator />
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Objetivos de Aprendizaje
        </h3>
        <ul className="text-blue-800 space-y-1">
          <li>• Comprender el funcionamiento de las compuertas lógicas básicas</li>
          <li>• Diseñar circuitos lógicos complejos usando drag & drop</li>
          <li>• Simular el comportamiento de circuitos en tiempo real</li>
          <li>• Generar y analizar tablas de verdad automáticamente</li>
          <li>• Desarrollar habilidades de diseño y optimización de circuitos</li>
        </ul>
      </div>
    </div>
  )
}

export default CircuitSimulator