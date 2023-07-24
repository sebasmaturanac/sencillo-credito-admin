import React from "react";
import PropTypes from "prop-types";
import { Tooltip, IconButton } from "@mui/material";
import Iconify from "components/Iconify";
import API from "utils/api";
import { toastError } from "utils/toast";
import { ESTADOS } from "types/estado";

const HabilitarEdicion = ({ pedidoId, estadoCompleto, autorizadorId }) => {
  const currentUserId = sessionStorage.getItem("id");
  const estaEnRevision = estadoCompleto.enRevision;
  const { estado } = estadoCompleto;
  const personaRevisando = autorizadorId;
  const enRevisionPorMi = estaEnRevision && personaRevisando === parseInt(currentUserId, 10);
  const enRevisionPorOtro = estaEnRevision && !enRevisionPorMi;
  if (estado === ESTADOS.APROBADO || estado === ESTADOS.RECHAZADO || enRevisionPorOtro) return null;

  const handleRevision = async () => {
    try {
      await API.put("/pedido/switchRevision/", {
        pedidoId,
      });
    } catch (error) {
      toastError(error.mensaje);
    }
  };

  return (
    <Tooltip title="Habilitar edición">
      <IconButton onClick={handleRevision}>
        <Iconify icon="bxs:edit" color={enRevisionPorMi ? "red" : "green"} />
      </IconButton>
    </Tooltip>
  );
};

HabilitarEdicion.defaultProps = {
  autorizadorId: 0,
};

HabilitarEdicion.propTypes = {
  pedidoId: PropTypes.number.isRequired,
  autorizadorId: PropTypes.number,
  estadoCompleto: PropTypes.shape({
    estado: PropTypes.string,
    enRevision: PropTypes.bool,
  }).isRequired,
};

export default HabilitarEdicion;
