import { useEffect } from "react";
import shallow from "zustand/shallow";
import {
  Card,
  Table,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Box,
  Stack,
  Pagination,
  styled,
  TableHead,
} from "@mui/material";
// components
import Scrollbar from "components/Scrollbar";
import { estadoCuentaSelector, useEstadoCuentaStore } from "store/estadoCuentaStore";
import { fDate } from "utils/formatTime";
import { fCurrency } from "utils/formatNumber";
import Page from "components/Page";
import TableLoading from "components/TableLoading";
import GestionarPedido from "pages/pedidos/components/GestionarPedido";
import { COMISION_ESTADO_COLOR } from "types/comision";
import Label from "components/Label";
import { sentenceCase } from "change-case";
import Iconify from "components/Iconify";
import EstadoCuentaToolBar from "./EstadoCuentaToolBar";

const SearchContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  marginTop: theme.spacing(1),
  zIndex: 1,
}));

const getTableHead = () => [
  {
    label: "Número pedido",
    alignRight: false,
    show: true,
  },
  {
    label: "Monto",
    alignRight: false,
    show: true,
  },
  {
    label: "Porcentaje",
    alignRight: false,
    show: true,
  },
  {
    label: "Estado",
    alignRight: false,
    show: true,
  },
  {
    label: "Fecha",
    alignRight: false,
    show: true,
  },
  {
    label: "Fecha cobro",
    alignRight: false,
    show: true,
  },
  {
    label: "Ver",
    alignRight: false,
    show: true,
  },
];

const MoneyIcon = () => <Iconify icon="dashicons:money-alt" color="green" fontSize={20} />;

export default function EstadoCuenta() {
  const {
    loading,
    cuentasTable,
    currentPage,
    pageSize,
    totalCuentas,
    getEstadoCuenta,
    setPageSize,
    setPage,
  } = useEstadoCuentaStore(estadoCuentaSelector, shallow);

  useEffect(() => {
    getEstadoCuenta();
  }, []);

  const handleChangePagination = (e, page) => setPage(e, page - 1);

  const mapPedido = (cuenta) => ({
    ...cuenta.pedido,
    comision: {
      ...cuenta,
    },
  });

  return (
    <Page title="Pedidos | Sencillo Créditos">
      <Container maxWidth="xl">
        <Box>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h4">Estado cuenta</Typography>
          </Stack>
        </Box>
        <Card>
          <EstadoCuentaToolBar />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {getTableHead().map(
                      (headCell) =>
                        headCell.show && (
                          <TableCell
                            key={headCell.label}
                            align={headCell.alignRight ? "right" : "left"}
                          >
                            {headCell.label}
                          </TableCell>
                        ),
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableLoading rows={10} columns={getTableHead().length} />
                  ) : (
                    cuentasTable.map((cuenta) => (
                      <TableRow hover key={cuenta.id} tabIndex={-1}>
                        <TableCell align="left">{cuenta.pedido.numeroPedido}</TableCell>
                        <TableCell align="left">
                          <Stack direction="row" alignItems="center">
                            <MoneyIcon />
                            <Typography
                              ml={0.5}
                              variant="subtitle2"
                              maxWidth={320}
                              noWrap
                              sx={{
                                paddingRight: 1,
                              }}
                            >
                              {fCurrency(cuenta?.monto)}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{cuenta?.porcentaje} %</TableCell>
                        <TableCell align="left">
                          <Label variant="ghost" color={COMISION_ESTADO_COLOR[cuenta?.estado]}>
                            {Boolean(cuenta?.estado) && sentenceCase(cuenta?.estado)}
                          </Label>
                        </TableCell>
                        <TableCell align="left">{fDate(cuenta?.createdAt)}</TableCell>
                        <TableCell align="left">
                          {cuenta?.cobradoAt ? fDate(cuenta?.cobradoAt) : "-"}
                        </TableCell>
                        <TableCell align="left">
                          <GestionarPedido pedido={mapPedido(cuenta)} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          <SearchContainer>
            <Pagination
              count={Math.round(totalCuentas / pageSize)}
              color="primary"
              onChange={handleChangePagination}
              page={currentPage + 1}
            />
          </SearchContainer>
          <TablePagination
            rowsPerPageOptions={[10, 20, 50]}
            component="div"
            count={totalCuentas}
            rowsPerPage={pageSize}
            page={currentPage}
            onPageChange={setPage}
            onRowsPerPageChange={setPageSize}
          />
        </Card>
      </Container>
    </Page>
  );
}
