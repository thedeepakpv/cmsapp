import { AppBar, Toolbar, Typography, IconButton, Box, Badge } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ isProfilePage, cartCount = 0 }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isUserPage = location.pathname === "/user";

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid #e5e7eb",
        color: "text.primary",
        width: { xs: "calc(100% - 32px)", md: "calc(100% - 64px)" },
        margin: "16px auto",
        borderRadius: 2,
        top: 16,
        zIndex: 1100,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" fontWeight="bold">
          Canteen
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          {/* Cart icon — only on menu page */}
          {isUserPage && (
            <IconButton disableRipple color="inherit" onClick={() => navigate("/cart")}>
              <Badge
                badgeContent={cartCount}
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "0.65rem",
                    height: 18,
                    minWidth: 18,
                    fontWeight: 700,
                  },
                }}
              >
                <ShoppingCartOutlinedIcon />
              </Badge>
            </IconButton>
          )}

          {/* My Orders icon — on menu and cart pages */}
          {(isUserPage || location.pathname === "/cart") && (
            <IconButton
              disableRipple
              color="inherit"
              onClick={() => navigate("/orders")}
              title="My Orders"
            >
              <ReceiptLongIcon />
            </IconButton>
          )}

          {/* Back or Profile */}
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
