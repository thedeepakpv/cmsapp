import { Typography, Grid, Container, CircularProgress, Box, Alert, Chip } from "@mui/material";
import MenuCard from "../components/MenuCard";
import Navbar from "../components/Navbar";
import { useEffect, useState, useMemo } from "react";
import { menuService } from "../services/menuService";

export default function UserHome({ cartItems, setCartItems }) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    menuService
      .getAll()
      .then(setMenuItems)
      .catch(() => setError("Failed to load menu. Please refresh."))
      .finally(() => setLoading(false));
  }, []);

  const addToCart = (item) => {
    const existing = cartItems.find((i) => i.id === item.id);
    if (existing) {
      setCartItems(cartItems.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(menuItems.map((i) => i.category).filter(Boolean))];
    return ["All", ...cats];
  }, [menuItems]);

  const filtered = useMemo(
    () => selectedCategory === "All"
      ? menuItems
      : menuItems.filter((i) => i.category === selectedCategory),
    [menuItems, selectedCategory]
  );

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      <Navbar cartCount={cartCount} />

      <Container sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 6 } }}>
        <Typography variant="h4" mb={3} fontWeight="900" letterSpacing="-0.03em">
          Available Menu
        </Typography>

        {/* Category Filter Chips */}
        {!loading && categories.length > 1 && (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 4 }}>
            {categories.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                clickable
                onClick={() => setSelectedCategory(cat)}
                variant={selectedCategory === cat ? "filled" : "outlined"}
                sx={{
                  fontWeight: 600,
                  backgroundColor: selectedCategory === cat ? "primary.main" : "transparent",
                  color: selectedCategory === cat ? "#fff" : "text.primary",
                  borderColor: selectedCategory === cat ? "primary.main" : "#e5e7eb",
                  transition: "all 0.15s",
                  "&:hover": {
                    backgroundColor: selectedCategory === cat ? "#000" : "#f3f4f6",
                  },
                }}
              />
            ))}
          </Box>
        )}

        {loading && (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ borderRadius: 2, mb: 3 }}>{error}</Alert>
        )}

        {!loading && !error && filtered.length === 0 && (
          <Box textAlign="center" py={8} sx={{ border: "1px dashed #e5e7eb", borderRadius: 3 }}>
            <Typography color="text.secondary">No items in this category</Typography>
          </Box>
        )}

        {!loading && !error && (
          <Grid container spacing={3}>
            {filtered.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <MenuCard item={item} addToCart={addToCart} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}
