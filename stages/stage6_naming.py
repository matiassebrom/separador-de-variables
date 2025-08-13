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
    ok = st.button("Confirmar nombre base", type="primary", disabled=(not base_val.strip()))
    if ok:
        st.session_state.base_name = base_val.strip()
        st.session_state["_base_name_confirmed"] = True
        st.success(f"Nombre base confirmado: {st.session_state.base_name}")
        return True

    if st.session_state.get("_base_name_confirmed", False):
        return True

    if st.session_state.base_name:
        st.info(f"Actual: {st.session_state.base_name}")
    return False
