import streamlit as st

def stage_keep() -> bool:
    """
    5) Elegir 'Datos a guardar' (inicia vacío).
    """
    if not st.session_state.columns:
        st.warning("Primero obtené cabeceras en la etapa 2.")
        return False


    # Inicializar con la columna de separate_by si está vacío

    # Inicializar con la columna de separate_by si está vacío
    if ("keep_cols" not in st.session_state or not st.session_state["keep_cols"]) and st.session_state.get("separate_by"):
        st.session_state["keep_cols"] = [st.session_state["separate_by"]]

    selected = st.multiselect(
        "Datos a guardar (columnas)",
        options=st.session_state.columns,
        default=st.session_state["keep_cols"],
        key="keep_cols_ms"
    )
    if selected != st.session_state["keep_cols"]:
        st.session_state["keep_cols"] = selected

    return len(st.session_state["keep_cols"]) > 0
