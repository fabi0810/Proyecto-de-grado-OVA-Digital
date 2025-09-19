import { useState } from 'react'

const InputTester = () => {
  const [inputs, setInputs] = useState({ A: 0, B: 0 })

  const handleInputChange = (name, value) => {
    console.log('InputTester - handleInputChange:', { name, value })
    setInputs(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Prueba de Entradas
      </h3>
      
      <div className="space-y-4">
        {Object.entries(inputs).map(([name, value]) => (
          <div key={name} className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="text-sm font-medium text-gray-700">
              Entrada {name}:
            </span>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded text-sm font-bold ${
                value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {value}
              </span>
              <button
                onClick={() => handleInputChange(name, !value)}
                className={`px-3 py-1 rounded text-sm font-bold transition-colors ${
                  value 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                Cambiar a {value ? '0' : '1'}
              </button>
            </div>
          </div>
        ))}
        
        <div className="mt-4 p-3 bg-blue-50 rounded">
          <h4 className="font-semibold text-blue-900 mb-2">Estado Actual:</h4>
          <div className="text-sm text-blue-800">
            A = {inputs.A}, B = {inputs.B}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InputTester


