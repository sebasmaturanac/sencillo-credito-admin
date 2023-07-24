import { sentenceCase, capitalCase } from "change-case";
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
  Checkbox,
  Chip,
  Badge,
} from "@mui/material";
import Label from "components/Label";
import Scrollbar from "components/Scrollbar";
import { UserListHead, UserListToolbar } from "sections/@dashboard/user";
import { pedidoStoreSelector, usePedidoStore } from "store/pedidosStore";
import { fDate } from "utils/formatTime";
import Page from "components/Page";
import TableLoading from "components/TableLoading";
import { getTableHead } from "sections/@dashboard/user/UserListHead";
import { ESTADOS, ESTADOS_LABEL, ESTADO_COLOR } from "types/estado";
import { subscribeToRevision, subscribeToNuevoPedido, unSubscribeAll } from "socket/socket";
import { useSearchParams } from "react-router-dom";
import { canViewComisiones, isAdmin, isVendedor } from "utils/userRole";
import { COMISION_ESTADO_COLOR } from "types/comision";
import { fCurrency } from "utils/formatNumber";
import FotoDrawer from "./components/FotoDrawer";
import GestionarPedido from "./components/GestionarPedido";
import HabilitarEdicion from "./components/HabilitarEdicion";

const SearchContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  marginTop: theme.spacing(1),
  zIndex: 1,
}));

export default function PedidosPage() {
  const {
    loading,
    pedidosTable,
    currentPage,
    pageSize,
    totalPedidos,
    getPedidos,
    setStringSearch,
    handleRevisionUpdate,
    setPageSize,
    setPage,
    handleToggleCheckbox,
    pagarComisionPorUserId,
    userId,
    clearUserId,
  } = usePedidoStore(pedidoStoreSelector, shallow);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const dni = searchParams.get("dni");
    const userIdParam = searchParams.get("userId");
    subscribeToRevision(handleRevisionUpdate);
    subscribeToNuevoPedido(getPedidos);
    if (dni) {
      setStringSearch(dni);
    } else if (userIdParam) {
      pagarComisionPorUserId(userIdParam);
    } else {
      getPedidos();
    }

    return () => {
      unSubscribeAll();
    };
  }, [searchParams]);

  const handleChangePagination = (e, page) => setPage(e, page - 1);

  const getVendedorName = () => {
    if (!userId) return "";
    if (!pedidosTable.length) return "No hay pedidos";
    const pedido = pedidosTable[0];
    const vendedor = pedido?.creadoPor;
    return vendedor.comercializadora ? vendedor?.comercializadora?.name : vendedor?.name;
  };

  const vendedorName = getVendedorName();

  const handleDeleteUserId = () => clearUserId();

  return (
    <Page title="Pedidos | Sencillo Créditos">
      <Container maxWidth="xl">
        <Box>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h4">
              Pedidos {vendedorName && <Chip label={vendedorName} onDelete={handleDeleteUserId} />}
            </Typography>
          </Stack>
        </Box>
        <Card sx={{ minWidth: 1200 }}>
          <UserListToolbar onFilterName={setStringSearch} />
          <Scrollbar>
            <TableContainer>
              <Table size="small">
                <UserListHead />
                <TableBody>
                  {loading ? (
                    <TableLoading rows={10} columns={getTableHead().length} />
                  ) : (
                    pedidosTable.map((pedido) => (
                      <TableRow hover key={pedido.id} tabIndex={-1}>
                        <TableCell align="left">
                          <Checkbox
                            checked={pedido.checked}
                            onChange={handleToggleCheckbox(pedido.id)}
                          />
                        </TableCell>
                        <TableCell align="left">{pedido?.cliente?.apellido}</TableCell>
                        <TableCell align="left">{pedido?.cliente?.nombre}</TableCell>
                        <TableCell align="left">{pedido?.cliente?.dni}</TableCell>
                        <TableCell align="left">
                          {Boolean(pedido?.entidad?.nombre) && capitalCase(pedido?.entidad?.nombre)}
                        </TableCell>
                        {!isVendedor() && (
                          <TableCell align="left">{pedido?.creadoPor?.name}</TableCell>
                        )}
                        <TableCell align="left">{fDate(pedido?.createdAt)}</TableCell>
                        <TableCell align="left">
                          <Badge
                            badgeContent={
                              pedido?.estado?.estado === ESTADOS.PENDIENTE_DE_MARGEN_OK ? "OK" : 0
                            }
                            color="primary"
                          >
                            <Label variant="ghost" color={ESTADO_COLOR[pedido?.estado?.estado]}>
                              {Boolean(pedido?.estado?.estado) &&
                                ESTADOS_LABEL[pedido?.estado?.estado]}
                            </Label>
                          </Badge>
                        </TableCell>
                        <TableCell align="left">{fCurrency(pedido.montoSolicitado)}</TableCell>
                        {canViewComisiones() && (
                          <TableCell align="center">
                            {pedido?.comision ? (
                              <>
                                {fCurrency(pedido.comision.monto)}
                                {"  "}({pedido.comision.porcentaje}%)
                                <Label
                                  variant="ghost"
                                  color={COMISION_ESTADO_COLOR[pedido?.comision?.estado]}
                                >
                                  {Boolean(pedido?.comision?.estado) &&
                                    sentenceCase(pedido?.comision?.estado)}
                                </Label>
                              </>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                        )}
                        <TableCell align="left">
                          <Box minWidth={100}>
                            <GestionarPedido pedido={pedido} />
                            {isAdmin() && (
                              <>
                                <FotoDrawer pedido={pedido} />
                                <HabilitarEdicion
                                  pedidoId={pedido.id}
                                  estadoCompleto={pedido?.estado}
                                  autorizadorId={pedido?.estado?.autorizador?.id}
                                />
                              </>
                            )}
                          </Box>
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
              count={Math.round(totalPedidos / pageSize)}
              color="primary"
              onChange={handleChangePagination}
              page={currentPage + 1}
            />
          </SearchContainer>
          <TablePagination
            rowsPerPageOptions={[10, 20, 50, 1000]}
            component="div"
            count={totalPedidos}
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
