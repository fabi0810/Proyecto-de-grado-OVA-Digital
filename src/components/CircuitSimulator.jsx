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

import LogicGateNode from './simulador/LogicGateNode'
import GatePalette from './simulador/GatePalette'
import ControlPanel from './simulador/ControlPanel'
import TruthTableGenerator from './simulador/TruthTableGenerator'
import CircuitAnalyzer from './simulador/CircuitAnalyzer'
import ResultsDisplay from './simulador/ResultsDisplay'
import ChallengeSystem from './simulador/ChallengeSystem'

const nodeTypes = {
  logicGate: LogicGateNode,
}

function CircuitSimulator() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [reactFlowInstance, setReactFlowInstance] = useState(null)
  const [selectedGate, setSelectedGate] = useState(null)
  const [inputs, setInputs] = useState({})
  const [circuitStats, setCircuitStats] = useState({
    totalGates: 0,
    totalConnections: 0,
    complexity: 'Básico',
    efficiency: 0
  })
  const [savedCircuits, setSavedCircuits] = useState([])
  const [activeTab, setActiveTab] = useState('design')

  const tabs = [
    { id: 'design', label: 'Diseño', icon: '🎨' },
    { id: 'simulate', label: 'Simular', icon: '⚡' },
    { id: 'analyze', label: 'Analizar', icon: '🔍' },
    { id: 'challenges', label: 'Retos', icon: '🎯' }
  ]

  // Función para calcular la salida de una compuerta
  const calculateGateOutput = useCallback((gateType, inputValues) => {
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
  }, [])

  // Función para simular el circuito
  const simulateCircuit = useCallback(() => {
    const updatedNodes = [...nodes]
    const nodeMap = new Map(updatedNodes.map(node => [node.id, node]))
    
    // Ordenar nodos por dependencias (entradas primero)
    const sortedNodes = updatedNodes.sort((a, b) => {
      const aInputs = edges.filter(edge => edge.target === a.id).length
      const bInputs = edges.filter(edge => edge.target === b.id).length
      return aInputs - bInputs
    })

    // Calcular salidas de cada nodo
    sortedNodes.forEach(node => {
      if (node.type === 'logicGate') {
        const inputEdges = edges.filter(edge => edge.target === node.id)
        const inputValues = inputEdges.map(edge => {
          const sourceNode = nodeMap.get(edge.source)
          return sourceNode?.data?.output || inputs[edge.source] || 0
        })

        const output = calculateGateOutput(node.data.gateType, inputValues)
        
        node.data = {
          ...node.data,
          output,
          inputValues
        }
      }
    })

    setNodes(updatedNodes)
  }, [nodes, edges, inputs, calculateGateOutput])

  // Actualizar estadísticas del circuito
  useEffect(() => {
    const totalGates = nodes.filter(node => node.type === 'logicGate').length
    const totalConnections = edges.length
    const complexity = totalGates <= 3 ? 'Básico' : totalGates <= 7 ? 'Intermedio' : 'Avanzado'
    const efficiency = totalGates > 0 ? Math.max(0, 100 - (totalConnections / totalGates) * 10) : 0

    setCircuitStats({
      totalGates,
      totalConnections,
      complexity,
      efficiency
    })
  }, [nodes, edges])

  // Manejar conexiones
  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds))
  }, [setEdges])

  // Manejar arrastrar y soltar
  const onDrop = useCallback((event) => {
    event.preventDefault()
    
    const gateType = event.dataTransfer.getData('application/reactflow')
    if (typeof gateType === 'undefined' || !gateType) return

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
        inputValues: []
      },
    }

    setNodes((nds) => nds.concat(newNode))
  }, [reactFlowInstance, setNodes])

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  // Manejar entradas del circuito
  const handleAddInput = useCallback(() => {
    const inputId = `input-${Object.keys(inputs).length + 1}`
    setInputs(prev => ({ ...prev, [inputId]: 0 }))
  }, [inputs])

  const handleRemoveInput = useCallback((inputId) => {
    setInputs(prev => {
      const newInputs = { ...prev }
      delete newInputs[inputId]
      return newInputs
    })
  }, [])

  const handleInputChange = useCallback((inputId, value) => {
    setInputs(prev => ({ ...prev, [inputId]: value }))
  }, [])

  // Manejar guardar/cargar circuitos
  const handleClearCircuit = useCallback(() => {
    setNodes([])
    setEdges([])
    setInputs({})
  }, [setNodes, setEdges])

  const handleSaveCircuit = useCallback(() => {
    const circuitData = {
      id: Date.now(),
      name: `Circuito ${savedCircuits.length + 1}`,
      nodes,
      edges,
      inputs,
      timestamp: new Date().toISOString()
    }
    setSavedCircuits(prev => [...prev, circuitData])
    localStorage.setItem('savedCircuits', JSON.stringify([...savedCircuits, circuitData]))
  }, [nodes, edges, inputs, savedCircuits])

  const handleLoadCircuit = useCallback((circuitId) => {
    const circuit = savedCircuits.find(c => c.id === circuitId)
    if (circuit) {
      setNodes(circuit.nodes)
      setEdges(circuit.edges)
      setInputs(circuit.inputs)
    }
  }, [savedCircuits, setNodes, setEdges])

  // Cargar circuitos guardados al montar el componente
  useEffect(() => {
    const saved = localStorage.getItem('savedCircuits')
    if (saved) {
      setSavedCircuits(JSON.parse(saved))
    }
  }, [])

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Módulo 2: Simulador de Circuitos Lógicos
        </h1>
        <p className="text-gray-600">
          Diseña, simula y analiza circuitos lógicos digitales de manera interactiva
        </p>
      </div>

      {/* Navegación por pestañas */}
      <div className="mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido de las pestañas */}
      <div className="min-h-96">
        {activeTab === 'design' && (
          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <GatePalette onGateSelect={setSelectedGate} />
              <ControlPanel 
                inputs={inputs}
                onAddInput={handleAddInput}
                onRemoveInput={handleRemoveInput}
                onInputChange={handleInputChange}
                onClearCircuit={handleClearCircuit}
                onSaveCircuit={handleSaveCircuit}
                onLoadCircuit={handleLoadCircuit}
                savedCircuits={savedCircuits}
                circuitStats={circuitStats}
              />
            </div>
            <div className="lg:col-span-3">
              <div className="h-96 border border-gray-300 rounded-lg">
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
            <div>
              <div className="h-96 border border-gray-300 rounded-lg mb-6">
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
                  >
                    <Controls />
                    <MiniMap />
                    <Background variant="dots" gap={12} size={1} />
                  </ReactFlow>
                </ReactFlowProvider>
              </div>
              <button
                onClick={simulateCircuit}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Simular Circuito
              </button>
            </div>
            <div>
              <ResultsDisplay 
                nodes={nodes}
                edges={edges}
                inputs={inputs}
                circuitStats={circuitStats}
              />
            </div>
          </div>
        )}

        {activeTab === 'analyze' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <TruthTableGenerator 
              nodes={nodes}
              edges={edges}
              inputs={inputs}
            />
            <CircuitAnalyzer 
              nodes={nodes}
              edges={edges}
              circuitStats={circuitStats}
            />
          </div>
        )}

        {activeTab === 'challenges' && (
          <ChallengeSystem 
            onCircuitComplete={handleStepComplete}
          />
        )}
      </div>

      {/* Footer con objetivos de aprendizaje */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Objetivos de Aprendizaje - Módulo 2
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