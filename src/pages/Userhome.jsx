import { Typography, Grid, Container } from "@mui/material";
import MenuCard from "../components/MenuCard";
import Navbar from "../components/Navbar";

export default function UserHome() {

  const dummyMenu = [
    { id: 1, name: "Biriyani", price: 120, available: true },
    { id: 2, name: "Fried Rice", price: 90, available: true },
    { id: 3, name: "Meals", price: 70, available: false }
  ];

  return (
    <>
      <Navbar />

      <Container>
        <Typography variant="h5" mt={4} mb={2}>
          Available Menu
        </Typography>

        <Grid container spacing={2}>
          {dummyMenu.map((item) => (
            <Grid item xs={12} md={4} key={item.id}>
              <MenuCard item={item} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
