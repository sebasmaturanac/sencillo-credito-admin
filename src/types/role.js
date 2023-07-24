export const ROLE = {
  SUPERUSER: "SUPERUSER",
  AUTORIZADOR: "AUTORIZADOR",
  COMERCIALIZADORA: "COMERCIALIZADORA",
  VENDEDOR: "VENDEDOR",
};

export const ROLE_DROPDOWN = [
  { value: ROLE.SUPERUSER, label: "SUPERUSER" },
  { value: ROLE.AUTORIZADOR, label: "AUTORIZADOR" },
  { value: ROLE.COMERCIALIZADORA, label: "COMERCIALIZADORA" },
  { value: ROLE.VENDEDOR, label: "VENDEDOR" },
];

export const ROLE_LIST = Object.keys(ROLE);
