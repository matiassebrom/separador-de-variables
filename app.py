import time
import streamlit as st

from utils.session import init_state, go_next
from stages.stage1_upload import stage_upload
from stages.stage2_headers import stage_headers
from stages.stage3_separate_by import stage_separate_by
from stages.stage4_filters import stage_filters
from stages.stage5_keep import stage_keep
from stages.stage6_naming import stage_naming
from stages.stage7_generate import stage_generate

st.set_page_config(page_title="Split & Filter Excel", page_icon="🗂️", layout="centered")
st.title("🗂️ Split & Filter Excel — flujo por etapas")

init_state()  # asegura las claves en session_state

STAGES = [
    ("1) Subir archivo", stage_upload),
    ("2) Obtener cabeceras", stage_headers),
    ("3) Elegir 'Separar por'", stage_separate_by),
    ("4) Configurar filtros (opcional)", stage_filters),
    ("5) Elegir 'Datos a guardar'", stage_keep),
    ("6) Nombre base", stage_naming),
    ("7) Generar archivos", stage_generate),
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

# Botón continuar (solo si la etapa reporta done=True)
if done and st.session_state.stage < len(STAGES):
    if st.button("Continuar ➡️", type="primary"):
        go_next()
        st.rerun()
