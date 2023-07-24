export const ESTADOS = {
  APROBADO: "APROBADO",
  RECHAZADO: "RECHAZADO",
  PENDIENTE: "PENDIENTE",
  PENDIENTE_DE_MARGEN: "PENDIENTE_DE_MARGEN",
  PENDIENTE_DE_MARGEN_OK: "PENDIENTE_DE_MARGEN_OK",
};

export const ESTADOS_LABEL = {
  [ESTADOS.APROBADO]: "Aprobado",
  [ESTADOS.RECHAZADO]: "Rechazado",
  [ESTADOS.PENDIENTE]: "Pendiente",
  [ESTADOS.PENDIENTE_DE_MARGEN]: "Pendiente de margen",
  [ESTADOS.PENDIENTE_DE_MARGEN_OK]: "Pendiente de margen",
};

export const ESTADOS_LABEL_ALERT = {
  [ESTADOS.APROBADO]: "Aprobado",
  [ESTADOS.RECHAZADO]: "Rechazado",
  [ESTADOS.PENDIENTE]: "Poner en revisión para aprobar o rechazar",
  [ESTADOS.PENDIENTE_DE_MARGEN]: "Pendiente de margen",
  [ESTADOS.PENDIENTE_DE_MARGEN_OK]: "Pendiente de margen",
};

export const ESTADO_COLOR = {
  [ESTADOS.APROBADO]: "success",
  [ESTADOS.RECHAZADO]: "error",
  [ESTADOS.PENDIENTE]: "warning",
  [ESTADOS.PENDIENTE_DE_MARGEN]: "warning",
  [ESTADOS.PENDIENTE_DE_MARGEN_OK]: "warning",
};

export const ESTADOS_LIST = Object.keys(ESTADOS);

export const ESTADOS_DROPDOWN = [
  { value: "", label: "Todos los estados" },
  { value: ESTADOS.PENDIENTE, label: "Pendiente" },
  { value: ESTADOS.PENDIENTE_DE_MARGEN, label: "Pendiente de margen" },
  { value: ESTADOS.APROBADO, label: "Aprobado" },
  { value: ESTADOS.RECHAZADO, label: "Rechazado" },
];
