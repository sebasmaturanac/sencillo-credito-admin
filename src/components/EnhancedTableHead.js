import {
  Box,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { visuallyHidden } from "@mui/utils";
import Iconify from "components/Iconify";

const Label = ({ tooltip, label }) => {
  if (tooltip)
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {label}
        <Tooltip title={<Typography variant="body2">{tooltip.text}</Typography>}>
          <Box
            sx={{
              marginLeft: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Iconify icon={tooltip.icon ?? ""} />
          </Box>
        </Tooltip>
      </Box>
    );
  return label;
};

export default function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort, headCells } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignRight ? "right" : "left"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sort ? ( // eslint-disable-line
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                <Label tooltip={headCell.tooltip} label={headCell.label} />
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              <Label tooltip={headCell.tooltip} label={headCell.label} />
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  headCells: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      align: PropTypes.string.isRequired,
      sort: PropTypes.bool.isRequired,
      tooltip: PropTypes.shape({
        icon: PropTypes.string,
        text: PropTypes.string,
      }),
    }),
  ),
};

EnhancedTableHead.defaultProps = {
  headCells: {
    tooltip: {
      icon: null,
      text: null,
    },
  },
};

Label.propTypes = {
  label: PropTypes.string.isRequired,
  tooltip: PropTypes.shape({
    icon: PropTypes.string,
    text: PropTypes.string,
  }),
};

Label.defaultProps = {
  tooltip: {
    icon: null,
    text: null,
  },
};
