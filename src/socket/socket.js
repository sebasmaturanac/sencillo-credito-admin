import baseURL from "config/url";
import openSocket from "socket.io-client";

const socket = openSocket(baseURL.replace(".ar/api", ".ar"));

socket.on("connected", () => console.debug("Socket Conectado")); //eslint-disable-line

export const subscribeToRevision = (handleSocketUpdate) => {
  socket.on("revision", handleSocketUpdate);
};

export const subscribeToNuevoPedido = (handleNuevoPedidoUpadate) => {
  socket.on("nuevoPedido", handleNuevoPedidoUpadate);
};

export const unSubscribeAll = () => {
  socket.off();
};
