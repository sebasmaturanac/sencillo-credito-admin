import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import {
  Toolbar,
  OutlinedInput,
  InputAdornment,
  MenuItem,
  Select,
  Box,
  Tooltip,
  Typography,
  tooltipClasses,
} from "@mui/material";
import debounce from "lodash/debounce";
import React, { useCallback, useState } from "react";

import { usePedidoStore } from "store/pedidosStore";
import Iconify from "components/Iconify";
import { ESTADOS_DROPDOWN } from "types/estado";
import IngeitDateRangePicker from "components/IngeitDateRangePicker";
import API from "utils/api";
import { LoadingButton } from "@mui/lab";
import { COMISION_ESTADOS_DROPDOWN } from "types/comision";
import { toastError, toastSuccess, toastWarning } from "utils/toast";

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 76,
  display: "flex",
  padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(["box-shadow", "width"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  "&.Mui-focused": { width: 320, boxShadow: theme.customShadows.z8 },
  "& fieldset": {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));

const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 600,
  },
});

export default function UserListToolbar({ onFilterName }) {
  const comision = usePedidoStore((state) => state.comision);
  const estado = usePedidoStore((state) => state.estado);
  const getFilterParams = usePedidoStore((state) => state.getFilterParams);
  const setComision = usePedidoStore((state) => state.setComision);
  const [isLoadingExport, setIsLoadingExport] = useState(false);
  const [isLoadingPagandoComision, setIsLoadingPagandoComision] = useState(false);
  const setEstado = usePedidoStore((state) => state.setEstado);
  const getPedidos = usePedidoStore((state) => state.getPedidos);
  const pedidos = usePedidoStore((state) => state.pedidos);
  const debounceFn = useCallback(debounce(onFilterName, 500), []);

  const handleChangeEstado = (e) => {
    setEstado(e.target.value);
  };

  const handleChangeComision = (e) => {
    setComision(e.target.value);
  };

  const handleClickExportar = async () => {
    setIsLoadingExport(true);
    try {
      const params = getFilterParams();
      const response = await API.get("/pedido/exportarExcel", {
        responseType: "blob",
        params,
      });
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "file.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      toastError(error.message);
    } finally {
      setIsLoadingExport(false);
    }
  };

  const handlePagarComision = async () => {
    try {
      const pedidosSeleccionados = pedidos.filter((pedido) => pedido.checked);
      const canPayPedidos = pedidosSeleccionados.some(
        (pedido) => pedido?.comision?.estado !== "NO_COBRADO",
      );
      if (canPayPedidos) {
        toastWarning("Por favor solo selecciones pedidos NO cobrados aun");
      } else {
        setIsLoadingPagandoComision(true);
        const comisionesId = pedidosSeleccionados.map((pedido) => pedido.comision.id);
        const { mensaje } = await API.post("/pedido/comision/setPagadas", { comisionesId });
        toastSuccess(mensaje);
        getPedidos();
      }
    } catch (error) {
      toastError(error.message);
    } finally {
      setIsLoadingPagandoComision(false);
    }
  };

  const pedidosSelected = pedidos.some((pedido) => pedido.checked);

  return (
    <RootStyle>
      <SearchStyle
        onChange={(event) => debounceFn(event.target.value)}
        placeholder="Buscar pedido"
        size="small"
        startAdornment={
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: "text.disabled" }} />
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CustomWidthTooltip
                title={
                  <Typography variant="body2">
                    El parámetro ingresado aquí filtrará todos los pedidos por:
                    <ul>
                      <li>Número de tramite</li>
                      <li>Nombre o Apellido o DNI del cliente</li>
                      <li>Banco o Institución</li>
                      <li>Nombre del Vendedor o Comercializadora</li>
                    </ul>
                  </Typography>
                }
              >
                <Box
                  sx={{
                    marginLeft: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Iconify icon="bi:question-circle" />
                </Box>
              </CustomWidthTooltip>
            </Box>
          </InputAdornment>
        }
      />
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
          {ESTADOS_DROPDOWN.map((estadoItem) => (
            <MenuItem value={estadoItem.value} key={estadoItem.value}>
              {estadoItem.label}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box mx={2}>
        <Select
          value={comision}
          size="small"
          onChange={handleChangeComision}
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
      <IngeitDateRangePicker />
      <LoadingButton
        sx={{
          marginLeft: 2,
        }}
        startIcon={<Iconify icon="vscode-icons:file-type-excel" />}
        variant="contained"
        color="success"
        loading={isLoadingExport}
        onClick={handleClickExportar}
      >
        Exportar
      </LoadingButton>
      <LoadingButton
        sx={{
          marginLeft: 2,
        }}
        startIcon={<Iconify icon="emojione:money-with-wings" />}
        variant="contained"
        color="success"
        loading={isLoadingPagandoComision}
        onClick={handlePagarComision}
        disabled={!pedidosSelected}
      >
        Pagar comision
      </LoadingButton>
    </RootStyle>
  );
}

UserListToolbar.propTypes = {
  onFilterName: PropTypes.func.isRequired,
};
