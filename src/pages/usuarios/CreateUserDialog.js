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
import {
  Stack,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { toastError, toastSuccess } from "utils/toast";
import { useFormik, FormikProvider, Form } from "formik";
import { useEffect, useState } from "react";
import { ROLE, ROLE_DROPDOWN } from "types/role";
import API from "utils/api";

export default function CreateUserDialog({ open, onClose, user }) {
  const [showPassword, setShowPassword] = useState(false);
  const [comercializadoras, setComercializadoras] = useState([]);

  useEffect(() => {
    const getComercializadoras = async () => {
      try {
        const { respuesta } = await API.get("/user/comercializadora");
        setComercializadoras(respuesta);
      } catch (error) {
        toastError(error.messasge);
      }
    };
    getComercializadoras();
  }, []);

  const UsuarioSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Nombre muy corto")
      .max(30, "Nombre muy largo")
      .required("El nombre es requerido"),
    username: Yup.string()
      .min(2, "Usuario muy corto")
      .max(30, "Usuario muy largo")
      .required("El usuario es requerido"),
    password: Yup.string().required("La contraseña es requerida"),
    role: Yup.string().required("Por favor Seleccione un rol"),
    esVendedorIndependiente: Yup.string().when("role", (role, schema) =>
      role === ROLE.VENDEDOR ? schema.required("Por favor seleccione una opción") : schema,
    ),
    comercializadoraId: Yup.string().when(
      ["role", "esVendedorIndependiente"],
      (role, esVendedorIndependiente, schema) =>
        role === ROLE.VENDEDOR && esVendedorIndependiente === "NO"
          ? schema.required("Por favor seleccione una opción")
          : schema,
    ),
  });

  const onSubmit = async (data, { resetForm }) => {
    try {
      let method = "post";
      let url = "/auth/create";
      if (user?.id) {
        method = "patch";
        url = `/user/${user.id}`;
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
      name: "",
      username: "",
      password: "",
      role: "",
      esVendedorIndependiente: "",
      comercializadoraId: "",
    },
    validationSchema: UsuarioSchema,
    onSubmit,
  });
  const {
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    values,
    resetForm,
    setValues,
  } = formik;

  const handleClose = () => {
    resetForm();
    onClose({});
  };

  useEffect(() => {
    if (user.id) {
      setValues({
        name: user?.name,
        username: user?.username,
        password: "password",
        role: user?.role,
        esVendedorIndependiente:
          (user?.role === ROLE.VENDEDOR && !user?.comercializadora) ||
          user?.role === ROLE.COMERCIALIZADORA
            ? "SI"
            : "NO",
        comercializadoraId: user?.comercializadora?.id || "",
      });
    }
  }, [user]);

  return (
    <Dialog open={open} maxWidth="lg">
      <DialogTitle>Crear nuevo usuario</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 1 }}>Complete los siguientes campos</DialogContentText>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Nombre"
                  {...getFieldProps("name")}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Nombre de usuario"
                  disabled={!!user?.id}
                  autoComplete="new-username"
                  {...getFieldProps("username")}
                  error={Boolean(touched.username && errors.username)}
                  helperText={touched.username && errors.username}
                />
              </Stack>
              {!user?.id && (
                <TextField
                  fullWidth
                  size="small"
                  autoComplete="new-password"
                  type={showPassword ? "text" : "password"}
                  label="Contraseña"
                  {...getFieldProps("password")}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                          <Iconify icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={Boolean(touched.password && errors.password)}
                  helperText={touched.password && errors.password}
                />
              )}

              <FormControl error={Boolean(touched.role && errors.role)}>
                <Select
                  {...getFieldProps("role")}
                  size="small"
                  fullWidth
                  disabled={!!user?.id}
                  defaultValue=""
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Seleccione el rol del usuario
                  </MenuItem>
                  {ROLE_DROPDOWN.map((role) => (
                    <MenuItem value={role.value} key={role.value}>
                      {role.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Rol del usuario</FormHelperText>
                <FormHelperText>{touched.role && errors.role}</FormHelperText>
              </FormControl>
              {values.role === ROLE.VENDEDOR && (
                <FormControl
                  error={Boolean(touched.esVendedorIndependiente && errors.esVendedorIndependiente)}
                >
                  <Select
                    {...getFieldProps("esVendedorIndependiente")}
                    size="small"
                    fullWidth
                    defaultValue=""
                    displayEmpty
                    disabled={!!user?.id}
                  >
                    <MenuItem value="" disabled>
                      Seleccione el tipo de vendedor
                    </MenuItem>
                    <MenuItem value="SI">VENDEDOR INDEPENDIENTE</MenuItem>
                    <MenuItem value="NO">PERTENECE A UNA COMERCIALIZADORA</MenuItem>
                  </Select>
                  <FormHelperText>Tipo de vendedor</FormHelperText>
                  <FormHelperText>
                    {touched.esVendedorIndependiente && errors.esVendedorIndependiente}
                  </FormHelperText>
                </FormControl>
              )}
              {values.role === ROLE.VENDEDOR && values.esVendedorIndependiente === "NO" && (
                <FormControl
                  error={Boolean(touched.comercializadoraId && errors.comercializadoraId)}
                >
                  <Select
                    {...getFieldProps("comercializadoraId")}
                    size="small"
                    fullWidth
                    defaultValue=""
                    disabled={!!user?.id}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Seleccione una comercializadora
                    </MenuItem>
                    {comercializadoras.map((comercializadora) => (
                      <MenuItem value={comercializadora.id.toString()} key={comercializadora.id}>
                        {comercializadora.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Comercializadora</FormHelperText>
                  <FormHelperText>
                    {touched.comercializadoraId && errors.comercializadoraId}
                  </FormHelperText>
                </FormControl>
              )}

              <LoadingButton
                fullWidth
                size="medium"
                type="submit"
                variant="contained"
                startIcon={<Iconify icon="akar-icons:person-check" />}
                loading={isSubmitting}
              >
                {user?.id ? "Modificar" : "Crear usuario"}
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

CreateUserDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    comercializadora: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
    comision: PropTypes.shape({
      id: PropTypes.number,
      userId: PropTypes.number,
      porcentaje: PropTypes.string,
    }),
    createdAt: PropTypes.string,
    id: PropTypes.number,
    name: PropTypes.string,
    role: PropTypes.string,
    suspended: PropTypes.bool,
    suspendedAt: PropTypes.string,
    username: PropTypes.string,
  }),
};

CreateUserDialog.defaultProps = {
  user: {
    comercializadora: null,
    comision: null,
    createdAt: null,
    id: null,
    name: null,
    role: null,
    suspended: null,
    suspendedAt: null,
    username: null,
  },
};
