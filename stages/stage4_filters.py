import time
import streamlit as st

MAX_UNIQUES = 20  # regla: si supera esto, se cancela

def stage_filters() -> bool:
    """
    4) Configurar filtros (opcional).
    - Elegís una columna; recién ahí se calculan sus valores únicos.
    - Si hay > MAX_UNIQUES, se cancela y avisa.
    - Podés agregar múltiples filtros (dict col -> list(vals)).
    """
    if st.session_state.df is None or not st.session_state.columns:
        st.warning("Necesitás completar las etapas 1 y 2 primero.")
        return False

    st.write("Podés agregar uno o más filtros. Si no querés filtrar, simplemente Continuar en la siguiente pantalla.")

    # Estado local de la selección actual para agregar
    col = st.selectbox("Columna a filtrar", options=["(ninguna)"] + st.session_state.columns, index=0)
    vals = []
    if col and col != "(ninguna)":
        if st.button("Cargar valores disponibles"):
            with st.spinner("Buscando valores únicos..."):
                time.sleep(0.15)
                uniques = st.session_state.df[col].dropna().astype(str).unique().tolist()
                uniques.sort()
                if len(uniques) > MAX_UNIQUES:
                    st.error(f"La columna '{col}' tiene {len(uniques)} valores distintos (> {MAX_UNIQUES}). Elegí otra columna.")
                    st.session_state["_filter_vals_tmp"] = []  # limpiar cache temporal
                else:
                    st.session_state["_filter_vals_tmp"] = uniques

        # Si hay cache temporal, mostrar selector
        options = st.session_state.get("_filter_vals_tmp", [])
        if options:
            vals = st.multiselect("Valores permitidos", options=options, placeholder="Elegí uno o más…")

    # Agregar filtro actual al set de filtros (dict)
    if col and col != "(ninguna)":
        add = st.button("Agregar filtro", disabled=not vals)
        if add:
            current = st.session_state.filters.copy()
            current[col] = vals
            st.session_state.filters = current
            st.session_state["_filter_vals_tmp"] = []  # limpiar para próxima selección
            st.success(f"Filtro agregado: {col} ∈ {len(vals)} valor(es)")

    # Listar filtros activos
    if st.session_state.filters:
        st.subheader("Filtros activos")
        for k, v in st.session_state.filters.items():
            st.write(f"• **{k}** ∈ {len(v)} valor(es)")
        # Opción para limpiar todos
        if st.button("Limpiar todos los filtros"):
            st.session_state.filters = {}
            st.session_state["_filter_vals_tmp"] = []
            st.info("Filtros eliminados.")

    # Nada bloquea continuar: filtros son opcionales
    return True
