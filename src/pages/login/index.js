import { styled } from "@mui/material/styles";
import { Card, Stack, Container, Typography } from "@mui/material";
import Page from "components/Page";
import LoginForm from "sections/authentication/login";

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex"
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 464,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  display: "flex",
  minHeight: "100vh",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <RootStyle title="Iniciar Sesión | Sencillo Créditos">
      <SectionStyle sx={{ display: { xs: "none", md: "flex" } }}>
        <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }} textAlign="center">
          ¡Bienvenido!
        </Typography>
        <img src="/static/sencilloLogo.png" alt="login" />
      </SectionStyle>

      <Container maxWidth="sm">
        <ContentStyle>
          <Stack sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              Sencillo Créditos
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>Ingrese sus credenciales</Typography>
          </Stack>
          <LoginForm />
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
