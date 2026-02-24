import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useLocation } from "react-router-dom";

export default function Navbar({ isProfilePage }) {

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="static" sx={{ backgroundColor: "#6a1b9a" }}>
      <Toolbar>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Canteen System
        </Typography>
        
        {location.pathname === "/user" && (
        <IconButton color="inherit" onClick={() => navigate("/cart")}>
          <ShoppingCartIcon />
        </IconButton>
       )}

        {isProfilePage ? (

          <IconButton color="inherit" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>

        ) : (

          <IconButton color="inherit" onClick={() => navigate("/profile")}>
            <AccountCircleIcon />
          </IconButton>

        )}

      </Toolbar>
    </AppBar>
  );
}
