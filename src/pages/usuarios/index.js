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
  IconButton,
  Tooltip,
} from "@mui/material";
import { createSearchParams, useNavigate } from "react-router-dom";
import Iconify from "components/Iconify";
import Page from "components/Page";
import { fDate, fMinimal } from "utils/formatTime";
import API from "utils/api";
import TableLoading from "components/TableLoading";
import SwitchIOS from "components/SwitchIOS";
import { toastError, toastSuccess } from "utils/toast";
import Label from "components/Label";
import { fPercent } from "utils/formatNumber";
import EnhancedTableHead from "components/EnhancedTableHead";
import { ROLE } from "types/role";

import ResetPasswordDialog from "./ResetPasswordDialog";
import { getComparator, stableSort } from "./tableUtils";
import { RootStyle, SearchStyle } from "./styledComponents";
import CreateUserDialog from "./CreateUserDialog";

export const TABLE_HEAD = [
  {
    id: "role",
    label: "Rol",
    align: "left",
    sort: false,
    tooltip: {
      text: "Las celdas coloreadas con rojo indican que el usuario está suspendido. Esta acción puede revertirse desde el interruptor de la derecha en la columna 'ACCIONES'",
      icon: "bi:question-circle",
    },
  },
  {
    id: "name",
    label: "Nombre",
    align: "left",
    sort: true,
  },
  {
    id: "usuario",
    label: "Usuario",
    align: "left",
    sort: true,
  },
  {
    id: "comercializadora",
    label: "Pertenece a comercializadora",
    align: "left",
    sort: true,
  },
  {
    id: "comision",
    label: "Comisión de venta",
    align: "left",
    sort: true,
  },
  {
    id: "createdAt",
    label: "Fecha creación",
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
      text: "El interruptor permite HABILITAR o SUSPENDER a los usuarios. Aquellos usuarios suspendidos no podran acceder a la aplicación móvil ni a este panel administrador",
    },
  },
];

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuariosFiltered, setUsuariosFiltered] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isActionsLoading, setIsActionsLoading] = useState(false);
  const [openResetPasswordDialog, setOpenResetPasswordDialog] = useState(false);
  const [userToResetPassword, setUserToResetPassword] = useState({});
  const [openCreateUserDialog, setOpenCreateUserDialog] = useState(false);
  const [userToEdit, setUserToEdit] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const getUsuarios = async () => {
      try {
        setLoading(true);
        const { respuesta } = await API.get("/user");
        setUsuarios(respuesta);
        setUsuariosFiltered(respuesta);
      } catch (error) {
        toastError(error.message);
      } finally {
        setLoading(false);
      }
    };
    setTimeout(() => {
      getUsuarios();
    }, 1000);
  }, []);

  const handleRequestSort = (event, property) => {
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
    const newArrayUsers = usuarios.filter(
      (usuario) =>
        usuario.name.toLowerCase().includes(param.toLowerCase()) ||
        usuario.username.toLowerCase().includes(param.toLowerCase()) ||
        usuario.comercializadora?.name?.toLowerCase().includes(param.toLowerCase()) ||
        usuario.role.toLowerCase().includes(param.toLowerCase()),
    );
    setUsuariosFiltered(newArrayUsers);
    setPage(0);
  };

  const handleChangeSwitch = async (id) => {
    try {
      setIsActionsLoading(true);
      const { respuesta, mensaje } = await API.patch(`/auth/switch-suspended/${id}`);
      const newUsuarios = [...usuariosFiltered];
      // eslint-disable-next-line
      for (const userToUpdate of respuesta) {
        const index = usuariosFiltered.findIndex((usuario) => usuario.id === userToUpdate.id);
        newUsuarios[index] = {
          ...newUsuarios[index],
          suspended: userToUpdate.suspended,
          suspendedAt: userToUpdate.suspendedAt,
        };
      }
      setUsuariosFiltered(newUsuarios);
      toastSuccess(mensaje);
    } catch (error) {
      toastError(error.mensaje);
      console.error("error: ", error);
    } finally {
      setIsActionsLoading(false);
    }
  };

  const toggleResetPasswordDialog = () => setOpenResetPasswordDialog((state) => !state);

  const handleResetUserPassword = (user) => {
    setUserToResetPassword(user);
    toggleResetPasswordDialog();
  };

  const handleResetPassword = () => async () => {
    try {
      setIsActionsLoading(true);
      const { mensaje } = await API.patch(`/auth/reset-password/${userToResetPassword?.id}`);
      toastSuccess(mensaje);
    } catch (error) {
      toastError(error.mensaje);
    } finally {
      toggleResetPasswordDialog();
      setUserToResetPassword({});
      setIsActionsLoading(false);
    }
  };

  const handleSubmitUser = (data) => {
    if (data?.id) {
      setPage(0);
      const userEdited = usuarios.findIndex((user) => user.id === data.id);
      const users = [...usuarios];
      if (userEdited !== -1) {
        users[userEdited] = data;
        setUsuarios(users);
        setUsuariosFiltered(users);
      } else {
        setUsuarios([data,...users]);
        setUsuariosFiltered([data,...users]);
      }
    }
    setUserToEdit({});
    setOpenCreateUserDialog((prev) => !prev);
  };

  const handleEditUser = (user) => {
    setUserToEdit(user);
    setOpenCreateUserDialog((prev) => !prev);
  };

  const handlePagarComision = (user) => () => {
    navigate({
      pathname: "/dashboard/pedidos",
      search: `?${createSearchParams({
        userId: user.id,
      })}`,
    });
  };

  const userCanSeePagarComisiones = (user) => {
    // eslint-disable-next-line
    if (!user.comercializadora && user.role === ROLE.VENDEDOR) return true; //VENDEDOR INDEPENDIENTE
    if (user.role === ROLE.COMERCIALIZADORA) return true;
    return false;
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - usuariosFiltered.length) : 0;

  return (
    <Page title="Usuarios | Sencillo Créditos">
      <Container maxWidth="xl">
        <Box>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h4">Usuarios</Typography>
          </Stack>
        </Box>
        <Card>
          <RootStyle>
            <SearchStyle
              onChange={handleFilter}
              size="small"
              placeholder="Busqueda por Nombre - Usuario - Rol"
              startAdornment={
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: "text.disabled" }} />
                </InputAdornment>
              }
            />
            <Button
              variant="contained"
              onClick={() => setOpenCreateUserDialog((prev) => !prev)}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Nuevo usuario
            </Button>
          </RootStyle>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} size="small">
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
                  stableSort(usuariosFiltered, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((usuario) => (
                      <TableRow hover key={usuario?.name} tabIndex={-1}>
                        <TableCell align="left" width={180}>
                          <Label variant="ghost" color={usuario?.suspended ? "error" : "success"}>
                            {usuario?.role}
                          </Label>
                        </TableCell>
                        <TableCell align="left" width={200}>
                          {usuario?.name}
                        </TableCell>
                        <TableCell align="left" width={180}>
                          {usuario?.username}
                        </TableCell>
                        <TableCell align="left" width={200}>
                          {usuario?.comercializadora?.name || (
                            <Typography variant="caption" sx={{ fontStyle: "italic" }}>
                              Sin comercializadora
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="left" width={180}>
                          {usuario?.comision?.porcentaje ? (
                            fPercent(usuario?.comision?.porcentaje)
                          ) : (
                            <Typography variant="caption" sx={{ fontStyle: "italic" }}>
                              No corresponde
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="left" width={150}>
                          {fDate(usuario?.createdAt)}
                        </TableCell>
                        <TableCell align="left" width={250}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Tooltip title="Editar">
                              <IconButton onClick={() => handleEditUser(usuario)}>
                                <Iconify icon="bxs:edit" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Resetear contraseña">
                              <IconButton onClick={() => handleResetUserPassword(usuario)}>
                                <Iconify icon="fluent:key-reset-20-regular" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={usuario?.suspended ? "Habilitar" : "Suspender"}>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <SwitchIOS
                                  checked={usuario?.suspended}
                                  color="error"
                                  onChange={() => handleChangeSwitch(usuario?.id)}
                                  disabled={isActionsLoading}
                                />
                                <Typography variant="caption" sx={{ ml: 1 }}>
                                  {!!usuario?.suspendedAt && fMinimal(usuario?.suspendedAt)}
                                </Typography>
                              </Box>
                            </Tooltip>
                            {userCanSeePagarComisiones(usuario) && (
                              <Tooltip title="Pagar comision">
                                <IconButton onClick={handlePagarComision(usuario)}>
                                  <Iconify icon="emojione:money-with-wings" />
                                </IconButton>
                              </Tooltip>
                            )}
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
            count={usuariosFiltered.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      <ResetPasswordDialog
        open={openResetPasswordDialog}
        onClose={toggleResetPasswordDialog}
        user={userToResetPassword}
        onResetPassword={handleResetPassword}
      />
      <CreateUserDialog open={openCreateUserDialog} onClose={handleSubmitUser} user={userToEdit} />
    </Page>
  );
}
