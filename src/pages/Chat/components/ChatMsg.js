import React from "react";
import PropTypes from "prop-types";
import cx from "clsx";
import { Typography, Avatar, Grid, Stack } from "@mui/material";
import { withStyles } from "@mui/styles";

import { fDateTime } from "utils/formatTime";
import defaultChatMsgStyles from "./defaultChatMsg.styles";

const ChatMsg = withStyles(defaultChatMsgStyles, { name: "ChatMsg" })((props) => {
  const {
    classes,
    avatar,
    messages,
    side,
    GridContainerProps,
    GridItemProps,
    AvatarProps,
    getTypographyProps,
    time,
    title,
  } = props;
  const attachClass = (index) => {
    if (index === 0) {
      return classes[`${side}First`];
    }
    if (index === messages.length - 1) {
      return classes[`${side}Last`];
    }
    return "";
  };
  return (
    <Grid
      container
      spacing={1}
      justify={side === "right" ? "flex-end" : "flex-start"}
      {...GridContainerProps}
    >
      {side === "left" && (
        <Grid item xs={1} {...GridItemProps}>
          <Avatar
            src={avatar}
            {...AvatarProps}
            className={cx(classes.avatar, AvatarProps.className)}
          />
        </Grid>
      )}
      <Grid item xs={11}>
        {messages.map((msg, i) => {
          const TypographyProps = getTypographyProps(msg, i, props);
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Stack key={msg.id || i}>
              <div className={classes[`${side}Row`]}>
                <Typography
                  align={side}
                  {...TypographyProps}
                  className={cx(
                    classes.msg,
                    classes[side],
                    attachClass(i),
                    TypographyProps.className,
                  )}
                >
                  <Typography
                    variant="caption"
                    className={classes[`${side}Row`]}
                    sx={{ paddingBottom: 1, textDecoration: "underline" }}
                  >
                    {title}
                  </Typography>
                  <br />
                  {msg}
                </Typography>
              </div>
              <Typography
                variant="caption"
                className={classes[`${side}Row`]}
                sx={{ paddingBottom: 1 }}
              >
                {fDateTime(time)}
              </Typography>
            </Stack>
          );
        })}
      </Grid>
      {side === "right" && (
        <Grid item xs={1} {...GridItemProps}>
          <Avatar
            src={avatar}
            {...AvatarProps}
            className={cx(classes.avatar, AvatarProps.className)}
          />
        </Grid>
      )}
    </Grid>
  );
});

ChatMsg.propTypes = {
  avatar: PropTypes.string,
  time: PropTypes.string,
  title: PropTypes.string,
  messages: PropTypes.arrayOf(PropTypes.string),
  side: PropTypes.oneOf(["left", "right"]),
  GridContainerProps: PropTypes.shape({}),
  GridItemProps: PropTypes.shape({}),
  AvatarProps: PropTypes.shape({}),
  getTypographyProps: PropTypes.func,
};
ChatMsg.defaultProps = {
  avatar: "",
  messages: [],
  side: "left",
  GridContainerProps: {},
  GridItemProps: {},
  AvatarProps: {},
  getTypographyProps: () => ({}),
  time: "",
  title: "",
};

export default ChatMsg;
