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
          <Box mt={2}>

            <Typography variant="h5" mb={2} textAlign="center" >
              <b>{user.name}</b> 
            </Typography>

            <Button
              variant="contained"
              fullWidth
              onClick={() => setEditMode(true)}
            >
              <b>Settings</b>
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

             <Typography variant="body1" mt={3} mb={2}>
              <b>Contact Us: cmsapp@gmail.com</b> 
            </Typography>

          </Box>
        )}
           <Collapse in={showAlert}>
              <Alert
                severity="success"
                sx={{ mt: 2 }}
              >
              Name changed successfully!
             </Alert>
           </Collapse>
      </Container>
    </>
  );
}
