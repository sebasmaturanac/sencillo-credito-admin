import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Container,
  Stack,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
  InputAdornment,
  Tooltip,
  IconButton,
} from "@mui/material";
import Iconify from "components/Iconify";
import Page from "components/Page";
import { fMinimal } from "utils/formatTime";
import API from "utils/api";
import EnhancedTableHead from "components/EnhancedTableHead";
import TableLoading from "components/TableLoading";
import SwitchIOS from "components/SwitchIOS";
import { toastError, toastSuccess } from "utils/toast";
import Label from "components/Label";
import { getComparator, stableSort } from "./tableUtils";
import { RootStyle, SearchStyle } from "./styledComponents";
import CreateEntidadDialog from "./CreateEntidadDialog";

export const TABLE_HEAD = [
  {
    id: "status",
    label: "Estado",
    align: "left",
    sort: false,
    tooltip: {
      icon: "bi:question-circle",
      text: "Las entidades deshabilitadas no podrán ser utilizadas por ningún vendedor al momento de realizar un pedido",
    },
  },
  {
    id: "nombre",
    label: "Nombre",
    align: "left",
    sort: true,
  },
  {
    id: "tipo",
    label: "Tipo",
    align: "left",
    sort: true,
  },
  {
    id: "actions",
    label: "Acciones",
    align: "left",
    sort: false,
    tooltip: {
      icon: "bi:question-circle",
      text: "El interruptor permite HABILITAR o DESHABILITAR a las entidades",
    },
  },
];

export default function EntidadesPage() {
  const [entidades, setEntidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entidadesFiltered, setEntidadesFiltered] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isActionsLoading, setIsActionsLoading] = useState(false);
  const [openCreateEntidadDialog, setOpenCreateEntidadDialog] = useState(false);
  const [entidadToEdit, setEntidadToEdit] = useState({});

  useEffect(() => {
    const getEntidades = async () => {
      try {
        setLoading(true);
        const { respuesta } = await API.get("/providers/entidades?include_deleted=true");
        setEntidades(respuesta);
        setEntidadesFiltered(respuesta);
      } catch (error) {
        console.error("error: ", error);
      } finally {
        setLoading(false);
      }
    };
    setTimeout(() => {
      getEntidades();
    }, 1000);
  }, []);

  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilter = (e) => {
    const param = e.target.value;
    const newEntidades = entidades.filter(
      (entidad) =>
        entidad.tipo.toLowerCase().includes(param.toLowerCase()) ||
        entidad.nombre.toLowerCase().includes(param.toLowerCase()),
    );
    setEntidadesFiltered(newEntidades);
    setPage(0);
  };

  const handleChangeSwitch = async (id) => {
    try {
      setIsActionsLoading(true);
      const { respuesta, mensaje } = await API.delete(`/providers/entidad/${id}`);
      const newEntidades = [...entidadesFiltered];
      // eslint-disable-next-line
      const index = entidadesFiltered.findIndex((entidad) => entidad.id === respuesta[0].id);
      newEntidades[index] = {
        ...newEntidades[index],
        deleted: respuesta[0].deleted,
        deletedAt: respuesta[0].deletedAt,
      };
      setEntidadesFiltered(newEntidades);
      toastSuccess(mensaje);
    } catch (error) {
      toastError(error.mensaje);
      console.error("error: ", error);
    } finally {
      setIsActionsLoading(false);
    }
  };

  const handleSubmitEntidad = (data) => {
    if (data?.id) {
      setPage(0);
      setEntidades([data, ...entidades]);
      setEntidadesFiltered([data, ...entidades]);
    }
    setEntidadToEdit({});
    setOpenCreateEntidadDialog((prev) => !prev);
  };

  const handleEditEntidad = (entidad) => {
    setEntidadToEdit(entidad);
    setOpenCreateEntidadDialog((prev) => !prev);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - entidadesFiltered.length) : 0;

  return (
    <Page title="Bancos e Instituciones | Sencillo Créditos">
      <Container maxWidth="xl">
        <Box>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h4">Bancos e Instituciones</Typography>
          </Stack>
        </Box>
        <Card>
          <RootStyle>
            <SearchStyle
              onChange={handleFilter}
              size="small"
              placeholder="Busqueda por Nombre - Tipo"
              startAdornment={
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: "text.disabled" }} />
                </InputAdornment>
              }
            />
            <Button
              variant="contained"
              onClick={() => setOpenCreateEntidadDialog((prev) => !prev)}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Nueva entidad
            </Button>
          </RootStyle>
          <TableContainer>
            <Table sx={{ minWidth: 350 }} size="small">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                headCells={TABLE_HEAD}
              />
              <TableBody>
                {loading ? (
                  <TableLoading rows={rowsPerPage} columns={TABLE_HEAD.length} />
                ) : (
                  stableSort(entidadesFiltered, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((entidad) => (
                      <TableRow hover key={entidad?.id} tabIndex={-1}>
                        <TableCell align="left" width={130}>
                          <Label variant="ghost" color={entidad?.deleted ? "error" : "default"}>
                            {entidad?.deleted ? "Deshabilitada" : "Habilitada"}
                          </Label>
                        </TableCell>
                        <TableCell align="left">{entidad?.nombre}</TableCell>
                        <TableCell align="left" width={200}>
                          {entidad?.tipo}
                        </TableCell>
                        <TableCell align="left" width={200}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Tooltip title="Editar">
                              <IconButton onClick={() => handleEditEntidad(entidad)}>
                                <Iconify icon="bxs:edit" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={entidad?.deleted ? "Habilitar" : "Deshabilitar"}>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <SwitchIOS
                                  checked={entidad?.deleted}
                                  color="error"
                                  onChange={() => handleChangeSwitch(entidad?.id)}
                                  disabled={isActionsLoading}
                                />
                                <Typography variant="caption" sx={{ ml: 1 }}>
                                  {!!entidad?.deletedAt && fMinimal(entidad?.deletedAt)}
                                </Typography>
                              </Box>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                )}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            component="div"
            count={entidadesFiltered.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      <CreateEntidadDialog
        open={openCreateEntidadDialog}
        onClose={handleSubmitEntidad}
        entidad={entidadToEdit}
      />
    </Page>
  );
}
