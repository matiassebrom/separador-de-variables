import streamlit as st

def stage_naming() -> bool:
    """
    6) Nombre base para archivos.
    """
    if not st.session_state.file_name:
        st.warning("Primero subí un archivo en la etapa 1.")
        return False

    default = st.session_state.file_name.rsplit(".", 1)[0]
    base = st.text_input("Guardar como (base)", value=st.session_state.base_name or default)
    base_val = base or ""
    sep_col = st.session_state.separate_by or "[columna]"
    st.caption(f"Los archivos se guardarán como: <base> + ' - ' + '{sep_col}' + ' - ' + valor.xlsx")
    if base_val.strip():
        st.session_state.base_name = base_val.strip()
        return True

    if st.session_state.base_name:
        st.info(f"Actual: {st.session_state.base_name}")
    return False
