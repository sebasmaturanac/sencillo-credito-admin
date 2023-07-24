import { capitalCase } from "change-case";
import Iconify from "components/Iconify";
import { ESTADOS } from "types/estado";
import { fCurrency } from "utils/formatNumber";
import { fDate } from "utils/formatTime";

const MoneyIcon = () => <Iconify icon="dashicons:money-alt" color="green" fontSize={20} />;

export const getCliente = (pedido) => [
  { label: "Nombre", value: pedido?.cliente?.nombre },
  { label: "Apellido", value: pedido?.cliente?.apellido },
  { label: "DNI", value: pedido?.cliente?.dni },
  { label: "Sexo", value: pedido?.cliente?.sexo },
];

export const getDetalle = (pedido) => [
  { label: "Vendedor", value: pedido?.creadoPor?.name },
  {
    label: "Comercializadora",
    value: pedido?.creadoPor?.comercializadora?.name,
    alternativeText: "Sin comercializadora",
  },
  { label: "Tipo de entidad", value: pedido?.entidad?.tipo },
  { label: "Nombre de entidad", value: pedido?.entidad?.nombre },
  { label: "Tipo de consulta", value: pedido?.tipoConsulta?.nombre },
  {
    label: "Monto solicitado",
    value: fCurrency(pedido?.montoSolicitado),
    icon: <MoneyIcon />,
  },
  {
    label: "Comentario vendedor",
    value: pedido?.comentarioVendedor,
    alternativeText: "Sin comentario",
  },
  {
    label: "Comentario autorizador",
    value: pedido?.estado?.comentario,
    alternativeText: "Sin comentario",
  },
  {
    label: "Fecha",
    value: `${pedido?.createdAt ? fDate(pedido?.createdAt) : "-"}`,
  },
];

const getAutorizadorFields = (pedido) =>
  pedido?.estado?.estado === ESTADOS.APROBADO
    ? [
        {
          label: "Monto autorizado",
          value: fCurrency(pedido?.estado?.montoAutorizado),
          icon: <MoneyIcon />,
        },
        {
          label: "Monto cuota",
          value: fCurrency(pedido?.estado?.montoCuota),
          icon: <MoneyIcon />,
        },
        { label: "Cantidad cuotas", value: pedido?.estado?.cantidadCuotas },
      ]
    : [];

export const getAutorizador = (pedido) => [
  { label: "Nombre", value: pedido?.estado?.autorizador?.name },
  ...getAutorizadorFields(pedido),
  {
    label: "Comentario autorizador",
    value: pedido?.estado?.comentario,
    alternativeText: "Sin comentario",
  },
];

export const getComision = (pedido) => [
  {
    label: "Estado",
    value: Boolean(pedido?.comision?.estado) && capitalCase(pedido?.comision?.estado),
  },
  {
    label: "Monto",
    value: fCurrency(pedido?.comision?.monto),
    icon: <MoneyIcon />,
  },
  {
    label: "Porcentaje",
    value: `${pedido?.comision?.porcentaje} %`,
  },
  {
    label: "Fecha de cobro",
    value: `${pedido?.comision?.cobradoAt ? fDate(pedido?.comision?.cobradoAt) : "-"}`,
  },
];

export const getRegalia = (pedido) => [
  { label: "Estado", value: pedido?.regaliaCobrada ? "Cobrada" : "No cobrada" },
  {
    label: "Monto",
    value: fCurrency(pedido?.regalia),
    icon: <MoneyIcon />,
  },
];
