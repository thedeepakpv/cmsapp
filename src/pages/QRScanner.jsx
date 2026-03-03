import { Container, Typography, Box, Button, Alert, CircularProgress } from "@mui/material";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import { orderService } from "../services/orderService";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScanner() {
    const navigate = useNavigate();
    const scannerRef = useRef(null);
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null);   // { success, order, error }
    const [loading, setLoading] = useState(false);

    const onScanSuccess = useCallback(async (decodedText) => {
        if (loading || result) return; // prevent duplicate scan handling

        // Stop scanner immediately to avoid repeat triggers
        if (scannerRef.current?.isScanning) {
            await scannerRef.current.stop();
            setScanning(false);
        }

        setLoading(true);
        try {
            // Look up order by order_id encoded in QR
            const order = await orderService.getOrderByOrderId(decodedText);

            if (order.redeemed) {
                setResult({ success: false, order, error: "This order has already been redeemed." });
                return;
            }

            const updated = await orderService.markRedeemedByOrderId(decodedText);
            setResult({ success: true, order: updated });
        } catch {
            setResult({ success: false, error: "Invalid QR code or order not found." });
        } finally {
            setLoading(false);
        }
    }, [loading, result]);

    useEffect(() => {
        const html5Qrcode = new Html5Qrcode("qr-reader");
        scannerRef.current = html5Qrcode;

        // Start scanning
        html5Qrcode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            onScanSuccess,
            () => { } // ignore per-frame errors
        )
            .then(() => setScanning(true))
            .catch(() => {
                setResult({ success: false, error: "Camera access denied. Please allow camera permission." });
            });

        return () => {
            html5Qrcode.isScanning && html5Qrcode.stop().catch(() => { });
        };
    }, [onScanSuccess]);

    const reset = () => {
        setResult(null);
        setLoading(false);
        // Restart the scanner
        const html5Qrcode = new Html5Qrcode("qr-reader");
        scannerRef.current = html5Qrcode;
        html5Qrcode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            onScanSuccess,
            () => { }
        ).then(() => setScanning(true)).catch(() => { });
    };

    return (
        <>
            <Navbar />

            <Container maxWidth="sm" sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 6 }, textAlign: "center" }}>
                <Box display="flex" alignItems="center" mb={4} justifyContent="space-between">
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate("/admin")}
                        sx={{ borderColor: "#e5e7eb", color: "text.primary", fontWeight: 600 }}
                    >
                        ← Back
                    </Button>
                    <Typography variant="h5" fontWeight="900" letterSpacing="-0.02em">QR Scanner</Typography>
                    <Box width={60} />
                </Box>

                {/* QR Reader div — html5-qrcode mounts here */}
                <Box
                    id="qr-reader"
                    sx={{
                        width: "100%",
                        borderRadius: 3,
                        overflow: "hidden",
                        border: "1px solid #e5e7eb",
                        backgroundColor: "#000",
                        mb: 3,
                        display: result ? "none" : "block",
                    }}
                />

                {loading && (
                    <Box py={4}>
                        <CircularProgress />
                        <Typography mt={2} color="text.secondary">Verifying order…</Typography>
                    </Box>
                )}

                {result?.success && (
                    <Box p={4} sx={{ border: "1px solid #10b981", borderRadius: 3, backgroundColor: "#ecfdf5" }}>
                        <Typography variant="h5" fontWeight="900" color="#065f46" mb={1}>✅ Order Verified!</Typography>
                        <Typography color="#065f46" mb={1} fontWeight={600}>{result.order.order_id}</Typography>
                        <Typography color="#065f46" mb={3}>Customer: {result.order.customer_name} · {result.order.customer_phone}</Typography>
                        {Array.isArray(result.order.items) && result.order.items.map((it, i) => (
                            <Typography key={i} variant="body2" color="#065f46">{it.name} × {it.quantity}</Typography>
                        ))}
                        <Typography fontWeight="800" color="#065f46" mt={1}>Total: ₹{result.order.total}</Typography>

                        <Button
                            variant="contained"
                            disableElevation
                            fullWidth
                            onClick={reset}
                            sx={{ mt: 3, backgroundColor: "#065f46", borderRadius: 2, "&:hover": { backgroundColor: "#047857" } }}
                        >
                            Scan Another
                        </Button>
                    </Box>
                )}

                {result && !result.success && (
                    <Box>
                        <Alert severity="error" sx={{ borderRadius: 2, mb: 3, textAlign: "left" }}>
                            {result.error}
                        </Alert>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={reset}
                            sx={{ borderColor: "#e5e7eb", color: "text.primary", fontWeight: 600 }}
                        >
                            Try Again
                        </Button>
                    </Box>
                )}

                {scanning && !result && !loading && (
                    <Typography variant="caption" color="text.secondary">
                        Point the camera at the customer's QR code
                    </Typography>
                )}
            </Container>
        </>
    );
}
