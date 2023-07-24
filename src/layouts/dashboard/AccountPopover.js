import { useRef, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
// material
import { alpha } from "@mui/material/styles";
import { Button, Box, Divider, MenuItem, Typography, Avatar, IconButton } from "@mui/material";
import { usePedidoStore, pedidoStoreSelector } from "store/pedidosStore";
import shallow from "zustand/shallow";
// components
import Iconify from "../../components/Iconify";
import MenuPopover from "../../components/MenuPopover";
//
import account from "../../_mocks_/account";

export default function AccountPopover() {
  const { resetStore } = usePedidoStore(pedidoStoreSelector, shallow);
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleLogOut = () => {
    sessionStorage.clear();
    resetStore();
    navigate("/login");
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
            },
          }),
        }}
      >
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 220 }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap>
            {sessionStorage.getItem("name")}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {sessionStorage.getItem("username")}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />
        <MenuItem
          to="/dashboard/change-password"
          component={RouterLink}
          onClick={handleClose}
          sx={{ typography: "body2", py: 1, px: 2.5 }}
        >
          <Iconify
            icon="arcticons:passwordgenerator"
            sx={{
              mr: 2,
              width: 24,
              height: 24,
            }}
          />
          Cambiar contraseña
        </MenuItem>
        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button fullWidth color="inherit" variant="outlined" onClick={handleLogOut}>
            Cerrar sesión
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}
