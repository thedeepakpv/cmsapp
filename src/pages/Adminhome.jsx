import { Typography, Container, Button, Box, CircularProgress, Alert, Chip, Divider } from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import BarChartIcon from "@mui/icons-material/BarChart";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { orderService } from "../services/orderService";

export default function AdminHome() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("dashboard"); // "dashboard" | "orders"
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    orderService.getAllOrders()
      .then(setOrders)
      .catch(() => setError("Failed to load orders."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (view === "orders") fetchOrders();
  }, [view]);

  const handleRedeem = async (orderId) => {
    setUpdatingId(orderId);
    try {
      await orderService.markRedeemed(orderId);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, redeemed: true } : o));
    } catch {
      // silently fail — UX acceptable for now
    } finally {
      setUpdatingId(null);
    }
  };

  const statusColor = (status) => {
    if (status === "paid") return "success";
    if (status === "pending") return "warning";
    return "default";
  };

  if (view === "orders") {
    return (
      <>
        <Navbar />

        <Container sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 6 } }}>
          <Box display="flex" alignItems="center" mb={4} gap={2}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setView("dashboard")}
              sx={{ borderColor: '#e5e7eb', color: 'text.primary', fontWeight: 600 }}
            >
              ← Back
            </Button>
            <Typography variant="h4" fontWeight="900" letterSpacing="-0.03em">Orders</Typography>

            <Button
              size="small"
              onClick={fetchOrders}
              sx={{ ml: 'auto', fontWeight: 600, color: 'text.secondary' }}
            >
              Refresh
            </Button>
          </Box>

          {loading && <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>}
          {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

          {!loading && !error && orders.length === 0 && (
            <Box textAlign="center" py={8} sx={{ border: '1px dashed #e5e7eb', borderRadius: 3 }}>
              <Typography color="text.secondary">No orders yet</Typography>
            </Box>
          )}

          {!loading && orders.map((order) => (
            <Box
              key={order.id}
              p={3}
              mb={2}
              sx={{
                border: '1px solid #e5e7eb',
                borderRadius: 3,
                backgroundColor: order.redeemed ? '#f9fafb' : '#fff',
                opacity: order.redeemed ? 0.7 : 1,
                transition: '0.2s'
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                <Box>
                  <Typography fontWeight="700" sx={{ fontFamily: 'monospace' }}>{order.order_id}</Typography>
                  <Typography variant="body2" color="text.secondary">{order.customer_name} · {order.customer_phone}</Typography>
                </Box>
                <Box display="flex" gap={1} alignItems="center">
                  <Chip label={order.payment_status} color={statusColor(order.payment_status)} size="small" />
                  {order.redeemed && <Chip label="Redeemed" size="small" />}
                </Box>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              {Array.isArray(order.items) && order.items.map((it, i) => (
                <Box key={i} display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">{it.name} × {it.quantity}</Typography>
                  <Typography variant="body2" fontWeight="600">₹{it.price * it.quantity}</Typography>
                </Box>
              ))}

              <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                <Typography fontWeight="800">Total: ₹{order.total}</Typography>
                {!order.redeemed && (
                  <Button
                    variant="contained"
                    disableElevation
                    size="small"
                    disabled={updatingId === order.id}
                    onClick={() => handleRedeem(order.id)}
                    sx={{ backgroundColor: 'primary.main', fontWeight: 600, borderRadius: 2, '&:hover': { backgroundColor: '#000' } }}
                  >
                    {updatingId === order.id ? <CircularProgress size={16} color="inherit" /> : "Mark Redeemed"}
                  </Button>
                )}
              </Box>
            </Box>
          ))}
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <Container maxWidth="sm" sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 6 }, mt: 4 }}>
        <Typography variant="h4" mb={4} fontWeight="900" letterSpacing="-0.03em" textAlign="center">
          Admin Dashboard
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            { label: "Update Menu", action: () => navigate("/updatemenu") },
            { label: "View Orders", action: () => setView("orders") },
            { label: "Scan QR / Verify Order", action: () => navigate("/scanner"), icon: <QrCodeScannerIcon sx={{ mr: 1 }} /> },
            { label: "Analytics & Reports", action: () => navigate("/analytics"), icon: <BarChartIcon sx={{ mr: 1 }} /> },
          ].map(({ label, action, icon }) => (
            <Button
              key={label}
              variant="contained"
              disableElevation
              size="large"
              onClick={action}
              startIcon={icon || null}
              sx={{
                py: 2,
                backgroundColor: 'primary.main',
                borderRadius: 2,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { backgroundColor: '#000', transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
              }}
            >
              {label}
            </Button>
          ))}
        </Box>
      </Container>
    </>
  );
}
