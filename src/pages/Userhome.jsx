import { Typography, Grid, Container } from "@mui/material";
import MenuCard from "../components/MenuCard";
import Navbar from "../components/Navbar";

export default function UserHome({ menuItems }) {

  return (
    <>
      <Navbar />

      <Container>
        <Typography variant="h5" mt={4} mb={2}>
          Available Menu
        </Typography>

        <Grid container spacing={2}>
          {menuItems.map((item) => (
            <Grid item xs={12} md={4} key={item.id}>
              <MenuCard item={item} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
