import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useLocation } from "react-router-dom";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

export default function Navbar({ isProfilePage }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #e5e7eb',
        color: 'text.primary',
        width: { xs: 'calc(100% - 32px)', md: 'calc(100% - 64px)' },
        margin: '16px auto',
        borderRadius: 2,
        top: 16,
        zIndex: 1100
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight="bold">
          Canteen
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {location.pathname === "/user" && (
            <IconButton disableRipple color="inherit" onClick={() => navigate("/cart")}>
              <ShoppingCartOutlinedIcon />
            </IconButton>
          )}

          {isProfilePage ? (
            <IconButton disableRipple color="inherit" onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
          ) : (
            <IconButton disableRipple color="inherit" onClick={() => navigate("/profile")}>
              <AccountCircleIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
