const COMISION_ESTADO = {
  COBRADO: "COBRADO",
  NO_COBRADO: "NO_COBRADO",
};

export const COMISION_ESTADO_COLOR = {
  [COMISION_ESTADO.COBRADO]: "success",
  [COMISION_ESTADO.NO_COBRADO]: "warning",
};

export const COMISION_ESTADOS_DROPDOWN = [
  { value: "", label: "Comisiones" },
  { value: COMISION_ESTADO.COBRADO, label: "Cobrado" },
  { value: COMISION_ESTADO.NO_COBRADO, label: "No cobrado" },
];

export default COMISION_ESTADO;
