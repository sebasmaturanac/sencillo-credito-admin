import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import {
  Box,
  Stack,
  TextField,
  MenuItem,
  Select,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import API from "utils/api";
import PropTypes from "prop-types";
import { toastSuccess, toastError } from "utils/toast";
import { ESTADOS } from "types/estado";
import { useEffect, useState } from "react";

const ESTADOS_OFERTAS = [
  {
    value: ESTADOS.APROBADO,
    label: "Aprobar",
  },
  {
    value: ESTADOS.RECHAZADO,
    label: "Rechazar",
  },
  {
    value: ESTADOS.PENDIENTE_DE_MARGEN,
    label: "Pendiente de margen",
  },
];

const FormOfertar = ({ idPedido, dniCliente }) => {
  const [showComision, setShowComision] = useState(true);

  useEffect(() => {
    const fetchClientePedidos = async () => {
      try {
        await API.get("/pedido/search", {
          params: {
            string: dniCliente,
            page: 1,
            take: 5,
          },
        });
        // DESHABILITADO POR AHORA, siempre TRUE
        // const esPrimerPedido = respuesta[0].total === 0;
        setShowComision(true);
      } catch (error) {
        toastError(error.mensaje);
      }
    };
    if (dniCliente) fetchClientePedidos();
  }, [dniCliente]);

  const pedidoSchema = Yup.object().shape({
    estado: Yup.string().required("Por favor seleccione una opcion"),
    comentario: Yup.string(),
    regalia: Yup.string(),
    montoAutorizado: Yup.string().when("estado", (estado, schema) =>
      estado === ESTADOS.APROBADO
        ? schema.required("Por favor ingrese el monto autorizado")
        : schema,
    ),
    cantidadCuotas: Yup.string().when("estado", (estado, schema) =>
      estado === ESTADOS.APROBADO ? schema.required("Por favor ingrese un cantidad") : schema,
    ),
    montoCuota: Yup.string().when("estado", (estado, schema) =>
      estado === ESTADOS.APROBADO ? schema.required("Por favor ingrese un monto") : schema,
    ),
    porcentajeComision: Yup.number()
      .min(0, "Por favor ingrese un porcentaje mayor que 0")
      .max(100, "Por favor ingrese un porcentaje menor que 100"),
  });

  const onSubmit = async (values, { resetForm }) => {
    try {
      const regalia = values.regaliaCustom
        ? parseInt(values.regaliaCustom, 10)
        : parseInt(values.regalia, 10);

      const porcentajeComisionPayload = values.porcentajeComision
        ? { porcentajeComision: values.porcentajeComision }
        : {};
      const payload = {
        pedidoId: idPedido,
        montoAutorizado: parseFloat(values.montoAutorizado, 10),
        montoCuota: parseFloat(values.montoCuota, 10),
        cantidadCuotas: parseInt(values.cantidadCuotas, 10),
        comentario: values.comentario,
        estado: values.estado,
        regalia,
        ...porcentajeComisionPayload,
      };
      const { mensaje } = await API.post("/pedido/cambiarEstado", payload);
      resetForm();
      toastSuccess(mensaje);
    } catch (error) {
      toastError(error.mensaje);
    }
  };

  const formik = useFormik({
    initialValues: {
      estado: ESTADOS.APROBADO,
      comentario: "",
      montoAutorizado: "",
      cantidadCuotas: "",
      montoCuota: "",
      porcentajeComision: "",
      regalia: "",
      regaliaCustom: "",
    },
    validationSchema: pedidoSchema,
    onSubmit,
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps, values } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Select
            size="small"
            displayEmpty
            {...getFieldProps("estado")}
            style={{
              width: 200,
            }}
          >
            {ESTADOS_OFERTAS.map((estadoItem) => (
              <MenuItem value={estadoItem.value} key={estadoItem.value}>
                {estadoItem.label}
              </MenuItem>
            ))}
          </Select>

          <TextField
            size="small"
            fullWidth
            label="Comentario"
            multiline
            {...getFieldProps("comentario")}
          />

          {values.estado === ESTADOS.APROBADO && (
            <>
              <TextField
                size="small"
                fullWidth
                label="Monto autorizado"
                type="number"
                {...getFieldProps("montoAutorizado")}
                error={Boolean(touched.montoAutorizado && errors.montoAutorizado)}
                helperText={touched.montoAutorizado && errors.montoAutorizado}
              />

              <TextField
                size="small"
                fullWidth
                label="Cantidad cuotas"
                type="number"
                {...getFieldProps("cantidadCuotas")}
                error={Boolean(touched.cantidadCuotas && errors.cantidadCuotas)}
                helperText={touched.cantidadCuotas && errors.cantidadCuotas}
              />

              <TextField
                size="small"
                fullWidth
                label="Monto cuota"
                type="number"
                {...getFieldProps("montoCuota")}
                error={Boolean(touched.montoCuota && errors.montoCuota)}
                helperText={touched.montoCuota && errors.montoCuota}
              />

              <TextField
                size="small"
                fullWidth
                label="Porcentaje comision"
                type="number"
                {...getFieldProps("porcentajeComision")}
                error={Boolean(touched.porcentajeComision && errors.porcentajeComision)}
                helperText={touched.porcentajeComision && errors.porcentajeComision}
              />
              {showComision && (
                <>
                  <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">Regalia</FormLabel>
                    <RadioGroup row {...getFieldProps("regalia")}>
                      <FormControlLabel value="2000" control={<Radio />} label="2000" />
                      <FormControlLabel value="3000" control={<Radio />} label="3000" />
                      <FormControlLabel value="4000" control={<Radio />} label="4000" />
                      <FormControlLabel value="-1" control={<Radio />} label="Otro" />
                    </RadioGroup>
                  </FormControl>
                  {values.regalia === "-1" && (
                    <TextField
                      size="small"
                      fullWidth
                      label="Valor personalizado"
                      type="number"
                      {...getFieldProps("regaliaCustom")}
                    />
                  )}
                </>
              )}
            </>
          )}
        </Stack>

        <Box mt={2}>
          <LoadingButton
            size="small"
            type="submit"
            variant="contained"
            fullWidth
            loading={isSubmitting}
          >
            Aceptar
          </LoadingButton>
        </Box>
      </Form>
    </FormikProvider>
  );
};

FormOfertar.defaultProps = {
  dniCliente: "",
};

FormOfertar.propTypes = {
  idPedido: PropTypes.number.isRequired,
  dniCliente: PropTypes.string,
};

export default FormOfertar;
