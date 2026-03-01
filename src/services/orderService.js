import { supabase } from "../supabaseClient";
import { menuService } from "./menuService";

export const orderService = {
    async createOrder({ customerName, customerPhone, items, total }) {
        const orderId = `ORD-${Date.now()}`;

        const { data, error } = await supabase
            .from("orders")
            .insert([{
                order_id: orderId,
                customer_name: customerName,
                customer_phone: customerPhone,
                items,          // jsonb — array of { id, name, price, quantity }
                total,
                payment_status: "pending",
                qr_code: orderId, // QR encodes the order_id string
                redeemed: false,
            }])
            .select()
            .single();

        if (error) throw error;

        // Deduct stock for every item ordered
        await Promise.all(
            items.map((item) => menuService.decrementStock(item.id, item.quantity))
        );

        return data;
    },

    async getAllOrders() {
        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false });
        if (error) throw error;
        return data;
    },

    async getOrderByOrderId(orderId) {
        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .eq("order_id", orderId)
            .single();
        if (error) throw error;
        return data;
    },

    async markRedeemed(id) {
        const { data, error } = await supabase
            .from("orders")
            .update({ redeemed: true })
            .eq("id", id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async markRedeemedByOrderId(orderId) {
        const { data, error } = await supabase
            .from("orders")
            .update({ redeemed: true })
            .eq("order_id", orderId)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async updatePaymentStatus(id, status) {
        const { data, error } = await supabase
            .from("orders")
            .update({ payment_status: status })
            .eq("id", id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },
};
