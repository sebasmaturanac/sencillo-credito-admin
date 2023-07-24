// material
import { Box, Grid, Container, Typography } from "@mui/material";
import Page from "components/Page";
import { useEffect, useState } from "react";
import { EstadisticaMontoTotalRangoFecha, EstadisticaTotalPedidos } from "sections/@dashboard/app";
import ChartBarColumn from "sections/@dashboard/app/ChartBarColumn";
import { ROLE } from "types/role";
import API from "utils/api";
import { toastError } from "utils/toast";

// ----------------------------------------------------------------------

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [groupEstados, setGroupEstados] = useState([]);
  const [totalGraphic, setTotalGraphic] = useState([]);
  const [groupEstadosByUser, setGroupEstadosByUser] = useState([]); // only for comercializadoras

  const role = sessionStorage.getItem("role");

  useEffect(() => {
    const getGraphicPoint = (year, month) => {
      const fecha = new Date();
      fecha.setUTCFullYear(year);
      fecha.setUTCMonth(month - 1);
      return fecha;
    };
    const getCards = async () => {
      try {
        setLoading(true);
        const { respuesta } = await API.get("/estadistica");
        setGroupEstados(respuesta[0].groupEstadosTotal);
        const montoAutorizadoTotalByRangeDate = respuesta[0]?.montoAutorizadoTotalByRangeDate.map(
          ({ year, month, total }) => ({ fecha: getGraphicPoint(year, month), total }),
        );
        setTotalGraphic(montoAutorizadoTotalByRangeDate || []);
        setGroupEstadosByUser(respuesta[0].groupEstadosByUser || []);
      } catch (error) {
        toastError(error.message);
      } finally {
        setLoading(false);
      }
    };
    getCards();
  }, []);

  return (
    <Page title="Inicio | Sencillo Créditos">
      {!loading && (
        <Container maxWidth="xl">
          <Box sx={{ pb: 3 }}>
            <Typography variant="h4">¡Hola, bienvenido nuevamente!</Typography>
          </Box>
          <Grid container spacing={3}>
            {!!groupEstados.length &&
              groupEstados.map((card) => (
                <Grid item xs={12} sm={6} md={3} key={card?.estado}>
                  <EstadisticaTotalPedidos estado={card?.estado} total={card?._count} />
                </Grid>
              ))}

            <Grid item xs={12}>
              <EstadisticaMontoTotalRangoFecha data={totalGraphic} />
            </Grid>

            {role === ROLE.COMERCIALIZADORA && (
              <Grid item xs={12}>
                <ChartBarColumn data={groupEstadosByUser} />
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              {/* <AppCurrentVisits /> */}
            </Grid>
          </Grid>
        </Container>
      )}
    </Page>
  );
}
