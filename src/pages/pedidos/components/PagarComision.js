import React, { useState } from "react";
import PropTypes from "prop-types";
import COMISION_ESTADO from "types/comision";
import {
  Box,
  Button,
  CardActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { usePedidoStore, pedidoStoreSelector } from "store/pedidosStore";
import shallow from "zustand/shallow";
import API from "utils/api";
import { toastSuccess, toastError } from "utils/toast";
import { LoadingButton } from "@mui/lab";

const PagarComision = ({ pedido }) => {
  const { updateEstadoDePagoPedido } = usePedidoStore(pedidoStoreSelector, shallow);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleDialog = () => setIsDialogOpen((state) => !state);

  const handlePagarComision = async () => {
    try {
      setLoading(true);
      const { mensaje } = await API.patch(`/pedido/comision/${pedido?.comision?.id}/setPagada`);
      toastSuccess(mensaje);
      updateEstadoDePagoPedido(pedido.id);
    } catch (error) {
      toastError(error.mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    pedido?.comision?.estado === COMISION_ESTADO.NO_COBRADO && (
      <>
        <CardActions
          sx={{
            justifyContent: "flex-end",
          }}
        >
          <LoadingButton loading={loading} onClick={toggleDialog}>
            Pagar comisión
          </LoadingButton>
        </CardActions>
        <Dialog open={isDialogOpen} onClose={toggleDialog} maxWidth="lg">
          <Box>
            <DialogTitle>¡Advertencia!</DialogTitle>
            <DialogContent>
              <DialogContentText>
                ¿Está seguro que desea pagar al vendedor?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus color="inherit" onClick={toggleDialog}>
                cancelar
              </Button>
              <Button onClick={handlePagarComision} variant="contained" color="warning">
                Pagar
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </>
    )
  );
};

PagarComision.propTypes = {
  pedido: PropTypes.shape({
    id: PropTypes.number,
    numeroPedido: PropTypes.string,
    comision: PropTypes.shape({
      id: PropTypes.number,
      estado: PropTypes.string,
    }),
    estado: PropTypes.shape({
      estado: PropTypes.string,
      autorizador: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default PagarComision;
