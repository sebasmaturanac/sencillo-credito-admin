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
  pedidos: [],
  totalPedidos: 0,
  estado: "",
  comision: "",
  userId: "",
};

export const usePedidoStore = create((set, get) => ({
  ...initialState,
  resetStore: () => set(() => initialState),
  getFilterParams: () => ({
    string: get().stringSearch,
    page: get().currentPage + 1,
    take: get().pageSize,
    toDate: get().toDate,
    fromDate: get().fromDate,
    estado: get().estado,
    comision: get().comision,
    userId: get().userId,
  }),
  toggleLoading: () => set((state) => ({ loading: !state.loading })),
  setPage: (_, page) => {
    set({ currentPage: page });
    get().getPedidos();
  },
  setPageSize: (event) => {
    set({ pageSize: event?.target?.value || 10, currentPage: 0 });
    get().getPedidos();
  },
  setStringSearch: (stringSearch) => {
    if (stringSearch.length === 0 || stringSearch.length > 2) {
      set({ stringSearch, currentPage: 0 });
      get().getPedidos();
    }
  },
  setEstado: (estado) => {
    set({ estado, currentPage: 0 });
    get().getPedidos();
  },
  setComision: (comision) => {
    set({ comision, currentPage: 0 });
    get().getPedidos();
  },
  clearUserId: () => {
    set({ userId: "", currentPage: 0, pageSize: 10, comision: "" });
    get().getPedidos();
  },
  pagarComisionPorUserId: (userId) => {
    set({ userId, currentPage: 0, pageSize: 1000, comision: COMISION_ESTADO.NO_COBRADO });
    get().getPedidos();
  },
  setFiltroFecha: (fechas) => {
    set({ ...fechas, currentPage: 0 });
    get().getPedidos();
  },
  handleRevisionUpdate: (pedidoToUpdate) => {
    set((state) => {
      const copyTable = state.pedidos.map((pedido) => ({ ...pedido }));
      const pedido = copyTable.find(({ id }) => id === pedidoToUpdate.id);
      if (!pedido) return state;
      pedido.estado = { ...pedidoToUpdate.estado };
      pedido.comision = pedidoToUpdate?.comision ? { ...pedidoToUpdate.comision } : null;
      return { pedidos: copyTable };
    });
  },
  updateEstadoDePagoPedido: (idPedido) => {
    set((state) => {
      const pedidos = state.pedidos.map((pedido) => ({ ...pedido }));
      const pedidoToUpdate = pedidos.find((pedido) => pedido.id === idPedido);
      pedidoToUpdate.comision.estado = COMISION_ESTADO.COBRADO;
      return { pedidos };
    });
  },
  updateEstadoDeRegalia: (idPedido) => {
    set((state) => {
      const pedidos = state.pedidos.map((pedido) => ({ ...pedido }));
      const pedidoToUpdate = pedidos.find((pedido) => pedido.id === idPedido);
      pedidoToUpdate.regaliaCobrada = true;
      return { pedidos };
    });
  },
  updateMontoSolicitado: ({ idPedido, montoSolicitado }) => {
    set((state) => {
      const pedidos = state.pedidos.map((pedido) => ({ ...pedido }));
      const pedidoToUpdate = pedidos.find((pedido) => pedido.id === idPedido);
      pedidoToUpdate.montoSolicitado = montoSolicitado;
      return { pedidos };
    });
  },
  handleToggleCheckbox: (idPedido) => () => {
    set((state) => {
      const pedidos = state.pedidos.map((pedido) => ({ ...pedido }));
      const pedidoToUpdate = pedidos.find((pedido) => pedido.id === idPedido);
      pedidoToUpdate.checked = !pedidoToUpdate.checked;
      return { pedidos };
    });
  },
  toggleAllCheckbox: (checkBoxValue) => {
    set((state) => {
      const pedidos = state.pedidos.map((pedido) => ({ ...pedido, checked: checkBoxValue }));
      return { pedidos };
    });
  },
  getPedidos: async () => {
    try {
      get().toggleLoading();
      const { respuesta } = await API.get("/pedido/search", {
        params: {
          string: get().stringSearch,
          page: get().currentPage + 1,
          take: get().pageSize,
          toDate: get().toDate,
          fromDate: get().fromDate,
          estado: get().estado,
          comision: get().comision,
          userId: get().userId,
        },
      });
      const pedidos = respuesta[0]?.pedidos.map((pedido) => ({
        ...pedido,
        checked: false,
      }));
      set({
        pedidos,
        totalPedidos: respuesta[0].total,
      });
    } catch (error) {
      console.error("error: ", error);
    } finally {
      get().toggleLoading();
    }
  },
}));

export const pedidoStoreSelector = (state) => ({
  loading: state.loading,
  toggleLoading: state.toggleLoading,
  pedidosTable: state.pedidos,
  currentPage: state.currentPage,
  comision: state.comision,
  toDate: state.toDate,
  fromDate: state.fromDate,
  userId: state.userId,
  clearUserId: state.clearUserId,
  pageSize: state.pageSize,
  totalPedidos: state.totalPedidos,
  estado: state.estado,
  getPedidos: state.getPedidos,
  setStringSearch: state.setStringSearch,
  setEstado: state.setEstado,
  setComision: state.setComision,
  setFiltroFecha: state.setFiltroFecha,
  handleRevisionUpdate: state.handleRevisionUpdate,
  setPageSize: state.setPageSize,
  setPage: state.setPage,
  pagarComisionPorUserId: state.pagarComisionPorUserId,
  updateEstadoDePagoPedido: state.updateEstadoDePagoPedido,
  updateEstadoDeRegalia: state.updateEstadoDeRegalia,
  handleToggleCheckbox: state.handleToggleCheckbox,
  toggleAllCheckbox: state.toggleAllCheckbox,
  resetStore: state.resetStore,
  updateMontoSolicitado: state.updateMontoSolicitado,
  filterParams: {
    string: state.stringSearch,
    page: state.currentPage + 1,
    take: state.pageSize,
    toDate: state.toDate,
    fromDate: state.fromDate,
    estado: state.estado,
    comision: state.comision,
    userId: state.userId,
  },
});
