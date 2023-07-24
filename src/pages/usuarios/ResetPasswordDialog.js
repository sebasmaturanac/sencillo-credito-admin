import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
} from "@mui/material";
import React from "react";
import Iconify from "components/Iconify";

function ResetPasswordDialog({ open, onClose, user, onResetPassword }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box>
        <DialogTitle id="alert-dialog-title">¡Advertencia!</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Está seguro que desea resetear la contraseña al usuario <b>{user.name}</b>? <br /> Esta
            acción es irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus color="inherit" onClick={onClose}>
            cancelar
          </Button>
          <Button
            onClick={onResetPassword(user)}
            variant="contained"
            color="warning"
            startIcon={<Iconify icon="carbon:password" />}
          >
            Resetear contraseña
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

ResetPasswordDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onResetPassword: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
};

export default ResetPasswordDialog;
