/* eslint-disable */
import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Card,
  TablePagination,
} from "@mui/material";
import TableLoading from "./TableLoading";
import EnhancedTableHead from "./EnhancedTableHead";

const IngeitTable = ({ headCells, rows, loading, data }) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");

  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <Card>
      <TableContainer>
        <Table size="small">
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            headCells={headCells}
          />
          <TableBody>
            {loading ? (
              <TableLoading rows={10} columns={headCells.length} />
            ) : (
              data.map((item) => (
                <TableRow hover key={item.id} tabIndex={-1}>
                  {headCells.map((head) => (
                    <TableCell align="left">
                      {!!head.render
                        ? head.render(item)
                        : head.propertyPath.split(".").reduce((a, v) => a[v], item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        component="div"
        count={10}
        rowsPerPage={10}
        page={1}
        onPageChange={() => null}
        onRowsPerPageChange={() => null}
      />
    </Card>
  );
};

IngeitTable.propTypes = {};

export default IngeitTable;
