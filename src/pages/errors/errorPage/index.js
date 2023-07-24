import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";
import { Box, Typography, Container } from "@mui/material";
import { MotionContainer, varBounceIn } from "components/animate";
import Page from "components/Page";

const RootStyle = styled(Page)(({ theme }) => ({
  display: "flex",
  minHeight: "100%",
  alignItems: "center",
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}));

// ----------------------------------------------------------------------

export default function ErrorPage() {
  return (
    <RootStyle title="Error | Sencillo Créditos">
      <Container>
        <MotionContainer initial="initial" open>
          <Box sx={{ maxWidth: 480, margin: "auto", textAlign: "center" }}>
            <motion.div variants={varBounceIn}>
              <Typography variant="h3" paragraph>
                ¡Lo sentimos! Algo salio mal.
              </Typography>
            </motion.div>
            <Typography sx={{ color: "text.secondary" }}>
              Lamentablemente tengo un error, comunicarse por favor con los desarrolladores.
            </Typography>

            <motion.div variants={varBounceIn}>
              <Box
                component="img"
                src="/static/illustrations/error.png"
                sx={{ height: 260, mx: "auto", my: { xs: 5, sm: 10 } }}
              />
            </motion.div>
          </Box>
        </MotionContainer>
      </Container>
    </RootStyle>
  );
}
