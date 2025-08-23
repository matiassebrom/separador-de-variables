import time
import streamlit as st
from utils.fileio import read_any

def stage_upload() -> bool:
    """
    1) Subir archivo: lee el DataFrame y guarda df + file_name.
    Devuelve True si podemos continuar.
    """
    up = st.file_uploader("Elegí un archivo (.xlsx, .xls o .csv)", type=["xlsx", "xls", "csv"])
    if not up and not st.session_state.get("_file_uploaded", False):
        st.info("Subí un archivo para comenzar.")
        return False

    if up and st.button("Cargar archivo", type="primary"):
        with st.spinner("Leyendo archivo..."):
            time.sleep(0.15)  # loading breve
            try:
                df = read_any(up)
            except Exception as e:
                st.error(f"No se pudo leer el archivo: {e}")
                return False
        if df.empty or df.columns.size == 0:
            st.error("El archivo no tiene columnas/filas para procesar.")
            return False
        st.session_state.df = df
        st.session_state.file_name = up.name
        st.session_state["_file_uploaded"] = True
        st.success("Archivo cargado correctamente.")
        return True

    # Si ya se cargó el archivo correctamente, permitir continuar
    if st.session_state.get("_file_uploaded", False):
        return True

    return False
