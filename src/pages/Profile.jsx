import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  Alert
} from "@mui/material";

import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { Collapse } from "@mui/material";

export default function Profile() {

  const [editMode, setEditMode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@gmail.com",
    phone: "9876543210"
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const saveProfile = () => {
    setEditMode(false);
    setShowAlert(true);
  };

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);


  return (
    <>
      <Navbar isProfilePage={true} />

      <Container maxWidth="sm" sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 6 } }}>
        <Box textAlign="center" mt={4} mb={6}>

          <Typography variant="h4" fontWeight="900" letterSpacing="-0.03em" mb={3}>
            Profile
          </Typography>

          <Avatar
            sx={{
              width: 96,
              height: 96,
              margin: "0 auto",
              bgcolor: 'primary.main',
              fontSize: '2.5rem',
              fontWeight: 700
            }}
          >
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </Avatar>

        </Box>

        {!editMode ? (

          // ---------- VIEW MODE ----------
          <Box p={4} sx={{ border: '1px solid #e5e7eb', borderRadius: 3, backgroundColor: '#fff' }}>

            <Typography variant="h5" mb={1} textAlign="center" fontWeight="800">
              {user.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center" mb={4}>
              {user.email} • {user.phone}
            </Typography>

            <Button
              variant="outlined"
              fullWidth
              size="large"
              onClick={() => setEditMode(true)}
              sx={{
                py: 1.5,
                borderColor: '#e5e7eb',
                color: 'text.primary',
                fontWeight: 600,
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: '#f9fafb'
                }
              }}
            >
              Edit Settings
            </Button>

          </Box>

        ) : (

          // ---------- EDIT MODE ----------
          <Box p={4} sx={{ border: '1px solid #e5e7eb', borderRadius: 3, backgroundColor: '#fff' }}>

            <TextField
              fullWidth
              label="Name"
              name="name"
              value={user.name}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            <Button
              variant="contained"
              disableElevation
              fullWidth
              size="large"
              sx={{
                mb: 2, py: 1.5,
                backgroundColor: 'primary.main',
                transition: 'all 0.2s',
                '&:hover': { backgroundColor: '#000', transform: 'translateY(-1px)' }
              }}
              onClick={saveProfile}
            >
              Save Changes
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
          <Alert
            severity="success"
            sx={{ mt: 3, borderRadius: 2, border: '1px solid #10b981', backgroundColor: '#ecfdf5', color: '#065f46' }}
          >
            Profile updated successfully
          </Alert>
        </Collapse>
      </Container>
    </>
  );
}
