import { toast } from "react-toastify";

export const toastSuccess = (message) => toast.success(message);

export const toastError = (message) => {
  const mensaje = typeof message === 'string' ? message : "Algo salio mal...";
  toast.error(mensaje, {
    position: toast.POSITION.TOP_CENTER,
  });
};

export const toastWarning = (message) =>
  toast.warning(message, {
    position: toast.POSITION.TOP_CENTER,
  });
