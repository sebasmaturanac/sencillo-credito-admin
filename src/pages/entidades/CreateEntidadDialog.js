import PropTypes from "prop-types";
import * as Yup from "yup";
import Iconify from "components/Iconify";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { LoadingButton } from "@mui/lab";
import { Stack, Select, MenuItem, FormControl, FormHelperText } from "@mui/material";
import { useFormik, FormikProvider, Form } from "formik";
import { useEffect } from "react";
import API from "utils/api";
import { toastError, toastSuccess } from "utils/toast";

export default function CreateEntidadDialog({ open, onClose, entidad }) {
  const EntidadSchema = Yup.object().shape({
    nombre: Yup.string()
      .min(2, "Nombre muy corto")
      .max(30, "Nombre muy largo")
      .required("El nombre es requerido"),
    tipo: Yup.string().required("El tipo es requerido"),
  });

  const onSubmit = async (data, { resetForm }) => {
    try {
      let method = "post";
      let url = "/providers/entidad";
      if (entidad?.id) {
        method = "patch";
        url = `/providers/entidad/${entidad.id}`;
      }
      const { respuesta, mensaje } = await API[method](url, data);
      toastSuccess(mensaje);
      resetForm();
      onClose(respuesta[0]);
    } catch (error) {
      toastError(error.mensaje);
      console.error("error: ", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      nombre: "",
      tipo: "",
    },
    validationSchema: EntidadSchema,
    onSubmit,
  });
  const {
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    resetForm,
    setValues,
  } = formik;

  const handleClose = () => {
    resetForm();
    onClose({});
  };

  useEffect(() => {
    if (entidad.id) {
      setValues({
        nombre: entidad?.nombre,
        tipo: entidad?.tipo,
      });
    }
  }, [entidad]);

  return (
    <Dialog open={open} maxWidth="lg">
      <DialogTitle>Crear nueva entidad</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 1 }}>Complete los siguientes campos</DialogContentText>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                size="small"
                label="Nombre"
                {...getFieldProps("nombre")}
                error={Boolean(touched.nombre && errors.nombre)}
                helperText={touched.nombre && errors.nombre}
              />
              <FormControl error={Boolean(touched.tipo && errors.tipo)}>
                <Select
                  {...getFieldProps("tipo")}
                  size="small"
                  fullWidth
                  disabled={!!entidad?.id}
                  defaultValue=""
                  displayEmpty
                >
                  <MenuItem value="" disabled selected defaultChecked>
                    Seleccione un tipo de entidad
                  </MenuItem>
                  <MenuItem value="BANCO">BANCO</MenuItem>
                  <MenuItem value="INSTITUCION">INSTITUCION</MenuItem>
                </Select>
                <FormHelperText>Tipo de entidad</FormHelperText>
                <FormHelperText>{touched.tipo && errors.tipo}</FormHelperText>
              </FormControl>
              <LoadingButton
                fullWidth
                size="medium"
                type="submit"
                variant="contained"
                startIcon={<Iconify icon="gridicons:create" />}
                loading={isSubmitting}
              >
                {entidad?.id ? "Modificar" : "Crear entidad"}
              </LoadingButton>
            </Stack>
          </Form>
        </FormikProvider>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={handleClose}>
          cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CreateEntidadDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  entidad: PropTypes.shape({
    id: PropTypes.number,
    nombre: PropTypes.string,
    tipo: PropTypes.string,
    deleted: PropTypes.bool,
    deletedAt: PropTypes.string,
  }),
};

CreateEntidadDialog.defaultProps = {
  entidad: {
    id: null,
    nombre: null,
    tipo: null,
    deleted: null,
    deletedAt: null,
  },
};
