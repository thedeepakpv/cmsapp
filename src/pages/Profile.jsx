import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Avatar
} from "@mui/material";

import Navbar from "../components/Navbar";
import { useState } from "react";

export default function Profile() {

  const [editMode, setEditMode] = useState(false);

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
    alert("Profile Updated!");
  };

  return (
    <>
      <Navbar isProfilePage={true} />

      <Container maxWidth="sm">
        <Box textAlign="center" mt={4}>

          <Typography variant="h5">
            Profile
          </Typography>

          <Avatar
            sx={{
              width: 80,
              height: 80,
              margin: "20px auto",
              bgcolor: "#6a1b9a"
            }}
          >
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </Avatar>

        </Box>

        {!editMode ? (

          // ---------- VIEW MODE ----------
          <Box mt={3}>

            <Typography variant="body1" mb={2}>
              <b>Name:</b> {user.name}
            </Typography>

            <Typography variant="body1" mb={2}>
              <b>Email:</b> {user.email}
            </Typography>

            <Typography variant="body1" mb={2}>
              <b>Phone:</b> {user.phone}
            </Typography>

            <Button
              variant="contained"
              fullWidth
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </Button>

          </Box>

        ) : (

          // ---------- EDIT MODE ----------
          <Box mt={3}>

            <TextField
              fullWidth
              label="Name"
              name="name"
              value={user.name}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              value={user.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              fullWidth
              sx={{ mb: 2 }}
              onClick={saveProfile}
            >
              Save
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => setEditMode(false)}
            >
              Cancel
            </Button>

          </Box>
        )}
      </Container>
    </>
  );
}
