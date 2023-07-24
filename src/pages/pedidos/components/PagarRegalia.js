import React, { useState } from "react";
import PropTypes from "prop-types";
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

const PagarRegalia = ({ pedido }) => {
  const { updateEstadoDeRegalia } = usePedidoStore(pedidoStoreSelector, shallow);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleDialog = () => setIsDialogOpen((state) => !state);

  const handlePagarRegalia = async () => {
    try {
      setLoading(true);
      const { mensaje } = await API.post(`pedido/regalia/setPagada`, {
        pedidoId: pedido?.id,
      });
      toastSuccess(mensaje);
      updateEstadoDeRegalia(pedido.id);
    } catch (error) {
      toastError(error.mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    !pedido?.regaliaCobrada && (
      <>
        <CardActions
          sx={{
            justifyContent: "flex-end",
          }}
        >
          <LoadingButton loading={loading} onClick={toggleDialog}>
            Pagar regalia
          </LoadingButton>
        </CardActions>
        <Dialog open={isDialogOpen} onClose={toggleDialog} maxWidth="lg">
          <Box>
            <DialogTitle>¡Advertencia!</DialogTitle>
            <DialogContent>
              <DialogContentText>
                ¿Está seguro que desea pagar regalia al vendedor?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus color="inherit" onClick={toggleDialog}>
                cancelar
              </Button>
              <Button onClick={handlePagarRegalia} variant="contained" color="warning">
                Pagar
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </>
    )
  );
};

PagarRegalia.propTypes = {
  pedido: PropTypes.shape({
    id: PropTypes.number,
    regalia: PropTypes.number,
    regaliaCobrada: PropTypes.bool,
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

export default PagarRegalia;
