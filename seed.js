/**
 * Seed script — inserts test users and menu items into Supabase.
 * Run: node seed.js
 */

const SUPABASE_URL = "https://vczbmbawqurpubaelfct.supabase.co";
const SUPABASE_KEY = "sb_publishable_PssD4N4UKZlsX5bgjxtUUw_HpdR3sFT";

const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
};

async function insert(table, rows) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: "POST",
        headers,
        body: JSON.stringify(rows),
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`${table}: ${res.status} ${text}`);
    return JSON.parse(text);
}

async function seed() {
    console.log("🌱 Seeding database…\n");

    // Users
    const users = await insert("users", [
        { username: "admin", password: "admin123", role: "admin" },
        { username: "student1", password: "pass123", role: "user" },
    ]);
    console.log("✅ Users inserted:", users.map(u => u.username).join(", "));

    // Menu items
    const menu = await insert("menu_items", [
        { name: "Veg Thali", price: 60, category: "Meals", image: "", stock: 20, available: true },
        { name: "Chicken Biryani", price: 90, category: "Meals", image: "", stock: 15, available: true },
        { name: "Masala Chai", price: 10, category: "Beverages", image: "", stock: 50, available: true },
        { name: "Cold Coffee", price: 30, category: "Beverages", image: "", stock: 0, available: false },
        { name: "Samosa", price: 15, category: "Snacks", image: "", stock: 30, available: true },
        { name: "Bread Omelette", price: 25, category: "Snacks", image: "", stock: 10, available: true },
    ]);
    console.log("✅ Menu items inserted:", menu.map(i => i.name).join(", "));

    console.log("\n🎉 Done! You can now log in:\n");
    console.log("  Admin  → username: admin    / password: admin123");
    console.log("  User   → username: student1 / password: pass123\n");
}

seed().catch(err => {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
});
