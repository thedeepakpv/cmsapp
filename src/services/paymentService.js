import { supabase } from "../supabaseClient";

export const paymentService = {
    async recordPayment({ orderId, gateway, transactionId, amount }) {
        const { data, error } = await supabase
            .from("payments")
            .insert([{
                order_id: orderId,
                gateway,
                transaction_id: transactionId,
                amount,
                status: "success",
                paid_at: new Date().toISOString(),
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getPaymentsForOrder(orderId) {
        const { data, error } = await supabase
            .from("payments")
            .select("*")
            .eq("order_id", orderId);
        if (error) throw error;
        return data;
    },
};
