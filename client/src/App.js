import React from "react";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
} from "@mui/material";
import TicketCounter from "./components/TicketCounter";
import SupportIcon from "@mui/icons-material/Support";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#e3f2fd",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar sx={{ justifyContent: "center", py: 1 }}>
            <SupportIcon
              sx={{
                mr: 2,
                color: "#1976d2",
                fontSize: 32,
              }}
            />
            <Typography
              variant="h5"
              component="div"
              sx={{
                color: "#1976d2",
                fontWeight: 600,
                letterSpacing: "0.5px",
                display: "flex",
                alignItems: "center",
              }}
            >
              MoEngage Custom Zendesk Export
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <TicketCounter />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
