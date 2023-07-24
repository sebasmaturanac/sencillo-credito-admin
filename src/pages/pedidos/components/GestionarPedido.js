import {
  Tooltip,
  IconButton,
  Typography,
  styled,
  Grid,
  Card,
  Box,
  Alert,
  CardContent,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
} from "@mui/material";
import React, { useState } from "react";
import PropTypes from "prop-types";
import Iconify from "components/Iconify";
import { ESTADOS, ESTADO_COLOR, ESTADOS_LABEL_ALERT } from "types/estado";
import { canViewComisiones, canViewRegalias, isAdmin } from "utils/userRole";
import CardDetail from "./CardDetail";
import { getCliente, getDetalle, getAutorizador, getComision, getRegalia } from "./mapDetalle";
import FormOfertar from "./FormOfertar";
import PagarComision from "./PagarComision";
import ModificarMonto from "./ModificarMonto";
import PagarRegalia from "./PagarRegalia";

const ModalContainer = styled(DialogContent)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  height: 850,
}));

const GestionarPedido = ({ pedido }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currenUserId = parseInt(sessionStorage.getItem("id"), 10);
  const enRevisionPorMi = currenUserId === pedido?.estado?.autorizador?.id;

  const toggleModal = () => setIsModalOpen((state) => !state);

  const handleOpenPedido = () => {
    toggleModal();
  };

  const estadoPedido = pedido?.estado?.estado;

  const pedidoEnRevision = pedido.estado.enRevision;

  return (
    <>
      <Tooltip title="Gestionar pedido">
        <IconButton onClick={handleOpenPedido}>
          <Iconify icon="fluent:text-bullet-list-square-search-20-regular" />
        </IconButton>
      </Tooltip>
      <Dialog open={isModalOpen} onClose={toggleModal} maxWidth="lg" fullWidth>
        <DialogTitle>Pedido detalle</DialogTitle>
        <ModalContainer>
          <Grid container spacing={2} pt={2}>
            <Grid item xs={6}>
              {!(pedidoEnRevision && enRevisionPorMi) && (
                <Box pb={2}>
                  <Alert severity={ESTADO_COLOR[estadoPedido]} variant="filled">
                    <AlertTitle>{ESTADOS_LABEL_ALERT[estadoPedido]}</AlertTitle>
                    Numero: {pedido?.numeroPedido}
                    <br />
                    {pedido?.estado?.autorizador?.name
                      ? `Por: ${pedido?.estado?.autorizador?.name}`
                      : ""}
                  </Alert>
                </Box>
              )}
              <Box>
                <CardDetail title="Cliente" list={getCliente(pedido)} />
              </Box>
              <Box pt={2}>
                <CardDetail title="Detalle" list={getDetalle(pedido)} />
              </Box>
            </Grid>
            <Grid item xs={6}>
              {(estadoPedido === ESTADOS.APROBADO || estadoPedido === ESTADOS.RECHAZADO) && (
                <Box>
                  <CardDetail title="Autorizador" list={getAutorizador(pedido)} />
                </Box>
              )}

              {estadoPedido === ESTADOS.APROBADO && canViewComisiones() && (
                <Box pt={2}>
                  <CardDetail title="Comision" list={getComision(pedido)}>
                    {isAdmin() && <PagarComision pedido={pedido} />}
                  </CardDetail>
                </Box>
              )}

              {estadoPedido === ESTADOS.APROBADO &&
                canViewRegalias() &&
                (pedido?.regalia ? (
                  <Box pt={2}>
                    <CardDetail title="Regalia" list={getRegalia(pedido)}>
                      {isAdmin() && <PagarRegalia pedido={pedido} />}
                    </CardDetail>
                  </Box>
                ) : (
                  <Box mt={2}>
                    <Card>
                      <CardContent>El pedido no tiene regalia</CardContent>
                    </Card>
                  </Box>
                ))}

              {pedidoEnRevision && enRevisionPorMi && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Formulario ofertar
                    </Typography>
                    <FormOfertar idPedido={pedido.id} dniCliente={pedido?.cliente?.dni || ""} />
                  </CardContent>
                </Card>
              )}
              {pedidoEnRevision && enRevisionPorMi && <ModificarMonto idPedido={pedido.id} />}
            </Grid>
          </Grid>
        </ModalContainer>
        <DialogActions>
          <Button onClick={toggleModal} autoFocus>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

GestionarPedido.propTypes = {
  pedido: PropTypes.shape({
    id: PropTypes.number,
    regalia: PropTypes.number,
    numeroPedido: PropTypes.string,
    comision: PropTypes.shape({
      estado: PropTypes.string,
    }),
    cliente: PropTypes.shape({
      dni: PropTypes.string,
    }),
    estado: PropTypes.shape({
      estado: PropTypes.string,
      enRevision: PropTypes.bool,
      autorizador: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default GestionarPedido;
