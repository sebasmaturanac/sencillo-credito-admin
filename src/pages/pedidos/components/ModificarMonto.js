import { Typography, Card, Box, CardContent, TextField } from "@mui/material";
import PropTypes from "prop-types";
import { useFormik, Form, FormikProvider } from "formik";
import { toastSuccess, toastError } from "utils/toast";
import API from "utils/api";
import { LoadingButton } from "@mui/lab";
import * as Yup from "yup";
import { usePedidoStore } from "store/pedidosStore";

const ModificarMonto = ({ idPedido }) => {
  const updateMontoSolicitado = usePedidoStore((state) => state.updateMontoSolicitado);

  const montoSolicitadoSchema = Yup.object().shape({
    montoSolicitado: Yup.string().required("Por favor ingrese monto solicitado"),
  });

  const onSubmit = async ({ montoSolicitado }, { resetForm }) => {
    try {
      const payload = {
        montoSolicitado,
        pedidoId: idPedido,
      };
      const { mensaje } = await API.post("/pedido/cambiarMontoSolicitado", payload);
      resetForm();
      toastSuccess(mensaje);
      updateMontoSolicitado({ idPedido, montoSolicitado });
    } catch (error) {
      toastError(error.mensaje);
    }
  };

  const formik = useFormik({
    initialValues: {
      montoSolicitado: "",
    },
    validationSchema: montoSolicitadoSchema,
    onSubmit,
  });

  const { errors, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <Box mt={2}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Modificar monto solicitado
          </Typography>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Box display="flex">
                <TextField
                  size="small"
                  label="Monto"
                  type="number"
                  {...getFieldProps("montoSolicitado")}
                  error={Boolean(errors.montoSolicitado)}
                  helperText={errors.montoSolicitado}
                />
                <Box ml={2} mt={0.5}>
                  <LoadingButton
                    size="small"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                  >
                    Modificar
                  </LoadingButton>
                </Box>
              </Box>
            </Form>
          </FormikProvider>
        </CardContent>
      </Card>
    </Box>
  );
};

ModificarMonto.propTypes = { idPedido: PropTypes.number.isRequired };

export default ModificarMonto;
