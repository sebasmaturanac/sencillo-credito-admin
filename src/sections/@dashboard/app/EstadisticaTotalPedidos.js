import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { Card, colors, Typography } from "@mui/material";
import Iconify from "components/Iconify";
import { ESTADOS } from "types/estado";

const RootStyle = styled(Card)(({ theme, ...otherProps }) => ({
  boxShadow: "none",
  textAlign: "center",
  padding: theme.spacing(5, 0), // @ts-ignore
  color: otherProps.colordarker, // @ts-ignore
  backgroundColor: otherProps.colorlighter,
}));

const IconWrapperStyle = styled("div")(({ theme }) => ({
  margin: "auto",
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: "center",
  marginBottom: theme.spacing(3),
}));

export default function EstadisticaTotalPedidos({ estado, total }) {
  const icon = {
    [ESTADOS.APROBADO]: "akar-icons:circle-check-fill",
    [ESTADOS.RECHAZADO]: "akar-icons:circle-x-fill",
    [ESTADOS.PENDIENTE]: "ic:outline-pending-actions",
    [ESTADOS.PENDIENTE_DE_MARGEN]: "ic:outline-pending-actions",
    [ESTADOS.PENDIENTE_DE_MARGEN_OK]: "ic:outline-pending-actions",
  };
  const colorDarker = {
    [ESTADOS.APROBADO]: colors.green[900],
    [ESTADOS.RECHAZADO]: colors.red[900],
    [ESTADOS.PENDIENTE]: colors.orange[900],
    [ESTADOS.PENDIENTE_DE_MARGEN]: colors.orange[900],
    [ESTADOS.PENDIENTE_DE_MARGEN_OK]: colors.orange[900],
  };

  const colorLighter = {
    [ESTADOS.APROBADO]: colors.lightGreen[300],
    [ESTADOS.RECHAZADO]: colors.red[200],
    [ESTADOS.PENDIENTE]: colors.orange[200],
    [ESTADOS.PENDIENTE_DE_MARGEN]: colors.orange[200],
    [ESTADOS.PENDIENTE_DE_MARGEN_OK]: colors.orange[200],
  };

  const label = {
    [ESTADOS.APROBADO]: "aprobados",
    [ESTADOS.RECHAZADO]: "rechazados",
    [ESTADOS.PENDIENTE]: "pendientes",
    [ESTADOS.PENDIENTE_DE_MARGEN]: "pendientes margen",
    [ESTADOS.PENDIENTE_DE_MARGEN_OK]: "pendientes margen",
  };

  return (
    // @ts-ignore
    <RootStyle colordarker={colorDarker[estado]} colorlighter={colorLighter[estado]}>
      <IconWrapperStyle>
        <Iconify icon={icon[estado]} width={50} height={50} />
      </IconWrapperStyle>
      <Typography variant="h3">{total}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Total pedidos {label[estado]}
      </Typography>
    </RootStyle>
  );
}

EstadisticaTotalPedidos.propTypes = {
  estado: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
};
