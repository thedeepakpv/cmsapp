import { Container, Typography, Box, Button, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Cartpage({ cartItems, setCartItems }) {

  const navigate = useNavigate();

  const removeFromCart = (id) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
  };

  const decreaseQuantity = (id) => {
    const updated = cartItems
      .map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter(item => item.quantity > 0);

    setCartItems(updated);
  };

  const increaseQuantity = (id) => {
    const updated = cartItems.map(item =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    setCartItems(updated);
  };


  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );


  return (
    <>
      <Navbar />

      <Container maxWidth="sm" sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 4 } }}>
        <Box display="flex" alignItems="center" mb={4}>
          <IconButton
            disableRipple
            onClick={() => navigate("/user")}
            sx={{
              mr: 2,
              border: '1px solid #e5e7eb',
              borderRadius: '50%',
              '&:hover': { backgroundColor: '#f3f4f6' }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="900" letterSpacing="-0.03em">
            Your Cart
          </Typography>
        </Box>

        {cartItems.length === 0 ? (
          <Box textAlign="center" py={8} sx={{ border: '1px dashed #e5e7eb', borderRadius: 3 }}>
            <Typography color="text.secondary">Your cart is empty</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {cartItems.map(item => (
              <Box
                key={item.id}
                display="flex"
                alignItems="center"
                p={2}
                sx={{
                  border: '1px solid #e5e7eb',
                  borderRadius: 3,
                  backgroundColor: '#fff',
                  transition: '0.2s',
                  '&:hover': { borderColor: '#d1d5db' }
                }}
              >
                <Box flexGrow={1}>
                  <Typography fontWeight="600" color="text.primary">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight="500">
                    ₹ {item.price}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1} mr={3} sx={{ backgroundColor: '#f9fafb', borderRadius: 2, p: 0.5, border: '1px solid #f3f4f6' }}>
                  <IconButton size="small" onClick={() => decreaseQuantity(item.id)} disableRipple>
                    <Typography fontWeight="bold" color="text.primary">-</Typography>
                  </IconButton>
                  <Typography fontWeight="600" width={20} textAlign="center">{item.quantity}</Typography>
                  <IconButton size="small" onClick={() => increaseQuantity(item.id)} disableRipple>
                    <Typography fontWeight="bold" color="text.primary">+</Typography>
                  </IconButton>
                </Box>

                <Button
                  color="error"
                  size="small"
                  onClick={() => removeFromCart(item.id)}
                  sx={{ minWidth: 'auto', p: 1, textTransform: 'none', fontWeight: 600 }}
                >
                  Remove
                </Button>
              </Box>
            ))}

            <Box mt={4} pt={3} borderTop="1px solid #e5e7eb">
              <Box display="flex" justifyContent="space-between" mb={3}>
                <Typography variant="h6" color="text.secondary">Total</Typography>
                <Typography variant="h5" fontWeight="900">₹ {total}</Typography>
              </Box>

              <Button
                variant="contained"
                disableElevation
                fullWidth
                size="large"
                sx={{
                  py: 2,
                  backgroundColor: 'primary.main',
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: '#000',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Checkout
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </>
  );
}
