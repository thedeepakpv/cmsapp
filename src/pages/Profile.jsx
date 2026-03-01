import {
  Container, Typography, TextField, Button, Box, Avatar, Alert, CircularProgress
} from "@mui/material";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { Collapse } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

export default function Profile() {
  const { currentUser, logout } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Local editable username state
  const [newUsername, setNewUsername] = useState(currentUser?.username || "");

  const saveProfile = async () => {
    if (!newUsername.trim()) return;
    setLoading(true);
    setError("");

    const { error: updateError } = await supabase
      .from("users")
      .update({ username: newUsername.trim() })
      .eq("id", currentUser.id);

    setLoading(false);

    if (updateError) {
      setError("Failed to save changes. Please try again.");
      return;
    }

    // Update local storage too
    const updated = { ...currentUser, username: newUsername.trim() };
    localStorage.setItem("cms_user", JSON.stringify(updated));

    setEditMode(false);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2000);
  };

  if (!currentUser) return null;

  return (
    <>
      <Navbar isProfilePage={true} />

      <Container maxWidth="sm" sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 6 } }}>
        <Box textAlign="center" mt={4} mb={6}>
          <Typography variant="h4" fontWeight="900" letterSpacing="-0.03em" mb={3}>
            Profile
          </Typography>

          <Avatar
            sx={{ width: 96, height: 96, margin: "0 auto", bgcolor: 'primary.main', fontSize: '2.5rem', fontWeight: 700 }}
          >
            {currentUser.username ? currentUser.username.charAt(0).toUpperCase() : "U"}
          </Avatar>
        </Box>

        {!editMode ? (
          <Box p={4} sx={{ border: '1px solid #e5e7eb', borderRadius: 3, backgroundColor: '#fff' }}>
            <Typography variant="h5" mb={1} textAlign="center" fontWeight="800">
              {currentUser.username}
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center" mb={1}>
              Role: <strong>{currentUser.role}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" mb={4}>
              Member since {new Date(currentUser.created_at).toLocaleDateString()}
            </Typography>

            <Button
              variant="outlined"
              fullWidth
              size="large"
              onClick={() => setEditMode(true)}
              sx={{
                py: 1.5, mb: 2, borderColor: '#e5e7eb', color: 'text.primary', fontWeight: 600,
                '&:hover': { borderColor: 'primary.main', backgroundColor: '#f9fafb' }
              }}
            >
              Edit Username
            </Button>

            <Button
              variant="text"
              fullWidth
              size="large"
              color="error"
              onClick={logout}
              sx={{ fontWeight: 600 }}
            >
              Sign Out
            </Button>
          </Box>
        ) : (
          <Box p={4} sx={{ border: '1px solid #e5e7eb', borderRadius: 3, backgroundColor: '#fff' }}>
            <TextField
              fullWidth
              label="Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              sx={{ mb: 3 }}
            />

            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

            <Button
              variant="contained"
              disableElevation
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                mb: 2, py: 1.5, backgroundColor: 'primary.main',
                '&:hover': { backgroundColor: '#000', transform: 'translateY(-1px)' }
              }}
              onClick={saveProfile}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Save Changes"}
            </Button>

            <Button
              variant="text"
              fullWidth
              size="large"
              onClick={() => setEditMode(false)}
              sx={{ color: 'text.secondary', fontWeight: 600 }}
            >
              Cancel
            </Button>
          </Box>
        )}

        <Box textAlign="center" mt={6}>
          <Typography variant="body2" color="text.secondary">
            Need help? Contact <Box component="span" fontWeight="700" color="text.primary">cmsapp@example.com</Box>
          </Typography>
        </Box>

        <Collapse in={showAlert}>
          <Alert severity="success" sx={{ mt: 3, borderRadius: 2, border: '1px solid #10b981', backgroundColor: '#ecfdf5', color: '#065f46' }}>
            Profile updated successfully
          </Alert>
        </Collapse>
      </Container>
    </>
  );
}
