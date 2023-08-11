import { ROLE } from "types/role";
import { canViewEstadoCuenta } from "utils/userRole";
import Iconify from "../../components/Iconify";

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const getComisionesMenu = () =>
  canViewEstadoCuenta()
    ? [
        {
          title: "Estado de cuenta",
          path: "/dashboard/estadoCuenta",
          icon: getIcon("emojione-monotone:money-mouth-face"),
          allowedRoles: [],
        },
      ]
    : [];

const sidebarConfig = () => [
  {
    title: "Inicio",
    path: "/dashboard/home",
    icon: getIcon("eva:pie-chart-2-fill"),
    allowedRoles: [],
  },
  {
    title: "Pedidos",
    path: "/dashboard/pedidos",
    icon: getIcon("ic:round-request-page"),
    allowedRoles: [],
  },
  ...getComisionesMenu(),
  {
    title: "Clientes",
    path: "/dashboard/clientes",
    icon: getIcon("eva:people-fill"),
    allowedRoles: [ROLE.SUPERUSER, ROLE.AUTORIZADOR],
  },
  {
    title: "Bancos - Instituciones",
    path: "/dashboard/entidades",
    icon: getIcon("fluent:building-bank-20-filled"),
    allowedRoles: [ROLE.SUPERUSER, ROLE.AUTORIZADOR],
  },
  {
    title: "Notificaciones",
    path: "/dashboard/notificaciones",
    icon: getIcon("eva:bell-fill"),
    allowedRoles:[ROLE.SUPERUSER, ROLE.AUTORIZADOR],
  },
  {
    title: "Usuarios",
    path: "/dashboard/usuarios",
    icon: getIcon("eos-icons:admin-outlined"),
    allowedRoles: [ROLE.SUPERUSER, ROLE.AUTORIZADOR],
  },
  {
    title: "Configuraciones",
    path: "/dashboard/configuraciones",
    icon: getIcon("ci:settings-filled"),
    allowedRoles: [ROLE.SUPERUSER, ROLE.AUTORIZADOR],
  },
  {
    title: "Chats",
    path: "/dashboard/chats",
    icon: getIcon("ion:mail-notification"),
    allowedRoles:[]// [ROLE.SUPERUSER, ROLE.AUTORIZADOR],
  },
];

export default sidebarConfig;
