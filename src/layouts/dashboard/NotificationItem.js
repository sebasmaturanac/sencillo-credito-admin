import React from "react";
import PropTypes from "prop-types";
import {
  Typography,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";
import { noCase } from "change-case";
import Iconify from "components/Iconify";
import { fToNow } from "utils/formatTime";

const NotificationItem = ({ notification, onItemClick }) => {
  function renderContent(notificationContent) {
    const title = (
      <>
        <Typography variant="subtitle2">{notificationContent?.message?.title}</Typography>
        <Typography
          component="p"
          variant="body2"
          sx={{
            color: "text.secondary",
            display: "-webkit-box",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: "1.625",
          }}
        >
          {Boolean(notificationContent?.message?.body) && noCase(notificationContent?.message?.body)}
        </Typography>
      </>
    );

    return {
      avatar: <img alt={notificationContent.title} src="/static/icons/ic_notification_chat.svg" />,
      title,
    };
  }

  const { avatar, title } = renderContent(notification);

  return (
    <ListItemButton
      disableGutters
      onClick={onItemClick(notification)}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: "1px",
        ...(!notification.isReaded && {
          bgcolor: "action.selected",
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: "background.neutral" }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <>
            <Typography component="span" variant="caption" sx={{ color: "text.secondary" }}>
              <Iconify icon="ep:user-filled" sx={{ mr: 0.5, width: 16, height: 16 }} />
              Por: {notification?.senderUser?.name}
            </Typography>
            <br />
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                display: "flex",
                alignItems: "center",
                color: "text.disabled",
              }}
            >
              <Iconify icon="eva:clock-fill" sx={{ mr: 0.5, width: 16, height: 16 }} />
              {fToNow(new Date(notification?.message?.createdAt))}
            </Typography>
          </>
        }
      />
    </ListItemButton>
  );
};

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    message: PropTypes.shape({
      title: PropTypes.string,
      body: PropTypes.string,
      type: PropTypes.string,
      avatar: PropTypes.string,
      createdAt: PropTypes.instanceOf(Date),
    }),
    isReaded: PropTypes.bool,
    senderUser: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number,
    }),
  }).isRequired,
  onItemClick: PropTypes.func.isRequired,
};

export default NotificationItem;
