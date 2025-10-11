// src/utils/circuitFileHandler.js

/**
 * Formato de archivo compatible:
 * {
 *   version: "1.0",
 *   name: "Nombre del circuito",
 *   timestamp: "ISO date",
 *   nodes: [...],
 *   edges: [...],
 *   inputs: {...}
 * }
 */

const CIRCUIT_FILE_VERSION = "1.0";
const COMPATIBLE_VERSIONS = ["1.0"];
const ALLOWED_FILE_EXTENSIONS = [".json", ".circuit"];

/**
 * Exporta el circuito como archivo JSON descargable
 */
export function exportCircuit(circuitName, nodes, edges, inputs) {
  const circuitData = {
    version: CIRCUIT_FILE_VERSION,
    name: circuitName,
    timestamp: new Date().toISOString(),
    metadata: {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      inputCount: Object.keys(inputs).length,
      exportedBy: "Circuit Simulator v1.0"
    },
    nodes: nodes,
    edges: edges,
    inputs: inputs
  };

  // Convertir a JSON con formato legible
  const jsonString = JSON.stringify(circuitData, null, 2);
  
  // Crear blob
  const blob = new Blob([jsonString], { type: 'application/json' });
  
  // Crear enlace de descarga
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${sanitizeFileName(circuitName)}.circuit.json`;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  return {
    success: true,
    message: `Circuito "${circuitName}" exportado exitosamente`
  };
}

/**
 * Importa un circuito desde un archivo JSON
 */
export async function importCircuit(file) {
  return new Promise((resolve, reject) => {
    // Validar extensión del archivo
    const fileName = file.name.toLowerCase();
    const hasValidExtension = ALLOWED_FILE_EXTENSIONS.some(ext => 
      fileName.endsWith(ext)
    );
    
    if (!hasValidExtension) {
      reject({
        success: false,
        error: 'INVALID_EXTENSION',
        message: `Archivo no compatible. Solo se permiten archivos: ${ALLOWED_FILE_EXTENSIONS.join(', ')}`
      });
      return;
    }
    
    // Validar tamaño del archivo (máximo 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      reject({
        success: false,
        error: 'FILE_TOO_LARGE',
        message: 'El archivo es demasiado grande. Máximo permitido: 5MB'
      });
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const circuitData = JSON.parse(event.target.result);
        
        // Validar estructura del archivo
        const validation = validateCircuitData(circuitData);
        
        if (!validation.valid) {
          reject({
            success: false,
            error: 'INVALID_FORMAT',
            message: validation.message,
            details: validation.details
          });
          return;
        }
        
        resolve({
          success: true,
          message: `Circuito "${circuitData.name}" importado exitosamente`,
          data: circuitData
        });
        
      } catch (error) {
        reject({
          success: false,
          error: 'PARSE_ERROR',
          message: 'Error al leer el archivo. Asegúrate de que sea un archivo JSON válido.',
          details: error.message
        });
      }
    };
    
    reader.onerror = () => {
      reject({
        success: false,
        error: 'READ_ERROR',
        message: 'Error al leer el archivo. Intenta nuevamente.'
      });
    };
    
    reader.readAsText(file);
  });
}

/**
 * Valida que los datos del circuito sean compatibles
 */
function validateCircuitData(data) {
  const errors = [];
  
  // Validar que exista la propiedad version
  if (!data.version) {
    errors.push('Falta el número de versión del archivo');
  } else if (!COMPATIBLE_VERSIONS.includes(data.version)) {
    return {
      valid: false,
      message: `Versión incompatible. Este simulador solo soporta versiones: ${COMPATIBLE_VERSIONS.join(', ')}`,
      details: `Versión del archivo: ${data.version}`
    };
  }
  
  // Validar propiedades requeridas
  if (!data.name) errors.push('Falta el nombre del circuito');
  if (!data.nodes) errors.push('Falta la información de nodos');
  if (!data.edges) errors.push('Falta la información de conexiones');
  if (!data.inputs) errors.push('Falta la información de entradas');
  
  // Validar tipos de datos
  if (data.nodes && !Array.isArray(data.nodes)) {
    errors.push('Los nodos deben ser un array');
  }
  if (data.edges && !Array.isArray(data.edges)) {
    errors.push('Las conexiones deben ser un array');
  }
  if (data.inputs && typeof data.inputs !== 'object') {
    errors.push('Las entradas deben ser un objeto');
  }
  
  // Validar estructura de nodos
  if (data.nodes && Array.isArray(data.nodes)) {
    data.nodes.forEach((node, index) => {
      if (!node.id) errors.push(`Nodo ${index}: falta el ID`);
      if (!node.type) errors.push(`Nodo ${index}: falta el tipo`);
      if (!node.position) errors.push(`Nodo ${index}: falta la posición`);
    });
  }
  
  // Validar estructura de edges
  if (data.edges && Array.isArray(data.edges)) {
    data.edges.forEach((edge, index) => {
      if (!edge.source) errors.push(`Conexión ${index}: falta el nodo origen`);
      if (!edge.target) errors.push(`Conexión ${index}: falta el nodo destino`);
    });
  }
  
  if (errors.length > 0) {
    return {
      valid: false,
      message: 'El archivo tiene errores de formato',
      details: errors
    };
  }
  
  return { valid: true };
}

/**
 * Sanitiza el nombre del archivo
 */
function sanitizeFileName(name) {
  return name
    .replace(/[^a-z0-9_\-]/gi, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
}

/**
 * Obtiene información del archivo sin cargarlo completamente
 */
export function getFileInfo(file) {
  return {
    name: file.name,
    size: file.size,
    sizeFormatted: formatFileSize(file.size),
    type: file.type,
    lastModified: new Date(file.lastModified).toLocaleString()
  };
}

/**
 * Formatea el tamaño del archivo
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}