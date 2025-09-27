# Plan de Actualización del Frontend

## Análisis del Backend

El backend implementa una aplicación para separar archivos Excel con los siguientes pasos:

1. Subir archivo Excel
2. Elegir columnas para mantener en todos los archivos 
3. Elegir columnas para separar (generar archivos independientes)
4. Establecer nombre base (opcional)
5. Generar y descargar archivos

## Plan de Acción para el Frontend

### 1. Actualización de Servicios

#### api.service.ts:
- Implementar métodos para todos los endpoints:
  - `uploadFile()`
  - `getHeaders(fileId)`
  - `getHeadersData(fileId)`
  - `getUniqueValues(fileId, header)`
  - `setHeadersToKeep(fileId, headers)`
  - `setHeadersToSplit(fileId, headers)`
  - `setBaseName(fileId, baseName)`
  - `downloadFiles(fileId)`

#### file-state.service.ts:
- Actualizar para mantener estado:
  - `fileId` y `fileName`
  - `headers` (todas las columnas disponibles)
  - `headersData` (estadísticas de columnas)
  - `headersToKeep` (columnas a mantener)
  - `headersToSplit` (columnas para separar)
  - `baseName` (nombre base para descarga)

### 2. Actualización del Sistema de Pasos

#### steps.config.ts:
- Redefinir los pasos para que coincidan con el flujo del backend:
  - Paso 1: Subir archivo
  - Paso 2: Elegir columnas a mantener
  - Paso 3: Elegir columnas para separar
  - Paso 4: Configurar nombre y descargar

### 3. Implementación de Componentes

#### Paso 1: Upload (step1-upload)
- Subir archivo Excel
- Mostrar información del archivo cargado
- Mostrar estadísticas de columnas (`getHeadersData`)

#### Paso 2: Columnas a Mantener (step2-separate-by o renombrar)
- Mostrar todas las columnas disponibles
- Permitir seleccionar qué columnas mantener en todos los archivos
- Implementar `setHeadersToKeep`

#### Paso 3: Columnas para Separar (step3-filters o renombrar)
- Mostrar todas las columnas disponibles
- Permitir seleccionar qué columnas usar para separar
- Implementar `setHeadersToSplit`

#### Paso 4: Descarga (step4-choose-columns y step5-download, combinar o reorganizar)
- Configurar nombre base para los archivos
- Botón para generar y descargar archivos
- Mostrar progreso de descarga

### 4. Mejoras de UX/UI

- Implementar indicadores de carga durante procesos
- Añadir validaciones en cada paso
- Mostrar errores del backend de forma amigable
- Implementar navegación intuitiva entre pasos
- Añadir tooltips y ayuda contextual

### 5. Renombramiento de Componentes (opcional)

Renombrar componentes para reflejar su función actual:
- `step2-separate-by` → `step2-columns-to-keep`
- `step3-filters` → `step3-columns-to-split`
- Combinar o reorganizar `step4-choose-columns` y `step5-download`

## Cómo ejecutar tests localmente

Notas:
- He añadido pruebas unitarias para `ApiService` en `src/app/services/api.service.spec.ts`.
- No pude ejecutar las pruebas en este entorno porque las dependencias de Node/Angular no están instaladas aquí (el runner devuelve un error indicando que falta `@angular-devkit/build-angular`).

Pasos para ejecutar las pruebas en tu máquina:

```powershell
cd "d:/proyecto Python/separador de variables/separador-de-archivos/frontend"
npm install
npm test
```

Si prefieres ejecutar una sola suite o archivo de pruebas con Karma/Jasmine, usa las opciones de `ng test` o configura `karma.conf.js` para filtrar.

Estado actual de la tarea de tests:
- Tests agregados: `src/app/services/api.service.spec.ts` (cubre todos los métodos del `ApiService`).
- Ejecución local: pendiente — requiere `npm install`.

Próximos pasos recomendados:
- Ejecutar `npm install` y `npm test` localmente, corregir warnings/errores de typings si aparecen.
- Integrar las llamadas del `ApiService` en los componentes de los pasos (upload, seleccionar headers, descargar).
- Añadir tests end-to-end ligeros (protractor/cypress) para el flujo completo.