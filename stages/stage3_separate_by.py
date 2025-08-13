import streamlit as st

def stage_separate_by() -> bool:
    """
    3) Elegir 'Separar por'
    """
    if not st.session_state.columns:
        st.warning("Primero obtené cabeceras en la etapa 2.")
        return False

    separate_by = st.selectbox("Separar por (columna)", options=st.session_state.columns, index=None,
                               placeholder="Elegí una columna…")
    ok = st.button("Confirmar 'Separar por'", type="primary", disabled=(separate_by is None))
    if ok:
        st.session_state.separate_by = separate_by
        st.session_state["_separate_by_confirmed"] = True
        st.success(f"Separar por: {separate_by}")
        return True

    if st.session_state.get("_separate_by_confirmed", False):
        return True

    # Mostrar estado previo (si ya estaba seteado)
    if st.session_state.separate_by:
        st.info(f"Actual: {st.session_state.separate_by}")
    return False
