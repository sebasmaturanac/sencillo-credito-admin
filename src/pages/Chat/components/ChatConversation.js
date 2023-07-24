import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { CircularProgress } from "@mui/material";
import API from "utils/api";
import { toastError } from "utils/toast";
import Scrollbar from "components/Scrollbar";
import ChatMsg from "./ChatMsg";

const ChatConversation = ({ conversationThread }) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const myId = parseInt(sessionStorage.getItem("id"), 10);

  useEffect(() => {
    const getChatHistory = async () => {
      try {
        setLoading(true);
        const { respuesta } = await API.get(`/message/conversationThread/${conversationThread}`);
        setMessages(respuesta);
      } catch (error) {
        toastError(error.mensaje);
      } finally {
        setLoading(false);
      }
    };
    getChatHistory();
  }, [conversationThread]);

  if (loading) return <CircularProgress />;

  return (
    <Scrollbar sx={{ height: 500 }}>
      {messages.map((message) => (
        <ChatMsg
          key={message?.message?.id}
          avatar=""
          side={message?.senderUser?.id === myId ? "right" : "left"}
          messages={[message.message.body]}
          time={message?.message?.createdAt}
          title={message?.message?.title}
        />
      ))}
    </Scrollbar>
  );
};

ChatConversation.propTypes = {
  conversationThread: PropTypes.string.isRequired,
};

export default ChatConversation;
