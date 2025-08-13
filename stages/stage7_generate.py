import time
import pandas as pd
import streamlit as st
from utils.fileio import build_zip_per_group

def stage_generate() -> bool:
    """
    7) Generar ZIP descargable con un Excel por valor.
    - Aplica todos los filtros definidos.
    - Agrega sufijos (1), (2)... si hay nombres repetidos dentro del ZIP.
    """
    df = st.session_state.df
    sep = st.session_state.separate_by
    keep = st.session_state.keep_cols
    base = st.session_state.base_name
    filters = st.session_state.filters

    # Validaciones duras
    if df is None:
        st.warning("Falta el archivo (etapa 1).")
        return False
    if not sep:
        st.warning("Falta 'Separar por' (etapa 3).")
        return False
    if not keep:
        st.warning("Faltan 'Datos a guardar' (etapa 5).")
        return False
    if not base:
        st.warning("Falta 'Guardar como (base)' (etapa 6).")
        return False

    # Mostrar resumen
    st.write(f"**Separar por:** {sep}")
    if filters:
        st.write("**Filtros:**")
        for k, v in filters.items():
            st.write(f"- {k} ∈ {len(v)} valor(es)")
    else:
        st.write("**Filtros:** (ninguno)")
    st.write(f"**Columnas a guardar:** {len(keep)}")
    st.write(f"**Base de nombre:** {base}")

    if st.button("Generar y descargar", type="primary"):
        with st.spinner("Generando archivos..."):
            time.sleep(0.15)

            # Aplicar filtros (si hay)
            work = df.copy()
            if filters:
                for col, vals in filters.items():
                    if vals:
                        work = work[work[col].astype(str).isin(vals)]

            if work.empty:
                st.warning("No hay filas que cumplan con los filtros seleccionados.")
                return False

            # Validar columnas
            real_keep = [c for c in keep if c in work.columns]
            if not real_keep:
                st.warning("No se encontraron columnas válidas para exportar.")
                return False

            # Generar ZIP en memoria
            mem_zip, count = build_zip_per_group(
                df=work,
                separate_by=sep,
                keep_cols=real_keep,
                base_name=base
            )
            if count == 0:
                st.warning("No se generó ningún archivo (¿grupos vacíos?).")
                return False

            st.success(f"¡Listo! Generados {count} archivo(s).")
            st.download_button(
                label="⬇️ Descargar ZIP",
                data=mem_zip,
                file_name=f"{base}__split.zip",
                mime="application/zip",
            )
            return True

    return False
