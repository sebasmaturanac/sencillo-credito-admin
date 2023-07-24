import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import { Box, Typography } from "@mui/material";

export default function Logo({ sx }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <RouterLink to="/">
        <Box component="img" src="/static/logo.png" sx={{ width: 40, height: 40, ...sx }} />
      </RouterLink>
      <Typography variant="h6" sx={{ marginLeft: 2 }}>
        Sencillo Créditos
      </Typography>
    </Box>
  );
}

Logo.propTypes = {
  // eslint-disable-next-line
  sx: PropTypes.object
};

Logo.defaultProps = {
  sx: {}
};
