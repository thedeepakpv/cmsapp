import { Container, Typography, Box, Button, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Alert, CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { orderService } from "../services/orderService";
import { paymentService } from "../services/paymentService";
import { useAuth } from "../context/AuthContext";

export default function Cartpage({ cartItems, setCartItems }) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successOrder, setSuccessOrder] = useState(null);

  const removeFromCart = (id) => setCartItems(cartItems.filter((item) => item.id !== id));

  const decreaseQuantity = (id) =>
    setCartItems(
      cartItems
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );

  const increaseQuantity = (id) =>
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    );

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const handleCheckout = async () => {
    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const order = await orderService.createOrder({
        customerName: currentUser?.username || "Guest",
        customerPhone: phone.trim(),
        items: cartItems.map(({ id, name, price, quantity }) => ({ id, name, price, quantity })),
        total,
      });

      // Record payment — non-blocking, constraint issues won't stop the QR receipt
      try {
        await paymentService.recordPayment({
          orderId: order.order_id,
          gateway: "cash",
          transactionId: order.order_id,
          amount: total,
        });
      } catch (_payErr) {
        // Payment log is secondary — order already created, show QR anyway
        console.warn("Payment record failed (non-blocking):", _payErr.message);
      }

      setSuccessOrder(order);
      setCartItems([]);
      setCheckoutOpen(false);
    } catch (err) {
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Success / QR Screen ──────────────────────────────────────────────────────
  if (successOrder) {
    return (
      <>
        <Navbar cartCount={0} />
        <Container maxWidth="sm" sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 6 }, textAlign: "center" }}>
          <Typography variant="h4" fontWeight="900" mb={1}>
            🎉 Order Placed!
          </Typography>
          <Typography color="text.secondary" mb={4}>
            Show this QR code at the counter to collect your food.
          </Typography>

          {/* QR Code */}
          <Box
            sx={{
              display: "inline-flex",
              p: 3,
              border: "1px solid #e5e7eb",
              borderRadius: 3,
              backgroundColor: "#fff",
              mb: 3,
              boxShadow: "0 4px 24px -8px rgba(0,0,0,0.08)",
            }}
          >
            <QRCodeSVG value={successOrder.order_id} size={220} level="H" />
          </Box>

          <Box mb={4}>
            <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
              Order ID
            </Typography>
            <Typography
              variant="h6"
              fontWeight="800"
              sx={{ fontFamily: "monospace", letterSpacing: "0.05em" }}
            >
              {successOrder.order_id}
            </Typography>
          </Box>

          <Button
            variant="contained"
            disableElevation
            onClick={() => { setSuccessOrder(null); navigate("/user"); }}
            sx={{
              py: 1.5, px: 4,
              backgroundColor: "primary.main",
              borderRadius: 2,
              "&:hover": { backgroundColor: "#000" },
            }}
          >
            Back to Menu
          </Button>
        </Container>
      </>
    );
  }

  // ── Cart Screen ──────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar cartCount={cartCount} />

      <Container maxWidth="sm" sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 4 } }}>
        <Box display="flex" alignItems="center" mb={4}>
          <IconButton
            disableRipple
            onClick={() => navigate("/user")}
            sx={{ mr: 2, border: "1px solid #e5e7eb", borderRadius: "50%", "&:hover": { backgroundColor: "#f3f4f6" } }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="900" letterSpacing="-0.03em">Your Cart</Typography>
        </Box>

        {cartItems.length === 0 ? (
          <Box textAlign="center" py={8} sx={{ border: "1px dashed #e5e7eb", borderRadius: 3 }}>
            <Typography color="text.secondary">Your cart is empty</Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {cartItems.map((item) => (
              <Box
                key={item.id}
                display="flex"
                alignItems="center"
                p={2}
                sx={{ border: "1px solid #e5e7eb", borderRadius: 3, backgroundColor: "#fff", transition: "0.2s", "&:hover": { borderColor: "#d1d5db" } }}
              >
                <Box flexGrow={1}>
                  <Typography fontWeight="600" color="text.primary">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight="500">₹ {item.price}</Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1} mr={3} sx={{ backgroundColor: "#f9fafb", borderRadius: 2, p: 0.5, border: "1px solid #f3f4f6" }}>
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
                  sx={{ minWidth: "auto", p: 1, textTransform: "none", fontWeight: 600 }}
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
                onClick={() => setCheckoutOpen(true)}
                sx={{
                  py: 2,
                  backgroundColor: "primary.main",
                  borderRadius: 2,
                  fontSize: "1.1rem",
                  transition: "all 0.2s",
                  "&:hover": { backgroundColor: "#000", transform: "translateY(-2px)" },
                }}
              >
                Checkout
              </Button>
            </Box>
          </Box>
        )}
      </Container>

      {/* Checkout Dialog */}
      <Dialog open={checkoutOpen} onClose={() => setCheckoutOpen(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle fontWeight="800">Complete Your Order</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" mb={2}>Enter your phone number to place the order.</Typography>
          <TextField
            label="Phone Number"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputProps={{ maxLength: 15 }}
            onKeyDown={(e) => e.key === "Enter" && handleCheckout()}
          />
          {error && <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{error}</Alert>}
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button onClick={() => setCheckoutOpen(false)} sx={{ color: "text.secondary", fontWeight: 600 }}>Cancel</Button>
          <Button
            variant="contained"
            disableElevation
            disabled={loading}
            onClick={handleCheckout}
            sx={{ fontWeight: 600, borderRadius: 2 }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : `Pay ₹${total}`}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
