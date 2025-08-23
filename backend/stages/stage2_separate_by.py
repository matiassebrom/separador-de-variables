import time
import streamlit as st

def stage_separate_by() -> bool:
    """
    2) Obtener cabeceras y elegir 'Separar por'
    """
    if st.session_state.df is None:
        st.warning("Primero subí un archivo en la etapa 1.")
        return False

    # Obtener cabeceras si no existen
    if not st.session_state.get("columns"):
        cols = [str(c) for c in st.session_state.df.columns.tolist()]
        st.session_state.columns = cols
        st.session_state["_headers_obtained"] = True
        st.success(f"Cabeceras detectadas: {len(st.session_state.columns)}")

    # Solo inicializar si no existe la clave o si la columna ya no existe
    if "separate_by" not in st.session_state or st.session_state.separate_by not in st.session_state.columns:
        if st.session_state.columns:
            st.session_state.separate_by = st.session_state.columns[0]

    selected = st.selectbox(
        "Separar por (columna)",
        options=st.session_state.columns,
        index=st.session_state.columns.index(st.session_state.separate_by) if st.session_state.separate_by in st.session_state.columns else 0,
        key="separate_by_selectbox"
    )
    # Sincronizar el valor seleccionado con session_state
    if selected != st.session_state.separate_by:
        st.session_state.separate_by = selected

    return bool(st.session_state.separate_by)
