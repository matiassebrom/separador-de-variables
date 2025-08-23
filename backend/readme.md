# Split & Filter Excel - Backend API

## 📋 Descripción

**Split & Filter Excel** es una aplicación que permite procesar archivos Excel o CSV grandes dividiéndolos en múltiples archivos más pequeños basados en criterios específicos. La aplicación facilita la segmentación de datos masivos en archivos manejables y organizados.

## ✨ Características Principales

### 🔄 Procesamiento de Archivos
- **Formatos soportados**: Excel (.xlsx, .xls) y CSV
- **Lectura automática**: Detección automática de cabeceras y estructura
- **Validación**: Verificación de integridad de archivos antes del procesamiento

### 📊 Funcionalidades de Separación
- **Separación por columna**: Divide el archivo basándose en los valores únicos de una columna específica
- **Filtrado avanzado**: Aplica filtros opcionales antes de la separación (máximo 20 valores únicos por columna)
- **Selección de columnas**: Elige qué columnas incluir en los archivos de salida
- **Nomenclatura personalizada**: Define el nombre base para los archivos generados

### 📁 Gestión de Archivos de Salida
- **Archivos individuales**: Un archivo Excel por cada valor único de la columna de separación
- **Organización automática**: Los archivos se nombran siguiendo el patrón: `[base] - [columna] - [valor].xlsx`
- **Manejo de duplicados**: Sufijos automáticos (1), (2), etc. para evitar conflictos de nombres
- **Descarga en ZIP**: Todos los archivos se comprimen en un solo archivo ZIP para descarga

### 🛡️ Características de Seguridad y Robustez
- **Sanitización de nombres**: Limpieza automática de caracteres no válidos en nombres de archivo
- **Prevención de archivos vacíos**: Validación de que los grupos contienen datos
- **Gestión de memoria**: Procesamiento eficiente en memoria para archivos grandes
- **Previsualización**: Vista previa de archivos a generar antes del procesamiento final

## 🎯 Casos de Uso

### 📈 Análisis de Datos por Segmentos
- Dividir datos de ventas por región, vendedor o período
- Separar registros de clientes por categoría o ubicación
- Segmentar datos financieros por departamento o proyecto

### 📋 Distribución de Reportes
- Generar reportes individuales para cada sucursal
- Crear archivos específicos para diferentes equipos o responsables
- Distribuir datos personalizados según criterios de negocio

### 🔄 Migración y ETL
- Preparar datos para sistemas que requieren archivos separados
- Facilitar procesos de importación por lotes
- Optimizar transferencias de datos grandes

## 💼 Beneficios

- **Eficiencia**: Automatiza el proceso manual de división de archivos
- **Flexibilidad**: Múltiples opciones de filtrado y personalización
- **Escalabilidad**: Maneja archivos de gran tamaño sin problemas de memoria
- **Usabilidad**: Interfaz intuitiva con flujo paso a paso
- **Confiabilidad**: Validaciones robustas y manejo de errores

---

*Esta aplicación está diseñada para profesionales que trabajan con grandes volúmenes de datos y necesitan herramientas eficientes para su segmentación y distribución.*
