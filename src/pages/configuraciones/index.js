import {
  Container,
  Box,
  Typography,
  Card,
  TextField,
  Grid,
  Tooltip,
  Skeleton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Page from "components/Page";
import API from "utils/api";
import { toastError, toastSuccess } from "utils/toast";
import Iconify from "components/Iconify";
import { LoadingButton } from "@mui/lab";

export default function ConfiguracionesPage() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getSettings = async () => {
      try {
        setLoading(true);
        const { respuesta } = await API.get("/setting");
        const settingsList = respuesta.map((setting) => ({ ...setting, loading: false }));
        setSettings(settingsList);
      } catch (error) {
        toastError(error.message);
      } finally {
        setLoading(false);
      }
    };
    getSettings();
  }, []);

  const handleChangeInput = ({ value, id }) => {
    const newSettings = settings.map((setting) => {
      if (setting.id === id) return { ...setting, value };
      return setting;
    });
    setSettings(newSettings);
  };

  const handleSubmit = async ({ id, value }) => {
    try {
      const newSettings = settings.map((setting) => {
        if (setting.id === id) return { ...setting, loading: true };
        return setting;
      });
      setSettings(newSettings);
      const { mensaje } = await API.put("/setting", { settingId: id, value });
      toastSuccess(mensaje);
    } catch (error) {
      toastError(error.message);
    } finally {
      const newSettings = settings.map((setting) => {
        if (setting.id === id) return { ...setting, loading: false };
        return setting;
      });
      setSettings(newSettings);
    }
  };

  return (
    <Page title="Configuraciones | Sencillo Créditos">
      <Container maxWidth="xl">
        <Box sx={{ pb: 3 }}>
          <Typography variant="h4">Configuraciones</Typography>
        </Box>
        <Card sx={{ padding: 5, maxWidth: 800 }}>
          {loading
            ? Array.from(Array(3).keys()).map((item) => (
                <Box key={item} display="flex" alignItems="center" padding={0}>
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width="40%"
                    height={40}
                    sx={{ marginRight: 10 }}
                  />
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width="15%"
                    height={80}
                    sx={{ marginRight: 2 }}
                  />
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width="15%"
                    height={80}
                    sx={{ marginRight: 2 }}
                  />
                </Box>
              ))
            : settings.map((setting) => (
                <Grid container spacing={2} alignItems="center" mb={3} key={setting?.id}>
                  <Grid item sm={12} md={6}>
                    <Box display="flex" alignItems="center">
                      <Typography variant="body2">{setting?.name}</Typography>
                      <Tooltip
                        title={<Typography variant="body2">{setting?.description}</Typography>}
                      >
                        <Box ml={1} display="flex" justifyContent="center" alignItems="center">
                          <Iconify icon="bi:question-circle" />
                        </Box>
                      </Tooltip>
                    </Box>
                  </Grid>
                  <Grid item sm={12} md={2}>
                    <TextField
                      value={setting?.value}
                      size="small"
                      onChange={(e) => handleChangeInput({ value: e.target.value, id: setting.id })}
                    />
                  </Grid>
                  <Grid item sm={12} md={2}>
                    <LoadingButton
                      onClick={() => handleSubmit(setting)}
                      loading={setting?.loading}
                      variant="contained"
                    >
                      Guardar
                    </LoadingButton>
                  </Grid>
                </Grid>
              ))}
        </Card>
      </Container>
    </Page>
  );
}
