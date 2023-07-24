/* eslint-disable */
import React from "react";
import PropTypes from "prop-types";
import ChatConversation from "./ChatConversation";
import { SearchStyle } from "pages/entidades/styledComponents";
import { AppBar, Box, Button, Card, CardContent, Stack, Toolbar, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const ChatDetail = (props) => {
  return (
    <Stack
      sx={{
        height: 1,
      }}
    >
      <Box sx={{ flexGrow: 1, mb: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Kevin Gomez
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <ChatConversation />
      <Box mt={1}>
        <Card
          variant="outlined"
          sx={{
            padding: 1,
          }}
        >
          <Stack direction="row" justifyContent="space-between">
            <SearchStyle size="small" placeholder="Enviar" />
            <Button variant="contained" endIcon={<SendIcon />}>
              Enviar
            </Button>
          </Stack>
        </Card>
      </Box>
    </Stack>
  );
};

ChatDetail.propTypes = {};

export default ChatDetail;
