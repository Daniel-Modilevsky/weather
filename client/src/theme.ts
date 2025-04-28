import { createTheme } from "@mui/material/styles";

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f9fafb", // Light gray background for body
      paper: "#ffffff", // White for cards and papers
    },
    primary: {
      main: "#2563eb", // Nice blue color (close to Tailwind "blue-600")
    },
    secondary: {
      main: "#64748b", // Grayish blue
    },
    error: {
      main: "#dc2626", // Red-600
    },
    text: {
      primary: "#111827", // Gray-900
      secondary: "#6b7280", // Gray-500
    },
  },
  typography: {
    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
    h1: {
      fontSize: "2rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
    },
    body2: {
      fontSize: "0.875rem",
    },
  },
  components: {
    MuiContainer: {
      defaultProps: {
        maxWidth: "lg",
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
        },
      },
    },
  },
});

export default theme;
