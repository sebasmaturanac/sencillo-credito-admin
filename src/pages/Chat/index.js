import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import Page from "components/Page";
import shallow from "zustand/shallow";
import { chatStoreSelector, useChatStore } from "./chatStore";
import Chat from "./components/Chat";

export default function ChatPage() {
  const { notifactions } = useChatStore(chatStoreSelector, shallow);

  return (
    <Page title="Clientes | Sencillo Créditos">
      <Container maxWidth="xl">
        <Box sx={{ pb: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h4">Clientes</Typography>
          </Stack>
        </Box>
        <Chat chats={notifactions} />
      </Container>
    </Page>
  );
}
