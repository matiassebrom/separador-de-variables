import streamlit as st

def stage_keep() -> bool:
    """
    5) Elegir 'Datos a guardar' (inicia vacío).
    """
    if not st.session_state.columns:
        st.warning("Primero obtené cabeceras en la etapa 2.")
        return False

    keep = st.multiselect("Datos a guardar (columnas)", options=st.session_state.columns, default=[])
    ok = st.button("Confirmar columnas a guardar", type="primary", disabled=(len(keep) == 0))
    if ok:
        st.session_state.keep_cols = keep
        st.session_state["_keep_cols_confirmed"] = True
        st.success(f"{len(keep)} columna(s) confirmadas.")
        return True

    if st.session_state.get("_keep_cols_confirmed", False):
        return True

    if st.session_state.keep_cols:
        st.info(f"Actual: {len(st.session_state.keep_cols)} columna(s) seleccionadas.")
    return False
