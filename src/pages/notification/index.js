import { useEffect, useState } from "react";
import {
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
  Grid,
} from "@mui/material";
import Iconify from "components/Iconify";
import Page from "components/Page";
import API from "utils/api";
import EnhancedTableHead from "components/EnhancedTableHead";
import TableLoading from "components/TableLoading";
import Label from "components/Label";
import ChatConversation from "pages/Chat/components/ChatConversation";
import { fToNow } from "utils/formatTime";
import { toastError } from "utils/toast";
import { getComparator, stableSort } from "./tableUtils";
import { RootStyle, SearchStyle } from "./styledComponents";

export const TABLE_HEAD = [
  {
    id: "state",
    label: "",
    align: "left",
    sort: true,
  },
  {
    id: "sender",
    label: "De",
    align: "left",
    sort: true,
  },
  {
    id: "title",
    label: "Titulo",
    align: "left",
    sort: true,
  },
  {
    id: "date",
    label: "Fecha",
    align: "left",
    sort: true,
  },
];

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [chatIdSelected, setChatIdSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [notificationsFiltered, setNotificationFiltered] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const getEntidades = async () => {
      try {
        setLoading(true);
        const { respuesta } = await API.get("/message");
        console.log('respuesta mensajes chat: ', respuesta)
        setNotifications(respuesta);
        setNotificationFiltered(respuesta);
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
    const notificationFiltered = notifications.filter(
      (notification) =>
        notification.senderUser?.name.toLowerCase().includes(param.toLowerCase()) ||
        notification.message?.title.toLowerCase().includes(param.toLowerCase()),
    );
    setNotificationFiltered(notificationFiltered);
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - notificationsFiltered.length) : 0;

  const markNotificationAsRead = (notificationToUpdate) => {
    const notificationsCopy = notifications.map((notification) => ({ ...notification }));
    const newNotification = notificationsCopy.find(
      ({ message }) => message?.id === notificationToUpdate?.message?.id,
    );
    newNotification.isReaded = true;
    setNotifications(notificationsCopy);
  };

  const handleNotificationRead = async (notification) => {
    if (!notification.isReaded) {
      try {
        await API.patch("/message/mark-read", {
          messageId: notification?.message?.id,
          senderUserId: notification?.senderUser?.id,
        });
        markNotificationAsRead(notification);
      } catch (error) {
        toastError(error.message);
      }
    }
  };

  const handleOpenThread = (notification) => () => {
    setChatIdSelected(notification.conversationThread);
    handleNotificationRead(notification);
  };

  return (
    <Page title="Notificaciones | Sencillo Créditos">
      <Container maxWidth="xl">
        <Box>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h4">Notificaciones</Typography>
          </Stack>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Card>
              <RootStyle>
                <SearchStyle
                  style={{ width: " 440px" }}
                  onChange={handleFilter}
                  size="small"
                  placeholder="Busqueda por nombre remitente, o cuerpo mensaje"
                  startAdornment={
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" sx={{ color: "text.disabled" }} />
                    </InputAdornment>
                  }
                />
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
                      stableSort(notificationsFiltered, getComparator(order, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((notificationContent) => (
                          <TableRow
                            hover
                            key={notificationContent?.message.id}
                            tabIndex={-1}
                            onClick={handleOpenThread(notificationContent)}
                            style={{ cursor: "pointer" }}
                          >
                            <TableCell align="left">
                              {!notificationContent.isReaded && (
                                <Label variant="ghost" color="info">
                                  Nuevo
                                </Label>
                              )}
                            </TableCell>
                            <TableCell align="left">
                              {notificationContent?.senderUser?.name}
                            </TableCell>
                            <TableCell align="left">
                              {notificationContent?.message?.title}
                            </TableCell>
                            <TableCell align="left">
                              {fToNow(new Date(notificationContent?.message?.createdAt))}
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
                count={notificationsFiltered.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </Grid>
          <Grid item xs={6}>
            {chatIdSelected && (
              <Card>
                <Box p={2}>
                  <ChatConversation conversationThread={chatIdSelected} />
                </Box>
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
