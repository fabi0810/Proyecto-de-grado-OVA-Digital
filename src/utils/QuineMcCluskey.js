// src/utils/QuineMcCluskey.js
// Implementación nativa de Quine-McCluskey para minimización booleana

class QuineMcCluskeyMinimizer {
    constructor() {
      this.primeImplicants = []
      this.essentialPrimeImplicants = []
    }
  
    /**
     * Minimiza una función booleana usando Quine-McCluskey
     * @param {number[]} minterms - Array de índices de mintérminos
     * @param {number[]} dontCares - Array de índices don't-care (opcional)
     * @param {number} numVars - Número de variables
     * @returns {string[]} Array de implicantes primos en formato binario
     */
    minimize(minterms, dontCares = [], numVars) {
      if (minterms.length === 0) {
        return []
      }
  
      // Combinar mintérminos con don't-cares para la minimización
      const allTerms = [...new Set([...minterms, ...dontCares])]
      
      // Convertir a representación binaria
      const binaryTerms = allTerms.map(term => ({
        binary: this.decimalToBinary(term, numVars),
        decimal: term,
        used: false
      }))
  
      // Agrupar por número de 1s
      const groups = this.groupByOnes(binaryTerms)
      
      // Encontrar implicantes primos
      this.primeImplicants = this.findPrimeImplicants(groups, numVars)
      
      // Encontrar implicantes primos esenciales
      this.essentialPrimeImplicants = this.findEssentialPrimeImplicants(
        this.primeImplicants,
        minterms
      )
      
      // Resolver cobertura mínima
      const coverage = this.minimumCoverage(
        this.primeImplicants,
        this.essentialPrimeImplicants,
        minterms
      )
      
      return coverage.map(imp => imp.binary)
    }
  
    /**
     * Convierte decimal a binario con padding
     */
    decimalToBinary(num, bits) {
      return num.toString(2).padStart(bits, '0')
    }
  
    /**
     * Cuenta el número de 1s en un string binario
     */
    countOnes(binary) {
      return (binary.match(/1/g) || []).length
    }
  
    /**
     * Agrupa términos por número de 1s
     */
    groupByOnes(terms) {
      const groups = {}
      
      terms.forEach(term => {
        const ones = this.countOnes(term.binary)
        if (!groups[ones]) {
          groups[ones] = []
        }
        groups[ones].push(term)
      })
      
      return groups
    }
  
    /**
     * Verifica si dos términos difieren en exactamente un bit
     */
    canCombine(term1, term2) {
      let differences = 0
      let diffPosition = -1
      
      for (let i = 0; i < term1.length; i++) {
        if (term1[i] !== term2[i] && term1[i] !== '-' && term2[i] !== '-') {
          differences++
          diffPosition = i
        }
      }
      
      return differences === 1 ? diffPosition : -1
    }
  
    /**
     * Combina dos términos
     */
    combine(term1, term2, position) {
      const result = term1.split('')
      result[position] = '-'
      return result.join('')
    }
  
    /**
     * Encuentra todos los implicantes primos
     */
    findPrimeImplicants(initialGroups, numVars) {
      let currentGroups = initialGroups
      let allImplicants = []
      
      while (true) {
        const nextGroups = {}
        const used = new Set()
        let foundCombination = false
        
        // Intentar combinar grupos adyacentes
        const groupKeys = Object.keys(currentGroups).map(Number).sort((a, b) => a - b)
        
        for (let i = 0; i < groupKeys.length - 1; i++) {
          const key1 = groupKeys[i]
          const key2 = groupKeys[i + 1]
          
          if (key2 - key1 !== 1) continue
          
          const group1 = currentGroups[key1]
          const group2 = currentGroups[key2]
          
          for (const term1 of group1) {
            for (const term2 of group2) {
              const position = this.canCombine(term1.binary, term2.binary)
              
              if (position !== -1) {
                const combined = this.combine(term1.binary, term2.binary, position)
                const newOnes = this.countOnes(combined)
                
                if (!nextGroups[newOnes]) {
                  nextGroups[newOnes] = []
                }
                
                // Evitar duplicados
                if (!nextGroups[newOnes].some(t => t.binary === combined)) {
                  nextGroups[newOnes].push({
                    binary: combined,
                    minterms: [...new Set([...term1.minterms || [term1.decimal], ...term2.minterms || [term2.decimal]])],
                    used: false
                  })
                }
                
                used.add(term1.binary)
                used.add(term2.binary)
                foundCombination = true
              }
            }
          }
        }
        
        // Agregar términos no usados como implicantes primos
        for (const key in currentGroups) {
          for (const term of currentGroups[key]) {
            if (!used.has(term.binary)) {
              allImplicants.push({
                binary: term.binary,
                minterms: term.minterms || [term.decimal]
              })
            }
          }
        }
        
        if (!foundCombination) break
        currentGroups = nextGroups
      }
      
      return allImplicants
    }
  
    /**
     * Encuentra implicantes primos esenciales
     */
    findEssentialPrimeImplicants(primeImplicants, minterms) {
      const essential = []
      const coverage = new Map()
      
      // Construir tabla de cobertura
      minterms.forEach(minterm => {
        coverage.set(minterm, [])
      })
      
      primeImplicants.forEach((impl, index) => {
        impl.minterms.forEach(minterm => {
          if (coverage.has(minterm)) {
            coverage.get(minterm).push(index)
          }
        })
      })
      
      // Encontrar implicantes esenciales (cubren mintérminos únicos)
      coverage.forEach((impls, minterm) => {
        if (impls.length === 1) {
          const essentialIndex = impls[0]
          if (!essential.includes(essentialIndex)) {
            essential.push(essentialIndex)
          }
        }
      })
      
      return essential.map(index => primeImplicants[index])
    }
  
    /**
     * Encuentra cobertura mínima
     */
    minimumCoverage(primeImplicants, essentialImplicants, minterms) {
      const covered = new Set()
      const result = [...essentialImplicants]
      
      // Marcar mintérminos cubiertos por esenciales
      essentialImplicants.forEach(impl => {
        impl.minterms.forEach(m => covered.add(m))
      })
      
      // Encontrar implicantes adicionales necesarios
      const remaining = primeImplicants.filter(
        impl => !essentialImplicants.includes(impl)
      )
      
      // Algoritmo greedy: seleccionar implicantes que cubren más mintérminos no cubiertos
      while (covered.size < minterms.length && remaining.length > 0) {
        let bestImpl = null
        let bestCoverage = 0
        
        remaining.forEach(impl => {
          const newCoverage = impl.minterms.filter(m => 
            minterms.includes(m) && !covered.has(m)
          ).length
          
          if (newCoverage > bestCoverage) {
            bestCoverage = newCoverage
            bestImpl = impl
          }
        })
        
        if (bestImpl) {
          result.push(bestImpl)
          bestImpl.minterms.forEach(m => covered.add(m))
          remaining.splice(remaining.indexOf(bestImpl), 1)
        } else {
          break
        }
      }
      
      return result
    }
  }
  
  export default QuineMcCluskeyMinimizer