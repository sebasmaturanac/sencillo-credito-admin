import * as Yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik, Form, FormikProvider } from "formik";
import { Box, Stack, TextField, IconButton, InputAdornment } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import API from "utils/api";
import { toastSuccess, toastError } from "utils/toast";
import Iconify from "../../../components/Iconify";

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required("El usuario es requerido"),
    password: Yup.string().required("La contraseña es requerida")
  });

  const onSubmit = async (payload) => {
    try {
      const { mensaje, respuesta } = await API.post("/auth/login", payload);
      sessionStorage.setItem("token", respuesta[0].token);
      sessionStorage.setItem("username", respuesta[0].username);
      sessionStorage.setItem("role", respuesta[0].role);
      sessionStorage.setItem("name", respuesta[0].name);
      sessionStorage.setItem("id", respuesta[0].id);
      sessionStorage.setItem("comercializadoraId", respuesta[0].comercializadoraId);
      toastSuccess(mensaje);
      navigate("/dashboard/home");
    } catch (error) {
      console.error(error);
      toastError(error.mensaje);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: ""
    },
    validationSchema: LoginSchema,
    onSubmit
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            type="text"
            label="Usuario"
            {...getFieldProps("username")}
            error={Boolean(touched.username && errors.username)}
            helperText={touched.username && errors.username}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? "text" : "password"}
            label="Contraseña"
            {...getFieldProps("password")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Box mt={2}>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Iniciar sesion
          </LoadingButton>
        </Box>
      </Form>
    </FormikProvider>
  );
}
