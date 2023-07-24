import { TableRow, TableCell, TableHead, Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import { usePedidoStore, pedidoStoreSelector } from "store/pedidosStore";
import { canViewComisiones, isVendedor } from "utils/userRole";
import shallow from "zustand/shallow";

export const getTableHead = () => [
  { label: "Apellido", alignRight: false, show: true },
  { label: "Nombre", alignRight: false, show: true },
  { label: "DNI", alignRight: false, show: true },
  { label: "Banco / Institución", alignRight: false, show: true },
  { label: "Vendedor", alignRight: false, show: !isVendedor() },
  { label: "Fecha", alignRight: false, show: true },
  { label: "Estado", alignRight: false, show: true },
  { label: "Monto solicitado", alignRight: false, show: true },
  { label: "Comisión", alignRight: false, show: canViewComisiones() },
  { label: "Acciones", alignRight: false, show: true },
];

export default function UserListHead() {
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const { toggleAllCheckbox, pedidosTable } = usePedidoStore(pedidoStoreSelector, shallow);

  const handleToggleCheckbox = (event) => {
    const checkBoxValue = event.target.checked;
    setIsCheckboxChecked(checkBoxValue);
    toggleAllCheckbox(checkBoxValue);
  };

  useEffect(() => {
    const allPedidosChecked = pedidosTable.every((pedido) => pedido.checked);
    setIsCheckboxChecked(allPedidosChecked);
  }, [pedidosTable]);

  return (
    <TableHead>
      <TableRow>
        <TableCell align="center" colSpan={1} />
        <TableCell align="center" colSpan={5}>
          Cliente
        </TableCell>
        <TableCell align="center" colSpan={5}>
          Pedido
        </TableCell>
        <TableCell align="center" colSpan={1} />
      </TableRow>
      <TableRow>
        <TableCell align="left">
          <Checkbox checked={isCheckboxChecked} onChange={handleToggleCheckbox} />
        </TableCell>
        {getTableHead().map(
          (headCell) =>
            headCell.show && (
              <TableCell key={headCell.label} align={headCell.alignRight ? "right" : "left"}>
                {headCell.label}
              </TableCell>
            ),
        )}
      </TableRow>
    </TableHead>
  );
}
