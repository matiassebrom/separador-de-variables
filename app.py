import time
import streamlit as st

from utils.session import init_state, go_next

from stages.stage1_upload import stage_upload
from stages.stage2_separate_by import stage_separate_by
from stages.stage3_filters import stage_filters
from stages.stage4_keep import stage_keep
from stages.stage5_naming import stage_naming
from stages.stage6_generate import stage_generate

st.set_page_config(page_title="Split & Filter Excel", page_icon="🗂️", layout="centered")
st.title("🗂️ Split & Filter Excel — flujo por etapas")

init_state()  # asegura las claves en session_state

STAGES = [
    ("1) Subir archivo", stage_upload),
    ("2) Obtener cabeceras y elegir 'Separar por'", stage_separate_by),
    ("3) Configurar filtros (opcional)", stage_filters),
    ("4) Elegir 'Datos a guardar'", stage_keep),
    ("5) Nombre base", stage_naming),
    ("6) Generar archivos", stage_generate),
]

# Sidebar con progreso
with st.sidebar:
    st.header("Progreso")
    for i, (title, _) in enumerate(STAGES, start=1):
        marker = "✅" if st.session_state.stage > i else ("➡️" if st.session_state.stage == i else "⏳")
        st.write(f"{marker} {title}")

# Render de la etapa actual
current = st.session_state.stage
title, fn = STAGES[current - 1]
st.subheader(title)

# Pequeño "loading" al entrar a cada etapa (0.15s)
with st.spinner("Cargando etapa..."):
    time.sleep(0.15)

# Ejecutar etapa
done = fn()

# Si estamos en el paso 1 y ya se subió archivo, obtener cabeceras automáticamente
if st.session_state.stage == 1 and st.session_state.get("_file_uploaded", False):
    # Obtener cabeceras automáticamente
    cols = [str(c) for c in st.session_state.df.columns.tolist()]
    st.session_state.columns = cols
    st.session_state["_headers_obtained"] = True
    go_next()
    st.rerun()

# Botón continuar (solo si la etapa reporta done=True)
if done and st.session_state.stage < len(STAGES):
    if st.button("Continuar ➡️", type="primary"):
        go_next()
        st.rerun()
