import { supabase } from "../supabaseClient";

// ── helpers ────────────────────────────────────────────────────────────────
const todayISO = () => new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
const monthStart = () => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
};

export const analyticsService = {
    // ── 1. Revenue Summary ───────────────────────────────────────────────────
    async getRevenueSummary() {
        const { data: orders, error } = await supabase
            .from("orders")
            .select("total, created_at");
        if (error) throw error;

        const today = todayISO();
        const mStart = monthStart();

        let todayRevenue = 0;
        let monthRevenue = 0;
        let totalRevenue = 0;
        const byDate = {}; // { "YYYY-MM-DD": amount }

        for (const o of orders) {
            const amount = o.total ?? 0;
            const dateStr = o.created_at?.slice(0, 10);
            totalRevenue += amount;
            if (dateStr === today) todayRevenue += amount;
            if (new Date(o.created_at) >= new Date(mStart)) monthRevenue += amount;
            byDate[dateStr] = (byDate[dateStr] ?? 0) + amount;
        }

        // Last 14 days for graph
        const graph = Array.from({ length: 14 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (13 - i));
            const key = d.toISOString().slice(0, 10);
            return { date: key.slice(5), revenue: byDate[key] ?? 0 }; // "MM-DD"
        });

        return { todayRevenue, monthRevenue, totalRevenue, graph };
    },

    // ── 2. Orders Summary ───────────────────────────────────────────────────
    async getOrdersSummary() {
        const { data: orders, error } = await supabase
            .from("orders")
            .select("total, created_at, customer_name");
        if (error) throw error;

        const today = todayISO();
        const mStart = monthStart();

        let todayOrders = 0;
        let monthOrders = 0;
        let totalOrderValue = 0;
        const customers = new Set();

        for (const o of orders) {
            const dateStr = o.created_at?.slice(0, 10);
            totalOrderValue += o.total ?? 0;
            customers.add(o.customer_name);
            if (dateStr === today) todayOrders++;
            if (new Date(o.created_at) >= new Date(mStart)) monthOrders++;
        }

        const avgOrderValue = orders.length
            ? Math.round(totalOrderValue / orders.length)
            : 0;

        return {
            todayOrders,
            monthOrders,
            totalCustomers: customers.size,
            avgOrderValue,
        };
    },

    // ── 3. Sales Report ──────────────────────────────────────────────────────
    async getSalesReport() {
        const { data: orders, error } = await supabase
            .from("orders")
            .select("items");
        if (error) throw error;

        const itemQty = {};    // { itemName: qty }
        const categoryQty = {}; // { category: qty }

        for (const order of orders) {
            if (!Array.isArray(order.items)) continue;
            for (const item of order.items) {
                const name = item.name ?? "Unknown";
                const qty = item.quantity ?? 1;
                const cat = item.category ?? "General";
                itemQty[name] = (itemQty[name] ?? 0) + qty;
                categoryQty[cat] = (categoryQty[cat] ?? 0) + qty;
            }
        }

        const sorted = Object.entries(itemQty).sort((a, b) => b[1] - a[1]);
        const top5 = sorted.slice(0, 5).map(([name, qty]) => ({ name, qty }));
        const leastSold = sorted.length
            ? { name: sorted[sorted.length - 1][0], qty: sorted[sorted.length - 1][1] }
            : null;
        const allItems = sorted.map(([name, qty]) => ({ name, qty }));
        const categoryBreakdown = Object.entries(categoryQty).map(([name, qty]) => ({
            name,
            qty,
        }));

        return { top5, leastSold, allItems, categoryBreakdown };
    },

    // ── 4. Inventory Insights ────────────────────────────────────────────────
    async getInventoryInsights() {
        const { data: items, error } = await supabase
            .from("menu_items")
            .select("name, stock, available, category");
        if (error) throw error;

        const outOfStock = items.filter((i) => (i.stock ?? 0) === 0 || !i.available);
        const lowStock = items.filter(
            (i) => (i.stock ?? 0) > 0 && (i.stock ?? 0) < 5 && i.available
        );
        const stockSummary = items
            .map((i) => ({ name: i.name, stock: i.stock ?? 0, category: i.category }))
            .sort((a, b) => a.stock - b.stock);

        return { outOfStock, lowStock, stockSummary };
    },

    // ── 5. Payment Report ────────────────────────────────────────────────────
    async getPaymentReport() {
        const { data: payments, error } = await supabase
            .from("payments")
            .select("status, gateway, amount");
        if (error) throw error;

        const counts = { success: 0, failed: 0, pending: 0, refunded: 0 };
        const gateways = {};

        for (const p of payments) {
            const s = p.status ?? "pending";
            counts[s] = (counts[s] ?? 0) + 1;
            const gw = p.gateway ?? "Unknown";
            gateways[gw] = (gateways[gw] ?? 0) + 1;
        }

        const gatewayBreakdown = Object.entries(gateways).map(([name, count]) => ({
            name,
            count,
        }));

        return { counts, gatewayBreakdown, total: payments.length };
    },
};
