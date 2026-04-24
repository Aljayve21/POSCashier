export const businessSettings = {
    business_name: "Riead Store",
    plan: "Free plan",
};

export const cashierUser = {
    id: 2,
    name: "Juan Dela Cruz",
    role: "cashier",
};

export const dashboardSummary = {
    walletBalance: 450,
    todaySales: 12450,
    totalTransactions: 28,
    pendingUtang: 3200,
};

export const quickActions = [
    { id: 1, title: "Products", icon: "📦" },
    { id: 2, title: "Inventory", icon: "📋" },
    { id: 3, title: "Customers", icon: "👥" },
    { id: 4, title: "Utang", icon: "💳" },
    { id: 5, title: "Reports", icon: "📊" },
];

export const featuredProducts = [
    {
        id: 1,
        name: "Coca-Cola 1.5L",
        price: 75,
        stock: 18,
        image: require("../assets/products/coke.jpg"),
    },
    {
        id: 2,
        name: "Lucky Me Pancit Canton",
        price: 18,
        stock: 42,
        image: require("../assets/products/canton.jpg"),
    },
    {
        id: 3,
        name: "Bear Brand 33g",
        price: 15,
        stock: 30,
        image: require("../assets/products/bearbrand.jpg"),
    },
    {
        id: 4,
        name: "Gardenia Bread",
        price: 82,
        stock: 12,
        image: require("../assets/products/bread.jpg"),
    },
];


export const promoCards = [
    {
        id: 1,
        title: "Today Sales Overview",
        subtitle: "Track daily sales and completed transactions",
        color: "#38BDF8",
    },
    {
        id: 2,
        title: "Pending Receivables",
        subtitle: "Check unpaid utang and payment updates",
        color: "#F59E0B",
    },
];

export const customers = [
    {
        id: 1,
        name: "Maria Santos",
        phone: "09171234567",
        total_transactions: 12,
        total_utang: 1500,
    },
    {
        id: 2,
        name: "Pedro Reyes",
        phone: "09987654321",
        total_transactions: 8,
        total_utang: 2200,
    },
    {
        id: 3,
        name: "Ana Cruz",
        phone: "09171112222",
        total_transactions: 15,
        total_utang: 0,
    },
    {
        id: 4,
        name: "Juan Dela Torre",
        phone: "09225556666",
        total_transactions: 5,
        total_utang: 850,
    },
];

export const utangRecords = [
    {
        id: 1,
        customer_id: 1,
        customer_name: "Maria Santos",
        sale_id: 101,
        amount: 1500,
        is_paid: false,
        due_label: "Due Today",
        created_at: "2026-04-22",
    },
    {
        id: 2,
        customer_id: 2,
        customer_name: "Pedro Reyes",
        sale_id: 102,
        amount: 2200,
        is_paid: false,
        due_label: "Due in 3 days",
        created_at: "2026-04-21",
    },
    {
        id: 3,
        customer_id: 4,
        customer_name: "Juan Dela Torre",
        sale_id: 103,
        amount: 850,
        is_paid: false,
        due_label: "Overdue",
        created_at: "2026-04-20",
    },
];

export const transactionHistory = [
    {
        id: 1,
        customer_name: "Walk-in Customer",
        amount: 250,
        payment_method: "Cash",
        status: "Completed",
        created_at: "2026-04-23 10:15 AM",
    },
    {
        id: 2,
        customer_name: "Maria Santos",
        amount: 540,
        payment_method: "GCash",
        status: "Completed",
        created_at: "2026-04-23 11:05 AM",
    },
    {
        id: 3,
        customer_name: "Pedro Reyes",
        amount: 1200,
        payment_method: "Utang",
        status: "Pending",
        created_at: "2026-04-22 03:30 PM",
    },
    {
        id: 4,
        customer_name: "Ana Cruz",
        amount: 400,
        payment_method: "Cash",
        status: "Cancelled",
        created_at: "2026-04-22 01:20 PM",
    },
    {
        id: 5,
        customer_name: "Juan Dela Torre",
        amount: 850,
        payment_method: "GCash",
        status: "Completed",
        created_at: "2026-04-21 05:10 PM",
    },
];