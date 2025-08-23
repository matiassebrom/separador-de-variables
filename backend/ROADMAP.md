# FastAPI Backend Development Roadmap

## 🎯 Objetivo

Migrar la aplicación actual de Streamlit a una arquitectura moderna FastAPI + Frontend, manteniendo toda la funcionalidad existente pero con mejor escalabilidad, performance y separación de responsabilidades.

## 📋 Análisis de la Aplicación Legacy

### Componentes Principales Identificados

#### 1. **Gestión de Estado de Sesión** (`utils/session.py`)

-   Manejo de estado multi-etapa
-   Variables de sesión: stage, df, file_name, columns, separate_by, filters, keep_cols, base_name

#### 2. **Procesamiento de Archivos** (`utils/fileio.py`)

-   Lectura de Excel/CSV
-   Generación de archivos Excel
-   Creación de ZIP con múltiples archivos
-   Sanitización de nombres de archivo

#### 3. **Flujo de Etapas** (6 etapas secuenciales)

-   **Etapa 1**: Upload de archivo
-   **Etapa 2**: Detección de cabeceras + selección de columna para separar
-   **Etapa 3**: Configuración de filtros opcionales
-   **Etapa 4**: Selección de columnas a mantener
-   **Etapa 5**: Definición de nombre base
-   **Etapa 6**: Generación y descarga de archivos

## 🏗️ Arquitectura FastAPI Propuesta

### Core Components

#### 1. **Models & Schemas** (`models/`)

```python
# Pydantic models para request/response
- FileUploadResponse
- ColumnSelectionRequest
- FilterConfiguration
- ProcessingStatus
- GenerationRequest
```

#### 2. **Services** (`services/`)

```python
# Lógica de negocio
- file_processor.py      # Lectura/escritura de archivos
- data_analyzer.py       # Análisis de columnas y datos
- filter_engine.py       # Aplicación de filtros
- zip_generator.py       # Generación de archivos ZIP
- session_manager.py     # Gestión de sesiones/estado
```

#### 3. **API Endpoints** (`routers/`)

```python
# REST endpoints
- files.py              # Upload, análisis de archivos
- columns.py            # Gestión de columnas y cabeceras
- filters.py            # Configuración de filtros
- processing.py         # Ejecución del procesamiento
- download.py           # Descarga de resultados
```

#### 4. **Storage & Cache** (`storage/`)

```python
# Gestión de almacenamiento temporal
- file_storage.py       # Almacenamiento de archivos temporales
- session_cache.py      # Cache de estado de sesión
- cleanup.py            # Limpieza de archivos temporales
```

## 🔄 Plan de Migración

### Fase 1: Infraestructura Base

**Objetivo**: Configurar FastAPI y estructura básica

**Tasks:**

-   [ ] Setup FastAPI project con estructura modular
-   [ ] Configurar Pydantic models base
-   [ ] Implementar sistema de logging
-   [ ] Setup de almacenamiento temporal
-   [ ] Configurar CORS para frontend
-   [ ] Crear sistema de gestión de sesiones

**Entregables:**

-   FastAPI app funcional con endpoints básicos
-   Sistema de sesiones implementado
-   Estructura de proyecto definida

### Fase 2: Procesamiento de Archivos

**Objetivo**: Migrar funcionalidad de lectura y análisis de archivos

**Tasks:**

-   [ ] Migrar `fileio.py` a servicios FastAPI
-   [ ] Implementar endpoint de upload de archivos
-   [ ] Crear servicio de análisis de columnas
-   [ ] Implementar validación de archivos
-   [ ] Agregar soporte para archivos grandes (streaming)

**Entregables:**

-   API endpoints: `POST /files/upload`, `GET /files/{id}/columns`
-   Validación robusta de archivos
-   Manejo de archivos grandes

### Fase 3: Motor de Filtros

**Objetivo**: Implementar sistema de filtros dinámicos

**Tasks:**

-   [ ] Migrar lógica de filtros de `stage3_filters.py`
-   [ ] Crear API para configuración de filtros
-   [ ] Implementar cache de valores únicos
-   [ ] Validar límites de valores únicos (20 max)
-   [ ] Crear preview de filtros aplicados

**Entregables:**

-   API endpoints: `GET /files/{id}/unique-values/{column}`, `POST /filters/configure`
-   Sistema de filtros configurables
-   Cache eficiente de valores únicos

### Fase 4: Generación de Archivos

**Objetivo**: Implementar procesamiento y generación de ZIP

**Tasks:**

-   [ ] Migrar `build_zip_per_group` a servicio asíncrono
-   [ ] Implementar procesamiento en background (Celery/RQ)
-   [ ] Crear sistema de tracking de progreso
-   [ ] Implementar descarga de archivos generados
-   [ ] Agregar limpieza automática de archivos temporales

**Entregables:**

-   API endpoints: `POST /processing/start`, `GET /processing/{job_id}/status`, `GET /files/{id}/download`
-   Procesamiento asíncrono
-   Sistema de progreso en tiempo real

### Fase 5: Optimización y Testing

**Objetivo**: Performance, testing y documentación

**Tasks:**

-   [ ] Implementar tests unitarios e integración
-   [ ] Optimizar performance para archivos grandes
-   [ ] Agregar métricas y monitoring
-   [ ] Documentar API con OpenAPI/Swagger
-   [ ] Implementar rate limiting
-   [ ] Agregar health checks

**Entregables:**

-   Suite de tests completa (>80% coverage)
-   Documentación API interactiva
-   Sistema de monitoring

## 🛠️ Stack Tecnológico

### Backend

-   **Framework**: FastAPI
-   **Async**: asyncio, aiofiles
-   **Data Processing**: pandas, openpyxl, xlsxwriter
-   **Validation**: Pydantic v2
-   **Background Jobs**: Celery + Redis (o RQ)
-   **Storage**: File system + Redis cache
-   **Testing**: pytest, httpx

### Database (Opcional - Fase 6)

-   **Cache/Session**: Redis
-   **Metadata**: SQLite/PostgreSQL (para tracking de jobs)

### Deployment

-   **Containerization**: Docker
-   **Orchestration**: docker-compose
-   **Reverse Proxy**: nginx
-   **Process Manager**: uvicorn + gunicorn

## 📊 Endpoints API Propuestos

### Files Management

```
POST   /api/v1/files/upload
GET    /api/v1/files/{file_id}
GET    /api/v1/files/{file_id}/columns
GET    /api/v1/files/{file_id}/preview
DELETE /api/v1/files/{file_id}
```

### Data Analysis

```
GET    /api/v1/analysis/{file_id}/unique-values/{column}
POST   /api/v1/analysis/{file_id}/validate-filters
GET    /api/v1/analysis/{file_id}/summary
```

### Processing

```
POST   /api/v1/processing/jobs
GET    /api/v1/processing/jobs/{job_id}
GET    /api/v1/processing/jobs/{job_id}/status
POST   /api/v1/processing/jobs/{job_id}/cancel
```

### Download

```
GET    /api/v1/download/{job_id}
GET    /api/v1/download/{job_id}/preview
```

## 🎯 Criterios de Éxito

### Performance

-   [ ] Manejo de archivos hasta 100MB sin problemas de memoria
-   [ ] Tiempo de respuesta < 200ms para operaciones de análisis
-   [ ] Procesamiento de archivos de 10k+ filas en < 30 segundos

### Funcionalidad

-   [ ] 100% de paridad funcional con versión Streamlit
-   [ ] Manejo robusto de errores y validaciones
-   [ ] Limpieza automática de archivos temporales

### Calidad

-   [ ] Cobertura de tests > 80%
-   [ ] Documentación API completa
-   [ ] Logging estructurado para debugging

### Escalabilidad

-   [ ] Soporte para múltiples usuarios concurrentes
-   [ ] Procesamiento asíncrono para archivos grandes
-   [ ] Sistema de cola para trabajos en background

---

## 🚀 Getting Started

1. **Revisar código legacy** en `/backend/legacy/`
2. **Crear estructura FastAPI** siguiendo las fases
3. **Migrar componente por componente** manteniendo tests
4. **Validar funcionalidad** contra aplicación original
5. **Optimizar y documentar** cada endpoint

**Duración estimada**: 3-4 semanas (1 semana por fase principales)
