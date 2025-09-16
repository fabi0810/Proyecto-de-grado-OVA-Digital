  import { useState, useCallback, useEffect } from 'react'
  import ReactFlow, { 
    MiniMap, 
    Controls, 
    Background, 
    useNodesState, 
    useEdgesState, 
    addEdge,
    ReactFlowProvider 
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

// Función para simular el circuito
const simulateCircuit = (nodes, edges, inputs) => {
  // Crear un mapa de valores de nodos
  const nodeValues = new Map()
  
  // Inicializar valores de entrada desde nodos de entrada
  nodes.forEach(node => {
    if (node.type === 'input') {
      nodeValues.set(node.id, node.data.value)
    }
  })
  
  // También inicializar desde el objeto inputs para compatibilidad
  Object.entries(inputs).forEach(([name, value]) => {
    nodeValues.set(`input-${name}`, value)
  })
  
  // Función para calcular el valor de una compuerta
  const calculateGateValue = (gateType, inputValues) => {
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
        return inputValues.reduce((a, b) => a ^ b, 0)
      case 'XNOR':
        return inputValues.reduce((a, b) => a ^ b, 0) === 0 ? 1 : 0
      default:
        return 0
    }
  }
  
  // Procesar nodos en orden topológico
  const processedNodes = new Set()
  let changed = true
  
  while (changed) {
    changed = false
    
    nodes.forEach(node => {
      if (processedNodes.has(node.id) || node.type === 'input') return
      
      const inputEdges = edges.filter(edge => edge.target === node.id)
      const inputValues = inputEdges.map(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source)
        return nodeValues.get(sourceNode?.id) || 0
      })
      
      if (inputValues.length === 0 || inputValues.some(val => val === undefined)) {
        return
      }
      
      const outputValue = calculateGateValue(node.data.gateType, inputValues)
      nodeValues.set(node.id, outputValue)
      
      // Actualizar el nodo con los nuevos valores
      node.data.output = outputValue
      node.data.inputValues = inputValues
      
      processedNodes.add(node.id)
      changed = true
    })
  }
  
  return nodeValues
}

  // Componente principal
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

  const nodeTypes = {
    logicGate: LogicGateNode,
    input: InputNode,
  }

    const tabs = [
      { id: 'design', label: 'Diseño', icon: '🎨' },
      { id: 'simulate', label: 'Simular', icon: '⚡' },
      { id: 'analyze', label: 'Analizar', icon: '🔍' },
      { id: 'challenges', label: 'Retos', icon: '🎯' }
    ]

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
    if (Object.keys(inputs).length === 0) {
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
          onValueChange: handleInputChange
        },
      }))
      
      setNodes(prev => [...prev, ...inputNodes])
    }
  }, [])

  // Simular circuito cuando cambian las entradas
  useEffect(() => {
    if (nodes.length > 0) {
      const results = simulateCircuit(nodes, edges, inputs)
      setSimulationResults(results)
      
      // Actualizar nodos con nuevos valores
      setNodes(prevNodes => 
        prevNodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            output: results.get(node.id) || node.data.output,
            inputValues: node.data.inputValues || []
          }
        }))
      )
    }
  }, [inputs, nodes, edges])

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
    setInputs(prev => ({ ...prev, [inputName]: 0 }))
    
    // Crear nodo de entrada visual
    const inputNode = {
      id: `input-${inputName}`,
      type: 'input',
      position: { x: 50, y: 100 + Object.keys(inputs).length * 80 },
      data: { 
        label: inputName,
        value: 0,
        onValueChange: handleInputChange
      },
    }
    
    setNodes(prev => [...prev, inputNode])
  }, [inputs, setNodes])

  const handleRemoveInput = useCallback((inputName) => {
    setInputs(prev => {
      const newInputs = { ...prev }
      delete newInputs[inputName]
      return newInputs
    })
    
    // Remover nodo de entrada visual
    setNodes(prev => prev.filter(node => node.id !== `input-${inputName}`))
    
    // Remover conexiones relacionadas
    setEdges(prev => prev.filter(edge => 
      edge.source !== `input-${inputName}` && 
      edge.target !== `input-${inputName}`
    ))
  }, [setNodes, setEdges])

  const handleInputChange = useCallback((inputName, value) => {
    setInputs(prev => ({ ...prev, [inputName]: value }))
    
    // Actualizar nodo de entrada visual
    setNodes(prev => prev.map(node => 
      node.id === `input-${inputName}` 
        ? { ...node, data: { ...node.data, value } }
        : node
    ))
  }, [setNodes])

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
      localStorage.setItem(`circuit-${circuitName}`, JSON.stringify(circuitData))
      alert(`Circuito "${circuitName}" guardado exitosamente`)
    }, [nodes, edges, inputs])

    const handleLoadCircuit = useCallback(() => {
      const savedCircuits = Object.keys(localStorage)
        .filter(key => key.startsWith('circuit-'))
        .map(key => {
          const data = JSON.parse(localStorage.getItem(key))
          return { name: key.replace('circuit-', ''), ...data }
        })
      
      if (savedCircuits.length === 0) {
        alert('No hay circuitos guardados')
        return
      }
      
      const circuitName = prompt(`Circuitos disponibles:\n${savedCircuits.map(c => c.name).join('\n')}\n\nIngresa el nombre del circuito a cargar:`)
      if (circuitName) {
        const circuitData = savedCircuits.find(c => c.name === circuitName)
        if (circuitData) {
          setNodes(circuitData.nodes || [])
          setEdges(circuitData.edges || [])
          setInputs(circuitData.inputs || { A: 0, B: 0 })
          alert(`Circuito "${circuitName}" cargado exitosamente`)
        } else {
          alert('Circuito no encontrado')
        }
      }
    }, [setNodes, setEdges, setInputs])

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
          {activeTab === 'design' && (
            <div className="grid lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1 space-y-4">
              <GatePalette 
                selectedGate={selectedGate}
                onGateSelect={setSelectedGate}
                onAddInput={handleAddInput}
              />
                <ControlPanel 
                  inputs={inputs}
                  onAddInput={handleAddInput}
                  onRemoveInput={handleRemoveInput}
                  onInputChange={handleInputChange}
                  onClearCircuit={handleClearCircuit}
                  onSaveCircuit={handleSaveCircuit}
                  onLoadCircuit={handleLoadCircuit}
                  circuitStats={circuitStats}
                />
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
                <ResultsDisplay 
                  simulationResults={simulationResults}
                  inputs={inputs}
                  circuitStats={circuitStats}
                />
              </div>
            </div>
          )}

          {activeTab === 'analyze' && (
            <div className="grid lg:grid-cols-2 gap-6">
              <TruthTableGenerator nodes={nodes} inputs={inputs} />
              <CircuitAnalyzer 
                circuitStats={circuitStats}
                simulationResults={simulationResults}
              />
            </div>
          )}

          {activeTab === 'challenges' && <ChallengeSystem />}
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