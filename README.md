# OVA - Lógica Digital

Un Objeto Virtual de Aprendizaje interactivo para el estudio de la lógica digital, desarrollado con React, Vite y Tailwind CSS.

## 🚀 Características

- **Convertidor Numérico**: Convierte números entre sistemas decimal, binario, octal y hexadecimal
- **Simulador de Circuitos**: Diseña y simula circuitos lógicos digitales con diferentes compuertas
- **Laboratorio de Álgebra de Boole**: Practica expresiones booleanas con tablas de verdad y simplificación

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Circuit Simulation**: React Flow (preparado para futuras implementaciones)

## 📁 Estructura del Proyecto

```
ova-logica-digital/
├── public/                 # Archivos estáticos
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── Navbar.jsx     # Navegación principal
│   │   ├── NumericConverter.jsx
│   │   ├── CircuitSimulator.jsx
│   │   └── BooleanAlgebra.jsx
│   ├── pages/             # Páginas de la aplicación
│   │   └── Home.jsx       # Página de inicio
│   ├── App.jsx            # Componente principal con routing
│   ├── main.jsx           # Punto de entrada de React
│   └── index.css          # Estilos globales y Tailwind
├── index.html             # Página HTML principal
├── package.json           # Dependencias y scripts
├── vite.config.js         # Configuración de Vite
├── tailwind.config.js     # Configuración de Tailwind CSS
├── postcss.config.js      # Configuración de PostCSS
└── README.md              # Este archivo
```

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   cd ova-logica-digital
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   - El proyecto se abrirá automáticamente en `http://localhost:3000`
   - Si no se abre automáticamente, navega manualmente a esa URL

### Otros Comandos Disponibles

- **Construir para producción**
  ```bash
  npm run build
  ```

- **Vista previa de la construcción**
  ```bash
  npm run preview
  ```

- **Ejecutar linter**
  ```bash
  npm run lint
  ```

## 📚 Módulos del OVA

### 1. Convertidor Numérico
- Conversión entre sistemas numéricos (decimal, binario, octal, hexadecimal)
- Interfaz intuitiva con validación de entrada
- Información educativa sobre cada sistema numérico

### 2. Simulador de Circuitos
- Simulación de compuertas lógicas básicas (AND, OR, NOT, NAND, NOR, XOR)
- Control de entradas A, B, C con visualización visual
- Construcción de circuitos paso a paso
- Información detallada sobre cada tipo de compuerta

### 3. Laboratorio de Álgebra de Boole
- Evaluación de expresiones booleanas
- Generación automática de tablas de verdad
- Simplificación básica de expresiones
- Ejemplos predefinidos para práctica
- Referencia completa de leyes booleanas

## 🎨 Características de la UI

- **Diseño Responsivo**: Adaptable a diferentes tamaños de pantalla
- **Tema Moderno**: Interfaz limpia y profesional con Tailwind CSS
- **Navegación Intuitiva**: Menú de navegación claro y accesible
- **Componentes Interactivos**: Botones, formularios y visualizaciones dinámicas
- **Colores Semánticos**: Uso de colores para representar estados lógicos (verde=1, rojo=0)

## 🔧 Personalización

### Modificar Estilos
- Editar `src/index.css` para estilos globales
- Modificar `tailwind.config.js` para personalizar el tema
- Usar las clases de utilidad de Tailwind CSS en los componentes

### Agregar Nuevas Funcionalidades
- Crear nuevos componentes en `src/components/`
- Agregar nuevas rutas en `src/App.jsx`
- Implementar lógica adicional en los componentes existentes

## 📝 Notas de Desarrollo

- El proyecto está configurado para desarrollo inmediato
- Todos los componentes están implementados y funcionales
- La estructura está preparada para futuras expansiones
- El código incluye comentarios explicativos para facilitar la comprensión

## 🤝 Contribuciones

Para contribuir al proyecto:
1. Fork del repositorio
2. Crear una rama para tu feature
3. Implementar cambios
4. Crear un Pull Request

## 📄 Licencia

Este proyecto está desarrollado con fines educativos.

## 📞 Soporte

Para preguntas o soporte técnico, contacta al equipo de desarrollo del OVA.

---

**¡Disfruta aprendiendo lógica digital de manera interactiva!** 🎓⚡
