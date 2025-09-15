import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import NumericConverter from './components/NumericConverter'
import CircuitSimulator from './components/CircuitSimulator'
import BooleanAlgebra from './components/BooleanAlgebra'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/convertidor" element={<NumericConverter />} />
          <Route path="/simulador" element={<CircuitSimulator />} />
          <Route path="/algebra" element={<BooleanAlgebra />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
