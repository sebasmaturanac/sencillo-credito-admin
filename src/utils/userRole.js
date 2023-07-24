const { ROLE } = require("types/role");

export const isAdmin = () => {
  const role = sessionStorage.getItem("role");
  return role === ROLE.AUTORIZADOR || role === ROLE.SUPERUSER;
};

export const isSuperUser = () => {
  const role = sessionStorage.getItem("role");
  return role === ROLE.SUPERUSER;
};

export const isComercializadora = () => {
  const role = sessionStorage.getItem("role");
  return role === ROLE.COMERCIALIZADORA;
};

export const isVendedor = () => {
  const role = sessionStorage.getItem("role");
  return role === ROLE.VENDEDOR;
};

export const isVendedorIndenpendiente = () => {
  const comercializadoraId = JSON.parse(sessionStorage.getItem("comercializadoraId"));
  return !comercializadoraId;
};

export const canViewComisiones = () => isAdmin() || isVendedorIndenpendiente();

export const canViewRegalias = () => canViewComisiones();

export const canViewEstadoCuenta = () => {
  if (isAdmin()) return false;
  return isComercializadora() || isVendedorIndenpendiente();
};
