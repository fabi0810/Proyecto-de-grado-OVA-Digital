# Módulo 3: Álgebra Booleana, Tablas de Verdad y Simplificación

## Descripción General

El **Módulo 3** del OVA de Lógica Digital es el núcleo teórico-práctico que integra los conceptos de los Módulos 1 y 2, enfocándose en **álgebra booleana, generación automática de tablas de verdad y simplificación de expresiones lógicas** con aplicación práctica en sistemas digitales.

## Características Principales

### 🧮 **Parser de Expresiones Booleanas**
- **Múltiples notaciones**: Matemática (A·B + C'), Programación (A && B || !C), Lógica formal (A ∧ B ∨ ¬C), ASCII (A AND B OR NOT C)
- **Validación en tiempo real**: Detección de errores sintácticos con sugerencias específicas
- **Autocompletado**: Asistencia inteligente para escribir expresiones
- **Conversión automática**: Entre diferentes notaciones

### 📊 **Generador de Tablas de Verdad**
- **Generación instantánea**: Tablas completas con todas las combinaciones
- **Identificación automática**: Variables extraídas de la expresión
- **Columnas intermedias**: Para expresiones complejas
- **Análisis estadístico**: Tautologías, contradicciones, satisfacibilidad
- **Exportación**: CSV, LaTeX, texto plano

### 🔧 **Asistente de Simplificación**
- **Teoremas implementados**: Identidad, nulo, idempotencia, complemento, conmutativa, asociativa, distributiva, DeMorgan, absorción, consenso
- **Paso a paso**: Visualización de cada teorema aplicado con justificación
- **Modo manual**: Guiado paso a paso para aprendizaje
- **Verificación de equivalencia**: Comparación lógica entre expresiones
- **Optimización final**: Detección de forma mínima

### 🗺️ **Mapas de Karnaugh Interactivos**
- **Soporte completo**: 2, 3, 4, 5 y 6 variables
- **Agrupación automática**: Algoritmos optimizados para encontrar grupos
- **Modo manual**: Para práctica de agrupaciones
- **Verificación**: Corrección de agrupaciones propuestas
- **Traducción automática**: Entre mapa K y expresión algebraica

### 🎯 **Sistema de Ejercicios con IA**
- **ChatGPT Integration**: Ejercicios únicos y contextualizados
- **Adaptativo**: Dificultad ajustada al nivel del estudiante
- **Múltiples tipos**: Simplificación, tablas de verdad, mapas K, aplicaciones
- **Retroalimentación**: Explicaciones detalladas y pistas
- **Progreso**: Tracking de rendimiento y logros

## Componentes React

### `<BooleanExpressionEditor />`
- Editor con validación en tiempo real
- Símbolos rápidos y autocompletado
- Ejemplos predefinidos
- Múltiples notaciones soportadas

### `<TruthTableGenerator />`
- Generación automática de tablas
- Análisis estadístico
- Exportación en múltiples formatos
- Resaltado de filas importantes

### `<SimplificationWizard />`
- Asistente paso a paso
- Visualización de teoremas aplicados
- Modo manual y automático
- Estadísticas de simplificación

### `<KarnaughMapper />`
- Visualizador interactivo
- Agrupación automática y manual
- Soporte para 2-6 variables
- Instrucciones de uso

### `<ExerciseEngine />`
- Motor de ejercicios adaptativo
- Integración con ChatGPT
- Múltiples modos de dificultad
- Historial de ejercicios

### `<ProgressTracker />`
- Seguimiento de progreso
- Sistema de logros
- Recomendaciones personalizadas
- Estadísticas detalladas

## Algoritmos Implementados

### **Parser de Expresiones**
- Análisis léxico y sintáctico
- Conversión a notación postfija (RPN)
- Construcción de AST
- Evaluación con valores específicos

### **Generador de Tablas**
- Algoritmo de combinaciones
- Evaluación de expresiones
- Análisis de propiedades lógicas
- Optimización de rendimiento

### **Motor de Simplificación**
- Aplicación sistemática de teoremas
- Priorización de reglas
- Detección de equivalencias
- Optimización de complejidad

### **Mapas de Karnaugh**
- Generación de estructuras
- Algoritmos de agrupación
- Detección de grupos óptimos
- Traducción a expresiones

## Integración con Módulos

### **Conexión con Módulo 1 (Convertidor Numérico)**
- Conversión binario ↔ expresión booleana
- Generación de tablas desde conversiones
- Aplicación de números en expresiones
- Sincronización de datos

### **Conexión con Módulo 2 (Simulador de Circuitos)**
- Expresión booleana → circuito
- Circuito → expresión booleana
- Simulación con valores específicos
- Verificación de equivalencia

## Configuración

### **Variables de Entorno**
```bash
# API de OpenAI
REACT_APP_OPENAI_API_KEY=tu_api_key_aqui

# Configuración de ejercicios
REACT_APP_MAX_EXERCISES_PER_SESSION=10
REACT_APP_DEFAULT_DIFFICULTY=medium

# Configuración de simplificación
REACT_APP_MAX_SIMPLIFICATION_STEPS=50
REACT_APP_ENABLE_KARNAUGH=true
```

### **Dependencias**
- React 18+
- Vite
- Tailwind CSS
- OpenAI API (opcional)

## Uso

### **1. Editor de Expresiones**
```jsx
import BooleanExpressionEditor from './components/algebra/BooleanExpressionEditor'

<BooleanExpressionEditor
  expression={expression}
  onExpressionChange={handleChange}
  parsedExpression={parsedResult}
/>
```

### **2. Generador de Tablas**
```jsx
import TruthTableGenerator from './components/algebra/TruthTableGenerator'

<TruthTableGenerator
  expression={expression}
  parsedExpression={parsedResult}
  truthTable={tableData}
  onExpressionChange={handleChange}
/>
```

### **3. Asistente de Simplificación**
```jsx
import SimplificationWizard from './components/algebra/SimplificationWizard'

<SimplificationWizard
  expression={expression}
  parsedExpression={parsedResult}
  simplificationResult={simplificationResult}
  onSimplification={handleSimplification}
  onExpressionChange={handleChange}
/>
```

## Teoremas Implementados

### **Leyes Fundamentales**
- **Identidad**: A·1 = A, A+0 = A
- **Nulo**: A·0 = 0, A+1 = 1
- **Idempotencia**: A·A = A, A+A = A
- **Complemento**: A·A' = 0, A+A' = 1

### **Leyes de Operación**
- **Conmutativa**: A·B = B·A, A+B = B+A
- **Asociativa**: (A·B)·C = A·(B·C), (A+B)+C = A+(B+C)
- **Distributiva**: A·(B+C) = A·B+A·C, A+(B·C) = (A+B)·(A+C)

### **Teoremas Avanzados**
- **DeMorgan**: (A·B)' = A'+B', (A+B)' = A'·B'
- **Absorción**: A+A·B = A, A·(A+B) = A
- **Consenso**: A·B+A'·C+B·C = A·B+A'·C

## Rendimiento

### **Optimizaciones**
- Cache de expresiones parseadas
- Lazy loading de componentes
- Memoización de cálculos complejos
- Debounce en validación de entrada

### **Límites**
- Máximo 6 variables para mapas K
- Máximo 50 pasos de simplificación
- Cache de 100 ejercicios
- Timeout de 30s para API calls

## Contribución

### **Estructura del Código**
```
src/
├── components/
│   └── algebra/
│       ├── BooleanExpressionEditor.jsx
│       ├── TruthTableGenerator.jsx
│       ├── SimplificationWizard.jsx
│       ├── KarnaughMapper.jsx
│       ├── ExerciseEngine.jsx
│       └── ProgressTracker.jsx
├── utils/
│   ├── BooleanExpressionParser.js
│   ├── BooleanSimplifier.js
│   ├── KarnaughMapper.js
│   ├── BooleanExerciseGenerator.js
│   └── ModuleIntegration.js
└── config/
    └── environment.js
```

### **Testing**
- Unit tests para algoritmos
- Integration tests para componentes
- E2E tests para flujos completos
- Performance tests para optimización

## Licencia

Este módulo es parte del OVA de Lógica Digital de la UTS - Unidades Tecnológicas de Santander.

## Contacto

Para soporte técnico o preguntas sobre el módulo, contactar al equipo de desarrollo del OVA.
