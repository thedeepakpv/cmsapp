import { Typography, Grid, Container } from "@mui/material";
import MenuCard from "../components/MenuCard";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function UserHome({ cartItems, setCartItems, menuItems }) {

  const navigate = useNavigate();

  const addToCart = (item) => {
    const existing = cartItems.find(i => i.id === item.id);

    if (existing) {
      const updated = cartItems.map(i =>
        i.id === item.id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      );
      setCartItems(updated);
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };



  return (
    <>
      <Navbar />

      <Container sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 6 } }}>
        <Typography variant="h4" mb={4} fontWeight="900" letterSpacing="-0.03em">
          Available Menu
        </Typography>

        <Grid container spacing={3}>
          {menuItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <MenuCard item={item} addToCart={addToCart} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
