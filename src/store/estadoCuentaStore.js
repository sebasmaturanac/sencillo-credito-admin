import create from "zustand";
import API from "utils/api";
import COMISION_ESTADO from "types/comision";

const initialState = {
  loading: false,
  stringSearch: "",
  currentPage: 0,
  pageSize: 10,
  toDate: "",
  fromDate: "",
  cuentas: [],
  totalCuentas: 0,
  estado: "",
};

export const useEstadoCuentaStore = create((set, get) => ({
  ...initialState,
  resetStore: () => set(() => initialState),
  toggleLoading: () => set((state) => ({ loading: !state.loading })),
  setPage: (_, page) => {
    set({ currentPage: page });
    get().getEstadoCuenta();
  },
  setPageSize: (event) => {
    set({ pageSize: event?.target?.value || 10, currentPage: 0 });
    get().getEstadoCuenta();
  },
  setStringSearch: (stringSearch) => {
    if (stringSearch.length === 0 || stringSearch.length > 2) {
      set({ stringSearch, currentPage: 0 });
      get().getEstadoCuenta();
    }
  },
  setEstado: (estado) => {
    set({ estado, currentPage: 0 });
    get().getEstadoCuenta();
  },
  setFiltroFecha: (fechas) => {
    set({ ...fechas, currentPage: 0 });
    get().getEstadoCuenta();
  },
  updateEstadoDePagoPedido: (idPedido) => {
    set((state) => {
      const cuentas = state.cuentas.map((pedido) => ({ ...pedido }));
      const pedidoToUpdate = cuentas.find((pedido) => pedido.id === idPedido);
      pedidoToUpdate.comision.estado = COMISION_ESTADO.COBRADO;
      return { cuentas };
    });
  },
  getEstadoCuenta: async () => {
    try {
      get().toggleLoading();
      const { respuesta } = await API.get("/pedido/estadoCuenta", {
        params: {
          string: get().stringSearch,
          page: get().currentPage + 1,
          take: get().pageSize,
          toDate: get().toDate,
          fromDate: get().fromDate,
          estado: get().estado,
        },
      });
      set({
        cuentas: respuesta[0]?.estadoCuenta,
        totalCuentas: respuesta[0].total,
      });
    } catch (error) {
      console.error("error: ", error);
    } finally {
      get().toggleLoading();
    }
  },
}));

export const estadoCuentaSelector = (state) => ({
  loading: state.loading,
  toggleLoading: state.toggleLoading,
  cuentasTable: state.cuentas,
  currentPage: state.currentPage,
  pageSize: state.pageSize,
  totalCuentas: state.totalCuentas,
  estado: state.estado,
  getEstadoCuenta: state.getEstadoCuenta,
  setStringSearch: state.setStringSearch,
  setEstado: state.setEstado,
  setFiltroFecha: state.setFiltroFecha,
  setPageSize: state.setPageSize,
  setPage: state.setPage,
  updateEstadoDePagoPedido: state.updateEstadoDePagoPedido,
  resetStore: state.resetStore,
});
