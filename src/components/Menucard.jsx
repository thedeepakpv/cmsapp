import { Card, CardContent, CardMedia, Typography, Button, Box } from "@mui/material";

export default function MenuCard({ item, addToCart, cartQty = 0 }) {
  const isAvailable = Boolean(item.available) && (item.stock == null || item.stock > 0);
  const atMax = item.stock != null && cartQty >= item.stock;

  return (
    <Card
      elevation={0}
      sx={{
        width: '100%',
        minWidth: 250,
        border: '1px solid #e5e7eb',
        borderRadius: 3,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: isAvailable ? 'pointer' : 'not-allowed',
        opacity: isAvailable ? 1 : 0.6,
        '&:hover': isAvailable ? {
          borderColor: '#d1d5db',
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px -10px rgba(0,0,0,0.05)',
        } : {},
      }}
    >
      <Box sx={{ position: 'relative' }}>
        {item.image ? (
          <CardMedia
            component="img"
            height="180"
            image={item.image}
            alt={item.name}
            sx={{ filter: isAvailable ? 'none' : 'grayscale(100%)' }}
          />
        ) : (
          <Box sx={{ height: 180, backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="srOnly">No image available</Typography>
          </Box>
        )}
        <Box sx={{
          position: 'absolute', top: 12, right: 12,
          display: 'flex', alignItems: 'center', gap: 1,
          backgroundColor: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(4px)',
          px: 1.5, py: 0.5, borderRadius: 5,
          border: '1px solid rgba(0,0,0,0.05)'
        }}>
          <Box sx={{
            width: 8, height: 8, borderRadius: '50%',
            backgroundColor: isAvailable ? 'success.main' : 'text.disabled'
          }} />
          <Typography variant="caption" fontWeight="600" sx={{ color: 'text.primary' }}>
            {isAvailable ? 'Available' : 'Sold Out'}
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ pt: 2, pb: '16px !important' }}>
        <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 0.5, color: 'text.primary', fontWeight: 600 }}>
          {item.name}
        </Typography>

        {/* Stock count for users */}
        <Typography variant="caption" sx={{ color: isAvailable ? 'text.secondary' : '#ef4444', fontWeight: 500 }}>
          {isAvailable
            ? item.stock != null
              ? `${item.stock} left in stock`
              : 'In Stock'
            : 'Out of Stock'}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 2 }}>
          <Typography variant="subtitle1" fontWeight="700" sx={{ color: 'text.primary' }}>
            ₹{item.price}
          </Typography>

          <Button
            size="small"
            variant="outlined"
            disableElevation
            disabled={!isAvailable || atMax}
            onClick={() => addToCart(item)}
            sx={{
              borderColor: atMax ? '#e5e7eb' : '#e5e7eb',
              color: atMax ? 'text.disabled' : 'text.primary',
              textTransform: 'none',
              fontWeight: 500,
              transition: 'all 0.2s',
              '&:hover': !atMax ? {
                backgroundColor: 'secondary.main',
                color: '#fff',
                borderColor: 'secondary.main',
                transform: 'translateY(-1px)',
              } : {},
            }}
          >
            {atMax ? 'Max' : 'Add'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
