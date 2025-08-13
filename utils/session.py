import streamlit as st

def init_state():
    defaults = {
        "stage": 1,              # etapa actual (1..7)
        "df": None,              # DataFrame cargado
        "file_name": "",         # nombre del archivo subido
        "columns": [],           # cabeceras
        "separate_by": None,     # columna para separar
        "filters": {},           # dict: col -> [vals...]
        "keep_cols": [],         # columnas a guardar
        "base_name": "",         # nombre base para archivos
    }
    for k, v in defaults.items():
        if k not in st.session_state:
            st.session_state[k] = v

def go_next():
    st.session_state.stage += 1
