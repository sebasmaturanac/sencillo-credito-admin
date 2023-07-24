import React, { useState } from "react";
import PropTypes from "prop-types";
import Iconify from "components/Iconify";
import { Tooltip } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { toastError, toastWarning } from "utils/toast";
import API from "utils/api";
import Viewer from "react-viewer";

const FotoDrawer = ({ pedido }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fotos, setFotos] = useState([]);

  const toggleLoading = () => setLoading((state) => !state);

  const handleVerFotos = async () => {
    try {
      toggleLoading();
      const { respuesta } = await API.get(`/pedido/attachment/${pedido.id}`);
      const fotosMapped = respuesta.map((foto) => ({
        src: foto.url,
        alt: foto.url,
        downloadUrl: foto.url,
      }));
      if (!fotosMapped.length) return toastWarning("El pedido no posee fotos");
      setFotos(fotosMapped);
      setIsDrawerOpen(true);
    } catch (error) {
      toastError(error.message);
    } finally {
      toggleLoading();
    }
  };

  return (
    <>
      <Tooltip title="Ver foto">
        <LoadingButton onClick={handleVerFotos} loading={loading}>
          <Iconify icon="clarity:picture-line" style={{ fontSize: 20, color: "#637381" }} />
        </LoadingButton>
      </Tooltip>
      <Viewer
        visible={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        images={fotos}
        onMaskClick={() => setIsDrawerOpen(false)}
        downloadable
      />
    </>
  );
};

FotoDrawer.propTypes = {
  pedido: PropTypes.shape({
    id: PropTypes.number,
    numeroPedido: PropTypes.string,
    estado: PropTypes.shape({
      estado: PropTypes.string,
      autorizador: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default FotoDrawer;
