import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import { Box } from "@mui/material";

export default function Iconify({ icon, sx, ...other }) {
  return <Box component={Icon} icon={icon} sx={[...(Array.isArray(sx) ? sx : [sx])]} {...other} />;
}

Iconify.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object
  ])
};

Iconify.defaultProps = {
  sx: {}
};
