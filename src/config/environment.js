/**
 * Configuración del entorno para el Módulo 3
 * Álgebra Booleana, Tablas de Verdad y Simplificación
 */

export const config = {
  // Configuración general del OVA
  ova: {
    name: process.env.REACT_APP_OVA_NAME || 'OVA Lógica Digital',
    version: process.env.REACT_APP_OVA_VERSION || '1.0.0',
    author: process.env.REACT_APP_OVA_AUTHOR || 'UTS - Unidades Tecnológicas de Santander'
  },

  // Configuración de la API de OpenAI
  openai: {
    apiKey: process.env.REACT_APP_OPENAI_API_KEY || '',
    model: 'gpt-3.5-turbo',
    maxTokens: 1000,
    temperature: 0.7
  },

  // Configuración de ejercicios
  exercises: {
    maxPerSession: parseInt(process.env.REACT_APP_MAX_EXERCISES_PER_SESSION) || 10,
    cacheSize: parseInt(process.env.REACT_APP_EXERCISE_CACHE_SIZE) || 100,
    defaultDifficulty: process.env.REACT_APP_DEFAULT_DIFFICULTY || 'medium',
    enableChatGPT: !!process.env.REACT_APP_OPENAI_API_KEY
  },

  // Configuración de simplificación
  simplification: {
    maxSteps: parseInt(process.env.REACT_APP_MAX_SIMPLIFICATION_STEPS) || 50,
    enableKarnaugh: process.env.REACT_APP_ENABLE_KARNAUGH !== 'false',
    enableAdvancedTheorems: process.env.REACT_APP_ENABLE_ADVANCED_THEOREMS !== 'false'
  },

  // Configuración de mapas de Karnaugh
  karnaugh: {
    maxVariables: parseInt(process.env.REACT_APP_MAX_KARNAUGH_VARIABLES) || 6,
    enableGrouping: process.env.REACT_APP_ENABLE_KARNAUGH_GROUPING !== 'false'
  },

  // Configuración de integración
  integration: {
    enableModuleIntegration: process.env.REACT_APP_ENABLE_MODULE_INTEGRATION !== 'false',
    enableDataSync: process.env.REACT_APP_ENABLE_DATA_SYNC !== 'false'
  },

  // Configuración de la interfaz
  ui: {
    theme: 'green',
    animations: true,
    showHints: true,
    showProgress: true
  }
}

export default config
