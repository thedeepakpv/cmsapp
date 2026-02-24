import { Card, CardContent, CardMedia, Typography, Button, Box } from "@mui/material";

export default function MenuCard({ item, addToCart }) {
  return (
    <Card
      sx={{
        width: 250,
        margin: 2,
        transition: "0.3s",
        opacity: item.available ? 1 : 0.5,
        backgroundColor: item.available ? "#e8f5e9" : "#fce4ec",
        "&:hover": {
          transform: item.available ? "scale(1.03)" : "none"
        }
      }}
    >
      {item.image && (
        <CardMedia
          component="img"
          height="140"
          image={item.image}
          alt={item.name}
        />
      )}

      <CardContent>
        <Typography variant="h6" gutterBottom>
          {item.name}
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Price: ₹{item.price}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: item.available ? "green" : "red",
            fontWeight: "bold",
            mt: 1
          }}
        >
          {item.available ? "Available" : "Not Available"}
        </Typography>

        <Box mt={2}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            disabled={!item.available}
            onClick={() => addToCart(item)}
          >
            Add to cart
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
