import {
    Container, Typography, Box, CircularProgress, Alert,
    Divider, Chip, IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyticsService } from "../services/analyticsService";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

// ── Shared palette for pie chart ──────────────────────────────────────────
const PIE_COLORS = ["#1a1a1a", "#ff6f00", "#10b981", "#6366f1", "#f59e0b", "#ef4444"];

// ── Stat card ─────────────────────────────────────────────────────────────
function StatCard({ label, value, sub }) {
    return (
        <Box
            p={2.5}
            sx={{
                border: "1px solid #e5e7eb",
                borderRadius: 3,
                backgroundColor: "#fff",
                flex: "1 1 160px",
                minWidth: 140,
            }}
        >
            <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={0.5}>
                {label}
            </Typography>
            <Typography variant="h5" fontWeight={900} letterSpacing="-0.02em" color="text.primary">
                {value}
            </Typography>
            {sub && (
                <Typography variant="caption" color="text.secondary">{sub}</Typography>
            )}
        </Box>
    );
}

// ── Section wrapper ───────────────────────────────────────────────────────
function Section({ title, children }) {
    return (
        <Box mb={5}>
            <Typography variant="h6" fontWeight={800} letterSpacing="-0.01em" mb={2}>
                {title}
            </Typography>
            <Divider sx={{ mb: 3 }} />
            {children}
        </Box>
    );
}

// ── Simple data table ─────────────────────────────────────────────────────
function DataTable({ rows, cols }) {
    return (
        <Box sx={{ border: "1px solid #e5e7eb", borderRadius: 2, overflow: "hidden" }}>
            {/* Header */}
            <Box
                display="flex"
                sx={{ backgroundColor: "#f9fafb", px: 2, py: 1.2, borderBottom: "1px solid #e5e7eb" }}
            >
                {cols.map((c) => (
                    <Typography
                        key={c.key}
                        variant="caption"
                        fontWeight={700}
                        color="text.secondary"
                        sx={{ flex: c.flex ?? 1, textTransform: "uppercase", letterSpacing: "0.05em" }}
                    >
                        {c.label}
                    </Typography>
                ))}
            </Box>
            {rows.length === 0 ? (
                <Box px={2} py={3} textAlign="center">
                    <Typography variant="body2" color="text.secondary">No data</Typography>
                </Box>
            ) : (
                rows.map((row, i) => (
                    <Box
                        key={i}
                        display="flex"
                        sx={{
                            px: 2, py: 1.5,
                            borderBottom: i < rows.length - 1 ? "1px solid #f3f4f6" : "none",
                            backgroundColor: i % 2 === 0 ? "#fff" : "#fafafa",
                        }}
                    >
                        {cols.map((c) => (
                            <Typography key={c.key} variant="body2" color="text.primary" sx={{ flex: c.flex ?? 1 }}>
                                {c.render ? c.render(row[c.key], row) : row[c.key]}
                            </Typography>
                        ))}
                    </Box>
                ))
            )}
        </Box>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function Analytics() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [revenue, setRevenue] = useState(null);
    const [orders, setOrdersData] = useState(null);
    const [sales, setSales] = useState(null);
    const [inventory, setInventory] = useState(null);
    const [payments, setPayments] = useState(null);

    useEffect(() => {
        Promise.all([
            analyticsService.getRevenueSummary(),
            analyticsService.getOrdersSummary(),
            analyticsService.getSalesReport(),
            analyticsService.getInventoryInsights(),
            analyticsService.getPaymentReport(),
        ])
            .then(([rev, ord, sal, inv, pay]) => {
                setRevenue(rev);
                setOrdersData(ord);
                setSales(sal);
                setInventory(inv);
                setPayments(pay);
            })
            .catch(() => setError("Failed to load analytics. Please refresh."))
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <Navbar />
            <Container sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 6 } }}>

                {/* Header */}
                <Box display="flex" alignItems="center" mb={5}>
                    <IconButton
                        disableRipple
                        onClick={() => navigate("/admin")}
                        sx={{ mr: 2, border: "1px solid #e5e7eb", borderRadius: "50%", "&:hover": { backgroundColor: "#f3f4f6" } }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Box>
                        <Typography variant="h4" fontWeight={900} letterSpacing="-0.03em">
                            Analytics & Reports
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mt={0.5}>
                            Data pulled live from Supabase
                        </Typography>
                    </Box>
                </Box>

                {loading && (
                    <Box display="flex" justifyContent="center" py={10}>
                        <CircularProgress />
                    </Box>
                )}

                {error && <Alert severity="error" sx={{ borderRadius: 2, mb: 4 }}>{error}</Alert>}

                {!loading && !error && (
                    <>
                        {/* ── 1. Revenue Summary ──────────────────────────────────────── */}
                        <Section title="1. Revenue Summary">
                            <Box display="flex" flexWrap="wrap" gap={2} mb={4}>
                                <StatCard label="Today's Income" value={`₹${revenue.todayRevenue}`} />
                                <StatCard label="Monthly Income" value={`₹${revenue.monthRevenue}`} />
                                <StatCard label="Total Revenue" value={`₹${revenue.totalRevenue}`} sub="All time (paid orders)" />
                            </Box>

                            <Typography variant="body2" color="text.secondary" fontWeight={600} mb={1.5}>
                                Revenue — Last 14 Days
                            </Typography>
                            <Box sx={{ border: "1px solid #e5e7eb", borderRadius: 3, p: 2, backgroundColor: "#fff" }}>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={revenue.graph} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                        <Tooltip
                                            formatter={(v) => [`₹${v}`, "Revenue"]}
                                            contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
                                        />
                                        <Bar dataKey="revenue" fill="#1a1a1a" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </Section>

                        {/* ── 2. Orders Summary ───────────────────────────────────────── */}
                        <Section title="2. Orders Summary">
                            <Box display="flex" flexWrap="wrap" gap={2}>
                                <StatCard label="Orders Today" value={orders.todayOrders} />
                                <StatCard label="Orders This Month" value={orders.monthOrders} />
                                <StatCard label="Unique Customers" value={orders.totalCustomers} />
                                <StatCard label="Avg Order Value" value={`₹${orders.avgOrderValue}`} />
                            </Box>
                        </Section>

                        {/* ── 3. Sales Report ─────────────────────────────────────────── */}
                        <Section title="3. Sales Report">
                            <Box display="flex" flexWrap="wrap" gap={4} mb={4} alignItems="flex-start">
                                {/* Top 5 */}
                                <Box flex="1" minWidth={260}>
                                    <Typography variant="body2" fontWeight={700} mb={1.5} color="text.secondary">
                                        TOP 5 BEST SELLERS
                                    </Typography>
                                    <DataTable
                                        rows={sales.top5}
                                        cols={[
                                            { key: "name", label: "Item", flex: 2 },
                                            { key: "qty", label: "Qty Sold", flex: 1 },
                                        ]}
                                    />
                                    {sales.leastSold && (
                                        <Box mt={2} p={2} sx={{ border: "1px solid #fee2e2", borderRadius: 2, backgroundColor: "#fff5f5" }}>
                                            <Typography variant="caption" fontWeight={700} color="error.main">LEAST SOLD</Typography>
                                            <Typography variant="body2" mt={0.5}>
                                                {sales.leastSold.name} — {sales.leastSold.qty} sold
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>

                                {/* Category breakdown pie */}
                                {sales.categoryBreakdown.length > 0 && (
                                    <Box flex="1" minWidth={240}>
                                        <Typography variant="body2" fontWeight={700} mb={1.5} color="text.secondary">
                                            CATEGORY BREAKDOWN
                                        </Typography>
                                        <Box sx={{ border: "1px solid #e5e7eb", borderRadius: 3, p: 1, backgroundColor: "#fff" }}>
                                            <ResponsiveContainer width="100%" height={220}>
                                                <PieChart>
                                                    <Pie
                                                        data={sales.categoryBreakdown}
                                                        dataKey="qty"
                                                        nameKey="name"
                                                        cx="50%"
                                                        cy="50%"
                                                        outerRadius={75}
                                                        label={({ name, percent }) =>
                                                            `${name} ${(percent * 100).toFixed(0)}%`
                                                        }
                                                        labelLine={false}
                                                    >
                                                        {sales.categoryBreakdown.map((_, idx) => (
                                                            <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip formatter={(v) => [`${v} units`, ""]} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    </Box>
                                )}
                            </Box>

                            {/* All items table */}
                            <Typography variant="body2" fontWeight={700} mb={1.5} color="text.secondary">
                                ALL ITEMS — QTY SOLD
                            </Typography>
                            <DataTable
                                rows={sales.allItems}
                                cols={[
                                    { key: "name", label: "Item", flex: 3 },
                                    { key: "qty", label: "Qty Sold", flex: 1 },
                                ]}
                            />
                        </Section>

                        {/* ── 4. Inventory Insights ───────────────────────────────────── */}
                        <Section title="4. Inventory Insights">
                            <Box display="flex" flexWrap="wrap" gap={4} mb={4} alignItems="flex-start">
                                {/* Out of stock */}
                                <Box flex="1" minWidth={220}>
                                    <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                                        <Typography variant="body2" fontWeight={700} color="text.secondary">
                                            OUT OF STOCK
                                        </Typography>
                                        <Chip
                                            label={inventory.outOfStock.length}
                                            size="small"
                                            sx={{ backgroundColor: "#fef2f2", color: "#991b1b", fontWeight: 700 }}
                                        />
                                    </Box>
                                    {inventory.outOfStock.length === 0 ? (
                                        <Box p={2} sx={{ border: "1px solid #e5e7eb", borderRadius: 2, textAlign: "center" }}>
                                            <Typography variant="body2" color="text.secondary">All items in stock 🎉</Typography>
                                        </Box>
                                    ) : (
                                        <DataTable
                                            rows={inventory.outOfStock}
                                            cols={[
                                                { key: "name", label: "Item", flex: 2 },
                                                { key: "stock", label: "Stock", flex: 1, render: (v) => v ?? 0 },
                                            ]}
                                        />
                                    )}
                                </Box>

                                {/* Low stock */}
                                <Box flex="1" minWidth={220}>
                                    <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                                        <Typography variant="body2" fontWeight={700} color="text.secondary">
                                            LOW STOCK ({"<"}5)
                                        </Typography>
                                        <Chip
                                            label={inventory.lowStock.length}
                                            size="small"
                                            sx={{ backgroundColor: "#fffbeb", color: "#92400e", fontWeight: 700 }}
                                        />
                                    </Box>
                                    {inventory.lowStock.length === 0 ? (
                                        <Box p={2} sx={{ border: "1px solid #e5e7eb", borderRadius: 2, textAlign: "center" }}>
                                            <Typography variant="body2" color="text.secondary">No low-stock items</Typography>
                                        </Box>
                                    ) : (
                                        <DataTable
                                            rows={inventory.lowStock}
                                            cols={[
                                                { key: "name", label: "Item", flex: 2 },
                                                { key: "stock", label: "Remaining", flex: 1 },
                                            ]}
                                        />
                                    )}
                                </Box>
                            </Box>

                            {/* Full stock summary */}
                            <Typography variant="body2" fontWeight={700} mb={1.5} color="text.secondary">
                                STOCK USAGE SUMMARY
                            </Typography>
                            <DataTable
                                rows={inventory.stockSummary}
                                cols={[
                                    { key: "name", label: "Item", flex: 2 },
                                    { key: "category", label: "Category", flex: 1 },
                                    {
                                        key: "stock",
                                        label: "Stock",
                                        flex: 1,
                                        render: (v) => (
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Box
                                                    sx={{
                                                        width: 8, height: 8, borderRadius: "50%",
                                                        backgroundColor: v === 0 ? "#ef4444" : v < 5 ? "#f59e0b" : "#10b981",
                                                        flexShrink: 0,
                                                    }}
                                                />
                                                {v}
                                            </Box>
                                        ),
                                    },
                                ]}
                            />
                        </Section>

                        {/* ── 5. Payment Report ───────────────────────────────────────── */}
                        <Section title="5. Payment Report">
                            <Box display="flex" flexWrap="wrap" gap={2} mb={4}>
                                <StatCard label="Successful" value={payments.counts.success ?? 0} sub="payments" />
                                <StatCard label="Pending" value={payments.counts.pending ?? 0} sub="payments" />
                                <StatCard label="Failed" value={payments.counts.failed ?? 0} sub="payments" />
                                <StatCard label="Refunded" value={payments.counts.refunded ?? 0} sub="payments" />
                            </Box>

                            <Typography variant="body2" fontWeight={700} mb={1.5} color="text.secondary">
                                PAYMENT METHOD BREAKDOWN
                            </Typography>
                            {payments.gatewayBreakdown.length === 0 ? (
                                <Box p={3} sx={{ border: "1px dashed #e5e7eb", borderRadius: 2, textAlign: "center" }}>
                                    <Typography variant="body2" color="text.secondary">No payment records yet</Typography>
                                </Box>
                            ) : (
                                <DataTable
                                    rows={payments.gatewayBreakdown}
                                    cols={[
                                        { key: "name", label: "Gateway", flex: 2 },
                                        { key: "count", label: "Transactions", flex: 1 },
                                    ]}
                                />
                            )}
                        </Section>
                    </>
                )}
            </Container>
        </>
    );
}
