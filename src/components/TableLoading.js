import React from "react";
import PropTypes from "prop-types";
import { Skeleton, TableCell, TableRow } from "@mui/material";

export default function TableLoading({ rows, columns }) {
  return Array.from(Array(rows).keys()).map((row) => (
    <TableRow hover key={row} tabIndex={-1}>
      {Array.from(Array(columns).keys()).map((column) => (
        <TableCell key={column} align="left">
          <Skeleton variant="text" animation="wave" width="100%" height={25} />
        </TableCell>
      ))}
    </TableRow>
  ));
}

TableLoading.propTypes = {
  rows: PropTypes.number.isRequired,
  columns: PropTypes.number.isRequired,
};
