import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Autocomplete,
  Stack,
  Box,
} from "@mui/material";
import { useFormik, FormikProvider, Form } from "formik";
import { toastSuccess, toastError } from "utils/toast";
import { LoadingButton } from "@mui/lab";
import API from "utils/api";
import { isAdmin } from "utils/userRole";
import ChatConversation from "pages/Chat/components/ChatConversation";

const NotificationPopOver = ({ isOpen, onClose, notification }) => {
  const [users, setUsers] = useState([]);
  const [userList, setUserList] = useState([]);
  const isNewNotification = !notification?.conversationThread;

  useEffect(() => {
    const getUsers = async () => {
      try {
        const { respuesta } = await API.get("/user");
        setUsers(respuesta);
        setUserList(respuesta);
      } catch (error) {
        toastError(error.mensaje);
      }
    };
    if (isAdmin()) {
      getUsers();
    }
  }, [isAdmin]);

  const onSubmit = async ({ title, body, destinationIds }, { resetForm }) => {
    try {
      const { mensaje } = await API.post("/message", {
        title,
        body,
        destinationIds: destinationIds.map(({ id }) => id),
        conversationThread: !isNewNotification ? notification?.conversationThread : "",
      });
      toastSuccess(mensaje);
      resetForm();
      onClose();
    } catch (error) {
      toastError(error.mensaje);
    }
  };

  const newNotificactionSchema = Yup.object().shape({
    destinationIds: Yup.array().min(1, "Selecciones al menos un destinatario"),
    title: Yup.string().required("El titulo del mensaje es requerido."),
    body: Yup.string().required("El cuerpo del mensaje es requerido."),
  });

  const formik = useFormik({
    initialValues: {
      destinationIds: [],
      body: "",
      title: "",
    },
    validationSchema: newNotificactionSchema,
    onSubmit,
  });

  const { errors, handleSubmit, isSubmitting, getFieldProps, submitForm, setFieldValue } = formik;

  useEffect(() => {
    if (notification?.conversationThread) {
      const destinationUser = [notification?.senderUser];
      setUserList(destinationUser);
      setFieldValue("destinationIds", destinationUser);
    } else {
      setUserList(users);
      setFieldValue("destinationIds", []);
    }
  }, [notification?.conversationThread]);

  const autocompleteValue = !isNewNotification ? { value: userList } : {};

  const dialogSize = isNewNotification ? "sm" : "lg";

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth={dialogSize}>
      <DialogTitle>{isNewNotification ? "Nueva notificación" : "Responder:"}</DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={2}>
          {!isNewNotification && (
            <ChatConversation conversationThread={notification?.conversationThread} />
          )}
          <Box flex={1}>
            <FormikProvider value={formik}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Autocomplete
                  onChange={(_, value) => setFieldValue("destinationIds", value)}
                  multiple
                  id="tags-standard"
                  options={userList}
                  getOptionLabel={(option) => option.name}
                  readOnly={!isNewNotification}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Destinatorio"
                      error={Boolean(errors.destinationIds)}
                      helperText={errors.destinationIds}
                    />
                  )}
                  {...autocompleteValue}
                />
                <TextField
                  autoFocus
                  fullWidth
                  margin="dense"
                  label="Titilo"
                  variant="standard"
                  error={Boolean(errors.title)}
                  helperText={errors.title}
                  {...getFieldProps("title")}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  margin="dense"
                  label="Mensaje"
                  variant="standard"
                  error={Boolean(errors.body)}
                  helperText={errors.body}
                  {...getFieldProps("body")}
                />
              </Form>
            </FormikProvider>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <LoadingButton variant="contained" loading={isSubmitting} onClick={submitForm}>
          Enviar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

NotificationPopOver.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  notification: PropTypes.shape({
    conversationThread: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    avatar: PropTypes.string,
    createdAt: PropTypes.instanceOf(Date),
    isReaded: PropTypes.bool,
    senderUser: PropTypes.shape({
      id: PropTypes.number,
    }),
  }).isRequired,
};

export default NotificationPopOver;
