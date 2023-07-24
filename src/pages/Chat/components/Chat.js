import React from "react";
import PropTypes from "prop-types";
import { Card, CardContent, Grid, styled } from "@mui/material";
import ChatList from "./ChatList";
import ChatDetail from "./ChatDetail";

const CardMain = styled(Card)({
  height: 600,
});

const CardContainer = styled(CardContent)({
  height: "100%",
});

const GridMaxHeight = styled(Grid)({
  height: "100%",
});

const Chat = ({ chats }) => (
  <CardMain>
    <CardContainer>
      <GridMaxHeight container>
        <GridMaxHeight item xs={3}>
          <ChatList chats={chats} />
        </GridMaxHeight>
        <GridMaxHeight item xs={9}>
          <ChatDetail />
        </GridMaxHeight>
      </GridMaxHeight>
    </CardContainer>
  </CardMain>
);

Chat.propTypes = {
  chats: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default Chat;
