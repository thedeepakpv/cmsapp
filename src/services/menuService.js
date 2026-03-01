import { supabase } from "../supabaseClient";

export const menuService = {
    async getAll() {
        const { data, error } = await supabase
            .from("menu_items")
            .select("*")
            .order("created_at", { ascending: true });
        if (error) throw error;
        return data;
    },

    async addItem(item) {
        const { data, error } = await supabase
            .from("menu_items")
            .insert([item])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async updateItem(id, updates) {
        const { data, error } = await supabase
            .from("menu_items")
            .update(updates)
            .eq("id", id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async deleteItem(id) {
        const { error } = await supabase
            .from("menu_items")
            .delete()
            .eq("id", id);
        if (error) throw error;
    },

    // Decrement stock by qty; sets available=false when stock reaches 0
    async decrementStock(id, qty) {
        // Fetch current stock first
        const { data: current, error: fetchErr } = await supabase
            .from("menu_items")
            .select("stock")
            .eq("id", id)
            .single();
        if (fetchErr) throw fetchErr;

        const newStock = Math.max(0, (current.stock ?? 0) - qty);
        const { error } = await supabase
            .from("menu_items")
            .update({ stock: newStock, available: newStock > 0 })
            .eq("id", id);
        if (error) throw error;
    },
};
