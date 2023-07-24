import React, { useCallback, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  debounce,
  Divider,
  Grid,
  InputAdornment,
  ListItem,
  ListItemText,
  OutlinedInput,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import Page from "components/Page";
import Iconify from "components/Iconify";
import { toastError, toastSuccess } from "utils/toast";
import SwitchIOS from "components/SwitchIOS";
import API from "utils/api";
import { createSearchParams, useNavigate } from "react-router-dom";

export const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 310,
  transition: theme.transitions.create(["box-shadow", "width"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  "&.Mui-focused": { width: 370, boxShadow: theme.customShadows.z8 },
  "& fieldset": {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));

export default function ClientesPage() {
  const [cliente, setCliente] = useState();
  const [loading, setLoading] = useState(false);
  const [pristine, setPristine] = useState(true);
  const [loadingSwitchPedido, setLoadingSwitchPedido] = useState(false);
  const navigate = useNavigate();

  const fetchUser = async (dni) => {
    try {
      setLoading(true);
      if (pristine) setPristine(false);
      if (dni.length > 6) {
        const { respuesta } = await API.get(`/cliente/search/${dni}`);
        const clienteResponse = respuesta[0].clientes[0];
        setCliente(clienteResponse);
      }
    } catch (error) {
      toastError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeSwitch = (id) => async () => {
    try {
      setLoadingSwitchPedido(true);
      const { mensaje } = await API.post("/cliente/switchAllowNewPedido", {
        id,
      });
      toastSuccess(mensaje);
      const newClienteState = { ...cliente };
      newClienteState.permitirNuevoPedido = !newClienteState.permitirNuevoPedido;
      setCliente(newClienteState);
    } catch (error) {
      toastError(error.message);
    } finally {
      setLoadingSwitchPedido(false);
    }
  };

  const debounceFn = useCallback(debounce(fetchUser, 500), []);

  const getRow = (label, value) => (
    <>
      <ListItem
        secondaryAction={
          <Stack direction="row" alignItems="center">
            <Typography variant="subtitle1" maxWidth={320}>
              {value}
            </Typography>
          </Stack>
        }
      >
        <ListItemText primary={label} />
      </ListItem>
      <Divider />
    </>
  );

  const handleVerPedidos = () => {
    navigate({
      pathname: "/dashboard/pedidos",
      search: `?${createSearchParams({
        dni: cliente.dni,
      })}`,
    });
  };

  return (
    <Page title="Clientes | Sencillo Créditos">
      <Container maxWidth="xl">
        <Box sx={{ pb: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h4">Clientes</Typography>
          </Stack>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <SearchStyle
                  onChange={(event) => debounceFn(event.target.value)}
                  size="small"
                  placeholder="Buscar por Nombre - Apellido - DNI"
                  type="string"
                  startAdornment={
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" sx={{ color: "text.disabled" }} />
                    </InputAdornment>
                  }
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            {!pristine && (
              <Box>
                {loading ? (
                  <CircularProgress />
                ) : !cliente ? (
                  <Card>
                    <CardContent>
                      <Typography textAlign="center" variant="h6">
                        No se encontro usuario con el DNI solicitado.
                      </Typography>
                      <Box
                        component="img"
                        src="/static/illustrations/userNotFound.jpg"
                        sx={{ height: 260, mx: "auto", my: { xs: 5, sm: 10 } }}
                      />
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        Cliente
                      </Typography>
                      {getRow("Nombre", cliente?.nombre)}
                      {getRow("Apellido", cliente?.apellido)}
                      {getRow("DNI", cliente?.dni)}
                      {getRow("Sexo", cliente?.sexo)}
                      {getRow(
                        "Permitir nuevo pedido",
                        <SwitchIOS
                          checked={cliente?.permitirNuevoPedido}
                          color="error"
                          onChange={handleChangeSwitch(cliente?.id)}
                          disabled={loadingSwitchPedido}
                        />,
                      )}
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={handleVerPedidos}>
                        Ver todos los pedidos
                      </Button>
                    </CardActions>
                  </Card>
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
