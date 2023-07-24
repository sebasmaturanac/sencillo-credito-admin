import { styled } from "@mui/material/styles";
import { Toolbar, MenuItem, Select, Box } from "@mui/material";
import React, { useState } from "react";

import { usePedidoStore } from "store/pedidosStore";
import { COMISION_ESTADOS_DROPDOWN } from "types/comision";

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 76,
  display: "flex",
  padding: theme.spacing(0, 1, 0, 3),
}));

export default function EstadoCuentaToolBar() {
  const [estado, setEstado] = useState("");
  const setEstadoStore = usePedidoStore((state) => state.setEstado);

  const handleChangeEstado = (e) => {
    setEstado(e.target.value);
    setEstadoStore(e.target.value);
  };

  return (
    <RootStyle>
      <Box mx={2}>
        <Select
          value={estado}
          size="small"
          onChange={handleChangeEstado}
          defaultValue=""
          displayEmpty
          style={{
            width: 200,
          }}
        >
          {COMISION_ESTADOS_DROPDOWN.map((estadoItem) => (
            <MenuItem value={estadoItem.value} key={estadoItem.value}>
              {estadoItem.label}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </RootStyle>
  );
}
