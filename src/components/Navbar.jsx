import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

export default function Navbar({ isProfilePage }) {

  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ backgroundColor: "#6a1b9a" }}>
      <Toolbar>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Canteen System
        </Typography>

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
