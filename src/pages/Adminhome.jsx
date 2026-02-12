import { Typography, Container, Button, Box } from "@mui/material";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function AdminHome() {

  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <Container>
        <Typography variant="h5" mt={4}>
          Admin Dashboard
        </Typography>

        <Box mt={3}>
          <Button variant="contained" fullWidth sx={{ mb: 2 }} onClick={() => navigate("/updateMenu")}>
            Update Menu
          </Button>

          <Button variant="contained" fullWidth sx={{ mb: 2 }}>
            View Orders
          </Button>

          <Button variant="contained" fullWidth>
            Manage Earnings
          </Button>
        </Box>
      </Container>
    </>
  );
}
