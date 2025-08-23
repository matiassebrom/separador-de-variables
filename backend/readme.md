README — Split & Filter Excel (Streamlit por etapas)
Flujo por etapas
Subir archivo

Sube Excel/CSV, se lee el DataFrame y se guarda en st.session_state.df y st.session_state.file_name.

Botón Continuar habilita la siguiente etapa.

Obtener cabeceras

Calcula y guarda st.session_state.columns.

Continuar.

Elegir “Separar por”

Selector con buscador (Streamlit lo trae).

Guarda st.session_state.separate_by.

Continuar.

Configurar filtros (opcional)

Elegís una columna a filtrar → recién ahí calcula valores únicos.

Si hay > 20 valores distintos, cancela y avisa.

Podés agregar múltiples filtros (se guardan en st.session_state.filters como dict {col: [vals...]}).

Continuar.

Elegir “Datos a guardar”

Muestra vacío por defecto; elegís una o varias columnas (se guardan en st.session_state.keep_cols).

Continuar.

Nombre base

st.session_state.base_name precargado con el nombre del archivo.

Continuar.

Generar

Aplica filtros y separa por grupos.

Crea un .xlsx por valor y los empaqueta en ZIP para descargar.

Si dentro del lote hay nombres repetidos, agrega sufijo (1), (2), ….

Nota: Trabajamos con ZIP descargable (experiencia más simple). Si querés guardar directo en una carpeta local, lo agregamos en una iteración.

streamlit-splitter/
├─ app.py
├─ requirements.txt
├─ Run App.bat # opcional (doble‑click en Windows)
├─ stages/
│ ├─ stage1_upload.py
│ ├─ stage2_headers.py
│ ├─ stage3_separate_by.py
│ ├─ stage4_filters.py
│ ├─ stage5_keep.py
│ ├─ stage6_naming.py
│ └─ stage7_generate.py
└─ utils/
├─ session.py
└─ fileio.py
