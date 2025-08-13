import time
import streamlit as st

def stage_headers() -> bool:
    """
    2) Obtener cabeceras: calcula y guarda st.session_state.columns.
    """
    if st.session_state.df is None:
        st.warning("Primero subí un archivo en la etapa 1.")
        return False

    if st.button("Obtener cabeceras", type="primary"):
        with st.spinner("Procesando cabeceras..."):
            time.sleep(0.15)
            cols = [str(c) for c in st.session_state.df.columns.tolist()]
            st.session_state.columns = cols
            st.session_state["_headers_obtained"] = True
        st.success(f"Cabeceras detectadas: {len(st.session_state.columns)}")
        return True

    if st.session_state.get("_headers_obtained", False):
        return True

    if st.session_state.columns:
        st.write(f"Cabeceras ya detectadas: {len(st.session_state.columns)}")
    return False
