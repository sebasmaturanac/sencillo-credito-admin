import { Navigate, useRoutes } from "react-router-dom";
import ProtectedPage from "components/ProtectedPage";
import LoginPage from "pages/login";
import NotFound from "pages/errors/404";
import Unauthorized from "pages/errors/401";
import DashboardLayout from "layouts/dashboard/index";
import LogoOnlyLayout from "layouts/LogoOnlyLayout";
import ChangePasswordPage from "pages/changePassword";
import ConfiguracionesPage from "pages/configuraciones";
import EntidadesPage from "pages/entidades";
import PedidosPage from "pages/pedidos";
import UsuariosPage from "pages/usuarios";
import DashboardPage from "pages/dashboard";
import ClientesPage from "pages/clientes";
import { ROLE } from "types/role";
import EstadoCuenta from "pages/estadoCuenta";
import PublicPage from "components/PublicPage.js";
import NotificationPage from "pages/notification";

export default function Router() {
  return useRoutes([
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        { path: "home", element: <ProtectedPage element={<DashboardPage />} /> },
        { path: "pedidos", element: <ProtectedPage element={<PedidosPage />} /> },
        { path: "estadoCuenta", element: <ProtectedPage element={<EstadoCuenta />} /> },
        { path: "notificaciones", element: <ProtectedPage element={<NotificationPage />} /> },
        {
          path: "usuarios",
          element: <ProtectedPage roles={[ROLE.SUPERUSER, ROLE.AUTORIZADOR]} element={<UsuariosPage />} />,
        },
        {
          path: "clientes",
          element: <ProtectedPage roles={[ROLE.SUPERUSER, ROLE.AUTORIZADOR]} element={<ClientesPage />} />,
        },
        {
          path: "entidades",
          element: <ProtectedPage roles={[ROLE.SUPERUSER, ROLE.AUTORIZADOR]}element={<EntidadesPage />} />,
        },
        {
          path: "configuraciones",
          element: <ProtectedPage roles={[ROLE.SUPERUSER, ROLE.AUTORIZADOR]} element={<ConfiguracionesPage />} />,
        },
        { path: "change-password", element: <ProtectedPage element={<ChangePasswordPage />} /> },
      ],
    },
    {
      path: "/",
      element: <LogoOnlyLayout />,
      children: [
        { path: "/", element: <Navigate to="/login" /> },
        { path: "login", element: <PublicPage element={<LoginPage />} /> },
        { path: "401", element: <Unauthorized /> },
        { path: "404", element: <NotFound /> },
        { path: "*", element: <Navigate to="/404" /> },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
