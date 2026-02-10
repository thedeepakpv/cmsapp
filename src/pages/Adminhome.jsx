import { Typography, Container, Button, Box } from "@mui/material";
import Navbar from "../components/Navbar";

export default function AdminHome() {
  return (
    <>
      <Navbar />

      <Container>
        <Typography variant="h5" mt={4}>
          Admin Dashboard
        </Typography>

        <Box mt={3}>
          <Button variant="contained" fullWidth sx={{ mb: 2 }}>
            Update Menu
          </Button>

          <Button variant="contained" fullWidth sx={{ mb: 2 }}>
            View Orders
          </Button>

          <Button variant="outlined" fullWidth>
            Manage Earnings
          </Button>
        </Box>
      </Container>
    </>
  );
}
