import {
    Container, Typography, Box, CircularProgress, Alert,
    Chip, Accordion, AccordionSummary, AccordionDetails, Divider
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { orderService } from "../services/orderService";
import { useAuth } from "../context/AuthContext";

export default function MyOrders() {
    const { currentUser } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!currentUser) return;
        orderService
            .getOrdersByCustomer(currentUser.username)
            .then(setOrders)
            .catch(() => setError("Failed to load your orders. Please refresh."))
            .finally(() => setLoading(false));
    }, [currentUser]);

    return (
        <>
            <Navbar />
            <Container maxWidth="sm" sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 6 } }}>
                <Typography variant="h4" fontWeight="900" letterSpacing="-0.03em" mb={4}>
                    My Orders
                </Typography>

                {loading && (
                    <Box display="flex" justifyContent="center" py={8}>
                        <CircularProgress />
                    </Box>
                )}

                {error && (
                    <Alert severity="error" sx={{ borderRadius: 2, mb: 3 }}>{error}</Alert>
                )}

                {!loading && !error && orders.length === 0 && (
                    <Box
                        textAlign="center"
                        py={8}
                        sx={{ border: "1px dashed #e5e7eb", borderRadius: 3 }}
                    >
                        <Typography color="text.secondary">You haven't placed any orders yet.</Typography>
                    </Box>
                )}

                {!loading && orders.map((order) => (
                    <Accordion
                        key={order.id}
                        disableGutters
                        elevation={0}
                        sx={{
                            mb: 2,
                            border: "1px solid #e5e7eb",
                            borderRadius: "12px !important",
                            "&:before": { display: "none" },
                            overflow: "hidden",
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{ px: 3, py: 1.5 }}
                        >
                            <Box flex={1}>
                                <Box display="flex" alignItems="center" gap={1.5} mb={0.5}>
                                    <Typography fontWeight="800" fontSize="0.95rem" fontFamily="monospace">
                                        {order.order_id}
                                    </Typography>
                                    <Chip
                                        label={order.redeemed ? "Redeemed" : "Active"}
                                        size="small"
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: "0.7rem",
                                            backgroundColor: order.redeemed ? "#f3f4f6" : "#ecfdf5",
                                            color: order.redeemed ? "#6b7280" : "#065f46",
                                            border: order.redeemed ? "1px solid #e5e7eb" : "1px solid #10b981",
                                        }}
                                    />
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    ₹{order.total} &nbsp;·&nbsp;{" "}
                                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                                        day: "numeric", month: "short", year: "numeric",
                                        hour: "2-digit", minute: "2-digit",
                                    })}
                                </Typography>
                            </Box>
                        </AccordionSummary>

                        <AccordionDetails sx={{ px: 3, pb: 3 }}>
                            <Divider sx={{ mb: 2 }} />

                            {/* Items list */}
                            {Array.isArray(order.items) && order.items.map((item, i) => (
                                <Box key={i} display="flex" justifyContent="space-between" mb={0.75}>
                                    <Typography variant="body2" color="text.primary">
                                        {item.name} × {item.quantity}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                        ₹{item.price * item.quantity}
                                    </Typography>
                                </Box>
                            ))}

                            <Box display="flex" justifyContent="space-between" mt={1.5} pt={1.5} borderTop="1px solid #e5e7eb">
                                <Typography fontWeight="700">Total</Typography>
                                <Typography fontWeight="800">₹{order.total}</Typography>
                            </Box>

                            {/* QR Code */}
                            {!order.redeemed ? (
                                <Box textAlign="center" mt={3}>
                                    <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
                                        Show this at the counter to collect your order
                                    </Typography>
                                    <Box
                                        display="inline-flex"
                                        p={2.5}
                                        sx={{
                                            border: "1px solid #e5e7eb",
                                            borderRadius: 3,
                                            backgroundColor: "#fff",
                                            boxShadow: "0 4px 16px -8px rgba(0,0,0,0.08)",
                                        }}
                                    >
                                        <QRCodeSVG value={order.order_id} size={180} level="H" />
                                    </Box>
                                </Box>
                            ) : (
                                <Box
                                    mt={3}
                                    py={2}
                                    textAlign="center"
                                    sx={{ backgroundColor: "#f9fafb", borderRadius: 2 }}
                                >
                                    <Typography fontWeight="700" color="text.secondary">
                                        ✅ This order has been collected
                                    </Typography>
                                </Box>
                            )}
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Container>
        </>
    );
}
