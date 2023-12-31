import PropTypes from "prop-types";
import { useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Box, Link, Drawer, Typography, Avatar } from "@mui/material";
import account from "_mocks_/account";
import useResponsive from "hooks/useResponsive";
import Logo from "components/Logo";
import Scrollbar from "components/Scrollbar";
import NavSection from "components/NavSection";
import sidebarConfig from "./SidebarConfig";

const DRAWER_WIDTH = 260;

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

const AccountStyle = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1.5, 1.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
}));

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();

  const isDesktop = useResponsive("up", "lg");

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: "inline-flex" }}>
        <Logo />
      </Box>
      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none" component={RouterLink} to="#">
          <AccountStyle>
            <Avatar src={account.photoURL} alt="photoURL" />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: "text.primary" }}>
                {sessionStorage.getItem("name")}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {sessionStorage.getItem("role")}
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
      </Box>
      <NavSection navConfig={sidebarConfig()} />
    </Scrollbar>
  );

  return (
    <RootStyle>
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: "background.default",
              borderRightStyle: "dashed",
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool.isRequired,
  onCloseSidebar: PropTypes.func.isRequired,
};
