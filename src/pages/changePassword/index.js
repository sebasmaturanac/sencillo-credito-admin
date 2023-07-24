import {
  Container,
  Box,
  Typography,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Card,
} from "@mui/material";
import Page from "components/Page";
import * as Yup from "yup";

import { useState } from "react";
import { Form, FormikProvider, useFormik } from "formik";
import { LoadingButton } from "@mui/lab";
import Iconify from "components/Iconify";
import API from "utils/api";
import { toastError, toastSuccess } from "utils/toast";
import { useNavigate } from "react-router-dom";

export default function ChangePasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();
  const onSubmit = async (data, { resetForm }) => {
    try {
      const { mensaje } = await API.post("/auth/change-password", data);
      toastSuccess(mensaje);
      resetForm();
      sessionStorage.clear();
      navigate("/dashboard/home");
    } catch (error) {
      toastError(error.mensaje);
      console.error("error: ", error);
    }
  };

  const ChangePasswordSchema = Yup.object().shape({
    password: Yup.string().required("La contraseña actual es requerida"),
    newPassword: Yup.string()
      .min(6, "Demasiado corta")
      .max(20, "Demasiado larga")
      .required("La contraseña nueva es requerida"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      newPassword: "",
    },
    validationSchema: ChangePasswordSchema,
    onSubmit,
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <Page title="Cambiar contraseña | Sencillo Créditos">
      <Container maxWidth="xl">
        <Box sx={{ pb: 3 }}>
          <Typography variant="h4">Cambiar Contraseña</Typography>
        </Box>
        <Card sx={{ padding: 5, width: 400 }}>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  autoComplete="current-password"
                  type={showPassword ? "text" : "password"}
                  label="Contraseña actual"
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

                <TextField
                  fullWidth
                  autoComplete="new-password"
                  type={showNewPassword ? "text" : "password"}
                  label="Contraseña nueva"
                  {...getFieldProps("newPassword")}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton edge="end" onClick={() => setShowNewPassword((prev) => !prev)}>
                          <Iconify icon={showNewPassword ? "eva:eye-fill" : "eva:eye-off-fill"} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={Boolean(touched.newPassword && errors.newPassword)}
                  helperText={touched.newPassword && errors.newPassword}
                />

                <LoadingButton
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  Aceptar
                </LoadingButton>
              </Stack>
            </Form>
          </FormikProvider>
        </Card>
      </Container>
    </Page>
  );
}
