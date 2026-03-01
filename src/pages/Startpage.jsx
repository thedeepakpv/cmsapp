import { Button, Typography, Container, Box, TextField, Alert, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function StartPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const user = await login(username.trim(), password.trim());
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '80vh' }}>
      <Box textAlign="center">
        <Typography variant="h3" fontWeight="900" letterSpacing="-0.04em" mb={1} color="text.primary">
          Canteen System
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={5}>
          Manage your daily meals and orders efficiently.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            fullWidth
            sx={{ backgroundColor: '#fff', borderRadius: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            fullWidth
            sx={{ backgroundColor: '#fff', borderRadius: 2 }}
          />

          {error && (
            <Alert severity="error" sx={{ borderRadius: 2, textAlign: 'left' }}>
              {error}
            </Alert>
          )}

          <Button
            variant="contained"
            disableElevation
            size="large"
            disabled={loading}
            sx={{
              py: 2,
              backgroundColor: 'primary.main',
              borderRadius: 2,
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: '#000',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }
            }}
            onClick={handleLogin}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : "Sign In"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
