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

      <Container maxWidth="sm">
        <Box display="flex" alignItems="center" mt={1} mb={2}>

        <IconButton onClick={() => navigate("/user")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" ml={1}>
          Your Cart
        </Typography>

        </Box>

        {cartItems.length === 0 && (
          <Typography ml={1}>No items in cart</Typography>
        )}

        {cartItems.map(item => (
          <Box
            key={item.id}
            display="flex"
            justifyContent="space-between"
            mb={2}
            p={2}
            border="1px solid #ccc"
            borderRadius="10px"
          >
            <Typography>{item.name}</Typography>
            <Typography>₹ {item.price}</Typography>
             
            <Box display="flex" alignItems="center" gap={1}>
            <Button onClick={() => decreaseQuantity(item.id)}>-</Button>

            <Typography>{item.quantity}</Typography>

            <Button onClick={() => increaseQuantity(item.id)}>+</Button>
            </Box>


            <Button
              color="error"
              onClick={() => removeFromCart(item.id)}
            >
              Remove
            </Button>
          </Box>
        ))}

        {cartItems.length > 0 && (
          <>
            <Typography mt={2}>
              <b>Total: ₹ {total}</b>
            </Typography>

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
            >
              Checkout
            </Button>
          </>
        )}
      </Container>
    </>
  );
}
