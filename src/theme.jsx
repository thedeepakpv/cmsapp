import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a1a1a',      // Pitch Black
      contrastText: '#fff',
    },
    secondary: {
      main: '#ff6f00',      // Signal Amber
      contrastText: '#fff',
    },
    background: {
      default: '#fafafa',   // Off-white canvas
      paper: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#6b7280',
    },
    success: {
      main: '#10b981',      // Emerald Green
    },
    action: {
      disabledBackground: '#f3f4f6',
      disabled: '#9ca3af',
    }
  },
  typography: {
    fontFamily: '"Inter", "system-ui", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h6: { fontWeight: 600, letterSpacing: '-0.01em' },
    button: { textTransform: 'none', fontWeight: 500, letterSpacing: '0.01em' },
  },
  shape: {
    borderRadius: 8,
  }
});

export default theme;
