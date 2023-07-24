import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { Box, Button, TextField } from "@mui/material";
import { es } from "date-fns/locale";
import React, { useState } from "react";
import { usePedidoStore } from "store/pedidosStore";
import { formatFromDate, formatToDate } from "utils/formatTime";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";

const IngeitDateRangePicker = () => {
  const setFiltroFecha = usePedidoStore((state) => state.setFiltroFecha);
  const fromDateStore = usePedidoStore((state) => state.fromDate);
  const toDateStore = usePedidoStore((state) => state.toDate);
  const [fromDate, setFromDate] = useState(fromDateStore);
  const [toDate, setToDate] = useState(toDateStore);
  const isDateFullFilled = fromDate && toDate;

  const handleSubmit = () => {
    setFiltroFecha({
      fromDate: formatFromDate(fromDate),
      toDate: formatToDate(toDate),
    });
  };

  const handleClear = () => {
    setFiltroFecha({
      fromDate: "",
      toDate: "",
    });
    setFromDate(null);
    setToDate(null);
  };

  return (
    <Box display="flex" alignItems="center">
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        <DatePicker
          label="Desde"
          value={fromDate}
          onChange={(date) => setFromDate(date)}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              error={false}
              style={{
                width: 180,
              }}
            />
          )}
        />
        <Box mx={1}>-</Box>
        <DatePicker
          label="Hasta"
          value={toDate}
          onChange={(date) => setToDate(date)}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              error={false}
              style={{
                width: 180,
              }}
            />
          )}
        />
        <Button
          disabled={!isDateFullFilled}
          color="inherit"
          variant="outlined"
          onClick={handleSubmit}
        >
          Buscar
        </Button>
        <Button disabled={!isDateFullFilled} color="inherit" onClick={handleClear}>
          Limpiar
        </Button>
      </LocalizationProvider>
    </Box>
  );
};

export default IngeitDateRangePicker;
