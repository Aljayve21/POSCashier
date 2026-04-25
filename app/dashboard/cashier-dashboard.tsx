import { useTheme } from "@/context/ThemeContext";
import { businessSettings, cashierUser, dashboardSummary, promoCards, quickActions } from "@/data/mockData";
import { router } from "expo-router";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function CashierDashboardScreen() {
  const { theme, toggleTheme } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120 }}>

        {/* HEADER */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: theme.accent, justifyContent: "center", alignItems: "center", marginRight: 14, shadowColor: theme.accent, shadowOpacity: 0.35, shadowRadius: 10, elevation: 6 }}>
              <Text style={{ fontSize: 20 }}>🛒</Text>
            </View>
            <View>
              <Text style={{ fontSize: 18, fontWeight: "800", color: theme.textPrimary, letterSpacing: -0.3 }}>{businessSettings.business_name}</Text>
              <Text style={{ fontSize: 13, color: theme.textMuted, fontWeight: "500" }}>Cashier Workspace</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            {/* Dark Mode Toggle */}
            <TouchableOpacity
              onPress={toggleTheme}
              style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: theme.bgCard, borderWidth: 1, borderColor: theme.border, justifyContent: "center", alignItems: "center" }}
            >
              <Text style={{ fontSize: 18 }}>{theme.dark ? "☀️" : "🌙"}</Text>
            </TouchableOpacity>

            {/* Bell */}
            <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: theme.bgCard, borderWidth: 1, borderColor: theme.border, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontSize: 18 }}>🔔</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* HERO CARD */}
        <View style={{ borderRadius: 28, backgroundColor: theme.accent, padding: 22, marginBottom: 20, overflow: "hidden", shadowColor: theme.accent, shadowOpacity: 0.4, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 12 }}>
          {/* Decorative circle */}
          <View style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: 70, backgroundColor: "rgba(255,255,255,0.08)" }} />
          <View style={{ position: "absolute", bottom: -20, right: 60, width: 80, height: 80, borderRadius: 40, backgroundColor: "rgba(255,255,255,0.05)" }} />

          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
            <View style={{ width: 46, height: 46, borderRadius: 15, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center", marginRight: 12 }}>
              <Text style={{ fontSize: 22 }}>👤</Text>
            </View>
            <View>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: "600", letterSpacing: 0.5, textTransform: "uppercase" }}>Logged in as</Text>
              <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "800", letterSpacing: -0.3 }}>{cashierUser.name}</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            {[
              { label: "Today Sales", value: `₱${dashboardSummary.todaySales.toLocaleString()}` },
              { label: "Transactions", value: dashboardSummary.totalTransactions.toString() },
              { label: "Utang", value: `₱${dashboardSummary.pendingUtang.toLocaleString()}` },
            ].map((item, i) => (
              <View key={i} style={{ alignItems: i === 1 ? "center" : i === 2 ? "flex-end" : "flex-start" }}>
                <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: "600", letterSpacing: 0.3, marginBottom: 4 }}>{item.label}</Text>
                <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "800" }}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* WALLET BALANCE */}
        <View style={{ backgroundColor: theme.bgCard, borderRadius: 22, padding: 18, marginBottom: 20, borderWidth: 1, borderColor: theme.border, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Text style={{ fontSize: 13, color: theme.textMuted, fontWeight: "600", marginBottom: 4 }}>Cash Drawer</Text>
            <Text style={{ fontSize: 26, fontWeight: "800", color: theme.textPrimary, letterSpacing: -0.5 }}>₱{dashboardSummary.walletBalance}</Text>
          </View>
          <View style={{ backgroundColor: theme.accentLight, borderRadius: 16, paddingVertical: 10, paddingHorizontal: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: "700", color: theme.accent }}>Active Shift</Text>
          </View>
        </View>

        {/* QUICK ACCESS */}
        <View style={{ backgroundColor: theme.bgCard, borderRadius: 24, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: theme.border }}>
          <Text style={{ fontSize: 17, fontWeight: "800", color: theme.textPrimary, marginBottom: 18, letterSpacing: -0.3 }}>Quick Access</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
            {quickActions.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  if (item.title === "Products") router.push("/products/products");
                  else if (item.title === "Inventory") router.push("/inventory/inventory");
                  else if (item.title === "Customers") router.push("/customers/customers");
                  else if (item.title === "Utang") router.push("/payments/payment");
                  else if (item.title === "Reports") router.push("/reports/reports");
                }}
                style={{ width: "31%", alignItems: "center", marginBottom: 16 }}
              >
                <View style={{ width: 60, height: 60, borderRadius: 20, backgroundColor: theme.accentLight, justifyContent: "center", alignItems: "center", marginBottom: 8, borderWidth: 1, borderColor: theme.border }}>
                  <Text style={{ fontSize: 26 }}>{item.icon}</Text>
                </View>
                <Text style={{ fontSize: 12, color: theme.textSecondary, textAlign: "center", fontWeight: "700", letterSpacing: 0.2 }}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* UPDATES */}
        <Text style={{ fontSize: 17, fontWeight: "800", color: theme.textPrimary, marginBottom: 14, letterSpacing: -0.3 }}>Updates</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {promoCards.map((card) => (
            <View key={card.id} style={{ width: 230, borderRadius: 22, backgroundColor: card.color, padding: 18, marginRight: 14, shadowColor: card.color, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 }}>
              <View style={{ position: "absolute", top: -10, right: -10, width: 80, height: 80, borderRadius: 40, backgroundColor: "rgba(255,255,255,0.1)" }} />
              <Text style={{ fontSize: 26, marginBottom: 14 }}>📣</Text>
              <Text style={{ fontSize: 16, fontWeight: "800", color: "#FFFFFF", marginBottom: 6, letterSpacing: -0.2 }}>{card.title}</Text>
              <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", lineHeight: 18, fontWeight: "500" }}>{card.subtitle}</Text>
            </View>
          ))}
        </ScrollView>
      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={{ position: "absolute", left: 16, right: 16, bottom: 20, backgroundColor: theme.navBg, borderRadius: 28, paddingVertical: 14, paddingHorizontal: 10, flexDirection: "row", justifyContent: "space-around", alignItems: "center", shadowColor: "#000", shadowOpacity: theme.dark ? 0.5 : 0.1, shadowRadius: 20, shadowOffset: { width: 0, height: 4 }, elevation: 10, borderWidth: 1, borderColor: theme.border }}>
        {[
          { icon: "🏠", label: "Home", route: "/dashboard/cashier-dashboard", active: true },
          { icon: "🛒", label: "New Sale", route: "/sales/new-sale", active: false },
          { icon: "💵", label: "Payments", route: "/payments/payment", active: false },
          { icon: "🧾", label: "History", route: "/transactions/transactions", active: false },
          { icon: "👤", label: "Profile", route: "/profile/profile", active: false },
        ].map((nav) => (
          <TouchableOpacity key={nav.label} style={{ alignItems: "center", paddingHorizontal: 8 }} onPress={() => router.push(nav.route as any)}>
            <Text style={{ fontSize: 22, marginBottom: 4 }}>{nav.icon}</Text>
            <Text style={{ fontSize: 11, color: nav.active ? theme.accent : theme.textMuted, fontWeight: nav.active ? "700" : "500" }}>{nav.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}
