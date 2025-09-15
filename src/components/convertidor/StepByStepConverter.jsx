import { useState, useEffect } from 'react'

const StepByStepConverter = ({ inputValue, fromBase, onStepComplete }) => {
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const bases = {
    2: { name: 'Binario', digits: '0-1', color: 'bg-blue-100 text-blue-800' },
    8: { name: 'Octal', digits: '0-7', color: 'bg-green-100 text-green-800' },
    10: { name: 'Decimal', digits: '0-9', color: 'bg-purple-100 text-purple-800' },
    16: { name: 'Hexadecimal', digits: '0-9, A-F', color: 'bg-orange-100 text-orange-800' }
  }

  const generateSteps = (value, fromBase) => {
    const newSteps = []
    
    try {
      // Validar entrada
      if (!value.trim()) return []
      
      // Convertir a decimal primero
      const decimalValue = parseInt(value, fromBase)
      if (isNaN(decimalValue)) {
        newSteps.push({
          type: 'error',
          title: 'Error de Validación',
          content: `El valor "${value}" no es válido para la base ${fromBase}`,
          explanation: `La base ${fromBase} solo permite dígitos: ${bases[fromBase]?.digits || 'inválida'}`
        })
        return newSteps
      }

      // Paso 1: Explicar el valor de entrada
      newSteps.push({
        type: 'input',
        title: 'Valor de Entrada',
        content: `Valor: ${value} (Base ${fromBase})`,
        explanation: `En el sistema ${bases[fromBase]?.name}, cada posición representa una potencia de ${fromBase}`,
        decimalValue: decimalValue
      })

      // Paso 2: Conversión a decimal (si no es decimal)
      if (fromBase !== 10) {
        newSteps.push({
          type: 'toDecimal',
          title: `Conversión a Decimal`,
          content: `Convertir ${value} (Base ${fromBase}) a decimal`,
          explanation: `Multiplicamos cada dígito por ${fromBase}^posición y sumamos`,
          calculation: generateDecimalCalculation(value, fromBase),
          result: decimalValue
        })
      }

      // Paso 3: Conversiones a otras bases
      const targetBases = [2, 8, 10, 16].filter(base => base !== fromBase)
      
      targetBases.forEach(targetBase => {
        const result = convertToBase(decimalValue, targetBase)
        newSteps.push({
          type: 'conversion',
          title: `Conversión a ${bases[targetBase].name}`,
          content: `Convertir ${decimalValue} a Base ${targetBase}`,
          explanation: `Dividimos repetidamente por ${targetBase} y tomamos los residuos`,
          calculation: generateBaseConversionCalculation(decimalValue, targetBase),
          result: result,
          targetBase: targetBase
        })
      })

      // Paso 4: Resumen final
      newSteps.push({
        type: 'summary',
        title: 'Resumen de Conversiones',
        content: 'Todas las conversiones completadas',
        results: {
          2: convertToBase(decimalValue, 2),
          8: convertToBase(decimalValue, 8),
          10: decimalValue,
          16: convertToBase(decimalValue, 16).toUpperCase()
        }
      })

    } catch (error) {
      newSteps.push({
        type: 'error',
        title: 'Error en la Conversión',
        content: 'Ocurrió un error durante la conversión',
        explanation: error.message
      })
    }

    return newSteps
  }

  const generateDecimalCalculation = (value, base) => {
    const digits = value.split('').reverse()
    const calculation = []
    
    digits.forEach((digit, index) => {
      const digitValue = parseInt(digit, base)
      const power = Math.pow(base, index)
      const result = digitValue * power
      calculation.push({
        digit,
        position: index,
        power: power,
        digitValue,
        result
      })
    })
    
    return calculation
  }

  const generateBaseConversionCalculation = (decimalValue, targetBase) => {
    const calculation = []
    let value = decimalValue
    
    while (value > 0) {
      const remainder = value % targetBase
      const quotient = Math.floor(value / targetBase)
      
      calculation.push({
        value,
        quotient,
        remainder,
        remainderInBase: remainder.toString(targetBase).toUpperCase()
      })
      
      value = quotient
    }
    
    return calculation
  }

  const convertToBase = (decimalValue, targetBase) => {
    if (decimalValue === 0) return '0'
    
    let result = ''
    let value = decimalValue
    
    while (value > 0) {
      const remainder = value % targetBase
      result = remainder.toString(targetBase).toUpperCase() + result
      value = Math.floor(value / targetBase)
    }
    
    return result
  }

  useEffect(() => {
    if (inputValue && fromBase) {
      const newSteps = generateSteps(inputValue, fromBase)
      setSteps(newSteps)
      setCurrentStep(0)
      setIsAnimating(true)
      
      // Animar pasos automáticamente
      if (newSteps.length > 0) {
        let stepIndex = 0
        const interval = setInterval(() => {
          if (stepIndex < newSteps.length - 1) {
            stepIndex++
            setCurrentStep(stepIndex)
          } else {
            clearInterval(interval)
            setIsAnimating(false)
            onStepComplete && onStepComplete(newSteps)
          }
        }, 2000)
        
        return () => clearInterval(interval)
      }
    } else {
      setSteps([])
      setCurrentStep(0)
    }
  }, [inputValue, fromBase])

  const renderStep = (step, index) => {
    const isActive = index === currentStep
    const isCompleted = index < currentStep
    
    return (
      <div
        key={index}
        className={`transition-all duration-500 ${
          isActive ? 'opacity-100 scale-100' : 'opacity-50 scale-95'
        }`}
      >
        <div className={`card ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
          <div className="flex items-center mb-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
              isCompleted ? 'bg-green-500 text-white' : 
              isActive ? 'bg-primary-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              {index + 1}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
          </div>
          
          <p className="text-gray-700 mb-3">{step.content}</p>
          
          {step.explanation && (
            <div className="bg-blue-50 p-3 rounded-md mb-3">
              <p className="text-sm text-blue-800">{step.explanation}</p>
            </div>
          )}

          {step.calculation && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-semibold mb-2">Cálculo Detallado:</h4>
              {step.type === 'toDecimal' ? (
                <div className="space-y-2">
                  {step.calculation.map((calc, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span>{calc.digit} × {step.fromBase || fromBase}^{calc.position} = {calc.digitValue} × {calc.power}</span>
                      <span className="font-mono text-primary-600">= {calc.result}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 font-semibold">
                    Suma total: {step.calculation.reduce((sum, calc) => sum + calc.result, 0)}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {step.calculation.map((calc, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span>{calc.value} ÷ {step.targetBase} = {calc.quotient} residuo {calc.remainder}</span>
                      <span className="font-mono text-primary-600">{calc.remainderInBase}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step.result && (
            <div className="mt-3 p-3 bg-primary-50 rounded-md">
              <span className="font-semibold">Resultado: </span>
              <span className="font-mono text-lg text-primary-600">
                {step.targetBase === 16 ? `0x${step.result}` : 
                 step.targetBase === 8 ? `0o${step.result}` :
                 step.targetBase === 2 ? `0b${step.result}` : step.result}
              </span>
            </div>
          )}

          {step.results && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {Object.entries(step.results).map(([base, result]) => (
                <div key={base} className="text-center p-2 bg-white rounded border">
                  <div className="text-xs text-gray-500 mb-1">{bases[base].name}</div>
                  <div className="font-mono text-sm">
                    {base === '16' ? `0x${result}` : 
                     base === '8' ? `0o${result}` :
                     base === '2' ? `0b${result}` : result}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (steps.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-4">🔢</div>
        <p>Ingresa un valor para ver la conversión paso a paso</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Conversión Paso a Paso
        </h2>
        <div className="flex space-x-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentStep ? 'bg-primary-500' :
                index < currentStep ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
      
      {steps.map((step, index) => renderStep(step, index))}
    </div>
  )
}

export default StepByStepConverter

