import { Button, Typography, Container, Box, TextField, Alert, CircularProgress, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function StartPage() {
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const switchMode = () => {
    setIsSignUp((prev) => !prev);
    setError("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (isSignUp) {
      if (password.trim().length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (password.trim() !== confirmPassword.trim()) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        await signup(username.trim(), password.trim());
        navigate("/user");
      } else {
        const user = await login(username.trim(), password.trim());
        navigate(user.role === "admin" ? "/admin" : "/user");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 6 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: "80vh",
      }}
    >
      <Box textAlign="center">
        {/* Back button — only shown on Sign Up view */}
        {isSignUp && (
          <Box display="flex" alignItems="center" mb={3}>
            <IconButton
              disableRipple
              onClick={switchMode}
              sx={{ mr: 1, border: '1px solid #e5e7eb', borderRadius: '50%', '&:hover': { backgroundColor: '#f3f4f6' } }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Back to Sign In
            </Typography>
          </Box>
        )}

        <Typography variant="h3" fontWeight="900" letterSpacing="-0.04em" mb={1} color="text.primary">
          Canteen System
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={5}>
          {isSignUp ? "Create an account to start ordering." : "Manage your daily meals and orders efficiently."}
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            fullWidth
            sx={{ backgroundColor: "#fff", borderRadius: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            fullWidth
            sx={{ backgroundColor: "#fff", borderRadius: 2 }}
          />

          {isSignUp && (
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              fullWidth
              sx={{ backgroundColor: "#fff", borderRadius: 2 }}
            />
          )}

          {error && (
            <Alert severity="error" sx={{ borderRadius: 2, textAlign: "left" }}>
              {error}
            </Alert>
          )}

          <Button
            variant="contained"
            disableElevation
            size="large"
            disabled={loading}
            onClick={handleSubmit}
            sx={{
              py: 2,
              backgroundColor: "primary.main",
              borderRadius: 2,
              transition: "all 0.2s",
              "&:hover": {
                backgroundColor: "#000",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
            }}
          >
            {loading
              ? <CircularProgress size={22} color="inherit" />
              : isSignUp ? "Create Account" : "Sign In"}
          </Button>

          {/* Toggle between Sign In / Sign Up */}
          <Box display="flex" justifyContent="center" alignItems="center" gap={0.5} mt={1}>
            <Typography variant="body2" color="text.secondary">
              {isSignUp ? "Already have an account?" : "New here?"}
            </Typography>
            <Button
              variant="text"
              size="small"
              onClick={switchMode}
              sx={{ fontWeight: 700, textTransform: "none", color: "primary.main", p: 0, minWidth: 0 }}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
