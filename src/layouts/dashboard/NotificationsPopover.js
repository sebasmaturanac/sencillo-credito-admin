import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { alpha } from "@mui/material/styles";
import { Box, List, Badge, IconButton, Typography, Button } from "@mui/material";
import Iconify from "components/Iconify";
import Scrollbar from "components/Scrollbar";
import MenuPopover from "components/MenuPopover";
import API from "utils/api";
import { toastError } from "utils/toast";
import { isAdmin } from "utils/userRole";
import NotificationItem from "./NotificationItem";
import NotificationPopOver from "./NotificationPopOver";

export default function NotificationsPopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const totalUnRead = notifications.filter((item) => !item.isReaded).length;
  const [isPopOverOpen, setIsPopOverOpen] = useState(false);
  const [notificationSelected, setNotificationSelected] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getMessages = async () => {
      try {
        setLoading(true);
        const { respuesta } = await API.get("/message");
        setNotifications(respuesta);
      } catch (error) {
        toastError(error.message);
      } finally {
        setLoading(false);
      }
    };
    getMessages();
  }, []);

  if (loading) return "Loading...";

  const togglePopOVer = () => setIsPopOverOpen((state) => !state);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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

  const handleNotificationClick = (notification) => () => {
    handleClose();
    togglePopOVer();
    handleNotificationRead(notification);
    setNotificationSelected(notification);
  };

  const handleNewNotification = () => {
    handleClose();
    setNotificationSelected({});
    togglePopOVer();
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        size="large"
        color={open ? "primary" : "default"}
        onClick={handleOpen}
        sx={{
          ...(open && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
          }),
        }}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="eva:bell-fill" width={20} height={20} />
        </Badge>
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 360 }}
      >
        <Box sx={{ display: "flex", alignItems: "center", py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notificaciones</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Tienes {totalUnRead} mensajes sin leer
            </Typography>
          </Box>
        </Box>
        <Scrollbar sx={{ height: { xs: 340, sm: "auto" } }}>
          <List disablePadding>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification?.message?.id}
                notification={notification}
                onItemClick={handleNotificationClick}
              />
            ))}
          </List>
        </Scrollbar>
        {isAdmin() && (
          <Button variant="contained" fullWidth onClick={handleNewNotification}>
            Nuevo mensaje
          </Button>
        )}
      </MenuPopover>

      <NotificationPopOver
        notification={notificationSelected}
        isOpen={isPopOverOpen}
        onClose={togglePopOVer}
      />
    </>
  );
}

NotificationItem.propTypes = {
  // eslint-disable-next-line
  notification: PropTypes.object.isRequired,
};
