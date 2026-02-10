import { Button, Typography, Container, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";


export default function StartPage() {
  const navigate = useNavigate();

  return (
  

    <Container maxWidth="sm">
      <Box textAlign="center" mt={17}>
        <Typography variant="h4" gutterBottom>
          Canteen Management System
        </Typography>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={() => navigate("/user")}
        >
          Enter as User
        </Button>

        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 3 }}
          onClick={() => navigate("/admin")}
        >
          Enter as Admin
        </Button>
      </Box>
    </Container>

  );
}
