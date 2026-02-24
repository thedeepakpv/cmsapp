import { Button, Typography, Container, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";


export default function StartPage() {
  const navigate = useNavigate();

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
          <Button
            variant="contained"
            disableElevation
            size="large"
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
            onClick={() => navigate("/user")}
          >
            Enter as User
          </Button>

          <Button
            variant="outlined"
            size="large"
            sx={{
              py: 2,
              borderColor: '#e5e7eb',
              color: 'text.primary',
              borderRadius: 2,
              borderWidth: 2,
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: 'secondary.main',
                backgroundColor: 'secondary.main',
                color: '#fff',
                borderWidth: 2,
                transform: 'translateY(-2px)',
              }
            }}
            onClick={() => navigate("/admin")}
          >
            Enter as Admin
          </Button>
        </Box>
      </Box>
    </Container>

  );
}
