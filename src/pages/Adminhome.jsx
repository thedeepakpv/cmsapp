import { Typography, Container, Button, Box } from "@mui/material";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function AdminHome() {

  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <Container maxWidth="sm" sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 6 }, mt: 4 }}>
        <Typography variant="h4" mb={4} fontWeight="900" letterSpacing="-0.03em" textAlign="center">
          Admin Dashboard
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            disableElevation
            size="large"
            onClick={() => navigate("/updateMenu")}
            sx={{
              py: 2,
              backgroundColor: 'primary.main',
              borderRadius: 2,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: '#000',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }
            }}
          >
            Update Menu
          </Button>

          <Button
            variant="contained"
            disableElevation
            size="large"
            sx={{
              py: 2,
              backgroundColor: 'primary.main',
              borderRadius: 2,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: '#000',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }
            }}
          >
            View Orders
          </Button>

          <Button
            variant="contained"
            disableElevation
            size="large"
            sx={{
              py: 2,
              backgroundColor: 'primary.main',
              borderRadius: 2,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: '#000',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }
            }}
          >
            Manage Earnings
          </Button>
        </Box>
      </Container>
    </>
  );
}
