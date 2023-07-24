import React from "react";
import PropTypes from "prop-types";
import { ListItemButton, ListItemAvatar, Avatar, ListItemText, Typography } from "@mui/material";
import Iconify from "components/Iconify";
import { fToNow } from "utils/formatTime";
import Scrollbar from "components/Scrollbar";

const ChatList = ({ chats }) => (
  <Scrollbar>
    {chats.map((chat) => (
      <ListItemButton disableGutters key={chat.id}>
        <ListItemAvatar>
          <Avatar>
            <img alt="chat-icon" src={chat.avatar} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography variant="subtitle2">
              test
              <Typography component="span" variant="body2" sx={{ color: "text.secondary" }}>
                &nbsp; te mando un mensaje
              </Typography>
            </Typography>
          }
          secondary={
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
              {fToNow(new Date())}
            </Typography>
          }
        />
      </ListItemButton>
    ))}
  </Scrollbar>
);

ChatList.propTypes = {
  chats: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default ChatList;
