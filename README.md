# Separador de Archivos

## ¿Qué hace esta aplicación?

Esta app permite separar una base de datos en excel en varios archivos, dividiendo el archivo por columnas, se puede elegir que columnas se van a mantener en todos los arhcivos, y seleccionar las columnas por las que se crearan archivos, los resultados se van a descargar en archivos separados dentro de un ZIP. 
El flujo es guiado paso a paso desde el frontend Angular, con backend FastAPI.


para eso reciclaremos la app que tiene este flujo
### Flujo principal atnerior:

1. **Subir archivo:** Selecciona y sube tu Excel.
2. **Elegir columna para separar:** Elige la columna por la que se dividirán los datos.
3. **Aplicar filtros (opcional):** Filtra los valores que quieres conservar por columna.
4. **Seleccionar columnas a guardar:** Elige qué columnas estarán en el resultado.
5. **Definir nombre base:** Elige el nombre para los archivos generados.
6. **Descargar archivos:** Descarga un ZIP con los archivos Excel separados según tu configuración.

---
por este flujo
### Flujo principal atnerior:

1. **Subir archivo:** Selecciona y sube tu Excel.
2. **Elegir columna que se van a mantener:** Elige la columna por la que se dividirán los datos.
3. **Elegir por que columnas se va a dividir** 
4. **Definir nombre base:** Elige el nombre para los archivos generados, luego sera nombre base + columna por la que se divide
5. **Descargar archivos:** Descarga un ZIP con los archivos Excel separados según tu configuración.

Ideal para separar grandes listas, segmentar datos y automatizar tareas de exportación en Excel.

---


📋 Plan de Adaptación - Separador de Variables
Análisis del Flujo Actual vs Nuevo Flujo
Flujo Actual (6 pasos)
Subir archivo
Elegir "Separar por" (una columna)
Filtros opcionales
Datos a guardar (columnas a mantener)
Nombre base
Generar archivos
Nuevo Flujo (5 pasos)
Subir archivo
Elegir columnas que se van a mantener ⬅️ Cambio de orden
Elegir por qué columnas se va a dividir ⬅️ Permite múltiples columnas
Nombre base (será: nombre_base + valor_columna_division)
Descargar archivos
🔄 Cambios Necesarios
Backend Changes
1. Modificar Backend API
 Cambiar /set_header_to_split → /set_headers_to_split (múltiples columnas)
 Reordenar endpoints según nuevo flujo
 Actualizar lógica de generación para múltiples columnas de división
 Modificar modelos Pydantic para soportar arrays
2. Actualizar Excel Service
 Función set_headers_to_split (plural) en lugar de singular
 Lógica de generación para crear archivos por cada combinación de valores
 Actualizar generate_excels_by_value para manejar múltiples columnas
Frontend Changes
3. Reordenar Steps Configuration
4. Actualizar Modelos TypeScript
5. Modificar Componentes
 step2-separate-by → step3-separate-by (múltiple selección)
 step4-choose-columns → step2-choose-columns
 Eliminar step3-filters (sin filtros en nuevo flujo)
 Actualizar step5-download para mostrar preview con múltiples columnas
📝 Tareas Detalladas por Prioridad
🚨 ALTA PRIORIDAD
Task 1: Actualizar Backend Models
Task 2: Modificar Excel Service
Task 3: Reordenar Steps en Frontend
🔶 MEDIA PRIORIDAD
Task 4: Actualizar Step Store
Task 5: Modificar API Service
🔸 BAJA PRIORIDAD
Task 6: Actualizar Testing
 Modificar todos los tests para el nuevo flujo
 Tests de múltiples columnas de división
 Tests de combinaciones de valores
Task 7: Mejorar UX
 Preview de archivos a generar con múltiples columnas
 Validaciones de límite de combinaciones
 Loading states para operaciones pesadas
🎯 Orden de Implementación

## Semana 1: Backend
[ ] Modificar modelos Pydantic
[ ] Actualizar endpoints de API
[ ] Cambiar lógica de excel_service.py
[ ] Probar endpoints con Postman

## Semana 2: Frontend Models & Services  
[ ] Actualizar step.model.ts
[ ] Modificar api.service.ts
[ ] Cambiar steps.config.ts
[ ] Actualizar step.store.ts

## Semana 3: Componentes
[ ] Reordenar componentes en app.component.html
[ ] Modificar step2 (ahora choose-columns)
[ ] Modificar step3 (ahora separate-by múltiple)
[ ] Remover step3-filters del flujo
[ ] Actualizar step5-download

## Semana 4: Testing & Polish
[ ] Actualizar todos los tests
[ ] Validar flujo end-to-end
[ ] Mejorar UX y validaciones
[ ] Documentar cambios